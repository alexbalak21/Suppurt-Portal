import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "../auth";
import type { UserInfo, UserContextType } from "./user.types";

type RawUser = {
  id: number;
  name: string;
  email: string;
  roles?: string[];
  role?: string;
  createdAt: string;
  updatedAt: string;
  profileImage?: string | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Normalize backend response to match UserInfo interface.
 * Converts `role` (string) to `roles` (array) if needed.
 */
function normalizeUserData(data: RawUser): UserInfo {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    roles: Array.isArray(data.roles) ? data.roles : (data.role ? [data.role] : []),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    profileImage: data.profileImage ?? null,
  };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const { apiClient, authenticated } = useAuth();

  // Prevent React Strict Mode from running the effect twice
  const didRun = useRef(false);

  useEffect(() => {
    if (!authenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(null);
      didRun.current = false; // Reset the ref when logging out
      return;
    }

    if (didRun.current) return;
    didRun.current = true;

    const fetchUser = async () => {
      try {
        const response = await apiClient("/api/user");

        if (response.ok) {
          const userData = await response.json();
          setUser(normalizeUserData(userData));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, [authenticated, apiClient]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
