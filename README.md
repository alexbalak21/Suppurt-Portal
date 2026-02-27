# Support Portal Frontend

A **React 19 + TypeScript** single-page application for a support ticket management system with role-based dashboards, JWT authentication, and a rich component library. Built with Vite and Tailwind CSS 4, designed to deploy as static files served by a **Spring Boot** backend.

## Screenshots

| Manager Dashboard | Ticket Details |
|:-:|:-:|
| ![Manager Dashboard](screenshoots/manager.jpg) | ![Ticket Details](screenshoots/ticket.jpg) |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| Data Fetching & Caching | TanStack Query (React Query) v5 |
| UI Components | Headless UI, Heroicons |
| Rich Text | react-simple-wysiwyg |

---

## Features

- **Role-based access control** - Five roles (USER, SUPPORT, MANAGER, ADMIN, VISITOR) with granular permissions controlling UI visibility and actions
- **JWT authentication** - Login/register with automatic token refresh, cross-tab sync via `StorageEvent`, and silent retry of failed requests
- **Ticket management** - Full lifecycle: create, assign, change status/priority, edit body, and threaded messaging
- **Optimistic updates** - Status, priority, and assignment changes are reflected in the UI instantly; errors automatically roll back
- **Smart caching** - Static reference data (priorities, statuses) cached indefinitely; ticket lists cached for 2 minutes with stale-while-revalidate behaviour; cache is cleared on logout
- **Role-specific dashboards** - User, Support, and Manager dashboards with stats cards, donut charts, bar charts, priority matrices, and recent activity feeds
- **Pure CSS charts** - Donut charts (conic-gradient), horizontal bar charts, and status bars with zero chart-library dependencies
- **Theme support** - Light, dark, and system modes with OS `prefers-color-scheme` detection, persisted in `localStorage`
- **WYSIWYG editor** - Full toolbar for ticket body and messages (bold, italic, lists, links, undo/redo, HTML view)
- **Profile management** - Inline-editable name/email, avatar upload/delete, password change, active role switcher for multi-role users
- **Responsive UI** - Mobile hamburger menu (Headless UI Disclosure), collapsible sidebar, Tailwind `dark:` variants throughout
- **Toast notifications** - Success/error/warning/info toasts with auto-dismiss
- **Debounced search** - Filter inputs debounced at 250 ms to avoid redundant re-renders
- **Route-level code splitting** - Every page is lazy-loaded; only the current page's chunk is downloaded on first visit
- **Dev-only logging** - All debug output is silenced in production builds via a `debug` utility

---

## Project Structure

```
src/
├── main.tsx                          Entry point
├── app/
│   ├── App.tsx                       Root component (Navbar + Routes + ToastContainer)
│   ├── Providers.tsx                 Provider hierarchy (QueryClient > Router > Auth > User)
│   └── routes.tsx                    Lazy-loaded routes with role-based redirects
├── components/                       Reusable UI components
│   ├── Navbar.tsx                    Responsive nav with role-based links & UserMenu
│   ├── Sidebar.tsx                   Collapsible sidebar with icon links
│   ├── Editor.tsx                    WYSIWYG HTML editor
│   ├── Conversation.tsx              Threaded message display
│   ├── TicketFilterBar.tsx           Multi-filter toolbar (search, priority, status)
│   ├── DonutChart.tsx                Pure CSS conic-gradient donut chart
│   ├── Toast / ToastContainer        Notification system with useToast() hook
│   ├── AssignTicketModal.tsx         Modal for ticket assignment
│   └── ...                           Button, Input, Avatar, Spinner, Tooltip, etc.
├── features/
│   ├── auth/                         AuthContext, JWT management, permissions, hooks
│   ├── user/                         UserContext, UsersContext (React Query), profile hooks
│   ├── ticket/
│   │   ├── queryKeys.ts              Centralised query key constants
│   │   ├── usePriorities.ts          staleTime: Infinity - fetched once per session
│   │   ├── useStatuses.ts            staleTime: Infinity - fetched once per session
│   │   ├── useTickets.ts             staleTime: 2 min
│   │   ├── useTicketDetail.ts        Per-ticket detail + messages query, staleTime: 1 min
│   │   ├── useMyAssignedTickets.ts   staleTime: 2 min
│   │   ├── useCreateTicket.ts        useMutation - invalidates ticket list on success
│   │   ├── usePatchTicketStatus.ts   useMutation with optimistic update + rollback
│   │   ├── usePatchTicketPriority.ts useMutation with optimistic update + rollback
│   │   ├── usePatchTicketBody.ts     useMutation - updates detail cache on success
│   │   └── useAssignTicket.ts        useMutation with optimistic update + rollback
│   └── theme/                        Theme management & color utilities
├── pages/
│   ├── Login.tsx / Register.tsx
│   ├── User/                         Dashboard, Profile, UpdateProfile, UpdatePassword
│   ├── Support/                      SupportDashboard
│   ├── Manager/                      ManagerDashboard
│   └── Ticket/                       CreateTicket, TicketList, TicketDetails
├── shared/lib/
│   ├── apiClient.ts                  Thin fetch wrapper with base URL resolution
│   ├── debug.ts                      Dev-only logger (no-ops in production)
│   └── useDebouncedValue.ts          Generic debounce hook (250 ms default)
├── styles/                           main.css, editor.css
└── utils/                            Color mapping utilities
```

