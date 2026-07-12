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
  workers: process.env.CI ? 1 : undefined,
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
    command: 'npm run dev',
    url: 'http://localhost:3000/access',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      MATHS_GAME_DB_FILE: ':memory:',
      OFFLINE_PROTOCOL_V2_ENABLED: '1',
      APP_ORIGIN: 'http://localhost:3000'
    }
  }
});
