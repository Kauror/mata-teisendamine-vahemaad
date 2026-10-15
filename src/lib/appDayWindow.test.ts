import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import db from '@/lib/db';
import { addAppDays, appDateRange, isoToAppDate } from '@/lib/appDate';
import { appDayTextBracket, ledgerRowsForAppDays } from '@/lib/appDayWindow';
import { getYesterdayPointsSummary } from '@/lib/dailyPointsSummary';
import { awardStudyPointsForAttempt } from '@/lib/learningPoints';
import { getChildStore, getParentStoreDashboard, getStorePurchaseHistory } from '@/lib/store';
import { getTaskHistory } from '@/lib/tasks';
import { getWeeklyDigest } from '@/lib/weeklyDigest';
import { GET as taskHistoryRoute } from '@/app/api/task-history/route';
import { GET as storeHistoryRoute } from '@/app/api/store/history/route';

// SRV-12 differential tests: every call site moved onto the shared app-day
// window must return exactly what its previous unbounded scan returned.

const NOW = '2026-10-26T10:00:00.000Z';
beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(NOW));
});
afterAll(() => {
  vi.useRealTimers();
});

beforeEach(() => {
  db.pragma('foreign_keys = OFF');
  db.exec(`
    DELETE FROM store_purchases; DELETE FROM store_items; DELETE FROM point_ledger; DELETE FROM attempts;
    DELETE FROM study_attempt_rewards; DELETE FROM streak_bonus_awards; DELETE FROM reward_rule_awards;
  `);
  db.pragma('foreign_keys = ON');
});

let state = 12345;
function random() {
  state = (state * 1103515245 + 12345) % 2147483648;
  return state / 2147483648;
}

const SOURCES = ['study_exercise', 'streak_bonus', 'reward_streak', 'real_world_task', 'daily_task_bonus', 'point_gift', 'manual_adjustment', 'store_purchase', 'monthly_trophy_prize'];

// Rows spread over both 2026 DST switches (29 March, 25 October) in the three
// timestamp spellings the ledger can hold, many of them near local midnight.
function randomTimestamp(day: string) {
  const hour = [20, 21, 22, 23, 0, 1, 2, 3, 12][Math.floor(random() * 9)];
  const minute = Math.floor(random() * 60);
  const base = new Date(`${day}T00:00:00.000Z`);
  base.setUTCHours(hour, minute, Math.floor(random() * 60), Math.floor(random() * 1000));
  const iso = base.toISOString();
  const style = random();
  const withOffset = (hours: number) => {
    const sign = hours < 0 ? '-' : '+';
    const text = `${sign}${String(Math.abs(hours)).padStart(2, '0')}:00`;
    return new Date(base.getTime() + hours * 3600_000).toISOString().replace(/\.\d{3}Z$/, text);
  };
  if (style < 0.12) return iso.replace(/\.\d{3}Z$/, 'Z');
  if (style < 0.2) return withOffset(3);
  // Offsets far from Tallinn's: the text date differs from the Tallinn day.
  if (style < 0.28) return withOffset(-5);
  if (style < 0.32) return withOffset(-11);
  if (style < 0.36) return withOffset(14);
  // Text that does not start with a date at all.
  if (style < 0.4) return base.toUTCString();
  return iso;
}

function seedLedger(learner: 'kiur' | 'kirsi', days: string[], perDay = 4) {
  for (const day of days) {
    for (let index = 0; index < perDay; index++) {
      const amount = Math.round((random() * 4 - 1) * 10) / 10 || 0.1;
      db.prepare(`
        INSERT INTO point_ledger (learner, amount, source, sourceId, description, createdAt, metadataJson)
        VALUES (?, ?, ?, 1, 'x', ?, '{}')
      `).run(learner, amount, SOURCES[Math.floor(random() * SOURCES.length)], randomTimestamp(day));
    }
  }
}

const DAYS = [...appDateRange('2026-03-25', '2026-04-02'), ...appDateRange('2026-10-20', '2026-10-28')];

function naiveRows(learner: string, from: string, to: string) {
  return (db.prepare('SELECT id, amount, source, createdAt FROM point_ledger WHERE learner = ?').all(learner) as Array<{ id: number; amount: number; source: string; createdAt: string }>)
    .filter((row) => {
      const day = isoToAppDate(row.createdAt);
      return day !== null && day >= from && day <= to;
    });
}

describe('ledgerRowsForAppDays', () => {
  it('returns exactly the rows a full scan bucketed by app day returns, across both DST switches', () => {
    seedLedger('kiur', DAYS, 6);
    seedLedger('kirsi', DAYS, 2);
    for (const from of DAYS) {
      for (const span of [0, 1, 6]) {
        const to = addAppDays(from, span);
        const expected = naiveRows('kiur', from, to).map((row) => row.id).sort((a, b) => a - b);
        expect(ledgerRowsForAppDays('kiur', from, to).map((row) => row.id).sort((a, b) => a - b)).toEqual(expected);
      }
    }
  });

  it('brackets a day by text for any UTC offset', () => {
    expect(appDayTextBracket('2026-10-25', '2026-10-25')).toEqual({ fromInclusive: '2026-10-23', toExclusive: '2026-10-27' });
    // Tallinn 25 Oct 00:30 written at UTC-12 and 23:30 written at UTC+14.
    const bracket = appDayTextBracket('2026-10-25', '2026-10-25');
    for (const text of ['2026-10-24T09:30:00-12:00', '2026-10-26T11:30:00+14:00']) {
      expect(text >= bracket.fromInclusive && text < bracket.toExclusive).toBe(true);
    }
  });
});

