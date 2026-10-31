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
import type { KaardimangNoticeKind, KaardimangPlayer, StandingRow } from '@/lib/kaardimang/competition';
import type { AnswerOutcome, ClientQuestion } from '@/lib/kaardimang/engine';

// child: Kiur or Kirsi on their own pages; parent: Kairi or Kaur from the
// parent area (parent session); preview: the parent's isolated test learner.
export type KaardimangScope = 'child' | 'parent' | 'preview';

// Open for the children since the family competition (backlog KM-02, 23.10):
// Kiur and Kirsi play from their own pages. Set to false to close it again:
// then the child pages show a notice, the entry cards are hidden and every
// child route answers 'forbidden'; the parent area keeps working.
export const KAARDIMANG_CHILD_ENABLED = true;

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
  // Set when the round counts for the open competition.
  competition: { id: number; title: string; points: number } | null;
};

export type AnswerFeedback = { questionIndex: number; outcome: AnswerOutcome; messageEt: string };
export type AnswerResponse = { round: RoundView; feedback: AnswerFeedback };

export type OverviewResponse = {
  scope: KaardimangScope;
  activeRound: { roundId: string; viewId: string; setId: WorldSetId | null; level: LevelId; answered: number; total: number } | null;
  // Countries practised at least once / countries in the view, per view id.
  practiced: Record<string, [number, number]>;
  // The player's own level (set by the parent); null in the preview, which picks freely.
  player: KaardimangPlayer | null;
  level: LevelId | null;
  competition: CompetitionSummary | null;
  // The player's medals from finished competitions, newest first.
  medals: Array<{ competitionId: number; title: string; place: 1 | 2 | 3; stars: number; endDate: string }>;
  // The player's achievement shelf (empty in the preview).
  achievements: KaardimangAchievementView[];
  // One-shot notices this player has not dismissed yet, in the order to show them (none in the preview).
  notices: KaardimangNotice[];
};

// The results splash of a finished competition, or the last-days reminder of
// the open one. `me` is this player's own row.
export type KaardimangNotice =
  | { kind: 'results'; competitionId: number; title: string; endDate: string; standings: StandingRow[]; me: { rank: number; points: number; stars: number } }
  | { kind: 'last_days'; competitionId: number; title: string; endDate: string; daysLeftEt: string; me: { rank: number; points: number } };

export type DismissNoticeRequest = { competitionId: number; kind: KaardimangNoticeKind };
export type NoticesResponse = { notices: KaardimangNotice[] };

export type KaardimangAchievementView = { id: string; emoji: string; title: string; description: string; current: number; target: number; unlocked: boolean };

export type CompetitionSummary = {
  id: number;
  title: string;
  views: string[];
  startDate: string;
  endDate: string;
  rewards: [number, number, number];
  status: 'active' | 'ended' | 'cancelled';
  daysLeftEt: string;
  standings: StandingRow[];
  // Counted rounds still left for this player today (null in the preview).
  countedLeftToday: number | null;
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
  if (scope === 'child') return '/api/kaardimang';
  return scope === 'parent' ? '/api/parent/kaardimang/play' : '/api/parent/kaardimang/preview';
}

// Child and parent routes name the player (?player=kiur); the preview has one learner.
export function kaardimangApi(scope: KaardimangScope, player: KaardimangPlayer | null = null) {
  const root = base(scope);
  const query = scope === 'preview' || !player ? '' : `?player=${player}`;
  return {
    overview: `${root}${query}`,
    start: `${root}/rounds${query}`,
    round: (roundId: string) => `${root}/rounds/${encodeURIComponent(roundId)}${query}`,
    answer: (roundId: string) => `${root}/rounds/${encodeURIComponent(roundId)}/answer${query}`,
    shown: (roundId: string) => `${root}/rounds/${encodeURIComponent(roundId)}/shown${query}`,
    notices: `${root}/notices${query}`
  };
}

export const KAARDIMANG_PARENT_API = {
  overview: '/api/parent/kaardimang',
  previewReset: '/api/parent/kaardimang/preview/reset',
  competition: '/api/parent/kaardimang/competition',
  levels: '/api/parent/kaardimang/levels'
};

export const KAARDIMANG_PAGES = {
  child: '/kiur/loodusopetus/kaardimang',
  kirsi: '/kirsi/kaardimang',
  parent: (player: 'kairi' | 'kaur') => `/vanem/kaardimang/${player}`,
  preview: '/vanem/kaardimang'
};

export type ParentCompetitionResponse = {
  active: CompetitionSummary | null;
  history: CompetitionSummary[];
  levels: Record<KaardimangPlayer, LevelId>;
};

export const ROUND_ID_PATTERN = /^km_[0-9a-f-]{36}$/u;
