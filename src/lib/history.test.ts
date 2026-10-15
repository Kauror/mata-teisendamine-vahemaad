import { afterEach, describe, expect, it, vi } from 'vitest';
import { dayWord, entryWord, exerciseWord, groupHistoryByMonth, itemWord, prizeWord, questionWord, starWord, subjectLabel, todayStandings, taskWord, todayStandingsSummary, trophyWord } from '@/lib/history';
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
    expect(taskWord(1)).toBe('tegevus');
    expect(itemWord(1)).toBe('ese');
    expect(prizeWord(1)).toBe('auhind');
    expect(entryWord(1)).toBe('kirje');
  });

  it('uses the partitive for zero and for more than one', () => {
    for (const count of [0, 2, 5, 11, 100]) {
      expect(exerciseWord(count)).toBe('harjutust');
      expect(questionWord(count)).toBe('ülesannet');
      expect(trophyWord(count)).toBe('karikat');
      expect(dayWord(count)).toBe('päeva');
      expect(taskWord(count)).toBe('tegevust');
      expect(itemWord(count)).toBe('eset');
      expect(prizeWord(count)).toBe('auhinda');
      expect(entryWord(count)).toBe('kirjet');
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

describe('history month groups', () => {
  afterEach(() => vi.useRealTimers());

  it('keeps the current month by day and folds earlier months into one group each', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-12T09:00:00Z'));
    const items = ['2026-10-12T08:00:00Z', '2026-10-11T08:00:00Z', '2026-10-04T08:00:00Z', '2026-09-29T08:00:00Z', '2026-09-25T08:00:00Z', '2026-08-28T08:00:00Z'];
    const { recentDays, months } = groupHistoryByMonth(items, (item) => item, '2026-10-12');
    expect([...recentDays.keys()]).toEqual(['Täna', 'Eile', '4.10.2026']);
    expect(months.map((month) => [month.label, month.items.length, [...month.days.keys()]])).toEqual([
      ['September 2026', 2, ['29.9.2026', '25.9.2026']],
      ['August 2026', 1, ['28.8.2026']]
    ]);
  });

  it('keeps "Eile" at the top on the first day of a month', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-01T09:00:00Z'));
    const { recentDays, months } = groupHistoryByMonth(['2026-10-01T08:00:00Z', '2026-09-30T08:00:00Z', '2026-09-20T08:00:00Z'], (item) => item, '2026-10-01');
    expect([...recentDays.keys()]).toEqual(['Täna', 'Eile']);
    expect(months.map((month) => month.items.length)).toEqual([1]);
  });

  it('uses the app time zone for the month boundary', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-12T09:00:00Z'));
    // 22:30 UTC on 30 September is already 1 October in Tallinn.
    const { recentDays, months } = groupHistoryByMonth(['2026-09-30T22:30:00Z'], (item) => item, '2026-10-12');
    expect([...recentDays.keys()]).toEqual(['1.10.2026']);
    expect(months).toEqual([]);
  });
});
