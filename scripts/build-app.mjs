import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const buildId = process.env.OFFLINE_BUILD_ID || crypto.randomBytes(15).toString('base64url');
const env = {
  ...process.env,
  OFFLINE_BUILD_ID: buildId,
  NEXT_PUBLIC_APP_BUILD_ID: buildId
};

function run(modulePath, args = []) {
  const result = spawnSync(process.execPath, [modulePath, ...args], { env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run('node_modules/next/dist/bin/next', ['build']);
run('scripts/build-sw.mjs');
