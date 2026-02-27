import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth";
import { MY_ASSIGNED_TICKETS_KEY } from "./queryKeys";
import type { Ticket } from "./useTickets";

export function useMyAssignedTickets() {
  const { apiClient, authenticated } = useAuth();

  const { data, isPending, error } = useQuery({
    queryKey: MY_ASSIGNED_TICKETS_KEY,
    queryFn: async () => {
      const res = await apiClient("/api/tickets/assigned/me");
      if (!res.ok) throw new Error("Failed to fetch assigned tickets");
      return res.json() as Promise<Ticket[]>;
    },
    enabled: authenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return {
    tickets: data ?? [],
    loading: isPending && authenticated,
    error: error?.message ?? null,
  };
}
