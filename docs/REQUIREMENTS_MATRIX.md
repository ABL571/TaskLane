# Matriks kesesuaian practical test

Acuan: `Frontend_Developer_Practical_Test(1).docx` dari recruiter.

**Arti status:** `Implemented` berarti source code memiliki implementasi. `Logic tested` berarti tes otomatis di `npm test` juga lulus. `Browser verification required` berarti perlu diuji langsung di komputer kandidat sebelum submission. Ini **bukan sertifikat bebas bug**.

| Kebutuhan | Implementasi | Status |
| --- | --- | --- |
| React.js | `src/main.tsx`, `src/app/App.tsx` | Implemented |
| Axios (semua komunikasi autentikasi) | `src/shared/api/client.ts`, `src/features/auth/api/authService.ts` | Implemented; browser verification required |
| Ant Design | `src/main.tsx`, komponen auth/tasks | Implemented |
| TypeScript, strict typing | `tsconfig.json`, `src/**/*.tsx`, `src/**/*.ts` | Syntax checked; full typecheck required |
| Authentication dengan DummyJSON | `LoginPage`, `authService`, `AuthProvider` | Implemented; browser verification required |
| Validasi input login & loading/error | `src/features/auth/pages/LoginPage.tsx` | Implemented; browser verification required |
| Protected Route | `src/app/ProtectedRoute.tsx` | Implemented; browser verification required |
| Session dipertahankan saat refresh | `AuthProvider.tsx`, `tokenStorage.ts` | Implemented; browser verification required |
| Logout | `AppShell.tsx`, `AuthProvider.tsx` | Implemented; browser verification required |
| Bearer request interceptor | `src/shared/api/client.ts` | Implemented; browser verification required |
| Response interceptor / refresh token | `src/shared/api/client.ts` | Implemented; browser verification required |
| 401 / 403 / 500 / network errors | `src/shared/utils/errorMessage.ts`, Axios interceptor | Implemented; browser verification required |
| Sidebar & header | `src/app/layout/AppShell.tsx`, `src/jira.css` | Implemented; browser verification required |
| Informasi pengguna | Account avatar/menu dan Settings | Implemented; browser verification required |
| Statistik Total, Backlog, In progress, Completed | `Statistics.tsx`, `taskStats()` | Implemented; logic tested |
| Kanban Backlog, To Do, In Progress, Done | `KanbanBoard.tsx`, `config/board.ts` | Implemented; browser verification required |
| Card title, description, priority, due date, assignee, status | `TaskCard.tsx` | Implemented; browser verification required |
| Drag-and-drop antar kolom + urutan | `useKanbanDrag.ts`, `moveTask()` | Implemented; logic tested, browser verification required |
| Create + required-field validation | `TaskModal.tsx`, `upsertTask()` | Implemented; logic tested, browser verification required |
| Read/edit/delete + konfirmasi delete | `TaskModal.tsx`, `TaskCard.tsx`, `removeTask()` | Implemented; logic tested, browser verification required |
| Search judul + filter priority/assignee/date/status secara bersamaan | `FiltersBar.tsx`, `useTaskFilters.ts`, `filterTasks()` | Implemented; logic tested, browser verification required |
| LocalStorage persistence & unique task ID | `taskRepository.ts`, `useLocalTasks.ts`, `taskActions.ts` | Implemented; logic tested |
| Responsive, loading, empty, error states | `jira.css`, `LoginPage.tsx`, `BoardPage.tsx` | Implemented; browser verification required |
| Reusable components + custom hooks | `src/features/tasks/components`, `src/features/tasks/hooks` | Implemented |
| Automated tests | `scripts/verify-core.cjs`, syntax/import checkers | Logic tested |
| Git source + README + environment | `.github/`, `README.md`, `.env.example` | Included; must push to candidate GitHub |
| Screenshot login / dashboard / Kanban | `screenshots/` | **Must capture from the running app** |

## Wajib dilakukan sebelum submission

1. `npm install`, lalu `npm run test && npm run typecheck && npm run build` sampai semuanya berhasil.
2. `npm run dev`, coba seluruh skenario pada `docs/QA_CHECKLIST.md` di browser.
3. Ambil screenshot asli dari aplikasi yang berjalan: `screenshots/login.png`, `screenshots/dashboard.png`, `screenshots/kanban.png`.
4. Commit `package-lock.json`, lalu push ke GitHub dan pastikan GitHub Actions hijau.
5. Pastikan kamu dapat menjelaskan komponen, hooks, interceptor, alasan localStorage, dan flow drag-and-drop.

Catatan: project ini menggunakan autentikasi DummyJSON dan localStorage sesuai requirement. Tidak ada microservice backend karena tidak diminta.
