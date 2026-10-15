import { seededRng, shuffleWithRng } from '@/lib/random';

// The dataset-free half of the science tasks: what the runner needs before
// (or without) loading the task pool itself.

// Only these two session lengths are offered to the child.
export const SCIENCE_SESSION_SIZES = [10, 25] as const;
export type ScienceSessionSize = (typeof SCIENCE_SESSION_SIZES)[number];

export function isScienceSessionSize(value: number): value is ScienceSessionSize {
  return (SCIENCE_SESSION_SIZES as readonly number[]).includes(value);
}

// Choice texts are written as sentences; the runner shows them without the
// trailing full stop, so saved answers are stored that way too.
export function cleanScienceAnswer(value: string) {
  return value.replace(/\s*\.\s*$/, '').trim();
}

// Picks `count` unique tasks from the pool, shuffled by a stable seed so a given
// seed always yields the same session (handy for retries and debugging).
export function pickScienceSessionFrom<T extends { id: string }>(pool: readonly T[], count: number, seed: number): T[] {
  const size = Math.max(1, Math.min(count, pool.length));
  const rng = seededRng(seed || 1);
  const shuffled = shuffleWithRng(rng, [...pool]);
  const session: T[] = [];
  const usedIds = new Set<string>();
  for (const task of shuffled) {
    if (usedIds.has(task.id)) continue;
    usedIds.add(task.id);
    session.push(task);
    if (session.length >= size) break;
  }
  return session;
}
