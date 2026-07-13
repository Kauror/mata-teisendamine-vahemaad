import { expect, test, type Page } from './test';
import { generateKiurMathSession } from '../src/lib/exercises/kiurMath';

type Exercise = { id: string; subject: string; topic: string; category: string };
type StoredAttempt = { score: number; questions: Array<{ userAnswer: string; isCorrect: boolean }> };

async function authenticate(page: Page) {
  await page.goto('/access');
  await page.locator('form input').pressSequentially('e2e-family-passphrase');
  await page.getByRole('button', { name: 'Sisene' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => new Promise<boolean>((resolve) => {
    const open = indexedDB.open('harjutaja-offline');
    open.onerror = () => resolve(false);
    open.onsuccess = () => {
      if (!open.result.objectStoreNames.contains('catalogues') || !open.result.objectStoreNames.contains('catalogueGrants')) return resolve(false);
      const transaction = open.result.transaction(['catalogues', 'catalogueGrants']);
      const catalogue = transaction.objectStore('catalogues').get('kiur');
      const grant = transaction.objectStore('catalogueGrants').get('kiur');
      transaction.oncomplete = () => resolve(Boolean(catalogue.result && grant.result));
      transaction.onerror = () => resolve(false);
    };
  })), { timeout: 20_000 }).toBe(true);
}

async function numericExercise(page: Page) {
  const exercises = await page.evaluate(async () => {
    const response = await fetch('/api/learning-exercises/active?learner=kiur');
    return (await response.json() as { exercises: Exercise[] }).exercises;
  });
  for (const exercise of exercises.filter((candidate) => candidate.subject === 'matemaatika')) {
    for (let seed = 1; seed <= 100; seed += 1) {
      const question = generateKiurMathSession(exercise.topic, exercise.category, 'Lihtne', 1, seed)[0];
      if (question && !question.kind) return { exercise, seed, answer: question.correctAnswer };
    }
  }
  throw new Error('The deterministic E2E catalogue must expose at least one numeric Kiur mathematics exercise.');
}

function runnerUrl(exercise: Exercise, seed: number) {
  const query = new URLSearchParams({
    learner: 'kiur', subject: exercise.subject, topic: exercise.topic, category: exercise.category,
    exerciseId: exercise.id, count: '1', seed: String(seed)
  });
  return `/test?${query}`;
}

async function openRunner(page: Page, url: string) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await page.goto(url);
      await expect(page.getByLabel('Vastus')).toBeVisible();
      return;
    } catch (error) {
      if (attempt === 1) throw error;
    }
  }
}

async function storedAttempt(page: Page): Promise<StoredAttempt> {
  await expect(page).toHaveURL(/\/tulemus\?clientId=/);
  const clientId = new URL(page.url()).searchParams.get('clientId');
  expect(clientId).toBeTruthy();
  return page.evaluate((id) => new Promise<StoredAttempt>((resolve, reject) => {
    const open = indexedDB.open('harjutaja-offline');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const transaction = open.result.transaction(['attempts', 'history']);
      const local = transaction.objectStore('attempts').get(id!);
      local.onerror = () => reject(local.error);
      local.onsuccess = () => {
        if (local.result) return resolve(local.result as StoredAttempt);
        const confirmed = transaction.objectStore('history').index('byClientAttemptId').get(id!);
        confirmed.onerror = () => reject(confirmed.error);
        confirmed.onsuccess = () => resolve(confirmed.result as StoredAttempt);
      };
    };
  }), clientId);
}

test.beforeEach(async ({ page }) => authenticate(page));

test('immediate final submission uses the visible immutable answer snapshot', async ({ page }) => {
  const { exercise, seed, answer } = await numericExercise(page);
  const url = runnerUrl(exercise, seed);

  await openRunner(page, url);
  const input = page.getByLabel('Vastus');
  await input.pressSequentially(String(answer));
  await input.press('Enter');
  await expect(storedAttempt(page)).resolves.toMatchObject({
    score: 1,
    questions: [{ userAnswer: String(answer), isCorrect: true }]
  });

  await openRunner(page, url);
  const commaAnswer = `${answer},0`;
  await page.getByLabel('Vastus').pressSequentially(commaAnswer);
  await page.getByRole('button', { name: 'Lõpeta test' }).click();
  await expect(storedAttempt(page)).resolves.toMatchObject({
    score: 1,
    questions: [{ userAnswer: commaAnswer, isCorrect: true }]
  });

  await openRunner(page, url);
  const negativeIncorrect = String(-Math.max(1, Math.abs(answer)));
  await page.getByLabel('Vastus').pressSequentially(negativeIncorrect);
  await page.getByRole('button', { name: 'Lõpeta test' }).click();
  await expect(storedAttempt(page)).resolves.toMatchObject({
    score: 0,
    questions: [{ userAnswer: negativeIncorrect, isCorrect: false }]
  });
});

test('a restored session submits its final visible answer', async ({ page }) => {
  const { exercise, seed, answer } = await numericExercise(page);
  await openRunner(page, runnerUrl(exercise, seed + 101));
  const question = generateKiurMathSession(exercise.topic, exercise.category, 'Lihtne', 1, seed + 101)[0];
  const visibleAnswer = String(question.correctAnswer ?? answer);
  await page.getByLabel('Vastus').pressSequentially(visibleAnswer);
  await expect.poll(() => page.evaluate(() => new Promise<string>((resolve, reject) => {
    const runId = new URL(location.href).searchParams.get('run');
    const open = indexedDB.open('harjutaja-offline');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const request = open.result.transaction('sessions').objectStore('sessions').get(runId!);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result?.runnerState?.answers?.[0] ?? '');
    };
  }))).toBe(visibleAnswer);

  await page.reload();
  await expect(page.getByLabel('Vastus')).toHaveValue(visibleAnswer);
  await page.getByLabel('Vastus').press('Enter');
  await expect(storedAttempt(page)).resolves.toMatchObject({
    score: 1,
    questions: [{ userAnswer: visibleAnswer, isCorrect: true }]
  });
});
