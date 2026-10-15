import { navigateStable } from './navigation';
import { expect, test, type Page } from './test';
import { generateKiurMathSession } from '../src/lib/exercises/kiurMath';
import { MATH_GENERATOR_VERSION, MATH_GENERATOR_VERSION_V1 } from '../src/lib/exercises/mathGeneratorVersion';
import { displayedMathOptions, shouldShuffleMathOptions } from '../src/lib/mathOptionOrder';
import type { GeneratedQuestion } from '../src/lib/types';
import { authenticateFamilyWithCatalogue } from './auth';

// A phone can hold a maths run that was paused on the previous generator. After
// the app updates, that run must resume with the very same questions and option
// order, and finalise with ITS generator version so the server can replay it.
// New runs use the new generator and keep their shuffled option order on reload.

const TOPIC = 'ring-ja-ringjoon';
const SHUFFLED_TOPIC = 'arvud-10000-piires';
const CATEGORY = 'Segaharjutus';

type Exercise = { id: string; subject: string; topic: string; category: string };
type StoredSession = { questions: GeneratedQuestion[]; generatorVersion: string; optionOrder: unknown; currentIndex: number; runnerState: Record<string, unknown> };

async function kiurExercise(page: Page, topic: string) {
  const exercises = await page.evaluate(async () => {
    const response = await fetch('/api/learning-exercises/active?learner=kiur');
    return (await response.json() as { exercises: Exercise[] }).exercises;
  });
  const exercise = exercises.find((candidate) => candidate.subject === 'matemaatika' && candidate.topic === topic);
  expect(exercise, `the E2E catalogue must keep ${topic} active for Kiur`).toBeTruthy();
  return exercise!;
}

function runnerUrl(exercise: Exercise, seed: number) {
  const query = new URLSearchParams({ learner: 'kiur', subject: 'matemaatika', topic: exercise.topic, category: CATEGORY, exerciseId: exercise.id, count: '15', seed: String(seed) });
  return `/test?${query}`;
}

function runId(page: Page) {
  const id = new URL(page.url()).searchParams.get('run');
  expect(id).toBeTruthy();
  return id!;
}

function readSession(page: Page, id: string) {
  return page.evaluate((key) => new Promise<StoredSession>((resolve, reject) => {
    const open = indexedDB.open('harjutaja-offline');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const request = open.result.transaction('sessions').objectStore('sessions').get(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as StoredSession);
    };
  }), id);
}

// Rewrites the stored run as the previous app version would have saved it:
// v1 questions, the v1 generator version and no option order.
function makeSessionLookOld(page: Page, id: string, questions: GeneratedQuestion[]) {
  return page.evaluate(({ key, oldQuestions, version }) => new Promise<void>((resolve, reject) => {
    const open = indexedDB.open('harjutaja-offline');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const store = open.result.transaction('sessions', 'readwrite').objectStore('sessions');
      const request = store.get(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const empty = oldQuestions.map(() => '');
        const record = {
          ...request.result,
          questions: oldQuestions,
          generatorVersion: version,
          optionOrder: null,
          currentIndex: 0,
          answers: empty,
          runnerState: { ...request.result.runnerState, answers: empty, choiceAnswers: empty, orderingAnswers: oldQuestions.map(() => []) }
        };
        const put = store.put(record);
        put.onerror = () => reject(put.error);
        put.onsuccess = () => resolve();
      };
    };
  }), { key: id, oldQuestions: questions, version: MATH_GENERATOR_VERSION_V1 });
}

function storedAttempt(page: Page, id: string) {
  return page.evaluate((key) => new Promise<{ local?: Record<string, unknown>; confirmed?: Record<string, unknown> }>((resolve, reject) => {
    const open = indexedDB.open('harjutaja-offline');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const transaction = open.result.transaction(['attempts', 'history']);
      const local = transaction.objectStore('attempts').get(key);
      const confirmed = transaction.objectStore('history').index('byClientAttemptId').get(key);
      transaction.oncomplete = () => resolve({ local: local.result, confirmed: confirmed.result });
      transaction.onerror = () => reject(transaction.error);
    };
  }), id);
}

function correctLabel(question: GeneratedQuestion) {
  return question.kind === 'choice' ? question.choiceOptions![question.correctAnswer] : String(question.correctAnswer);
}

async function visibleOptions(page: Page) {
  return page.locator('.choice-answer-grid button').allTextContents();
}

