import { useEffect, useState } from "react";
import { useAuth } from "../auth";
import type { Ticket } from "./useTickets";

export function useMyAssignedTickets() {
  const { apiClient } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiClient("/api/tickets/assigned/me")
      .then(async (res: Response) => {
        if (!res.ok) throw new Error("Failed to fetch assigned tickets");
        const data = await res.json();
        if (isMounted) setTickets(data);
      })
      .catch((err: any) => {
        if (isMounted) setError(err.message || "Error fetching assigned tickets");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [apiClient]);

  return { tickets, loading, error };
}
