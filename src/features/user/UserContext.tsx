import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "../auth";
import type { UserInfo, UserContextType, Role } from "./user.types";
import { USER_ENDPOINTS } from "./user.endpoints";
import { debug, debugWarn } from "@/shared/lib/debug";

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
  const roles = Array.isArray(data.roles) ? data.roles : (data.role ? [data.role] : []);
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    roles,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    profileImage: data.profileImage ?? null,
  };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [activeRole, setActiveRoleState] = useState<Role | null>(null);
  const { apiClient, authenticated } = useAuth();

  // Prevent React Strict Mode from running the effect twice
  const didRun = useRef(false);
  const prevApiClientRef = useRef<typeof apiClient | null>(null);

  // Load activeRole from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem("activeRole");
    if (storedRole) {
      debug('[UserProvider] Loaded activeRole from localStorage:', storedRole);
      setActiveRoleState(storedRole);
    }
  }, []);

  // Save activeRole to localStorage when it changes
  useEffect(() => {
    if (activeRole) {
      debug('[UserProvider] Saving activeRole to localStorage:', activeRole);
      localStorage.setItem("activeRole", activeRole);
    }
  }, [activeRole]);

  useEffect(() => {
    if (!authenticated) {
      debug('[UserProvider] Not authenticated, clearing user and activeRole');
      setUser(null);
      setActiveRoleState(null);
      localStorage.removeItem("activeRole");
      didRun.current = false;
      return;
    }

    // Reset didRun if apiClient changed (new login/token) so we re-fetch user data
    if (prevApiClientRef.current !== apiClient) {
      didRun.current = false;
      prevApiClientRef.current = apiClient;
    }

    if (didRun.current) return;
    didRun.current = true;

    const fetchUser = async () => {
      try {
        const response = await apiClient(USER_ENDPOINTS.me);
          debug('[UserContext] /auth/me response status:', response.status);

        if (response.ok) {
          const userData = await response.json();
          debug('[UserContext] /auth/me userdata received');
          const normalized = normalizeUserData(userData);
          setUser(normalized);
          setActiveRoleState((prev) => {
            if (prev && normalized.roles.includes(prev)) {
              debug('[UserProvider] activeRole remains:', prev);
              return prev;
            }
            debug('[UserProvider] Setting activeRole to first user role:', normalized.roles[0]);
            return normalized.roles[0] || null;
          });
        } else {
          setUser(null);
          setActiveRoleState(null);
        }
      } catch (err) {
        debugWarn('[UserContext] fetchUser error:', err);
        setUser(null);
        setActiveRoleState(null);
      }
    };

    fetchUser();
  }, [authenticated, apiClient]);

  const setActiveRole = (role: Role | null) => {
    debug('[UserProvider] setActiveRole called with:', role);
    if (role && user && user.roles.includes(role)) {
      setActiveRoleState(role);
      localStorage.setItem("activeRole", role);
    } else if (role === null) {
      setActiveRoleState(null);
      localStorage.removeItem("activeRole");
    } else {
      debugWarn('[UserProvider] setActiveRole: user does not have role', role, user?.roles);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, activeRole, setActiveRole }}>
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
