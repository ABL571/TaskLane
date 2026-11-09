import { PlusOutlined } from '@ant-design/icons';
import {
  closestCenter, DndContext, DragOverlay, pointerWithin, useDroppable,
  type CollisionDetection,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useKanbanDrag } from '../hooks/useKanbanDrag';
import { BOARD_COLUMNS } from '../config/board';
import { sortTasks } from '../model/taskUtils';
import type { Task, TaskStatus } from '../model/task';
import { SortableTaskCard, TaskCardContent } from './TaskCard';

const detectCollision: CollisionDetection = args => {
  const matches = pointerWithin(args);
  const taskMatches = matches.filter(match => !String(match.id).startsWith('column:'));
  return taskMatches.length ? taskMatches : matches.length ? matches : closestCenter(args);
};

function BoardColumn({ status, title, tasks, onEdit, onAdd }: {
  status: TaskStatus; title: string; tasks: Task[];
  onEdit: (task: Task) => void; onAdd: (status: TaskStatus) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `column:${status}`, data: { type: 'column', status } });
  const ordered = sortTasks(tasks);
  return <section className={`jira-board-column jira-column-${status}`} aria-label={`${title} column`}>
    <div className="jira-column-head"><div className="jira-column-title">{title}<span className="jira-column-count">{tasks.length}</span></div><button type="button" className="jira-column-add" aria-label={`Add task to ${title}`} onClick={() => onAdd(status)}><PlusOutlined /></button></div>
    <div ref={setNodeRef} className={`jira-column-droppable ${isOver ? 'is-over' : ''}`}>
      <SortableContext items={ordered.map(task => task.id)} strategy={verticalListSortingStrategy}>
        {ordered.map(task => <SortableTaskCard key={task.id} task={task} onEdit={onEdit} />)}
      </SortableContext>
      {ordered.length === 0 && <div className="jira-empty-column"><span>Drop an issue here</span><button type="button" onClick={() => onAdd(status)}><PlusOutlined /> Create issue</button></div>}
    </div>
    {ordered.length > 0 && <button type="button" className="jira-create-inline" onClick={() => onAdd(status)}><PlusOutlined /> Create issue</button>}
  </section>;
}

export function KanbanBoard({ tasks, allTasks, onMove, onEdit, onAdd }: {
  tasks: Task[]; allTasks: Task[]; onMove: (activeId: string, overId: string) => void;
  onEdit: (task: Task) => void; onAdd: (status: TaskStatus) => void;
}) {
  const { activeId, sensors, onDragStart, onDragEnd, onDragCancel } = useKanbanDrag(onMove);
  const activeTask = activeId ? allTasks.find(task => task.id === activeId) : null;
  return <DndContext sensors={sensors} collisionDetection={detectCollision} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
    <div className="jira-board-scroll" aria-label="Kanban board; scroll horizontally to see more columns">
      <div className="jira-board-grid">
        {BOARD_COLUMNS.map(column => <BoardColumn key={column.key} status={column.key} title={column.title} tasks={tasks.filter(task => task.status === column.key)} onEdit={onEdit} onAdd={onAdd} />)}
      </div>
    </div>
    <DragOverlay dropAnimation={null}>{activeTask ? <article className={`jira-task-card jira-task-${activeTask.priority} jira-card-overlay`}><TaskCardContent task={activeTask} /></article> : null}</DragOverlay>
  </DndContext>;
}
