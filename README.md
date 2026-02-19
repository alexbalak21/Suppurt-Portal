

# issue-tracker-front

React Frontend for Issue Tracker App

## Features
- Role-based dashboards and navigation (USER, SUPPORT, MANAGER, ADMIN, VISITOR)
- Dynamic navbar links and page access based on user role
- Modern React (Vite, TypeScript, Context API)
- Modular folder structure by feature/domain
- API integration with backend (see `api_doc.md`)
- Ticket management: create, assign, update status/priority, comment
- Manager and Support dashboards with charts, workload, and stats
- WYSIWYG HTML editor for ticket messages
- Light/dark mode, responsive design, and accessibility

## Folder Structure

```
src/
	main.tsx                - App entry point
	app/
		App.tsx               - Main App component
		index.ts              - App exports
		Providers.tsx         - Context providers setup
		routes.tsx            - App routes definition
	components/
		...                   - Reusable UI components (Avatar, Button, Navbar, Sidebar, Toast, etc.)
	features/
		auth/                 - Authentication logic (API, context, hooks)
		user/                 - User logic (context, types, hooks)
		ticket/               - Ticket logic (hooks, types)
		theme/                - Theme and color utilities
	pages/
		...                   - Route pages (Home, About, Login, Register, Dashboards, etc.)
	shared/
		lib/                  - Shared libraries (API client, etc.)
	styles/                 - CSS styles (main.css, editor.css)
```
See `structure.txt` for a detailed breakdown.

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
