import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import rawDataset from '@/data/kiurLoodusopetusTasks.json';
import { RUNNER_OMITTED_TASK_FIELDS, projectScienceRunnerTasks, serializeRunnerTasks } from '../../../scripts/project-science-tasks.mjs';
import { LOODUSOPETUS_TASKS, pickScienceSession } from './tasks';
import { RUNNER_SCIENCE_TASKS, pickRunnerScienceSession } from './runnerTasks';

describe('science runner task pool (EX-12)', () => {
  it('is the full dataset minus the authoring-only fields (run node scripts/project-science-tasks.mjs if not)', () => {
    const file = path.resolve(__dirname, '../../data/kiurLoodusopetusRunnerTasks.json');
    const onDisk = readFileSync(file, 'utf-8').replace(/\r\n/g, '\n');
    expect(onDisk).toBe(serializeRunnerTasks(projectScienceRunnerTasks(rawDataset)));
  });

  it('keeps every task, in order, with every field the runner reads', () => {
    expect(RUNNER_SCIENCE_TASKS.map((task) => task.id)).toEqual(LOODUSOPETUS_TASKS.map((task) => task.id));
    RUNNER_SCIENCE_TASKS.forEach((task, index) => {
      const full = { ...LOODUSOPETUS_TASKS[index] } as Record<string, unknown>;
      for (const field of RUNNER_OMITTED_TASK_FIELDS) delete full[field];
      expect(task).toEqual(full);
    });
  });

  it.each([[10, 1], [10, 42], [25, 7], [25, 1_760_000_000_000]])('picks the same %i tasks for seed %i as the full pool', (count, seed) => {
    expect(pickRunnerScienceSession(count, seed).map((task) => task.id)).toEqual(pickScienceSession(count, seed).map((task) => task.id));
  });
});
