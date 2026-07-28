// Which celebration plays when a child earns one.
//
// The confetti cannon stays the default and is untouched — it is what the
// children already know. The rare ones exist to be found: they show up often
// enough to be talked about, rarely enough that nobody expects them.

export const RARE_CELEBRATIONS = [
  'ilutulestik',
  'meteoorisadu',
  'loomaparaad',
  'tahevihm',
  'seebimullid',
  'vikerkaar'
] as const;

export type RareCelebration = typeof RARE_CELEBRATIONS[number];
export type Celebration = 'konfeti' | RareCelebration;

// Each rare one gets this share; confetti keeps the rest.
export const RARE_CELEBRATION_CHANCE = 0.04;

export function rareCelebrationChanceTotal() {
  return RARE_CELEBRATION_CHANCE * RARE_CELEBRATIONS.length;
}

// `roll` is a number in [0,1) — injected so the choice can be tested exactly
// rather than probabilistically.
export function pickCelebration(roll: number): Celebration {
  const clamped = Number.isFinite(roll) ? Math.min(Math.max(roll, 0), 0.999999) : 0;
  const rareShare = rareCelebrationChanceTotal();
  if (clamped >= rareShare) return 'konfeti';
  const index = Math.floor(clamped / RARE_CELEBRATION_CHANCE);
  return RARE_CELEBRATIONS[Math.min(index, RARE_CELEBRATIONS.length - 1)];
}
