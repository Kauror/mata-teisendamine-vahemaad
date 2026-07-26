import { formatStars } from '@/lib/formatStars';
import { dayWord, exerciseWord, starWord, trophyWord } from '@/lib/history';

export function starsTooltip(value: number) {
  const stars = formatStars(value);
  return `Sul on ${stars} ${starWord(stars)}.`;
}

export function streakTooltip(value: number) {
  return `Oled ${value} ${dayWord(value)} järjest harjutanud.`;
}

export function trophiesTooltip(value: number) {
  return `Sul on ${value} ${trophyWord(value)} sellel kuul.`;
}

export function achievementTooltip(kind: 'exercise_milestone' | 'daily' | 'weekly', value: number) {
  if (kind === 'exercise_milestone') return `Sul on seni tehtud ${value} ${exerciseWord(value)}.`;
  if (kind === 'daily') return `Täna oled teinud ${value} ${exerciseWord(value)}.`;
  return `Sellel nädalal oled teinud ${value} ${exerciseWord(value)}.`;
}
