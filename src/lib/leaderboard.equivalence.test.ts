import { afterAll, describe, expect, it } from 'vitest';
import db, { openDatabase, type DatabaseConnection } from '@/lib/db';
import { isoToAppDate, addAppDays } from '@/lib/appDate';
import { isKirsiAttempt } from '@/lib/history';
import { UNDATED_ATTEMPTS_SQL, rebuildDailyLeaderboard, recordDailyLeaderboard } from '@/lib/leaderboard';
import { qualifySprintsPure, recomputeSprintQualifications } from '@/lib/sprintQualification';

// SRV-08 equivalence proof. The day count, the full rebuild and the sprint
// qualification pass were rewritten for speed (bounded createdAt window, one
// grouped pass, sprintQualified read in the same query, write-only-on-change).
// The REFERENCE below is the pre-SRV-08 code, copied verbatim apart from taking
// an explicit connection. Every seed builds the same random history in the app
// database (new code) and in a second, independent database (reference code),
// then demands identical sprint facts, identical daily_leaderboard contents and
// identical per-day counts.

// ---------------------------------------------------------------- reference --

type RefAttemptRow = {
  id: number; category: string; learner: string | null; createdAt: string; subject: string | null;
  topic: string | null; score: number; protocolVersion: number; rewardSettlementStatus: string;
};

function refAllAttempts(conn: DatabaseConnection): RefAttemptRow[] {
  return conn
    .prepare('SELECT id, category, learner, createdAt, subject, topic, score, protocolVersion, rewardSettlementStatus FROM attempts')
    .all() as RefAttemptRow[];
}

function refSprintAttemptQualifies(conn: DatabaseConnection, attempt: { id: number; subject?: string | null; topic?: string | null }) {
  if (attempt.subject !== 'inglise-keel' || attempt.topic !== 'sprint') return true;
  const row = conn.prepare(`
    SELECT recordBeforeRun, requiredScore, score, sprintQualified, qualificationRuleVersion
    FROM attempts WHERE id = ? AND subject = 'inglise-keel' AND topic = 'sprint'
  `).get(attempt.id) as { sprintQualified: number | null } | undefined;
  if (!row) return false;
  return row.sprintQualified === 1;
}

function refIsAuthoritative(row: RefAttemptRow) {
  if (row.protocolVersion === 2) return row.rewardSettlementStatus === 'eligible';
  return true;
}

function refCountsForDate(conn: DatabaseConnection, date: string) {
  let kiurCount = 0;
  let kirsiCount = 0;
  for (const row of refAllAttempts(conn)) {
    if (isoToAppDate(row.createdAt) !== date) continue;
    if (!(refIsAuthoritative(row) && refSprintAttemptQualifies(conn, row))) continue;
    if (isKirsiAttempt(row.category, row.learner)) kirsiCount++;
    else kiurCount++;
  }
  return { kiurCount, kirsiCount };
}

function refWinner(kiur: number, kirsi: number) {
  if (kiur === kirsi) return 'tie';
  return kiur > kirsi ? 'kiur' : 'kirsi';
}

function refUpsert(conn: DatabaseConnection, date: string, kiur: number, kirsi: number) {
  conn.prepare(`
    INSERT INTO daily_leaderboard (date, kiurCount, kirsiCount, winner, updatedAt) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET kiurCount = excluded.kiurCount, kirsiCount = excluded.kirsiCount,
      winner = excluded.winner, updatedAt = excluded.updatedAt
  `).run(date, kiur, kirsi, refWinner(kiur, kirsi), 'ref');
}

// Daily rows only; the monthly re-settlement that follows is unchanged code.
function refRebuild(conn: DatabaseConnection) {
  const dates = new Set<string>();
  for (const row of refAllAttempts(conn)) {
    const date = isoToAppDate(row.createdAt);
    if (date) dates.add(date);
  }
  conn.transaction(() => {
    for (const row of conn.prepare('SELECT date FROM daily_leaderboard').all() as Array<{ date: string }>) dates.add(row.date);
    for (const date of dates) {
      const { kiurCount, kirsiCount } = refCountsForDate(conn, date);
      refUpsert(conn, date, kiurCount, kirsiCount);
    }
  })();
}

