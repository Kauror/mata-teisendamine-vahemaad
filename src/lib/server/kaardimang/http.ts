import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { ACTION_ID_PATTERN } from '@/lib/textbook/api';
import { KAARDIMANG_CHILD_ENABLED, KAARDIMANG_ERROR_STATUS, ROUND_ID_PATTERN, type KaardimangErrorResponse, type KaardimangScope } from '@/lib/kaardimang/api';
import { CHILD_PLAYERS, isPlayer, PARENT_PLAYERS } from '@/lib/kaardimang/competition';
import { cancelCompetition, CompetitionError, competitionHistory, createCompetition, deleteCompetition, endCompetitionNow, extendCompetition, playerLevels, setPlayerLevel } from '@/lib/server/kaardimang/competition';
import { answer, competitionSummaryFor, getOverview, getRound, KaardimangApiError, markShown, parentOverview, resetPreview, startRound, type KaardimangContext } from '@/lib/server/kaardimang/rounds';

// HTTP glue for every Kaardimäng route. The ROUTE decides who plays: child
// routes (/api/kaardimang/…?player=kiur|kirsi) act for a child, parent play
// routes (/api/parent/kaardimang/play/…?player=kairi|kaur) need a parent
// session and act for that parent, preview routes
// (/api/parent/kaardimang/preview/…) need a parent session and act for the
// isolated preview learner. The middleware already enforces the family
// session, parent session + CSRF for /api/parent/* writes, and the peek
// read-only rule for child writes (lib/peekMode.ts).

async function contextFor(scope: KaardimangScope, req: NextRequest): Promise<KaardimangContext> {
  if (scope === 'preview') {
    if (!await hasParentSession()) throw new KaardimangApiError('unauthorized', 'Vanema sisselogimine on vajalik.');
    return { scope, learner: 'preview' };
  }
  const player = new URL(req.url).searchParams.get('player');
  if (scope === 'parent') {
    if (!await hasParentSession()) throw new KaardimangApiError('unauthorized', 'Vanema sisselogimine on vajalik.');
    if (!isPlayer(player) || !PARENT_PLAYERS.includes(player)) throw new KaardimangApiError('invalid_request', 'Vali, kes mängib.');
    return { scope, learner: player };
  }
  if (!KAARDIMANG_CHILD_ENABLED) throw new KaardimangApiError('forbidden', 'Kaardimäng on veel testimisel.');
  // Older pages (before Kirsi could play) send no player: they were Kiur's.
  const child = player ?? 'kiur';
  if (!isPlayer(child) || !CHILD_PLAYERS.includes(child)) throw new KaardimangApiError('invalid_request', 'Vali, kes mängib.');
  return { scope, learner: child };
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
      GET: (req: NextRequest) => run(async () => getOverview(await contextFor(scope, req)))
    },
    start: {
      POST: (req: NextRequest) => run(async () => {
        const context = await contextFor(scope, req);
        const body = await readJson(req);
        return startRound(context, { actionId: actionIdOf(body), viewId: body.viewId, setId: body.setId, level: body.level });
      })
    },
    round: {
      GET: (req: NextRequest, { params }: RoundParams) => run(async () => {
        const { roundId } = await params;
        return getRound(await contextFor(scope, req), roundIdOf(roundId));
      })
    },
    answer: {
      POST: (req: NextRequest, { params }: RoundParams) => run(async () => {
        const { roundId } = await params;
        const context = await contextFor(scope, req);
        const body = await readJson(req);
        return answer(context, roundIdOf(roundId), { actionId: actionIdOf(body), revision: revisionOf(body), questionIndex: body.questionIndex, answerId: body.answerId });
      })
    },
    shown: {
      POST: (req: NextRequest, { params }: RoundParams) => run(async () => {
        const { roundId } = await params;
        const context = await contextFor(scope, req);
        const body = await readJson(req);
        return markShown(context, roundIdOf(roundId), body.questionIndex);
      })
    }
  };
}

async function asParent<T>(work: () => T) {
  if (!await hasParentSession()) throw new KaardimangApiError('unauthorized', 'Vanema sisselogimine on vajalik.');
  try {
    return work();
  } catch (error) {
    if (error instanceof CompetitionError) throw new KaardimangApiError('invalid_request', error.message);
    throw error;
  }
}

function parentCompetitionView() {
  const history = competitionHistory();
  return {
    active: history.find((item) => item.status === 'active') ? competitionSummaryFor(history.find((item) => item.status === 'active')!.id) : null,
    history: history.filter((item) => item.status !== 'active').map((item) => competitionSummaryFor(item.id)),
    levels: playerLevels()
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
  },
  // GET: the open competition, the finished ones and every player's level.
  // POST { action: 'create', title, views, days, rewards? } | { action: 'end', id } (with prizes)
  // | { action: 'cancel', id } (no prizes) | { action: 'delete', id } (gone) | { action: 'extend', id, days }.
  competition: {
    GET: () => run(() => asParent(parentCompetitionView)),
    POST: (req: NextRequest) => run(async () => {
      const body = await readJson(req);
      return asParent(() => {
        if (body.action === 'create') createCompetition({ title: body.title, views: body.views, days: body.days, rewards: body.rewards });
        else if (body.action === 'end') endCompetitionNow(body.id);
        else if (body.action === 'extend') extendCompetition(body.id, body.days);
        else if (body.action === 'cancel') cancelCompetition(body.id);
        else if (body.action === 'delete') deleteCompetition(body.id);
        else throw new CompetitionError('Tundmatu tegevus.');
        return parentCompetitionView();
      });
    })
  },
  // POST { player, level }
  levels: {
    POST: (req: NextRequest) => run(async () => {
      const body = await readJson(req);
      return asParent(() => {
        if (!isPlayer(body.player)) throw new CompetitionError('Vali, kes mängib.');
        setPlayerLevel(body.player, body.level);
        return parentCompetitionView();
      });
    })
  }
};
