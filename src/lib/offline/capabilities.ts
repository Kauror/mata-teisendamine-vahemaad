import manifest from '@/lib/offline/capabilities.json';
import type { Learner } from '@/lib/shared/types';

export type OfflineRunnerCapability = {
  id: string;
  runnerId: string;
  runnerVersion: string;
  generatorVersion: string;
  rotationVersion: number;
  learners: Learner[];
  route: string;
  alternateRoutes?: string[];
  offlineStart: boolean;
  requiresPreparedData?: boolean;
};

export type OfflineCapabilityManifest = {
  manifestVersion: number;
  shellRoutes: string[];
  publicAssets: string[];
  runners: OfflineRunnerCapability[];
};

export const OFFLINE_CAPABILITY_MANIFEST = manifest as OfflineCapabilityManifest;
export const OFFLINE_CAPABILITY_MANIFEST_VERSION = OFFLINE_CAPABILITY_MANIFEST.manifestVersion;
export const APP_BUILD_ID = process.env.NEXT_PUBLIC_APP_BUILD_ID ?? 'development';

export function getOfflineRunnerCapability(idOrRunnerId: string): OfflineRunnerCapability | undefined {
  return OFFLINE_CAPABILITY_MANIFEST.runners.find((runner) => runner.id === idOrRunnerId || runner.runnerId === idOrRunnerId);
}

export function validateOfflineCapabilityManifest(value: OfflineCapabilityManifest = OFFLINE_CAPABILITY_MANIFEST): string[] {
  const errors: string[] = [];
  const routes = new Set(value.shellRoutes);
  const ids = new Set<string>();
  for (const runner of value.runners) {
    if (ids.has(runner.id)) errors.push(`Duplicate runner id: ${runner.id}`);
    ids.add(runner.id);
    if (!runner.runnerId || !runner.runnerVersion || !runner.generatorVersion || !Number.isInteger(runner.rotationVersion)) errors.push(`Runner contract is incomplete: ${runner.id}`);
    if (!routes.has(runner.route)) errors.push(`Runner route is not cached: ${runner.id} -> ${runner.route}`);
    for (const route of runner.alternateRoutes ?? []) {
      if (!routes.has(route)) errors.push(`Runner alternate route is not cached: ${runner.id} -> ${route}`);
    }
  }
  if (!routes.has('/tulemus')) errors.push('Static local result shell is not cached.');
  return errors;
}
