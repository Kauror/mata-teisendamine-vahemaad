import { describe, expect, it } from 'vitest';
import {
  RARE_CELEBRATIONS,
  RARE_CELEBRATION_CHANCE,
  pickCelebration,
  rareCelebrationChanceTotal
} from '@/lib/celebration';

describe('pickCelebration', () => {
  it('gives every rare celebration its own slice', () => {
    RARE_CELEBRATIONS.forEach((name, index) => {
      // Middle of this celebration's band.
      const roll = RARE_CELEBRATION_CHANCE * index + RARE_CELEBRATION_CHANCE / 2;
      expect(pickCelebration(roll)).toBe(name);
    });
  });

  it('keeps confetti as the default for everything above the rare band', () => {
    expect(pickCelebration(rareCelebrationChanceTotal())).toBe('konfeti');
    expect(pickCelebration(0.5)).toBe('konfeti');
    expect(pickCelebration(0.999999)).toBe('konfeti');
  });

  it('lands on the first rare one at the very bottom of the range', () => {
    expect(pickCelebration(0)).toBe(RARE_CELEBRATIONS[0]);
  });

  it('never falls off the end of the list on a boundary roll', () => {
    const last = rareCelebrationChanceTotal() - Number.EPSILON;
    expect(RARE_CELEBRATIONS).toContain(pickCelebration(last));
  });

  it('treats a broken roll as confetti-safe rather than crashing', () => {
    expect(pickCelebration(Number.NaN)).toBe(RARE_CELEBRATIONS[0]);
    expect(pickCelebration(-1)).toBe(RARE_CELEBRATIONS[0]);
    expect(pickCelebration(12)).toBe('konfeti');
  });

  it('leaves roughly three quarters of celebrations as confetti', () => {
    let confetti = 0;
    const draws = 20000;
    for (let i = 0; i < draws; i += 1) if (pickCelebration(i / draws) === 'konfeti') confetti += 1;
    const share = confetti / draws;
    expect(share).toBeGreaterThan(0.74);
    expect(share).toBeLessThan(0.78);
  });
});
