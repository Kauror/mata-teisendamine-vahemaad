import type { QuestionVisual } from '@/lib/types';

// Lettered figures of «Ring ja ringjoon». The drawing has three fixed places and
// question.visualLabels says which letter stands at each, in this order:
//
// - radius-demo:    [the radius (green), short line from O (red), chord (orange)]
// - diameter-demo:  [the diameter (green), short line from O (red), chord (orange)]
// - point-position: [point inside the circle, point on it, point outside it]
//
// The defaults are the lettering the figures always had (and every v1/v2
// question still shows), so «Leia raadius» was always A and «Leia läbimõõt»
// always B. From maths generator v3 the generator letters each question.
export type LetteredVisual = 'radius-demo' | 'diameter-demo' | 'point-position';

export const VISUAL_LABEL_DEFAULTS: Record<LetteredVisual, string> = {
  'radius-demo': 'ABC',
  'diameter-demo': 'BAC',
  'point-position': 'ABC'
};

export const FIGURE_LETTERS = ['A', 'B', 'C'] as const;

export function isLetteredVisual(visual: QuestionVisual | string | undefined): visual is LetteredVisual {
  return visual === 'radius-demo' || visual === 'diameter-demo' || visual === 'point-position';
}

// A permutation of A, B and C, or undefined. Saved questions come back from
// storage, so anything else falls back to the figure's default lettering.
export function isFigureLabelling(value: unknown): value is string {
  return typeof value === 'string' && value.length === 3 && [...value].sort().join('') === 'ABC';
}

export function figureLabels(visual: LetteredVisual, labels: unknown): string {
  return isFigureLabelling(labels) ? labels : VISUAL_LABEL_DEFAULTS[visual];
}
