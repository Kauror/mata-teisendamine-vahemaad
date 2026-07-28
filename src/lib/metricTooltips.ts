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

// On the identity card the badge shows a shortened title and a bare "1/7", and
// the padlock is gone — grey is what now means locked. None of that survives
// being read aloud, so the accessible name carries the full title, the
// progress and the lock state itself, ahead of the live count.
export function achievementLabel(achievement: {
  kind: 'exercise_milestone' | 'daily' | 'weekly';
  title: string;
  unlocked: boolean;
  current: number;
  target: number;
  tooltipCount: number;
}) {
  const state = achievement.unlocked ? 'tehtud' : 'veel lukus';
  return `${achievement.title}, ${achievement.current}/${achievement.target}, ${state}. ${achievementTooltip(achievement.kind, achievement.tooltipCount)}`;
}
