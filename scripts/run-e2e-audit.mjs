import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';

const port = Number(process.env.PW_AUDIT_PORT ?? 3101);
const origin = `http://localhost:${port}`;
const auditDatabase = path.resolve('.e2e-audit-data', 'audit.sqlite');
const serverEnvironment = {
  ...process.env,
  MATHS_GAME_DB_FILE: auditDatabase,
  OFFLINE_PROTOCOL_V2_ENABLED: '1',
  APP_ORIGIN: origin,
  APP_SESSION_SECRET_CURRENT: 'audit-session-secret-with-at-least-thirty-two-bytes',
  APP_ACCESS_PIN_HASH: 'scrypt$v=1$N=16384,r=8,p=1$CmO5D6zhaeWjWLkyuNBXgw$V1f-JtGInwY1cCau3S2iS1PdwC2Uo_2XdYCgdqdyZQs',
  PARENT_PASSWORD_HASH: 'scrypt$v=1$N=16384,r=8,p=1$vPQPNlFVAOE0K4jvsgU2eQ$Fj3ktEJSm6cG_BI2gTvaBAd36_36pbx7ke8Ewg6j86c'
};

async function isReachable() {
  try {
    const response = await fetch(`${origin}/access`);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer(server) {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Audit server exited during startup with code ${server.exitCode}.`);
    }
    if (await isReachable()) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Audit server did not become ready at ${origin}.`);
}

function stopServerTree(server) {
  if (server.exitCode !== null) return;
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
    return;
  }
  server.kill('SIGTERM');
}

if (await isReachable()) {
  throw new Error(`Audit port ${port} is already in use. Stop that server or set PW_AUDIT_PORT.`);
}

const server = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'dev', '-H', '127.0.0.1', '-p', String(port)],
  { env: serverEnvironment, stdio: 'inherit' }
);

let exitCode = 1;
try {
  await waitForServer(server);
  const playwright = spawnSync(
    process.execPath,
    ['node_modules/@playwright/test/cli.js', 'test', '--config=playwright.audit.config.ts', ...process.argv.slice(2)],
    { env: process.env, stdio: 'inherit' }
  );
  exitCode = playwright.status ?? 1;
} finally {
  stopServerTree(server);
}

process.exit(exitCode);
