import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { COUNTIES } from '@/content/kaardimang/regions';
import { kaardimangAchievements, longestDayRun } from '@/lib/server/kaardimang/achievements';

// The Kaardimäng achievement shelf (backlog KM-03), derived from the game's tables.

const TODAY = '2026-10-23';

function learn(player: string, keys: string[]) {
  const insert = db.prepare(`INSERT INTO kaardimang_target_stats (learner, targetKey, seen, firstTryCorrect, missCount, lastSeenAt, firstTryDays, lastFirstTryDay, learnedAt)
    VALUES (?, ?, 2, 2, 0, '2026-10-20T10:00:00Z', 2, '2026-10-20', '2026-10-20T10:00:00Z')`);
  for (const key of keys) insert.run(player, key);
}

function completedRound(player: string, id: string, completedAt: string) {
  db.prepare(`INSERT INTO kaardimang_rounds (id, learner, viewId, level, dataVersion, status, stateJson, startActionId, total, startedAt, updatedAt, completedAt)
    VALUES (?, ?, 'estonia', 'explorer', 'v', 'completed', '{}', ?, 8, ?, ?, ?)`).run(id, player, id, completedAt, completedAt, completedAt);
}

const byId = (player: 'kiur' | 'kirsi' | 'kaur') => Object.fromEntries(kaardimangAchievements(player, TODAY).map((item) => [item.id.replace(/-\d+$/, ''), item]));

beforeEach(() => {
  db.pragma('foreign_keys = OFF');
  db.exec('DELETE FROM kaardimang_target_stats; DELETE FROM kaardimang_rounds; DELETE FROM kaardimang_awards; DELETE FROM kaardimang_competitions;');
  db.pragma('foreign_keys = ON');
});

describe('Kaardimäng achievements', () => {
  it('unlocks Eesti maakonnad once all 15 counties are learned, and shows the progress until then', () => {
    learn('kirsi', COUNTIES.slice(0, 9).map((county) => `county:${county.id}`));
    expect(byId('kirsi')['eesti-maakonnad']).toMatchObject({ current: 9, target: 15, unlocked: false });
    learn('kirsi', COUNTIES.slice(9).map((county) => `county:${county.id}`));
    expect(byId('kirsi')['eesti-maakonnad']).toMatchObject({ current: 15, unlocked: true });
    // Another player's progress is their own.
    expect(byId('kiur')['eesti-maakonnad'].current).toBe(0);
  });

  it('counts only learned places, not ones merely seen', () => {
    db.prepare(`INSERT INTO kaardimang_target_stats (learner, targetKey, seen, firstTryCorrect, missCount, lastSeenAt) VALUES ('kiur', 'ocean:pacific', 5, 1, 2, '2026-10-20T10:00:00Z')`).run();
    learn('kiur', ['ocean:atlantic']);
    expect(byId('kiur').ookeanid).toMatchObject({ current: 1, target: 5 });
  });

  it('moves the capital and round milestones up a tier once one is reached', () => {
    learn('kaur', Array.from({ length: 12 }, (_, i) => `capital:C${i}`));
    expect(byId('kaur').pealinnad).toMatchObject({ title: '10 pealinna', unlocked: true });
    for (let i = 0; i < 9; i++) completedRound('kaur', `km_r${i}`, `2026-10-${String(10 + i).padStart(2, '0')}T10:00:00Z`);
    expect(byId('kaur').voorud).toMatchObject({ title: '10 vooru', current: 9, unlocked: false });
    completedRound('kaur', 'km_r9', '2026-10-22T10:00:00Z');
    expect(byId('kaur').voorud).toMatchObject({ title: '10 vooru', unlocked: true });
  });

  it('counts the longest run of days with a finished round', () => {
    expect(longestDayRun(['2026-10-01', '2026-10-02', '2026-10-02', '2026-10-03', '2026-10-05', '2026-10-06'])).toBe(3);
    for (const day of ['18', '19', '20', '21', '22', '23', '24']) completedRound('kirsi', `km_d${day}`, `2026-10-${day}T09:00:00Z`);
    // The 24th is after "today" and does not count yet, so the run is 18.–23.
    // Six days in a row: the 3-day tier is the highest one reached.
    expect(byId('kirsi')['jarjest']).toMatchObject({ title: '3 päeva järjest', unlocked: true });
  });

  it('turns medals into Esikolmikus and Võitja', () => {
    db.prepare("INSERT INTO kaardimang_awards (competitionId, player, place, points, stars, createdAt) VALUES (1, 'kirsi', 2, 30, 10, 't')").run();
    expect([byId('kirsi').esikolmik.unlocked, byId('kirsi').voitja.unlocked]).toEqual([true, false]);
    db.prepare("INSERT INTO kaardimang_awards (competitionId, player, place, points, stars, createdAt) VALUES (2, 'kirsi', 1, 40, 20, 't')").run();
    expect(byId('kirsi').voitja.unlocked).toBe(true);
  });

  it('stores nothing: the shelf is read, never written', () => {
    const before = (db.prepare("SELECT COUNT(*) AS n FROM sqlite_master WHERE type = 'table' AND name LIKE '%achievement%'").get() as { n: number }).n;
    kaardimangAchievements('kiur', TODAY);
    expect((db.prepare("SELECT COUNT(*) AS n FROM sqlite_master WHERE type = 'table' AND name LIKE '%achievement%'").get() as { n: number }).n).toBe(before);
  });
});
