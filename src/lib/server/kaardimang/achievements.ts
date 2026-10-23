import db from '@/lib/db';
import { addAppDays, isoToAppDate, todayDateString } from '@/lib/appDate';
import { CATALOG } from '@/content/kaardimang/catalog';
import { CONTINENTS, COUNTIES, OCEANS, SEAS } from '@/content/kaardimang/regions';
import type { KaardimangPlayer } from '@/lib/kaardimang/competition';

// Kaardimäng achievements (backlog KM-03): a shelf per player, derived from
// the game's own tables on every read, like the app's other achievements
// (lib/achievements.ts) — nothing is stored, so they can never drift.
// "Learned" is the competition's rule: right on the first try on two
// different days (kaardimang_target_stats.learnedAt).

export type KaardimangAchievement = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  current: number;
  target: number;
  unlocked: boolean;
};

const CAPITAL_TIERS = [10, 25, 50, 100];
const ROUND_TIERS = [10, 25, 50, 100];
const STREAK_TIERS = [3, 7, 14];

// The highest reached tier, or the next one to reach.
function tiered(value: number, tiers: number[]) {
  const reached = tiers.filter((tier) => value >= tier).at(-1);
  const next = tiers.find((tier) => tier > value);
  return { target: reached ?? next ?? tiers.at(-1)!, unlocked: reached !== undefined };
}

// Longest run of consecutive app days, counting a run that ends yesterday or today.
export function longestDayRun(days: string[]): number {
  const sorted = [...new Set(days)].sort();
  let best = 0;
  let run = 0;
  let previous: string | null = null;
  for (const day of sorted) {
    run = previous && addAppDays(previous, 1) === day ? run + 1 : 1;
    best = Math.max(best, run);
    previous = day;
  }
  return best;
}

export function kaardimangAchievements(player: KaardimangPlayer, today = todayDateString()): KaardimangAchievement[] {
  const learned = new Set((db.prepare('SELECT targetKey FROM kaardimang_target_stats WHERE learner = ? AND learnedAt IS NOT NULL').all(player) as Array<{ targetKey: string }>).map((row) => row.targetKey));
  const count = (keys: string[]) => keys.filter((key) => learned.has(key)).length;
  const europe = CATALOG.countries.filter((country) => country.target && country.worldPart === 'europe');
  const capitals = [...learned].filter((key) => key.startsWith('capital:') || key.startsWith('countyCentre:')).length;
  const completed = db.prepare("SELECT completedAt FROM kaardimang_rounds WHERE learner = ? AND status = 'completed' AND completedAt IS NOT NULL").all(player) as Array<{ completedAt: string }>;
  const playDays = completed.map((row) => isoToAppDate(row.completedAt)).filter((day): day is string => Boolean(day) && day! <= today);
  const medals = db.prepare('SELECT place FROM kaardimang_awards WHERE player = ?').all(player) as Array<{ place: number }>;

  const whole = (id: string, emoji: string, title: string, description: string, keys: string[]): KaardimangAchievement => {
    const current = count(keys);
    return { id, emoji, title, description, current, target: keys.length, unlocked: current === keys.length };
  };
  const capitalTier = tiered(capitals, CAPITAL_TIERS);
  const roundTier = tiered(completed.length, ROUND_TIERS);
  const streak = longestDayRun(playDays);
  const streakTier = tiered(streak, STREAK_TIERS);
  const podium = medals.length;
  const wins = medals.filter((medal) => medal.place === 1).length;

  return [
    whole('eesti-maakonnad', '🦔', 'Eesti maakonnad', 'Õpi selgeks kõik 15 maakonda', COUNTIES.map((county) => `county:${county.id}`)),
    whole('eesti-keskused', '🏘️', 'Maakonnakeskused', 'Õpi selgeks kõigi maakondade keskused', COUNTIES.map((county) => `countyCentre:${county.id}`)),
    whole('mandrid', '🌍', 'Mandrid', 'Õpi selgeks kõik 6 mandrit', CONTINENTS.map((continent) => `continent:${continent.id}`)),
    whole('ookeanid', '🌊', 'Ookeanid', 'Õpi selgeks kõik 5 ookeani', OCEANS.map((ocean) => `ocean:${ocean.id}`)),
    whole('mered', '⛵', 'Mered', `Õpi selgeks kõik ${SEAS.length} merd ja lahte`, SEAS.map((sea) => `sea:${sea.id}`)),
    whole('euroopa', '🏰', 'Euroopa riigid', `Õpi selgeks kõik ${europe.length} Euroopa riiki`, europe.map((country) => `country:${country.id}`)),
    {
      id: `pealinnad-${capitalTier.target}`, emoji: '🏛️', title: `${capitalTier.target} pealinna`,
      description: `Õpi selgeks ${capitalTier.target} pealinna või maakonnakeskust`, current: Math.min(capitals, capitalTier.target), target: capitalTier.target, unlocked: capitalTier.unlocked
    },
    {
      id: `voorud-${roundTier.target}`, emoji: '🗺️', title: `${roundTier.target} vooru`,
      description: `Mängi läbi ${roundTier.target} vooru`, current: Math.min(completed.length, roundTier.target), target: roundTier.target, unlocked: roundTier.unlocked
    },
    {
      id: `jarjest-${streakTier.target}`, emoji: '🔥', title: `${streakTier.target} päeva järjest`,
      description: `Mängi ${streakTier.target} päeva järjest`, current: Math.min(streak, streakTier.target), target: streakTier.target, unlocked: streakTier.unlocked
    },
    { id: 'esikolmik', emoji: '🥉', title: 'Esikolmikus', description: 'Jõua võistlusel esikolmikusse', current: Math.min(podium, 1), target: 1, unlocked: podium > 0 },
    { id: 'voitja', emoji: '🏆', title: 'Võitja', description: 'Võida üks võistlus', current: Math.min(wins, 1), target: 1, unlocked: wins > 0 }
  ];
}

