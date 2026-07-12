import { spawn } from 'node:child_process';
import path from 'node:path';
import { configuredDatabaseFile } from '../src/lib/db';
import { prepareDatabaseForStartup } from '../src/lib/server/database/verification';
import { assertProductionAuthConfigured } from '../src/lib/appAccess';

assertProductionAuthConfigured();
const result = prepareDatabaseForStartup(configuredDatabaseFile(), process.env.MATHS_GAME_BACKUP_DIR);
process.stdout.write(`Database startup verification passed: ${JSON.stringify(result.verification)}\n`);

const nextBin = path.resolve('node_modules', 'next', 'dist', 'bin', 'next');
const child = spawn(process.execPath, [nextBin, 'start', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_STARTUP_VERIFIED: '1' }
});

child.once('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});

child.once('error', (error) => {
  console.error(error);
  process.exit(1);
});
