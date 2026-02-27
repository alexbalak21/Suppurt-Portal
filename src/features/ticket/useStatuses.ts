import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth";
import { STATUSES_KEY } from "./queryKeys";

export interface Status {
  id: number;
  name: string;
  description: string;
  color: string;
}

export function useStatuses() {
  const { apiClient } = useAuth();

  const { data, isPending, error } = useQuery({
    queryKey: STATUSES_KEY,
    queryFn: async () => {
      const res = await apiClient("/api/status");
      if (!res.ok) throw new Error("Failed to fetch statuses");
      return res.json() as Promise<Status[]>;
    },
    // Statuses never change — cache forever for the session
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    statuses: data ?? [],
    loading: isPending,
    error: error?.message ?? null,
  };
}
