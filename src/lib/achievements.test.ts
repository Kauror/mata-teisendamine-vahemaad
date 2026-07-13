import { describe, expect, it } from 'vitest';
import { latestExerciseMilestone } from '@/lib/achievements';

describe('exercise milestones', () => {
  it('advances in 50-exercise steps and ends at 999', () => {
    expect(latestExerciseMilestone(49)).toBeNull();
    expect(latestExerciseMilestone(50)).toBe(50);
    expect(latestExerciseMilestone(149)).toBe(100);
    expect(latestExerciseMilestone(950)).toBe(950);
    expect(latestExerciseMilestone(999)).toBe(999);
  });
});
