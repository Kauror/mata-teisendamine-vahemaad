// Versions of the maths question generators (Kiur maths, Kiur lengths, Kirsi
// maths), all served by the one 'math' runner on /test.
//
// The generators are a replay contract. A session is generated on the device
// from its seed, the device stamps the attempt with the generator version it
// used, and the server re-generates the session from the same seed AND that
// version to recompute the score (scoreVerifier.verifyMath). A phone can hold an
// unsynced attempt or a paused session for days, and a paused session keeps
// finalising with the version it was created with. So:
//
// - Any change that alters what a seed generates adds a NEW version here and
//   keeps every older branch in the generators reachable by its version string.
// - MATH_GENERATOR_VERSION is what new sessions use; capabilities.json's 'math'
//   runner must name the same string (capabilities.test.ts guards this).
// - An old version may only be removed once no device can still hold an attempt
//   or a paused session made with it (well past CATALOGUE_VALID_DAYS).
//
// V1 is the string every maths attempt carried before versions were split per
// runner; it is deliberately equal to the global GENERATOR_VERSION of that time.
export const MATH_GENERATOR_VERSION_V1 = '2026-07-1';
// EX-05/EX-06: unambiguous place-value questions, no repeated fixed questions
// in a mixed session, «Võrdle raadiuseid» with both outcomes, deduplicated
// Kirsi clock bank.
export const MATH_GENERATOR_VERSION_V2 = 'math-2026-10';

export const MATH_GENERATOR_VERSIONS = [MATH_GENERATOR_VERSION_V1, MATH_GENERATOR_VERSION_V2] as const;
export type MathGeneratorVersion = (typeof MATH_GENERATOR_VERSIONS)[number];

export const MATH_GENERATOR_VERSION: MathGeneratorVersion = MATH_GENERATOR_VERSION_V2;

export function isSupportedMathGeneratorVersion(value: unknown): value is MathGeneratorVersion {
  return typeof value === 'string' && (MATH_GENERATOR_VERSIONS as readonly string[]).includes(value);
}
