import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { GET } from '@/app/api/child-dashboard/route';
import { addAppDays } from '@/lib/appDate';
import { getAchievements } from '@/lib/achievements';
import { getActiveLearningStreak } from '@/lib/learningPoints';
import { ensureMonthlyPrizeAwarded, getMonthlyCelebration, getMonthlyTrophies } from '@/lib/monthlyCompetition';
import { getStreakFreezeState, grantStreakFreeze, settleStreakFreezes } from '@/lib/streakFreeze';
import { createTaskTemplate, getChildDashboard, invalidateTaskInstancePreparation, type Learner } from '@/lib/tasks';

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
  db.exec(`
    DELETE FROM study_attempt_rewards; DELETE FROM attempts; DELETE FROM streak_freezes; DELETE FROM point_ledger;
    DELETE FROM task_instance_assignments; DELETE FROM task_instances; DELETE FROM task_templates;
  `);
  db.pragma('foreign_keys = ON');
  invalidateTaskInstancePreparation();
});

function studyDay(learner: Learner, date: string) {
  const id = Number(db.prepare(`
    INSERT INTO attempts (createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner)
    VALUES (?, 'Korrutamine', 'Lihtne', 10, 9, 60, '[]', ?)
  `).run(`${date}T10:00:00.000Z`, learner).lastInsertRowid);
  db.prepare(`
    INSERT INTO study_attempt_rewards (attemptId, learner, exerciseKey, score, questionCount, scorePercent,
      baseValueBeforeScore, earnedBeforeCap, awardedAmount, dailyCap, dailyLearningEarnedBefore,
      dailyLearningEarnedAfter, decayAttemptNumberToday, createdAt)
    VALUES (?, ?, 'x', 9, 10, 0.9, 1, 1, 1, 10, 0, 1, 1, ?)
  `).run(id, learner, `${date}T10:00:00.000Z`);
}

// The response exactly as the route assembled it before SRV-10: every helper
// reading its own study days and its own idea of today.
function previousResponse(learner: Learner) {
  ensureMonthlyPrizeAwarded();
  settleStreakFreezes(learner);
  return {
    ...getChildDashboard(learner),
    streak: getActiveLearningStreak(learner),
    streakFreeze: getStreakFreezeState(learner),
    trophies: getMonthlyTrophies(learner),
    monthlyCelebration: getMonthlyCelebration(learner),
    achievements: getAchievements(learner)
  };
}

async function get(learner: Learner) {
  const response = await GET(new NextRequest(`https://example.test/api/child-dashboard?learner=${learner}`));
  expect(response.status).toBe(200);
  return response.json();
}

describe('/api/child-dashboard reads study days once (SRV-10)', () => {
  it('returns the same numbers as before, freeze settlement included', async () => {
    createTaskTemplate({ title: 'Koristus', points: 3, assignmentMode: 'both_independent', recurrenceType: 'daily', startDate: '2026-10-01' });
    // Two study days, then a missed yesterday that a parent's freeze covers.
    studyDay('kiur', addAppDays(TODAY, -3));
    studyDay('kiur', addAppDays(TODAY, -2));
    studyDay('kirsi', TODAY);
    grantStreakFreeze('kiur');

    const kiur = await get('kiur');
    // The settlement inside the route spent the freeze on the shared study-day
    // set, and the streak read afterwards saw it.
    expect(kiur.streakFreeze).toMatchObject({ held: 0, recentlyCovered: [addAppDays(TODAY, -1)] });
    expect(kiur.streak).toBe(3);
    expect(kiur.tasks).toHaveLength(1);
    expect(kiur).toEqual(previousResponse('kiur'));

    const kirsi = await get('kirsi');
    expect(kirsi.streak).toBe(1);
    expect(kirsi).toEqual(previousResponse('kirsi'));
  });

  it('still refuses an unknown learner', async () => {
    const response = await GET(new NextRequest('https://example.test/api/child-dashboard?learner=x'));
    expect(response.status).toBe(400);
  });
});
