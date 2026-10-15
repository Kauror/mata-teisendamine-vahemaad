import type { CatalogueContract } from '@/lib/offline/api';
import type { RunnerSessionV3 } from '@/lib/offline/records';
import { getOfflineRunnerCapability } from '@/lib/offline/capabilities';
import { LEGACY_REWARD_POLICY_VERSION, ROTATION_ALGORITHM_VERSION } from '@/lib/shared/types';

type StoredContractFields = Pick<RunnerSessionV3, 'catalogueVersion' | 'rewardPolicyVersion' | 'generatorVersion' | 'runnerVersion' | 'rotationVersion'>;

// The catalogue contract a resumed run finalises under, rebuilt from the
// session it was stored with. A run started under one catalogue grant must
// finish under the same one, even after the app or the catalogue moved on.
//
// A missing rewardPolicyVersion falls back to LEGACY_REWARD_POLICY_VERSION,
// exactly as getCatalogueContract() does for a catalogue without one: the
// server requires an 8..128 character policy version and the outbox refuses
// to send an attempt with an empty one, so '' would strand the attempt.
// dailyLimit is not part of a run; a resumed run never consults it.
export function contractFromSession(session: StoredContractFields): CatalogueContract {
  const rotationVersion = session.rotationVersion ?? ROTATION_ALGORITHM_VERSION;
  return {
    catalogueVersion: session.catalogueVersion ?? '',
    rewardPolicyVersion: session.rewardPolicyVersion ?? LEGACY_REWARD_POLICY_VERSION,
    generatorVersion: session.generatorVersion,
    runnerVersion: session.runnerVersion,
    algorithmVersion: rotationVersion,
    rotationVersion,
    dailyLimit: 0
  };
}

export type RunnerFinalizeContract = {
  runnerId: string;
  rewardPolicyVersion: string;
  generatorVersion: string;
  runnerVersion: string;
  rotationVersion: number;
  catalogueVersion: string;
};

// The contract fields every runner attaches to its finished attempt. Throws
// when the run has no contract or the build no longer ships the runner; the
// runners turn that into the "Harjutus on peatatud" screen.
// `generatorVersion` overrides the build's generator for a run that was
// generated with an older one (the maths runner).
export function runnerFinalizeContract(runner: string, contract: CatalogueContract | null, generatorVersion?: string | null): RunnerFinalizeContract {
  const capability = getOfflineRunnerCapability(runner);
  if (!contract || !capability) throw new Error('Harjutuse võrguühenduseta leping puudub.');
  return {
    runnerId: capability.runnerId,
    rewardPolicyVersion: contract.rewardPolicyVersion,
    generatorVersion: generatorVersion ?? capability.generatorVersion,
    runnerVersion: capability.runnerVersion,
    rotationVersion: capability.rotationVersion,
    catalogueVersion: contract.catalogueVersion
  };
}