function refRecompute(conn: DatabaseConnection) {
  const rows = conn.prepare(`
    SELECT id, clientAttemptId, effectiveCompletedAt, createdAt, score
    FROM attempts
    WHERE learner = 'kiur' AND subject = 'inglise-keel' AND topic = 'sprint'
      AND (COALESCE(protocolVersion, 1) <> 2 OR rewardSettlementStatus = 'eligible')
  `).all() as Parameters<typeof qualifySprintsPure>[0];
  const qualifications = qualifySprintsPure(rows);
  const update = conn.prepare(`
    UPDATE attempts SET recordBeforeRun = ?, requiredScore = ?, sprintQualified = ?,
      qualificationRuleVersion = ? WHERE id = ?
  `);
  for (const [id, value] of qualifications) {
    update.run(value.recordBeforeRun, value.requiredScore, value.qualified ? 1 : 0, value.qualificationRuleVersion, id);
  }
  return qualifications;
}

// ------------------------------------------------------------ random world --

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Days around both 2026/27 Tallinn DST switches, a year boundary and an
// ordinary summer day.
const ANCHORS = ['2026-10-24', '2026-10-25', '2026-10-26', '2027-03-27', '2027-03-28', '2027-03-29', '2026-12-31', '2027-01-01', '2026-07-15'];
const OFFSETS = [180, 120, -300, 840, -720, 330, 0];

function pick<T>(rand: () => number, items: readonly T[]): T {
  return items[Math.floor(rand() * items.length)];
}

