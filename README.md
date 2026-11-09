# Tasklane — Jira-inspired Kanban Dashboard

![React](https://img.shields.io/badge/React-18-149eca) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Vite](https://img.shields.io/badge/Vite-6-646cff)

Frontend Developer Practical Test: a responsive, working Kanban Task Management app with a **Jira-inspired interface** (independent UI, **not** an Atlassian integration).

## What it delivers

- Login/logout with real **DummyJSON Authentication API**, Bearer-token Axios instance, request/response interceptors and refresh-token retry.
- Protected routes; account restored after browser refresh via `/auth/me`.
- Jira-style global header, **collapsible desktop sidebar**, mobile navigation drawer, project tabs, summary, list, backlog and active-sprint board.
- **4 workflow columns:** Backlog, To Do, In Progress, Done.
- **Drag and drop** between columns or within a column, with keyboard support and persistent order.
- Create/read/update/delete tasks with required-field validation and delete confirmation.
- Combined filters for title, priority, assignee, due date and status.
- Live statistics (total, backlog, in progress and completed).
- Local task persistence **per authenticated user**, with an informative warning if localStorage cannot save changes.
- Responsive board scrolling, two-column issue details modal, loading/empty/error states.

## Stack

| Concern | Implementation |
|---|---|
| UI | React 18, TypeScript 5, Vite 6, Ant Design 5 |
| API | Axios, typed `authService`, centralized Axios interceptors |
| Navigation | React Router 6 with Protected Route |
| State | Context + **custom hooks**, pure domain functions |
| DnD | `@dnd-kit/core`, `@dnd-kit/sortable` |
| Tasks | Browser `localStorage`, scoped by user ID |
| Dates | dayjs |
| Testing | Node assertions for domain and storage behavior; TypeScript compiler |

**Why not microservices?** This coding exercise explicitly specifies DummyJSON for auth and localStorage for tasks, so a backend or microservice cluster would add deployment burden without implementing a requirement. The application is organized as a **feature-based modular frontend** that can be extended with a REST backend later. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Quick start

Requirements: Node.js 20+ (Node 22 LTS recommended), npm, internet for first package install and login API.

```bash
npm install
npm run dev
```

Open `http://localhost:5173` or the address displayed by Vite.

Test account:

```text
username: emilys
password: emilyspass
```

Optional API configuration: copy `.env.example` to `.env` and adjust `VITE_API_BASE_URL`.

```env
VITE_API_BASE_URL=https://dummyjson.com
```

No API secret or separate database is required. Use a public demo account only; do not store private service credentials in `.env` prefixed with `VITE_`.

## Run checks

```bash
npm run test           # Syntax, import-path and domain/storage test cases
npm run test:syntax    # Parse every TypeScript/TSX source file
npm run typecheck      # Strict TypeScript check
npm run build          # TypeScript + production bundle
npm run preview        # Preview a successful production build
```

> **Verification status:** In the development workspace used to prepare this archive, syntax parsing, import-path checks and Node domain/repository tests passed on the final version. An npm registry DNS failure prevented a complete `npm install`, browser E2E run, and full TypeScript/Vite build. **Run `npm run typecheck` and `npm run build` locally before submission.** Do not treat automated pure-function tests as browser E2E tests.

## Architecture at a glance

```text
src/
├── app/               # Router, protected route, layout, error boundary
├── features/
│   ├── auth/          # API service, context, useAuth hook, types and login
│   ├── tasks/         # Kanban + CRUD components, hooks, task domain, repository
│   └── settings/      # Profile and local data settings
├── shared/            # Axios, token storage, error messages, UI helpers
├── jira.css           # Jira-inspired responsive styles
└── main.tsx
```

Important custom hooks: `useAuth`, `useTasks`, `useLocalTasks`, `useTaskFilters`, `useKanbanDrag`. Pure functions in `features/tasks/model`: `upsertTask`, `removeTask`, `moveTask`, `filterTasks`, `taskStats`. Local state/storage is isolated in `taskRepository`.


## Manual usage

Log in and open **Active sprints**. Use the visible left sidebar to navigate; collapse or expand it to give the board more room. On mobile the header menu opens a navigation drawer. Drag the visible grip handle on a card to move it to another column. Click a card to open/edit details; click **Create** or a column's **Create issue** to add a task. Search and stack priority/assignee/status/date filters. Use **Summary** to review live statistics, **List** for a table, **My tasks** for your assigned work, and **Settings** to restore demo issues after confirming.

Demo cards are populated only when a user has no saved tasks. Resetting them replaces the user's current local tasks. Task data is **not synchronized between browsers or computers**.

**CI:** `.github/workflows/ci.yml` runs dependency installation, automated checks and build after a push. It uses `npm ci` when the lockfile is present and a bootstrap `npm install` otherwise. **Commit `package-lock.json`** (generated by your local `npm install`) for reproducible CI builds.
