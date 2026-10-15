// Writes src/data/kiurLoodusopetusRunnerTasks.json: the science tasks as the
// runner needs them, without the dataset metadata and the authoring-only task
// fields. The runner loads it lazily; the server keeps reading the full
// dataset. Run after editing src/data/kiurLoodusopetusTasks.json:
//   node scripts/project-science-tasks.mjs
// (src/lib/loodusopetus/runnerTasks.test.ts fails while the two disagree.)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

// Never read by the client: authoring notes and values every task shares.
export const RUNNER_OMITTED_TASK_FIELDS = ['interactiveIdea', 'gradeBand', 'targetLearner'];

export function projectScienceRunnerTasks(dataset) {
  return dataset.tasks.map((task) => Object.fromEntries(
    Object.entries(task).filter(([key]) => !RUNNER_OMITTED_TASK_FIELDS.includes(key))
  ));
}

export function serializeRunnerTasks(tasks) {
  return `${JSON.stringify(tasks, null, 2)}\n`;
}

const self = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === self) {
  const here = dirname(self);
  const source = join(here, '..', 'src', 'data', 'kiurLoodusopetusTasks.json');
  const target = join(here, '..', 'src', 'data', 'kiurLoodusopetusRunnerTasks.json');
  const tasks = projectScienceRunnerTasks(JSON.parse(readFileSync(source, 'utf-8')));
  writeFileSync(target, serializeRunnerTasks(tasks));
  console.log(`[project-science-tasks] wrote ${tasks.length} tasks to src/data/kiurLoodusopetusRunnerTasks.json`);
}
