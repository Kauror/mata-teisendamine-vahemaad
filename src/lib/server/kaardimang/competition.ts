import db from '@/lib/db';
import { addAppDays, todayDateString } from '@/lib/appDate';
import { nowIso } from '@/lib/tasks';
import { findView, LEVELS, type LevelId } from '@/content/kaardimang/regions';
import {
  COUNTED_ROUNDS_PER_DAY,
  DEFAULT_LEVELS,
  DEFAULT_REWARDS,
  isChildPlayer,
  PLAYER_NAMES,
  PLAYERS,
  rankStandings,
  type KaardimangPlayer,
  type StandingRow
} from '@/lib/kaardimang/competition';

// The family competition on the server (backlog KM-02): player levels, the
// one open competition, its standings, and the prizes when it ends. A
// competition ends by itself after its last app day; every read that could
// show it settles it first, so the prizes are paid exactly once
// (kaardimang_awards is the idempotency anchor), like the monthly prize.

export type CompetitionRow = {
  id: number;
  title: string;
  viewsJson: string;
  startDate: string;
  endDate: string;
  rewardsJson: string;
  status: 'active' | 'ended' | 'cancelled';
  createdAt: string;
  endedAt: string | null;
  resultsJson: string | null;
};

export type CompetitionView = {
  id: number;
  title: string;
  views: string[];
  startDate: string;
  endDate: string;
  rewards: [number, number, number];
  status: 'active' | 'ended' | 'cancelled';
  standings: StandingRow[];
};

export class CompetitionError extends Error {}

