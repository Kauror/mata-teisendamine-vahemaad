import { shuffleWithSeed } from '@/lib/random';

type RunTask = { text: string; sourceCollection: string };

// Picks the tasks of one "Loe ja vasta" run from the shuffled bank: never two
// questions on the same text, and at most `perCollection` tasks from one
// collection (the bird columns, or one theme of the original stories), so a
// run mixes themes. If the rules leave the run short (a tiny bank), the rest
// is filled in shuffled order with tasks on texts not used yet.
export function pickKiurReadingRun<T extends RunTask>(tasks: readonly T[], seed: number, length: number, perCollection = 2): T[] {
  const shuffled = shuffleWithSeed(tasks, seed);
  const run: T[] = [];
  const texts = new Set<string>();
  const perSource = new Map<string, number>();
  for (const task of shuffled) {
    if (run.length === length) break;
    if (texts.has(task.text) || (perSource.get(task.sourceCollection) ?? 0) >= perCollection) continue;
    run.push(task);
    texts.add(task.text);
    perSource.set(task.sourceCollection, (perSource.get(task.sourceCollection) ?? 0) + 1);
  }
  for (const task of shuffled) {
    if (run.length === length) break;
    if (run.includes(task) || texts.has(task.text)) continue;
    run.push(task);
    texts.add(task.text);
  }
  return run;
}
