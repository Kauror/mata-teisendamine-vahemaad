// The test passes when ONE complete round reaches 95%. Integer arithmetic only:
// 0.95 * n in floating point is not exact (0.95 * 20 = 18.999999999999996),
// and a pass/fail decision must never depend on rounding.
export const PASS_PERCENT = 95;

export function passesThreshold(correct: number, total: number): boolean {
  if (!Number.isInteger(correct) || !Number.isInteger(total) || total <= 0) return false;
  if (correct < 0 || correct > total) return false;
  return correct * 100 >= total * PASS_PERCENT;
}

// Smallest score that passes: ceil(total * 95 / 100). For 20 words that is 19,
// for 18 words it is 18 (17/18 = 94.4%).
export function requiredCorrect(total: number): number {
  if (!Number.isInteger(total) || total <= 0) return 0;
  return Math.floor((total * PASS_PERCENT + 99) / 100);
}

// What the child and the parent are shown. Rounded down so a failing round can
// never be displayed as "95%".
export function displayPercent(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.floor((correct * 100) / total);
}
