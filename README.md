
# Support Portal Frontend

A **React 19 + TypeScript** single-page application for a support ticket management system with role-based dashboards, JWT authentication, and a rich component library. Built with Vite and Tailwind CSS 4, designed to deploy as static files into a **Spring Boot** backend.

## Screenshots

| Manager Dashboard | Ticket Details |
|:-:|:-:|
| ![Manager Dashboard](screenshoots/manager.jpg) | ![Ticket Details](screenshoots/ticket.jpg) |

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| HTTP Client | Axios |
| UI Components | Headless UI, Heroicons |
| Rich Text | react-simple-wysiwyg |

---

## Features

- **Role-based access control** — Five roles (USER, SUPPORT, MANAGER, ADMIN, VISITOR) with granular permissions controlling UI visibility and actions
- **JWT authentication** — Login/register with automatic token refresh, cross-tab sync via `StorageEvent`, and silent retry of failed requests
- **Ticket management** — Full lifecycle: create, assign, change status/priority, edit body, and threaded messaging
- **Role-specific dashboards** — User, Support, and Manager dashboards with stats cards, donut charts, bar charts, priority matrices, and recent activity feeds
- **Pure CSS charts** — Donut charts (conic-gradient), horizontal bar charts, and status bars with zero chart-library dependencies
- **Theme support** — Light, dark, and system modes with OS `prefers-color-scheme` detection, persisted in localStorage
- **WYSIWYG editor** — Full toolbar for ticket body and messages (bold, italic, lists, links, undo/redo, HTML view)
- **Profile management** — Inline-editable name/email, avatar upload/delete, password change, active role switcher for multi-role users
- **Responsive UI** — Mobile hamburger menu (Headless UI Disclosure), collapsible sidebar, Tailwind `dark:` variants throughout
- **Toast notifications** — Success/error/warning/info toasts with auto-dismiss

---

## Project Structure

```
src/
├── main.tsx                    Entry point
├── app/
│   ├── App.tsx                 Root component (Navbar + Routes + ToastContainer)
│   ├── Providers.tsx           Context provider hierarchy (Router → Auth → User)
│   └── routes.tsx              Route definitions with role-based redirects
├── components/                 Reusable UI components
│   ├── Navbar.tsx              Responsive nav with role-based links & UserMenu
│   ├── Sidebar.tsx             Collapsible sidebar with icon links
│   ├── Editor.tsx              WYSIWYG HTML editor
│   ├── Conversation.tsx        Threaded message display
│   ├── TicketFilterBar.tsx     Multi-filter toolbar (search, priority, status)
│   ├── DonutChart.tsx          Pure CSS conic-gradient donut chart
│   ├── Toast / ToastContainer  Notification system with useToast() hook
│   ├── AssignTicketModal.tsx   Modal for ticket assignment
│   └── ...                     Button, Input, Avatar, Spinner, Tooltip, etc.
├── features/
│   ├── auth/                   AuthContext, JWT token management, permissions, hooks
│   ├── user/                   UserContext, profile API hooks
│   ├── ticket/                 Custom hooks for all ticket CRUD operations
│   └── theme/                  Theme management & color utilities
├── pages/
│   ├── Login.tsx / Register.tsx
│   ├── User/                   Dashboard, Profile, UpdateProfile, UpdatePassword
│   ├── Support/                SupportDashboard
│   ├── Manager/                ManagerDashboard
│   └── Ticket/                 CreateTicket, TicketList, TicketDetails
├── shared/lib/                 Shared API client (fetch wrapper)
├── styles/                     main.css, editor.css
└── utils/                      Color mapping utilities
```

---

## Authentication Flow

1. **Login/Register** → Backend returns `access_token` + `refresh_token` + user object
2. Tokens stored in `localStorage`; authenticated requests inject `Authorization: Bearer` header
3. On `X-Token-Expired` response header, the auth context **automatically refreshes** the token and retries the request
4. Concurrent requests during refresh are queued and resolved once the new token is available
5. On refresh failure: tokens are cleared and user is redirected to `/login?session=expired`
6. **Cross-tab sync**: `StorageEvent` listener keeps tokens consistent across browser tabs
7. **Logout** calls `POST /api/auth/logout`, clears tokens (preserves theme preference), and resets state

