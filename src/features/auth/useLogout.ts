import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import { useUser } from "../user";
import { useNavigate } from "react-router-dom";
import { debug, debugWarn } from "@/shared/lib/debug";

export function useLogout() {
  const { apiClient, clearAccessToken, clearRefreshToken, accessToken, refreshToken } = useAuth();
  const { setUser, setActiveRole } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("activeRole");
        sessionStorage.clear();
        debug('[useLogout] Cleared auth keys from localStorage and all sessionStorage');
      } catch (e) {
        debugWarn('[useLogout] Failed to clear storage:', e);
      }
      // Clear all React Query cached data so no stale user data persists
      queryClient.clear();
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
