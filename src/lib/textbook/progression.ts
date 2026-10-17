// Unit access and the per-unit flow Õpi → Harjuta → Test → Läbitud, decided
// from current facts on every read (nothing cached). Access follows exactly
// the English vocabulary rules (lib/vocabulary/unlock.ts, reused unchanged):
// unpublished → never; the first published unit → always; a later published
// unit → when the previous published unit is passed, the parent unlocked it,
// or it was passed itself. A manual unlock never records a pass.

import { computeUnitAccess, unitOpenedByPassing, type UnitAccess, type UnitAccessInput } from '@/lib/vocabulary/unlock';

export type { UnitAccess, UnitAccessInput };

export type TextbookUnitAccessInput = {
  id: string;
  unitNumber: number;
  published: boolean;
  manualUnlock: boolean;
  testPassed: boolean;
};

// `studyCompleted` of the shared rules is unused here (the test gate is
// computeUnitGates below), so it is passed as false.
export function computeTextbookAccess(units: readonly TextbookUnitAccessInput[]): Map<string, UnitAccess> {
  return computeUnitAccess(units.map((unit) => ({ ...unit, studyCompleted: false })));
}

export function textbookUnitOpenedByPassing(units: readonly TextbookUnitAccessInput[], passedUnitId: string): string | null {
  return unitOpenedByPassing(units.map((unit) => ({ ...unit, studyCompleted: false })), passedUnitId);
}

// Stable codes for the child's unit status. The Estonian label is for display
// only; code against the codes.
export type UnitStatusCode =
  | 'locked'
  | 'start_learning'
  | 'learning_in_progress'
  | 'practice'
  | 'test_ready'
  | 'test_in_progress'
  | 'passed'
  | 'review';

export const UNIT_STATUS_LABELS: Record<UnitStatusCode, string> = {
  locked: 'Lukus',
  start_learning: 'Alusta õppimist',
  learning_in_progress: 'Õppimine pooleli',
  practice: 'Harjuta',
  test_ready: 'Test ootab',
  test_in_progress: 'Test pooleli',
  passed: 'Läbitud',
  review: 'Korda'
};

export type UnitProgressFacts = {
  accessible: boolean;
  requiredLessonIds: readonly string[];
  completedLessonIds: readonly string[];
  // A normal practice run of this unit has been completed.
  practiceCompleted: boolean;
  // An unsubmitted test session exists.
  activeTest: boolean;
  // Ever passed (never revoked by later content changes or failed retakes).
  testPassed: boolean;
  // The most recent submitted test failed (only meaningful while not passed).
  lastTestFailed: boolean;
  // A targeted practice run completed AFTER that failed test.
  retakePracticeCompleted: boolean;
  // Course setting.
  retakePracticeRequired: boolean;
};

export type UnitGates = {
  status: UnitStatusCode;
  readingComplete: boolean;
  practiceUnlocked: boolean;
  testUnlocked: boolean;
  // After a failed test: targeted practice must come first.
  retakePracticePending: boolean;
};

export function computeUnitGates(facts: UnitProgressFacts): UnitGates {
  const completed = new Set(facts.completedLessonIds);
  const readingComplete = facts.requiredLessonIds.every((id) => completed.has(id));
  const retakePracticePending = !facts.testPassed && facts.lastTestFailed && facts.retakePracticeRequired && !facts.retakePracticeCompleted;
  const practiceUnlocked = facts.accessible && readingComplete;
  // A passed unit stays fully open, even if content added a lesson later.
  const testUnlocked = facts.accessible && (facts.testPassed || (readingComplete && facts.practiceCompleted && !retakePracticePending));

  let status: UnitStatusCode;
  if (!facts.accessible) status = 'locked';
  else if (facts.testPassed) status = 'passed';
  else if (facts.activeTest) status = 'test_in_progress';
  else if (retakePracticePending) status = 'review';
  else if (readingComplete && facts.practiceCompleted) status = 'test_ready';
  else if (readingComplete) status = 'practice';
  else if (facts.requiredLessonIds.some((id) => completed.has(id))) status = 'learning_in_progress';
  else status = 'start_learning';

  return { status, readingComplete, practiceUnlocked, testUnlocked, retakePracticePending };
}
