import { expect, test, type Page } from './test';
import { authenticateFamilyWithCatalogue } from './auth';
import { navigateStable } from './navigation';

// UI evidence for the audit changes. Each test drives the real screen the
// change was made on, rather than the module underneath it.

const SCIENCE_TITLE = 'Loodusõpetus';

// The parent session outlives a navigation, so this has to cope with arriving
// already logged in — the second visit in a test never shows the form.
async function openParentLibrary(page: Page) {
  await navigateStable(page, '/vanem');
  const password = page.getByLabel('Sisesta parool');
  if (await password.count() > 0) {
    await password.click();
    await password.pressSequentially('e2e-parent-password');
    const dashboardLoaded = page.waitForResponse((response) => response.url().endsWith('/api/parent/dashboard') && response.ok());
    await page.getByRole('button', { name: 'Sisene' }).click();
    await dashboardLoaded;
  }

  const library = page.getByRole('button', { name: /Harjutuste kogu/ });
  await expect(library).toBeVisible();
  if (await library.getAttribute('aria-expanded') !== 'true') await library.click();
  await expect(page.locator('.learning-compact-row').first()).toBeVisible();
}

function scienceRows(page: Page) {
  return page.locator('.learning-compact-row').filter({ has: page.locator('strong', { hasText: SCIENCE_TITLE }) });
}

// Publishes or unpublishes a textbook unit through the parent API (the parent
// session from openParentLibrary supplies the CSRF cookie).
async function setUnitPublished(page: Page, unitId: string, published: boolean) {
  const cookies = await page.context().cookies();
  const token = cookies.find((cookie) => cookie.name === 'parent_csrf')?.value ?? '';
  const response = await page.request.post(`/api/parent/textbook/courses/loodusopetus-opik/units/${unitId}/publish`, {
    headers: { 'content-type': 'application/json', origin: 'http://localhost:3000', 'x-csrf-token': decodeURIComponent(token) },
    data: { actionId: `e2e${Date.now().toString(36)}x${Math.random().toString(36).slice(2, 8)}`, published }
  });
  expect(response.ok(), await response.text()).toBe(true);
}

test.beforeEach(async ({ page }) => authenticateFamilyWithCatalogue(page));

test('the home leaderboard counts exercises, in Estonian, from the authoritative standings', async ({ page }) => {
  await navigateStable(page, '/');

  const standings = await page.evaluate(async () => {
    const board = await fetch('/api/leaderboard').then((response) => response.json()) as {
      days?: Array<{ date: string; kiurCount: number; kirsiCount: number }>;
    };
    const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Tallinn' });
    const row = board.days?.find((day) => day.date === today);
    return { kiur: row?.kiurCount ?? 0, kirsi: row?.kirsiCount ?? 0 };
  });

  // The label must agree with the stored row that awards the karikas, and must
  // say "harjutus"/"harjutust" — these are attempts, not questions.
  const counts = page.locator('.leaderboard-count');
  await expect(counts).toHaveCount(2);
  const word = (value: number) => value === 1 ? 'harjutus' : 'harjutust';
  await expect(counts.nth(0)).toHaveText(`${standings.kiur} ${word(standings.kiur)}`);
  await expect(counts.nth(1)).toHaveText(`${standings.kirsi} ${word(standings.kirsi)}`);
  await expect(page.locator('.leaderboard-count', { hasText: 'ülesannet' })).toHaveCount(0);
});

test('the parent library no longer offers the archived mixed Loodusõpetus exercise', async ({ page }) => {
  await openParentLibrary(page);
  // Archived (FIXED_CHILD_EXERCISES): it cannot be put back into Kiur's rotation.
  await expect(scienceRows(page)).toHaveCount(0);
});

test('Kiur gets one Loodusõpetus card, to the textbook, only while a unit is published', async ({ page }) => {
  test.setTimeout(90_000);
  const scienceCards = () => page.locator('.child-exercise-card').filter({ hasText: SCIENCE_TITLE });

  await navigateStable(page, '/kiur');
  await expect(page.locator('.child-exercise-card[href^="/opi/loodusopetus"]')).toHaveCount(0);
  await expect(scienceCards()).toHaveCount(0);

  await openParentLibrary(page);
  await setUnitPublished(page, 'lo-opik-u10', true);
  try {
    await navigateStable(page, '/kiur');
    await expect(scienceCards()).toHaveCount(1);
    await expect(scienceCards()).toHaveAttribute('href', '/kiur/loodusopetus');

    await scienceCards().click();
    await expect(page).toHaveURL(/\/kiur\/loodusopetus$/);
    await expect(page.getByRole('heading', { name: /Loodusõpetus/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Alusta harjutust/ })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Õpiku õppetükid/ })).toHaveAttribute('href', '/kiur/loodusopetus/opik');
  } finally {
    await setUnitPublished(page, 'lo-opik-u10', false);
  }

  await navigateStable(page, '/kiur');
  await expect(scienceCards()).toHaveCount(0);
});