describe('call sites moved onto the shared window', () => {
  it('weekly digest stars equal the previous unbounded positive-sum', () => {
    seedLedger('kiur', DAYS, 6);
    for (const today of ['2026-03-31', '2026-04-02', '2026-10-26', '2026-10-28']) {
      const digest = getWeeklyDigest(today);
      const legacy = naiveRows('kiur', digest.from, digest.to).reduce((total, row) => (row.amount > 0 ? total + row.amount : total), 0);
      expect(digest.learners.kiur.starsEarned).toBe(Math.round(legacy * 10) / 10);
    }
  });

  it('yesterday summary equals the previous lower-bounded scan for legacy sources', () => {
    seedLedger('kiur', DAYS, 8);
    for (const today of ['2026-03-29', '2026-03-30', '2026-10-25', '2026-10-26']) {
      const yesterday = addAppDays(today, -1);
      const windowStart = new Date(`${yesterday}T00:00:00Z`);
      windowStart.setUTCDate(windowStart.getUTCDate() - 1);
      const legacy = (db.prepare("SELECT amount, source, createdAt FROM point_ledger WHERE learner = 'kiur' AND source <> 'reward_v2' AND amount > 0 AND createdAt >= ?")
        .all(windowStart.toISOString()) as Array<{ amount: number; source: string; createdAt: string }>)
        .filter((row) => isoToAppDate(row.createdAt) === yesterday && row.source !== 'store_purchase');
      const total = Math.round(legacy.reduce((sum, row) => sum + row.amount, 0) * 10) / 10;
      expect(getYesterdayPointsSummary('kiur', today).total).toBeCloseTo(total, 6);
    }
  });

  it('the v1 daily cap reads the same study_exercise total as before', () => {
    seedLedger('kiur', DAYS, 10);
    for (const day of ['2026-03-29', '2026-10-25', '2026-10-26']) {
      const createdAt = `${day}T09:00:00.000Z`;
      const attemptId = Number(db.prepare(`
        INSERT INTO attempts (createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, subject, topic)
        VALUES (?, 'Korrutamine', 'Lihtne', 10, 10, 60, '[]', 'kiur', 'matemaatika', 'korrutamine')
      `).run(createdAt).lastInsertRowid);
      const legacy = (db.prepare("SELECT amount, createdAt FROM point_ledger WHERE learner = 'kiur' AND source = 'study_exercise'").all() as Array<{ amount: number; createdAt: string }>)
        .reduce((total, row) => (isoToAppDate(row.createdAt) === day ? total + row.amount : total), 0);
      expect(awardStudyPointsForAttempt(attemptId)!.dailyLearningEarnedBefore).toBe(legacy);
    }
  });
});

describe('store daily stock through the item index', () => {
  function item(stockType: string, dailyStockLimit: number | null) {
    return Number(db.prepare(`
      INSERT INTO store_items (title, price, visibility, stockType, dailyStockLimit, isActive, createdAt, updatedAt)
      VALUES ('Jäätis', 1, 'both', ?, ?, 1, '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z')
    `).run(stockType, dailyStockLimit).lastInsertRowid);
  }
  function purchase(itemId: number, purchasedAt: string, metadataJson: string | null) {
    const ledger = Number(db.prepare(`
      INSERT INTO point_ledger (learner, amount, source, description, createdAt) VALUES ('kiur', -1, 'store_purchase', 'Ost', ?)
    `).run(purchasedAt).lastInsertRowid);
    db.prepare(`
      INSERT INTO store_purchases (storeItemId, learner, titleSnapshot, priceSnapshot, visibilitySnapshot, stockTypeSnapshot, purchasedAt, ledgerEntryId, balanceAfterPurchase, metadataJson)
      VALUES (?, 'kiur', 'Jäätis', 1, 'both', 'daily_stock', ?, ?, 0, ?)
    `).run(itemId, purchasedAt, ledger, metadataJson);
  }
  // The previous getDailyUsed, verbatim.
  function legacyDailyUsed(itemId: number, date: string) {
    const rows = db.prepare('SELECT purchasedAt, metadataJson FROM store_purchases WHERE storeItemId = ?').all(itemId) as Array<{ purchasedAt: string; metadataJson: string | null }>;
    return rows.filter((row) => {
      if (row.metadataJson) {
        try {
          const metadata = JSON.parse(row.metadataJson) as { date?: unknown };
          if (typeof metadata.date === 'string') return metadata.date === date;
        } catch {
          // fall through
        }
      }
      return isoToAppDate(row.purchasedAt) === date;
    }).length;
  }

  it('counts exactly the purchases the full scan counted, for every metadata shape', () => {
    db.prepare("INSERT INTO point_ledger (learner, amount, source, description, createdAt) VALUES ('kiur', 1000, 'manual_adjustment', 'x', '2026-01-01T00:00:00.000Z')").run();
    const target = item('daily_stock', 100);
    const other = item('daily_stock', 100);
    const shapes = (day: string) => [
      JSON.stringify({ date: day }),
      JSON.stringify({ date: addAppDays(day, -1) }),
      JSON.stringify({ date: 20261026 }),
      JSON.stringify({ other: true }),
      '[1,2]',
      'null',
      '{ not json',
      '',
      null
    ];
    for (const day of appDateRange('2026-10-23', '2026-10-27')) {
      for (const metadata of shapes(day)) {
        purchase(target, randomTimestamp(day), metadata);
        purchase(other, randomTimestamp(day), metadata);
      }
    }
    for (const day of appDateRange('2026-10-22', '2026-10-28')) {
      const remaining = getParentStoreDashboard(day).items.find((entry) => entry.id === target)!.dailyRemaining;
      expect(100 - remaining!).toBe(legacyDailyUsed(target, day));
      const child = getChildStore('kiur', day).items.find((entry) => entry.id === target)!;
      expect(child.dailyRemaining).toBe(100 - legacyDailyUsed(target, day));
    }
    const plan = db.prepare("EXPLAIN QUERY PLAN SELECT purchasedAt FROM store_purchases WHERE storeItemId = ?").all(target) as Array<{ detail: string }>;
    expect(plan.some((row) => row.detail.includes('idx_store_purchases_item'))).toBe(true);
  });
});

