import { getDemoTasks } from '../data/demoTasks';
import type { Task } from '../model/task';
import { isTaskStatus } from '../model/taskUtils';

const PREFIX = 'tasklane_tasks_v1';

function keyFor(userId: number) { return `${PREFIX}_user_${userId}`; }

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false;
  const task = value as Partial<Task>;
  return typeof task.id === 'string' &&
    typeof task.code === 'string' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    (task.priority === 'low' || task.priority === 'medium' || task.priority === 'high') &&
    typeof task.status === 'string' && isTaskStatus(task.status) &&
    typeof task.dueDate === 'string' && typeof task.order === 'number' &&
    typeof task.createdAt === 'string' && typeof task.updatedAt === 'string' &&
    (task.assignee === undefined || typeof task.assignee === 'string');
}

export function readTasks(userId: number): Task[] {
  try {
    const raw = localStorage.getItem(keyFor(userId));
    if (raw === null) return getDemoTasks();
    const value: unknown = JSON.parse(raw);
    if (Array.isArray(value) && value.every(isTask)) return value;
    return getDemoTasks();
  } catch { return getDemoTasks(); }
}

export function saveTasks(userId: number, tasks: Task[]) {
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(tasks));
    return true;
  } catch { return false; }
}
