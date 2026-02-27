import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth";
import { ticketDetailKey } from "./queryKeys";

export type PatchTicketBodyParams = {
  ticketId: string | number;
  body: string;
};

export const usePatchTicketBody = () => {
  const { apiClient } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ ticketId, body }: PatchTicketBodyParams) => {
      const response = await apiClient(`/api/tickets/${ticketId}/body`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update ticket body");
      }
      return response.json();
    },

    onSuccess: (updatedTicket, { ticketId }) => {
      // Merge the updated ticket body into the cached detail
      queryClient.setQueryData(ticketDetailKey(String(ticketId)), (old: any) =>
        old ? { ...old, ticket: updatedTicket } : old
      );
    },
  });

  return {
    loading: mutation.isPending,
    error: mutation.error?.message ?? null,
    patchBody: (params: PatchTicketBodyParams) => mutation.mutateAsync(params),
  };
};

