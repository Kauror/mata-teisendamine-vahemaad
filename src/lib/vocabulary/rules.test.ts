import { describe, expect, it } from 'vitest';
import { computeUnitAccess, unitOpenedByPassing, type UnitAccessInput } from '@/lib/vocabulary/unlock';
import { applyEventToWeakState, RECOVERY_STREAK } from '@/lib/vocabulary/weakWords';

function unit(id: string, unitNumber: number, patch: Partial<UnitAccessInput> = {}): UnitAccessInput {
  return { id, unitNumber, published: true, manualUnlock: false, studyCompleted: false, testPassed: false, ...patch };
}

describe('unit access', () => {
  it('opens the first published unit even when it is not Unit 1', () => {
    const access = computeUnitAccess([unit('u7', 7), unit('u8', 8)]);
    expect(access.get('u7')).toMatchObject({ accessible: true, reason: 'first', testUnlocked: false });
    expect(access.get('u8')).toMatchObject({ accessible: false, reason: 'locked', previousUnitNumber: 7 });
  });

  it('never opens unpublished content, even after the previous unit is passed', () => {
    const access = computeUnitAccess([unit('u3', 3, { testPassed: true }), unit('u4', 4, { published: false, manualUnlock: true }), unit('u5', 5)]);
    expect(access.get('u4')).toMatchObject({ accessible: false, reason: 'unpublished' });
    // The next PUBLISHED unit after u3 is u5.
    expect(access.get('u5')).toMatchObject({ accessible: true, reason: 'previous_passed' });
  });

  it('opens the next published unit when the previous one is passed', () => {
    const units = [unit('a', 1, { studyCompleted: true }), unit('b', 2), unit('c', 3)];
    expect(unitOpenedByPassing(units, 'a')).toBe('b');
    const after = computeUnitAccess(units.map((item) => item.id === 'a' ? { ...item, testPassed: true } : item));
    expect(after.get('b')?.accessible).toBe(true);
    expect(after.get('c')?.accessible).toBe(false);
  });

  it('lets the parent open any unit by hand and bypass the prerequisite', () => {
    const access = computeUnitAccess([unit('a', 1), unit('b', 2), unit('c', 3, { manualUnlock: true })]);
    expect(access.get('c')).toMatchObject({ accessible: true, reason: 'manual' });
    expect(access.get('b')?.accessible).toBe(false);
  });

  it('keeps a passed unit open when a new unit is inserted in front of it', () => {
    const access = computeUnitAccess([unit('a', 1), unit('new', 2), unit('b', 3, { studyCompleted: true, testPassed: true })]);
    expect(access.get('b')).toMatchObject({ accessible: true, reason: 'own_passed', testUnlocked: true });
  });

  it('unlocks the test only after study is completed', () => {
    expect(computeUnitAccess([unit('a', 1)]).get('a')?.testUnlocked).toBe(false);
    expect(computeUnitAccess([unit('a', 1, { studyCompleted: true })]).get('a')?.testUnlocked).toBe(true);
    expect(computeUnitAccess([unit('a', 1), unit('b', 2, { studyCompleted: true })]).get('b')?.testUnlocked).toBe(false);
  });
});

describe('weak-word recovery', () => {
  const healthy = { needsPractice: false, recoveryStreak: 0 };

  it('marks a word weak on any typed mistake, never on a study swipe', () => {
    expect(applyEventToWeakState(healthy, { phase: 'study', correct: false, countsForRecovery: false })).toEqual(healthy);
    expect(applyEventToWeakState(healthy, { phase: 'full', correct: false, countsForRecovery: true }).needsPractice).toBe(true);
    expect(applyEventToWeakState(healthy, { phase: 'correction', correct: false, countsForRecovery: false }).needsPractice).toBe(true);
    expect(applyEventToWeakState(healthy, { phase: 'practice', correct: false, countsForRecovery: true }).needsPractice).toBe(true);
  });

  it(`recovers after ${RECOVERY_STREAK} unaided correct answers in a row`, () => {
    let state = applyEventToWeakState(healthy, { phase: 'full', correct: false, countsForRecovery: true });
    state = applyEventToWeakState(state, { phase: 'full', correct: true, countsForRecovery: true });
    expect(state.needsPractice).toBe(true);
    state = applyEventToWeakState(state, { phase: 'practice', correct: true, countsForRecovery: true });
    expect(state.needsPractice).toBe(false);
  });

  it('ignores answers given right after seeing the spelling, and restarts on a new mistake', () => {
    let state = applyEventToWeakState(healthy, { phase: 'full', correct: false, countsForRecovery: true });
    state = applyEventToWeakState(state, { phase: 'correction', correct: true, countsForRecovery: false });
    state = applyEventToWeakState(state, { phase: 'practice', correct: true, countsForRecovery: false });
    expect(state).toEqual({ needsPractice: true, recoveryStreak: 0 });
    state = applyEventToWeakState(state, { phase: 'full', correct: true, countsForRecovery: true });
    state = applyEventToWeakState(state, { phase: 'full', correct: false, countsForRecovery: true });
    state = applyEventToWeakState(state, { phase: 'full', correct: true, countsForRecovery: true });
    expect(state.needsPractice).toBe(true);
  });
});
