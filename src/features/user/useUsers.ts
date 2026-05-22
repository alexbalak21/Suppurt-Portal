import { useMemo } from "react";
import { useAllUsers } from "./UsersContext";

export interface BasicUser {
  id: number;
  name: string;
  // Backend can return either `roles: string[]` or a single `role: string`.
  roles?: string[];
  role?: string | number;
}

function extractUserList(payload: unknown): BasicUser[] {
  if (Array.isArray(payload)) return payload as BasicUser[];
  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;
  const candidates = [record.data, record.users, record.items, record.results];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as BasicUser[];
    if (candidate && typeof candidate === "object") {
      const nested = candidate as Record<string, unknown>;
      const nestedCandidates = [nested.data, nested.users, nested.items, nested.results];
      for (const nestedCandidate of nestedCandidates) {
        if (Array.isArray(nestedCandidate)) return nestedCandidate as BasicUser[];
      }
    }
  }

  return [];
}

const ROLE_MAP: Record<number, string> = {
  1: "USER",
  2: "MANAGER",
  3: "SUPPORT",
  4: "ADMIN",
};

export function useUsers(filter?: { role?: number }) {
  const { allUsers, loading, error } = useAllUsers();

  const users = useMemo(() => {
    if (!filter?.role) return allUsers;
    const roleName = ROLE_MAP[filter.role];
    if (!roleName) return allUsers;

    return (allUsers || []).filter((u) => {
      // Normalize roles: prefer `roles` array, fall back to single `role` string
      const rolesArr: string[] = Array.isArray(u.roles)
        ? u.roles
        : typeof u.role === "string"
        ? [u.role]
        : [];
      return rolesArr.includes(roleName);
    });
  }, [allUsers, filter?.role]);

  return { users, loading, error };
}

export { extractUserList };
