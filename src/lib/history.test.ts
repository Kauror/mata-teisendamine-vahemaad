import { describe, expect, it } from 'vitest';
import { exerciseWord, questionWord, subjectLabel, trophyWord } from '@/lib/history';
import { LEARNING_EXERCISE_SUBJECT_LABELS } from '@/lib/shared/types';

// Estonian takes the nominative after exactly 1 and the partitive after every
// other number, including 0. The counters these words label are attempt counts
// (harjutus) and question counts (ülesanne) — mixing them up mislabels what the
// number actually measures.
describe('Estonian number words', () => {
  it('uses the nominative only for exactly one', () => {
    expect(exerciseWord(1)).toBe('harjutus');
    expect(questionWord(1)).toBe('ülesanne');
    expect(trophyWord(1)).toBe('karikas');
  });

  it('uses the partitive for zero and for more than one', () => {
    for (const count of [0, 2, 5, 11, 100]) {
      expect(exerciseWord(count)).toBe('harjutust');
      expect(questionWord(count)).toBe('ülesannet');
      expect(trophyWord(count)).toBe('karikat');
    }
  });
});

describe('subjectLabel', () => {
  it('labels every catalogue subject from the shared record', () => {
    expect(Object.keys(LEARNING_EXERCISE_SUBJECT_LABELS)).toEqual([
      'matemaatika', 'inglise-keel', 'lugemine', 'loodusopetus'
    ]);
    for (const [subject, label] of Object.entries(LEARNING_EXERCISE_SUBJECT_LABELS)) {
      expect(subjectLabel(subject)).toBe(label);
    }
  });

  it('keeps the attempt-only cases the catalogue does not have', () => {
    expect(subjectLabel('kordamine')).toBe('Kordamine');
    expect(subjectLabel(null)).toBe('Matemaatika');
    expect(subjectLabel(undefined)).toBe('Matemaatika');
    expect(subjectLabel('miski-muu')).toBe('miski-muu');
  });
});
