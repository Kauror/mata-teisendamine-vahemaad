// The test pass rule, in integer arithmetic only. 0.95 * 20 in floating point
// is 18.999999999999996, so a pass/fail decision must never go through a
// percentage: requiredCorrect = ceil(total · numerator / denominator), computed
// as floor((total · numerator + denominator − 1) / denominator).

import type { CourseSettings } from '@/lib/textbook/types';

type PassRule = Pick<CourseSettings, 'passNumerator' | 'passDenominator'>;

function assertRule(rule: PassRule) {
  const { passNumerator: num, passDenominator: den } = rule;
  if (!Number.isInteger(num) || !Number.isInteger(den) || den <= 0 || num <= 0 || num > den) {
    throw new Error(`Invalid pass rule ${num}/${den}.`);
  }
}

// Smallest score that passes. 20 questions at 95/100 → 19; 18 → 18; 10 → 10.
export function requiredCorrect(total: number, rule: PassRule): number {
  assertRule(rule);
  if (!Number.isInteger(total) || total <= 0) return 0;
  return Math.floor((total * rule.passNumerator + rule.passDenominator - 1) / rule.passDenominator);
}

export function passes(correct: number, total: number, rule: PassRule): boolean {
  if (!Number.isInteger(correct) || !Number.isInteger(total) || total <= 0) return false;
  if (correct < 0 || correct > total) return false;
  return correct >= requiredCorrect(total, rule);
}

// For display only, rounded DOWN so a failing score never shows as "95 %".
export function displayPercent(correct: number, total: number): number {
  if (!Number.isInteger(correct) || !Number.isInteger(total) || total <= 0) return 0;
  return Math.floor((correct * 100) / total);
}

// A deterministic 32-bit seed from a string (FNV-1a), e.g. from a session id,
// for the seeded RNG in lib/random.ts.
export function seedFromString(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// A stable JSON form (sorted object keys) for content hashing.
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, item]) => item !== undefined)
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0));
  return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`).join(',')}}`;
}

// A short fingerprint of any content value (hex). Lets the server notice that
// a unit's content changed without its contentVersion being bumped.
export function contentHash(value: unknown): string {
  return seedFromString(stableStringify(value)).toString(16).padStart(8, '0');
}
