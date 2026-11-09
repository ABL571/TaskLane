import type { Task, TaskInput } from './task';

export function upsertTask(tasks: Task[], input: TaskInput, id?: string): Task[] {
  const now = new Date().toISOString();
  if (id) {
    const existing = tasks.find(task => task.id === id);
    if (!existing) return tasks;
    const order = existing.status === input.status ? existing.order :
      tasks.filter(task => task.status === input.status).length;
    return tasks.map(task => task.id === id
      ? { ...task, ...input, order, updatedAt: now }
      : task);
  }
  const maxCode = tasks.reduce((max, task) => {
    const num = Number(task.code.replace(/^TL-/, ''));
    return Number.isFinite(num) ? Math.max(max, num) : max;
  }, 100);
  const newTask: Task = {
    ...input,
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID() : `task-${Date.now()}-${Math.random()}`,
    code: `TL-${maxCode + 1}`,
    order: tasks.filter(task => task.status === input.status).length,
    createdAt: now,
    updatedAt: now,
  };
  return [...tasks, newTask];
}

export function removeTask(tasks: Task[], id: string): Task[] {
  return tasks.filter(task => task.id !== id);
}
