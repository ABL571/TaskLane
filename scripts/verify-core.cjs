/* Dependency-free domain and persistence tests; requires only TypeScript CLI. */
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { existsSync, mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');
const project = resolve(__dirname, '..');
const dest = mkdtempSync(join(tmpdir(), 'tasklane-test-'));
const localTsc = join(project, 'node_modules', '.bin', process.platform === 'win32' ? 'tsc.cmd' : 'tsc');
const compiled = (path) => require(join(dest, 'features', 'tasks', path));
try {
  execFileSync(existsSync(localTsc) ? localTsc : 'tsc', [
    '--target', 'ES2022', '--module', 'commonjs', '--moduleResolution', 'node',
    '--rootDir', 'src', '--outDir', dest, '--strict', '--skipLibCheck',
    'src/features/tasks/model/task.ts',
    'src/features/tasks/model/taskUtils.ts',
    'src/features/tasks/model/taskActions.ts',
    'src/features/tasks/repositories/taskRepository.ts',
  ], { cwd: project, stdio: 'inherit' });
  const { moveTask, filterTasks, taskStats, sortTasks } = compiled('model/taskUtils.js');
  const { upsertTask, removeTask } = compiled('model/taskActions.js');
  const { readTasks, saveTasks } = compiled('repositories/taskRepository.js');
  const sample = (id, status, order) => ({ id, code: `TL-${id}`, title: `Task ${id}`, description: 'Test',
    priority: 'high', status, dueDate: '2026-11-15', assignee: 'Emily Johnson', order,
    createdAt: '2026-11-01', updatedAt: '2026-11-01' });
  const first = [sample('A', 'backlog', 0), sample('B', 'backlog', 1), sample('C', 'todo', 0)];

  let result = moveTask(first, 'A', 'C');
  assert.equal(result.find(t => t.id === 'A').status, 'todo', 'Cross-column move updates status');
  assert.deepEqual(sortTasks(result.filter(t => t.status === 'todo')).map(t => t.id), ['A', 'C']);
  result = moveTask(first, 'A', 'column:done');
  assert.equal(result.find(t => t.id === 'A').status, 'done', 'Empty column drop works');
  result = moveTask(first, 'A', 'B');
  assert.deepEqual(sortTasks(result.filter(t => t.status === 'backlog')).map(t => t.id), ['B', 'A']);
  result = moveTask(first, 'B', 'column:backlog');
  assert.deepEqual(sortTasks(result.filter(t => t.status === 'backlog')).map(t => t.id), ['A', 'B']);
  assert.equal(moveTask(first, 'bad-id', 'C'), first, 'Unknown dragged task ignored');
  assert.equal(moveTask(first, 'A', 'unknown'), first, 'Unknown target ignored');

  const filtered = filterTasks(first, { search: 'task a', priority: 'high', assignee: 'Emily Johnson',
    dueDate: '2026-11-15', status: 'backlog' });
  assert.deepEqual(filtered.map(t => t.id), ['A'], 'Combined filters work');
  assert.equal(taskStats(first).total, 3);
  assert.equal(taskStats(first).backlog, 2);
  assert.equal(taskStats(first).inProgress, 0);
  assert.equal(taskStats(first).completed, 0);

  const input = { title: 'New task', description: 'Verified', priority: 'medium', status: 'todo', dueDate: '2026-12-20' };
  result = upsertTask(first, input);
  assert.equal(result.length, 4);
  const created = result.at(-1);
  assert.match(created.code, /^TL-\d+$/);
  assert.equal(created.title, 'New task');
  assert.equal(created.order, 1);
  assert.ok(created.id);
  result = upsertTask(result, { ...input, title: 'Edited', status: 'done' }, created.id);
  assert.equal(result.find(t => t.id === created.id).title, 'Edited');
  assert.equal(result.find(t => t.id === created.id).status, 'done');
  assert.equal(result.find(t => t.id === created.id).order, 0);
  assert.equal(upsertTask(first, input, 'non-existent'), first);
  result = removeTask(result, created.id);
  assert.equal(result.length, 3);
  assert.equal(result.some(t => t.id === created.id), false);

  const memory = new Map();
  global.localStorage = {
    getItem: key => memory.get(key) ?? null,
    setItem: (key, value) => { memory.set(key, String(value)); },
    removeItem: key => { memory.delete(key); },
  };
  assert.equal(saveTasks(1, first), true);
  assert.deepEqual(readTasks(1), first, 'Same user retrieves saved tasks');
  assert.equal(readTasks(2).length, 10, 'Different user receives independent demo data');
  memory.set('tasklane_tasks_v1_user_1', 'not-json');
  assert.equal(readTasks(1).length, 10, 'Corrupt storage falls back to demo safely');
  global.localStorage = { getItem: () => { throw Error('blocked'); }, setItem: () => { throw Error('blocked'); } };
  assert.equal(saveTasks(1, first), false, 'Storage errors are reported');
  assert.equal(readTasks(1).length, 10, 'Disabled storage does not crash');
  console.log('PASS: drag/drop, reorder, search/filter, stats, task CRUD, user isolation, persistence/failure handling.');
} finally {
  rmSync(dest, { recursive: true, force: true });
}
