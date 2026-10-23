import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import db, { runMigrations } from '@/lib/db';
import { type RoundState } from '@/lib/kaardimang/engine';
import {
  activeCompetition,
  createCompetition,
  endCompetitionNow,
  extendCompetition,
  medalsOf,
  playerLevel,
  setPlayerLevel,
  standingsFor
} from '@/lib/server/kaardimang/competition';
import { answer, getOverview, getRound, markShown, startRound, type KaardimangContext } from '@/lib/server/kaardimang/rounds';
import { getBalance } from '@/lib/tasks';

// The family competition on a real (test) database: counted rounds, points,
// learned places, prizes and the competition's life cycle (backlog KM-02).

const as = (learner: 'kiur' | 'kirsi' | 'kairi' | 'kaur'): KaardimangContext => ({ scope: learner === 'kairi' || learner === 'kaur' ? 'parent' : 'child', learner });
let counter = 0;
const aid = () => `comp-action-${++counter}-xx`;
const frozen = (roundId: string) => JSON.parse((db.prepare('SELECT stateJson FROM kaardimang_rounds WHERE id = ?').get(roundId) as { stateJson: string }).stateJson) as RoundState;

function at(iso: string) {
  vi.setSystemTime(new Date(iso));
}

// Answers every question; `wrongFirst` of them get one wrong answer first.
function play(context: KaardimangContext, roundId: string, options: { wrongFirst?: number; secondsEach?: number } = {}) {
  let wrongLeft = options.wrongFirst ?? 0;
  for (;;) {
    const view = getRound(context, roundId);
    if (view.status !== 'active') return view;
    const index = view.cursor;
    markShown(context, roundId, index);
    if (options.secondsEach) vi.setSystemTime(new Date(Date.now() + options.secondsEach * 1000));
    const question = frozen(roundId).questions[index];
    if (wrongLeft-- > 0) {
      const wrong = question.options ? question.options.find((option) => option.id !== question.answerId)!.id : (question.answerId === 'ee-harju' ? 'ee-tartu' : 'ee-harju');
      answer(context, roundId, { actionId: aid(), revision: getRound(context, roundId).revision, questionIndex: index, answerId: wrong });
    }
    answer(context, roundId, { actionId: aid(), revision: getRound(context, roundId).revision, questionIndex: index, answerId: question.answerId });
  }
}

