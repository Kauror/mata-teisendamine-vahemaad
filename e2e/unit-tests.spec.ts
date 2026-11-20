import { readFileSync } from 'node:fs';
import Database from 'better-sqlite3';
import { expect, test, type Page } from './test';
import { authenticateFamily } from './auth';
import { E2E_DB_FILE } from './config';
import { navigateStable } from './navigation';
import { sampleUnitTest } from '../src/lib/unitTests/fixture';

// English unit tests (lisatestid) end to end: the parent imports a test, Kiur
// (whose words test for the unit is passed) answers every exercise type —
// choice, typed, word order and the crossword grid — and hands it in; the
// parent marks the open answer and approves; Kiur sees the grade.
//
// UT_CONTENT_FILE swaps in another content file (a real workbook test kept
// outside the repository) and UT_SCREENSHOT_DIR saves phone-sized pictures.

type Content = ReturnType<typeof sampleUnitTest> & { exercises: Array<Record<string, unknown>> };

function content(unitNumber: number): Content {
  const file = process.env.UT_CONTENT_FILE;
  const data = (file ? JSON.parse(readFileSync(file, 'utf8')) : sampleUnitTest()) as Content;
  return { ...data, unit: unitNumber, variant: 'A' };
}

async function shot(page: Page, name: string) {
  const dir = process.env.UT_SCREENSHOT_DIR;
  if (dir) await page.screenshot({ path: `${dir}/${name}.png`, fullPage: true });
}

async function signInAsParent(page: Page) {
  await navigateStable(page, '/vanem/halda?tab=harjutused');
  const password = page.getByLabel('Sisesta parool');
  if (await password.count() > 0) {
    await password.click();
    await password.pressSequentially('e2e-parent-password');
    await page.getByRole('button', { name: 'Sisene' }).click();
  }
  await expect(page.locator('.learning-compact-row').first()).toBeVisible();
}

async function parentApi(page: Page, url: string, method: string, body: unknown) {
  return page.evaluate(async ({ url, method, body }) => {
    const token = decodeURIComponent(document.cookie.split('; ').find((item) => item.startsWith('parent_csrf='))?.split('=')[1] ?? '');
    const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'x-csrf-token': token }, body: JSON.stringify(body) });
    return { status: response.status, body: await response.json() };
  }, { url, method, body });
}

const words = (value: string) => value.toLowerCase().replace(/[.!?,]/g, ' ').split(/\s+/).filter(Boolean);

// Fills the sheet with the content's own answers.
async function answerAll(page: Page, data: Content) {
  for (const exercise of data.exercises) {
    const section = page.locator(`section[aria-labelledby="ut-ex-${exercise.id}"]`);
    if (exercise.type === 'crossword') {
      for (const entry of exercise.entries as Array<{ answer: string; row: number; col: number; dir: string }>) {
        for (let i = 0; i < entry.answer.length; i += 1) {
          const row = entry.row + (entry.dir === 'down' ? i : 0);
          const col = entry.col + (entry.dir === 'across' ? i : 0);
          await section.locator(`[data-cell="${row},${col}"] input`).fill(entry.answer[i]);
        }
      }
      continue;
    }
    const items = exercise.items as Array<Record<string, unknown>>;
    for (const [index, item] of items.entries()) {
      if (item.example) continue;
      const row = section.locator('ol.ut-items > li').nth(index);
      if (exercise.type === 'choice') {
        await row.getByRole('button', { name: String(item.answer), exact: true }).click();
      } else if (exercise.type === 'order') {
        const tokens = item.tokens as string[];
        let rest = words((item.answers as string[])[0]);
        const used = new Set<number>();
        while (rest.length > 0) {
          const next = tokens.findIndex((token, i) => !used.has(i) && words(token).every((word, w) => rest[w] === word));
          if (next < 0) throw new Error(`cannot build ${item.answers}`);
          used.add(next);
          rest = rest.slice(words(tokens[next]).length);
          await row.locator('.ut-tokens').getByRole('button', { name: tokens[next], exact: true }).first().click();
        }
      } else {
        const answers = item.answers as string[][];
        const inputs = row.locator('input');
        for (let field = 0; field < answers.length; field += 1) await inputs.nth(field).fill(answers[field][0] ?? 'I go to school.');
      }
    }
  }
}

