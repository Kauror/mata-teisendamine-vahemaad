import { test, expect } from '../e2e/test';

// Runs against the real production build (next build + generated service worker)
// with a valid (injected) family session. These assert the pieces unit tests
// cannot: the generated worker artifact, that the production server accepts the
// signed session, and that the app registers the worker in production.
//
// The full all-or-nothing offline install + airplane-mode reload, and the iPhone
// Add-to-Home-Screen pass, remain a documented MANUAL gate (see README): they
// depend on every protected shell route caching and on real device behaviour.

test('serves the generated service worker artifact with the app-shell precache', async ({ page }) => {
  const response = await page.request.get('/sw.js');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type'] || '').toContain('javascript');
  const body = await response.text();
  // The generated worker embeds the shell routes, the static precache manifest,
  // the build id and the install-completion marker.
  expect(body).toContain('SHELL_ROUTES');
  expect(body).toContain('PRECACHE');
  expect(body).toContain('BUILD_ID');
  expect(body).toContain('installedAt');
  expect(body).toContain('/test');
  expect(body).toContain('/_next/');
});

test('the production server accepts the signed family session (no PIN redirect)', async ({ page }) => {
  // With a valid session cookie, a protected route must render rather than 302
  // to /access. This exercises the real production session verification.
  await page.goto('/');
  await expect(page).not.toHaveURL(/\/access$/);
  await expect(page.locator('body')).toBeVisible();
});

test('registers the service worker in the production build', async ({ page }) => {
  await page.goto('/');
  // The app registers the worker on non-/access routes in production. A
  // registration object exists as soon as register() is called, before the
  // all-or-nothing install finishes — enough to prove production wires it up.
  await expect
    .poll(async () => page.evaluate(async () => Boolean(await navigator.serviceWorker.getRegistration())), { timeout: 20_000 })
    .toBe(true);
});
