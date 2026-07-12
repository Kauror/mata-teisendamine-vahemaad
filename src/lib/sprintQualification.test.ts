import { describe, expect, it } from 'vitest';
import { qualifySprintsPure } from '@/lib/sprintQualification';

const row = (id: number, score: number, completedAt: string, clientAttemptId: string) => ({
  id, score, effectiveCompletedAt: completedAt, createdAt: completedAt, clientAttemptId
});

describe('Kiur sprint qualification', () => {
  it('uses completion order rather than server arrival order', () => {
    const chronological = [
      row(100, 40, '2026-07-01T10:00:00.000Z', 'a'),
      row(101, 1, '2026-07-01T10:01:00.000Z', 'b')
    ];
    const reverseArrival = [
      row(1, 1, '2026-07-01T10:01:00.000Z', 'b'),
      row(2, 40, '2026-07-01T10:00:00.000Z', 'a')
    ];
    const first = [...qualifySprintsPure(chronological).values()].map((item) => ({ record: item.recordBeforeRun, qualified: item.qualified }));
    const second = [...qualifySprintsPure(reverseArrival).values()].map((item) => ({ record: item.recordBeforeRun, qualified: item.qualified }));
    expect(first).toEqual([{ record: 0, qualified: false }, { record: 40, qualified: false }]);
    expect(second).toEqual(first);
  });

  it('uses clientAttemptId then server id only to break exact timestamp ties', () => {
    const qualification = qualifySprintsPure([
      row(2, 20, '2026-07-01T10:00:00.000Z', 'b'),
      row(1, 12, '2026-07-01T10:00:00.000Z', 'a')
    ]);
    expect(qualification.get(1)).toMatchObject({ recordBeforeRun: 0, qualified: false });
    expect(qualification.get(2)).toMatchObject({ recordBeforeRun: 12, requiredScore: 6, qualified: true });
  });
});
