import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth";
import { supportAgentsKey } from "../ticket/queryKeys";
import type { BasicUser } from "./useUsers";

const SUPPORT_ROLE_ID = 3;

/**
 * Fetches support agents via /api/users?role=3 (SUPPORT role ID=3).
 */
export function useSupportAgents() {
  const { apiClient, authenticated } = useAuth();

  const { data, isPending, error } = useQuery({
    queryKey: supportAgentsKey(SUPPORT_ROLE_ID),
    queryFn: async () => {
      const res = await apiClient(`/api/users?role=${SUPPORT_ROLE_ID}`);
      if (!res.ok) throw new Error(`Failed to fetch support agents (${res.status})`);
      const data = await res.json();
      const list: BasicUser[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];
      return list;
    },
    enabled: authenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    agents: data ?? [],
    loading: isPending && authenticated,
    error: error?.message ?? null,
  };
}

