// Which textbook units the child may open, decided from current data on every
// read. Nothing about access is cached, so a parent's change takes effect at
// once and there is no stored flag to drift out of date.
//
//  - Unpublished content is never accessible, whatever else is true.
//  - The first published unit is always open, whatever its number (the
//    textbook may start at Unit 3 or Unit 7).
//  - A unit opens when the published unit before it has been passed (≥95% in
//    one full test round), when the parent unlocked it by hand, or when the
//    child has already passed the unit itself — a completed unit stays open
//    even if the parent later inserts a new unit in front of it.
//  - The test opens once the child has finished studying the unit once.

export type UnitAccessInput = {
  id: string;
  unitNumber: number;
  published: boolean;
  manualUnlock: boolean;
  studyCompleted: boolean;
  testPassed: boolean;
};

export type UnitAccessReason = 'unpublished' | 'first' | 'manual' | 'own_passed' | 'previous_passed' | 'locked';

export type UnitAccess = {
  accessible: boolean;
  reason: UnitAccessReason;
  testUnlocked: boolean;
  // For a locked unit: the unit whose test opens it.
  previousUnitNumber: number | null;
};

export function computeUnitAccess(units: readonly UnitAccessInput[]): Map<string, UnitAccess> {
  const result = new Map<string, UnitAccess>();
  const published = units.filter((unit) => unit.published).sort((left, right) => left.unitNumber - right.unitNumber);
  for (const unit of units) {
    if (!unit.published) result.set(unit.id, { accessible: false, reason: 'unpublished', testUnlocked: false, previousUnitNumber: null });
  }
  published.forEach((unit, index) => {
    const previous = index > 0 ? published[index - 1] : null;
    let reason: UnitAccessReason;
    if (!previous) reason = 'first';
    else if (unit.testPassed) reason = 'own_passed';
    else if (previous.testPassed) reason = 'previous_passed';
    else if (unit.manualUnlock) reason = 'manual';
    else reason = 'locked';
    const accessible = reason !== 'locked';
    result.set(unit.id, {
      accessible,
      reason,
      testUnlocked: accessible && unit.studyCompleted,
      previousUnitNumber: previous?.unitNumber ?? null
    });
  });
  return result;
}

// The unit a pass newly opens: the next published unit, if it was locked.
export function unitOpenedByPassing(units: readonly UnitAccessInput[], passedUnitId: string): string | null {
  const before = computeUnitAccess(units);
  const after = computeUnitAccess(units.map((unit) => unit.id === passedUnitId ? { ...unit, testPassed: true } : unit));
  for (const [id, access] of after) {
    if (access.accessible && !before.get(id)?.accessible && id !== passedUnitId) return id;
  }
  return null;
}
