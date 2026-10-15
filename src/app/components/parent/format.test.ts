import { describe, expect, it } from 'vitest';
import { adjustMagnitude, adjustmentNotice, approvalMeta, historySummary, learnerLabel, mergeHistoryPage, parseWeekdays, rewardsSummary, shortDayLabel } from './format';
import type { ParentHistoryAttempt } from './types';

const row = (id: number): ParentHistoryAttempt => ({ id, createdAt: '2026-10-01T10:00:00.000Z', learner: 'kiur', category: 'Korrutamine', score: 5, questionCount: 5 });

describe('parent formatting', () => {
  it('labels learners, treating a legacy row without a learner as Kiur', () => {
    expect(learnerLabel('kiur')).toBe('Kiur');
    expect(learnerLabel('kirsi')).toBe('Kirsi');
    expect(learnerLabel(null)).toBe('Kiur');
  });

  it('shows the day on approvals from earlier days only', () => {
    expect(shortDayLabel('2026-10-13')).toBe('13.10');
    expect(approvalMeta({ points: 3, date: '2026-10-13', completedAt: null }, '2026-10-14')).toBe('+3 ⭐ · 13.10');
    expect(approvalMeta({ points: 3, date: '2026-10-14', completedAt: null }, '2026-10-14')).toBe('+3 ⭐');
  });

  it('agrees the adjustment notice with the number', () => {
    expect(adjustmentNotice('points', 'kiur', 1, 1)).toBe('Kiur: +1 täht.');
    expect(adjustmentNotice('points', 'kirsi', 1, 3)).toBe('Kirsi: +3 tähte.');
    expect(adjustmentNotice('trophies', 'kiur', 1, 1)).toBe('Kiur: +1 karikas.');
    expect(adjustmentNotice('trophies', 'kiur', -1, 2)).toBe('Kiuri karikaid vähendati 2 võrra.');
    expect(adjustmentNotice('points', 'kirsi', -1, 1)).toBe('Kirsi tähti vähendati 1 võrra.');
  });

  it('reads the stepper amount as a positive whole number', () => {
    expect(adjustMagnitude('')).toBe(1);
    expect(adjustMagnitude('0')).toBe(1);
    expect(adjustMagnitude('4')).toBe(4);
    expect(adjustMagnitude('2.7')).toBe(2);
  });

  it('agrees section summaries with their counts', () => {
    expect(rewardsSummary(0)).toBe('Pole seadistatud');
    expect(rewardsSummary(1)).toBe('1 auhind');
    expect(historySummary(1, false)).toBe('1 harjutus');
    expect(historySummary(20, true)).toBe('Viimased 20 harjutust');
  });

  it('appends a history page without repeating rows, and replaces on a first page', () => {
    expect(mergeHistoryPage([row(3), row(2)], [row(2), row(1)], true).map((item) => item.id)).toEqual([3, 2, 1]);
    expect(mergeHistoryPage([row(3), row(2)], [row(9)], false).map((item) => item.id)).toEqual([9]);
  });

  it('parses stored weekdays defensively', () => {
    expect(parseWeekdays('[1,3]')).toEqual([1, 3]);
    expect(parseWeekdays('nope')).toEqual([]);
    expect(parseWeekdays(null)).toEqual([]);
  });
});
