import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import db from '@/lib/db';
import { addAppDays, isoToAppDate, startOfAppWeek } from '@/lib/appDate';
import { getAchievements, latestExerciseMilestone } from '@/lib/achievements';
import { isKirsiAttempt } from '@/lib/history';
import { studyDates } from '@/lib/studyDays';

describe('exercise milestones', () => {
  it('advances in 50-exercise steps and ends at 999', () => {
    expect(latestExerciseMilestone(49)).toBeNull();
    expect(latestExerciseMilestone(50)).toBe(50);
    expect(latestExerciseMilestone(149)).toBe(100);
    expect(latestExerciseMilestone(950)).toBe(950);
    expect(latestExerciseMilestone(999)).toBe(999);
  });
});

// SRV-10: the attempts read is filtered by learner in SQL now. These pin that
// the numbers are exactly what the old "load every row, classify in JS" read
// produced — including legacy rows whose learner is NULL or unknown.
describe('achievements read only the child\'s own attempts (SRV-10)', () => {
  const TODAY = '2026-10-15';

  beforeAll(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(`${TODAY}T09:00:00.000Z`));
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    db.pragma('foreign_keys = OFF');
    db.exec('DELETE FROM study_attempt_rewards; DELETE FROM attempts;');
    db.pragma('foreign_keys = ON');
  });

  function attempt(category: string, learner: string | null, date: string, count = 1) {
    const insert = db.prepare(`
      INSERT INTO attempts (createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner)
      VALUES (?, ?, 'Lihtne', 10, 9, 60, '[]', ?)
    `);
    for (let index = 0; index < count; index += 1) insert.run(`${date}T10:00:00.000Z`, category, learner);
  }

  function studyDay(learner: 'kiur' | 'kirsi', date: string) {
    const id = Number(db.prepare(`
      INSERT INTO attempts (createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner)
      VALUES (?, 'Korrutamine', 'Lihtne', 10, 9, 60, '[]', ?)
    `).run(`${date}T11:00:00.000Z`, learner).lastInsertRowid);
    db.prepare(`
      INSERT INTO study_attempt_rewards (attemptId, learner, exerciseKey, score, questionCount, scorePercent,
        baseValueBeforeScore, earnedBeforeCap, awardedAmount, dailyCap, dailyLearningEarnedBefore,
        dailyLearningEarnedAfter, decayAttemptNumberToday, createdAt)
      VALUES (?, ?, 'x', 9, 10, 0.9, 1, 1, 1, 10, 0, 1, 1, ?)
    `).run(id, learner, `${date}T11:00:00.000Z`);
  }

  // The pre-SRV-10 read, kept as the oracle.
  function oldCounts(learner: 'kiur' | 'kirsi') {
    const rows = db.prepare('SELECT category, learner, createdAt FROM attempts').all() as Array<{ category: string; learner: string | null; createdAt: string }>;
    const mine = rows.filter((row) => (isKirsiAttempt(row.category, row.learner) ? 'kirsi' : 'kiur') === learner);
    const weekStart = startOfAppWeek(TODAY);
    return {
      total: mine.length,
      today: mine.filter((row) => isoToAppDate(row.createdAt) === TODAY).length,
      week: mine.filter((row) => {
        const date = isoToAppDate(row.createdAt);
        return date !== null && date >= weekStart && date <= TODAY;
      }).length
    };
  }

  function seedMixedHistory() {
    const yesterday = addAppDays(TODAY, -1);
    const longAgo = addAppDays(TODAY, -400);
    attempt('Korrutamine', 'kiur', TODAY, 3);
    attempt('Korrutamine', 'kirsi', TODAY, 2); // explicit learner beats the category
    attempt('Arvutamine 10 piires', 'kiur', yesterday, 4); // a Kirsi category, but Kiur's row
    attempt('Arvutamine 10 piires', null, TODAY, 5); // legacy: Kirsi by category
    attempt('Korrutamine', null, longAgo, 40); // legacy: Kiur by category
    attempt('Segaülesanded', 'parent', yesterday, 6); // unknown value: Kirsi by category
    attempt('Korrutamine', '', longAgo, 7); // unknown value: Kiur by category
    studyDay('kiur', TODAY);
    studyDay('kiur', yesterday);
    studyDay('kirsi', TODAY);
  }

  it('counts exactly what the old full scan counted, for both children', () => {
    seedMixedHistory();
    for (const learner of ['kiur', 'kirsi'] as const) {
      const expected = oldCounts(learner);
      const [milestone, daily, weekly] = getAchievements(learner);
      expect(milestone.tooltipCount).toBe(expected.total);
      expect(daily.tooltipCount).toBe(expected.today);
      expect(weekly.tooltipCount).toBe(expected.week);
    }
    // Sanity: the seed really splits the children unevenly, so a filter that
    // ignored the learner (or dropped the legacy rows) would fail above.
    expect(oldCounts('kiur').total).not.toBe(oldCounts('kirsi').total);
    expect(oldCounts('kiur').total).toBe(3 + 4 + 40 + 7 + 2);
    expect(oldCounts('kirsi').total).toBe(2 + 5 + 6 + 1);
  });

  it('crosses a milestone on the child\'s own rows only', () => {
    attempt('Korrutamine', 'kiur', TODAY, 30);
    attempt('Korrutamine', null, addAppDays(TODAY, -3), 20); // legacy Kiur rows
    attempt('Arvutamine 20 piires', null, TODAY, 45); // legacy Kirsi rows
    expect(getAchievements('kiur')[0]).toMatchObject({ id: 'exercises-50', unlocked: true, tooltipCount: 50 });
    expect(getAchievements('kirsi')[0]).toMatchObject({ id: 'exercises-50', unlocked: false, current: 45, tooltipCount: 45 });
  });

  it('gives the same answer whether the study days are handed in or read', () => {
    seedMixedHistory();
    for (const learner of ['kiur', 'kirsi'] as const) {
      expect(getAchievements(learner, TODAY, studyDates(learner))).toEqual(getAchievements(learner));
    }
  });
});
