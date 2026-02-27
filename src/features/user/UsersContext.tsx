import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth";
import { USERS_KEY } from "../ticket/queryKeys";
import type { BasicUser } from "./useUsers";

interface UsersContextType {
  allUsers: BasicUser[];
  loading: boolean;
  error: string | null;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const { apiClient, authenticated } = useAuth();

  const { data, isPending, error } = useQuery({
    queryKey: USERS_KEY,
    queryFn: async () => {
      const res = await apiClient("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      const list: BasicUser[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];
      return list;
    },
    enabled: authenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <UsersContext.Provider value={{
      allUsers: data ?? [],
      loading: isPending && authenticated,
      error: error?.message ?? null,
    }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useAllUsers() {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error("useAllUsers must be used within UsersProvider");
  return ctx;
}
