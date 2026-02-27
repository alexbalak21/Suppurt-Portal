import { useEffect, useState } from "react";
import { useAuth } from "../auth";
import type { BasicUser } from "./useUsers";

/**
 * Fetches support agents via /api/admin/users?role=3 (SUPPORT role ID=3).
 * Uses the admin-scoped endpoint which accepts a numeric role ID.
 */
export function useSupportAgents() {
  const { apiClient, authenticated } = useAuth();
  const [agents, setAgents] = useState<BasicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authenticated) {
      setAgents([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    apiClient("/api/users?role=3")
      .then(async (res: Response) => {
        if (!res.ok) throw new Error(`Failed to fetch support agents (${res.status})`);
        const data = await res.json();
        // Handle both plain array and wrapped { data: [...] } response formats
        const list: BasicUser[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];
        if (isMounted) setAgents(list);
      })
      .catch((err: any) => {
        if (isMounted) setError(err.message || "Error fetching support agents");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [authenticated, apiClient]);

  return { agents, loading, error };
}
