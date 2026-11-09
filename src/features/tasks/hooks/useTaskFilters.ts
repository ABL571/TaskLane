import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_FILTERS, filterTasks } from '../model/taskUtils';
import type { Task } from '../model/task';

/** Keeps the global search query and the board's combined filters aligned. */
export function useTaskFilters(tasks: Task[]) {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS, search: searchParams.get('q') ?? '',
  }));
  const query = searchParams.get('q');
  useEffect(() => {
    setFilters(previous => previous.search === (query ?? '')
      ? previous : { ...previous, search: query ?? '' });
  }, [query]);
  const filtered = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);
  return { filters, setFilters, filtered };
}
