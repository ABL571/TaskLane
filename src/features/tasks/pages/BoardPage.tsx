import {
  AppstoreOutlined, BarsOutlined, CalendarOutlined, CheckSquareFilled, DownOutlined,
  EllipsisOutlined, LineChartOutlined, PlusOutlined, UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, Empty, Table, Tag, type TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiltersBar } from '../components/FiltersBar';
import { KanbanBoard } from '../components/KanbanBoard';
import { Statistics } from '../components/Statistics';
import { TaskModal } from '../components/TaskModal';
import { useAuth } from '../../auth/hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { taskStats } from '../model/taskUtils';
import { useTaskFilters } from '../hooks/useTaskFilters';
import type { Task, TaskStatus } from '../model/task';

type BoardView = 'board' | 'summary' | 'backlog' | 'list';
const isBoardView = (value: string | null): value is BoardView => value === 'summary' || value === 'backlog' || value === 'list' || value === 'board';

export function BoardPage({ mine = false }: { mine?: boolean }) {
  const { user } = useAuth();
  const { tasks, saveTask, deleteTask, moveTaskCard } = useTasks();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewParam = searchParams.get('view');
  const view: BoardView = isBoardView(viewParam) ? viewParam : 'board';
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [initialStatus, setInitialStatus] = useState<TaskStatus>('backlog');
  const currentName = user ? `${user.firstName} ${user.lastName}` : '';
  const scopedTasks = useMemo(() => mine ? tasks.filter(task => task.assignee === currentName) : tasks, [tasks, mine, currentName]);
  const { filters, setFilters, filtered } = useTaskFilters(scopedTasks);
  const stats = useMemo(() => taskStats(scopedTasks), [scopedTasks]);
  const activeViewTasks = view === 'backlog' && !mine ? filtered.filter(task => task.status === 'backlog') : filtered;

  useEffect(() => {
    if (searchParams.get('create') !== '1') return;
    setInitialStatus('todo'); setEditTask(null); setModalOpen(true);
    const next = new URLSearchParams(searchParams);
    next.delete('create');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const addTask = (status: TaskStatus = 'todo') => { setInitialStatus(status); setEditTask(null); setModalOpen(true); };
  const edit = (task: Task) => { setEditTask(task); setModalOpen(true); };
  const setView = (next: BoardView) => navigate(next === 'board' ? '/dashboard' : `/dashboard?view=${next}`);
  const columns: TableColumnsType<Task> = [
    { title: 'Key', dataIndex: 'code', key: 'code', width: 110, render: value => <span className="jira-list-key"><CheckSquareFilled /> {value}</span> },
    { title: 'Summary', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 140, render: (value: TaskStatus) => <Tag color={value === 'done' ? 'green' : value === 'in_progress' ? 'blue' : 'default'}>{value.replace('_', ' ').toUpperCase()}</Tag> },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', width: 100, render: value => <span className={`jira-list-priority jira-priority-${value}`}>{value}</span> },
    { title: 'Assignee', dataIndex: 'assignee', key: 'assignee', width: 160, render: value => value || 'Unassigned' },
    { title: 'Due date', dataIndex: 'dueDate', key: 'dueDate', width: 125, render: value => dayjs(value).format('DD MMM YYYY') },
    { title: '', key: 'actions', width: 72, render: (_, task) => <Button size="small" type="text" aria-label={`Edit ${task.title}`} icon={<EllipsisOutlined />} onClick={event => { event.stopPropagation(); edit(task); }} /> },
  ];

  return <>
    <div className="jira-project-heading">
      <div className="jira-breadcrumb">Spaces <span>/</span> Tasklane Software</div>
      <div className="jira-project-title-row"><div><h1>{mine ? 'My Tasks' : 'Tasklane Sprint'}</h1><span className="jira-project-caption">{mine ? 'Issues assigned to you' : 'Software project'}</span></div><div className="jira-project-actions"><Button icon={<PlusOutlined />} onClick={() => addTask()}>Add issue</Button></div></div>
      <nav className="jira-project-tabs" aria-label="Project views">
        <button className={!mine && view === 'summary' ? 'selected' : ''} onClick={() => setView('summary')} type="button"><LineChartOutlined /> Summary</button>
        <button className={!mine && view === 'backlog' ? 'selected' : ''} onClick={() => setView('backlog')} type="button"><BarsOutlined /> Backlog</button>
        <button className={!mine && view === 'board' ? 'selected' : ''} onClick={() => setView('board')} type="button"><AppstoreOutlined /> Active sprints</button>
        <button className={!mine && view === 'list' ? 'selected' : ''} onClick={() => setView('list')} type="button"><UnorderedListOutlined /> List</button>
        <button className={mine ? 'selected' : ''} onClick={() => navigate('/my-tasks')} type="button"><CheckSquareFilled /> My tasks</button>
        <button onClick={() => navigate('/settings')} type="button"><CalendarOutlined /> Settings</button>
      </nav>
    </div>

    <div className="jira-workspace-body">
      {view === 'summary' && !mine ? <section className="jira-summary-view"><div className="jira-section-heading"><h2>Project summary</h2><p>Live statistics calculated from your task data</p></div><Statistics tasks={scopedTasks} /><div className="jira-summary-bottom"><h3>Recent issues</h3><Table<Task> size="small" rowKey="id" columns={columns} dataSource={[...scopedTasks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6)} pagination={false} scroll={{ x: 730 }} onRow={task => ({ onClick: () => edit(task), style: { cursor: 'pointer' } })} /></div></section> : <>
        <div className="jira-control-row">
          <FiltersBar filters={filters} onChange={setFilters} expanded={filtersExpanded} onToggleExpanded={() => setFiltersExpanded(previous => !previous)} />
          <div className="jira-control-actions"><Button type="primary" onClick={() => setView('summary')}>Sprint overview</Button></div>
        </div>
        <div className="jira-metrics-strip" aria-label="Task statistics">
          <span><strong>{stats.total}</strong> Total tasks</span><span><strong>{stats.backlog}</strong> Backlog</span><span><strong>{stats.inProgress}</strong> In progress</span><span><strong>{stats.completed}</strong> Completed</span>
        </div>
        {view === 'list' || view === 'backlog' ? <section className="jira-list-view"><div className="jira-list-title"><h2>{view === 'backlog' ? 'Backlog issues' : 'All issues'}</h2><span>{activeViewTasks.length} issues</span></div><Table<Task> rowKey="id" size="middle" columns={columns} dataSource={activeViewTasks} pagination={{ pageSize: 10, hideOnSinglePage: true }} scroll={{ x: 850 }} locale={{ emptyText: <Empty description="No issues match your filters" /> }} onRow={task => ({ onClick: () => edit(task), style: { cursor: 'pointer' } })} /></section> : <>
          <button type="button" className="jira-sprint-row" aria-expanded={!collapsed} onClick={() => setCollapsed(previous => !previous)}><DownOutlined className={collapsed ? 'collapsed' : ''} /><span className="jira-sprint-icon">◆</span><strong>TL-100</strong><span>Tasklane Sprint</span><span className="jira-sprint-state">IN PROGRESS</span><span className="jira-sprint-total">{activeViewTasks.length} issues</span></button>
          {!collapsed && <KanbanBoard tasks={activeViewTasks} allTasks={scopedTasks} onMove={moveTaskCard} onEdit={edit} onAdd={addTask} />}
          {activeViewTasks.length === 0 && <div className="jira-no-results">No tasks match your filters. Clear filters or create a new task.</div>}
        </>}
      </>}
    </div>
    <TaskModal open={modalOpen} task={editTask} initialStatus={initialStatus} defaultAssignee={mine ? currentName : undefined} onSave={saveTask} onDelete={deleteTask} onClose={() => setModalOpen(false)} />
  </>;
}
