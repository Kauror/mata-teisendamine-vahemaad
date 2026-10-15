import type { GeneratedQuestion } from '@/lib/types';
import { seededRng, shuffleWithRng } from '@/lib/random';

// EX-04: most maths generators put the right option first (93–95 % of Kiur's
// choice questions). The runner therefore shows the options in a per-question
// order derived from the session seed and the question id, and stores that order
// in the runner session (optionOrder) so a resumed run shows the same buttons.
//
// This is display only. The runner submits the chosen option's LABEL, and both
// the client (mathResults) and the server (scoreVerifier) score by label against
// choiceOptions[correctAnswer] of the generated question, which is untouched.
// That is why it needs no generator version: the server never sees the order.

// question id -> permutation of choiceOptions indexes, in display order.
export type MathOptionOrder = Record<string, number[]>;

// Option lists whose order carries meaning and stays as generated: labels that
// name points or segments of a figure, and fixed scales a child reads in order.
// Yes/no pairs keep their conventional order too; the generators already pick
// either answer about equally often.
const FIXED_ORDER_SETS: ReadonlyArray<readonly string[]> = [
  ['Õige', 'Vale'],
  ['Jah', 'Ei'],
  ['Ring', 'Ringjoon'],
  ['ringi sees', 'ringjoone peal', 'ringist väljas'],
  ['suureneb', 'väheneb', 'kordub kujunditena', 'ei ole muster']
];
const LABEL_OPTION = /^(?:[A-ZÕÄÖÜ]|võrdsed|sama suured)$/u;

export function shouldShuffleMathOptions(question: GeneratedQuestion): boolean {
  const options = question.choiceOptions;
  if (question.kind !== 'choice' || !options || options.length < 2) return false;
  // Kirsi's counting and clock generators already shuffle their options.
  if (question.type === 'counting' || question.type === 'clock') return false;
  if (options.every((option) => LABEL_OPTION.test(option))) return false;
  return !FIXED_ORDER_SETS.some((set) => set.length === options.length && set.every((option, index) => options[index] === option));
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) hash = (Math.imul(hash, 31) + value.charCodeAt(index)) >>> 0;
  return hash || 1;
}

function identity(length: number) {
  return Array.from({ length }, (_, index) => index);
}

export function mathOptionDisplayOrder(question: GeneratedQuestion, seed: number | string): number[] {
  const length = question.choiceOptions?.length ?? 0;
  if (!shouldShuffleMathOptions(question)) return identity(length);
  return shuffleWithRng(seededRng(hashString(`${seed}:${question.id}:options`)), identity(length));
}

export function buildMathOptionOrder(questions: readonly GeneratedQuestion[], seed: number | string): MathOptionOrder {
  const order: MathOptionOrder = {};
  for (const question of questions) {
    if (question.kind === 'choice' && question.choiceOptions?.length) order[question.id] = mathOptionDisplayOrder(question, seed);
  }
  return order;
}

function isPermutation(value: unknown, length: number): value is number[] {
  return Array.isArray(value) &&
    value.length === length &&
    new Set(value).size === length &&
    value.every((index) => Number.isInteger(index) && index >= 0 && index < length);
}

// The options as the child sees them. A session without a stored order (one
// created before EX-04, or a damaged record) keeps the generated order, so a
// paused run resumes exactly as it looked when it was paused.
export function displayedMathOptions(question: GeneratedQuestion, order: unknown): string[] {
  const options = question.choiceOptions ?? [];
  const stored = order && typeof order === 'object' ? (order as Record<string, unknown>)[question.id] : undefined;
  return isPermutation(stored, options.length) ? stored.map((index) => options[index]) : [...options];
}
