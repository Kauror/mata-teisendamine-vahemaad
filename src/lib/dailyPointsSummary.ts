import db from '@/lib/db';
import { isoToAppDate, previousAppDate, todayDateString } from '@/lib/appDate';
import { type Learner } from '@/lib/tasks';

export type PointsBreakdownItem = {
  key: string;
  label: string;
  emoji: string;
  amount: number;
};

export type YesterdayPointsSummary = {
  date: string; // yesterday's local date, 'YYYY-MM-DD'
  total: number;
  hasEarnings: boolean;
  practicedYesterday: boolean; // did at least one exercise, even if it earned 0 stars
  breakdown: PointsBreakdownItem[];
};

// Maps each ledger source to a child-friendly category. Several sources collapse
// into one bucket (e.g. both streak sources → "Õpiseeria"). store_purchase and
// other spending are intentionally absent — the recap only shows points earned.
type Category = { key: string; label: string; emoji: string };
const EXERCISES: Category = { key: 'exercises', label: 'Harjutused', emoji: '✏️' };
const STREAK: Category = { key: 'streak', label: 'Õpiseeria', emoji: '🔥' };
const SOURCE_CATEGORY: Record<string, Category> = {
  study_exercise: EXERCISES,
  streak_bonus: STREAK,
  reward_streak: STREAK,
  real_world_task: { key: 'tasks', label: 'Päevategevused', emoji: '✅' },
  daily_task_bonus: { key: 'bonus', label: 'Päevaboonus', emoji: '🎁' },
  point_gift: { key: 'gift', label: 'Kingitused', emoji: '💝' },
  monthly_trophy_prize: { key: 'prize', label: 'Kuu auhind', emoji: '🏆' },
  manual_adjustment: { key: 'manual', label: 'Vanema lisatud', emoji: '⭐' }
};

// Protocol-v2 exercise rewards are all written as source 'reward_v2', one ledger
// row per component revision: 'study' is the exercise's own stars;
// 'streak:standard' and 'rule:<id>' (learning-streak rules) are streak rewards.
function rewardV2Category(componentKey: string | null): Category | null {
  if (!componentKey) return null;
  if (componentKey === 'study') return EXERCISES;
  if (componentKey.startsWith('streak:') || componentKey.startsWith('rule:')) return STREAK;
  return null;
}

const CATEGORY_ORDER = ['exercises', 'streak', 'tasks', 'bonus', 'gift', 'prize', 'manual'];

function roundTenths(value: number) {
  return Math.round(value * 10) / 10;
}

// Points the child earned yesterday (local day), grouped by source. Spending and
// point removals never appear. Protocol-v2 exercise rewards are bucketed by the
// attempt's completion day (the ledger's effectiveDate), so an attempt played
// offline yesterday and synced today still counts for yesterday, and a later
// downward revision is netted against the original award instead of ignored.
export function getYesterdayPointsSummary(learner: Learner, today = todayDateString()): YesterdayPointsSummary {
  const yesterday = previousAppDate(today);

  // Pull a small UTC window that safely brackets "yesterday" in Kiev time, then
  // bucket precisely by local date in JS.
  const windowStart = new Date(`${yesterday}T00:00:00Z`);
  windowStart.setUTCDate(windowStart.getUTCDate() - 1);

  const totals = new Map<string, { label: string; emoji: string; amount: number }>();
  const add = (category: Category, amount: number) => {
    const current = totals.get(category.key) ?? { label: category.label, emoji: category.emoji, amount: 0 };
    current.amount += amount;
    totals.set(category.key, current);
  };

  const rows = db
    .prepare("SELECT amount, source, createdAt FROM point_ledger WHERE learner = ? AND source <> 'reward_v2' AND amount > 0 AND createdAt >= ?")
    .all(learner, windowStart.toISOString()) as Array<{ amount: number; source: string; createdAt: string }>;
  for (const row of rows) {
    if (isoToAppDate(row.createdAt) !== yesterday) continue;
    const category = SOURCE_CATEGORY[row.source];
    if (category) add(category, row.amount);
  }

  // Every revision (positive or negative) of a v2 reward component for an
  // attempt completed yesterday; their sum is the component's current amount.
  const rewardRows = db
    .prepare(`
      SELECT amount, effectiveDate, createdAt, json_extract(metadataJson, '$.componentKey') AS componentKey
      FROM point_ledger
      WHERE learner = ? AND source = 'reward_v2'
        AND (effectiveDate = ? OR (effectiveDate IS NULL AND createdAt >= ?))
    `)
    .all(learner, yesterday, windowStart.toISOString()) as Array<{
      amount: number; effectiveDate: string | null; createdAt: string; componentKey: string | null;
    }>;
  for (const row of rewardRows) {
    if ((row.effectiveDate ?? isoToAppDate(row.createdAt)) !== yesterday) continue;
    const category = rewardV2Category(row.componentKey);
    if (category) add(category, row.amount);
  }

  const breakdown: PointsBreakdownItem[] = CATEGORY_ORDER
    .map((key) => {
      const entry = totals.get(key);
      if (!entry) return null;
      const amount = roundTenths(entry.amount);
      if (amount <= 0) return null;
      return { key, label: entry.label, emoji: entry.emoji, amount };
    })
    .filter((item): item is PointsBreakdownItem => item !== null);

  const total = roundTenths(breakdown.reduce((sum, item) => sum + item.amount, 0));

  // Did the child do any exercise yesterday (regardless of stars earned)? Lets the
  // UI show a neutral face after a low-scoring/capped day instead of a sad one.
  // v2 attempts carry their local completion day; legacy rows use upload time.
  const attemptRows = db
    .prepare('SELECT createdAt, completionDate FROM attempts WHERE learner = ? AND (completionDate = ? OR (completionDate IS NULL AND createdAt >= ?))')
    .all(learner, yesterday, windowStart.toISOString()) as Array<{ createdAt: string; completionDate: string | null }>;
  const practicedYesterday = attemptRows.some((row) => (row.completionDate ?? isoToAppDate(row.createdAt)) === yesterday);

  return { date: yesterday, total, hasEarnings: breakdown.length > 0 && total > 0, practicedYesterday, breakdown };
}
