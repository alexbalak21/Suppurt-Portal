import { useEffect, useState } from "react";
import { useAuth } from "../auth";

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
  const { apiClient } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiClient("/api/tickets")
      .then(async (res: Response) => {
        if (!res.ok) throw new Error("Failed to fetch tickets");
        const data = await res.json();
        if (isMounted) setTickets(data);
      })
      .catch((err: any) => {
        if (isMounted) setError(err.message || "Error fetching tickets");
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
