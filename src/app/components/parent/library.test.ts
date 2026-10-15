import { describe, expect, it } from 'vitest';
import { exercisesFrom, libraryByLearner, libraryStatusNotice, libraryTopicOptions } from './library';
import type { LearningExercise } from './types';

const exercise = (overrides: Partial<LearningExercise>): LearningExercise => ({
  id: 'x',
  title: 'X',
  learnerScope: ['kiur'],
  subject: 'matemaatika',
  topic: '',
  category: '',
  routePath: '/x',
  sortOrder: 0,
  childStatus: { kiur: 'rotation', kirsi: null },
  ...overrides
});

const all = { subject: 'all', topic: 'all', status: 'all' } as const;

describe('parent exercise library', () => {
  it('groups by child and sorts by subject order, then sort order, then title', () => {
    const list = [
      exercise({ id: 'b', title: 'B', sortOrder: 2 }),
      exercise({ id: 'a', title: 'A', sortOrder: 1 }),
      exercise({ id: 'k', title: 'Kirsi', learnerScope: ['kirsi'], childStatus: { kiur: null, kirsi: 'permanent' } })
    ];
    const grouped = libraryByLearner(list, all);
    expect(grouped.kiur.map((item) => item.id)).toEqual(['a', 'b']);
    expect(grouped.kirsi.map((item) => item.id)).toEqual(['k']);
  });

  it('filters by topic, category or title, and by that child\'s status', () => {
    const list = [
      exercise({ id: 't', topic: 'liitmine' }),
      exercise({ id: 'c', category: 'Korrutamine', childStatus: { kiur: 'hidden', kirsi: null } })
    ];
    expect(libraryByLearner(list, { ...all, topic: 'Korrutamine' }).kiur.map((item) => item.id)).toEqual(['c']);
    expect(libraryByLearner(list, { ...all, status: 'rotation' }).kiur.map((item) => item.id)).toEqual(['t']);
  });

  it('offers each topic once, alphabetically in Estonian', () => {
    const options = libraryTopicOptions([
      exercise({ topic: 'õppimine' }),
      exercise({ topic: 'arvutamine', category: 'arvutamine' }),
      exercise({ title: 'Ainult pealkiri' })
    ]);
    expect(options.map((option) => option.value)).toEqual(['Ainult pealkiri', 'arvutamine', 'õppimine']);
  });

  it('never replaces the list with an unreadable body', () => {
    expect(exercisesFrom({})).toBeNull();
    expect(exercisesFrom(null)).toBeNull();
    expect(exercisesFrom({ exercises: [] })).toEqual([]);
  });

  it('confirms each status change in its own words', () => {
    expect(libraryStatusNotice('permanent')).toBe('Harjutus on nüüd püsiv.');
    expect(libraryStatusNotice('rotation')).toBe('Harjutus on rotatsioonis.');
    expect(libraryStatusNotice('hidden')).toBe('Harjutus peideti lapse vaatest.');
  });
});
