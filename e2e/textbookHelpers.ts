import { expect, type Page } from './test';
import { navigateStable } from './navigation';
import type { ParentUnitDetailResponse, PracticeSessionView, TestSessionView, TestSubmitResponse, UnitDetailResponse } from '../src/lib/textbook/api';
import { correctResponseFor } from '../src/lib/textbook/grading';
import type { Question } from '../src/lib/textbook/types';

// Shared parent-preview plumbing for the Loodusõpetus õpik smoke spec
// (e2e/textbook-real-units.spec.ts): sign-in, the parent API with its CSRF
// header, the preview reset, and reading, practising and passing a unit
// through the preview API (direct JSON requests, no clicking) — passing a
// unit opens the next one, as it does for the child.

export const ORIGIN = 'http://localhost:3000';
export const COURSE = 'loodusopetus-opik';
export const PREVIEW_API = '/api/parent/textbook/preview';
export const previewCourse = `/vanem/oppetukid/eelvaade/${COURSE}`;

// Field names of an answer key, or of the region labels of a hotspot picture:
// none may reach the browser while a test is running.
export const ANSWER_KEY_FIELDS = /correctOptionId|correctOptionIds|correctPairs|correctGroupByItem|correctOrder|correctRegionId|"explanation"|"label":/;

let actionCounter = 0;
export function actionId() {
  actionCounter += 1;
  return `e2etb${Date.now().toString(36)}${actionCounter}x${Math.random().toString(36).slice(2, 8)}`;
}

export async function signInAsParent(page: Page) {
  await navigateStable(page, '/vanem');
  const password = page.getByLabel('Sisesta parool');
  if (await password.count() > 0) {
    await password.click();
    await password.pressSequentially('e2e-parent-password');
    const dashboardLoaded = page.waitForResponse((response) => response.url().endsWith('/api/parent/dashboard') && response.ok());
    await page.getByRole('button', { name: 'Sisene' }).click();
    await dashboardLoaded;
  }
  await expect(page.getByRole('button', { name: /Loodusõpetuse õppetükid/ })).toBeVisible();
}

async function parentHeaders(page: Page) {
  const cookies = await page.context().cookies();
  const token = cookies.find((cookie) => cookie.name === 'parent_csrf')?.value ?? '';
  return { 'content-type': 'application/json', origin: ORIGIN, 'x-csrf-token': decodeURIComponent(token) };
}

export async function apiPost<T>(page: Page, url: string, body: unknown): Promise<T> {
  const response = await page.request.post(url, { headers: await parentHeaders(page), data: body });
  expect(response.ok(), `${url} → ${response.status()} ${await response.text()}`).toBe(true);
  return await response.json() as T;
}

export async function apiGet<T>(page: Page, url: string): Promise<T> {
  const response = await page.request.get(url);
  expect(response.ok(), `${url} → ${response.status()}`).toBe(true);
  return await response.json() as T;
}

// Both browser projects share one database: every test starts from a fresh preview learner.
export async function resetPreview(page: Page) {
  await apiPost(page, `${PREVIEW_API}/reset`, { actionId: actionId(), courseId: COURSE });
  await apiPost(page, `${PREVIEW_API}/start`, { actionId: actionId(), courseId: COURSE });
}

// A unit's questions with their answer keys (parent only).
export async function unitKeys(page: Page, unitId: string): Promise<Map<string, Question>> {
  const detail = await apiGet<ParentUnitDetailResponse>(page, `/api/parent/textbook/courses/${COURSE}/units/${unitId}`);
  return new Map(detail.questions.map((question) => [question.id, question]));
}

export async function readAllViaApi(page: Page, unitId: string) {
  const detail = await apiGet<UnitDetailResponse>(page, `${PREVIEW_API}/courses/${COURSE}/units/${unitId}`);
  for (const lesson of detail.lessons) {
    await apiPost(page, `${PREVIEW_API}/courses/${COURSE}/units/${unitId}/lessons/${lesson.lessonId}/complete`, { actionId: actionId() });
  }
}

export async function practiseViaApi(page: Page, unitId: string, keys: Map<string, Question>) {
  let session = await apiPost<PracticeSessionView>(page, `${PREVIEW_API}/courses/${COURSE}/units/${unitId}/practice`, { actionId: actionId() });
  for (let guard = 0; session.status === 'active' && session.question && guard < 120; guard += 1) {
    const question = keys.get(session.question.id)!;
    const answered = await apiPost<{ session: PracticeSessionView }>(page, `${PREVIEW_API}/practice/${session.sessionId}/answer`, {
      actionId: actionId(), revision: session.revision, questionId: question.id, response: correctResponseFor(question.answer)
    });
    session = answered.session;
  }
  expect(session.status).toBe('completed');
}

// Starts (or resumes) the test and answers all 20 correctly; returns the submit result.
export async function passTestViaApi(page: Page, unitId: string, keys: Map<string, Question>) {
  let session = await apiPost<TestSessionView>(page, `${PREVIEW_API}/courses/${COURSE}/units/${unitId}/test`, { actionId: actionId() });
  for (const question of session.questions) {
    session = (await apiPost<{ session: TestSessionView }>(page, `${PREVIEW_API}/test/${session.sessionId}/answer`, {
      actionId: actionId(), revision: session.revision, questionId: question.id, response: correctResponseFor(keys.get(question.id)!.answer)
    })).session;
  }
  const submitted = await apiPost<TestSubmitResponse>(page, `${PREVIEW_API}/test/${session.sessionId}/submit`, { actionId: actionId(), revision: session.revision });
  expect(submitted.result, `${unitId} passed`).toMatchObject({ correct: 20, passed: true });
  return submitted.result;
}