export const MAX_COMPETITION_DAYS = 60;
const TITLE_PATTERN = /^[\p{L}\p{N} ,.!?'’()«»„“-]{1,60}$/u;

/* --------------------------------------------------------------- levels */

export function playerLevel(player: KaardimangPlayer): LevelId {
  const row = db.prepare('SELECT level FROM kaardimang_player_settings WHERE player = ?').get(player) as { level: LevelId } | undefined;
  return row?.level ?? DEFAULT_LEVELS[player];
}

export function playerLevels(): Record<KaardimangPlayer, LevelId> {
  return Object.fromEntries(PLAYERS.map((player) => [player, playerLevel(player)])) as Record<KaardimangPlayer, LevelId>;
}

export function setPlayerLevel(player: KaardimangPlayer, level: unknown): Record<KaardimangPlayer, LevelId> {
  const found = LEVELS.find((item) => item.id === level)?.id;
  if (!found) throw new CompetitionError('Sellist raskusastet ei ole.');
  db.prepare(`
    INSERT INTO kaardimang_player_settings (player, level, updatedAt) VALUES (?, ?, ?)
    ON CONFLICT(player) DO UPDATE SET level = excluded.level, updatedAt = excluded.updatedAt
  `).run(player, found, nowIso());
  return playerLevels();
}

/* ------------------------------------------------------------ standings */

function learnedTotal(player: KaardimangPlayer): number {
  return (db.prepare('SELECT COUNT(*) AS count FROM kaardimang_target_stats WHERE learner = ? AND learnedAt IS NOT NULL').get(player) as { count: number }).count;
}

export function standingsFor(competitionId: number): StandingRow[] {
  const sums = db.prepare(`
    SELECT player, SUM(points + speedBonus) AS points, SUM(newlyLearned) AS newlyLearned
    FROM kaardimang_points WHERE competitionId = ? GROUP BY player
  `).all(competitionId) as Array<{ player: KaardimangPlayer; points: number; newlyLearned: number }>;
  return rankStandings(PLAYERS.map((player) => {
    const row = sums.find((item) => item.player === player);
    return { player, points: row?.points ?? 0, newlyLearned: row?.newlyLearned ?? 0, learnedTotal: learnedTotal(player) };
  }));
}

function toView(row: CompetitionRow): CompetitionView {
  const standings = row.status !== 'active' && row.resultsJson ? JSON.parse(row.resultsJson) as StandingRow[] : standingsFor(row.id);
  return {
    id: row.id,
    title: row.title,
    views: JSON.parse(row.viewsJson) as string[],
    startDate: row.startDate,
    endDate: row.endDate,
    rewards: JSON.parse(row.rewardsJson) as [number, number, number],
    status: row.status,
    standings
  };
}

/* --------------------------------------------------------------- ending */

// Ends a competition: freezes the table and gives places 1–3 their medal and,
// for a child, the stars set for that place. Stars follow the actual place, so
// a parent on the podium does not move a child up. Players tied on a place
// share it, and each gets that place's prize.
function settle(row: CompetitionRow, endedAt: string) {
  const standings = standingsFor(row.id);
  const rewards = JSON.parse(row.rewardsJson) as [number, number, number];
  db.prepare("UPDATE kaardimang_competitions SET status = 'ended', endedAt = ?, resultsJson = ? WHERE id = ? AND status = 'active'").run(endedAt, JSON.stringify(standings), row.id);
  for (const standing of standings) {
    if (standing.rank > 3 || standing.points <= 0) continue;
    const exists = db.prepare('SELECT 1 FROM kaardimang_awards WHERE competitionId = ? AND player = ?').get(row.id, standing.player);
    if (exists) continue;
    const stars = isChildPlayer(standing.player) ? rewards[standing.rank - 1] : 0;
    let ledgerEntryId: number | null = null;
    if (stars > 0) {
      ledgerEntryId = Number(db.prepare(`
        INSERT INTO point_ledger (learner, amount, source, sourceId, description, createdAt, metadataJson)
        VALUES (?, ?, 'kaardimang_prize', ?, ?, ?, ?)
      `).run(standing.player, stars, row.id, `Kaardimängu võistlus „${row.title}“: ${standing.rank}. koht`, endedAt,
        JSON.stringify({ competitionId: row.id, place: standing.rank, points: standing.points })).lastInsertRowid);
    }
    db.prepare(`
      INSERT INTO kaardimang_awards (competitionId, player, place, points, stars, ledgerEntryId, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(row.id, standing.player, standing.rank, standing.points, stars, ledgerEntryId, endedAt);
  }
}

// A competition whose last day has passed ends now.
export function settleEndedCompetitions(today = todayDateString()) {
  const due = db.prepare("SELECT * FROM kaardimang_competitions WHERE status = 'active' AND endDate < ?").all(today) as CompetitionRow[];
  if (!due.length) return;
  db.transaction(() => { for (const row of due) settle(row, nowIso()); }).immediate();
}

/* ---------------------------------------------------------------- reads */

export function activeCompetitionRow(today = todayDateString()): CompetitionRow | null {
  settleEndedCompetitions(today);
  return (db.prepare("SELECT * FROM kaardimang_competitions WHERE status = 'active'").get() as CompetitionRow | undefined) ?? null;
}

export function activeCompetition(today = todayDateString()): CompetitionView | null {
  const row = activeCompetitionRow(today);
  return row ? toView(row) : null;
}

// For the home page: the open competition, or the one that ended in the last week.
export function homeCompetition(today = todayDateString()): (CompetitionView & { justEnded: boolean }) | null {
  const active = activeCompetitionRow(today);
  if (active) return { ...toView(active), justEnded: false };
  const recent = db.prepare("SELECT * FROM kaardimang_competitions WHERE status = 'ended' AND endDate >= ? ORDER BY endDate DESC, id DESC LIMIT 1").get(addAppDays(today, -7)) as CompetitionRow | undefined;
  return recent ? { ...toView(recent), justEnded: true } : null;
}

export function competitionHistory(limit = 10): CompetitionView[] {
  settleEndedCompetitions();
  return (db.prepare('SELECT * FROM kaardimang_competitions ORDER BY id DESC LIMIT ?').all(limit) as CompetitionRow[]).map(toView);
}

export function countedRoundsToday(player: KaardimangPlayer, competitionId: number, today = todayDateString()): number {
  return (db.prepare('SELECT COUNT(*) AS count FROM kaardimang_rounds WHERE learner = ? AND competitionId = ? AND playDate = ?').get(player, competitionId, today) as { count: number }).count;
}

export type PlayerMedal = { competitionId: number; title: string; place: 1 | 2 | 3; stars: number; endDate: string };

export function medalsOf(player: KaardimangPlayer): PlayerMedal[] {
  settleEndedCompetitions();
  return db.prepare(`
    SELECT a.competitionId, c.title, a.place, a.stars, c.endDate
    FROM kaardimang_awards a JOIN kaardimang_competitions c ON c.id = a.competitionId
    WHERE a.player = ? ORDER BY c.endDate DESC, a.competitionId DESC
  `).all(player) as PlayerMedal[];
}

/* -------------------------------------------------------- parent writes */

function cleanViews(value: unknown): string[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 40) throw new CompetitionError('Vali vähemalt üks kaart.');
  const views = [...new Set(value)];
  if (!views.every((id) => typeof id === 'string' && findView(id))) throw new CompetitionError('Sellist kaarti ei ole.');
  return views as string[];
}

function cleanDays(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > MAX_COMPETITION_DAYS) throw new CompetitionError(`Päevi peab olema 1–${MAX_COMPETITION_DAYS}.`);
  return value;
}

function cleanRewards(value: unknown): [number, number, number] {
  if (value === undefined || value === null) return DEFAULT_REWARDS;
  if (!Array.isArray(value) || value.length !== 3 || !value.every((stars) => typeof stars === 'number' && Number.isInteger(stars) && stars >= 0 && stars <= 200)) {
    throw new CompetitionError('Auhinnad peavad olema 0–200 tähte.');
  }
  return value as [number, number, number];
}

export function createCompetition(input: { title: unknown; views: unknown; days: unknown; rewards?: unknown }, today = todayDateString()): CompetitionView {
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  if (!TITLE_PATTERN.test(title)) throw new CompetitionError('Anna võistlusele nimi (kuni 60 märki).');
  const views = cleanViews(input.views);
  const days = cleanDays(input.days);
  const rewards = cleanRewards(input.rewards);
  return db.transaction(() => {
    if (activeCompetitionRow(today)) throw new CompetitionError('Üks võistlus juba käib. Lõpeta see enne uue alustamist.');
    const id = Number(db.prepare(`
      INSERT INTO kaardimang_competitions (title, viewsJson, startDate, endDate, rewardsJson, status, createdAt)
      VALUES (?, ?, ?, ?, ?, 'active', ?)
    `).run(title, JSON.stringify(views), today, addAppDays(today, days - 1), JSON.stringify(rewards), nowIso()).lastInsertRowid);
    return toView(db.prepare('SELECT * FROM kaardimang_competitions WHERE id = ?').get(id) as CompetitionRow);
  }).immediate();
}

function loadActive(id: unknown): CompetitionRow {
  const row = typeof id === 'number' ? db.prepare("SELECT * FROM kaardimang_competitions WHERE id = ? AND status = 'active'").get(id) as CompetitionRow | undefined : undefined;
  if (!row) throw new CompetitionError('Seda võistlust ei käi.');
  return row;
}

export function endCompetitionNow(id: unknown): CompetitionView {
  return db.transaction(() => {
    const row = loadActive(id);
    settle(row, nowIso());
    return toView(db.prepare('SELECT * FROM kaardimang_competitions WHERE id = ?').get(row.id) as CompetitionRow);
  }).immediate();
}

// Cancel (Kaur, 23.10): the competition stops now, its table is kept and
// shown as cancelled, and nobody gets a medal or stars.
export function cancelCompetition(id: unknown): CompetitionView {
  return db.transaction(() => {
    const row = loadActive(id);
    db.prepare("UPDATE kaardimang_competitions SET status = 'cancelled', endedAt = ?, resultsJson = ? WHERE id = ? AND status = 'active'")
      .run(nowIso(), JSON.stringify(standingsFor(row.id)), row.id);
    return toView(db.prepare('SELECT * FROM kaardimang_competitions WHERE id = ?').get(row.id) as CompetitionRow);
  }).immediate();
}

// Delete fully: as if the competition never happened. Its points go, its
// rounds stay as ordinary practice, and what the players learned stays learned.
// A competition that paid prizes cannot be deleted: its stars are spent money.
export function deleteCompetition(id: unknown): void {
  db.transaction(() => {
    const row = typeof id === 'number' ? db.prepare('SELECT * FROM kaardimang_competitions WHERE id = ?').get(id) as CompetitionRow | undefined : undefined;
    if (!row) throw new CompetitionError('Seda võistlust ei ole.');
    if (row.status === 'ended') throw new CompetitionError('Lõppenud võistlust ei saa kustutada: auhinnad on juba jagatud.');
    db.prepare('DELETE FROM kaardimang_points WHERE competitionId = ?').run(row.id);
    db.prepare('UPDATE kaardimang_rounds SET competitionId = NULL WHERE competitionId = ?').run(row.id);
    db.prepare('DELETE FROM kaardimang_competitions WHERE id = ?').run(row.id);
  }).immediate();
}

export function extendCompetition(id: unknown, days: unknown, today = todayDateString()): CompetitionView {
  const extra = cleanDays(days);
  return db.transaction(() => {
    const row = loadActive(id);
    const endDate = addAppDays(row.endDate < today ? today : row.endDate, extra);
    db.prepare('UPDATE kaardimang_competitions SET endDate = ? WHERE id = ?').run(endDate, row.id);
    return toView(db.prepare('SELECT * FROM kaardimang_competitions WHERE id = ?').get(row.id) as CompetitionRow);
  }).immediate();
}

export { COUNTED_ROUNDS_PER_DAY, PLAYER_NAMES };
