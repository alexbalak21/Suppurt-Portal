import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth";
import { TICKETS_KEY, MY_ASSIGNED_TICKETS_KEY, ticketDetailKey } from "./queryKeys";
import type { Ticket } from "./useTickets";

type PatchTicketStatusParams = {
  ticketId: string | number;
  statusId: number;
};

export const usePatchTicketStatus = () => {
  const { apiClient } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ ticketId, statusId }: PatchTicketStatusParams) => {
      const response = await apiClient(`/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_id: statusId }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update ticket status");
      }
      return response.json();
    },

    onMutate: async ({ ticketId, statusId }) => {
      // Cancel in-flight refetches so they don't overwrite the optimistic update
      await queryClient.cancelQueries({ queryKey: TICKETS_KEY });
      await queryClient.cancelQueries({ queryKey: MY_ASSIGNED_TICKETS_KEY });
      await queryClient.cancelQueries({ queryKey: ticketDetailKey(String(ticketId)) });

      const previousTickets = queryClient.getQueryData(TICKETS_KEY);
      const previousAssigned = queryClient.getQueryData(MY_ASSIGNED_TICKETS_KEY);
      const previousDetail = queryClient.getQueryData(ticketDetailKey(String(ticketId)));

      // Optimistically update ticket lists
      const patcher = (old: Ticket[] | undefined) =>
        old?.map(t => t.id === Number(ticketId) ? { ...t, statusId } : t) ?? [];
      queryClient.setQueryData(TICKETS_KEY, patcher);
      queryClient.setQueryData(MY_ASSIGNED_TICKETS_KEY, patcher);

      // Optimistically update ticket detail
      queryClient.setQueryData(ticketDetailKey(String(ticketId)), (old: any) =>
        old ? { ...old, ticket: { ...old.ticket, statusId } } : old
      );

      return { previousTickets, previousAssigned, previousDetail };
    },

    onError: (_err, { ticketId }, context) => {
      // Roll back on failure
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
    patchStatus: (params: PatchTicketStatusParams) => mutation.mutateAsync(params),
  };
};

