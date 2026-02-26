import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useUser } from "../user";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const { apiClient, clearAccessToken, clearRefreshToken, accessToken, refreshToken } = useAuth();
  const { setUser, setActiveRole } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {};
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
      if (refreshToken) headers["Content-Type"] = "application/json";

      await apiClient("/api/auth/logout", {
        method: "POST",
        headers: Object.keys(headers).length ? headers : undefined,
        body: refreshToken ? JSON.stringify({ refresh_token: refreshToken }) : undefined,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Logout failed";
      setError(message);
    } finally {
      // Clear all localStorage and sessionStorage for a clean logout
      try {
        // Only remove auth-related keys, preserve theme
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("activeRole");
        // Do NOT clear themeMode
        sessionStorage.clear();
        console.log('[useLogout] Cleared auth keys from localStorage and all sessionStorage');
      } catch (e) {
        console.warn('[useLogout] Failed to clear storage:', e);
      }
      clearAccessToken();
      clearRefreshToken();
      setUser(null);
      setActiveRole(null);
      setLoading(false);
      (window as any).showToast?.('Logged out successfully', 'info');
      navigate("/login");
    }
  };

  return { logout, loading, error } as const;
}
