import { describe, expect, it } from 'vitest';
import { childExerciseCards } from '@/lib/childExerciseCards';
import { completedExerciseIdsFromAttempts } from '@/lib/exerciseCompletion';
import type { CatalogueEntry, Learner, LearningExerciseStatus } from '@/lib/shared/types';

function entry(id: string, learner: Learner, overrides: Partial<CatalogueEntry> = {}): CatalogueEntry {
  const status: LearningExerciseStatus = 'permanent';
  return {
    id,
    title: id,
    learnerScope: [learner],
    subject: 'matemaatika',
    topic: 'arvutamine',
    category: 'Segaülesanded',
    routePath: '/test',
    sortOrder: 100,
    childStatus: { kiur: learner === 'kiur' ? status : null, kirsi: learner === 'kirsi' ? status : null },
    ...overrides
  };
}

// Kirsi's four calculation cards are one topic split by category, exactly as
// STATIC_LEARNING_EXERCISES defines them. This shape is what made a single
// finished exercise tick all four boxes.
const KIRSI_MATH_MODES = [
  'Arvutamine 10 piires',
  'Arvutamine 20 piires',
  'Suurem või väiksem kuni 100',
  'Segaülesanded'
];

const kirsiCatalogue = [
  ...KIRSI_MATH_MODES.map((mode, index) => entry(`kirsi.math.arvutamine.${index + 1}`, 'kirsi', {
    title: mode,
    topic: 'arvutamine',
    category: mode,
    sortOrder: 300 + index
  })),
  entry('kirsi.math.counting-20', 'kirsi', { title: 'Loendamine', topic: 'loendamine', category: 'Loendamine' }),
  entry('kirsi.math.kellaaeg', 'kirsi', { title: 'Kellaaeg', topic: 'kellaaeg', category: 'Kellaaeg' })
];

const kirsiCards = childExerciseCards('kirsi', kirsiCatalogue);

const TODAY = new Date().toISOString();

describe('completedExerciseIdsFromAttempts', () => {
  it('marks only the calculation card the child actually finished', () => {
    const attempts = [{
      id: 1,
      createdAt: TODAY,
      learner: 'kirsi',
      subject: 'matemaatika',
      topic: 'arvutamine',
      category: 'Arvutamine 20 piires',
      exerciseId: 'kirsi.math.arvutamine.2'
    }];

    const completed = completedExerciseIdsFromAttempts(attempts, 'kirsi', kirsiCards);
    expect([...completed]).toEqual(['kirsi.math.arvutamine.2']);
  });

  it('still resolves a legacy attempt that predates exerciseId, using its category', () => {
    const attempts = [{
      id: 2,
      createdAt: TODAY,
      learner: 'kirsi',
      subject: 'matemaatika',
      topic: 'arvutamine',
      category: 'Suurem või väiksem kuni 100',
      exerciseId: null
    }];

    const completed = completedExerciseIdsFromAttempts(attempts, 'kirsi', kirsiCards);
    expect([...completed]).toEqual(['kirsi.math.arvutamine.3']);
  });

  it('marks nothing when an attempt cannot be attributed to a single card', () => {
    // No category to tell the four apart. Ticking all four is worse than
    // ticking none: the child loses three exercises they never did.
    const attempts = [{
      id: 3,
      createdAt: TODAY,
      learner: 'kirsi',
      subject: 'matemaatika',
      topic: 'arvutamine',
      category: '',
      exerciseId: null
    }];

    expect([...completedExerciseIdsFromAttempts(attempts, 'kirsi', kirsiCards)]).toEqual([]);
  });

  it('marks each finished card when the child does two of them', () => {
    const attempts = [
      { id: 4, createdAt: TODAY, learner: 'kirsi', subject: 'matemaatika', topic: 'arvutamine', category: 'Arvutamine 10 piires', exerciseId: 'kirsi.math.arvutamine.1' },
      { id: 5, createdAt: TODAY, learner: 'kirsi', subject: 'matemaatika', topic: 'kellaaeg', category: 'Kellaaeg', exerciseId: 'kirsi.math.kellaaeg' }
    ];

    const completed = completedExerciseIdsFromAttempts(attempts, 'kirsi', kirsiCards);
    expect([...completed].sort()).toEqual(['kirsi.math.arvutamine.1', 'kirsi.math.kellaaeg']);
  });

  it('ignores an attempt from yesterday', () => {
    const yesterday = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
    const attempts = [{
      id: 6,
      createdAt: yesterday,
      learner: 'kirsi',
      subject: 'matemaatika',
      topic: 'arvutamine',
      category: 'Arvutamine 20 piires',
      exerciseId: 'kirsi.math.arvutamine.2'
    }];

    expect([...completedExerciseIdsFromAttempts(attempts, 'kirsi', kirsiCards)]).toEqual([]);
  });

  it('keeps Kiur\'s distinct maths topics independent of each other', () => {
    const kiurCards = childExerciseCards('kiur', [
      entry('kiur.math.korrutamine', 'kiur', { topic: 'korrutamine', category: 'Korrutamine' }),
      entry('kiur.math.mustrid', 'kiur', { topic: 'mustrid', category: 'Mustrid' })
    ]);
    const attempts = [{
      id: 7,
      createdAt: TODAY,
      learner: 'kiur',
      subject: 'matemaatika',
      topic: 'mustrid',
      category: 'Mustrid',
      exerciseId: 'kiur.math.mustrid'
    }];

    expect([...completedExerciseIdsFromAttempts(attempts, 'kiur', kiurCards)]).toEqual(['kiur.math.mustrid']);
  });
});