test('parent imports a unit test, Kiur answers and hands it in, parent approves', async ({ page, browserName }) => {
  test.setTimeout(150_000);
  const unitNumber = browserName === 'webkit' ? 402 : 401;
  const data = content(unitNumber);

  await authenticateFamily(page);
  await signInAsParent(page);
  const libraryRow = page.locator('.learning-learner-group').filter({ hasText: 'Kiur' }).locator('.learning-compact-row').filter({ hasText: 'Sõnavara' });
  await libraryRow.getByRole('button', { name: 'Püsiv' }).click();
  await expect(libraryRow.getByRole('button', { name: 'Püsiv' })).toHaveAttribute('aria-pressed', 'true');

  // A published words unit whose words test Kiur has already passed.
  const created = await parentApi(page, '/api/parent/english-vocabulary/units', 'POST', { unitNumber, title: 'Lisatesti teema' });
  expect(created.status).toBe(201);
  const unitId = created.body.unit.id as string;
  expect((await parentApi(page, `/api/parent/english-vocabulary/units/${unitId}/words`, 'POST', { estonian: 'kass', english: 'cat', pronunciation: '' })).status).toBeLessThan(300);
  expect((await parentApi(page, `/api/parent/english-vocabulary/units/${unitId}`, 'PATCH', { published: true })).status).toBe(200);
  const sqlite = new Database(E2E_DB_FILE);
  const now = new Date().toISOString();
  sqlite.prepare('INSERT INTO english_vocab_progress (learner, unitId, studyCompletedAt, testPassedAt, manualUnlock, updatedAt) VALUES (?, ?, ?, ?, 1, ?)').run('kiur', unitId, now, now, now);
  sqlite.close();

  // The parent imports the test in Halda → Õppesisu.
  await page.getByRole('button', { name: 'Õppesisu', exact: true }).click();
  await page.getByRole('button', { name: /Inglise keele lisatestid/ }).click();
  await page.locator('input[type="file"][accept*=".json"]').setInputFiles({ name: `unit${unitNumber}-A.json`, mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data), 'utf8') });
  await expect(page.locator('.ut-report')).toContainText(`Unit ${unitNumber}A`);

  // Kiur, as the child (not peeking), opens it from the unit card.
  await page.context().addCookies([{ name: 'harjutaja_peek_off', value: '1', url: new URL(page.url()).origin }]);
  await page.setViewportSize({ width: 360, height: 800 });
  await navigateStable(page, '/kiur/inglise-keel');
  await page.getByRole('link', { name: 'Tee lisatest' }).first().click();
  await expect(page.getByRole('heading', { name: new RegExp(`Lisatest: ${data.title}`) })).toBeVisible();
  await shot(page, `${browserName}-1-child-empty`);
  await answerAll(page, data);
  await expect(page.getByText('✓ Salvestatud')).toBeVisible({ timeout: 10_000 });
  await shot(page, `${browserName}-2-child-filled`);

  // A reload keeps the saved answers.
  await page.reload();
  await expect(page.locator('.ut-option[aria-pressed="true"]').first()).toBeVisible();

  await page.getByRole('button', { name: 'Anna test ära' }).click();
  await page.getByRole('button', { name: 'Jah, annan ära' }).click();
  await expect(page.getByText('Test on ära antud.')).toBeVisible();

  // The parent finds it on Täna, marks what is open and approves.
  await page.context().clearCookies({ name: 'harjutaja_peek_off' });
  await navigateStable(page, '/vanem');
  await page.locator('.pv-ask').filter({ hasText: `Unit ${unitNumber}` }).getByRole('link', { name: 'Vaata üle' }).click();
  await expect(page.getByRole('heading', { name: /Lisatest: Unit/ })).toBeVisible();
  // "Only what to check" hides every answer already marked right.
  const allBars = await page.locator('.ut-markbar').count();
  await page.getByRole('button', { name: /Näita ainult/ }).click();
  await expect.poll(() => page.locator('.ut-markbar:visible').count()).toBeLessThan(allBars);
  await page.getByRole('button', { name: 'Näita kõiki vastuseid' }).click();
  for (const bar of await page.locator('.ut-markbar').all()) {
    if (await bar.locator('[aria-pressed="true"]').count() === 0) await bar.getByRole('button', { name: 'Õige', exact: true }).click();
  }
  await shot(page, `${browserName}-3-parent-review`);
  await page.getByRole('button', { name: /^Kinnita/ }).click();
  await expect(page.getByText('Test on kinnitatud.')).toBeVisible();

  // Kiur sees the grade.
  await page.context().addCookies([{ name: 'harjutaja_peek_off', value: '1', url: new URL(page.url()).origin }]);
  await navigateStable(page, '/kiur/inglise-keel');
  await page.getByRole('link', { name: /Lisatest: hinne 5/ }).first().click();
  await expect(page.locator('.ut-grade strong')).toHaveText('5');
  await shot(page, `${browserName}-4-child-graded`);
});
