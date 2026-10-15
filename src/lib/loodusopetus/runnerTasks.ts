import runnerTasks from '@/data/kiurLoodusopetusRunnerTasks.json';
import type { ScienceTask } from './types';
import { pickScienceSessionFrom } from './session';

// The science runner's copy of the task pool: the full dataset minus its
// metadata and authoring-only task fields (scripts/project-science-tasks.mjs).
// The runner imports this module lazily, when a new run starts, so its route
// does not carry the pool; the service worker precaches the chunk.
export const RUNNER_SCIENCE_TASKS = runnerTasks as unknown as ScienceTask[];

export function pickRunnerScienceSession(count: number, seed: number): ScienceTask[] {
  return pickScienceSessionFrom(RUNNER_SCIENCE_TASKS, count, seed);
}
