import { describe, expect, it } from 'vitest';
import { createRunId, isRunId, makeRunnerSession } from '@/lib/offline/runnerSession';

describe('RunnerSessionV3', () => {
  it('mints strict, unique RFC 4122 v4 run ids', () => {
    const ids = Array.from({ length: 100 }, () => createRunId());
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every(isRunId)).toBe(true);
  });

  it('freezes the exact runner contract under runId=sessionId', () => {
    const runId = 'c8641c18-7e0e-4f03-936a-10c8130675dd';
    const questions = [{ id: 'q-1', prompt: '1 + 1' }];
    const session = makeRunnerSession({
      runId,
      learner: 'kiur',
      runnerId: 'shared.math',
      exerciseId: 'kiur.math.addition',
      subject: 'matemaatika',
      topic: 'liitmine',
      category: 'Arvutamine',
      seed: 42,
      questions,
      optionOrder: [['2', '3']],
      answers: [''],
      runnerState: { feedback: null },
      catalogueVersion: 'catalogue-1',
      rewardPolicyVersion: 'policy-1',
      generatorVersion: 'generator-1',
      runnerVersion: 'runner-1',
      rotationVersion: 1,
      buildId: 'build-1',
      startedAt: '2026-07-12T10:00:00.000Z'
    });

    expect(session).toMatchObject({
      schemaVersion: 3,
      sessionId: runId,
      runId,
      seed: 42,
      questions,
      optionOrder: [['2', '3']],
      catalogueVersion: 'catalogue-1',
      rewardPolicyVersion: 'policy-1',
      generatorVersion: 'generator-1',
      runnerVersion: 'runner-1',
      rotationVersion: 1,
      buildId: 'build-1',
      storageRevision: 1
    });
  });

  it('rejects non-v4 run ids before persistence', () => {
    expect(() => makeRunnerSession({
      runId: 'not-a-uuid',
      learner: 'kiur',
      runnerId: 'test',
      exerciseId: null,
      subject: null,
      topic: 'test',
      category: 'test',
      questions: [],
      runnerState: {},
      runnerVersion: '1'
    })).toThrow(/version 4 UUID/);
  });
});
