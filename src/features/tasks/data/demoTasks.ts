import type { Task, TaskPriority, TaskStatus } from '../model/task';

type Seed = [string, string, TaskPriority, TaskStatus, number, string?];
const demos: Seed[] = [
  ['Design dashboard layout', 'Create a consistent grid, typography and responsive shell for the new workspace.', 'high', 'done', -4, 'Emily Johnson'],
  ['Setup authentication flow', 'Integrate login, session persistence and protected routes with DummyJSON.', 'high', 'done', -1, 'Michael Chen'],
  ['Build reusable UI components', 'Create shared task cards, avatars, status indicators and modal controls.', 'medium', 'in_progress', 2, 'Emily Johnson'],
  ['Implement Kanban drag & drop', 'Move task cards between columns and persist their status in local storage.', 'high', 'in_progress', 3, 'Sarah Kim'],
  ['Create task CRUD forms', 'Add field validation and confirmation before deleting any task.', 'high', 'todo', 4, 'Alex Morgan'],
  ['Add advanced task filters', 'Combine title, priority, assignee, due date and status filters.', 'medium', 'todo', 5, 'Emily Johnson'],
  ['Polish responsive mobile view', 'Make board navigation intuitive on tablet and phone screens.', 'medium', 'todo', 8, 'Sarah Kim'],
  ['Write technical documentation', 'Include project structure, installation, testing and demo credentials.', 'low', 'backlog', 9, 'Michael Chen'],
  ['Review accessibility', 'Check keyboard support, focus states and readable contrast.', 'medium', 'backlog', 11],
  ['Prepare final QA checklist', 'Verify local persistence, API errors and every task action before shipping.', 'low', 'backlog', 12, 'Alex Morgan'],
];

function offsetDay(date: Date, difference: number) {
  const value = new Date(date);
  value.setDate(value.getDate() + difference);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}

export function getDemoTasks(): Task[] {
  const now = new Date();
  const perColumn: Record<TaskStatus, number> = { backlog: 0, todo: 0, in_progress: 0, done: 0 };
  return demos.map(([title, description, priority, status, offset, assignee], index) => ({
    id: `demo-${index + 101}`,
    code: `TL-${index + 101}`,
    title,
    description,
    priority,
    status,
    dueDate: offsetDay(now, offset),
    assignee,
    order: perColumn[status]++,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }));
}
