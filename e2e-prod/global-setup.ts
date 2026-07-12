import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { TEST_SESSION_SECRET, AUTH_STATE_PATH } from './config';

// Mint a valid family session cookie and persist it as Playwright storage state,
// so the production build's service worker can precache the protected shell
// routes (which 302 to /access without a session). The cookie is signed with the
// same secret the server runs with. We set secure:false so it is sent over the
// plain-http localhost origin the test server listens on (production proper uses
// HTTPS; this is a test-only relaxation).
export default async function globalSetup() {
  process.env.APP_SESSION_SECRET_CURRENT = TEST_SESSION_SECRET;
  const { issueSession } = await import('../src/lib/auth/session');
  const { token } = await issueSession('family', { maxAgeSeconds: 60 * 60 * 24 });

  const state = {
    cookies: [
      {
        name: 'app_access',
        value: token,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Strict' as const,
        expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24
      }
    ],
    origins: []
  };

  const outPath = path.resolve(AUTH_STATE_PATH);
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(state, null, 2));
}
