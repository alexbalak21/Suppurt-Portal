import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef
} from "react";
import { useNavigate } from "react-router-dom";
import type { AuthContextType } from "./auth.types";

const BASE_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [accessToken, setAccessTokenState] = useState<string | null>(() => {
    try {
      return localStorage.getItem("access_token");
    } catch {
      return null;
    }
  });

  const [refreshToken, setRefreshTokenState] = useState<string | null>(() => {
    try {
      return localStorage.getItem("refresh_token");
    } catch {
      return null;
    }
  });

  const isRefreshing = useRef(false);
  const refreshSubscribers = useRef<Array<(token: string | null) => void>>([]);

  // Sync token across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token") {
        setAccessTokenState(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setAccessToken = (token: string | null) => {
    try {
      if (token) localStorage.setItem("access_token", token);
      else localStorage.removeItem("access_token");
    } catch {
      // Ignore storage failures (private mode / quotas)
    }
    setAccessTokenState(token);
  };

  const setRefreshToken = (token: string | null) => {
    try {
      if (token) localStorage.setItem("refresh_token", token);
      else localStorage.removeItem("refresh_token");
    } catch {
      // Ignore storage failures (private mode / quotas)
    }
    setRefreshTokenState(token);
  };

  const clearAccessToken = useCallback(() => {
    localStorage.removeItem("access_token");
    setAccessTokenState(null);
  }, []);

  const clearRefreshToken = useCallback(() => {
    localStorage.removeItem("refresh_token");
    setRefreshTokenState(null);
  }, []);

  // -----------------------------
  // REFRESH TOKEN
  // -----------------------------
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    if (isRefreshing.current) {
      return new Promise(resolve => {
        refreshSubscribers.current.push(resolve);
      });
    }

    isRefreshing.current = true;

    try {
      if (!refreshToken) {
        refreshSubscribers.current.forEach(cb => cb(null));
        refreshSubscribers.current = [];
        clearAccessToken();
        clearRefreshToken();
        return null;
      }

      const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      if (!response.ok) {
        refreshSubscribers.current.forEach(cb => cb(null));
        refreshSubscribers.current = [];
        clearAccessToken();
        return null;
      }

      const data = await response.json();
      const newToken = data.data.access_token;
      const newRefreshToken = data.data.refresh_token ?? refreshToken;

      setAccessToken(newToken);
      setRefreshToken(newRefreshToken);

      refreshSubscribers.current.forEach(cb => cb(newToken));
      refreshSubscribers.current = [];

      return newToken;
    } catch {
      refreshSubscribers.current.forEach(cb => cb(null));
      refreshSubscribers.current = [];
      clearAccessToken();
      clearRefreshToken();
      // Redirect to login with session expired message
      navigate("/login?session=expired");
      return null;
    } finally {
      isRefreshing.current = false;
    }
  }, [clearAccessToken, clearRefreshToken, refreshToken]);

  // -----------------------------
  // API CLIENT
  // -----------------------------
  const apiClient = useCallback(
    async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
      const url = input.toString();
      const resolvedUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
      const publicPaths = [`${BASE_URL}/api/auth/refresh`];
      const isPublic = publicPaths.some(p => resolvedUrl === p);

      const makeRequest = async (token: string | null) => {
        const headers = new Headers(init.headers);
        if (token && !isPublic) headers.set("Authorization", `Bearer ${token}`);

        return fetch(resolvedUrl, {
          ...init,
          headers,
          credentials: "include"
        });
      };

      // First attempt
      const response = await makeRequest(accessToken);

      const expired = response.headers.get("X-Token-Expired") === "true";
      if (!expired) return response;

      // Refresh
      const newToken = await refreshAccessToken();
      if (!newToken) return response;

      // Retry once
      return makeRequest(newToken);
    },
    [accessToken, refreshAccessToken]
  );

  const value = useMemo(
    () => {
      console.log("[AuthContext] value:", {
        accessToken,
        refreshToken,
        authenticated: !!accessToken
      });
      return {
        accessToken,
        refreshToken,
        setAccessToken,
        setRefreshToken,
        clearAccessToken,
        clearRefreshToken,
        authenticated: !!accessToken,
        refreshAccessToken,
        apiClient
      };
    },
    [accessToken, refreshToken, refreshAccessToken, apiClient, clearAccessToken, clearRefreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
