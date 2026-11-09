import { useCallback, useEffect, useState } from 'react';
import { getDemoTasks } from '../data/demoTasks';
import { removeTask, upsertTask } from '../model/taskActions';
import { moveTask } from '../model/taskUtils';
import { readTasks, saveTasks } from '../repositories/taskRepository';
import type { Task, TaskInput } from '../model/task';

/** Task state is scoped to one authenticated user and saved after every change. */
export function useLocalTasks(userId: number) {
  const [tasks, setTasks] = useState<Task[]>(() => readTasks(userId));
  const [storageError, setStorageError] = useState(false);

  useEffect(() => { setStorageError(!saveTasks(userId, tasks)); }, [tasks, userId]);
  const saveTask = useCallback((input: TaskInput, id?: string) => {
    setTasks(previous => upsertTask(previous, input, id));
  }, []);
  const deleteTask = useCallback((id: string) => {
    setTasks(previous => removeTask(previous, id));
  }, []);
  const moveTaskCard = useCallback((activeId: string, overId: string) => {
    setTasks(previous => moveTask(previous, activeId, overId));
  }, []);
  const resetDemo = useCallback(() => setTasks(getDemoTasks()), []);
  return { tasks, storageError, saveTask, deleteTask, moveTaskCard, resetDemo };
}
