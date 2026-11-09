import { createContext, type ReactNode } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useLocalTasks } from '../hooks/useLocalTasks';

export type TaskContextValue = ReturnType<typeof useLocalTasks>;
export const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  // ProtectedRoute mounts this provider only after authentication succeeds.
  const state = useLocalTasks(user?.id ?? 0);
  return <TaskContext.Provider value={state}>{children}</TaskContext.Provider>;
}
