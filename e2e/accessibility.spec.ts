import { expect, test, type Page } from './test';
import { authenticateFamily } from './auth';
import { navigateStable } from './navigation';

test.beforeEach(async ({ page }) => authenticateFamily(page));

test('dashboard has semantic independent links with keyboard focus and mobile touch targets', async ({ page }) => {
  await expect(page.locator('.child-dashboard-card [role="button"]')).toHaveCount(0);
  await expect(page.locator('a button, button a, a a, button button')).toHaveCount(0);

  const primary = page.getByRole('link', { name: 'Ava harjutused' }).first();
  await primary.focus();
  await expect(primary).toBeFocused();
  expect(await primary.evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe('none');
  await primary.press('Enter');
  await expect(page).toHaveURL(/\/kiur$/);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const primaryBox = await page.getByRole('link', { name: 'Ava harjutused' }).first().boundingBox();
  const historyBox = await page.getByRole('link', { name: 'Ajalugu', exact: true }).boundingBox();
  expect(primaryBox?.height).toBeGreaterThanOrEqual(44);
  expect(historyBox?.height).toBeGreaterThanOrEqual(44);
});

test('dashboard metrics explain their live values on focus and tap', async ({ page }) => {
  const firstChild = page.locator('.child-dashboard-card').first();
  const streak = firstChild.locator('.streak-badge');
  const streakTooltip = streak.locator('xpath=following-sibling::*[@role="tooltip"]');

  // Asserted by shape, not by value; both the singular and partitive forms are
  // accepted because the count is whatever earlier specs left behind. The suite shares one database across both
  // browser projects, so whatever another spec practised is already counted
  // here; what this test is about is that the label is built from the live
  // number and that the tooltip appears on focus and on tap.
  await expect(streak).toHaveAccessibleName(/^Oled \d+ (päev|päeva) järjest harjutanud\.$/);
  await expect(streakTooltip).toBeHidden();
  await streak.focus();
  await expect(streakTooltip).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  const stars = firstChild.locator('.stars-badge');
  const starsTooltip = stars.locator('xpath=following-sibling::*[@role="tooltip"]');
  await stars.click();
  await expect(starsTooltip).toBeVisible();

  await navigateStable(page, '/kiur');
  const achievements = page.locator('.achievement-badge');
  await expect(achievements).toHaveCount(3);
  // The badge caption is now a shortened title, a bare "1/7" and no padlock, so
  // the accessible name has to carry the full title and the lock state itself
  // on top of the live count it always carried.
  await expect(achievements.nth(0)).toHaveAccessibleName(/^\d+ harjutust, \d+\/\d+, (tehtud|veel lukus)\. Sul on seni tehtud \d+ (harjutus|harjutust)\.$/);
  await expect(achievements.nth(1)).toHaveAccessibleName(/^Täna, \d+\/\d+, (tehtud|veel lukus)\. Täna oled teinud \d+ (harjutus|harjutust)\.$/);
  await expect(achievements.nth(2)).toHaveAccessibleName(/^Täiuslik nädal, \d+\/\d+, (tehtud|veel lukus)\. Sellel nädalal oled teinud \d+ (harjutus|harjutust)\.$/);
});

test('the child identity card keeps one row of achievements and 44px targets', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await navigateStable(page, '/kiur');
  await expect(page.locator('.achievement-badge')).toHaveCount(3);

  // Identity, points, shop/history and achievements are one card.
  const card = page.locator('.child-identity-card');
  await expect(card.locator('.child-home-avatar')).toHaveCount(1);
  await expect(card.locator('.daily-summary-metric')).not.toHaveCount(0);
  await expect(card.locator('.achievement-badge')).toHaveCount(3);

  // The saving comes from the achievements sharing a single row; wrapping would
  // give it straight back.
  const tops = await page.locator('.achievement-badge').evaluateAll(
    (nodes) => nodes.map((node) => Math.round(node.getBoundingClientRect().top))
  );
  expect(new Set(tops).size).toBe(1);

  // Every control in the card is small on purpose, so each one is checked
  // against the 44px floor including its transparent bleed.
  const targets = page.locator('.identity-action, .daily-summary-metric, .achievement-badge, .child-home-avatar');
  const boxes = await targets.evaluateAll((nodes) => nodes.map((node) => {
    const after = getComputedStyle(node, '::after');
    const bleed = (side: string) => {
      const value = parseFloat(after.getPropertyValue(side));
      return Number.isFinite(value) ? Math.max(-value, 0) : 0;
    };
    const rect = node.getBoundingClientRect();
    return {
      tag: node.className,
      height: rect.height + bleed('top') + bleed('bottom'),
      width: rect.width + bleed('left') + bleed('right')
    };
  }));
  expect(boxes.length).toBeGreaterThan(0);
  for (const box of boxes) {
    expect(box.height, `${box.tag} height`).toBeGreaterThanOrEqual(44);
    expect(box.width, `${box.tag} width`).toBeGreaterThanOrEqual(44);
  }
});

test('child-specific history selects the child and contains no destructive controls', async ({ page }) => {
  await navigateStable(page, '/history?child=kiur');
  await expect(page).toHaveURL(/\/history\?child=kiur$/);
  await expect(page.getByRole('button', { name: 'Kiur', exact: true })).toHaveClass(/active/);
  await expect(page.locator('.delete-button,.delete-text-button,.history-delete-all-link')).toHaveCount(0);
});

test('parent controls are keyboard-accessible after parent login', async ({ page }) => {
  await page.getByRole('link', { name: 'Lapsevanema ala' }).click();
  const password = page.getByLabel('Sisesta parool');
  await password.click();
  await password.pressSequentially('e2e-parent-password');
  await expect(password).toHaveValue('e2e-parent-password');
  const dashboardLoaded = page.waitForResponse((response) => response.url().endsWith('/api/parent/dashboard') && response.ok());
  await page.getByRole('button', { name: 'Sisene' }).click();
  await dashboardLoaded;
  const controls = page.getByRole('button', { name: /Tähed ja karikad/ });
  await expect(controls).toBeVisible();
  const initiallyExpanded = await controls.getAttribute('aria-expanded');
  await controls.focus();
  await controls.press('Enter');
  await expect(controls).toHaveAttribute('aria-expanded', initiallyExpanded === 'true' ? 'false' : 'true');
  await controls.press('Enter');
  await expect(controls).toHaveAttribute('aria-expanded', initiallyExpanded ?? 'false');
});
