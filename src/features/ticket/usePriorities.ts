import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth";
import { PRIORITIES_KEY } from "./queryKeys";

export interface Priority {
  id: number;
  name: string;
  level: number;
  description: string;
  color: string;
}

export function usePriorities() {
  const { apiClient } = useAuth();

  const { data, isPending, error } = useQuery({
    queryKey: PRIORITIES_KEY,
    queryFn: async () => {
      const res = await apiClient("/api/priorities");
      if (!res.ok) throw new Error("Failed to fetch priorities");
      return res.json() as Promise<Priority[]>;
    },
    // Priorities never change — cache forever for the session
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    priorities: data ?? [],
    loading: isPending,
    error: error?.message ?? null,
  };
}