describe('paged task and store history', () => {
  function seedTimeline() {
    const sources = ['real_world_task', 'manual_adjustment', 'daily_task_bonus', 'point_gift', 'study_exercise'];
    for (let index = 0; index < 230; index++) {
      // Every few rows share a timestamp, so the id tiebreak is exercised.
      const at = new Date(Date.UTC(2026, 9, 1) + Math.floor(index / 3) * 3600_000).toISOString();
      const ledgerId = db.prepare("INSERT INTO point_ledger (learner, amount, source, description, createdAt) VALUES ('kiur', 1, ?, 'x', ?)").run(sources[index % sources.length], at).lastInsertRowid;
      db.prepare(`
        INSERT INTO store_purchases (storeItemId, learner, titleSnapshot, priceSnapshot, visibilitySnapshot, stockTypeSnapshot, purchasedAt, ledgerEntryId, balanceAfterPurchase, metadataJson)
        VALUES (NULL, 'kirsi', 'Kleebis', 1, 'both', 'unlimited', ?, ?, 0, NULL)
      `).run(at, ledgerId);
    }
  }

  async function drain(handler: (request: Request) => Promise<Response>, path: string, limit: number) {
    const ids: number[] = [];
    let cursor: string | null = null;
    do {
      const query = new URLSearchParams({ limit: String(limit) });
      if (cursor) query.set('cursor', cursor);
      const response = await handler(new Request(`http://localhost${path}?${query}`));
      const body = await response.json() as { items: Array<{ id: number }>; nextCursor: string | null };
      expect(body.items.length).toBeLessThanOrEqual(limit);
      ids.push(...body.items.map((row) => row.id));
      cursor = body.nextCursor;
    } while (cursor);
    return ids;
  }

  it('pages through exactly the rows the unbounded list returned, newest first', async () => {
    seedTimeline();
    const legacyTasks = (db.prepare(`
      SELECT id FROM point_ledger WHERE source IN ('real_world_task', 'manual_adjustment', 'daily_task_bonus', 'point_gift')
      ORDER BY createdAt DESC, id DESC
    `).all() as Array<{ id: number }>).map((row) => row.id);
    const legacyStore = (db.prepare('SELECT id FROM store_purchases ORDER BY purchasedAt DESC, id DESC').all() as Array<{ id: number }>).map((row) => row.id);

    expect(await drain(taskHistoryRoute, '/api/task-history', 50)).toEqual(legacyTasks);
    expect(await drain(storeHistoryRoute, '/api/store/history', 7)).toEqual(legacyStore);
    expect((getTaskHistory() as Array<{ id: number }>).map((row) => row.id)).toEqual(legacyTasks);
    expect(getStorePurchaseHistory().map((row) => row.id)).toEqual(legacyStore);
  });

  it('still answers a client built before paging with the whole bare array', async () => {
    seedTimeline();
    const tasks = await (await taskHistoryRoute(new Request('http://localhost/api/task-history'))).json() as unknown[];
    const store = await (await storeHistoryRoute(new Request('http://localhost/api/store/history'))).json() as unknown[];
    expect(Array.isArray(tasks) && tasks.length).toBe(184);
    expect(Array.isArray(store) && store.length).toBe(230);
  });

  it('rejects a malformed page request', async () => {
    expect((await taskHistoryRoute(new Request('http://localhost/api/task-history?limit=0'))).status).toBe(400);
    expect((await storeHistoryRoute(new Request('http://localhost/api/store/history?cursor=bm9wZQ'))).status).toBe(400);
  });
});
