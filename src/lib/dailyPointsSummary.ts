import db from '@/lib/db';
import { todayDateString, type Learner } from '@/lib/tasks';

export type PointsBreakdownItem = {
  key: string;
  label: string;
  emoji: string;
  amount: number;
};

export type YesterdayPointsSummary = {
  date: string; // yesterday's local (Europe/Kiev) date, 'YYYY-MM-DD'
  total: number;
  hasEarnings: boolean;
  breakdown: PointsBreakdownItem[];
};

// Maps each ledger source to a child-friendly category. Several sources collapse
// into one bucket (e.g. both streak sources → "Õpiseeria"). store_purchase and
// other spending are intentionally absent — the recap only shows points earned.
type Category = { key: string; label: string; emoji: string };
const SOURCE_CATEGORY: Record<string, Category> = {
  study_exercise: { key: 'exercises', label: 'Harjutused', emoji: '✏️' },
  streak_bonus: { key: 'streak', label: 'Õpiseeria', emoji: '🔥' },
  reward_streak: { key: 'streak', label: 'Õpiseeria', emoji: '🔥' },
  real_world_task: { key: 'tasks', label: 'Päevategevused', emoji: '✅' },
  daily_task_bonus: { key: 'bonus', label: 'Päevaboonus', emoji: '🎁' },
  point_gift: { key: 'gift', label: 'Kingitused', emoji: '💝' },
  monthly_trophy_prize: { key: 'prize', label: 'Kuu auhind', emoji: '🏆' },
  manual_adjustment: { key: 'manual', label: 'Vanema lisatud', emoji: '⭐' }
};

const CATEGORY_ORDER = ['exercises', 'streak', 'tasks', 'bonus', 'gift', 'prize', 'manual'];

const kievDateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Kiev',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

function kievDate(iso: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return kievDateFormat.format(date);
}

function previousDay(date: string) {
  // Noon UTC keeps the arithmetic clear of any DST edge.
  const cursor = new Date(`${date}T12:00:00Z`);
  cursor.setUTCDate(cursor.getUTCDate() - 1);
  return cursor.toISOString().slice(0, 10);
}

function roundTenths(value: number) {
  return Math.round(value * 10) / 10;
}

// Points the child earned yesterday (local day), grouped by source. Only positive
// ledger entries count, so spending and point removals never appear.
export function getYesterdayPointsSummary(learner: Learner, today = todayDateString()): YesterdayPointsSummary {
  const yesterday = previousDay(today);

  // Pull a small UTC window that safely brackets "yesterday" in Kiev time, then
  // bucket precisely by local date in JS.
  const windowStart = new Date(`${yesterday}T00:00:00Z`);
  windowStart.setUTCDate(windowStart.getUTCDate() - 1);

  const rows = db
    .prepare("SELECT amount, source, createdAt FROM point_ledger WHERE learner = ? AND amount > 0 AND createdAt >= ?")
    .all(learner, windowStart.toISOString()) as Array<{ amount: number; source: string; createdAt: string }>;

  const totals = new Map<string, { label: string; emoji: string; amount: number }>();
  for (const row of rows) {
    if (kievDate(row.createdAt) !== yesterday) continue;
    const category = SOURCE_CATEGORY[row.source];
    if (!category) continue;
    const current = totals.get(category.key) ?? { label: category.label, emoji: category.emoji, amount: 0 };
    current.amount += row.amount;
    totals.set(category.key, current);
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

  return { date: yesterday, total, hasEarnings: breakdown.length > 0 && total > 0, breakdown };
}
