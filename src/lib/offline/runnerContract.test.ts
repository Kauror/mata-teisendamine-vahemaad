import { describe, expect, it } from 'vitest';
import type { CatalogueContract } from '@/lib/offline/api';
import { getOfflineRunnerCapability } from '@/lib/offline/capabilities';
import { contractFromSession, runnerFinalizeContract } from './runnerContract';
import { ROTATION_ALGORITHM_VERSION } from '@/lib/shared/types';

type Stored = Parameters<typeof contractFromSession>[0];

// The inline blocks the six runners carried before EX-14, verbatim.
// /test, Kiur reading, English sprint, picture–word and first sound:
function previousRunnerContract(existing: Stored): CatalogueContract {
  return {
    catalogueVersion: existing.catalogueVersion ?? '',
    rewardPolicyVersion: existing.rewardPolicyVersion ?? 'legacy-v1',
    generatorVersion: existing.generatorVersion,
    runnerVersion: existing.runnerVersion,
    algorithmVersion: existing.rotationVersion ?? 1,
    rotationVersion: existing.rotationVersion ?? 1,
    dailyLimit: 0
  };
}
// The science test:
function previousScienceContract(existing: Stored): CatalogueContract {
  return {
    catalogueVersion: existing.catalogueVersion ?? '',
    rewardPolicyVersion: existing.rewardPolicyVersion ?? '',
    generatorVersion: existing.generatorVersion,
    runnerVersion: existing.runnerVersion,
    rotationVersion: existing.rotationVersion ?? ROTATION_ALGORITHM_VERSION,
    algorithmVersion: existing.rotationVersion ?? ROTATION_ALGORITHM_VERSION,
    dailyLimit: 0
  };
}

const complete: Stored = {
  catalogueVersion: 'catalogue-hash-1234',
  rewardPolicyVersion: 'policy-hash-5678',
  generatorVersion: '2026-07-1',
  runnerVersion: 'math-v3',
  rotationVersion: 2
};
const sparse: Stored = {
  catalogueVersion: null,
  rewardPolicyVersion: null,
  generatorVersion: 'kiur-reading-v1',
  runnerVersion: 'kiur-reading-v1',
  rotationVersion: null
};

describe('contractFromSession (EX-14)', () => {
  it.each([
    ['/test', 'complete', complete],
    ['/test', 'sparse', sparse],
    ['Kiur reading', 'complete', complete],
    ['Kiur reading', 'sparse', sparse],
    ['English sprint', 'complete', complete],
    ['English sprint', 'sparse', sparse],
    ['picture–word', 'complete', complete],
    ['picture–word', 'sparse', sparse],
    ['first sound', 'complete', complete],
    ['first sound', 'sparse', sparse]
  ])('matches the %s runner\'s previous inline contract (%s session)', (_runner, _shape, stored) => {
    expect(contractFromSession(stored)).toEqual(previousRunnerContract(stored));
  });

  it('matches the science runner for every session that names its reward policy', () => {
    expect(contractFromSession(complete)).toEqual(previousScienceContract(complete));
    expect(contractFromSession({ ...sparse, rewardPolicyVersion: 'policy-hash-5678' }))
      .toEqual(previousScienceContract({ ...sparse, rewardPolicyVersion: 'policy-hash-5678' }));
  });

  it('gives a session without a reward policy the legacy policy, not an unsendable empty one', () => {
    // The science runner used to default to '' here; the outbox and the server
    // both reject an attempt whose rewardPolicyVersion is empty.
    expect(contractFromSession(sparse).rewardPolicyVersion).toBe('legacy-v1');
    expect(previousScienceContract(sparse).rewardPolicyVersion).toBe('');
  });
});

describe('runnerFinalizeContract (EX-14)', () => {
  const contract = contractFromSession(complete);

  it('takes the policy and catalogue from the run and the rest from the build', () => {
    const capability = getOfflineRunnerCapability('kiur-science')!;
    expect(runnerFinalizeContract('kiur-science', contract)).toEqual({
      runnerId: capability.runnerId,
      rewardPolicyVersion: 'policy-hash-5678',
      generatorVersion: capability.generatorVersion,
      runnerVersion: capability.runnerVersion,
      rotationVersion: capability.rotationVersion,
      catalogueVersion: 'catalogue-hash-1234'
    });
  });

  it('keeps the generator version a run was created with', () => {
    expect(runnerFinalizeContract('math', contract, 'math-generator-old').generatorVersion).toBe('math-generator-old');
    expect(runnerFinalizeContract('math', contract, null).generatorVersion).toBe(getOfflineRunnerCapability('math')!.generatorVersion);
  });

  it('refuses to finalise without a contract or a known runner', () => {
    expect(() => runnerFinalizeContract('math', null)).toThrow();
    expect(() => runnerFinalizeContract('no-such-runner', contract)).toThrow();
  });
});
