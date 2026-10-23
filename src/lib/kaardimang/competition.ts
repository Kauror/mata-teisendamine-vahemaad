// Kaardimäng family competition (backlog KM-02, Kaur's decisions of 19.10):
// the players, their levels, how one answer scores, and how the table ranks.
// Pure: the server applies it (lib/server/kaardimang/competition.ts), the UI
// only shows the results.

import type { LevelId } from '@/content/kaardimang/regions';

export type KaardimangPlayer = 'kiur' | 'kirsi' | 'kairi' | 'kaur';
export const PLAYERS: KaardimangPlayer[] = ['kiur', 'kirsi', 'kairi', 'kaur'];
export const CHILD_PLAYERS: KaardimangPlayer[] = ['kiur', 'kirsi'];
export const PARENT_PLAYERS: KaardimangPlayer[] = ['kairi', 'kaur'];
export const PLAYER_NAMES: Record<KaardimangPlayer, string> = { kiur: 'Kiur', kirsi: 'Kirsi', kairi: 'Kairi', kaur: 'Kaur' };

export function isPlayer(value: unknown): value is KaardimangPlayer {
  return typeof value === 'string' && (PLAYERS as string[]).includes(value);
}
export function isChildPlayer(player: KaardimangPlayer) {
  return CHILD_PLAYERS.includes(player);
}

// Each player's own level until the parent changes it: easier for Kirsi, harder for the others.
export const DEFAULT_LEVELS: Record<KaardimangPlayer, LevelId> = { kiur: 'traveler', kirsi: 'explorer', kairi: 'geographer', kaur: 'geographer' };

// Only the first rounds of an app day count for points; later ones are practice.
// Every started counted round uses one, so restarting for easier questions does not help.
export const COUNTED_ROUNDS_PER_DAY = 3;

// A right answer on the first try scores by how well the player knew the place:
// a new place 3, one met before but not yet learned 2, a learned one 1.
// After the hint 1; once the answer is shown 0. No minus points.
export const MASTERY_POINTS = { new: 3, learning: 2, learned: 1 } as const;
export const AFTER_HINT_POINTS = 1;
export type Mastery = keyof typeof MASTERY_POINTS;

// +1 for a first-try answer faster than this, per level.
export const SPEED_LIMIT_SECONDS: Record<LevelId, number> = { explorer: 20, traveler: 10, geographer: 5 };

// Stars for the children on places 1–3, unless the parent sets others. Parents get a medal only.
export const DEFAULT_REWARDS: [number, number, number] = [20, 10, 5];
export const MEDALS = ['🥇', '🥈', '🥉'] as const;

export function masteryOf(stat: { seen: number; learnedAt: string | null } | undefined): Mastery {
  if (!stat || stat.seen === 0) return 'new';
  return stat.learnedAt ? 'learned' : 'learning';
}

export type QuestionScore = { points: number; speedBonus: number };

export function scoreAnswer(input: { resolved: 'correct' | 'revealed'; firstTry: boolean; mastery: Mastery; level: LevelId; elapsedMs: number | null }): QuestionScore {
  if (input.resolved === 'revealed') return { points: 0, speedBonus: 0 };
  if (!input.firstTry) return { points: AFTER_HINT_POINTS, speedBonus: 0 };
  const fast = input.elapsedMs !== null && input.elapsedMs >= 0 && input.elapsedMs <= SPEED_LIMIT_SECONDS[input.level] * 1000;
  return { points: MASTERY_POINTS[input.mastery], speedBonus: fast ? 1 : 0 };
}

export type StandingRow = { player: KaardimangPlayer; points: number; newlyLearned: number; learnedTotal: number; rank: number };

// Points first; a tie goes to whoever learned more new places during the
// competition. Players still tied share the rank.
export function rankStandings(rows: Array<Omit<StandingRow, 'rank'>>): StandingRow[] {
  const sorted = [...rows].sort((left, right) => right.points - left.points || right.newlyLearned - left.newlyLearned || PLAYERS.indexOf(left.player) - PLAYERS.indexOf(right.player));
  return sorted.map((row, index) => {
    const tiedWith = sorted.findIndex((other) => other.points === row.points && other.newlyLearned === row.newlyLearned);
    return { ...row, rank: (tiedWith === -1 ? index : tiedWith) + 1 };
  });
}

// "3 päeva" / "1 päev" / "täna viimane päev".
export function daysLeftEt(today: string, endDate: string): string {
  const days = Math.round((Date.parse(`${endDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
  if (days <= 0) return 'täna viimane päev';
  return days === 1 ? 'veel 1 päev' : `veel ${days} päeva`;
}
