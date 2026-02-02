import { useState } from 'react';
import { useAuth } from '../auth';

type PatchTicketPriorityParams = {
  ticketId: string | number;
  priorityId: number;
};

type UsePatchTicketPriorityReturn = {
  loading: boolean;
  error: string | null;
  patchPriority: (params: PatchTicketPriorityParams) => Promise<number>;
};

export const usePatchTicketPriority = (): UsePatchTicketPriorityReturn => {
  const { apiClient } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patchPriority = async ({ ticketId, priorityId }: PatchTicketPriorityParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority_id: priorityId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update ticket priority');
      }

      const data = await response.json();
      return data.priority_id || priorityId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, patchPriority };
};
