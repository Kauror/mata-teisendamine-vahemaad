import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { ACTION_ID_PATTERN } from '@/lib/textbook/api';
import { KAARDIMANG_CHILD_ENABLED, KAARDIMANG_ERROR_STATUS, ROUND_ID_PATTERN, type KaardimangErrorResponse, type KaardimangScope } from '@/lib/kaardimang/api';
import { answer, getOverview, getRound, KaardimangApiError, parentOverview, resetPreview, startRound, type KaardimangContext } from '@/lib/server/kaardimang/rounds';

// HTTP glue for every Kaardimäng route. The ROUTE decides the learner: child
// routes (/api/kaardimang/…) act for Kiur, preview routes
// (/api/parent/kaardimang/preview/…) need a parent session and act for the
// isolated preview learner. The middleware already enforces the family
// session, parent session + CSRF for /api/parent/* writes, and the peek
// read-only rule for child writes (lib/peekMode.ts).

async function contextFor(scope: KaardimangScope): Promise<KaardimangContext> {
  if (scope === 'preview') {
    if (!await hasParentSession()) throw new KaardimangApiError('unauthorized', 'Vanema sisselogimine on vajalik.');
    return { scope, learner: 'preview' };
  }
  if (!KAARDIMANG_CHILD_ENABLED) throw new KaardimangApiError('forbidden', 'Kaardimäng on veel testimisel.');
  return { scope, learner: 'kiur' };
}

async function run(work: () => Promise<unknown> | unknown) {
  try {
    return NextResponse.json(await work());
  } catch (error) {
    if (error instanceof KaardimangApiError) {
      const body: KaardimangErrorResponse = { code: error.code, message: error.message, ...(error.round ? { round: error.round } : {}) };
      return NextResponse.json(body, { status: KAARDIMANG_ERROR_STATUS[error.code] });
    }
    console.error('Kaardimäng request failed', error);
    return NextResponse.json({ code: 'server_error', message: 'Midagi läks valesti. Proovi uuesti.' }, { status: 500 });
  }
}

async function readJson(req: NextRequest): Promise<Record<string, unknown>> {
  const body = await req.json().catch(() => null) as unknown;
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new KaardimangApiError('invalid_request', 'Päring on vigane.');
  return body as Record<string, unknown>;
}

function actionIdOf(body: Record<string, unknown>): string {
  if (typeof body.actionId !== 'string' || !ACTION_ID_PATTERN.test(body.actionId)) throw new KaardimangApiError('invalid_request', 'Tegevuse tunnus puudub.');
  return body.actionId;
}

function revisionOf(body: Record<string, unknown>): number {
  if (typeof body.revision !== 'number' || !Number.isInteger(body.revision) || body.revision < 0) throw new KaardimangApiError('invalid_request', 'Mängu versioon puudub.');
  return body.revision;
}

function roundIdOf(value: string | undefined): string {
  if (typeof value !== 'string' || !ROUND_ID_PATTERN.test(value)) throw new KaardimangApiError('not_found', 'Mänguvooru ei leitud.');
  return value;
}

type RoundParams = { params: Promise<{ roundId: string }> };

export function kaardimangHandlers(scope: KaardimangScope) {
  return {
    overview: {
      GET: () => run(async () => getOverview(await contextFor(scope)))
    },
    start: {
      POST: (req: NextRequest) => run(async () => {
        const context = await contextFor(scope);
        const body = await readJson(req);
        return startRound(context, { actionId: actionIdOf(body), viewId: body.viewId, setId: body.setId, level: body.level });
      })
    },
    round: {
      GET: (_req: NextRequest, { params }: RoundParams) => run(async () => {
        const { roundId } = await params;
        return getRound(await contextFor(scope), roundIdOf(roundId));
      })
    },
    answer: {
      POST: (req: NextRequest, { params }: RoundParams) => run(async () => {
        const { roundId } = await params;
        const context = await contextFor(scope);
        const body = await readJson(req);
        return answer(context, roundIdOf(roundId), { actionId: actionIdOf(body), revision: revisionOf(body), questionIndex: body.questionIndex, answerId: body.answerId });
      })
    }
  };
}

export const parentKaardimangHandlers = {
  overview: {
    GET: () => run(async () => {
      if (!await hasParentSession()) throw new KaardimangApiError('unauthorized', 'Vanema sisselogimine on vajalik.');
      return parentOverview();
    })
  },
  previewReset: {
    POST: (req: NextRequest) => run(async () => {
      if (!await hasParentSession()) throw new KaardimangApiError('unauthorized', 'Vanema sisselogimine on vajalik.');
      actionIdOf(await readJson(req));
      return resetPreview();
    })
  }
};
