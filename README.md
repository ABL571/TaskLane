# Tasklane — Jira-inspired Kanban Dashboard

![React](https://img.shields.io/badge/React-18-149eca) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Vite](https://img.shields.io/badge/Vite-6-646cff)

Frontend Developer Practical Test: a responsive, working Kanban Task Management app with a **Jira-inspired interface** (independent UI, **not** an Atlassian integration). Based on the supplied `Frontend_Developer_Practical_Test.docx`.

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

Full explanation: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Requirement-by-requirement audit: [docs/REQUIREMENTS_MATRIX.md](docs/REQUIREMENTS_MATRIX.md).

## Manual usage

Log in and open **Active sprints**. Use the visible left sidebar to navigate; collapse or expand it to give the board more room. On mobile the header menu opens a navigation drawer. Drag the visible grip handle on a card to move it to another column. Click a card to open/edit details; click **Create** or a column's **Create issue** to add a task. Search and stack priority/assignee/status/date filters. Use **Summary** to review live statistics, **List** for a table, **My tasks** for your assigned work, and **Settings** to restore demo issues after confirming.

Demo cards are populated only when a user has no saved tasks. Resetting them replaces the user's current local tasks. Task data is **not synchronized between browsers or computers**.

## Publish to GitHub

**Recommended repository:** `ABL571/tasklane-jira-kanban`. Create a **new empty repository** at [github.com/new](https://github.com/new). Do not check **Add a README**, **Add .gitignore**, or **Choose a license** because the project already contains those files where needed.

In Windows PowerShell, open the **project root** (the folder containing `package.json`) and run:

```powershell
npm install
npm run test
npm run typecheck
npm run build

git init -b main
git add .
git commit -m "feat: initial Jira-inspired Kanban dashboard"
git remote add origin https://github.com/ABL571/tasklane-jira-kanban.git
git push -u origin main
```

The repository must exist on GitHub before `git push`. You can alternatively run the included `PUSH_GITHUB.ps1` script (after reviewing it), which checks dependencies/build, initializes Git, commits, and pushes. It will never create the remote repository for you. For screenshots, authentication guidance, and troubleshooting, follow [GITHUB_PUSH_GUIDE.md](GITHUB_PUSH_GUIDE.md).

If the repository is **private**, invite the assessor as a collaborator or change visibility to **public** when you are ready to share. Screenshots must come from the running application, not mockups. Do not commit `.env`, API secrets, `node_modules`, or `dist`.

## Submission checklist

- [ ] Run `npm install` successfully, then `npm run test`, `npm run typecheck`, `npm run build`.
- [ ] Execute all scenarios in [docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md).
- [ ] Capture `screenshots/login.png`, `screenshots/dashboard.png`, `screenshots/kanban.png` with your actual browser (images are **not included**).
- [ ] Commit source and generated `package-lock.json` to Git; do **not** commit `node_modules/`, `.env`, or `dist/`.
- [ ] Push to your own GitHub repository and submit the repository URL.

For setup instructions in Indonesian, see [PANDUAN_STEP_BY_STEP.md](PANDUAN_STEP_BY_STEP.md). For interview preparation, see [docs/INTERVIEW_NOTES.md](docs/INTERVIEW_NOTES.md).

## Known tradeoffs

- Token localStorage is acceptable **for this test** because the brief requires persisted auth state; production should generally use hardened, httpOnly cookies and server-side session controls.
- The UI is Jira-inspired but does not integrate with Atlassian/Jira, track real sprints, or implement epic/subtask entities.
- No backend microservices or realtime collaboration: all task CRUD is browser-local.
- When tests require API access, the computer must be online and DummyJSON reachable.

**CI:** `.github/workflows/ci.yml` runs dependency installation, automated checks and build after a push. It uses `npm ci` when the lockfile is present and a bootstrap `npm install` otherwise. **Commit `package-lock.json`** (generated by your local `npm install`) for reproducible CI builds.
