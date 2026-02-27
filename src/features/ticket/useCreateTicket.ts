import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth";
import { TICKETS_KEY } from "./queryKeys";

interface CreateTicketPayload {
  title: string;
  body: string;
  priorityId: number;
}

export function useCreateTicket() {
  const { apiClient } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateTicketPayload) => {
      const res = await apiClient("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let message = "Failed to create ticket";
        try {
          const errBody = await res.json();
          message = errBody?.message ?? message;
        } catch {}
        throw new Error(message);
      }
      return res.json();
    },

    onSuccess: () => {
      // Invalidate the ticket list cache so the new ticket appears immediately
      queryClient.invalidateQueries({ queryKey: TICKETS_KEY });
    },
  });

  return {
    createTicket: (payload: CreateTicketPayload) => mutation.mutateAsync(payload),
    loading: mutation.isPending,
    error: mutation.error?.message ?? null,
    success: mutation.isSuccess,
  };
}

