import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth";
import { ticketDetailKey } from "./queryKeys";
import type { Ticket } from "./useTickets";

export interface MessageData {
  id: number;
  senderId: number;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketDetailData {
  ticket: Ticket;
  messages: MessageData[];
}

export function useTicketDetail(id: string | undefined) {
  const { apiClient } = useAuth();

  return useQuery({
    queryKey: ticketDetailKey(id ?? ""),
    queryFn: async () => {
      const res = await apiClient(`/api/tickets/${id}`);
      if (!res.ok) throw new Error("Failed to fetch ticket");
      return res.json() as Promise<TicketDetailData>;
    },
    enabled: !!id,
    staleTime: 1000 * 60, // 1 minute
  });
}
