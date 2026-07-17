import { formatStars } from '@/lib/formatStars';

export function starsTooltip(value: number) {
  return `Sul on ${formatStars(value)} tähte.`;
}

export function streakTooltip(value: number) {
  return `Oled ${value} päeva järjest harjutanud.`;
}

export function trophiesTooltip(value: number) {
  return `Sul on ${value} karikat sellel kuul.`;
}

export function achievementTooltip(kind: 'exercise_milestone' | 'daily' | 'weekly', value: number) {
  if (kind === 'exercise_milestone') return `Sul on seni tehtud ${value} harjutust.`;
  if (kind === 'daily') return `Täna oled teinud ${value} harjutust.`;
  return `Sellel nädalal oled teinud ${value} harjutust.`;
}
