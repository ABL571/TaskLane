import { Spin } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { TaskProvider } from '../features/tasks/context/TaskProvider';

export function ProtectedRoute() {
  const { user, initializing } = useAuth();
  if (initializing) return <div className="full-page-loading"><Spin size="large" tip="Loading your workspace..."><div className="loading-placeholder" /></Spin></div>;
  if (!user) return <Navigate to="/login" replace />;
  // Changing users remounts task state, preventing cross-user local data leaks.
  return <TaskProvider key={user.id}><Outlet /></TaskProvider>;
}
