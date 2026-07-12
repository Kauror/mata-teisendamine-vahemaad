import { seededRng, shuffleWithRng } from '@/lib/random';
import type { Learner, LearningExerciseStatus } from '@/lib/shared/types';

// The daily rotation lives here (client-safe, no `db` import) so the server and
// the offline client compute the SAME selection. Seed = `${learner}:${date}` so
// the same child on the same Tallinn date and catalogue always sees the same
// cards, and the next date deterministically reshuffles. Never uses Math.random.

export const DAILY_EXERCISE_LIMIT = 4;

type Rotatable = { id: string; sortOrder: number; childStatus: Record<Learner, LearningExerciseStatus | null> };

export type RotationRequest<T extends Rotatable> = {
  exercises: T[];
  learner: Learner;
  date: string;
  limit: number;
  algorithmVersion: number;
  catalogueVersion: string;
};

export class UnsupportedRotationAlgorithmError extends Error {
  constructor(readonly algorithmVersion: number) {
    super(`Unsupported exercise rotation algorithm: ${algorithmVersion}`);
    this.name = 'UnsupportedRotationAlgorithmError';
  }
}

export function isSupportedRotationAlgorithm(version: number): version is 1 {
  return version === 1;
}

function seedFor(learner: Learner, date: string) {
  let seed = 0;
  const source = `${learner}:${date}`;
  for (let i = 0; i < source.length; i++) seed = (Math.imul(seed, 31) + source.charCodeAt(i)) >>> 0;
  return seed;
}

// Every permanent exercise for the child, plus a daily-stable sample of the
// rotation pool, capped at `limit` total, ordered by sortOrder.
function selectVersion1<T extends Rotatable>(
  exercises: T[],
  learner: Learner,
  date: string,
  limit = DAILY_EXERCISE_LIMIT
): T[] {
  const available = exercises.filter((exercise) => {
    const status = exercise.childStatus[learner];
    return status === 'rotation' || status === 'permanent';
  });
  const permanents = available.filter((exercise) => exercise.childStatus[learner] === 'permanent');
  const rotation = available.filter((exercise) => exercise.childStatus[learner] === 'rotation');

  const remaining = Math.max(0, limit - permanents.length);
  const rotated = shuffleWithRng(seededRng(seedFor(learner, date)), rotation).slice(0, remaining);

  const chosen = new Set([...permanents, ...rotated].map((exercise) => exercise.id));
  return available.filter((exercise) => chosen.has(exercise.id)).sort((a, b) => a.sortOrder - b.sortOrder);
}

// Version-dispatched entry point used by downloaded catalogues. Older devices
// keep the exact v1 ordering while an unsupported future catalogue fails closed
// instead of silently selecting a different set of exercises.
export function selectTodaysLearningExercisesVersioned<T extends Rotatable>(request: RotationRequest<T>): T[] {
  if (!isSupportedRotationAlgorithm(request.algorithmVersion)) {
    throw new UnsupportedRotationAlgorithmError(request.algorithmVersion);
  }
  // catalogueVersion is intentionally part of the compatibility envelope even
  // though v1's historical seed is learner/date only. A later algorithm may use
  // it without changing the meaning of already-issued v1 catalogues.
  return selectVersion1(request.exercises, request.learner, request.date, request.limit);
}

export function selectTodaysLearningExercises<T extends Rotatable>(
  exercises: T[],
  learner: Learner,
  date: string,
  limit = DAILY_EXERCISE_LIMIT
): T[] {
  return selectTodaysLearningExercisesVersioned({
    exercises,
    learner,
    date,
    limit,
    algorithmVersion: 1,
    catalogueVersion: 'legacy'
  });
}
