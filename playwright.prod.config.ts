import { defineConfig, devices } from '@playwright/test';
import { TEST_SESSION_SECRET, TEST_ORIGIN, AUTH_STATE_PATH } from './e2e-prod/config';

// Production-build service-worker E2E (RTM2-H06). Unlike the dev smoke suite,
// this serves the actual `next build` output (which registers the generated
// service worker) and exercises install + offline reload in a real browser.
// A physical iPhone Add-to-Home-Screen pass is still required before final RTM.
export default defineConfig({
  testDir: './e2e-prod',
  testMatch: /.*\.spec\.ts/,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  globalSetup: './e2e-prod/global-setup.ts',
  use: {
    baseURL: 'http://localhost:3000',
    storageState: AUTH_STATE_PATH,
    // Service workers require a secure context; http://localhost qualifies.
    serviceWorkers: 'allow',
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  webServer: {
    command: 'npm run build && npm run start:next',
    url: 'http://localhost:3000/api/healthz',
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    env: {
      NODE_ENV: 'production',
      MATHS_GAME_DB_FILE: ':memory:',
      OFFLINE_PROTOCOL_V2_ENABLED: '1',
      APP_ORIGIN: TEST_ORIGIN,
      APP_SESSION_SECRET_CURRENT: TEST_SESSION_SECRET
    }
  }
});
