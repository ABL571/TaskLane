import { DatabaseOutlined, ReloadOutlined, SafetyCertificateOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Button, Popconfirm, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { initials } from '../../../shared/utils/initials';
import { useAuth } from '../../auth/hooks/useAuth';
import { useTasks } from '../../tasks/hooks/useTasks';

export function SettingsPage() {
  const { user } = useAuth();
  const { tasks, resetDemo } = useTasks();
  const navigate = useNavigate();
  const name = user ? `${user.firstName} ${user.lastName}` : 'Workspace member';
  const restoreDemo = () => { resetDemo(); message.success('Demo tasks restored.'); };
  return <>
    <div className="jira-project-heading"><div className="jira-breadcrumb">Spaces <span>/</span> Tasklane Software <span>/</span> Settings</div><div className="jira-project-title-row"><h1><SettingOutlined /> Project settings</h1></div><nav className="jira-project-tabs"><button type="button" onClick={() => navigate('/dashboard')}>Active sprints</button><button type="button" className="selected">Settings</button></nav></div>
    <div className="jira-settings-page">
      <section className="jira-settings-panel"><h2>My account</h2><p>Account details are provided by DummyJSON authentication.</p><div className="settings-account"><Avatar size={48} src={user?.image} style={{ background: '#0c66e4' }}>{initials(name)}</Avatar><div><strong>{name}</strong><span>{user?.email}</span><small>@{user?.username}</small></div></div></section>
      <section className="jira-settings-panel"><div className="jira-settings-split"><div><h2><DatabaseOutlined /> Local task storage</h2><p>You currently have <strong>{tasks.length}</strong> tasks. Every change is stored in this browser for your signed-in user.</p></div><Popconfirm title="Restore demo issues?" description="Your current tasks will be replaced. This cannot be undone." okText="Restore" onConfirm={restoreDemo}><Button icon={<ReloadOutlined />}>Restore demo tasks</Button></Popconfirm></div></section>
      <p className="jira-settings-footnote"><SafetyCertificateOutlined /> Authentication uses DummyJSON. For this practical test, tokens and tasks use localStorage. A production app should use a safer session strategy.</p>
    </div>
  </>;
}
