import { todayDateString } from '@/lib/appDate';
import { ledgerRowsForAppDays } from '@/lib/appDayWindow';
import { getActiveLearningStreak } from '@/lib/learningPoints';
import { getStatsOverview } from '@/lib/stats';
import { type Learner } from '@/lib/tasks';

export type WeeklyChildDigest = {
  exercises: number;
  accuracyPercent: number;
  starsEarned: number;
  trophies: number;
  streak: number;
};

export type WeeklyDigest = {
  from: string;
  to: string;
  learners: Record<Learner, WeeklyChildDigest>;
};

const WINDOW_DAYS = 7;

// Sum of stars a child gained over the window: every positive ledger entry
// (exercises, bonuses, gifts received, parent top-ups). Spending and gifts sent
// are negative and therefore excluded.
// Bucketed by the day each row was written (createdAt), as it always was.
function starsEarnedInWindow(learner: Learner, from: string, to: string) {
  return ledgerRowsForAppDays(learner, from, to).reduce((total, row) => (row.amount > 0 ? total + row.amount : total), 0);
}

// A rolling 7-day recap for the parent hub: how much each child practised, how
// accurately, how many stars they gained and where their study streak stands.
export function getWeeklyDigest(today = todayDateString()): WeeklyDigest {
  const overview = getStatsOverview(WINDOW_DAYS, today);
  const build = (learner: Learner): WeeklyChildDigest => ({
    exercises: overview.totals[learner].exercises,
    accuracyPercent: overview.totals[learner].accuracyPercent,
    starsEarned: Math.round(starsEarnedInWindow(learner, overview.from, overview.to) * 10) / 10,
    trophies: overview.totals[learner].trophies,
    streak: getActiveLearningStreak(learner, today)
  });
  return {
    from: overview.from,
    to: overview.to,
    learners: { kiur: build('kiur'), kirsi: build('kirsi') }
  };
}
