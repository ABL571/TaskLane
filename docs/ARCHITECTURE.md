# Architecture & engineering decisions

## The important choice: modular frontend, not microservices

This is a **React frontend practical test**, not a distributed-backend assignment.
DummyJSON owns authentication; tasks are persisted in the browser using `localStorage`.
Introducing microservices, a database, Docker, or an API gateway would be outside the
requirements and would complicate review. We instead use **feature-based modules**, a
service layer, focused custom hooks, typed domain functions, and isolated persistence.

## Component and data flow

```text
main.tsx
  -> ErrorBoundary
  -> App (React Router)
    -> AuthProvider -> useAuth()
      -> ProtectedRoute
        -> TaskProvider [keyed by user.id]
          -> useLocalTasks(user.id)
            -> taskActions.ts (upsert/delete)
            -> taskUtils.ts (drag/drop, filters, statistics)
            -> taskRepository.ts (localStorage per user)
          -> AppShell (Jira-inspired navigation)
            -> BoardPage
              -> useTaskFilters()
              -> FiltersBar / Statistics
              -> KanbanBoard -> useKanbanDrag() -> @dnd-kit
              -> TaskModal -> onSave/onDelete -> useLocalTasks()
```

## Folder map

```text
src/
  app/
    App.tsx                 # Route tree and provider integration
    ProtectedRoute.tsx      # Auth gating; task store scoped by user ID
    components/ErrorBoundary.tsx
    layout/AppShell.tsx     # Top navigation, persistent collapsible desktop sidebar, mobile drawer and account menu
  features/
    auth/
      api/authService.ts   # DummyJSON /auth/login and /auth/me
      context/AuthProvider.tsx
      hooks/useAuth.ts
      model/auth.ts
      pages/LoginPage.tsx
    tasks/
      components/           # KanbanBoard, TaskCard, TaskModal, FiltersBar, Statistics
      config/board.ts       # Statuses, priority options and demo assignees
      context/TaskProvider.tsx
      data/demoTasks.ts
      hooks/
        useTasks.ts        # Access typed TaskContext
        useLocalTasks.ts   # CRUD state and localStorage synchronization
        useTaskFilters.ts  # Combined search/filter and global query handling
        useKanbanDrag.ts   # dnd-kit sensors and drag lifecycle
      model/
        task.ts            # Task and TaskInput contracts
        taskUtils.ts       # Pure moveTask, filterTasks, taskStats
        taskActions.ts     # Pure upsertTask and removeTask
      pages/BoardPage.tsx
      repositories/taskRepository.ts
    settings/pages/SettingsPage.tsx
  shared/
    api/client.ts          # Axios instance, interceptors and token refresh
    storage/tokenStorage.ts
    utils/errorMessage.ts
    utils/initials.ts
  jira.css / styles.css    # Existing Jira-inspired responsive styling
```

## State and persistence

- Authentication: `AuthProvider` stores the public user object in React state. Login
  tokens are deliberately stored in localStorage to satisfy the brief. A real
  production deployment should prefer an httpOnly secure-cookie session strategy.
- Tasks: `useLocalTasks` owns one authenticated user's tasks, saving immediately
  when React state changes. The repository uses `tasklane_tasks_v1_user_<id>` keys.
- After refresh: `AuthProvider` calls `/auth/me` (Axios Bearer interceptor); task
  state is hydrated from localStorage when the protected tree is mounted.
- Updating task status via dnd-kit calls `moveTask()`, a pure function that also
  normalizes sort order in both source and destination columns.
- `useTaskFilters` computes combined filtering; the four statistics are always
  derived from current task data, not hardcoded.

## Error handling and tradeoffs

- Axios adds the Authorization header automatically; one concurrent refresh request
  is shared when multiple endpoints receive HTTP 401. Only a failed refresh clears
  tokens and emits a session-expired event.
- UI displays login errors, form validation, delete confirmation, and a localStorage
  failure warning. ErrorBoundary displays a recovery screen for render exceptions.
- This is **single-browser task storage**, not shared project collaboration.
  Task data will not synchronize across devices or browsers.
- Demo members are placeholders; there is no employee-management or real Jira API.
- React Context and hooks are sufficient for this test's scope. Adding Redux or
  multiple external state packages would not improve clarity here.

## Later backend migration (only if requested)

Keep the typed Task domain and component APIs. Replace the repository with a
Task REST/GraphQL service, add server-side authorization and data validation,
then adopt TanStack Query for caching and server state. Only consider separate
backend services if a genuine independently deployed business domain exists.
