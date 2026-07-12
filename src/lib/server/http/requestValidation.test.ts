import { describe, expect, it } from 'vitest';
import {
  MAX_MUTATION_BODY_BYTES,
  PublicRequestError,
  isRfc3339,
  parseOfflineSyncRequest,
  readJsonBody,
  validateAttemptRecordV2
} from '@/lib/server/http/requestValidation';

const deviceId = '018f47f6-9f2c-7b9a-8a2e-123456789abc';
const attemptId = '018f47f6-9f2c-7b9a-8a2e-abcdefabcdef';

function attempt() {
  return {
    clientAttemptId: attemptId,
    deviceId,
    learner: 'kiur', subject: 'matemaatika', topic: 'pikkused', category: 'Teisendamine', difficulty: 'Lihtne',
    exerciseId: 'math.lengths', catalogueVersion: 'catalogue-123', rewardPolicyVersion: 'reward-policy-123',
    generatorVersion: 'generator-1', runnerId: 'math', runnerVersion: 'math-v1', rotationVersion: 1,
    seed: 1, questionIds: ['q1'], startedAt: '2026-07-01T10:00:00.000Z',
    rawDeviceCompletedAt: '2026-07-01T10:01:00.000Z', completedAt: '2026-07-01T10:01:00.000Z',
    clientCorrectedCompletedAt: '2026-07-01T10:01:00.000Z', clientTimeZone: 'Europe/Tallinn', clientUtcOffsetMinutes: 180,
    questionCount: 1, score: 1, elapsedSeconds: 60, questions: [{ id: 'q1' }]
  };
}

describe('strict mutation validation', () => {
  it('rejects impossible RFC3339 values and malformed UUIDs per record', () => {
    expect(isRfc3339('2026-99-99T25:61:00Z')).toBe(false);
    const invalid = validateAttemptRecordV2({ ...attempt(), clientAttemptId: 'not-uuid' }, deviceId);
    expect(invalid.ok).toBe(false);
    if (!invalid.ok) expect(invalid.issues).toContain('clientAttemptId must be an RFC UUID');
  });

  it('accepts a strict record but does not treat its client score as authoritative', () => {
    expect(validateAttemptRecordV2({ ...attempt(), score: 0 }, deviceId).ok).toBe(true);
  });

  it('never silently truncates an oversized v2 attempt batch', () => {
    const body = {
      protocolVersion: 2,
      phase: 'push',
      pushKind: 'attempts',
      device: { deviceId, appVersion: '2', buildId: 'b', timeZone: 'Europe/Tallinn', clientNow: '2026-07-01T10:00:00.000Z' },
      cursor: {},
      pending: { attempts: Array.from({ length: 51 }, attempt) }
    };
    expect(() => parseOfflineSyncRequest(body)).toThrowError(PublicRequestError);
    try {
      parseOfflineSyncRequest(body);
    } catch (error) {
      expect((error as PublicRequestError).status).toBe(422);
      expect((error as PublicRequestError).issues.join(' ')).toContain('exceeds 50');
    }
  });

  it('stops reading beyond one MiB and returns 413', async () => {
    const request = new Request('https://example.test/api', {
      method: 'POST',
      body: JSON.stringify({ value: 'x'.repeat(MAX_MUTATION_BODY_BYTES) }),
      headers: { 'content-type': 'application/json' }
    });
    await expect(readJsonBody(request)).rejects.toMatchObject({ status: 413, code: 'body_too_large' });
  });
});
