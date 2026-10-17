// The browser side of the textbook API contract (src/lib/textbook/api.ts):
// typed calls, the CSRF header, Estonian error messages and an honest offline
// answer. Online only (SPEC D5): when a request cannot be sent the caller gets
// the 'offline' error — never a pretend success, never a queued write.
//
// A mutation that was lost in transit is retried with the SAME body, so the
// same actionId: the server recognises a repeat and returns the stored result
// instead of applying it twice.
//
// Framework-free so it can be unit-tested; the hooks live in useTextbook.ts.

import {
  ACTION_ID_PATTERN,
  TEXTBOOK_API,
  learnerApi,
  type CourseOverviewResponse,
  type LessonContentResponse,
  type ParentOverviewResponse,
  type ParentUnitDetailResponse,
  type ParentUnitResponse,
  type PracticeAnswerResponse,
  type PracticeSessionView,
  type PreviewResetResponse,
  type ReadingCompleteResponse,
  type TestAnswerResponse,
  type TestSessionView,
  type TestSubmitResponse,
  type TextbookErrorCode,
  type TextbookErrorResponse,
  type TextbookScope,
  type UnitDetailResponse
} from '@/lib/textbook/api';
import type { AnswerResponse } from '@/lib/textbook/types';

export type TextbookRequest = (input: string, init?: RequestInit) => Promise<Response>;

export type TextbookClientError = {
  code: TextbookErrorCode | 'unknown';
  status: number;
  message: string;
  // Worth offering "Proovi uuesti" (network trouble, server hiccup, a stale tab).
  retryable: boolean;
  problems?: TextbookErrorResponse['problems'];
  session?: TextbookErrorResponse['session'];
};

export type TextbookResult<T> = { ok: true; data: T } | { ok: false; error: TextbookClientError };

export const TEXTBOOK_OFFLINE_MESSAGE = 'Õpiku õppetükid vajavad internetiühendust. Kontrolli ühendust ja proovi uuesti.';

const FALLBACK_MESSAGES: Partial<Record<TextbookErrorCode, string>> = {
  unauthorized: 'Vanema sisselogimine on aegunud. Logi uuesti sisse.',
  forbidden: 'Seda õppetükki ei saa avada.',
  not_found: 'Seda ei leitud.',
  locked: 'See õppetükk on veel lukus.',
  gate_reading: 'Loe enne harjutamist kõik kohustuslikud õppetükid läbi.',
  gate_practice: 'Tee enne testi harjutus lõpuni.',
  gate_retake_practice: 'Enne uut testi harjuta teemasid, mis eelmises testis ei õnnestunud.',
  stale: 'See leht oli vahepeal teises aknas muutunud. Näitan uusimat seisu.',
  already_submitted: 'See test on juba esitatud.',
  invalid_request: 'Päringut ei saanud töödelda.',
  invalid_response: 'See vastus ei sobi selle küsimusega.',
  incomplete_response: 'Vasta küsimusele lõpuni.',
  not_current_question: 'See küsimus on juba vastatud. Näitan järgmist.',
  not_all_answered: 'Vasta enne esitamist kõigile küsimustele.',
  validation_failed: 'Õppetükki ei saa avaldada, sest sisu kontroll leidis vigu.',
  offline: TEXTBOOK_OFFLINE_MESSAGE
};

const KNOWN_CODES = new Set<string>(Object.keys(FALLBACK_MESSAGES));

