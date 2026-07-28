// The message a child sees when a freeze was spent for them. Kept free of any
// database import so the child dashboard can use it directly, and pure so the
// wording is testable — this is the only place the child learns that ten of
// their stars just did their job.

export function freezeWord(count: number) {
  return count === 1 ? 'külmutus' : 'külmutust';
}

function missedDaysLabel(count: number) {
  return count === 1 ? 'Eile jäi vahele' : `${count} päeva jäi vahele`;
}

function remainingLabel(held: number) {
  return held === 0
    ? 'Külmutused on otsas, osta poest uus.'
    : `Sul on järgi veel ${held} ${freezeWord(held)}.`;
}

export type StreakFreezeNotice = { headline: string; detail: string };

// `coveredDays` counts the days a freeze is currently standing in for; `held` is
// what remains afterwards. Returns null when there is nothing to announce.
export function streakFreezeNotice(input: { coveredDays: number; held: number }): StreakFreezeNotice | null {
  if (input.coveredDays <= 0) return null;
  const used = input.coveredDays === 1 ? 'külmutuse' : 'külmutused';
  return {
    headline: `${missedDaysLabel(input.coveredDays)}, kasutasid ära ${used}.`,
    detail: remainingLabel(input.held)
  };
}
