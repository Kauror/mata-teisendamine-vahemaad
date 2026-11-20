import { NextRequest, NextResponse } from 'next/server';
import { getChildDashboard, Learner, todayDateString } from '@/lib/tasks';
import { getAchievements } from '@/lib/achievements';
import { getActiveLearningStreak } from '@/lib/learningPoints';
import { ensureMonthlyPrizeAwarded, getMonthlyCelebration, getMonthlyTrophies } from '@/lib/monthlyCompetition';
import { getStreakFreezeState, settleStreakFreezes } from '@/lib/streakFreeze';
import { studyDates } from '@/lib/studyDays';
import { isPeekingRequest } from '@/lib/server/peekRequest';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function parseLearner(value: string | null): Learner | null {
  return value === 'kiur' || value === 'kirsi' ? value : null;
}

export async function GET(req: NextRequest) {
  const learner = parseLearner(req.nextUrl.searchParams.get('learner'));
  if (!learner) return NextResponse.json({ message: 'Vale laps.' }, { status: 400 });
  // One app date for the whole response, so a read straddling midnight cannot
  // mix two days.
  const today = todayDateString();
  // Peek mode is read-only for the child's data (C3b): a parent looking at the
  // child's page must not settle last month's prize or spend a held streak
  // freeze. Both are idempotent and happen on the child's own next visit.
  const peeking = await isPeekingRequest(req);
  if (!peeking) ensureMonthlyPrizeAwarded(today);
  // Read once: freeze settlement, the streak and the weekly achievement all
  // need the child's study days, and settling never changes them.
  const dates = studyDates(learner);
  // Spend any held freeze on a day that was missed before reading the streak,
  // so the child never sees the streak they saved flash as broken.
  if (!peeking) settleStreakFreezes(learner, today, dates);
  return NextResponse.json({
    ...getChildDashboard(learner, today),
    streak: getActiveLearningStreak(learner, today, dates),
    streakFreeze: getStreakFreezeState(learner, today),
    trophies: getMonthlyTrophies(learner, today),
    monthlyCelebration: getMonthlyCelebration(learner, today),
    achievements: getAchievements(learner, today, dates)
  });
}
