/**
 * Centralised React Query key factory.
 * Import from here instead of defining keys inline to avoid typos
 * and ensure correct cache invalidation.
 */

export const PRIORITIES_KEY = ["priorities"] as const;
export const STATUSES_KEY = ["statuses"] as const;

export const TICKETS_KEY = ["tickets"] as const;
export const MY_ASSIGNED_TICKETS_KEY = ["tickets", "assigned-me"] as const;
export const ticketDetailKey = (id: string) => ["ticket", id] as const;

export const USERS_KEY = ["users"] as const;
export const supportAgentsKey = (roleId: number) => ["users", "role", roleId] as const;
