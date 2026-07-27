import { expect, test } from '../e2e/test';
import {
  assertVisiblePageContract,
  authenticateFamilyWithCatalogue,
  dismissPointsRecap,
  gotoStable,
  recordRuntimeProblems
} from './helpers';

for (const learner of ['kiur', 'kirsi'] as const) {
  test(`every ${learner} exercise card opens a usable screen`, async ({ page, context }) => {
    await authenticateFamilyWithCatalogue(page);
    await gotoStable(page, `/${learner}`, 'load');
    await dismissPointsRecap(page);

    const cards = await page.locator('.child-exercise-card').evaluateAll((elements) =>
      elements.map((element) => ({
        title: element.querySelector('strong')?.textContent?.trim() ?? '',
        href: (element as HTMLAnchorElement).getAttribute('href') ?? ''
      }))
    );

    expect(cards.length).toBeGreaterThan(0);
    expect(new Set(cards.map((card) => card.title)).size).toBe(cards.length);
    expect(new Set(cards.map((card) => card.href)).size).toBe(cards.length);

    for (const card of cards) {
      await test.step(`${card.title} → ${card.href}`, async () => {
        expect(card.title).not.toBe('');
        expect(card.href).toMatch(/^\//);

        const probe = await context.newPage();
        const runtimeProblems = recordRuntimeProblems(probe);
        const response = await probe.goto(card.href, { waitUntil: 'domcontentloaded' });
        expect(response?.status() ?? 200).toBeLessThan(400);
        await expect(probe).not.toHaveURL(/\/access$/);
        await assertVisiblePageContract(probe);
        expect(runtimeProblems).toEqual([]);
        await probe.close();
      });
    }
  });
}

for (const study of [
  { path: '/opi/mootuhikud-pikkused', heading: 'Mõõtühikud', runner: /\/test/ },
  { path: '/opi/ring-ja-ringjoon', heading: 'Ring ja ringjoon', runner: /\/test/ },
  { path: '/opi/kellaaeg', heading: 'Kellaaeg', runner: /\/test/ },
  { path: '/opi/loodusopetus', heading: 'Loodusõpetus', runner: /\/kiur\/loodusopetus\/test/ }
]) {
  test(`${study.heading} study content opens its intended runner`, async ({ page }) => {
    await authenticateFamilyWithCatalogue(page);
    await gotoStable(page, study.path, 'load');
    await expect(page.getByRole('heading', { name: study.heading })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Õpi enne' })).toBeVisible();
    await assertVisiblePageContract(page);

    await page.getByRole('button', { name: 'Alusta harjutust' }).click();
    await expect(page).toHaveURL(study.runner);
    await expect(page.locator('h1.question-text')).toBeVisible();
    await assertVisiblePageContract(page);
  });
}
