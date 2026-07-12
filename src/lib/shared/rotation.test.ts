import { describe, it, expect } from 'vitest';
import {
  selectTodaysLearningExercises,
  selectTodaysLearningExercisesVersioned,
  DAILY_EXERCISE_LIMIT,
  UnsupportedRotationAlgorithmError
} from '@/lib/shared/rotation';
import type { CatalogueEntry, Learner } from '@/lib/shared/types';

function entry(id: string, sortOrder: number, learner: Learner, status: 'rotation' | 'permanent'): CatalogueEntry {
  return {
    id,
    title: id,
    learnerScope: [learner],
    subject: 'matemaatika',
    topic: id,
    category: id,
    routePath: '/x',
    sortOrder,
    childStatus: { kiur: learner === 'kiur' ? status : null, kirsi: learner === 'kirsi' ? status : null }
  };
}

const pool: CatalogueEntry[] = Array.from({ length: 8 }, (_, i) => entry(`kiur.${i}`, 100 + i, 'kiur', 'rotation'));

describe('selectTodaysLearningExercises', () => {
  it('is stable for the same child/date/catalogue', () => {
    const a = selectTodaysLearningExercises(pool, 'kiur', '2026-07-11');
    const b = selectTodaysLearningExercises(pool, 'kiur', '2026-07-11');
    expect(a.map((e) => e.id)).toEqual(b.map((e) => e.id));
    expect(a).toHaveLength(DAILY_EXERCISE_LIMIT);
  });

  it('can change on the next date', () => {
    const today = selectTodaysLearningExercises(pool, 'kiur', '2026-07-11').map((e) => e.id).join(',');
    // Find at least one different subsequent day (deterministic reshuffle).
    const changed = ['2026-07-12', '2026-07-13', '2026-07-14', '2026-07-15']
      .some((d) => selectTodaysLearningExercises(pool, 'kiur', d).map((e) => e.id).join(',') !== today);
    expect(changed).toBe(true);
  });

  it('keeps Kiur and Kirsi independent', () => {
    const mixed = [...pool, ...Array.from({ length: 6 }, (_, i) => entry(`kirsi.${i}`, 300 + i, 'kirsi', 'rotation'))];
    const kiur = selectTodaysLearningExercises(mixed, 'kiur', '2026-07-11');
    const kirsi = selectTodaysLearningExercises(mixed, 'kirsi', '2026-07-11');
    expect(kiur.every((e) => e.id.startsWith('kiur.'))).toBe(true);
    expect(kirsi.every((e) => e.id.startsWith('kirsi.'))).toBe(true);
  });

  it('always includes permanent exercises', () => {
    const withPermanent = [entry('kiur.perm', 50, 'kiur', 'permanent'), ...pool];
    for (const date of ['2026-07-11', '2026-07-12', '2026-07-13']) {
      const chosen = selectTodaysLearningExercises(withPermanent, 'kiur', date).map((e) => e.id);
      expect(chosen).toContain('kiur.perm');
      expect(chosen.length).toBeLessThanOrEqual(DAILY_EXERCISE_LIMIT);
    }
  });

  it('honours the daily limit carried by a catalogue grant', () => {
    const chosen = selectTodaysLearningExercisesVersioned({
      exercises: pool,
      learner: 'kiur',
      date: '2026-07-11',
      limit: 2,
      algorithmVersion: 1,
      catalogueVersion: 'catalogue-a'
    });
    expect(chosen).toHaveLength(2);
  });

  it('fails closed for an unsupported catalogue algorithm', () => {
    expect(() => selectTodaysLearningExercisesVersioned({
      exercises: pool,
      learner: 'kiur',
      date: '2026-07-11',
      limit: 4,
      algorithmVersion: 99,
      catalogueVersion: 'future'
    })).toThrow(UnsupportedRotationAlgorithmError);
  });
});
