import type { Task, TaskPriority, TaskStatus } from './task';

const STATUSES: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'done'];

export interface TaskFilters {
  search: string;
  priority: TaskPriority | 'all';
  assignee: string;
  dueDate: string;
  status: TaskStatus | 'all';
}

export const DEFAULT_FILTERS: TaskFilters = {
  search: '', priority: 'all', assignee: 'all', dueDate: '', status: 'all',
};

export function isTaskStatus(value: string): value is TaskStatus {
  return STATUSES.includes(value as TaskStatus);
}

export function sortTasks(tasks: Task[]) {
  return [...tasks].sort((a, b) => a.order - b.order || a.createdAt.localeCompare(b.createdAt));
}

export function filterTasks(tasks: Task[], filters: TaskFilters) {
  const query = filters.search.trim().toLowerCase();
  return tasks.filter(task =>
    (!query || task.title.toLowerCase().includes(query)) &&
    (filters.priority === 'all' || task.priority === filters.priority) &&
    (filters.assignee === 'all' || (filters.assignee === 'unassigned' ? !task.assignee : task.assignee === filters.assignee)) &&
    (!filters.dueDate || task.dueDate === filters.dueDate) &&
    (filters.status === 'all' || task.status === filters.status)
  );
}

export function taskStats(tasks: Task[]) {
  return {
    total: tasks.length,
    backlog: tasks.filter(task => task.status === 'backlog').length,
    inProgress: tasks.filter(task => task.status === 'in_progress').length,
    completed: tasks.filter(task => task.status === 'done').length,
  };
}

// Works for both card targets and empty-column targets such as "column:todo".
// Order changes are normalized so the board stays stable after refresh.
export function moveTask(tasks: Task[], activeId: string, overId: string): Task[] {
  const active = tasks.find(item => item.id === activeId);
  if (!active || activeId === overId) return tasks;

  const dropColumn = overId.startsWith('column:') ? overId.slice(7) : null;
  const target = tasks.find(item => item.id === overId);
  const targetStatus = dropColumn && isTaskStatus(dropColumn) ? dropColumn : target?.status;
  if (!targetStatus) return tasks;

  const now = new Date().toISOString();
  const changed = new Map<string, Task>();
  if (active.status === targetStatus) {
    const ordered = sortTasks(tasks.filter(item => item.status === active.status));
    const fromIndex = ordered.findIndex(item => item.id === activeId);
    const toIndex = target ? ordered.findIndex(item => item.id === target.id) : ordered.length - 1;
    if (toIndex < 0 || fromIndex === toIndex) return tasks;
    const [dragged] = ordered.splice(fromIndex, 1);
    ordered.splice(toIndex, 0, { ...dragged, updatedAt: now });
    ordered.forEach((task, order) => changed.set(task.id, { ...task, order }));
  } else {
    const source = sortTasks(tasks.filter(item => item.status === active.status && item.id !== activeId));
    const destination = sortTasks(tasks.filter(item => item.status === targetStatus));
    const targetIndex = target ? destination.findIndex(item => item.id === target.id) : destination.length;
    destination.splice(targetIndex < 0 ? destination.length : targetIndex, 0,
      { ...active, status: targetStatus, updatedAt: now });
    source.forEach((task, order) => changed.set(task.id, { ...task, order }));
    destination.forEach((task, order) => changed.set(task.id, { ...task, order }));
  }
  return tasks.map(item => changed.get(item.id) ?? item);
}
