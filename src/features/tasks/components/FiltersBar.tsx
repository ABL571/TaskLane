import { ClearOutlined, FilterOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { BOARD_COLUMNS, getTeam, PRIORITIES } from '../config/board';
import { useAuth } from '../../auth/hooks/useAuth';
import { DEFAULT_FILTERS, type TaskFilters } from '../model/taskUtils';
import type { TaskPriority, TaskStatus } from '../model/task';

export function FiltersBar({ filters, onChange, expanded, onToggleExpanded }: {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  const { user } = useAuth();
  const update = (patch: Partial<TaskFilters>) => onChange({ ...filters, ...patch });
  const activeCount = Number(filters.priority !== 'all') + Number(filters.assignee !== 'all') + Number(Boolean(filters.dueDate)) + Number(filters.status !== 'all');
  const hasFilters = filters.search.trim() !== '' || activeCount > 0;
  const myName = user ? `${user.firstName} ${user.lastName}` : '';
  const mineSelected = !!myName && filters.assignee === myName;
  return (
    <div className="jira-filter-wrap">
      <div className="jira-toolbar">
        <Input className="jira-board-search" aria-label="Search tasks by title" prefix={<SearchOutlined />} placeholder="Search board" value={filters.search} allowClear onChange={event => update({ search: event.target.value })} />
        <TooltiplessAvatar userName={myName} active={mineSelected} onClick={() => update({ assignee: mineSelected ? 'all' : myName })} />
        <Button className={`jira-filter-button ${expanded || activeCount > 0 ? 'is-active' : ''}`} icon={<FilterOutlined />} onClick={onToggleExpanded} aria-expanded={expanded}>Filter {activeCount > 0 ? <span className="jira-filter-count">{activeCount}</span> : null}</Button>
        <Button type="text" className="jira-clear-button" icon={<ClearOutlined />} onClick={() => onChange({ ...DEFAULT_FILTERS })} disabled={!hasFilters}>Clear filters</Button>
        <span className="jira-toolbar-spacer" />
        <span className="jira-group-chip">Group: Sprint</span>
      </div>
      {expanded && (
        <div className="jira-filter-panel" aria-label="Advanced board filters">
          <Select aria-label="Filter priority" value={filters.priority} onChange={value => update({ priority: value as TaskPriority | 'all' })} options={[{ value: 'all', label: 'All priorities' }, ...PRIORITIES.map(p => ({ value: p.value, label: p.label }))]} />
          <Select aria-label="Filter assignee" value={filters.assignee} onChange={value => update({ assignee: value })} options={[{ value: 'all', label: 'All assignees' }, { value: 'unassigned', label: 'Unassigned' }, ...getTeam(user).map(person => ({ value: person.name, label: person.name }))]} />
          <Select aria-label="Filter status" value={filters.status} onChange={value => update({ status: value as TaskStatus | 'all' })} options={[{ value: 'all', label: 'All statuses' }, ...BOARD_COLUMNS.map(s => ({ value: s.key, label: s.title }))]} />
          <DatePicker aria-label="Filter due date" placeholder="Due date" value={filters.dueDate ? dayjs(filters.dueDate) : null} format="DD MMM YYYY" onChange={date => update({ dueDate: date?.format('YYYY-MM-DD') ?? '' })} />
        </div>
      )}
    </div>
  );
}

function TooltiplessAvatar({ userName, active, onClick }: { userName: string; active: boolean; onClick: () => void }) {
  return <button type="button" className={`jira-assign-me ${active ? 'is-active' : ''}`} onClick={onClick} disabled={!userName} title={active ? 'Show all assignees' : 'Show tasks assigned to me'} aria-pressed={active}><UserOutlined /><span>Assigned to me</span></button>;
}
