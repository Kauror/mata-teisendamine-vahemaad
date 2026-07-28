import { NextRequest, NextResponse } from 'next/server';
import { getChildDashboard, Learner } from '@/lib/tasks';
import { getAchievements } from '@/lib/achievements';
import { getActiveLearningStreak } from '@/lib/learningPoints';
import { ensureMonthlyPrizeAwarded, getMonthlyCelebration, getMonthlyTrophies } from '@/lib/monthlyCompetition';
import { getStreakFreezeState, settleStreakFreezes } from '@/lib/streakFreeze';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function parseLearner(value: string | null): Learner | null {
  return value === 'kiur' || value === 'kirsi' ? value : null;
}

export async function GET(req: NextRequest) {
  const learner = parseLearner(req.nextUrl.searchParams.get('learner'));
  if (!learner) return NextResponse.json({ message: 'Vale laps.' }, { status: 400 });
  ensureMonthlyPrizeAwarded();
  // Spend any held freeze on a day that was missed before reading the streak,
  // so the child never sees the streak they saved flash as broken.
  settleStreakFreezes(learner);
  return NextResponse.json({
    ...getChildDashboard(learner),
    streak: getActiveLearningStreak(learner),
    streakFreeze: getStreakFreezeState(learner),
    trophies: getMonthlyTrophies(learner),
    monthlyCelebration: getMonthlyCelebration(learner),
    achievements: getAchievements(learner)
  });
}