function start(context: KaardimangContext, viewId = 'estonia') {
  return startRound(context, { actionId: aid(), viewId, setId: null, level: 'explorer' });
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  at('2026-10-23T09:00:00.000Z');
  db.pragma('foreign_keys = OFF');
  db.exec(`
    DELETE FROM kaardimang_points; DELETE FROM kaardimang_awards; DELETE FROM kaardimang_competitions;
    DELETE FROM kaardimang_rounds; DELETE FROM kaardimang_target_stats; DELETE FROM kaardimang_player_settings;
    DELETE FROM point_ledger;
  `);
  db.pragma('foreign_keys = ON');
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Kaardimäng family competition', () => {
  it('lets the parent open one competition at a time, on chosen maps, for a number of days', () => {
    const created = createCompetition({ title: 'Eesti nädal', views: ['estonia'], days: 7 });
    expect(created).toMatchObject({ title: 'Eesti nädal', views: ['estonia'], startDate: '2026-10-23', endDate: '2026-10-29', rewards: [20, 10, 5], status: 'active' });
    expect(() => createCompetition({ title: 'Teine', views: ['estonia'], days: 3 })).toThrow('Üks võistlus juba käib');
    expect(() => createCompetition({ title: '', views: ['estonia'], days: 3 })).toThrow();
  });

  it('plays each player at the level the parent set', () => {
    expect([playerLevel('kirsi'), playerLevel('kiur'), playerLevel('kaur')]).toEqual(['explorer', 'traveler', 'geographer']);
    setPlayerLevel('kiur', 'geographer');
    const round = start(as('kiur'));
    expect(round.level).toBe('geographer');
    expect(getOverview(as('kiur')).level).toBe('geographer');
  });

  it('counts only the first three rounds of a day on a competition map', () => {
    createCompetition({ title: 'Eesti', views: ['estonia'], days: 7 });
    const counted = [start(as('kirsi')), start(as('kirsi')), start(as('kirsi'))];
    expect(counted.every((round) => round.competition?.title === 'Eesti')).toBe(true);
    expect(start(as('kirsi')).competition).toBeNull();
    expect(start(as('kirsi'), 'europe-baltics').competition).toBeNull();
    expect(getOverview(as('kirsi')).competition?.countedLeftToday).toBe(0);
    at('2026-10-24T09:00:00.000Z');
    expect(getOverview(as('kirsi')).competition?.countedLeftToday).toBe(3);
    expect(start(as('kirsi')).competition).not.toBeNull();
  });

  it('scores new places 3, after the hint 1, and a quick answer +1; practice scores nothing', () => {
    const competition = createCompetition({ title: 'Eesti', views: ['estonia'], days: 7 });
    const round = start(as('kirsi'));
    const total = round.questions.length;
    play(as('kirsi'), round.roundId, { wrongFirst: 1, secondsEach: 30 });
    const points = db.prepare('SELECT points, speedBonus FROM kaardimang_points WHERE roundId = ? ORDER BY questionIndex').all(round.roundId) as Array<{ points: number; speedBonus: number }>;
    expect(points).toHaveLength(total);
    expect(points[0]).toEqual({ points: 1, speedBonus: 0 });
    // Avastaja asks six counties, some twice: a repeat is "learning" (2), a new one 3; 30 s is too slow for a bonus.
    expect(points.slice(1).every((row) => (row.points === 3 || row.points === 2) && row.speedBonus === 0)).toBe(true);
    const fast = start(as('kaur'));
    setPlayerLevel('kaur', 'geographer');
    play(as('kaur'), fast.roundId, { secondsEach: 3 });
    const kaur = db.prepare('SELECT SUM(speedBonus) AS bonus, COUNT(*) AS n FROM kaardimang_points WHERE roundId = ?').get(fast.roundId) as { bonus: number; n: number };
    expect(kaur.bonus).toBe(kaur.n);
    const practice = start(as('kiur'), 'europe-baltics');
    play(as('kiur'), practice.roundId);
    expect(standingsFor(competition.id).find((row) => row.player === 'kiur')!.points).toBe(0);
  });

  it('learns a place on its second day of first-try answers, and scores a learned place 1', () => {
    createCompetition({ title: 'Eesti', views: ['estonia'], days: 7 });
    play(as('kirsi'), start(as('kirsi')).roundId);
    expect((db.prepare("SELECT COUNT(*) AS n FROM kaardimang_target_stats WHERE learner = 'kirsi' AND learnedAt IS NOT NULL").get() as { n: number }).n).toBe(0);
    at('2026-10-24T09:00:00.000Z');
    const second = start(as('kirsi'));
    play(as('kirsi'), second.roundId);
    const rows = db.prepare('SELECT targetKey, points, newlyLearned FROM kaardimang_points WHERE roundId = ?').all(second.roundId) as Array<{ targetKey: string; points: number; newlyLearned: number }>;
    expect(rows.some((row) => row.newlyLearned === 1)).toBe(true);
    expect(standingsFor(activeCompetition()!.id).find((row) => row.player === 'kirsi')!.learnedTotal).toBeGreaterThan(0);
    at('2026-10-25T09:00:00.000Z');
    const third = start(as('kirsi'));
    play(as('kirsi'), third.roundId);
    const learnedKeys = new Set((db.prepare("SELECT targetKey FROM kaardimang_target_stats WHERE learner = 'kirsi' AND learnedAt < '2026-10-25'").all() as Array<{ targetKey: string }>).map((row) => row.targetKey));
    const scores = db.prepare('SELECT targetKey, points FROM kaardimang_points WHERE roundId = ?').all(third.roundId) as Array<{ targetKey: string; points: number }>;
    expect(scores.filter((row) => learnedKeys.has(row.targetKey)).every((row) => row.points === 1)).toBe(true);
  });

  it('pays the children their place\'s stars when it ends; a parent on the podium gets a medal only', () => {
    const competition = createCompetition({ title: 'Eesti', views: ['estonia'], days: 2, rewards: [20, 10, 5] });
    play(as('kaur'), start(as('kaur')).roundId, { secondsEach: 2 });
    play(as('kiur'), start(as('kiur')).roundId, { secondsEach: 2 });
    play(as('kirsi'), start(as('kirsi')).roundId, { wrongFirst: 3, secondsEach: 40 });
    const table = standingsFor(competition.id).filter((row) => row.points > 0);
    expect(table.map((row) => row.player)).toEqual(expect.arrayContaining(['kaur', 'kiur', 'kirsi']));
    // It ends by itself after its last day: the next read settles it once.
    at('2026-10-25T06:00:00.000Z');
    expect(activeCompetition()).toBeNull();
    expect(activeCompetition()).toBeNull();
    const medals = Object.fromEntries((['kiur', 'kirsi', 'kaur'] as const).map((player) => [player, medalsOf(player)]));
    for (const row of table) {
      expect(medals[row.player as 'kiur'][0]?.place, row.player).toBe(row.rank);
    }
    const prizeOf = (player: 'kiur' | 'kirsi') => (db.prepare("SELECT COALESCE(SUM(amount), 0) AS sum FROM point_ledger WHERE learner = ? AND source = 'kaardimang_prize'").get(player) as { sum: number }).sum;
    const rank = (player: string) => table.find((row) => row.player === player)!.rank;
    expect(prizeOf('kiur')).toBe([20, 10, 5][rank('kiur') - 1]);
    expect(prizeOf('kirsi')).toBe([20, 10, 5][rank('kirsi') - 1] ?? 0);
    expect(medalsOf('kaur')[0].stars).toBe(0);
    expect(getBalance('kiur')).toBe(prizeOf('kiur'));
  });

  it('can be ended early or extended while it runs', () => {
    const competition = createCompetition({ title: 'Eesti', views: ['estonia'], days: 3 });
    expect(extendCompetition(competition.id, 4).endDate).toBe('2026-10-29');
    play(as('kiur'), start(as('kiur')).roundId);
    const ended = endCompetitionNow(competition.id);
    expect(ended.status).toBe('ended');
    expect(medalsOf('kiur')[0]).toMatchObject({ place: 1, stars: 20 });
    expect(() => endCompetitionNow(competition.id)).toThrow('Seda võistlust ei käi.');
    expect((db.prepare("SELECT COUNT(*) AS n FROM point_ledger WHERE source = 'kaardimang_prize'").get() as { n: number }).n).toBe(1);
  });
});

