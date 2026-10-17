'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { PracticeSessionView, TextbookScope } from '@/lib/textbook/api';
import type { AnswerResponse } from '@/lib/textbook/types';
import { AnswerFeedback } from '@/app/components/textbook/AnswerFeedback';
import { QuestionCard } from '@/app/components/textbook/AnswerInputs';
import { textbookPaths } from '@/app/components/textbook/pages';
import { emptyDraft, isDraftComplete, type AnswerDraft } from '@/app/components/textbook/responses';
import { practiceCounter } from '@/app/components/textbook/status';
import { TextbookLoading, TextbookProblem, TextbookProgress, TextbookShell } from '@/app/components/textbook/TextbookShell';
import { useLearnerClient, useSessionRunner } from '@/app/components/textbook/useTextbook';

// Which answer's feedback the child has already closed with "Edasi". Kept per
// session in sessionStorage, so a reload in the middle of feedback shows the
// feedback again and a reload after it shows the next question.
function dismissedKey(sessionId: string) {
  return `harjutaja:textbook-practice-seen:${sessionId}`;
}

function readDismissed(sessionId: string): number {
  try {
    return Number(window.sessionStorage.getItem(dismissedKey(sessionId)) ?? '0') || 0;
  } catch {
    return 0;
  }
}

function writeDismissed(sessionId: string, sequence: number) {
  try {
    window.sessionStorage.setItem(dismissedKey(sessionId), String(sequence));
  } catch {
    // Private mode: the worst case is seeing the feedback once more.
  }
}

export default function TextbookPractice({ scope, courseId, unitId }: { scope: TextbookScope; courseId: string; unitId: string }) {
  const client = useLearnerClient(scope);
  const paths = textbookPaths(scope, courseId);
  const runner = useSessionRunner<PracticeSessionView>({
    scope,
    unitId,
    start: (actionId) => client.practiceStart(courseId, unitId, actionId),
    fetchSession: (sessionId) => client.practiceSession(sessionId)
  });
  const { view } = runner;
  const [draft, setDraft] = useState<AnswerDraft>(null);
  const [dismissed, setDismissed] = useState<number | null>(null);

  const questionKey = view?.question ? `${view.sequence}:${view.question.id}` : null;
  useEffect(() => {
    setDraft(view?.question ? emptyDraft(view.question.answer) : null);
    // A new question on screen starts with an empty answer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionKey]);

  useEffect(() => {
    if (view) setDismissed((current) => Math.max(current ?? 0, readDismissed(view.sessionId)));
  }, [view]);

  const check = useCallback(() => {
    const question = view?.question;
    if (!question || !isDraftComplete(question.answer, draft)) return;
    const response: AnswerResponse = draft;
    void runner.act(
      (current, actionId) => client.practiceAnswer(current.sessionId, { actionId, revision: current.revision, questionId: question.id, response }),
      (data) => data.session
    );
  }, [client, draft, runner, view?.question]);

  const next = () => {
    if (!view) return;
    writeDismissed(view.sessionId, view.sequence);
    setDismissed(view.sequence);
    window.scrollTo({ top: 0 });
  };

  const targeted = view?.mode === 'targeted';
  const title = targeted ? 'Korda teemasid' : 'Harjuta';

  if (runner.error && !view) {
    return (
      <TextbookShell scope={scope} title={title} eyebrow='Harjutus' backHref={paths.unit(unitId)} backLabel='← Õppetükk'>
        <TextbookProblem error={runner.error} onRetry={runner.retry} retrying={runner.retrying} backHref={paths.unit(unitId)} backLabel='Tagasi õppetüki juurde' />
      </TextbookShell>
    );
  }
  if (!view) {
    return (
      <TextbookShell scope={scope} title={title} eyebrow='Harjutus' backHref={paths.unit(unitId)} backLabel='← Õppetükk'>
        <TextbookLoading text='Laadin harjutust…' />
      </TextbookShell>
    );
  }

  const feedback = view.lastFeedback;
  const showFeedback = Boolean(feedback) && dismissed !== null && dismissed < view.sequence;
  const progress = view.progress;
  const counter = practiceCounter(progress, showFeedback);

  return (
    <TextbookShell scope={scope} title={title} eyebrow={targeted ? 'Harjutus enne uut testi' : 'Harjutus'} backHref={paths.unit(unitId)} backLabel='← Õppetükk'>
      <TextbookProgress value={counter.done} total={counter.total} label={counter.headline} detail={counter.detail} />
      {targeted && view.status === 'active' ? (
        <details className='tb-panel tb-details'>
          <summary>Mida kordame?</summary>
          <ul className='tb-objective-list'>{view.objectives.map((objective) => <li key={objective.objectiveId}>{objective.description}</li>)}</ul>
        </details>
      ) : null}

      {runner.error ? <TextbookProblem error={runner.error} onRetry={runner.retry} retrying={runner.retrying} backHref={paths.unit(unitId)} backLabel='Tagasi õppetüki juurde' /> : null}

      {showFeedback && feedback ? (
        <section className='tb-card' aria-label='Vastuse kontroll' data-question-id={feedback.question.id}>
          <h2 className='tb-question-stem'>{feedback.question.stem}</h2>
          <AnswerFeedback
            question={feedback.question}
            response={feedback.response}
            correct={feedback.correct}
            correctResponse={feedback.correctResponse}
            explanation={feedback.explanation}
            misconception={feedback.misconception}
            objective={feedback.objective}
            correctionScheduled={feedback.correctionScheduled}
          />
          <button type='button' className='tb-button tb-button-primary tb-button-wide' onClick={next}>{view.status === 'completed' ? 'Vaata tulemust' : 'Edasi'}</button>
        </section>
      ) : view.status === 'completed' || !view.question ? (
        <section className='tb-result-card' data-result='practice-done' role='status'>
          <p className='tb-result-emoji' aria-hidden>🎉</p>
          <h2>Harjutus on tehtud!</h2>
          <p>{targeted ? 'Kordasid kõik teemad, mis testis ei õnnestunud. Nüüd saad testi uuesti teha.' : 'Kõik teemad said õigesti vastatud. Nüüd saad teha testi.'}</p>
          <div className='tb-actions'>
            {view.testUnlocked ? <Link className='tb-button tb-button-primary' href={paths.test(unitId)}>{targeted ? 'Tee test uuesti' : 'Tee test'}</Link> : null}
            <Link className='tb-button' href={paths.unit(unitId)}>Tagasi õppetüki juurde</Link>
          </div>
        </section>
      ) : (
        <>
          <QuestionCard
            key={questionKey}
            question={view.question}
            value={draft}
            onChange={setDraft}
            disabled={runner.busy}
            eyebrow={progress.answeredCount > 0 ? `Õigesti ${progress.correctCount}/${progress.answeredCount}` : undefined}
          />
          <div className='tb-sticky-actions'>
            <button type='button' className='tb-button tb-button-primary tb-button-wide' disabled={runner.busy || !isDraftComplete(view.question.answer, draft) || Boolean(runner.error)} onClick={check}>
              {runner.busy ? 'Kontrollin…' : 'Kontrolli'}
            </button>
          </div>
        </>
      )}
    </TextbookShell>
  );
}
