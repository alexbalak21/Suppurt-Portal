import { useState } from "react";
import { useAuth } from "../auth";

type PatchTicketStatusParams = {
  ticketId: string | number;
  statusId: number;
};

type UsePatchTicketStatusReturn = {
  loading: boolean;
  error: string | null;
  patchStatus: (params: PatchTicketStatusParams) => Promise<number>;
};

export const usePatchTicketStatus = (): UsePatchTicketStatusReturn => {
  const { apiClient } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patchStatus = async ({ ticketId, statusId }: PatchTicketStatusParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient(`/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status_id: statusId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update ticket status");
      }

      const data = await response.json();
      return data.status_id || statusId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, patchStatus };
};
