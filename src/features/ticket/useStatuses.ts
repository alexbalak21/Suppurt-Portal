import { useEffect, useState } from "react";
import { useAuth } from "../auth";

export interface Status {
  id: number;
  name: string;
  description: string;
  color: string;
}

export function useStatuses() {
  const { apiClient } = useAuth();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiClient("/api/status")
      .then(async (res: Response) => {
        if (!res.ok) throw new Error("Failed to fetch statuses");
        const data = await res.json();
        if (isMounted) setStatuses(data);
      })
      .catch((err: any) => {
        if (isMounted) setError(err.message || "Error fetching statuses");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [apiClient]);

  return { statuses, loading, error };
}
