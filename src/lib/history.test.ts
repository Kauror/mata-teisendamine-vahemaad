import { describe, expect, it } from 'vitest';
import { dayWord, exerciseWord, questionWord, starWord, subjectLabel, todayStandings, todayStandingsSummary, trophyWord } from '@/lib/history';
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
    expect(dayWord(1)).toBe('päev');
  });

  it('uses the partitive for zero and for more than one', () => {
    for (const count of [0, 2, 5, 11, 100]) {
      expect(exerciseWord(count)).toBe('harjutust');
      expect(questionWord(count)).toBe('ülesannet');
      expect(trophyWord(count)).toBe('karikat');
      expect(dayWord(count)).toBe('päeva');
    }
  });

  // Stars are the only fractional count, so the word follows the written
  // number rather than the raw value.
  it('picks the star word from the number as written', () => {
    expect(starWord('1')).toBe('täht');
    expect(starWord('0')).toBe('tähte');
    expect(starWord('1,5')).toBe('tähte');
    expect(starWord('12')).toBe('tähte');
  });
});

describe('todayStandings', () => {
  // The board comes back newest-first, but "newest" is not automatically today:
  // there is no row at all until the first attempt of the day is recorded.
  const board = [
    { date: '2026-07-25', kiurCount: 7, kirsiCount: 2 },
    { date: '2026-07-24', kiurCount: 1, kirsiCount: 9 }
  ];

  it('reads the row for today, not the most recent one', () => {
    expect(todayStandings(board, '2026-07-24')).toEqual({ kiur: 1, kirsi: 9 });
  });

  it('shows nobody ahead before the day has any attempts', () => {
    expect(todayStandings(board, '2026-07-26')).toEqual({ kiur: 0, kirsi: 0 });
    expect(todayStandings([], '2026-07-26')).toEqual({ kiur: 0, kirsi: 0 });
  });

  it('survives a board that never arrived', () => {
    expect(todayStandings(undefined, '2026-07-26')).toEqual({ kiur: 0, kirsi: 0 });
    expect(todayStandings(null, '2026-07-26')).toEqual({ kiur: 0, kirsi: 0 });
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

describe('todayStandingsSummary', () => {
  it('names both children, their counts and who leads', () => {
    expect(todayStandingsSummary(3, 2)).toBe('Täna on Kiur teinud 3 harjutust, Kirsi 2 harjutust. Kiur juhib.');
    expect(todayStandingsSummary(1, 4)).toBe('Täna on Kiur teinud 1 harjutus, Kirsi 4 harjutust. Kirsi juhib.');
  });

  it('calls a draw a draw', () => {
    expect(todayStandingsSummary(2, 2)).toBe('Täna on Kiur teinud 2 harjutust, Kirsi 2 harjutust. Seis on viigis.');
  });

  it('says nobody has started rather than reporting a 0-0 draw', () => {
    expect(todayStandingsSummary(0, 0)).toBe('Täna pole veel keegi harjutanud.');
  });

  it('agrees with the number, and never says "ülesanne"', () => {
    const summary = todayStandingsSummary(1, 0);
    expect(summary).toContain('1 harjutus,');
    expect(summary).toContain('0 harjutust');
    expect(summary).not.toContain('ülesan');
  });
});
