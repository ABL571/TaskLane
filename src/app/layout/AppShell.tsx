import {
  AppstoreOutlined, BarsOutlined, CheckSquareOutlined, DashboardOutlined,
  LeftOutlined, RightOutlined,
  InfoCircleOutlined, LogoutOutlined, MenuOutlined, PlusOutlined,
  SearchOutlined, SettingOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Drawer, Dropdown, Input, Modal, Tooltip, type MenuProps } from 'antd';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { initials } from '../../shared/utils/initials';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useTasks } from '../../features/tasks/hooks/useTasks';

const menuLinks = [
  { path: '/dashboard', label: 'Active sprints', icon: <DashboardOutlined /> },
  { path: '/my-tasks', label: 'My tasks', icon: <CheckSquareOutlined /> },
  { path: '/settings', label: 'Settings', icon: <SettingOutlined /> },
];

function WorkspaceNav({ onNavigate }: { onNavigate: () => void }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const signOut = () => { logout(); onNavigate(); navigate('/login', { replace: true }); };
  return (
    <div className="jira-drawer-body">
      <div className="jira-drawer-title"><span className="jira-project-mark"><BarsOutlined /></span><div><strong>Tasklane Software</strong><small>Software project</small></div></div>
      <div className="jira-drawer-label">PROJECT</div>
      {menuLinks.map(item => <NavLink key={item.path} className={({ isActive }) => `jira-drawer-link ${isActive ? 'selected' : ''}`} to={item.path} onClick={onNavigate}>{item.icon}{item.label}</NavLink>)}
      <div className="jira-drawer-footer"><span>{user?.email}</span><button type="button" onClick={signOut}><LogoutOutlined /> Log out</button></div>
    </div>
  );
}

export function AppShell() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  // Keep the Jira-style board wide while showing a real desktop navigation rail.
  const [sidebarCompact, setSidebarCompact] = useState(true);
  const [search, setSearch] = useState('');
  const { user, logout } = useAuth();
  const { storageError } = useTasks();
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/login', { replace: true }); };
  const menu: MenuProps['items'] = [
    { key: 'profile', label: user?.email || user?.username || 'Signed in', disabled: true },
    { type: 'divider' },
    { key: 'my-tasks', label: 'My tasks', icon: <CheckSquareOutlined />, onClick: () => navigate('/my-tasks') },
    { key: 'settings', label: 'Settings', icon: <SettingOutlined />, onClick: () => navigate('/settings') },
    { type: 'divider' },
    { key: 'logout', label: 'Log out', icon: <LogoutOutlined />, onClick: signOut },
  ];
  const runSearch = () => { navigate(search.trim() ? `/dashboard?q=${encodeURIComponent(search.trim())}` : '/dashboard'); };
  const toggleNavigation = () => {
    if (window.matchMedia('(max-width: 850px)').matches) setNavigationOpen(true);
    else setSidebarCompact(previous => !previous);
  };
  return (
    <div className="jira-app">
      <header className="jira-global-header">
        <div className="jira-header-leading">
          <Tooltip title="Toggle navigation"><Button type="text" className="jira-header-icon" aria-label="Toggle navigation" icon={<MenuOutlined />} onClick={toggleNavigation} /></Tooltip>
          <Tooltip title="Workspaces"><Button type="text" className="jira-header-icon jira-grid-icon" aria-label="Open workspaces" icon={<AppstoreOutlined />} onClick={() => setNavigationOpen(true)} /></Tooltip>
          <button type="button" className="jira-global-brand" onClick={() => navigate('/dashboard')} aria-label="Tasklane home">
            <span className="jira-brand-logo"><BarsOutlined /></span><strong>tasklane</strong>
          </button>
        </div>
        <div className="jira-global-search"><Input aria-label="Search board" placeholder="Search" prefix={<SearchOutlined />} value={search} onChange={event => setSearch(event.target.value)} onPressEnter={runSearch} allowClear /></div>
        <Button type="primary" className="jira-global-create" icon={<PlusOutlined />} onClick={() => navigate('/dashboard?create=1')}>Create</Button>
        <div className="jira-header-trailing">
          {storageError && <Tooltip title="Local storage is full or unavailable; changes might not persist"><span className="jira-storage-alert"><InfoCircleOutlined /> Storage</span></Tooltip>}
          <Tooltip title="How this board works"><Button type="text" aria-label="Board help" className="jira-header-icon" icon={<InfoCircleOutlined />} onClick={() => Modal.info({ title: 'Using your Kanban board', content: 'Drag a card by its handle to change status or order. Click any card to edit its details. Your tasks are saved locally in this browser.', okText: 'Got it' })} /></Tooltip>
          <Tooltip title="Settings"><Button type="text" aria-label="Settings" className="jira-header-icon" icon={<SettingOutlined />} onClick={() => navigate('/settings')} /></Tooltip>
          <Dropdown trigger={['click']} menu={{ items: menu }} placement="bottomRight">
            <button type="button" className="jira-avatar-button" aria-label="Account menu"><Avatar size={30} src={user?.image} style={{ background: '#253858' }}>{initials(`${user?.firstName ?? ''} ${user?.lastName ?? ''}`)}</Avatar></button>
          </Dropdown>
        </div>
      </header>
      <Drawer title="Your workspace" placement="left" open={navigationOpen} width={280} onClose={() => setNavigationOpen(false)} styles={{ body: { padding: 0 } }}>
        <WorkspaceNav onNavigate={() => setNavigationOpen(false)} />
      </Drawer>
      <div className="jira-app-layout">
        <aside className={`jira-sidebar ${sidebarCompact ? 'is-compact' : ''}`} aria-label="Project sidebar navigation">
          <div className="jira-sidebar-project">
            <span className="jira-project-mark"><BarsOutlined /></span>
            {!sidebarCompact && <span className="jira-sidebar-project-text"><strong>Tasklane Software</strong><small>Software project</small></span>}
          </div>
          <nav className="jira-sidebar-links" aria-label="Project pages">
            {menuLinks.map(item =>
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                title={sidebarCompact ? item.label : undefined}
                className={({ isActive }) => `jira-sidebar-link ${isActive ? 'is-active' : ''}`}
                aria-label={item.label}
              >{item.icon}{!sidebarCompact && <span>{item.label}</span>}</NavLink>
            )}
          </nav>
          <div className="jira-sidebar-bottom">
            <button type="button" className="jira-sidebar-collapse" onClick={() => setSidebarCompact(previous => !previous)} aria-label={sidebarCompact ? 'Expand sidebar' : 'Collapse sidebar'} title={sidebarCompact ? 'Expand sidebar' : 'Collapse sidebar'}>
              {sidebarCompact ? <RightOutlined /> : <LeftOutlined />}
              {!sidebarCompact && <span>Collapse sidebar</span>}
            </button>
            <button type="button" className="jira-sidebar-signout" onClick={signOut} title="Log out" aria-label="Log out">
              <LogoutOutlined />{!sidebarCompact && <span>Log out</span>}
            </button>
          </div>
        </aside>
        <main className="jira-page"><Outlet /></main>
      </div>
    </div>
  );
}