---

## Data Fetching & Caching

All server state is managed by **TanStack Query** (React Query v5). The `QueryClient` is configured in `src/app/Providers.tsx` and wraps the entire application.

### Cache lifetimes

| Data | Hook | `staleTime` | Rationale |
|------|------|-------------|-----------|
| Priorities | `usePriorities` | `Infinity` | Never changes - fetched exactly once per session |
| Statuses | `useStatuses` | `Infinity` | Never changes - fetched exactly once per session |
| All users | `UsersContext` | 5 min | Rarely changes |
| Support agents | `useSupportAgents` | 5 min | Rarely changes |
| Ticket list | `useTickets` | 2 min | Background refresh after 2 min |
| Assigned tickets | `useMyAssignedTickets` | 2 min | |
| Ticket detail | `useTicketDetail` | 1 min | |

### Optimistic mutations

The following mutations update the UI **before** the server responds and roll back silently on error:

- `usePatchTicketStatus` - updates all ticket lists and the detail cache
- `usePatchTicketPriority` - updates all ticket lists and the detail cache
- `useAssignTicket` - updates all ticket lists and the detail cache

### Cache invalidation on key events

- `useCreateTicket` invalidates `["tickets"]` on success so the new ticket appears immediately
- `useLogout` calls `queryClient.clear()` to flush all cached data, preventing stale data from being visible to the next user

### Query keys

All keys are defined in one place at `src/features/ticket/queryKeys.ts` to ensure correct cache targeting and avoid typos.

---

## Authentication Flow

1. **Login/Register** - Backend returns `access_token` + `refresh_token` + user object
2. Tokens stored in `localStorage`; authenticated requests inject `Authorization: Bearer` header
3. On `X-Token-Expired` response header, `AuthContext` automatically refreshes the token and retries the original request once
4. Concurrent requests during a refresh are queued and resolved once the new token is available
5. On refresh failure: tokens are cleared, React Query cache is flushed, user is redirected to `/login?session=expired`
6. **Cross-tab sync**: `StorageEvent` listener keeps tokens consistent across browser tabs
7. **Logout** calls `POST /api/auth/logout`, clears tokens (preserves theme preference), clears the React Query cache, and resets all user state

---

## Role-Based Permissions

Users can hold **multiple roles** with an active role selectable from the Profile page.

| Permission | USER | SUPPORT | MANAGER | ADMIN |
|------------|:----:|:-------:|:-------:|:-----:|
| Create tickets | yes | yes | yes | yes |
| Change priority | yes | - | yes | yes |
| Change status | - | yes | yes | yes |
| Assign to self | - | yes | yes | yes |
| Assign to others | - | - | yes | yes |

### Role-Based Navigation

| Role | Redirect target from `/` |
|------|--------------------------|
| USER | `/user/dashboard` |
| SUPPORT | `/support/dashboard` |
| MANAGER | `/manager/dashboard` |
| VISITOR / unauthenticated | `/login` |

---

## Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Email/password form with toast feedback |
| Register | `/register` | New account creation |
| User Dashboard | `/user/dashboard` | Stats cards, priority chart, recent activity, ticket list |
| Support Dashboard | `/support/dashboard` | Assigned ticket stats, status bars, donut chart, workload chart |
| Manager Dashboard | `/manager/dashboard` | All tickets overview, agent workload, priority matrix, assignment modal |
| Profile | `/profile` | User info, theme selector, active role switcher |
| Update Profile | `/update-profile` | Inline-editable name/email, avatar upload/delete |
| Create Ticket | `/create-ticket` | Title, priority selector, WYSIWYG body editor |
| Ticket List | `/ticket-list` | Filterable list with role-adapted columns |
| Ticket Details | `/ticket/:id` | Full ticket view with editable fields, status/priority controls, conversation thread |

