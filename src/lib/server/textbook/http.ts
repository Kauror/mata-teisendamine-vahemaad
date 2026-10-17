import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { ACTION_ID_PATTERN, TEXTBOOK_ERROR_STATUS, type TextbookErrorResponse } from '@/lib/textbook/api';
import { childContext, previewContext, TextbookApiError, type TextbookContext } from '@/lib/server/textbook/context';
import { completeLesson, getCourseOverview, getLesson, getUnitDetail } from '@/lib/server/textbook/learner';
import { answerPractice, getPracticeSession, startPractice } from '@/lib/server/textbook/practice';
import { getTestSession, saveAnswer, startTest, submit } from '@/lib/server/textbook/test';

// HTTP glue shared by every textbook route. Child routes (/api/textbook/…)
// act for the child learner; preview routes (/api/parent/textbook/preview/…)
// require a parent session and act for the isolated preview learner. Both
// call the same services with a context built HERE, so nothing the browser
// sends can choose the learner or switch the side effects on.
//
// The middleware already enforces the family session everywhere, the parent
// session + CSRF for /api/parent/* mutations, and the peek read-only rule for
// child writes (lib/peekMode.ts isChildWritePath).

// The textbook's child. The first course is Kiur's; the family session does
// not say which child is at the screen, exactly like English vocabulary.
export const TEXTBOOK_CHILD_LEARNER = 'kiur' as const;

export function textbookError(code: TextbookApiError['code'], message: string, extra: Omit<TextbookErrorResponse, 'code' | 'message'> = {}) {
  return NextResponse.json({ code, message, ...extra } satisfies TextbookErrorResponse, { status: TEXTBOOK_ERROR_STATUS[code] });
}

export function textbookErrorResponse(error: unknown) {
  if (error instanceof TextbookApiError) return textbookError(error.code, error.message, error.extra);
  console.error('Textbook request failed', error);
  return NextResponse.json({ code: 'server_error', message: 'Midagi läks valesti. Proovi uuesti.' }, { status: 500 });
}

export async function readJson(req: NextRequest): Promise<Record<string, unknown>> {
  const body = await req.json().catch(() => null) as unknown;
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new TextbookApiError('invalid_request', 'Päring on vigane.');
  return body as Record<string, unknown>;
}

export function actionIdOf(body: Record<string, unknown>): string {
  const actionId = body.actionId;
  if (typeof actionId !== 'string' || !ACTION_ID_PATTERN.test(actionId)) throw new TextbookApiError('invalid_request', 'Tegevuse tunnus puudub.');
  return actionId;
}

export function revisionOf(body: Record<string, unknown>): number {
  const revision = body.revision;
  if (typeof revision !== 'number' || !Number.isInteger(revision) || revision < 0) throw new TextbookApiError('invalid_request', 'Sessiooni versioon puudub.');
  return revision;
}

function questionIdOf(body: Record<string, unknown>): string {
  const questionId = body.questionId;
  if (typeof questionId !== 'string' || questionId.length === 0 || questionId.length > 120) throw new TextbookApiError('invalid_request', 'Küsimus puudub.');
  return questionId;
}

const SEGMENT = /^[a-z0-9][a-z0-9-]{0,79}$/u;

export function segment(value: string | undefined): string {
  if (typeof value !== 'string' || !SEGMENT.test(value)) throw new TextbookApiError('not_found', 'Ei leitud.');
  return value;
}

export function sessionSegment(value: string | undefined): string {
  if (typeof value !== 'string' || !/^t[pt]_[0-9a-f-]{36}$/u.test(value)) throw new TextbookApiError('not_found', 'Ei leitud.');
  return value;
}

export async function requireParent() {
  if (!await hasParentSession()) throw new TextbookApiError('unauthorized', 'Vanema sisselogimine on vajalik.');
}

type Scope = 'child' | 'preview';

async function contextFor(scope: Scope): Promise<TextbookContext> {
  if (scope === 'preview') {
    await requireParent();
    return previewContext();
  }
  return childContext(TEXTBOOK_CHILD_LEARNER);
}

