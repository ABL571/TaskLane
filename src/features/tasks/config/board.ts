import type { AuthUser } from '../../auth/model/auth';
import type { TaskPriority, TaskStatus } from '../model/task';

export const BOARD_COLUMNS: ReadonlyArray<{
  key: TaskStatus;
  title: string;
  hint: string;
}> = [
  { key: 'backlog', title: 'Backlog', hint: 'Ideas & upcoming work' },
  { key: 'todo', title: 'To Do', hint: 'Ready to get started' },
  { key: 'in_progress', title: 'In Progress', hint: 'Currently being worked on' },
  { key: 'done', title: 'Done', hint: 'Completed & shipped' },
];

export const PRIORITIES: ReadonlyArray<{ value: TaskPriority; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const TEAM = [
  { name: 'Emily Johnson', color: '#6548BD' },
  { name: 'Michael Chen', color: '#008DAB' },
  { name: 'Sarah Kim', color: '#D36B45' },
  { name: 'Alex Morgan', color: '#3B8B65' },
];

export function getTeam(user: AuthUser | null) {
  if (!user) return TEAM;
  const name = `${user.firstName} ${user.lastName}`.trim();
  if (!name || TEAM.some(member => member.name === name)) return TEAM;
  return [{ name, color: '#6548BD' }, ...TEAM];
}

