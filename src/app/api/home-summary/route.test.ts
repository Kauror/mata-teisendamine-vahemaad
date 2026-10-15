import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import db, { getDatabase } from '@/lib/db';
import { GET as homeSummary } from '@/app/api/home-summary/route';
import { GET as history } from '@/app/api/history/route';
import { GET as leaderboard } from '@/app/api/leaderboard/route';
import { GET as childDashboard } from '@/app/api/child-dashboard/route';
import { todayStandings, type DailyStandingsRow } from '@/lib/history';

// Thursday 15 October 2026, 12:00 in Tallinn.
const NOW = new Date('2026-10-15T09:00:00.000Z');
const TODAY = '2026-10-15';

type Summary = {
  today: { kiur: number; kirsi: number };
  children: Record<'kiur' | 'kirsi', { streak: number; balance: number; trophies: number; recent: Array<{ id: number }> }>;
};

function seed() {
  const attempt = db.prepare(`
    INSERT INTO attempts (
      id, createdAt, category, difficulty, questionCount, score, elapsedSeconds,
      questions, learner, protocolVersion, rewardSettlementStatus
    ) VALUES (?, ?, ?, 'Lihtne', 5, 4, 30, '[]', ?, 1, 'eligible')
  `);
  // Kiur's newest rows, a legacy row of each child's without a learner, and a
  // hidden row that must not show.
  attempt.run(1, '2026-10-01T08:00:00.000Z', 'Arvutamine 10 piires', null);
  attempt.run(2, '2026-10-01T09:00:00.000Z', 'Korrutamine', null);
  for (let index = 0; index < 6; index += 1) {
    attempt.run(10 + index, `2026-10-1${index % 6}T07:0${index}:00.000Z`, 'Korrutamine', 'kiur');
  }
  attempt.run(30, '2026-10-14T06:00:00.000Z', 'Arvutamine 10 piires', 'kirsi');
  attempt.run(31, '2026-10-15T06:00:00.000Z', 'Arvutamine 10 piires', 'kirsi');
  db.prepare("UPDATE attempts SET deletedAt = ? WHERE id = 31").run('2026-10-15T07:00:00.000Z');

  // Study days drive the streak: Kiur 13–15 October, Kirsi only on the 14th.
  const study = db.prepare(`
    INSERT INTO study_attempt_rewards (
      attemptId, learner, exerciseKey, score, questionCount, scorePercent, baseValueBeforeScore,
      earnedBeforeCap, awardedAmount, dailyCap, dailyLearningEarnedBefore, dailyLearningEarnedAfter,
      decayAttemptNumberToday, createdAt
    ) VALUES (?, ?, 'x', 4, 5, 0.8, 1, 1, 1, 10, 0, 1, 1, ?)
  `);
  study.run(13, 'kiur', '2026-10-13T07:00:00.000Z');
  study.run(14, 'kiur', '2026-10-14T07:00:00.000Z');
  study.run(15, 'kiur', '2026-10-15T07:00:00.000Z');
  study.run(30, 'kirsi', '2026-10-14T06:00:00.000Z');

  const ledger = db.prepare(`
    INSERT INTO point_ledger (learner, amount, source, sourceId, description, createdAt, metadataJson)
    VALUES (?, ?, 'manual', NULL, 'test', ?, NULL)
  `);
  ledger.run('kiur', 12.5, '2026-10-10T07:00:00.000Z');
  ledger.run('kirsi', 7, '2026-10-10T07:00:00.000Z');
  ledger.run('kirsi', -2, '2026-10-11T07:00:00.000Z');

  // Stored standings over two months; today is not the newest-first top row's
  // only competitor, and days other than today must not leak into "today".
  const day = db.prepare(`
    INSERT INTO daily_leaderboard (date, kiurCount, kirsiCount, winner, updatedAt)
    VALUES (?, ?, ?, ?, '2026-10-15T00:00:00.000Z')
  `);
  day.run('2026-09-29', 5, 1, 'kiur');
  day.run('2026-10-12', 1, 4, 'kirsi');
  day.run('2026-10-13', 3, 1, 'kiur');
  day.run('2026-10-14', 2, 2, 'tie');
  day.run(TODAY, 4, 1, 'kiur');
  day.run('2026-10-16', 9, 9, 'tie');
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
  db.pragma('foreign_keys = OFF');
  db.exec(`
    DELETE FROM study_attempt_rewards;
    DELETE FROM point_ledger;
    DELETE FROM attempts;
    DELETE FROM daily_leaderboard;
    DELETE FROM trophy_adjustments;
    DELETE FROM monthly_competition_awards;
  `);
  db.pragma('foreign_keys = ON');
  seed();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('GET /api/home-summary', () => {
  it('returns the same numbers and rows as the five requests it replaces', async () => {
    const summary = await (await homeSummary()).json() as Summary;

    const board = await (await leaderboard()).json() as { days: DailyStandingsRow[] };
    expect(summary.today).toEqual(todayStandings(board.days, TODAY));
    expect(summary.today).toEqual({ kiur: 4, kirsi: 1 });

    for (const learner of ['kiur', 'kirsi'] as const) {
      const dashboard = await (await childDashboard(new NextRequest(`https://example.test/api/child-dashboard?learner=${learner}`))).json() as {
        streak: number; balance: number; trophies: number;
      };
      const page = await (await history(new Request(`https://example.test/api/history?learner=${learner}&limit=3`))).json() as { items: unknown[] };
      const child = summary.children[learner];
      expect({ streak: child.streak, balance: child.balance, trophies: child.trophies })
        .toEqual({ streak: dashboard.streak, balance: dashboard.balance, trophies: dashboard.trophies });
      expect(child.recent).toEqual(page.items);
    }

    expect(summary.children.kiur).toMatchObject({ streak: 3, balance: 12.5, trophies: 1 });
    expect(summary.children.kirsi).toMatchObject({ streak: 1, balance: 5, trophies: 1 });
    expect(summary.children.kiur.recent.map((row) => row.id)).toEqual([15, 14, 13]);
    // The hidden row is skipped and the legacy row is Kirsi's by its category.
    expect(summary.children.kirsi.recent.map((row) => row.id)).toEqual([30, 1]);
  });

  it('is 0–0 today before anything is recorded today', async () => {
    db.prepare('DELETE FROM daily_leaderboard WHERE date = ?').run(TODAY);
    const summary = await (await homeSummary()).json() as Summary;
    expect(summary.today).toEqual({ kiur: 0, kirsi: 0 });
  });

  it('reads only today\'s leaderboard row, never the whole board', async () => {
    // `db` is a proxy; spy on the connection it forwards to.
    const prepare = vi.spyOn(getDatabase(), 'prepare');
    await homeSummary();
    const boardReads = prepare.mock.calls
      .map(([sql]) => String(sql).replace(/\s+/g, ' ').trim())
      .filter((sql) => /^SELECT\b.*\bFROM daily_leaderboard\b/i.test(sql));
    expect(boardReads.some((sql) => /WHERE date = \?/.test(sql))).toBe(true);
    // Every read is scoped: today's row, or a month for the trophies.
    for (const sql of boardReads) expect(sql, sql).toMatch(/WHERE (date = \?|substr\(date, 1, 7\) = \?)/);
    expect(boardReads.some((sql) => /ORDER BY date DESC/.test(sql))).toBe(false);
  });
});
