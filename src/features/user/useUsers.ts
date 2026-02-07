import { useEffect, useState } from "react";
import { useAuth } from "../auth";

export interface BasicUser {
  id: number;
  name: string;
  roles: string[];
}

export function useUsers() {
  const { apiClient } = useAuth();
  const [users, setUsers] = useState<BasicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    apiClient("/api/users")
      .then(async (res: Response) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        if (isMounted) setUsers(data);
      })
      .catch((err: any) => {
        if (isMounted) setError(err.message || "Error fetching users");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [apiClient]);

  return { users, loading, error };
}
