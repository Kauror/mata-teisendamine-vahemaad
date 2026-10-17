import { describe, expect, it } from 'vitest';
import { childExerciseCards, FIXED_CHILD_EXERCISES, isArchivedExercise } from '@/lib/childExerciseCards';
import type { CatalogueEntry, Learner, LearningExerciseStatus } from '@/lib/shared/types';

const SCIENCE_ID = 'kiur.science.loodusopetus';

function entry(
  id: string,
  learner: Learner,
  status: LearningExerciseStatus,
  overrides: Partial<CatalogueEntry> = {}
): CatalogueEntry {
  return {
    id,
    title: id,
    learnerScope: [learner],
    subject: 'matemaatika',
    topic: 'arvutamine',
    category: 'Segaharjutus',
    routePath: '/test',
    sortOrder: 100,
    childStatus: { kiur: learner === 'kiur' ? status : null, kirsi: learner === 'kirsi' ? status : null },
    ...overrides
  };
}

function science(status: LearningExerciseStatus): CatalogueEntry {
  return entry(SCIENCE_ID, 'kiur', status, {
    subject: 'loodusopetus',
    topic: 'segaharjutus',
    category: 'Loodusõpetus',
    routePath: '/kiur/loodusopetus',
    sortOrder: 610
  });
}

const ids = (cards: ReturnType<typeof childExerciseCards>) => cards.map((card) => card.id);

// The mixed Loodusõpetus exercise is archived (Kiur's Loodusõpetus is now the
// textbook course). Whatever the catalogue or the rotation says, it is never a
// card, so Kiur never sees two Loodusõpetus cards.
describe('childExerciseCards archived fixed runner', () => {
  it('marks the mixed science exercise as archived', () => {
    expect(isArchivedExercise(SCIENCE_ID)).toBe(true);
    expect(FIXED_CHILD_EXERCISES.kiur.find((exercise) => exercise.id === SCIENCE_ID)?.archived).toBe(true);
    expect(isArchivedExercise('kiur.math.a')).toBe(false);
  });

  it('is not shown offline before the first catalogue hydration', () => {
    expect(ids(childExerciseCards('kiur', []))).not.toContain(SCIENCE_ID);
    expect(ids(childExerciseCards('kirsi', []))).not.toContain(SCIENCE_ID);
  });

  it('is not shown even when an older catalogue still has it as permanent', () => {
    const catalogue = [science('permanent'), entry('kiur.math.a', 'kiur', 'rotation')];
    expect(ids(childExerciseCards('kiur', [entry('kiur.math.a', 'kiur', 'rotation')], catalogue))).toEqual(['kiur.math.a']);
  });

  it('is not shown even when an older catalogue rotation selected it', () => {
    const catalogue = [science('rotation'), entry('kiur.math.a', 'kiur', 'rotation')];
    expect(ids(childExerciseCards('kiur', [science('rotation'), entry('kiur.math.a', 'kiur', 'rotation')], catalogue))).toEqual(['kiur.math.a']);
  });

  it('stays out when hidden as well', () => {
    const catalogue = [science('hidden')];
    expect(ids(childExerciseCards('kiur', [science('hidden')], catalogue))).toEqual([]);
  });
});
