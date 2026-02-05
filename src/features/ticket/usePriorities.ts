import { useEffect, useState } from "react";
import { useAuth } from "../auth";

export interface Priority {
  id: number;
  name: string;
  level: number;
  description: string;
  color: string;
}

export function usePriorities() {
  const { apiClient } = useAuth();
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiClient("/api/priorities")
      .then(async (res: Response) => {
        if (!res.ok) throw new Error("Failed to fetch priorities");
        const data = await res.json();
        if (isMounted) setPriorities(data);
      })
      .catch((err: any) => {
        if (isMounted) setError(err.message || "Error fetching priorities");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [apiClient]);

  return { priorities, loading, error };
}
