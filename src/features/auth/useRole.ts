
import { useUser } from "../user/UserContext";
import type { Role } from "../user/user.types";

export function useRole() {
  const { user, activeRole, setActiveRole } = useUser();

  const hasRole = (role: Role) => {
    return user?.roles?.includes(role);
  };

  const isActiveRole = (role: Role) => {
    return activeRole === role;
  };

  return {
    activeRole,
    setActiveRole,
    hasRole,
    isActiveRole,
    isUser: activeRole === "USER",
    isAgent: activeRole === "AGENT",
    isAdmin: activeRole === "ADMIN",
    isVisitor: activeRole === "VISITOR" || !activeRole,
  };
}