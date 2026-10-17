'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TestResultView, TestSessionView, TextbookScope } from '@/lib/textbook/api';
import { formatStars } from '@/lib/formatStars';
import { starWord } from '@/lib/history';
import { AnswerFeedback } from '@/app/components/textbook/AnswerFeedback';
import { QuestionCard } from '@/app/components/textbook/AnswerInputs';
import { textbookPaths, type TextbookPaths } from '@/app/components/textbook/pages';
import { draftFrom, isDraftComplete, sameResponse, type AnswerDraft } from '@/app/components/textbook/responses';
import { correctWord, questionCountWord } from '@/app/components/textbook/status';
import { firstOpenQuestion, testAnsweredCount } from '@/app/components/textbook/testState';
import { TextbookLoading, TextbookProblem, TextbookProgress, TextbookShell } from '@/app/components/textbook/TextbookShell';
import { useLearnerClient, useSessionRunner } from '@/app/components/textbook/useTextbook';

const AUTOSAVE_MS = 600;

export function TestResult({ view, result, paths, scope }: { view: TestSessionView; result: TestResultView; paths: TextbookPaths; scope: TextbookScope }) {
  const unitId = view.unitId;
  return (
    <section className='tb-result-card' data-result={result.passed ? 'passed' : 'failed'} aria-labelledby='tb-result-title'>
      <p className='tb-result-emoji' aria-hidden>{result.passed ? '🎉' : '💪'}</p>
      <h2 id='tb-result-title'>{result.passed ? 'Test on läbitud!' : 'Seekord jäi test läbimata'}</h2>
      <p className='tb-result-score'><strong>{result.correct}/{result.total}</strong> {correctWord(result.correct)}</p>
      {result.passed ? (
        <>
          {result.nextUnitOpened && result.nextUnit ? (
            <p className='tb-result-next' role='status'>Järgmine õppetükk „{result.nextUnit.title}“ on nüüd avatud!</p>
          ) : null}
          {result.allUnitsPassed ? <p>Kõik õppetükid on läbitud. Uued ilmuvad siia, kui vanem need avaldab.</p> : null}
          {result.reward && result.reward.awardedAmount > 0 ? (
            <p className='tb-result-reward'>Teenisid <strong>+{formatStars(result.reward.awardedAmount)} ⭐</strong> {starWord(formatStars(result.reward.awardedAmount))}.{result.reward.held ? ' Tähed ootavad vanema kinnitust.' : ''}</p>
          ) : null}
          {scope === 'preview' ? <p className='tb-hint'>Eelvaates tähti ei anta.</p> : null}
        </>
      ) : (
        <>
          <p>Läbimiseks on vaja vähemalt {result.requiredCorrect === 1 ? '1 õige vastus' : `${result.requiredCorrect} õiget vastust`} {result.total}-st.</p>
          {result.missedObjectives.length > 0 ? (
            <div className='tb-revise'>
              <p className='tb-revise-title'>Korda neid teemasid:</p>
              <ul className='tb-objective-list'>{result.missedObjectives.map((objective) => <li key={objective.objectiveId}>{objective.description}</li>)}</ul>
            </div>
          ) : null}
        </>
      )}
      <div className='tb-actions'>
        {result.passed && result.nextUnitOpened && result.nextUnit ? <Link className='tb-button tb-button-primary' href={paths.unit(result.nextUnit.unitId)}>Ava järgmine õppetükk</Link> : null}
        {!result.passed ? <Link className='tb-button tb-button-primary' href={result.retakePracticeRequired ? paths.practice(unitId) : paths.test(unitId)}>{result.retakePracticeRequired ? 'Harjuta neid teemasid' : 'Tee test uuesti'}</Link> : null}
        <Link className='tb-button' href={paths.unit(unitId)}>Tagasi õppetüki juurde</Link>
      </div>
      {result.review.length > 0 ? (
        <details className='tb-details tb-review'>
          <summary>Vaata vastuseid</summary>
          <ol className='tb-review-list'>
            {result.review.map((item) => {
              const question = view.questions.find((candidate) => candidate.id === item.questionId);
              if (!question) return null;
              return (
                <li key={item.questionId} data-correct={item.correct ? 'true' : 'false'}>
                  <p className='tb-review-stem'>{question.stem}</p>
                  <AnswerFeedback question={question} response={item.response} correct={item.correct} correctResponse={item.correctResponse} explanation={item.explanation} compact />
                </li>
              );
            })}
          </ol>
        </details>
      ) : null}
    </section>
  );
}

