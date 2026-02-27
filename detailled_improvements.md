# Detailed Improvements — Issue Tracker Frontend

> Audit date: February 2026  
> Stack: React 19, Vite, TypeScript, Axios (partially), native `fetch`, react-router-dom v7, Tailwind CSS v4  
> **No caching library installed** — all data fetching is raw `useEffect + useState` patterns.

---

## Table of Contents

1. [Critical: Duplicate Requests for Static Data](#1-critical-duplicate-requests-for-static-data)
2. [Critical: No In-Memory or Persistent Cache](#2-critical-no-in-memory-or-persistent-cache)
3. [Install TanStack Query (React Query) — Recommended Foundation](#3-install-tanstack-query--the-recommended-foundation)
4. [Short-Term Fix Without React Query — Lift Static Data to Context](#4-short-term-fix-without-react-query--lift-static-data-to-context)
5. [Persist Static Data to localStorage / sessionStorage](#5-persist-static-data-to-localstorage--sessionstorage)
6. [Optimistic Updates for PATCH Mutations](#6-optimistic-updates-for-patch-mutations)
7. [Parallel Fetching on Page Load](#7-parallel-fetching-on-page-load)
8. [Request Deduplication via Shared Promise Cache](#8-request-deduplication-via-shared-promise-cache)
9. [Stale-While-Revalidate for Ticket Lists](#9-stale-while-revalidate-for-ticket-lists)
10. [Add AbortController to Every Fetch](#10-add-abortcontroller-to-every-fetch)
11. [Remove All console.log from Production](#11-remove-all-consolelog-from-production)
12. [Route-Level Code Splitting (Lazy Loading)](#12-route-level-code-splitting-lazy-loading)
13. [Debounce the Search / Filter Inputs](#13-debounce-the-search--filter-inputs)
14. [Axios Instance — Centralise Token Logic](#14-axios-instance--centralise-token-logic)
15. [HTTP Cache-Control Headers (Backend Cooperation)](#15-http-cache-control-headers-backend-cooperation)
16. [Retry Logic for failed requests](#16-retry-logic-for-failed-requests)
17. [Overall Architecture Summary](#17-overall-architecture-summary)

---

## 1. Critical: Duplicate Requests for Static Data

### Problem

`usePriorities` and `useStatuses` are **plain `useEffect` hooks** — every component that calls them fires a brand-new fetch. Right now the following pages all call both hooks independently:

| Page / Component           | `usePriorities` | `useStatuses` |
|----------------------------|-----------------|---------------|
| `TicketListPage`           | ✅               | ✅             |
| `TicketDetailsPage`        | ✅               | ✅             |
| `ManagerDashboard`         | ✅               | ✅             |
| `CreateTicketPage`         | ✅               | ❌             |

Every navigation renders these hooks fresh, sending **4–6 duplicate requests** for data that never changes between sessions.

### Impact
Each request hits a slow backend. If the page needs 6 requests to render, and each takes 300 ms, the user waits **~1–2 seconds** just for static lookup data that could have been fetched once at login.

---

## 2. Critical: No In-Memory or Persistent Cache

### Problem

The current `apiClient.ts` is a **thin fetch wrapper** with zero caching:

```ts
// src/shared/lib/apiClient.ts  — current state
get: (url: string) =>
  fetch(buildUrl(url), { credentials: "include" }),
```

Every call goes straight to the network. There is no:
- In-memory deduplication (same URL called twice = two requests)
- `staleTime` / `cacheTime` concept
- Background revalidation
- localStorage persistence across hard refresh

### Impact
Navigating away from `/ticket-list` and back triggers **full re-fetches** of tickets, priorities, and statuses every single time.

---

## 3. Install TanStack Query — The Recommended Foundation

This is the single highest-ROI change. It solves problems 1 and 2 automatically and provides a solid base for all other improvements.

### Installation

```bash
npm install @tanstack/react-query
# optional devtools
npm install -D @tanstack/react-query-devtools
```

### Wire it into Providers.tsx

```tsx
// src/app/Providers.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 minutes — data is "fresh" for 5 min
      gcTime: 1000 * 60 * 30,     // 30 minutes — keep in memory after unmount
      retry: 2,                   // retry failed requests twice
      refetchOnWindowFocus: false, // avoids surprise re-fetches on tab switch
    },
  },
});

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <UserProvider>
            <UsersProvider>
              {children}
            </UsersProvider>
          </UserProvider>
        </AuthProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Rewrite usePriorities with React Query

```ts
// src/features/ticket/usePriorities.ts
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth";

export const PRIORITIES_QUERY_KEY = ["priorities"] as const;

export function usePriorities() {
  const { apiClient } = useAuth();

  return useQuery({
    queryKey: PRIORITIES_QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient("/api/priorities");
      if (!res.ok) throw new Error("Failed to fetch priorities");
      return res.json() as Promise<Priority[]>;
    },
    staleTime: Infinity,   // priorities NEVER change — never re-fetch
    gcTime: Infinity,
  });
}
```

**Result:** No matter how many components call `usePriorities()`, only **one request** is ever fired per session. All subsequent callers get the cached result instantly.

### Rewrite useStatuses with React Query

```ts
// src/features/ticket/useStatuses.ts
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth";

export const STATUSES_QUERY_KEY = ["statuses"] as const;

export function useStatuses() {
  const { apiClient } = useAuth();

  return useQuery({
    queryKey: STATUSES_QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient("/api/status");
      if (!res.ok) throw new Error("Failed to fetch statuses");
      return res.json() as Promise<Status[]>;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
```

### Rewrite useTickets with React Query

```ts
// src/features/ticket/useTickets.ts
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth";

export const TICKETS_QUERY_KEY = ["tickets"] as const;

export function useTickets() {
  const { apiClient } = useAuth();

  return useQuery({
    queryKey: TICKETS_QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient("/api/tickets");
      if (!res.ok) throw new Error("Failed to fetch tickets");
      return res.json() as Promise<Ticket[]>;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
```

### Rewrite mutation hooks (patchStatus, patchPriority) with useMutation

```ts
// src/features/ticket/usePatchTicketStatus.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth";
import { TICKETS_QUERY_KEY } from "./useTickets";

export function usePatchTicketStatus() {
  const { apiClient } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, statusId }: { ticketId: string | number; statusId: number }) => {
      const res = await apiClient(`/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_id: statusId }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: (_data, { ticketId, statusId }) => {
      // Optimistically update the cached ticket list
      queryClient.setQueryData(TICKETS_QUERY_KEY, (old: Ticket[] | undefined) =>
        old?.map(t => t.id === Number(ticketId) ? { ...t, statusId } : t) ?? []
      );
    },
  });
}
```

---

## 4. Short-Term Fix Without React Query — Lift Static Data to Context

If you cannot install React Query right now, the cheapest fix is to move `usePriorities` and `useStatuses` into module-level singletons or app-level providers so they are only fetched once.

### Create a StaticDataContext

```tsx
// src/features/staticData/StaticDataContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth";

interface StaticData {
  priorities: Priority[];
  statuses: Status[];
  loading: boolean;
}

const StaticDataContext = createContext<StaticData>({
  priorities: [],
  statuses: [],
  loading: true,
});

export function StaticDataProvider({ children }: { children: React.ReactNode }) {
  const { apiClient, authenticated } = useAuth();
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authenticated) return;
    // Fetch both in parallel — only once per session
    Promise.all([
      apiClient("/api/priorities").then(r => r.json()),
      apiClient("/api/status").then(r => r.json()),
    ]).then(([p, s]) => {
      setPriorities(p);
      setStatuses(s);
    }).finally(() => setLoading(false));
  }, [authenticated, apiClient]);

  return (
    <StaticDataContext.Provider value={{ priorities, statuses, loading }}>
      {children}
    </StaticDataContext.Provider>
  );
}

export const useStaticData = () => useContext(StaticDataContext);
```

Add `<StaticDataProvider>` in `Providers.tsx` and replace all `usePriorities()` / `useStatuses()` calls with `const { priorities, statuses } = useStaticData()`.

**Result:** From 6 requests down to **1 batched request** per session.

---

## 5. Persist Static Data to localStorage / sessionStorage

Even after fixing deduplication, a user doing a hard refresh still waits. Persist priorities and statuses so they load **instantly** on the next visit.

```ts
// src/shared/lib/persistedCache.ts

const CACHE_VERSION = "v1";

export function getCached<T>(key: string, maxAgeMs: number): T | null {
  try {
    const raw = localStorage.getItem(`cache:${key}`);
    if (!raw) return null;
    const { data, ts, version } = JSON.parse(raw);
    if (version !== CACHE_VERSION) return null;
    if (Date.now() - ts > maxAgeMs) return null;
    return data as T;
  } catch {
    return null;
  }
}

export function setCached<T>(key: string, data: T): void {
  try {
    localStorage.setItem(
      `cache:${key}`,
      JSON.stringify({ data, ts: Date.now(), version: CACHE_VERSION })
    );
  } catch {
    // Storage full or unavailable — silently skip
  }
}
```

Usage in `usePriorities`:

```ts
export function usePriorities() {
  const { apiClient } = useAuth();
  const CACHE_KEY = "priorities";
  const MAX_AGE = 1000 * 60 * 60 * 24; // 24 hours

  const [priorities, setPriorities] = useState<Priority[]>(
    () => getCached<Priority[]>(CACHE_KEY, MAX_AGE) ?? []
  );
  const [loading, setLoading] = useState(priorities.length === 0);

  useEffect(() => {
    const cached = getCached<Priority[]>(CACHE_KEY, MAX_AGE);
    if (cached) {
      setPriorities(cached);
      setLoading(false);
      return; // skip the network request entirely
    }
    // Only hit the network if cache is stale/empty
    apiClient("/api/priorities").then(async r => {
      const data = await r.json();
      setCached(CACHE_KEY, data);
      setPriorities(data);
      setLoading(false);
    });
  }, [apiClient]);

  return { priorities, loading };
}
```

**Result:** After first login, priorities and statuses load in **0 ms** — no spinner, no flash.

### When to invalidate the localStorage cache

- On logout: call `localStorage.removeItem("cache:priorities")` etc.
- Keep a `CACHE_VERSION` constant — bump it to `"v2"` when the data shape changes.
- Set `MAX_AGE` to 24 h for static data, 2 min for ticket lists.

---

## 6. Optimistic Updates for PATCH Mutations

Currently, patching a ticket status or priority:
1. Sends the request
2. Waits for response
3. Then updates local state

The UI feels sluggish. Instead, update local state **immediately** and roll back on failure.

### With React Query (useMutation + onMutate)

```ts
export function usePatchTicketStatus() {
  const queryClient = useQueryClient();
  const { apiClient } = useAuth();

  return useMutation({
    mutationFn: ({ ticketId, statusId }) =>
      apiClient(`/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_id: statusId }),
      }).then(r => { if (!r.ok) throw new Error(); return r.json(); }),

    onMutate: async ({ ticketId, statusId }) => {
      // Cancel in-flight refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: TICKETS_QUERY_KEY });
      const previous = queryClient.getQueryData(TICKETS_QUERY_KEY);

      // Immediately update the UI
      queryClient.setQueryData(TICKETS_QUERY_KEY, (old: Ticket[]) =>
        old.map(t => t.id === Number(ticketId) ? { ...t, statusId } : t)
      );
      return { previous }; // snapshot for rollback
    },

    onError: (_err, _vars, context) => {
      // Roll back on failure
      queryClient.setQueryData(TICKETS_QUERY_KEY, context?.previous);
    },
  });
}
```

**Result:** Status changes feel **instant** to the user. Network errors silently roll back.

---

## 7. Parallel Fetching on Page Load

`TicketDetailsPage` currently fetches the ticket body, then separately waits for `usePriorities` and `useStatuses` to finish (they fire in parallel via React's rendering, but they are not coordinated). 

The ticket detail, priorities, and statuses should all be kicked off at the same time. With React Query this happens automatically. Without it:

```ts
// Fetch everything at once in one useEffect
useEffect(() => {
  Promise.all([
    apiClient(`/api/tickets/${id}`).then(r => r.json()),
    apiClient("/api/priorities").then(r => r.json()),
    apiClient("/api/status").then(r => r.json()),
  ]).then(([ticketData, prioritiesData, statusesData]) => {
    setTicket(ticketData.ticket);
    setMessages(ticketData.messages ?? []);
    setPriorities(prioritiesData);
    setStatuses(statusesData);
    setLoading(false);
  });
}, [id]);
```

This reduces the **critical path** for TicketDetailsPage from 3 sequential steps to 1.

---

## 8. Request Deduplication via Shared Promise Cache

Even without React Query, you can prevent the "two components call the same endpoint simultaneously" problem with a simple in-flight promise cache:

```ts
// src/shared/lib/requestCache.ts

const inFlight = new Map<string, Promise<unknown>>();

export function dedupedFetch<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  if (inFlight.has(key)) return inFlight.get(key) as Promise<T>;
  const promise = fetcher().finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}
```

Usage:

```ts
// In usePriorities
const data = await dedupedFetch("priorities", () =>
  apiClient("/api/priorities").then(r => r.json())
);
```

If 5 components call `usePriorities` in the same render cycle, only **1 HTTP request** goes out. The rest resolve from the same in-flight Promise.

---

## 9. Stale-While-Revalidate for Ticket Lists

Ticket lists can go stale, but you still want them to load instantly. The SWR pattern:
1. Return stale data from cache **immediately** (no spinner)
2. Refetch in the background
3. Update the UI silently when fresh data arrives

This is automatic with React Query's `staleTime`. Without it:

```ts
export function useTickets() {
  const { apiClient } = useAuth();
  const CACHE_KEY = "tickets";
  const MAX_AGE = 1000 * 60 * 2; // 2 minutes

  const [tickets, setTickets] = useState<Ticket[]>(
    () => getCached<Ticket[]>(CACHE_KEY, MAX_AGE) ?? []
  );
  const [loading, setLoading] = useState(tickets.length === 0);

  useEffect(() => {
    // Show stale data immediately, then refresh in background
    const cached = getCached<Ticket[]>(CACHE_KEY, MAX_AGE);
    if (cached) setTickets(cached); // instant paint

    // Always re-validate from server
    apiClient("/api/tickets")
      .then(r => r.json())
      .then(data => {
        setCached(CACHE_KEY, data);
        setTickets(data);
        setLoading(false);
      });
  }, [apiClient]);

  return { tickets, loading };
}
```

**Result:** Users see the ticket list **instantly** on revisit. The list quietly updates if anything changed.

---

## 10. Add AbortController to Every Fetch

The current hooks use an `isMounted` boolean to avoid state updates after unmount, but the HTTP request **still runs to completion** in the background, wasting bandwidth and backend load.

Replace with proper AbortController:

```ts
useEffect(() => {
  const controller = new AbortController();

  apiClient("/api/tickets", { signal: controller.signal })
    .then(r => r.json())
    .then(data => setTickets(data))
    .catch(err => {
      if (err.name !== "AbortError") setError(err.message);
    });

  return () => controller.abort(); // instantly cancels the in-flight HTTP request
}, [apiClient]);
```

Update `apiClient.ts` to forward the `signal`:

```ts
get: (url: string, signal?: AbortSignal) =>
  fetch(buildUrl(url), { credentials: "include", signal }),
```

**Result:** Navigating away from a page instantly cancels pending requests — no wasted bandwidth.

---

## 11. Remove All console.log from Production

The codebase has numerous `console.log` and `console.debug` calls that leak internal state in production:

- `UserContext.tsx` — 5+ log statements including full user objects and tokens
- `ManagerDashboard.tsx` — logs user list on mount
- `AuthContext.tsx` — logs every token refresh

### Fix: Use a Debug Utility

```ts
// src/shared/lib/debug.ts
export const debug = import.meta.env.DEV
  ? console.log.bind(console)
  : () => {};
```

Replace `console.log(...)` with `debug(...)`. The bundler tree-shakes the empty function in production.

### Alternatively, use Vite's `define`

In `vite.config.ts`:

```ts
// vite.config.ts
export default defineConfig({
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),
  },
});
```

---

## 12. Route-Level Code Splitting (Lazy Loading)

Currently all pages are eagerly imported in `routes.tsx`. The entire app JS bundle is downloaded even if the user only visits `/login`.

```tsx
// src/app/routes.tsx — current (eager)
import ManagerDashboard from "../pages/Manager/ManagerDashboard";
import SupportDashboard from "../pages/Support/SupportDashboard";

// AFTER — lazy loaded
import { lazy, Suspense } from "react";
const ManagerDashboard = lazy(() => import("../pages/Manager/ManagerDashboard"));
const SupportDashboard = lazy(() => import("../pages/Support/SupportDashboard"));

// Wrap routes
<Suspense fallback={<Spinner size="md" color="primary" />}>
  <AppRoutes />
</Suspense>
```

**Result:** The manager dashboard code is only downloaded **when a manager logs in**. Users get a smaller initial bundle and faster first paint.

The biggest wins are for heavy pages like `ManagerDashboard` (imports DonutChart, HorizontalBarChart, ManagerPriorityMatrix, etc.).

---

## 13. Debounce the Search / Filter Inputs

`TicketListPage` and `ManagerDashboard` filter tickets on every keystroke:

```tsx
// Runs on every single character typed
onChange={e => setSearchQuery(e.target.value)}
```

If tickets were fetched from the server on each filter change (e.g., server-side filtering), this would fire a request per keystroke. Even with client-side filtering, it causes unnecessary re-renders.

### Add a useDebouncedValue hook

```ts
// src/shared/lib/useDebouncedValue.ts
import { useState, useEffect } from "react";

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
```

Usage:

```tsx
const [searchQuery, setSearchQuery] = useState("");
const debouncedSearch = useDebouncedValue(searchQuery, 250);

// Use debouncedSearch for filtering instead of searchQuery
const filteredTickets = tickets.filter(t =>
  t.title.toLowerCase().includes(debouncedSearch.toLowerCase())
);
```

---

## 14. Axios Instance — Centralise Token Logic

You imported Axios in `package.json` but switched to native fetch in `apiClient.ts`. The auth refresh logic is complex and duplicated between `AuthContext` and fetch calls.

Consider consolidating on Axios with an interceptor. This handles token refresh transparently for all requests:

```ts
// src/shared/lib/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({ baseURL: import.meta.env.VITE_API_URL, withCredentials: true });

// Automatically attach access token
axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Automatically refresh on 401
axiosClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const newToken = await refreshAccessToken(); // imported from auth module
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return axiosClient.request(error.config);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
```

**Benefit:** Every hook gets automatic token refresh without each hook needing to handle it manually.

---

## 15. HTTP Cache-Control Headers (Backend Cooperation)

Even with frontend caching, asking your backend to set proper HTTP headers gives you browser-level caching for free (including CDN support in future).

Ask your backend to set on **static endpoints**:

```
GET /api/priorities  →  Cache-Control: public, max-age=86400, stale-while-revalidate=3600
GET /api/status      →  Cache-Control: public, max-age=86400, stale-while-revalidate=3600
GET /api/roles       →  Cache-Control: public, max-age=86400
```

On **user-specific / mutable endpoints**:

```
GET /api/tickets     →  Cache-Control: private, max-age=30, stale-while-revalidate=60
GET /api/tickets/:id →  Cache-Control: private, no-store
```

With these headers, the **browser itself** will serve priorities from disk cache on every hard refresh — zero network request.

---

## 16. Retry Logic for Failed Requests

Currently if `/api/priorities` fails, the error is shown and never retried. On a slow backend, transient 500s or network blips should be retried automatically.

Without React Query:

```ts
async function fetchWithRetry(
  fetcher: () => Promise<Response>,
  retries = 3,
  delayMs = 500
): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetcher();
      if (res.ok) return res;
      if (res.status >= 400 && res.status < 500) throw new Error("Client error — no retry");
    } catch (err) {
      if (attempt === retries - 1) throw err;
      await new Promise(r => setTimeout(r, delayMs * Math.pow(2, attempt))); // exponential backoff
    }
  }
  throw new Error("Max retries exceeded");
}
```

With React Query: just set `retry: 3` in the default options (already shown in section 3).

---

## 17. Overall Architecture Summary

### Current Problems Tree

```
App loads
│
├── AuthProvider (reads localStorage)
├── UserProvider → fetch /api/auth/me  [1 request]
├── UsersProvider → fetch /api/users   [1 request]
│
└── Route renders page
    ├── TicketListPage
    │   ├── useTickets()       → /api/tickets     [1 request]
    │   ├── usePriorities()    → /api/priorities  [1 request — DUPLICATE 1]
    │   └── useStatuses()      → /api/status      [1 request — DUPLICATE 1]
    │
    ├── ManagerDashboard (same page, same session)
    │   ├── useTickets()       → /api/tickets     [1 request — DUPLICATE]
    │   ├── usePriorities()    → /api/priorities  [1 request — DUPLICATE 2]
    │   ├── useStatuses()      → /api/status      [1 request — DUPLICATE 2]
    │   └── useSupportAgents() → /api/users?role=3 [1 request]
    │
    └── TicketDetailsPage (navigate from list)
        ├── useTicket(id)      → /api/tickets/:id [1 request]
        ├── usePriorities()    → /api/priorities  [1 request — DUPLICATE 3]
        └── useStatuses()      → /api/status      [1 request — DUPLICATE 3]
```

**Total: ~10 requests where ~4 are required.**

---

### Target Architecture (with React Query + localStorage cache)

```
App loads
│
├── QueryClientProvider (in-memory cache + localStorage persistence)
├── AuthProvider
├── UserProvider → useQuery /api/auth/me  [1 request, then cached Infinity]
├── UsersProvider → useQuery /api/users   [1 request, stale 5 min]
│
└── Route renders page
    ├── TicketListPage
    │   ├── useTickets()    → useQuery /api/tickets  [1 request, stale 2 min]
    │   ├── usePriorities() → useQuery (CACHE HIT ✅ — already fetched at login)
    │   └── useStatuses()   → useQuery (CACHE HIT ✅)
    │
    ├── ManagerDashboard
    │   ├── useTickets()    → (CACHE HIT ✅ if < 2 min old)
    │   ├── usePriorities() → (CACHE HIT ✅)
    │   └── useStatuses()   → (CACHE HIT ✅)
    │
    └── TicketDetailsPage
        ├── useTicket(id)   → useQuery /api/tickets/:id (deduplicated)
        ├── usePriorities() → (CACHE HIT ✅)
        └── useStatuses()   → (CACHE HIT ✅)
```

**Total: ~3 requests where 3 are required. 70% reduction.**

---

### Priority Order of Implementation

| Priority | Improvement | Effort | Impact |
|----------|-------------|--------|--------|
| 🔴 P1 | Install React Query + rewrite usePriorities/useStatuses | Medium | Huge |
| 🔴 P1 | `staleTime: Infinity` for priorities/statuses | Trivial (after P1) | Huge |
| 🟠 P2 | localStorage persistence for static data | Small | High |
| 🟠 P2 | Parallel fetch on TicketDetailsPage | Small | High |
| 🟠 P2 | AbortController replacing isMounted pattern | Small | Medium |
| 🟡 P3 | Optimistic updates for status/priority patches | Medium | Medium |
| 🟡 P3 | Route-level lazy loading | Small | Medium |
| 🟡 P3 | Debounce search inputs | Trivial | Low |
| 🟢 P4 | Remove console.log from production | Trivial | Low |
| 🟢 P4 | HTTP Cache-Control on backend | Backend work | High |
| 🟢 P4 | Retry logic | Small | Medium |

---

### Estimated Load Time Improvement

| Scenario | Before | After |
|----------|--------|-------|
| First visit (priorities cold) | ~600 ms (2 × 300 ms duplicate) | ~300 ms (1 request) |
| Second visit (localStorage hit) | ~600 ms | **~0 ms** (instant from cache) |
| Navigate ticket list → details | ~900 ms (3 fresh requests) | **~300 ms** (1 new request, rest cached) |
| Navigate back to ticket list | ~600 ms | **~0 ms** (React Query cache) |