function withOffset(ms: number, offsetMinutes: number) {
  const local = new Date(ms + offsetMinutes * 60000).toISOString().slice(0, 19);
  const sign = offsetMinutes < 0 ? '-' : '+';
  const abs = Math.abs(offsetMinutes);
  return `${local}${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
}

// A timestamp close to a Tallinn midnight (21:00Z in summer, 22:00Z in
// winter), in one of the shapes that exist in real or legacy rows.
function randomCreatedAt(rand: () => number) {
  const anchor = pick(rand, ANCHORS);
  const base = Date.parse(`${anchor}T00:00:00.000Z`);
  const edges = [-4, -3, -2, -1, 0, 1, 21, 22].map((hours) => base + hours * 3600000);
  let ms = pick(rand, edges);
  const jitter = rand();
  if (jitter < 0.15) ms -= 1;
  else if (jitter < 0.8) ms += Math.floor((rand() - 0.5) * 2 * 3600000);
  const shape = rand();
  if (shape < 0.62) return new Date(ms).toISOString();
  if (shape < 0.72) return `${new Date(ms).toISOString().slice(0, 19)}Z`;
  if (shape < 0.86) return withOffset(ms, pick(rand, OFFSETS));
  if (shape < 0.89) return anchor;
  if (shape < 0.92) return `${new Date(ms).toISOString().slice(0, 10)} ${new Date(ms).toISOString().slice(11, 19)}`;
  if (shape < 0.95) return new Date(ms).toString();
  if (shape < 0.97) return 'not-a-date';
  return '';
}

type World = { rows: Array<Record<string, unknown>>; poisoned: Array<{ date: string; kiur: number; kirsi: number }> };

function randomAttempt(rand: () => number, id: number) {
  const createdAt = randomCreatedAt(rand);
  const kind = rand();
  let learner: string | null;
  let category: string;
  let subject: string | null;
  let topic: string | null;
  if (kind < 0.35) {
    learner = 'kiur'; category = 'Inglise keel - sprint'; subject = 'inglise-keel'; topic = 'sprint';
  } else if (kind < 0.4) {
    // A sprint-shaped row that is not Kiur's: never qualified by the pass.
    learner = pick(rand, ['kirsi', null]); category = 'Inglise keel - sprint'; subject = 'inglise-keel'; topic = 'sprint';
  } else if (kind < 0.55) {
    learner = null; category = pick(rand, ['Arvutamine 10 piires', 'Korrutamine', 'Segaülesanded']); subject = null; topic = null;
  } else {
    learner = pick(rand, ['kiur', 'kirsi']); category = 'Korrutamine'; subject = pick(rand, ['matemaatika', 'inglise-keel']); topic = pick(rand, ['korrutamine', 'sonad', null]);
  }
  const protocolVersion = pick(rand, [1, 2, 2, 2]);
  const status = rand() < 0.7 ? 'eligible' : pick(rand, ['needs_review', 'withheld']);
  // Sprint facts: equal times and client ids exercise every tie-breaker; some
  // rows carry stale or impossible stored facts the pass must overwrite.
  const effective = rand() < 0.3 ? null : new Date(Date.parse('2026-10-25T00:00:00.000Z') + Math.floor(rand() * 6) * 600000).toISOString();
  const stale = rand();
  return {
    id,
    createdAt,
    category,
    score: Math.floor(rand() * 41),
    learner,
    subject,
    topic,
    clientAttemptId: rand() < 0.2 ? null : `c${Math.floor(rand() * 8)}-${id}`,
    effectiveCompletedAt: effective,
    protocolVersion,
    rewardSettlementStatus: status,
    deletedAt: rand() < 0.15 ? '2026-10-30T00:00:00.000Z' : null,
    recordBeforeRun: stale < 0.3 ? Math.floor(rand() * 40) : null,
    requiredScore: stale < 0.3 ? Math.floor(rand() * 20) : null,
    sprintQualified: stale < 0.3 ? pick(rand, [0, 1]) : stale < 0.4 ? 1 : null,
    qualificationRuleVersion: stale < 0.3 ? pick(rand, ['kiur-sprint-v1', 'kiur-sprint-v2']) : null
  };
}

function randomWorld(seed: number): World {
  const rand = mulberry32(seed);
  const count = 15 + Math.floor(rand() * 60);
  const rows = Array.from({ length: count }, (_, index) => randomAttempt(rand, index + 1));
  const poisoned = Array.from({ length: Math.floor(rand() * 4) }, () => ({
    date: addAppDays(pick(rand, ANCHORS), Math.floor(rand() * 7) - 3),
    kiur: Math.floor(rand() * 9),
    kirsi: Math.floor(rand() * 9)
  }));
  return { rows, poisoned };
}

const COLUMNS = [
  'id', 'createdAt', 'category', 'score', 'learner', 'subject', 'topic', 'clientAttemptId', 'effectiveCompletedAt',
  'protocolVersion', 'rewardSettlementStatus', 'deletedAt', 'recordBeforeRun', 'requiredScore', 'sprintQualified',
  'qualificationRuleVersion'
];

function load(conn: DatabaseConnection, world: World) {
  conn.pragma('foreign_keys = OFF');
  conn.exec('DELETE FROM attempts; DELETE FROM daily_leaderboard; DELETE FROM monthly_competition_awards;');
  conn.pragma('foreign_keys = ON');
  const insert = conn.prepare(`
    INSERT INTO attempts (${COLUMNS.join(', ')}, difficulty, questionCount, elapsedSeconds, questions)
    VALUES (${COLUMNS.map((column) => `@${column}`).join(', ')}, 'Lihtne', 40, 60, '[]')
  `);
  const poison = conn.prepare("INSERT OR REPLACE INTO daily_leaderboard (date, kiurCount, kirsiCount, winner, updatedAt) VALUES (?, ?, ?, 'tie', 'poison')");
  conn.transaction(() => {
    for (const row of world.rows) insert.run(row);
    for (const entry of world.poisoned) poison.run(entry.date, entry.kiur, entry.kirsi);
  })();
}

function sprintFacts(conn: DatabaseConnection) {
  return conn.prepare('SELECT id, recordBeforeRun, requiredScore, sprintQualified, qualificationRuleVersion FROM attempts ORDER BY id').all();
}

function dailyRows(conn: DatabaseConnection) {
  return conn.prepare('SELECT date, kiurCount, kirsiCount, winner FROM daily_leaderboard ORDER BY date').all();
}

// A row can only change the count of its own app date, so probing every date
// that holds a row (plus the anchors, their neighbours and poisoned dates)
// catches any row the bounded read misses.
function datesToProbe(conn: DatabaseConnection, world: World) {
  const dates = new Set<string>();
  for (const row of conn.prepare('SELECT createdAt FROM attempts').all() as Array<{ createdAt: string }>) {
    const date = isoToAppDate(row.createdAt);
    if (date) dates.add(date);
  }
  for (const anchor of ANCHORS) {
    dates.add(addAppDays(anchor, -1));
    dates.add(anchor);
  }
  for (const entry of world.poisoned) dates.add(entry.date);
  return [...dates].sort();
}

// Comparison against the reference for one state of both databases.
function expectSame(reference: DatabaseConnection, world: World, label: string) {
  const app = db as unknown as DatabaseConnection;
  refRecompute(reference);
  recomputeSprintQualifications();
  expect(sprintFacts(app), `${label}: sprint facts`).toEqual(sprintFacts(reference));

  refRebuild(reference);
  rebuildDailyLeaderboard();
  expect(dailyRows(app), `${label}: rebuilt daily_leaderboard`).toEqual(dailyRows(reference));

  for (const date of datesToProbe(reference, world)) {
    const expected = refCountsForDate(reference, date);
    const actual = recordDailyLeaderboard(date);
    expect({ kiurCount: actual.kiurCount, kirsiCount: actual.kirsiCount }, `${label}: counts for ${date}`).toEqual(expected);
    refUpsert(reference, date, expected.kiurCount, expected.kirsiCount);
  }
  expect(dailyRows(app), `${label}: daily_leaderboard after per-day records`).toEqual(dailyRows(reference));
}

// Same mutation applied to both databases: approve held rows, hide or unhide
// history rows, add an older offline sprint.
function mutate(conn: DatabaseConnection, seed: number, nextId: number) {
  const rand = mulberry32(seed * 7919 + 13);
  const ids = (conn.prepare('SELECT id FROM attempts ORDER BY id').all() as Array<{ id: number }>).map((row) => row.id);
  for (const id of ids) {
    const roll = rand();
    if (roll < 0.2) conn.prepare("UPDATE attempts SET rewardSettlementStatus = 'eligible' WHERE id = ?").run(id);
    else if (roll < 0.35) conn.prepare("UPDATE attempts SET deletedAt = '2026-11-01T00:00:00.000Z' WHERE id = ?").run(id);
    else if (roll < 0.4) conn.prepare('UPDATE attempts SET deletedAt = NULL WHERE id = ?').run(id);
  }
  const extra = randomAttempt(rand, nextId);
  conn.prepare(`
    INSERT INTO attempts (${COLUMNS.join(', ')}, difficulty, questionCount, elapsedSeconds, questions)
    VALUES (${COLUMNS.map((column) => `@${column}`).join(', ')}, 'Lihtne', 40, 60, '[]')
  `).run({ ...extra, learner: 'kiur', subject: 'inglise-keel', topic: 'sprint', category: 'Inglise keel - sprint', effectiveCompletedAt: '2026-10-01T00:00:00.000Z' });
}

const SEEDS = 250;
const reference = openDatabase(':memory:');
afterAll(() => reference.close());

describe('SRV-08 leaderboard and sprint qualification equivalence', () => {
  it(`matches the pre-SRV-08 implementation on ${SEEDS} random histories`, { timeout: 120_000 }, () => {
    const app = db as unknown as DatabaseConnection;
    let probedDays = 0;
    let undatedRows = 0;
    let offsetRows = 0;
    for (let seed = 1; seed <= SEEDS; seed++) {
      const world = randomWorld(seed);
      load(app, world);
      load(reference, world);
      expectSame(reference, world, `seed ${seed}`);
      probedDays += datesToProbe(reference, world).length;
      undatedRows += world.rows.filter((row) => !/^\d{4}-\d{2}-\d{2}/.test(String(row.createdAt))).length;
      offsetRows += world.rows.filter((row) => /[+-]\d{2}:\d{2}$/.test(String(row.createdAt))).length;

      const nextId = world.rows.length + 1;
      mutate(app, seed, nextId);
      mutate(reference, seed, nextId);
      expectSame(reference, world, `seed ${seed} after mutation`);
    }
    // The generator really produced the hard cases.
    expect(probedDays).toBeGreaterThan(SEEDS * 10);
    expect(undatedRows).toBeGreaterThan(SEEDS);
    expect(offsetRows).toBeGreaterThan(SEEDS);
  });

  it('reads one day through the createdAt index, not a table scan', () => {
    const app = db as unknown as DatabaseConnection;
    const plan = (sql: string) => (app.prepare(`EXPLAIN QUERY PLAN ${sql}`).all() as Array<{ detail: string }>).map((row) => row.detail).join(' | ');
    expect(plan('SELECT category FROM attempts WHERE createdAt >= \'2026-10-23\' AND createdAt < \'2026-10-27\''))
      .toMatch(/SEARCH attempts USING INDEX idx_attempts_created_at \(createdAt>\? AND createdAt<\?\)/);
    // The undated-row read walks the createdAt index only, never the table.
    const undatedPlan = plan(UNDATED_ATTEMPTS_SQL);
    expect(undatedPlan).toMatch(/SCAN attempts USING COVERING INDEX idx_attempts_created_at/);
    expect(undatedPlan).not.toMatch(/SCAN attempts( \||$)/);
  });

  it('writes only the sprint rows whose stored facts change', () => {
    const app = db as unknown as DatabaseConnection;
    load(app, randomWorld(4242));
    recomputeSprintQualifications();
    const before = app.prepare('SELECT total_changes() AS changes').get() as { changes: number };
    recomputeSprintQualifications();
    const after = app.prepare('SELECT total_changes() AS changes').get() as { changes: number };
    expect(after.changes - before.changes).toBe(0);
  });
});