export default function TextbookTest({ scope, courseId, unitId }: { scope: TextbookScope; courseId: string; unitId: string }) {
  const client = useLearnerClient(scope);
  const paths = textbookPaths(scope, courseId);
  const router = useRouter();
  const runner = useSessionRunner<TestSessionView>({
    scope,
    unitId,
    start: (actionId) => client.testStart(courseId, unitId, actionId),
    fetchSession: (sessionId) => client.testSession(sessionId)
  });
  const { view, act } = runner;
  const [index, setIndex] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<string, AnswerDraft>>({});
  const [confirming, setConfirming] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<number | null>(null);
  const viewRef = useRef(view);
  viewRef.current = view;
  const draftsRef = useRef(drafts);
  draftsRef.current = drafts;

  // Open on the first unanswered question (a resumed test continues there).
  useEffect(() => {
    if (view && index === null) setIndex(firstOpenQuestion(view));
  }, [index, view]);

  const questions = useMemo(() => view?.questions ?? [], [view?.questions]);
  const current = index !== null ? questions[index] : undefined;
  const draftFor = useCallback((questionId: string): AnswerDraft => {
    const question = questions.find((item) => item.id === questionId);
    if (!question) return null;
    return questionId in drafts ? drafts[questionId] : draftFrom(question.answer, view?.answers[questionId]);
  }, [drafts, questions, view?.answers]);

  // Save one answer if it is complete and differs from what the server has.
  const save = useCallback((questionId: string) => {
    const session = viewRef.current;
    const question = session?.questions.find((item) => item.id === questionId);
    const draft = draftsRef.current[questionId];
    if (!session || session.status !== 'active' || !question || !isDraftComplete(question.answer, draft)) return Promise.resolve();
    if (sameResponse(draft, session.answers[questionId] ?? null)) return Promise.resolve();
    return act(
      (latest, actionId) => client.testAnswer(latest.sessionId, { actionId, revision: latest.revision, questionId, response: draft }),
      (data) => data.session
    ).then(() => undefined);
  }, [act, client]);

  const flushCurrent = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    return current ? save(current.id) : Promise.resolve();
  }, [current, save]);

  const change = (next: AnswerDraft) => {
    if (!current) return;
    const questionId = current.id;
    setDrafts((all) => ({ ...all, [questionId]: next }));
    draftsRef.current = { ...draftsRef.current, [questionId]: next };
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      void save(questionId);
    }, AUTOSAVE_MS);
  };

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const goTo = (target: number) => {
    void flushCurrent();
    setConfirming(false);
    setIndex(Math.min(Math.max(target, 0), questions.length - 1));
    window.scrollTo({ top: 0 });
  };

  const pause = async () => {
    setLeaving(true);
    await flushCurrent();
    await runner.flush();
    router.push(paths.unit(unitId));
  };

  const submit = async () => {
    await flushCurrent();
    // Answers edited on other questions and not yet saved.
    await Promise.all(questions.map((question) => save(question.id)));
    await runner.flush();
    await act(
      (latest, actionId) => client.testSubmit(latest.sessionId, { actionId, revision: latest.revision }),
      (data) => data.session
    );
    setConfirming(false);
    window.scrollTo({ top: 0 });
  };

  if (runner.error && !view) {
    return (
      <TextbookShell scope={scope} title='Test' backHref={paths.unit(unitId)} backLabel='← Õppetükk'>
        <TextbookProblem error={runner.error} onRetry={runner.retry} retrying={runner.retrying} backHref={paths.unit(unitId)} backLabel='Tagasi õppetüki juurde' />
      </TextbookShell>
    );
  }
  if (!view || index === null) {
    return (
      <TextbookShell scope={scope} title='Test' backHref={paths.unit(unitId)} backLabel='← Õppetükk'>
        <TextbookLoading text='Laadin testi…' />
      </TextbookShell>
    );
  }

  if (view.status === 'submitted' && view.result) {
    return (
      <TextbookShell scope={scope} title='Testi tulemus' backHref={paths.unit(unitId)} backLabel='← Õppetükk'>
        <TestResult view={view} result={view.result} paths={paths} scope={scope} />
      </TextbookShell>
    );
  }

  const answered = testAnsweredCount(view, (questionId) => draftFor(questionId));
  const allAnswered = answered === view.total;
  const savedAll = view.answeredCount === view.total;

  return (
    <TextbookShell scope={scope} title='Test' eyebrow={`${view.total} ${questionCountWord(view.total)} · läbimiseks ${view.requiredCorrect} ${correctWord(view.requiredCorrect)}`} backHref={paths.unit(unitId)} backLabel='← Õppetükk'>
      <TextbookProgress value={answered} total={view.total} label='Vastatud' />

      {runner.error ? <TextbookProblem error={runner.error} onRetry={runner.retry} retrying={runner.retrying} backHref={paths.unit(unitId)} backLabel='Tagasi õppetüki juurde' /> : null}

      {current ? (
        <QuestionCard key={current.id} question={current} value={draftFor(current.id)} onChange={change} disabled={leaving || Boolean(runner.error)} eyebrow={`Küsimus ${index + 1}/${view.total}`} />
      ) : null}

      <nav className='tb-test-nav' aria-label='Testi küsimused'>
        <div className='tb-pager tb-pager-compact'>
          <button type='button' className='tb-button tb-button-small' disabled={index === 0} onClick={() => goTo(index - 1)}>← Eelmine</button>
          <span className='tb-pager-label'>{index + 1}/{view.total}</span>
          <button type='button' className='tb-button tb-button-small tb-button-primary' disabled={index === questions.length - 1} onClick={() => goTo(index + 1)}>Järgmine →</button>
        </div>

        <ol className='tb-test-grid' aria-label='Kõik küsimused'>
          {questions.map((question, position) => {
            const done = isDraftComplete(question.answer, draftFor(question.id));
            return (
              <li key={question.id}>
                <button
                  type='button'
                  className='tb-test-grid-button'
                  data-answered={done ? 'true' : 'false'}
                  aria-current={position === index ? 'true' : undefined}
                  aria-label={`Küsimus ${position + 1}${done ? ', vastatud' : ', vastamata'}`}
                  onClick={() => goTo(position)}
                >
                  {position + 1}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className='tb-test-actions'>
        {confirming ? (
          <div className='tb-confirm' role='alertdialog' aria-labelledby='tb-submit-q'>
            <p id='tb-submit-q'>Kas esitad testi? Pärast esitamist vastuseid enam muuta ei saa.</p>
            <div className='tb-actions'>
              <button type='button' className='tb-button tb-button-primary' disabled={runner.busy} onClick={() => void submit()}>{runner.busy ? 'Esitan…' : 'Jah, esita'}</button>
              <button type='button' className='tb-button' disabled={runner.busy} onClick={() => setConfirming(false)}>Ei, vaatan veel</button>
            </div>
          </div>
        ) : (
          <button type='button' className='tb-button tb-button-primary tb-button-wide' disabled={!allAnswered || leaving} onClick={() => setConfirming(true)}>Esita test</button>
        )}
        {!allAnswered ? <p className='tb-hint'>Esitada saab, kui kõik on vastatud. Vastamata: {view.total - answered}.</p> : null}
        {allAnswered && !savedAll && !runner.busy ? <p className='tb-hint'>Salvestan viimaseid vastuseid…</p> : null}
        <button type='button' className='tb-button tb-button-small tb-test-pause' disabled={leaving} onClick={() => void pause()}>{leaving ? 'Salvestan…' : 'Peata test'}</button>
      </div>
    </TextbookShell>
  );
}
