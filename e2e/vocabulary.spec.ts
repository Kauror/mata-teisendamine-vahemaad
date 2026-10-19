import { expect, test, type Page } from './test';
import { authenticateFamily } from './auth';
import { navigateStable } from './navigation';

// The English vocabulary module end to end, on the real screens: the parent
// enables it, imports a textbook-shaped CSV and publishes; Kiur studies with
// buttons, the keyboard and a real swipe, survives a reload, fails a test round,
// corrects it, passes, opens the next unit and practises the missed word.
//
// Both browser projects share one database, so each project imports its own
// unit numbers and opens its first unit by hand.

const WORDS = [
  { english: 'cat', estonian: 'kass', pronunciation: '/kæt/' },
  { english: 'dog', estonian: 'koer', pronunciation: '/dɒɡ/' },
  { english: 'house', estonian: 'maja', pronunciation: '/haʊs/' }
];

function csvFor(first: number) {
  return [
    'English,Pronunciation,Estonian',
    `UNIT ${first}  |   Animals,,`,
    ...WORDS.map((word) => `${word.english},${word.pronunciation},${word.estonian}`),
    `UNIT ${first + 1}  |   School,,`,
    'school,/skuːl/,kool',
    'book,/bʊk/,raamat'
  ].join('\n');
}

function englishFor(estonian: string) {
  const word = WORDS.find((item) => item.estonian === estonian);
  if (!word) throw new Error(`unknown prompt ${estonian}`);
  return word.english;
}

async function signInAsParent(page: Page) {
  // Halda opens on its exercise list; the vocabulary is under Õppesisu.
  await navigateStable(page, '/vanem/halda?tab=harjutused');
  const password = page.getByLabel('Sisesta parool');
  if (await password.count() > 0) {
    await password.click();
    await password.pressSequentially('e2e-parent-password');
    await page.getByRole('button', { name: 'Sisene' }).click();
  }
  await expect(page.locator('.learning-compact-row').first()).toBeVisible();
}

async function openVocabularyAdmin(page: Page) {
  await page.getByRole('button', { name: 'Õppesisu', exact: true }).click();
  await page.getByRole('button', { name: /Inglise keele sõnavara/ }).click();
}

function unitRow(page: Page, unitNumber: number) {
  return page.locator('.vocab-admin-unit').filter({ has: page.locator('strong', { hasText: new RegExp(`^Unit ${unitNumber} `) }) });
}

// The prompt of the word now waiting for an answer. "Kontrolli" replaces
// "Edasi" in the same render as the next word arrives, so waiting for it
// guarantees the prompt is not the previous word's.
async function promptText(page: Page) {
  await expect(page.getByRole('button', { name: 'Kontrolli' })).toBeVisible();
  return (await page.locator('.vocab-prompt-word').textContent())?.trim() ?? '';
}

