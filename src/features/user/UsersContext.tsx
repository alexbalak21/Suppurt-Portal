import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth";
import type { BasicUser } from "./useUsers";

interface UsersContextType {
  allUsers: BasicUser[];
  loading: boolean;
  error: string | null;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const { apiClient, authenticated } = useAuth();
  const [allUsers, setAllUsers] = useState<BasicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authenticated) {
      setAllUsers([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    apiClient("/api/users")
      .then(async (res: Response) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        if (isMounted) setAllUsers(data);
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
  }, [authenticated, apiClient]);

  return (
    <UsersContext.Provider value={{ allUsers, loading, error }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useAllUsers() {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error("useAllUsers must be used within UsersProvider");
  return ctx;
}
