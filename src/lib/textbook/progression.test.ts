import { describe, expect, it } from 'vitest';
import { computeTextbookAccess, computeUnitGates, textbookUnitOpenedByPassing, UNIT_STATUS_LABELS, type UnitProgressFacts } from '@/lib/textbook/progression';

const unit = (id: string, unitNumber: number, extra: Partial<{ published: boolean; manualUnlock: boolean; testPassed: boolean }> = {}) => ({
  id, unitNumber, published: true, manualUnlock: false, testPassed: false, ...extra
});

describe('unit access', () => {
  it('a fresh learner gets only the first published unit, whatever its number', () => {
    const access = computeTextbookAccess([unit('u10', 10, { published: false }), unit('u11', 11), unit('u12', 12)]);
    expect(access.get('u10')).toMatchObject({ accessible: false, reason: 'unpublished' });
    expect(access.get('u11')).toMatchObject({ accessible: true, reason: 'first' });
    expect(access.get('u12')).toMatchObject({ accessible: false, reason: 'locked' });
  });

  it('passing opens the next published unit; a manual unlock opens without a pass', () => {
    const units = [unit('a', 1), unit('b', 2), unit('c', 3, { manualUnlock: true })];
    expect(textbookUnitOpenedByPassing(units, 'a')).toBe('b');
    const access = computeTextbookAccess(units);
    expect(access.get('c')).toMatchObject({ accessible: true, reason: 'manual' });
    expect(access.get('b')!.accessible).toBe(false);
  });

  it('an unpublished unit stays inaccessible even when passed or unlocked', () => {
    const access = computeTextbookAccess([unit('a', 1), unit('b', 2, { published: false, testPassed: true, manualUnlock: true })]);
    expect(access.get('b')!.accessible).toBe(false);
  });

  it('a draft between two ready units never blocks the next one: Unit 21 opens on the pass of the previous ready unit (Unit 20 is a draft)', () => {
    // isPublished() makes every draft unpublished (child and preview alike), so drafts drop out of the order.
    const order = (passed: boolean) => [unit('u18', 18, { testPassed: true }), unit('u19', 19, { testPassed: passed }), unit('u20', 20, { published: false }), unit('u21', 21)];
    expect(computeTextbookAccess(order(false)).get('u21')).toMatchObject({ accessible: false, reason: 'locked', previousUnitNumber: 19 });
    expect(computeTextbookAccess(order(true)).get('u21')).toMatchObject({ accessible: true, reason: 'previous_passed', previousUnitNumber: 19 });
    expect(textbookUnitOpenedByPassing(order(false), 'u19')).toBe('u21');
    // Today on this branch Units 15–20 are all drafts: passing Unit 14 opens Unit 21.
    const today = [unit('u14', 14), ...[15, 16, 17, 18, 19, 20].map((number) => unit(`u${number}`, number, { published: false })), unit('u21', 21)];
    expect(textbookUnitOpenedByPassing(today, 'u14')).toBe('u21');
  });
});

describe('unit gates and status', () => {
  const base: UnitProgressFacts = {
    accessible: true,
    requiredLessonIds: ['l1', 'l2'],
    completedLessonIds: [],
    practiceCompleted: false,
    activeTest: false,
    testPassed: false,
    lastTestFailed: false,
    retakePracticeCompleted: false,
    retakePracticeRequired: true
  };

  it('walks Õpi → Harjuta → Test → Läbitud', () => {
    expect(computeUnitGates({ ...base, accessible: false }).status).toBe('locked');
    expect(computeUnitGates(base)).toMatchObject({ status: 'start_learning', practiceUnlocked: false, testUnlocked: false });
    expect(computeUnitGates({ ...base, completedLessonIds: ['l1'] })).toMatchObject({ status: 'learning_in_progress', practiceUnlocked: false });
    expect(computeUnitGates({ ...base, completedLessonIds: ['l1', 'l2'] })).toMatchObject({ status: 'practice', practiceUnlocked: true, testUnlocked: false });
    expect(computeUnitGates({ ...base, completedLessonIds: ['l1', 'l2'], practiceCompleted: true })).toMatchObject({ status: 'test_ready', testUnlocked: true });
    expect(computeUnitGates({ ...base, completedLessonIds: ['l1', 'l2'], practiceCompleted: true, activeTest: true }).status).toBe('test_in_progress');
    expect(computeUnitGates({ ...base, completedLessonIds: ['l1', 'l2'], practiceCompleted: true, testPassed: true }).status).toBe('passed');
  });

  it('a failed test requires targeted practice before the next test (Korda)', () => {
    const failed = { ...base, completedLessonIds: ['l1', 'l2'], practiceCompleted: true, lastTestFailed: true };
    expect(computeUnitGates(failed)).toMatchObject({ status: 'review', testUnlocked: false, retakePracticePending: true });
    expect(computeUnitGates({ ...failed, retakePracticeCompleted: true })).toMatchObject({ status: 'test_ready', testUnlocked: true });
    expect(computeUnitGates({ ...failed, retakePracticeRequired: false })).toMatchObject({ status: 'test_ready', testUnlocked: true });
  });

  it('a passed unit stays open even if a lesson is added later', () => {
    const gates = computeUnitGates({ ...base, requiredLessonIds: ['l1', 'l2', 'l3'], completedLessonIds: ['l1', 'l2'], practiceCompleted: true, testPassed: true });
    expect(gates).toMatchObject({ status: 'passed', testUnlocked: true });
  });

  it('has an Estonian label for every status', () => {
    expect(Object.values(UNIT_STATUS_LABELS)).toEqual(['Lukus', 'Alusta õppimist', 'Õppimine pooleli', 'Harjuta', 'Test ootab', 'Test pooleli', 'Läbitud', 'Korda']);
  });
});