---

## API Endpoints

The frontend communicates with a Spring Boot backend. In development, Vite proxies `/api` requests to `http://localhost:8100`.

### Auth

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Authenticate |
| POST | `/api/auth/refresh` | Refresh tokens |
| POST | `/api/auth/logout` | Invalidate session |
| GET | `/api/auth/me` | Current user info |

### Users

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/users?role=` | List users (optional role filter) |
| PATCH | `/api/users/me` | Update name/email |
| PATCH | `/api/users/me/password` | Change password |
| POST | `/api/users/profile-image` | Upload avatar |
| DELETE | `/api/users/profile-image` | Remove avatar |

### Tickets

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/tickets` | List tickets |
| GET | `/api/tickets/{id}` | Ticket details + messages |
| GET | `/api/tickets/assigned/me` | Agent's assigned tickets |
| POST | `/api/tickets` | Create ticket |
| PATCH | `/api/tickets/{id}` | Update priority |
| PATCH | `/api/tickets/{id}/status` | Change status |
| PATCH | `/api/tickets/{id}/body` | Edit body content |
| PATCH | `/api/tickets/{id}/assign` | Assign/unassign user |
| POST | `/api/tickets/{id}/messages` | Add message |

### Reference Data

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/priorities` | Priority definitions (cached `staleTime: Infinity`) |
| GET | `/api/status` | Status definitions (cached `staleTime: Infinity`) |

See `api_doc.md` for full request/response schemas.

---

## Path Aliases

Configured in `vite.config.ts` and `tsconfig.app.json`:

| Alias | Path |
|-------|------|
| `@` | `src/` |
| `@app` | `src/app/` |
| `@components` | `src/components/` |
| `@features` | `src/features/` |
| `@utils` | `src/utils/` |

---

## Getting Started

### Prerequisites

- Node.js 18+
- The Spring Boot backend running on `http://localhost:8100`

### Development

```sh
npm install
npm run dev
```

Vite starts a dev server with a proxy forwarding `/api` to the backend. **TanStack Query Devtools** panel appears in the bottom-left corner in development mode only.

### Production Build

```sh
npm run build
```

Output is written to `dist/`. In the Spring Boot integration, Vite outputs directly to `Issue-Tracker-App/src/main/resources/static`.

### Preview

```sh
npm run preview
```

### Lint

```sh
npm run lint
```

---

## Environment Variables

| Variable | Dev Default | Production | Description |
|----------|-------------|------------|-------------|
| `VITE_API_URL` | `http://localhost:8100` | `""` (empty) | API base URL; empty in production since the SPA is served from the same origin |

- `.env` (development): `VITE_API_URL="http://localhost:8100"`
- `.env.production` (build): `VITE_API_URL=""` — Vite uses this automatically during `npm run build`

---

## Architecture Highlights

- **TanStack Query** - All server state managed via `useQuery` / `useMutation`. Handles deduplication, background refetching, and cache invalidation automatically. No more duplicate requests for the same data.
- **`staleTime: Infinity` for static data** - Priorities and statuses are fetched exactly once per session regardless of how many components call those hooks.
- **Optimistic mutations** - Status/priority/assignment changes update the UI instantly and roll back silently on server errors.
- **Context providers** - Nested `QueryClient > Router > AuthProvider > UserProvider` hierarchy consumed via custom hooks.
- **Automatic token refresh** - Interceptor pattern in `AuthContext` with a subscriber queue for concurrent request handling during refresh.
- **Route-level code splitting** - All pages are `React.lazy()` imported, wrapped in `Suspense`. Vite emits a separate JS chunk per page (visible in build output).
- **Dev-only logging** - `src/shared/lib/debug.ts` exports `debug`, `debugWarn`, `debugError` helpers that are completely silent in production builds.
- **Debounced search** - `useDebouncedValue` (250 ms) prevents redundant filter recalculations on every keystroke in ticket lists and dashboards.
- **Strict Mode safe** - `useRef` guard in `UserProvider` prevents double-fetching in React 19 Strict Mode.
- **Role normalization** - Handles both `role` (string) and `roles` (array) formats from the backend.
- **Zero chart dependencies** - All charts built with pure CSS (conic-gradient, flexbox bars).

---

## Related Docs

- `api_doc.md` - Full API documentation with request/response examples
- `detailled_improvements.md` - Detailed performance and caching improvement notes
- `SUPPORT_TICKET_IMPLEMENTATION.md` - Support ticket feature implementation guide
- `manager_dashboard.md` - Manager dashboard features

---

For more details, see code comments and `structure.txt`.
