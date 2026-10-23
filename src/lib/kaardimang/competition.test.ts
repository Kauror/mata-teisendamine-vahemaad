import { describe, expect, it } from 'vitest';
import { daysLeftEt, masteryOf, rankStandings, scoreAnswer } from '@/lib/kaardimang/competition';

describe('Kaardimäng competition scoring', () => {
  it('scores a first-try answer by how well the place was known', () => {
    const fast = { resolved: 'correct' as const, firstTry: true, level: 'traveler' as const, elapsedMs: 30_000 };
    expect(scoreAnswer({ ...fast, mastery: 'new' })).toEqual({ points: 3, speedBonus: 0 });
    expect(scoreAnswer({ ...fast, mastery: 'learning' })).toEqual({ points: 2, speedBonus: 0 });
    expect(scoreAnswer({ ...fast, mastery: 'learned' })).toEqual({ points: 1, speedBonus: 0 });
  });

  it('gives 1 point after the hint, nothing once the answer is shown, never minus', () => {
    expect(scoreAnswer({ resolved: 'correct', firstTry: false, mastery: 'new', level: 'explorer', elapsedMs: 1000 })).toEqual({ points: 1, speedBonus: 0 });
    expect(scoreAnswer({ resolved: 'revealed', firstTry: false, mastery: 'new', level: 'explorer', elapsedMs: 1000 })).toEqual({ points: 0, speedBonus: 0 });
  });

  it('adds a speed point under the level\'s limit: Avastaja 20 s, Rändur 10 s, Geograaf 5 s', () => {
    const at = (level: 'explorer' | 'traveler' | 'geographer', seconds: number) => scoreAnswer({ resolved: 'correct', firstTry: true, mastery: 'new', level, elapsedMs: seconds * 1000 }).speedBonus;
    expect([at('explorer', 20), at('explorer', 21)]).toEqual([1, 0]);
    expect([at('traveler', 10), at('traveler', 11)]).toEqual([1, 0]);
    expect([at('geographer', 5), at('geographer', 6)]).toEqual([1, 0]);
    expect(scoreAnswer({ resolved: 'correct', firstTry: true, mastery: 'new', level: 'explorer', elapsedMs: null }).speedBonus).toBe(0);
  });

  it('knows a place as new, learning or learned', () => {
    expect(masteryOf(undefined)).toBe('new');
    expect(masteryOf({ seen: 2, learnedAt: null })).toBe('learning');
    expect(masteryOf({ seen: 4, learnedAt: '2026-10-20T10:00:00Z' })).toBe('learned');
  });

  it('ranks by points, breaks a tie by new places learned, and shares a full tie', () => {
    const ranked = rankStandings([
      { player: 'kaur', points: 40, newlyLearned: 2, learnedTotal: 50 },
      { player: 'kirsi', points: 40, newlyLearned: 6, learnedTotal: 6 },
      { player: 'kiur', points: 55, newlyLearned: 4, learnedTotal: 20 },
      { player: 'kairi', points: 40, newlyLearned: 2, learnedTotal: 30 }
    ]);
    expect(ranked.map((row) => [row.player, row.rank])).toEqual([['kiur', 1], ['kirsi', 2], ['kairi', 3], ['kaur', 3]]);
  });

  it('says how many days are left', () => {
    expect(daysLeftEt('2026-10-23', '2026-10-30')).toBe('veel 7 päeva');
    expect(daysLeftEt('2026-10-29', '2026-10-30')).toBe('veel 1 päev');
    expect(daysLeftEt('2026-10-30', '2026-10-30')).toBe('täna viimane päev');
  });
});
