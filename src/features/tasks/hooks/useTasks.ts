import { useContext } from 'react';
import { TaskContext } from '../context/TaskProvider';

export function useTasks() {
  const value = useContext(TaskContext);
  if (!value) throw new Error('useTasks must be called inside TaskProvider');
  return value;
}