async function openRunner(page: Page, url: string) {
  // navigateStable: the login flow can still be settling with its own
  // navigation to "/", which would interrupt a plain goto (seen in WebKit).
  await navigateStable(page, url);
  await expect(page.locator('.question-text')).toBeVisible({ timeout: 20_000 });
}

test.beforeEach(async ({ page }) => authenticateFamilyWithCatalogue(page));

test('a run paused on the old generator resumes identically and is accepted with its version', async ({ page }) => {
  test.setTimeout(120_000);
  const exercise = await kiurExercise(page, TOPIC);
  const seed = 7311;
  const oldQuestions = generateKiurMathSession(TOPIC, CATEGORY, 'Lihtne', 15, seed, MATH_GENERATOR_VERSION_V1);
  const newQuestions = generateKiurMathSession(TOPIC, CATEGORY, 'Lihtne', 15, seed, MATH_GENERATOR_VERSION);
  expect(oldQuestions.map((question) => question.question)).not.toEqual(newQuestions.map((question) => question.question));

  await openRunner(page, runnerUrl(exercise, seed));
  const id = runId(page);
  await makeSessionLookOld(page, id, oldQuestions);
  await page.reload();

  for (let index = 0; index < oldQuestions.length; index += 1) {
    const question = oldQuestions[index];
    await expect(page.locator('.question-text')).toHaveText(question.question);
    if (question.kind === 'choice') {
      // Paused before the display shuffle existed: the generated order stays.
      expect(await visibleOptions(page)).toEqual(question.choiceOptions);
      await page.locator('.choice-answer-grid').getByRole('button', { name: correctLabel(question), exact: true }).click();
      await page.locator('.next-button').click();
    } else {
      await page.getByLabel('Vastus').fill(correctLabel(question));
      await page.getByLabel('Vastus').press('Enter');
    }
    if (index === 3) {
      await expect(page.locator('.question-text')).toHaveText(oldQuestions[4].question);
      await expect.poll(async () => (await readSession(page, id)).currentIndex).toBe(4);
      await page.reload();
    }
  }

  await expect(page).toHaveURL(/\/(tulemus\?clientId=|history\/)/);
  // The server re-generates the run with the v1 generator to score it.
  await expect.poll(async () => {
    const stored = await storedAttempt(page, id);
    return stored.confirmed ? { score: stored.confirmed.score, questionCount: stored.confirmed.questionCount } : stored.local?.generatorVersion;
  }, { timeout: 30_000 }).toEqual({ score: 15, questionCount: 15 });
});

test('a new run uses the new generator and keeps its shuffled option order on reload', async ({ page }) => {
  const exercise = await kiurExercise(page, SHUFFLED_TOPIC);
  const seed = 7312;
  const expected = generateKiurMathSession(SHUFFLED_TOPIC, CATEGORY, 'Lihtne', 15, seed, MATH_GENERATOR_VERSION);
  await openRunner(page, runnerUrl(exercise, seed));
  const id = runId(page);
  const session = await readSession(page, id);
  expect(session.generatorVersion).toBe(MATH_GENERATOR_VERSION);
  expect(session.questions.map((question) => question.question)).toEqual(expected.map((question) => question.question));
  expect(session.optionOrder).toBeTruthy();

  // Walk to the first question whose options are shuffled and compare
  // what is shown with the stored order, before and after a reload.
  const target = expected.findIndex(shouldShuffleMathOptions);
  expect(target).toBeGreaterThanOrEqual(0);
  for (let index = 0; index < target; index += 1) {
    const question = expected[index];
    if (question.kind === 'choice') {
      await page.locator('.choice-answer-grid').getByRole('button', { name: correctLabel(question), exact: true }).click();
      await page.locator('.next-button').click();
    } else {
      await page.getByLabel('Vastus').fill(correctLabel(question));
      await page.getByLabel('Vastus').press('Enter');
    }
  }
  await expect(page.locator('.question-text')).toHaveText(expected[target].question);
  const shown = displayedMathOptions(expected[target], session.optionOrder);
  expect(await visibleOptions(page)).toEqual(shown);
  await expect.poll(async () => (await readSession(page, id)).currentIndex).toBe(target);
  await page.reload();
  await expect(page.locator('.question-text')).toHaveText(expected[target].question);
  expect(await visibleOptions(page)).toEqual(shown);
});
