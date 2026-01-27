import { useAuth } from "./AuthContext";
import type { Role } from "../user/user.types";

export function useRole() {
  const { user } = useAuth();

  const hasRole = (role: Role) => user?.roles?.includes(role);

  return {
    isUser: hasRole("USER"),
    isAgent: hasRole("AGENT"),
    isAdmin: hasRole("ADMIN"),
    isVisitor: !user || user.roles?.includes("VISITOR"),
    hasRole,
  };
}