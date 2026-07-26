import { describe, expect, it } from 'vitest';
import { exerciseWord, questionWord, trophyWord } from '@/lib/history';

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
