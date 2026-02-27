import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth";
import { TICKETS_KEY, MY_ASSIGNED_TICKETS_KEY, ticketDetailKey } from "./queryKeys";
import type { Ticket } from "./useTickets";

type AssignTicketParams = {
  ticketId: string | number;
  userId: number | null;
};

export const useAssignTicket = () => {
  const { apiClient } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ ticketId, userId }: AssignTicketParams) => {
      const response = await apiClient(`/api/tickets/${ticketId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to assign ticket");
      }
    },

    onMutate: async ({ ticketId, userId }) => {
      await queryClient.cancelQueries({ queryKey: TICKETS_KEY });
      await queryClient.cancelQueries({ queryKey: MY_ASSIGNED_TICKETS_KEY });
      await queryClient.cancelQueries({ queryKey: ticketDetailKey(String(ticketId)) });

      const previousTickets = queryClient.getQueryData(TICKETS_KEY);
      const previousAssigned = queryClient.getQueryData(MY_ASSIGNED_TICKETS_KEY);
      const previousDetail = queryClient.getQueryData(ticketDetailKey(String(ticketId)));

      const patcher = (old: Ticket[] | undefined) =>
        old?.map(t => t.id === Number(ticketId) ? { ...t, assignedTo: userId } : t) ?? [];
      queryClient.setQueryData(TICKETS_KEY, patcher);
      queryClient.setQueryData(MY_ASSIGNED_TICKETS_KEY, patcher);
      queryClient.setQueryData(ticketDetailKey(String(ticketId)), (old: any) =>
        old ? { ...old, ticket: { ...old.ticket, assignedTo: userId } } : old
      );

      return { previousTickets, previousAssigned, previousDetail };
    },

    onError: (_err, { ticketId }, context) => {
      if (context?.previousTickets !== undefined)
        queryClient.setQueryData(TICKETS_KEY, context.previousTickets);
      if (context?.previousAssigned !== undefined)
        queryClient.setQueryData(MY_ASSIGNED_TICKETS_KEY, context.previousAssigned);
      if (context?.previousDetail !== undefined)
        queryClient.setQueryData(ticketDetailKey(String(ticketId)), context.previousDetail);
    },
  });

  return {
    loading: mutation.isPending,
    error: mutation.error?.message ?? null,
    assignTicket: (params: AssignTicketParams) => mutation.mutateAsync(params),
  };
};

