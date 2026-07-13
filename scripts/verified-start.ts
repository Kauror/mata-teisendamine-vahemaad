import { spawn } from 'node:child_process';
import path from 'node:path';
import { configuredDatabaseFile } from '../src/lib/db';
import { prepareDatabaseForStartup } from '../src/lib/server/database/verification';
import { assertProductionAuthConfigured } from '../src/lib/appAccess';
import { assertOfflineProtocolConsistent } from '../src/lib/offline/protocol';
import { assertProductionParentAuthReady } from '../src/lib/server/auth/parentStartup';

// tsx transforms this script as CommonJS, so top-level await is unavailable; the
// verified startup sequence runs inside an async main() instead.
async function main() {
  assertProductionAuthConfigured();
  assertOfflineProtocolConsistent();
  const result = await prepareDatabaseForStartup(configuredDatabaseFile(), process.env.MATHS_GAME_BACKUP_DIR);
  assertProductionParentAuthReady(result.databaseFile);
  process.stdout.write(`Database startup verification passed: ${JSON.stringify(result.verification)}\n`);

  const nextBin = path.resolve('node_modules', 'next', 'dist', 'bin', 'next');
  const child = spawn(process.execPath, [nextBin, 'start', ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_STARTUP_VERIFIED: '1' }
  });

  let stopping = false;
  const forward = (signal: NodeJS.Signals) => {
    if (stopping) return;
    stopping = true;
    child.kill(signal);
  };
  process.once('SIGTERM', () => forward('SIGTERM'));
  process.once('SIGINT', () => forward('SIGINT'));

  child.once('exit', (code, signal) => {
    if (signal && stopping) process.exit(0);
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
  });

  child.once('error', (error) => {
    console.error(error);
    process.exit(1);
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
