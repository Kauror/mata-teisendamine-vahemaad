import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { resolveAppVersion } from './app-version.mjs';

const buildId = process.env.OFFLINE_BUILD_ID || crypto.randomBytes(15).toString('base64url');
// Inlined into both bundles by Next at build time, which is what makes the
// version survive into the running container without any runtime env.
const appVersion = resolveAppVersion();
const env = {
  ...process.env,
  OFFLINE_BUILD_ID: buildId,
  NEXT_PUBLIC_APP_BUILD_ID: buildId,
  NEXT_PUBLIC_APP_VERSION: appVersion
};

function run(modulePath, args = []) {
  const result = spawnSync(process.execPath, [modulePath, ...args], { env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run('node_modules/next/dist/bin/next', ['build']);
run('scripts/build-sw.mjs');
