import { describe, expect, it } from 'vitest';
import { childExerciseCards } from '@/lib/childExerciseCards';
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

describe('childExerciseCards fixed runners', () => {
  it('keeps the fixed science card when no catalogue is available', () => {
    // Offline before the first catalogue hydration: the card is the fallback.
    expect(ids(childExerciseCards('kiur', []))).toContain(SCIENCE_ID);
    expect(ids(childExerciseCards('kirsi', []))).not.toContain(SCIENCE_ID);
  });

  it('keeps it when the catalogue says it is permanent but rotation did not pick it', () => {
    const catalogue = [science('permanent'), entry('kiur.math.a', 'kiur', 'rotation')];
    expect(ids(childExerciseCards('kiur', [entry('kiur.math.a', 'kiur', 'rotation')], catalogue))).toContain(SCIENCE_ID);
  });

  it('drops it once the parent hides it', () => {
    // The rotation already excludes a hidden exercise, so before this the card
    // was added straight back and the child got a fifth card that could only
    // produce an attempt held for parent review.
    const catalogue = [science('hidden'), entry('kiur.math.a', 'kiur', 'rotation')];
    const cards = childExerciseCards('kiur', [entry('kiur.math.a', 'kiur', 'rotation')], catalogue);
    expect(ids(cards)).not.toContain(SCIENCE_ID);
    expect(ids(cards)).toEqual(['kiur.math.a']);
  });

  it('never leaks a hidden fixed card in through the daily selection either', () => {
    const catalogue = [science('hidden')];
    expect(ids(childExerciseCards('kiur', [science('hidden')], catalogue))).toEqual([]);
  });
});
