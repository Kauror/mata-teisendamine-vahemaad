import { describe, expect, it } from 'vitest';
import { startOfAppWeek } from '@/lib/appDate';

describe('startOfAppWeek', () => {
  it('uses Monday as the start of the calendar week', () => {
    expect(startOfAppWeek('2026-07-13')).toBe('2026-07-13');
    expect(startOfAppWeek('2026-07-19')).toBe('2026-07-13');
  });
});
