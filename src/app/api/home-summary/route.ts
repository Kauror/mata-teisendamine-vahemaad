import { NextResponse } from 'next/server';
import { getDailyStandings } from '@/lib/leaderboard';
import { getActiveLearningStreak } from '@/lib/learningPoints';
import { ensureMonthlyPrizeAwarded, getMonthlyTrophies } from '@/lib/monthlyCompetition';
import { settleStreakFreezes } from '@/lib/streakFreeze';
import { getBalance, todayDateString, type Learner } from '@/lib/tasks';
import { queryHistoryRows } from '@/lib/server/historyRows';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const RECENT_PER_CHILD = 3;
const LEARNERS: Learner[] = ['kiur', 'kirsi'];

// Everything the home page shows, in one request (audit WEB-04/05/15,
// SRV-10/11). It used to take five: two history pages, the whole leaderboard
// for one row, and two child dashboards that also created task instances and
// derived achievements the home page never shows.
//
// The numbers come from the same functions as those endpoints, so they match:
// - the monthly prize is settled first, because it credits stars (balance);
// - a held freeze is spent on a missed day before the streak is read, as on
//   /api/child-dashboard, so a saved streak never shows as broken;
// - today's standings are the stored daily_leaderboard row, as /api/leaderboard
//   (with its backfill), but only today's row is read;
// - recent attempts are /api/history rows with its learner rule.
export async function GET() {
  const today = todayDateString();
  const standings = getDailyStandings(today);
  ensureMonthlyPrizeAwarded(today);

  const children = {} as Record<Learner, { streak: number; balance: number; trophies: number; recent: unknown[] }>;
  for (const learner of LEARNERS) {
    settleStreakFreezes(learner, today);
    children[learner] = {
      streak: getActiveLearningStreak(learner, today),
      balance: getBalance(learner),
      trophies: getMonthlyTrophies(learner, today),
      recent: await queryHistoryRows({ learner, limit: RECENT_PER_CHILD })
    };
  }

  return NextResponse.json({ today: standings, children });
}
