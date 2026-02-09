import { useEffect, useState } from "react";
import { useAuth } from "../auth";

export interface BasicUser {
  id: number;
  name: string;
  roles: string[];
}

export function useUsers(filter?: { role?: number }) {
  const { apiClient } = useAuth();
  const [users, setUsers] = useState<BasicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    let url = "/api/users";
    if (filter?.role) {
      url += `?role=${filter.role}`;
    }

    apiClient(url)
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
  }, [apiClient, filter?.role]);

  return { users, loading, error };
}
