export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  code: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string; // YYYY-MM-DD
  assignee?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type TaskInput = Pick<Task, 'title' | 'description' | 'priority' | 'status' | 'dueDate' | 'assignee'>;

