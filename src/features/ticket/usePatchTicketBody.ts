import { useState } from 'react';
import { useAuth } from '../auth';

export type PatchTicketBodyParams = {
  ticketId: string | number;
  body: string;
};

export type UsePatchTicketBodyReturn = {
  loading: boolean;
  error: string | null;
  patchBody: (params: PatchTicketBodyParams) => Promise<any>; // returns updated ticket
};

export const usePatchTicketBody = (): UsePatchTicketBodyReturn => {
  const { apiClient } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patchBody = async ({ ticketId, body }: PatchTicketBodyParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/tickets/${ticketId}/body`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update ticket body');
      }
      const updatedTicket = await response.json();
      return updatedTicket;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, patchBody };
};
