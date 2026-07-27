import { defineConfig, devices } from '@playwright/test';
import { AUDIT_ORIGIN } from './e2e-audit/config';

export default defineConfig({
  testDir: './e2e-audit',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  globalSetup: './e2e-audit/global-setup.ts',
  outputDir: 'test-results/ui-content-audit',
  use: {
    baseURL: AUDIT_ORIGIN,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'audit-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'audit-webkit', use: { ...devices['Desktop Safari'] } }
  ]
});