describe('migration 14', () => {
  it('copies every map-game round and statistic from before, and lets Kairi and Kaur play', () => {
    const connection = new Database(':memory:');
    runMigrations(connection, 13);
    connection.prepare(`INSERT INTO kaardimang_rounds (id, learner, viewId, level, dataVersion, status, stateJson, startActionId, correct, total, startedAt, updatedAt, completedAt)
      VALUES ('km_old', 'preview', 'europe-baltics', 'traveler', '2026-10-17.1', 'completed', '{"x":1}', 'a1', 6, 8, '2026-10-18T10:00:00Z', '2026-10-18T10:05:00Z', '2026-10-18T10:05:00Z')`).run();
    connection.prepare(`INSERT INTO kaardimang_target_stats (learner, targetKey, seen, firstTryCorrect, missCount, lastSeenAt, lastMissedAt)
      VALUES ('preview', 'country:EST', 4, 3, 1, '2026-10-18T10:05:00Z', '2026-10-18T10:01:00Z')`).run();
    runMigrations(connection);
    expect(connection.prepare("SELECT id, learner, viewId, correct, total, stateJson, completedAt, competitionId FROM kaardimang_rounds").all()).toEqual([
      { id: 'km_old', learner: 'preview', viewId: 'europe-baltics', correct: 6, total: 8, stateJson: '{"x":1}', completedAt: '2026-10-18T10:05:00Z', competitionId: null }
    ]);
    expect(connection.prepare("SELECT learner, targetKey, seen, firstTryCorrect, missCount, firstTryDays, learnedAt FROM kaardimang_target_stats").all()).toEqual([
      { learner: 'preview', targetKey: 'country:EST', seen: 4, firstTryCorrect: 3, missCount: 1, firstTryDays: 0, learnedAt: null }
    ]);
    const insert = (id: string, learner: string) => connection.prepare(`INSERT INTO kaardimang_rounds (id, learner, viewId, level, dataVersion, status, stateJson, startActionId, total, startedAt, updatedAt)
      VALUES (?, ?, 'estonia', 'explorer', 'v', 'completed', '{}', ?, 8, 't', 't')`).run(id, learner, id);
    insert('km_kairi', 'kairi');
    insert('km_kaur', 'kaur');
    expect(() => insert('km_stranger', 'stranger')).toThrow();
    // One open round per player still holds.
    connection.prepare("UPDATE kaardimang_rounds SET status = 'active' WHERE id = 'km_kairi'").run();
    expect(() => connection.prepare("INSERT INTO kaardimang_rounds (id, learner, viewId, level, dataVersion, status, stateJson, startActionId, total, startedAt, updatedAt) VALUES ('km_k2', 'kairi', 'estonia', 'explorer', 'v', 'active', '{}', 'k2', 8, 't', 't')").run()).toThrow();
    connection.close();
  });
});