---

## Role-Based Permissions

Users can hold **multiple roles** with an active role selectable from the Profile page.

| Permission | USER | SUPPORT | MANAGER | ADMIN |
|------------|:----:|:-------:|:-------:|:-----:|
| Create tickets | ✓ | ✓ | ✓ | ✓ |
| Change priority | ✓ | — | ✓ | ✓ |
| Change status | — | ✓ | ✓ | ✓ |
| Assign to self | — | ✓ | ✓ | ✓ |
| Assign to others | — | — | ✓ | ✓ |

### Role-Based Navigation

| Role | Visible Routes |
|------|----------------|
| VISITOR | About, Login, Register |
| USER | User Dashboard, Profile, Create Ticket, Ticket List |
| SUPPORT | Support Dashboard, Tickets, Profile |
| MANAGER | Manager Dashboard, Tickets, Profile |

The root path (`/`) automatically redirects to the appropriate dashboard based on the user's active role.

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
| GET | `/api/users?role=` | List users (with optional role filter) |
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
| GET | `/api/priorities` | Priority definitions |
| GET | `/api/status` | Status definitions |

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
- The Spring Boot backend running on `http://localhost:8100` (for API access)

### Development
```sh
npm install
npm run dev
```

Vite dev server starts with a proxy forwarding `/api` requests to the backend.

### Production Build
```sh
npm run build
```

Output is written directly to `Issue-Tracker-App/src/main/resources/static`, embedding the SPA into the Spring Boot JAR.

### Preview Production Build
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

---

## Architecture Highlights

- **Context providers** — Nested `Router → AuthProvider → UserProvider` hierarchy consumed via custom hooks
- **Automatic token refresh** — Interceptor pattern with subscriber queue for concurrent request handling
- **Custom hooks per API** — Every API interaction (`useTickets`, `useCreateTicket`, etc.) is encapsulated in a hook managing its own loading/error/success state
- **Strict Mode safe** — `useRef` guard prevents double-fetching in React 19 Strict Mode
- **Role normalization** — Handles both `role` (string) and `roles` (array) formats from the backend
- **Zero chart dependencies** — All charts built with pure CSS (conic-gradient, flexbox bars)

---

## Related Docs

- `api_doc.md` — Full API documentation with request/response examples
- `improvements.md` — Project improvement ideas and best practices
- `SUPPORT_TICKET_IMPLEMENTATION.md` — Support ticket feature implementation guide

---

## 📚 Documentation
- See `api_doc.md` for API details
- See `SUPPORT_TICKET_IMPLEMENTATION.md` for support ticket page implementation
- See `manager_dashboard.md` for manager dashboard features

---

For more details, see code comments and `structure.txt`.

## Environment Variables
- `.env` (development):
	- `VITE_API_URL="http://localhost:8100"`
- `.env.production` (build/production):
	- `VITE_API_URL=""` (empty string)
	- Vite will automatically use `.env.production` for `npm run build`.

## Role-based Navbar Example
Navbar links change based on the user's role:

| Role     | Links Shown                                   |
|----------|-----------------------------------------------|
| VISITOR  | Home, About, Login, Register                  |
| USER     | Home, API Demo, Editor, My Profile, Dashboard |
| SUPPORT  | Home, API Demo, Editor, Tickets, Support Dashboard |
| MANAGER  | Home, API Demo, Editor, Tickets, Manager Dashboard |
| ADMIN    | Home, API Demo, Editor, Manage Users, Admin Settings |

## How to Run

### Development
```sh
npm install
npm run dev
```

### Production Build
```sh
npm run build
npm run preview
```

## Debugging
- Console logs are present in role/user context and navbar for troubleshooting role-based UI.

## Backend API
- Expects `/api/user` and `/api/auth/login` endpoints as described in `api_doc.md`.

---
For more details, see code comments and structure.txt.
