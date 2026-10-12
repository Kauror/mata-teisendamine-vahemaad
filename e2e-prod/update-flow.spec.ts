import fs from 'node:fs';
import path from 'node:path';
import { test, expect, type Page } from '../e2e/test';

// "Uus versioon on saadaval" end to end on the real production build. Two
// deployments happen while the app is open in two tabs; one click must land
// on the newest build, every tab must follow it, and the notice must not come
// back. A deployment is simulated by changing the build id inside the served
// /sw.js — exactly what a new image does.

const SW_FILE = path.resolve('public/sw.js');

// The new id has exactly the old one's length: the production server may
// serve a public file with the size it saw at startup, and a longer file
// would arrive truncated.
function deploy(original: string, suffix: string) {
  const match = original.match(/const BUILD_ID = '([^']+)';/);
  if (!match) throw new Error('BUILD_ID not found in public/sw.js');
  const id = `${match[1].slice(0, -suffix.length)}${suffix}`;
  fs.writeFileSync(SW_FILE, original.replace(match[0], `const BUILD_ID = '${id}';`));
  return id;
}

// Ask the browser to look for a new worker; a check that races the file
// write simply runs again.
async function checkForUpdate(page: Page) {
  await expect.poll(() => page.evaluate(async () => {
    try {
      await (await navigator.serviceWorker.getRegistration())!.update();
      return true;
    } catch {
      return false;
    }
  }), { timeout: 30_000 }).toBe(true);
}

async function controlled(page: Page) {
  await expect.poll(() => page.evaluate(async () => Boolean((await navigator.serviceWorker.getRegistration())?.active)), { timeout: 30_000 }).toBe(true);
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)), { timeout: 30_000 }).toBe(true);
}

// The build id of the worker that controls the page, asked from the worker
// itself (it answers OFFLINE_STATUS_REQUEST with its BUILD_ID).
async function activeBuild(page: Page) {
  return page.evaluate(() => new Promise<string | null>((resolve) => {
    const controller = navigator.serviceWorker.controller;
    if (!controller) return resolve(null);
    const channel = new MessageChannel();
    const timer = setTimeout(() => resolve(null), 3000);
    channel.port1.onmessage = (event: MessageEvent<{ buildId?: string }>) => {
      clearTimeout(timer);
      resolve(event.data?.buildId ?? null);
    };
    controller.postMessage({ type: 'OFFLINE_STATUS_REQUEST', requestId: 'update-flow' }, [channel.port2]);
  }));
}

test('one update lands on the newest build, all tabs follow and the notice does not return', async ({ page, context }) => {
  test.setTimeout(240_000);
  const original = fs.readFileSync(SW_FILE, 'utf8');
  try {
    await page.goto('/');
    await controlled(page);

    const second = await context.newPage();
    await second.goto('/history');
    await controlled(second);
    await second.evaluate(() => { (window as unknown as { __beforeUpdate: boolean }).__beforeUpdate = true; });

    // Deployment 1: the open app finds it and offers it.
    deploy(original, 'v2');
    await checkForUpdate(page);
    const notice = page.locator('.offline-update-notice');
    await expect(notice).toContainText('Uus versioon on saadaval', { timeout: 60_000 });

    // Deployment 2 happens before anyone presses "Uuenda".
    const newest = deploy(original, 'v3');

    const reloaded = page.waitForEvent('load', { timeout: 90_000 });
    await notice.getByRole('button', { name: /Uuenda/ }).click();
    await reloaded;
    await controlled(page);

    // The page now runs the newest build, and the other tab followed by itself.
    await expect.poll(() => activeBuild(page), { timeout: 30_000 }).toBe(newest);
    await expect.poll(() => second.evaluate(() => (window as unknown as { __beforeUpdate?: boolean }).__beforeUpdate === true), { timeout: 30_000 }).toBe(false);

    // No second prompt after the reload, even after an explicit check.
    await checkForUpdate(page);
    await page.waitForTimeout(3000);
    await expect(page.locator('.offline-update-notice')).toHaveCount(0);
    await expect(second.locator('.offline-update-notice')).toHaveCount(0);
  } finally {
    fs.writeFileSync(SW_FILE, original);
  }
});
