import { describe, expect, it } from 'vitest';
import { achievementLabel, achievementTooltip, starsTooltip, streakTooltip, trophiesTooltip } from '@/lib/metricTooltips';

describe('metric tooltips', () => {
  it('uses the approved points and progress wording', () => {
    expect(starsTooltip(8.6)).toBe('Sul on 8,6 tähte.');
    expect(streakTooltip(10)).toBe('Oled 10 päeva järjest harjutanud.');
    expect(trophiesTooltip(9)).toBe('Sul on 9 karikat sellel kuul.');
    expect(achievementTooltip('exercise_milestone', 117)).toBe('Sul on seni tehtud 117 harjutust.');
    expect(achievementTooltip('daily', 3)).toBe('Täna oled teinud 3 harjutust.');
    expect(achievementTooltip('weekly', 12)).toBe('Sellel nädalal oled teinud 12 harjutust.');
  });

  // The bug this guards: every one of these read "1 tähte", "1 päeva",
  // "1 karikat", "1 harjutust" before the counted nouns were made to agree.
  it('uses the singular after exactly one', () => {
    expect(starsTooltip(1)).toBe('Sul on 1 täht.');
    expect(streakTooltip(1)).toBe('Oled 1 päev järjest harjutanud.');
    expect(trophiesTooltip(1)).toBe('Sul on 1 karikas sellel kuul.');
    expect(achievementTooltip('exercise_milestone', 1)).toBe('Sul on seni tehtud 1 harjutus.');
    expect(achievementTooltip('daily', 1)).toBe('Täna oled teinud 1 harjutus.');
    expect(achievementTooltip('weekly', 1)).toBe('Sellel nädalal oled teinud 1 harjutus.');
  });

  it('keeps the partitive for zero and for a fractional one', () => {
    expect(starsTooltip(0)).toBe('Sul on 0 tähte.');
    expect(streakTooltip(0)).toBe('Oled 0 päeva järjest harjutanud.');
    expect(trophiesTooltip(0)).toBe('Sul on 0 karikat sellel kuul.');
    // Rounds to "1,5", so it stays partitive; 1.04 prints "1" and must not.
    expect(starsTooltip(1.5)).toBe('Sul on 1,5 tähte.');
    expect(starsTooltip(1.04)).toBe('Sul on 1 täht.');
  });

  // The identity card shortens "Täiuslik nädal" to "Nädal" and drops the 🔒,
  // so a screen reader has to hear the full title and the lock state instead.
  describe('achievementLabel', () => {
    it('names the achievement, its progress and its lock state before the count', () => {
      expect(achievementLabel({
        kind: 'weekly', title: 'Täiuslik nädal', unlocked: false, current: 1, target: 7, tooltipCount: 3
      })).toBe('Täiuslik nädal, 1/7, veel lukus. Sellel nädalal oled teinud 3 harjutust.');
    });

    it('says tehtud once the achievement is unlocked', () => {
      expect(achievementLabel({
        kind: 'exercise_milestone', title: '50 harjutust', unlocked: true, current: 50, target: 50, tooltipCount: 63
      })).toBe('50 harjutust, 50/50, tehtud. Sul on seni tehtud 63 harjutust.');
    });

    it('keeps the singular agreement of the count it wraps', () => {
      expect(achievementLabel({
        kind: 'daily', title: 'Täna', unlocked: false, current: 0, target: 4, tooltipCount: 1
      })).toBe('Täna, 0/4, veel lukus. Täna oled teinud 1 harjutus.');
    });
  });
});
