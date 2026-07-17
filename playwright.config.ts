import { defineConfig, devices } from '@playwright/test';

// Browser-level release evidence (RTM-006). Runs the app in a real Chromium and
// WebKit against a dev server. Full offline / service-worker certification also
// requires a production build served over HTTPS and on-device iOS checks (see
// README) — this suite covers the boot, routing and access-gate paths that unit
// tests cannot exercise in a browser.
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  // The dev-server fixture intentionally shares one in-memory database and
  // authentication rate limiter across both browser projects. Serial workers
  // keep login and restoration evidence independent instead of cross-throttled.
  workers: 1,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ],
  webServer: {
    // Reuse the Node runtime that launched Playwright. This avoids a second
    // package-manager shim and keeps local/CI server startup deterministic.
    command: `"${process.execPath}" node_modules/next/dist/bin/next dev`,
    url: 'http://localhost:3000/access',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      MATHS_GAME_DB_FILE: ':memory:',
      OFFLINE_PROTOCOL_V2_ENABLED: '1',
      APP_ORIGIN: 'http://localhost:3000',
      APP_SESSION_SECRET_CURRENT: 'e2e-session-secret-with-at-least-thirty-two-bytes',
      APP_ACCESS_PIN_HASH: 'scrypt$v=1$N=16384,r=8,p=1$CmO5D6zhaeWjWLkyuNBXgw$V1f-JtGInwY1cCau3S2iS1PdwC2Uo_2XdYCgdqdyZQs',
      PARENT_PASSWORD_HASH: 'scrypt$v=1$N=16384,r=8,p=1$vPQPNlFVAOE0K4jvsgU2eQ$Fj3ktEJSm6cG_BI2gTvaBAd36_36pbx7ke8Ewg6j86c'
    }
  }
});