export function newActionId(): string {
  const id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`;
  return ACTION_ID_PATTERN.test(id) ? id : `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`;
}

export function offlineError(): TextbookClientError {
  return { code: 'offline', status: 0, message: TEXTBOOK_OFFLINE_MESSAGE, retryable: true };
}

async function readBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

// A failed response → an error the screen can show as is.
export function errorFrom(status: number, body: unknown): TextbookClientError {
  const record = (body && typeof body === 'object' ? body : {}) as Partial<TextbookErrorResponse> & { code?: string };
  const code = typeof record.code === 'string' && KNOWN_CODES.has(record.code) ? (record.code as TextbookErrorCode) : 'unknown';
  const message = typeof record.message === 'string' && record.message
    ? record.message
    : (code !== 'unknown' ? FALLBACK_MESSAGES[code] : undefined) ?? 'Midagi läks valesti. Proovi uuesti.';
  const retryable = status >= 500 || status === 0 || code === 'stale' || code === 'not_current_question';
  return {
    code,
    status,
    message,
    retryable,
    ...(Array.isArray(record.problems) ? { problems: record.problems } : {}),
    ...(record.session ? { session: record.session } : {})
  };
}

const RETRY_DELAYS_MS = [400, 900];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function send<T>(request: TextbookRequest, url: string, init: RequestInit, retries: number): Promise<TextbookResult<T>> {
  for (let attempt = 0; ; attempt += 1) {
    let response: Response;
    try {
      response = await request(url, init);
    } catch {
      // Lost in transit. Safe to repeat: the body (and its actionId) is unchanged.
      if (attempt < retries) {
        await wait(RETRY_DELAYS_MS[attempt] ?? 1200);
        continue;
      }
      return { ok: false, error: offlineError() };
    }
    const body = await readBody(response);
    if (response.ok) return { ok: true, data: body as T };
    return { ok: false, error: errorFrom(response.status, body) };
  }
}

export function getJson<T>(request: TextbookRequest, url: string): Promise<TextbookResult<T>> {
  return send<T>(request, url, { method: 'GET', cache: 'no-store' }, 0);
}

export function postJson<T>(request: TextbookRequest, url: string, body: unknown): Promise<TextbookResult<T>> {
  return send<T>(request, url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, RETRY_DELAYS_MS.length);
}

/* ------------------------------------------------------------ clients */

export type LearnerClient = ReturnType<typeof createLearnerClient>;

export function createLearnerClient(scope: TextbookScope, request: TextbookRequest) {
  const routes = learnerApi(scope);
  return {
    scope,
    courseOverview: (courseId: string) => getJson<CourseOverviewResponse>(request, routes.courseOverview(courseId)),
    unitDetail: (courseId: string, unitId: string) => getJson<UnitDetailResponse>(request, routes.unitDetail(courseId, unitId)),
    lesson: (courseId: string, unitId: string, lessonId: string) => getJson<LessonContentResponse>(request, routes.lesson(courseId, unitId, lessonId)),
    completeLesson: (courseId: string, unitId: string, lessonId: string, actionId: string) =>
      postJson<ReadingCompleteResponse>(request, routes.lessonComplete(courseId, unitId, lessonId), { actionId }),
    practiceStart: (courseId: string, unitId: string, actionId: string) => postJson<PracticeSessionView>(request, routes.practiceStart(courseId, unitId), { actionId }),
    practiceSession: (sessionId: string) => getJson<PracticeSessionView>(request, routes.practiceSession(sessionId)),
    practiceAnswer: (sessionId: string, body: { actionId: string; revision: number; questionId: string; response: AnswerResponse }) =>
      postJson<PracticeAnswerResponse>(request, routes.practiceAnswer(sessionId), body),
    testStart: (courseId: string, unitId: string, actionId: string) => postJson<TestSessionView>(request, routes.testStart(courseId, unitId), { actionId }),
    testSession: (sessionId: string) => getJson<TestSessionView>(request, routes.testSession(sessionId)),
    testAnswer: (sessionId: string, body: { actionId: string; revision: number; questionId: string; response: AnswerResponse }) =>
      postJson<TestAnswerResponse>(request, routes.testAnswer(sessionId), body),
    testSubmit: (sessionId: string, body: { actionId: string; revision: number }) => postJson<TestSubmitResponse>(request, routes.testSubmit(sessionId), body)
  };
}

export type ParentTextbookClient = ReturnType<typeof createParentTextbookClient>;

export function createParentTextbookClient(request: TextbookRequest) {
  const routes = TEXTBOOK_API.parent;
  return {
    overview: () => getJson<ParentOverviewResponse>(request, routes.overview),
    unit: (courseId: string, unitId: string) => getJson<ParentUnitDetailResponse>(request, routes.unit(courseId, unitId)),
    publish: (courseId: string, unitId: string, published: boolean) => postJson<ParentUnitResponse>(request, routes.publish(courseId, unitId), { actionId: newActionId(), published }),
    unlock: (courseId: string, unitId: string, unlocked: boolean) => postJson<ParentUnitResponse>(request, routes.unlock(courseId, unitId), { actionId: newActionId(), unlocked }),
    previewStart: (courseId: string) => postJson<CourseOverviewResponse>(request, routes.previewStart, { actionId: newActionId(), courseId }),
    previewReset: (courseId?: string) => postJson<PreviewResetResponse>(request, routes.previewReset, { actionId: newActionId(), ...(courseId ? { courseId } : {}) })
  };
}
