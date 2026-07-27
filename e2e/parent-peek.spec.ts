import { expect, test, type Page } from './test';
import { authenticateFamily } from './auth';
import { navigateStable } from './navigation';

// Peek mode: a parent checking a child's screen must not consume the one-shot
// notifications waiting there. The rule only exists in the browser — cookie,
// localStorage, hydration — so it is asserted on the real screen.

const RECAP_KEY_KIUR = 'harjutaja:points-recap:kiur';

async function signInAsParent(page: Page) {
  await navigateStable(page, '/vanem');
  const password = page.getByLabel('Sisesta parool');
  if (await password.count() > 0) {
    await password.click();
    await password.pressSequentially('e2e-parent-password');
    const dashboardLoaded = page.waitForResponse((response) => response.url().endsWith('/api/parent/dashboard') && response.ok());
    await page.getByRole('button', { name: 'Sisene' }).click();
    await dashboardLoaded;
  }
  // Let the parent hub finish rendering before navigating away. Leaving while
  // `next dev` is still streaming it aborts the page's HMR chunk request, which
  // surfaces as an unhandled ChunkLoadError in WebKit.
  await expect(page.getByRole('button', { name: /Harjutuste kogu/ })).toBeVisible();
}

function recapDialog(page: Page) {
  return page.locator('.points-recap');
}

function peekBanner(page: Page) {
  return page.locator('.peek-banner');
}

// "Opening the page again" — a reload rather than a second goto to the same
// route, which under `next dev` races the compiler and drops HMR chunks.
async function reopenPage(page: Page) {
  await page.reload();
}

async function readRecapMarker(page: Page) {
  return page.evaluate((key) => window.localStorage.getItem(key), RECAP_KEY_KIUR);
}

// Dismisses whatever recap branch is showing — the button label depends on
// whether the child earned anything yesterday.
async function dismissRecap(page: Page) {
  await expect(recapDialog(page)).toBeVisible();
  await recapDialog(page).getByRole('button').click();
  await expect(recapDialog(page)).toBeHidden();
}

test.beforeEach(async ({ page }) => authenticateFamily(page));

test('a child dismissing the recap spends it, and sees no parent banner', async ({ page }) => {
  await navigateStable(page, '/kiur');

  // Wait for the recap before asserting the banner's absence: both are decided
  // after hydration, so a premature "no banner" would pass even if broken.
  await expect(recapDialog(page)).toBeVisible();
  await expect(peekBanner(page)).toHaveCount(0);
  expect(await readRecapMarker(page)).toBeNull();

  await dismissRecap(page);
  expect(await readRecapMarker(page)).not.toBeNull();

  // Spent: it does not come back for the child on this device.
  await reopenPage(page);
  await expect(recapDialog(page)).toHaveCount(0);
});

test('a signed-in parent is told they are peeking, and leaves the recap unspent', async ({ page }) => {
  await signInAsParent(page);
  await navigateStable(page, '/kirsi');

  await expect(peekBanner(page)).toContainText('Vanema vaatlusrežiim');

  // The parent can read and close the recap; the marker must stay untouched, so
  // the child still gets it the next time they open their page.
  const key = 'harjutaja:points-recap:kirsi';
  await dismissRecap(page);
  expect(await page.evaluate((storageKey) => window.localStorage.getItem(storageKey), key)).toBeNull();

  await reopenPage(page);
  await expect(recapDialog(page)).toBeVisible();
});

test('the parent can drop into the child view and back, and only then spends the notice', async ({ page }) => {
  await signInAsParent(page);
  await navigateStable(page, '/kiur');
  await expect(peekBanner(page)).toContainText('Vanema vaatlusrežiim');

  // The recap modal covers the banner, so clear it first — as the parent, which
  // must leave it unspent.
  await dismissRecap(page);
  expect(await readRecapMarker(page)).toBeNull();

  await page.getByRole('button', { name: 'Vaata nagu laps' }).click();
  await expect(peekBanner(page)).toContainText('Vaatad nagu laps');

  // The opt-out survives the navigation, so this second dismissal is the child's
  // and does spend the notice.
  await reopenPage(page);
  await expect(peekBanner(page)).toContainText('Vaatad nagu laps');
  await dismissRecap(page);
  expect(await readRecapMarker(page)).not.toBeNull();

  await page.getByRole('button', { name: 'Tagasi vaatlusesse' }).click();
  await expect(peekBanner(page)).toContainText('Vanema vaatlusrežiim');
});
