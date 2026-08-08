import { expect, test, type Page } from './test';
import { generateKiurMathSession } from '../src/lib/exercises/kiurMath';
import { REMEDIATION_MIN_OPEN_MISTAKES, REMEDIATION_QUESTION_COUNT } from '../src/lib/remediation';
import { authenticateFamilyWithCatalogue } from './auth';
import { navigateStable } from './navigation';

// Kordamine can only be exercised end to end by first getting things wrong, so
// this walks the real path: fail a whole "Ring ja ringjoon" session, wait for it
// to reach the server, then revise it.
//
// That topic is deliberate. Its questions carry drawings, and a question like
// "Milline sirglõik on raadius?" with options A, B and C is unanswerable
// without one — which is exactly what Kordamine used to show.

const TOPIC = 'ring-ja-ringjoon';
const CATEGORY = 'Segaharjutus';
const SEED = 20260726;
const EXERCISE_ID = 'kiur.math.ring-ja-ringjoon';

function failingSession() {
  return generateKiurMathSession(TOPIC, CATEGORY, 'Lihtne', REMEDIATION_QUESTION_COUNT, SEED);
}

function runnerUrl() {
  const query = new URLSearchParams({
    learner: 'kiur', subject: 'matemaatika', topic: TOPIC, category: CATEGORY,
    exerciseId: EXERCISE_ID, count: String(REMEDIATION_QUESTION_COUNT), seed: String(SEED)
  });
  return `/test?${query}`;
}

// Answers every question wrong, so each one lands in the mistake pool.
async function failEveryQuestion(page: Page) {
  const questions = failingSession();
  for (const question of questions) {
    if (question.kind === 'choice') {
      const options = question.choiceOptions?.length ? question.choiceOptions : ['<', '=', '>'];
      const correct = question.choiceOptions?.length
        ? question.choiceOptions[question.correctAnswer]
        : ['<', '=', '>'][question.correctAnswer + 1];
      const wrong = options.find((option) => option !== correct);
      expect(wrong, `every choice question needs a wrong option: ${question.question}`).toBeTruthy();
      await page.getByRole('button', { name: wrong!, exact: true }).first().click();
    } else {
      await page.getByLabel('Vastus').fill(String(Number(question.correctAnswer) + 1));
    }
    await page.locator('button.next-button').click();
  }
  await expect(page).toHaveURL(/\/tulemus|\/history\//);
}

// The yesterday-points recap is a modal over the child's dashboard, mounted
// after hydration — so checking for it once races with it appearing. A child
// closes it before doing anything else; this is called before every attempt.
async function dismissPointsRecap(page: Page) {
  const recap = page.locator('.task-modal-backdrop[aria-labelledby="points-recap-title"]');
  // It renders on the first dashboard visit of a context whether or not there
  // is anything to report, so wait for it rather than sampling for it.
  await recap.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {});
  if (await recap.count() === 0) return;
  await recap.locator('button.next-button').click();
  await expect(recap).toHaveCount(0);
}

function openMistakeCount(page: Page) {
  return page.evaluate(async () => {
    const response = await fetch('/api/remediation?learner=kiur');
    if (!response.ok) return -1;
    return (await response.json() as { openCount: number }).openCount;
  });
}

test.beforeEach(async ({ page }) => authenticateFamilyWithCatalogue(page));

test('a failed session becomes a Kordamine round that can be answered', async ({ page }) => {
  // Triples the 30s default. This test answers 15 questions wrong, waits up to
  // 20s for the attempt to reach the server, then answers 15 more — about 75
  // interactions, with the poll alone able to eat two thirds of the standard
  // budget. Chromium finished inside it; WebKit ran out mid-round, and failed
  // at a later line each retry, which is what running out of time looks like
  // rather than a stuck element.
  test.slow();
  await navigateStable(page, runnerUrl());
  await failEveryQuestion(page);

  // The pool is filled server-side when the attempt syncs, not when it is saved
  // locally, so the count is polled rather than assumed.
  await expect.poll(() => openMistakeCount(page), { timeout: 20_000 })
    .toBeGreaterThanOrEqual(REMEDIATION_MIN_OPEN_MISTAKES);

  await navigateStable(page, '/kiur');
  const remediationCard = page.getByRole('link', { name: /Kordamine/ });
  await expect(remediationCard).toBeVisible();

  // The exercise grid re-renders from the cached catalogue in an effect, so the
  // card can be swapped out between the hit test and the click. Retry rather
  // than navigating directly, because following the card IS the evidence.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await dismissPointsRecap(page);
    await remediationCard.click();
    try {
      await page.waitForURL(/\/kiur\/kordamine/, { timeout: 5_000 });
      break;
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }
  await expect(page).toHaveURL(/\/kiur\/kordamine/);
  await expect(page.getByText(`1 / ${REMEDIATION_QUESTION_COUNT}`)).toBeVisible();

  // Walk the whole round. Every question must offer a way to answer, and at
  // least one must bring its drawing with it.
  let sawShape = false;
  for (let position = 1; position <= REMEDIATION_QUESTION_COUNT; position += 1) {
    await expect(page.getByText(`${position} / ${REMEDIATION_QUESTION_COUNT}`)).toBeVisible();
    if (await page.locator('.remediation-shape-visual svg').count() > 0) sawShape = true;

    const typedAnswer = page.getByPlaceholder('Sisesta vastus');
    if (await typedAnswer.count() > 0) {
      await typedAnswer.fill('0');
      await page.getByRole('button', { name: 'Vasta' }).click();
    } else {
      await page.locator('.choice-answer-button').first().click();
    }

    await page.locator('button.next-button').click();
  }

  expect(sawShape, 'a circle question must be replayed with its drawing').toBe(true);
  await expect(page.getByText(`Tulemus: `)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ajalugu' })).toBeVisible();
});
