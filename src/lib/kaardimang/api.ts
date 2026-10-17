// The Kaardimäng API contract between the server (lib/server/kaardimang) and
// the UI: routes, request and response shapes. Types and pure helpers only.
//
// Same conventions as the textbook (lib/textbook/api.ts): every mutation
// carries a client-minted actionId and repeating it returns the stored result;
// answers also carry the revision the client saw, and an older one is refused
// with 'stale' plus the current round. The server grades; an unresolved
// question's answer is never sent. Child routes act for Kiur, preview routes
// (parent session) for the isolated preview learner. No stars, ever, in this
// version: a round changes only the map game's own tables.

import type { LevelId, WorldSetId } from '@/content/kaardimang/regions';
import type { AnswerOutcome, ClientQuestion } from '@/lib/kaardimang/engine';

export type KaardimangScope = 'child' | 'preview';

// The game is in parent testing: only the parent preview can play it. While
// false the child page shows a notice, the Loodusõpetus entry card is hidden
// and every child route answers 'forbidden'. Flip to open it for Kiur.
export const KAARDIMANG_CHILD_ENABLED = false;

export type KaardimangErrorCode = 'unauthorized' | 'forbidden' | 'not_found' | 'invalid_request' | 'stale' | 'not_current_question' | 'offline';

export const KAARDIMANG_ERROR_STATUS: Record<KaardimangErrorCode, number> = {
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  invalid_request: 400,
  stale: 409,
  not_current_question: 409,
  offline: 503
};

export type RoundSummary = {
  correct: number;
  firstTryCorrect: number;
  total: number;
  practiced: number;
  practicedOf: number;
  reviewNames: string[];
};

export type RoundView = {
  roundId: string;
  viewId: string;
  setId: WorldSetId | null;
  level: LevelId;
  dataVersion: string;
  status: 'active' | 'completed' | 'abandoned';
  revision: number;
  cursor: number;
  questions: ClientQuestion[];
  summary: RoundSummary | null;
};

export type AnswerFeedback = { questionIndex: number; outcome: AnswerOutcome; messageEt: string };
export type AnswerResponse = { round: RoundView; feedback: AnswerFeedback };

export type OverviewResponse = {
  scope: KaardimangScope;
  activeRound: { roundId: string; viewId: string; setId: WorldSetId | null; level: LevelId; answered: number; total: number } | null;
  // Countries practised at least once / countries in the view, per view id.
  practiced: Record<string, [number, number]>;
};

export type StartRoundRequest = { actionId: string; viewId: string; setId: WorldSetId | null; level: LevelId };
export type AnswerRequest = { actionId: string; revision: number; questionIndex: number; answerId: string };

export type KaardimangErrorResponse = { code: KaardimangErrorCode; message: string; round?: RoundView };

export type ParentKaardimangResponse = {
  dataVersion: string;
  ekiAsOf: string;
  countries: number;
  exploreOnly: string[];
  noCapitalQuestion: Array<{ nameEt: string; reasonEt: string }>;
  kiur: { rounds: number; practiced: number; practicedOf: number; toReview: string[] };
};

function base(scope: KaardimangScope) {
  return scope === 'child' ? '/api/kaardimang' : '/api/parent/kaardimang/preview';
}

export function kaardimangApi(scope: KaardimangScope) {
  const root = base(scope);
  return {
    overview: root,
    start: `${root}/rounds`,
    round: (roundId: string) => `${root}/rounds/${encodeURIComponent(roundId)}`,
    answer: (roundId: string) => `${root}/rounds/${encodeURIComponent(roundId)}/answer`
  };
}

export const KAARDIMANG_PARENT_API = {
  overview: '/api/parent/kaardimang',
  previewReset: '/api/parent/kaardimang/preview/reset'
};

export const KAARDIMANG_PAGES = {
  child: '/kiur/loodusopetus/kaardimang',
  preview: '/vanem/kaardimang'
};

export const ROUND_ID_PATTERN = /^km_[0-9a-f-]{36}$/u;
