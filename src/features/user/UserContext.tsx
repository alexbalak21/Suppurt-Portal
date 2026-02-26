import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "../auth";
import type { UserInfo, UserContextType, Role } from "./user.types";
import { USER_ENDPOINTS } from "./user.endpoints";

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
  console.log("[UserContext] normalizeUserData input:", data);
  console.log("[UserContext] normalizeUserData output roles:", roles);
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
  console.log('[UserProvider] RENDER user:', user, 'activeRole:', activeRole);
  const { apiClient, authenticated } = useAuth();

  // Prevent React Strict Mode from running the effect twice
  const didRun = useRef(false);
  const prevApiClientRef = useRef<typeof apiClient | null>(null);

  // Load activeRole from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem("activeRole");
    if (storedRole) {
      console.log('[UserProvider] Loaded activeRole from localStorage:', storedRole);
      setActiveRoleState(storedRole);
    }
  }, []);

  // Save activeRole to localStorage when it changes
  useEffect(() => {
    if (activeRole) {
      console.log('[UserProvider] Saving activeRole to localStorage:', activeRole);
      localStorage.setItem("activeRole", activeRole);
    }
  }, [activeRole]);

  useEffect(() => {
    if (!authenticated) {
      console.log('[UserProvider] Not authenticated, clearing user and activeRole');
      setUser(null);
      setActiveRoleState(null);
      localStorage.removeItem("activeRole"); // Remove from storage on logout
      didRun.current = false; // Reset the ref when logging out
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
        console.log("[UserContext] /auth/me response:", response);

        if (response.ok) {
          const userData = await response.json();
          console.log("[UserContext] /auth/me userData:", userData);
          const normalized = normalizeUserData(userData);
          setUser(normalized);
          // If activeRole is not in user's roles, set to first role
          setActiveRoleState((prev) => {
            if (prev && normalized.roles.includes(prev)) {
              console.log('[UserProvider] activeRole remains:', prev);
              return prev;
            }
            console.log('[UserProvider] Setting activeRole to first user role:', normalized.roles[0]);
            return normalized.roles[0] || null;
          });
        } else {
          setUser(null);
          setActiveRoleState(null);
        }
      } catch (err) {
        console.log("[UserContext] fetchUser error:", err);
        setUser(null);
        setActiveRoleState(null);
      }
    };

    fetchUser();
  }, [authenticated, apiClient]);

  const setActiveRole = (role: Role | null) => {
    console.log('[UserProvider] setActiveRole called with:', role);
    if (role && user && user.roles.includes(role)) {
      setActiveRoleState(role);
      localStorage.setItem("activeRole", role);
      console.log('[UserProvider] setActiveRole updated state and localStorage:', role);
    } else if (role === null) {
      setActiveRoleState(null);
      localStorage.removeItem("activeRole");
      console.log('[UserProvider] setActiveRole cleared state and localStorage');
    } else {
      console.log('[UserProvider] setActiveRole: user does not have role', role, user?.roles);
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
