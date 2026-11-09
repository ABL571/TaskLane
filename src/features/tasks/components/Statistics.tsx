import { CheckCircleOutlined, ClockCircleOutlined, InboxOutlined, UnorderedListOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import { taskStats } from '../model/taskUtils';
import type { Task } from '../model/task';

function StatCard({ title, value, icon, kind, sub }: { title: string; value: number; icon: ReactNode; kind: string; sub: string }) {
  return (
    <div className="stat-card">
      <div className="stat-topline"><span>{title}</span><span className={`stat-icon stat-${kind}`}>{icon}</span></div>
      <strong className="stat-value">{value}</strong>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}

export function Statistics({ tasks }: { tasks: Task[] }) {
  const stats = taskStats(tasks);
  const progress = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
  return (
    <section className="stats-section" aria-label="Task statistics">
      <div className="stats-grid">
        <StatCard title="Total tasks" value={stats.total} icon={<UnorderedListOutlined />} kind="total" sub="Across all workflows" />
        <StatCard title="Backlog" value={stats.backlog} icon={<InboxOutlined />} kind="backlog" sub="Waiting to be planned" />
        <StatCard title="In progress" value={stats.inProgress} icon={<ClockCircleOutlined />} kind="progress" sub="Work in motion" />
        <StatCard title="Completed" value={stats.completed} icon={<CheckCircleOutlined />} kind="done" sub={`${progress}% completion rate`} />
      </div>
    </section>
  );
}
