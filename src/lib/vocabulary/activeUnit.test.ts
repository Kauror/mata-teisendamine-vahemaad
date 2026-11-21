import { describe, expect, it } from 'vitest';
import { activeUnitId } from './activeUnit';

const unit = (id: string, status: Parameters<typeof activeUnitId>[0][number]['status'], unitTest: string | null = null) =>
  ({ id, status, unitTest: unitTest ? { state: unitTest } : null });

describe('activeUnitId', () => {
  it("picks the unit with a test in progress over earlier units whose kontrolltöö waits (Kaur's list)", () => {
    expect(activeUnitId([
      unit('u3', 'testing', 'available'), // listed first but…
      unit('u4', 'passed', 'available'),
      unit('u7', 'testing')
    ])).toBe('u3'); // …it is itself a started test
    expect(activeUnitId([
      unit('u3', 'passed', 'available'),
      unit('u4', 'passed', 'available'),
      unit('u6', 'passed', 'passed'),
      unit('u7', 'testing'),
      unit('u8', 'locked')
    ])).toBe('u7');
  });

  it('then the next words step, then the first waiting kontrolltöö, else none', () => {
    expect(activeUnitId([unit('a', 'passed', 'available'), unit('b', 'new'), unit('c', 'locked')])).toBe('b');
    expect(activeUnitId([unit('a', 'passed', 'passed'), unit('b', 'passed', 'retake')])).toBe('b');
    expect(activeUnitId([unit('a', 'passed', 'passed'), unit('b', 'locked')])).toBeNull();
  });

  it('a returned kontrolltöö counts as started', () => {
    expect(activeUnitId([unit('a', 'new'), unit('b', 'passed', 'returned')])).toBe('b');
  });
});
