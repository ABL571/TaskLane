import { CalendarOutlined, CheckSquareFilled, HolderOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';
import type { CSSProperties, ReactNode } from 'react';
import { MemberAvatar } from './MemberAvatar';
import type { Task } from '../model/task';

const priorityLabel = { low: 'Low', medium: 'Medium', high: 'High' };
const statusLabel = { backlog: 'Backlog', todo: 'To Do', in_progress: 'In Progress', done: 'Done' };

export function TaskCardContent({ task, handle }: { task: Task; handle?: ReactNode }) {
  const overdue = task.status !== 'done' && dayjs(task.dueDate).isBefore(dayjs(), 'day');
  return <>
    <div className="jira-task-card-head"><span className="jira-issue-icon"><CheckSquareFilled /></span><span className="jira-issue-key">{task.code}</span><span className="jira-card-handle">{handle}</span></div>
    <div className="jira-card-title">{task.title}</div>
    <p className="jira-card-description">{task.description}</p>
    <div className="jira-card-meta"><span className={`jira-priority jira-priority-${task.priority}`}>{priorityLabel[task.priority]}</span><span className={`jira-card-status jira-card-status-${task.status}`}>{statusLabel[task.status]}</span></div>
    <div className="jira-card-footer"><span className={`jira-card-date ${overdue ? 'overdue' : ''}`}><CalendarOutlined /> {dayjs(task.dueDate).format('DD MMM')}</span><span className="jira-assignee"><span className="jira-assignee-name" title={task.assignee ?? "Unassigned"}>{task.assignee ?? "Unassigned"}</span><MemberAvatar name={task.assignee} size={24} /></span></div>
  </>;
}

export function SortableTaskCard({ task, onEdit }: { task: Task; onEdit: (task: Task) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, data: { type: 'task', status: task.status } });
  const style: CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 };
  return <article ref={setNodeRef} style={style} className={`jira-task-card jira-task-${task.priority} ${isDragging ? 'jira-card-dragging' : ''}`} onClick={() => onEdit(task)} onKeyDown={event => { if (event.key === 'Enter' && event.target === event.currentTarget) onEdit(task); }} tabIndex={0} role="button" aria-label={`Edit ${task.title}`}>
    <TaskCardContent task={task} handle={<button type="button" className="jira-drag-handle" aria-label={`Drag ${task.title}`} title="Drag to move" onClick={event => event.stopPropagation()} {...attributes} {...listeners}><HolderOutlined /></button>} />
  </article>;
}
