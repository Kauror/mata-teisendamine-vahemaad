import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { getYesterdayPointsSummary } from '@/lib/dailyPointsSummary';

const TODAY = '2026-10-15';

function ledger(amount: number, source: string, createdAt: string, effectiveDate: string | null = null, componentKey?: string) {
  db.prepare(`
    INSERT INTO point_ledger (learner, amount, source, sourceId, description, createdAt, metadataJson, effectiveDate)
    VALUES ('kiur', ?, ?, 1, 'test', ?, ?, ?)
  `).run(amount, source, createdAt, componentKey ? JSON.stringify({ componentKey }) : null, effectiveDate);
}

beforeEach(() => {
  db.exec('DELETE FROM point_ledger; DELETE FROM attempts;');
});

describe('yesterday points summary', () => {
  it('counts v2 exercise stars and maps streak/rule components to Õpiseeria (SRV-01)', () => {
    ledger(0.9, 'reward_v2', '2026-10-14T10:00:00.000Z', '2026-10-14', 'study');
    ledger(2, 'reward_v2', '2026-10-14T10:00:00.000Z', '2026-10-14', 'streak:standard');
    ledger(3, 'reward_v2', '2026-10-14T10:00:00.000Z', '2026-10-14', 'rule:7');
    const summary = getYesterdayPointsSummary('kiur', TODAY);
    expect(summary.breakdown).toEqual([
      { key: 'exercises', label: 'Harjutused', emoji: '✏️', amount: 0.9 },
      { key: 'streak', label: 'Õpiseeria', emoji: '🔥', amount: 5 }
    ]);
    expect(summary.total).toBe(5.9);
    expect(summary.hasEarnings).toBe(true);
  });

  it('nets a later negative v2 revision against the original award', () => {
    ledger(1, 'reward_v2', '2026-10-14T10:00:00.000Z', '2026-10-14', 'study');
    ledger(1, 'reward_v2', '2026-10-14T11:00:00.000Z', '2026-10-14', 'study');
    // An earlier offline attempt synced later took the first decay slot.
    ledger(-0.1, 'reward_v2', '2026-10-14T12:00:00.000Z', '2026-10-14', 'study');
    expect(getYesterdayPointsSummary('kiur', TODAY).breakdown).toEqual([
      { key: 'exercises', label: 'Harjutused', emoji: '✏️', amount: 1.9 }
    ]);
  });

  it('buckets a late offline sync by the day it was played, not the day it arrived', () => {
    // Played yesterday, synced today.
    ledger(1, 'reward_v2', '2026-10-15T06:00:00.000Z', '2026-10-14', 'study');
    // Played two days ago, synced yesterday — belongs to the day before.
    ledger(4, 'reward_v2', '2026-10-14T06:00:00.000Z', '2026-10-13', 'study');
    expect(getYesterdayPointsSummary('kiur', TODAY).total).toBe(1);
  });

  it('keeps legacy positive-only sources bucketed by createdAt', () => {
    ledger(2, 'real_world_task', '2026-10-14T10:00:00.000Z');
    ledger(-5, 'store_purchase', '2026-10-14T11:00:00.000Z');
    expect(getYesterdayPointsSummary('kiur', TODAY).breakdown).toEqual([
      { key: 'tasks', label: 'Päevategevused', emoji: '✅', amount: 2 }
    ]);
  });

  it('treats an attempt completed yesterday but synced today as practice yesterday', () => {
    db.prepare(`
      INSERT INTO attempts (createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, completionDate)
      VALUES ('2026-10-15T06:00:00.000Z', 'x', 'x', 10, 1, 1, '[]', 'kiur', '2026-10-14')
    `).run();
    const summary = getYesterdayPointsSummary('kiur', TODAY);
    expect(summary.practicedYesterday).toBe(true);
    expect(summary.hasEarnings).toBe(false);
  });
});
