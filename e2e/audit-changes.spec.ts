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

function scienceRow(page: Page) {
  return page.locator('.learning-compact-row').filter({ has: page.locator('strong', { hasText: SCIENCE_TITLE }) }).first();
}

async function setScienceStatus(page: Page, label: 'Peidus' | 'Rotatsioon' | 'Püsiv') {
  const saved = page.waitForResponse((response) => response.url().endsWith('/api/parent/learning-exercises') && response.ok());
  await scienceRow(page).getByRole('button', { name: label, exact: true }).click();
  await saved;
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

test('the parent library names Loodusõpetus and can filter to it', async ({ page }) => {
  await openParentLibrary(page);

  const row = scienceRow(page);
  await expect(row).toBeVisible();
  // Used to render as " · segaharjutus" with no subject name at all, because
  // the screen kept its own subject union that lacked this subject.
  await expect(row.locator('.learning-compact-info span')).toHaveText(`${SCIENCE_TITLE} · segaharjutus`);

  const subjectFilter = page.getByLabel('Aine');
  await expect(subjectFilter.locator('option', { hasText: SCIENCE_TITLE })).toHaveCount(1);
  await subjectFilter.selectOption({ label: SCIENCE_TITLE });
  await expect(page.locator('.learning-compact-row')).toHaveCount(1);
  await expect(scienceRow(page)).toBeVisible();
});

test('hiding a permanent exercise removes its card from the child screen', async ({ page }) => {
  await navigateStable(page, '/kiur');
  const scienceCard = page.getByRole('link').filter({ hasText: SCIENCE_TITLE });
  await expect(scienceCard).toHaveCount(1);

  await openParentLibrary(page);
  await setScienceStatus(page, 'Peidus');

  // Before the fix the fixed card was merged back in unconditionally, so it
  // stayed on screen and led to an attempt withheld for parent review.
  await navigateStable(page, '/kiur');
  await expect(page.getByRole('link').filter({ hasText: SCIENCE_TITLE })).toHaveCount(0);

  await openParentLibrary(page);
  await setScienceStatus(page, 'Püsiv');
  await navigateStable(page, '/kiur');
  await expect(page.getByRole('link').filter({ hasText: SCIENCE_TITLE })).toHaveCount(1);
});
