import type { Learner } from '@/lib/shared/types';
import { PREVIEW_LEARNER, type PracticeSessionView, type TestSessionView, type TextbookErrorCode, type TextbookLearner, type TextbookScope } from '@/lib/textbook/api';
import type { ValidationIssue } from '@/lib/textbook/validator';

// Who is acting, decided by the ROUTE (never by the browser): a child route
// builds a child context for a real learner, a parent-authenticated preview
// route builds the preview context. `realEffects` is the one switch the service
// layer checks before any real-world side effect (stars, attempts, ledger,
// leaderboard, weak-objective statistics); it is true only for a real child.

export type TextbookContext = {
  scope: TextbookScope;
  learner: TextbookLearner;
  realEffects: boolean;
};

export function childContext(learner: Learner): TextbookContext {
  if ((learner as string) === PREVIEW_LEARNER || (learner !== 'kiur' && learner !== 'kirsi')) {
    throw new TextbookApiError('forbidden', 'Seda õppijat ei ole.');
  }
  return Object.freeze({ scope: 'child', learner, realEffects: true });
}

export function previewContext(): TextbookContext {
  return Object.freeze({ scope: 'preview', learner: PREVIEW_LEARNER, realEffects: false });
}

// Guard for every real-world side effect. A preview context (or anything that
// is not a real child) reaching it is a programming error, refused loudly.
export function assertRealEffects(context: TextbookContext): Learner {
  if (!context.realEffects || context.scope !== 'child' || context.learner === PREVIEW_LEARNER) {
    throw new Error('Textbook side effects are disabled for this context.');
  }
  return context.learner;
}

export class TextbookApiError extends Error {
  constructor(
    readonly code: TextbookErrorCode,
    message: string,
    readonly extra: { problems?: ValidationIssue[]; session?: PracticeSessionView | TestSessionView } = {}
  ) {
    super(message);
  }
}

export function forbidden(message = 'See ei ole sulle avatud.') {
  return new TextbookApiError('forbidden', message);
}

export function notFound(message = 'Ei leitud.') {
  return new TextbookApiError('not_found', message);
}
