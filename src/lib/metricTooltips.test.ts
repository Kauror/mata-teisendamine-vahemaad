import { describe, expect, it } from 'vitest';
import { achievementTooltip, starsTooltip, streakTooltip, trophiesTooltip } from '@/lib/metricTooltips';

describe('metric tooltips', () => {
  it('uses the approved points and progress wording', () => {
    expect(starsTooltip(8.6)).toBe('Sul on 8,6 tähte.');
    expect(streakTooltip(10)).toBe('Oled 10 päeva järjest harjutanud.');
    expect(trophiesTooltip(9)).toBe('Sul on 9 karikat sellel kuul.');
    expect(achievementTooltip('exercise_milestone', 117)).toBe('Sul on seni tehtud 117 harjutust.');
    expect(achievementTooltip('daily', 3)).toBe('Täna oled teinud 3 harjutust.');
    expect(achievementTooltip('weekly', 12)).toBe('Sellel nädalal oled teinud 12 harjutust.');
  });
});
