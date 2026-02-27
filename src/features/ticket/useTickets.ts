import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth";
import { TICKETS_KEY } from "./queryKeys";

export interface Ticket {
  id: number;
  title: string;
  body: string;
  priorityId: number;
  statusId: number;
  createdBy: number;
  assignedTo: number | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export function useTickets() {
  const { apiClient, authenticated } = useAuth();

  const { data, isPending, error } = useQuery({
    queryKey: TICKETS_KEY,
    queryFn: async () => {
      const res = await apiClient("/api/tickets");
      if (!res.ok) throw new Error("Failed to fetch tickets");
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