test('parent imports units and Kiur studies, tests, passes and practises', async ({ page, browserName }) => {
  test.setTimeout(150_000);
  const first = browserName === 'webkit' ? 201 : 101;

  await authenticateFamily(page);
  await signInAsParent(page);

  // Enable the exercise for Kiur. It starts hidden.
  const libraryRow = page.locator('.learning-learner-group').filter({ hasText: 'Kiur' }).locator('.learning-compact-row').filter({ hasText: 'Sõnavara' });
  await libraryRow.getByRole('button', { name: 'Püsiv' }).click();
  await expect(libraryRow.getByRole('button', { name: 'Püsiv' })).toHaveAttribute('aria-pressed', 'true');

  // Import: the layout is recognised without touching the mapping.
  await openVocabularyAdmin(page);
  await page.locator('input[type="file"][accept*=".xlsx"]').setInputFiles({ name: 'sonad.csv', mimeType: 'text/csv', buffer: Buffer.from(csvFor(first), 'utf8') });
  await expect(page.getByLabel(/Õppetükke alustavad pealkirjaread/)).toBeChecked();
  await page.getByRole('button', { name: 'Kontrolli' }).click();
  await expect(page.getByRole('cell', { name: new RegExp(`^Unit ${first} — Animals`) })).toBeVisible();
  // Collapsing the section keeps the import in progress.
  await page.getByRole('button', { name: /Inglise keele sõnavara/ }).click();
  await page.getByRole('button', { name: /Inglise keele sõnavara/ }).click();
  await expect(page.getByRole('cell', { name: new RegExp(`^Unit ${first} — Animals`) })).toBeVisible();
  await page.getByRole('button', { name: 'Impordi' }).click();
  await expect(unitRow(page, first)).toBeVisible();
  await expect(unitRow(page, first).getByText('Avaldamata')).toBeVisible();

  // Publish both and open the first by hand.
  for (const unitNumber of [first, first + 1]) {
    await unitRow(page, unitNumber).getByRole('button', { name: 'Avalda' }).click();
    await expect(unitRow(page, unitNumber).getByText('Avaldatud', { exact: true })).toBeVisible();
  }
  await unitRow(page, first).getByRole('button', { name: 'Ava käsitsi' }).click();
  await expect(unitRow(page, first).getByText('Käsitsi avatud')).toBeVisible();

  const overview = await page.request.get('/api/parent/english-vocabulary');
  const units = (await overview.json() as { units: Array<{ id: string; unitNumber: number }> }).units;
  const firstId = units.find((unit) => unit.unitNumber === first)!.id;
  const secondId = units.find((unit) => unit.unitNumber === first + 1)!.id;

  // Peeking is read-only for the child's data, so act as Kiur the way a parent
  // would: the banner's "Vaata nagu laps" sets this browser-session cookie.
  await page.context().addCookies([{ name: 'harjutaja_peek_off', value: '1', url: new URL(page.url()).origin }]);

  // The child's list: the second unit is locked and says why.
  await navigateStable(page, '/kiur/inglise-keel');
  const firstCard = page.locator('.vocab-unit-card').filter({ hasText: `Unit ${first} — Animals` });
  const secondCard = page.locator('.vocab-unit-card').filter({ hasText: `Unit ${first + 1} — School` });
  await expect(firstCard.getByText('3 sõna')).toBeVisible();
  await expect(secondCard.getByText('🔒 Lukus')).toBeVisible();
  await expect(secondCard.getByText(`Avaneb, kui eelmise õppetüki (Unit ${first} — Animals) test on läbitud.`)).toBeVisible();
  await expect(page.getByRole('link', { name: /Sprint/ })).toHaveAttribute('href', '/kiur/inglise-keel/sprint');

  // A locked unit cannot be opened by URL either.
  await navigateStable(page, `/kiur/inglise-keel/${secondId}/opi`);
  await expect(page.locator('.vocab-problem[role="alert"]')).toContainText('See õppetükk on veel lukus.');

  // Study. The assessment buttons wait until the card is revealed.
  await navigateStable(page, `/kiur/inglise-keel/${firstId}/opi`);
  const known = page.getByRole('button', { name: /Teadsin/ });
  const unknown = page.getByRole('button', { name: /Ei teadnud/ });
  await expect(page.locator('.vocab-card[data-flipped="false"] .vocab-card-front .vocab-card-word')).toBeVisible();
  await expect(known).toBeDisabled();

  // Card 1: tap, then "Ei teadnud".
  const card = page.locator('.vocab-card');
  await card.click();
  await expect(card).toHaveAttribute('data-flipped', 'true');
  await expect(page.locator('.vocab-card-pronunciation')).toBeVisible();
  await unknown.click();
  await expect(card).toHaveAttribute('data-flipped', 'false');

  // The session survives a reload: same place, nothing lost.
  await expect(page).toHaveURL(/session=vs_/u);
  await page.reload();
  await expect(page.locator('.vocab-card[data-flipped="false"] .vocab-card-front .vocab-card-word')).toBeVisible();

  // The connection drops while turning a card: the error offers a retry, and
  // the retry really continues once the connection is back.
  await page.context().setOffline(true);
  await card.click();
  await expect(page.locator('.vocab-problem')).toContainText('internetiühendust', { timeout: 15_000 });
  await page.context().setOffline(false);
  await page.getByRole('button', { name: 'Proovi uuesti' }).click();
  await expect(card).toBeVisible();
  await expect(page.locator('.vocab-problem')).toHaveCount(0);

  // Card 2: the keyboard.
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('Space');
  await expect(card).toHaveAttribute('data-flipped', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(card).toHaveAttribute('data-flipped', 'false');

  // Card 3: a short drag does nothing; a deliberate swipe right answers.
  await card.click();
  await expect(card).toHaveAttribute('data-flipped', 'true');
  const box = (await card.boundingBox())!;
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width / 2, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 30, y, { steps: 5 });
  await page.mouse.up();
  await expect(card).toHaveAttribute('data-flipped', 'true');
  await page.mouse.move(box.x + box.width / 2, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 260, y, { steps: 12 });
  await page.mouse.up();
  await expect(card).toHaveAttribute('data-flipped', 'false');

  // The missed card comes back as the last card. "Ei teadnud" again brings the
  // same card straight back — it must still be answerable (this used to lock
  // both buttons until a reload).
  await card.click();
  await expect(card).toHaveAttribute('data-flipped', 'true');
  await unknown.click();
  await expect(card).toHaveAttribute('data-flipped', 'false');
  await card.click();
  await expect(card).toHaveAttribute('data-flipped', 'true');
  await expect(known).toBeEnabled();
  await expect(unknown).toBeEnabled();
  await known.click();
  await expect(page.getByRole('heading', { name: 'Õppimine lõpetatud' })).toBeVisible();
  await expect(page.getByText('Esimesel korral teadsid:')).toContainText('2/3');
  await expect(page.getByText('Kordamist vajas:')).toContainText('1 sõna');

  // Test round 1: one wrong → 2/3 fails (3/3 is needed).
  await page.getByRole('link', { name: 'Tee test' }).click();
  const input = page.getByLabel('Kirjuta inglise keeles');
  await expect(input).toHaveAttribute('spellcheck', 'false');
  await expect(input).toHaveAttribute('autocomplete', 'off');
  const missed = await promptText(page);
  await input.fill('kat');
  await page.getByRole('button', { name: 'Kontrolli' }).click();
  await expect(page.getByText('Vastus vajab kordamist')).toBeVisible();
  await expect(page.getByText('Õige vastus:')).toContainText(englishFor(missed));
  await page.getByRole('button', { name: 'Edasi' }).click();
  for (let index = 0; index < 2; index += 1) {
    await input.fill(`  ${englishFor(await promptText(page)).toUpperCase()} `);
    await input.press('Enter');
    await expect(page.getByText('✓ Õige')).toBeVisible();
    // Focus stays in the answer field (keeps the phone keyboard open); Enter continues.
    await expect(input).toBeFocused();
    await page.keyboard.press('Enter');
  }
  await expect(page.getByRole('heading', { name: '2/3 õigesti' })).toBeVisible();
  await expect(page.getByText('Kordame kõigepealt 1 sõna.')).toBeVisible();
  await expect(page.getByText('Seejärel proovid kõiki 3 sõna uuesti.')).toBeVisible();

  // Correction: wrong again, so it is asked again, then right.
  await page.getByRole('button', { name: 'Alusta kordamist' }).click();
  await expect(page.getByRole('heading', { name: 'Parandamine' })).toBeVisible();
  expect(await promptText(page)).toBe(missed);
  await input.fill('nope');
  await input.press('Enter');
  await page.getByRole('button', { name: 'Edasi' }).click();
  expect(await promptText(page)).toBe(missed);
  await input.fill(englishFor(missed));
  await input.press('Enter');
  await page.getByRole('button', { name: 'Edasi' }).click();
  await expect(page.getByRole('heading', { name: 'Parandused tehtud!' })).toBeVisible();

  // Round 2: all three words again, all right → passed.
  await page.getByRole('button', { name: 'Alusta testi' }).click();
  for (let index = 0; index < 3; index += 1) {
    await input.fill(englishFor(await promptText(page)));
    await input.press('Enter');
    await page.getByRole('button', { name: 'Edasi' }).click();
  }
  await expect(page.getByRole('heading', { name: 'Test läbitud!' })).toBeVisible();
  await expect(page.getByText('3/3 õigesti — 100%')).toBeVisible();
  await expect(page.getByText(`Unit ${first} — Animals on läbitud.`)).toBeVisible();
  await expect(page.getByText(`Unit ${first + 1} — School on nüüd avatud.`)).toBeVisible();

  // Back on the list: passed, the next unit open, the missed word waiting.
  await page.getByRole('link', { name: 'Tagasi õppetükkide juurde' }).click();
  await expect(firstCard.getByText('✓ Läbitud')).toBeVisible();
  await expect(secondCard.getByText('Uus')).toBeVisible();
  await expect(firstCard.getByRole('link', { name: 'Tee test uuesti' })).toBeVisible();

  await firstCard.getByRole('link', { name: 'Korda eksitud sõnu' }).click();
  await expect(page.getByRole('heading', { name: 'Korda eksitud sõnu' })).toBeVisible();
  expect(await promptText(page)).toBe(missed);
  await input.fill(englishFor(missed));
  await input.press('Enter');
  await page.getByRole('button', { name: 'Edasi' }).click();
  await expect(page.getByRole('heading', { name: 'Kordamine tehtud!' })).toBeVisible();

  // The parent sees the result.
  await signInAsParent(page);
  await openVocabularyAdmin(page);
  await expect(unitRow(page, first).getByText(/^Läbitud /)).toBeVisible();
  await expect(unitRow(page, first).locator('dd').filter({ hasText: '2/3 (66%)' })).toBeVisible();
});

test('vocabulary admin endpoints refuse a family session without the parent', async ({ page }) => {
  await authenticateFamily(page);
  expect((await page.request.get('/api/parent/english-vocabulary')).status()).toBe(401);
  const mutation = await page.request.post('/api/parent/english-vocabulary/units', {
    data: { unitNumber: 900, title: 'x' },
    headers: { origin: 'http://localhost:3000' }
  });
  expect(mutation.status()).toBe(401);
});