type Params<T> = { params: Promise<T> };
type CourseParams = { courseId: string };
type UnitParams = CourseParams & { unitId: string };
type LessonParams = UnitParams & { lessonId: string };
type SessionParams = { sessionId: string };

async function run(work: () => Promise<unknown> | unknown) {
  try {
    return NextResponse.json(await work());
  } catch (error) {
    return textbookErrorResponse(error);
  }
}

// Route handlers for one scope. Each route file re-exports the ones it serves.
export function learnerHandlers(scope: Scope) {
  return {
    courseOverview: {
      GET: (_req: NextRequest, { params }: Params<CourseParams>) => run(async () => {
        const { courseId } = await params;
        return getCourseOverview(await contextFor(scope), segment(courseId));
      })
    },
    unitDetail: {
      GET: (_req: NextRequest, { params }: Params<UnitParams>) => run(async () => {
        const { courseId, unitId } = await params;
        return getUnitDetail(await contextFor(scope), segment(courseId), segment(unitId));
      })
    },
    lesson: {
      GET: (_req: NextRequest, { params }: Params<LessonParams>) => run(async () => {
        const { courseId, unitId, lessonId } = await params;
        return getLesson(await contextFor(scope), segment(courseId), segment(unitId), segment(lessonId));
      })
    },
    lessonComplete: {
      POST: (req: NextRequest, { params }: Params<LessonParams>) => run(async () => {
        const { courseId, unitId, lessonId } = await params;
        const context = await contextFor(scope);
        actionIdOf(await readJson(req));
        return completeLesson(context, segment(courseId), segment(unitId), segment(lessonId));
      })
    },
    practiceStart: {
      POST: (req: NextRequest, { params }: Params<UnitParams>) => run(async () => {
        const { courseId, unitId } = await params;
        const context = await contextFor(scope);
        actionIdOf(await readJson(req));
        return startPractice(context, segment(courseId), segment(unitId));
      })
    },
    testStart: {
      POST: (req: NextRequest, { params }: Params<UnitParams>) => run(async () => {
        const { courseId, unitId } = await params;
        const context = await contextFor(scope);
        actionIdOf(await readJson(req));
        return startTest(context, segment(courseId), segment(unitId));
      })
    },
    practiceSession: {
      GET: (_req: NextRequest, { params }: Params<SessionParams>) => run(async () => {
        const { sessionId } = await params;
        return getPracticeSession(await contextFor(scope), sessionSegment(sessionId));
      })
    },
    practiceAnswer: {
      POST: (req: NextRequest, { params }: Params<SessionParams>) => run(async () => {
        const { sessionId } = await params;
        const context = await contextFor(scope);
        const body = await readJson(req);
        return answerPractice(context, sessionSegment(sessionId), { actionId: actionIdOf(body), revision: revisionOf(body), questionId: questionIdOf(body), response: body.response });
      })
    },
    testSession: {
      GET: (_req: NextRequest, { params }: Params<SessionParams>) => run(async () => {
        const { sessionId } = await params;
        return getTestSession(await contextFor(scope), sessionSegment(sessionId));
      })
    },
    testAnswer: {
      POST: (req: NextRequest, { params }: Params<SessionParams>) => run(async () => {
        const { sessionId } = await params;
        const context = await contextFor(scope);
        const body = await readJson(req);
        return saveAnswer(context, sessionSegment(sessionId), { actionId: actionIdOf(body), revision: revisionOf(body), questionId: questionIdOf(body), response: body.response });
      })
    },
    testSubmit: {
      POST: (req: NextRequest, { params }: Params<SessionParams>) => run(async () => {
        const { sessionId } = await params;
        const context = await contextFor(scope);
        const body = await readJson(req);
        return submit(context, sessionSegment(sessionId), { actionId: actionIdOf(body), revision: revisionOf(body) });
      })
    }
  };
}

export const childHandlers = learnerHandlers('child');
export const previewHandlers = learnerHandlers('preview');

export { run as runTextbookRoute };
