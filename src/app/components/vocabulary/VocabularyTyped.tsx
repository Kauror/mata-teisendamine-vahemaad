'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Celebration from '@/app/components/Celebration';
import { useVocabSession } from '@/app/components/vocabulary/useVocabSession';
import { VocabularyProblem, VocabularyProgress, VocabularyShell } from '@/app/components/vocabulary/VocabularyShell';
import { formatStars } from '@/lib/formatStars';
import { VOCAB_ALL_PASSED_MESSAGE, VOCAB_HOME_ROUTE } from '@/lib/vocabulary/constants';
import type { TypedFeedback } from '@/lib/vocabulary/engine';

// The typed-answer screens: the unit test and "Korda eksitud sõnu". One word at
// a time, no timer, no score race.

function Feedback({ feedback }: { feedback: TypedFeedback }) {
  if (feedback.correct) {
    return (
      <div className='vocab-feedback' data-correct='true' role='status'>
        <p className='vocab-feedback-title'>✓ Õige</p>
        <p lang='en'><strong>{feedback.expected}</strong>{feedback.pronunciation ? <span className='vocab-feedback-pronunciation'> {feedback.pronunciation}</span> : null}</p>
      </div>
    );
  }
  return (
    <div className='vocab-feedback' data-correct='false' role='status'>
      <p className='vocab-feedback-title'>Vastus vajab kordamist</p>
      <p>Sinu vastus: <strong lang='en'>{feedback.answer.trim() || '—'}</strong></p>
      <p>Õige vastus: <strong lang='en'>{feedback.expected}</strong>{feedback.pronunciation ? <span className='vocab-feedback-pronunciation'> {feedback.pronunciation}</span> : null}</p>
    </div>
  );
}

function AnswerForm({ estonian, feedback, busy, onAnswer, onContinue }: {
  estonian: string;
  feedback: TypedFeedback | null;
  busy: boolean;
  onAnswer: (answer: string) => void;
  onContinue: () => void;
}) {
  const [answer, setAnswer] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus never leaves the answer field: during feedback it is read-only and
  // Enter (or "Edasi") continues. Moving focus to a button would close the
  // on-screen keyboard on iPhone/iPad, and iOS does not reopen it for a
  // focus() that does not come from a tap.
  useEffect(() => {
    if (!feedback) setAnswer('');
    inputRef.current?.focus();
  }, [feedback, estonian]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (feedback) onContinue();
    else if (answer.trim()) onAnswer(answer);
  };

  return (
    <form className='vocab-answer-card' onSubmit={submit}>
      <p className='vocab-prompt-word' lang='et'>{estonian}</p>
      <label className='vocab-answer-label' htmlFor='vocab-answer'>Kirjuta inglise keeles:</label>
      <input
        ref={inputRef}
        id='vocab-answer'
        className='vocab-answer-input'
        lang='en'
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        readOnly={Boolean(feedback)}
        maxLength={200}
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='none'
        spellCheck={false}
        enterKeyHint={feedback ? 'next' : 'done'}
        data-state={feedback ? (feedback.correct ? 'correct' : 'wrong') : undefined}
      />
      {feedback ? <Feedback feedback={feedback} /> : null}
      {feedback
        ? <button type='submit' className='next-button' disabled={busy}>Edasi</button>
        : <button type='submit' className='start-button' disabled={busy || !answer.trim()}>Kontrolli</button>}
    </form>
  );
}

export function VocabularyTest({ unitId }: { unitId: string }) {
  const { view, error, busy, send, retry, retrying } = useVocabSession({ unitId, mode: 'test' });
  if (error) return <VocabularyShell title='Test'><VocabularyProblem error={error} onRetry={retry} retrying={retrying} /></VocabularyShell>;
  if (!view?.test) return <VocabularyShell title='Test'><p className='vocab-loading'>Laadin testi…</p></VocabularyShell>;

  const test = view.test;
  const unitLabel = view.unit?.label ?? '';

  if (test.phase === 'passed' && test.lastRound) {
    return (
      <VocabularyShell eyebrow={unitLabel} title='Test läbitud!'>
        <Celebration />
        <div className='vocab-summary' role='status'>
          <p className='vocab-summary-big'><strong>{test.lastRound.correct}/{test.lastRound.total} õigesti — {test.lastRound.percent}%</strong></p>
          <p>{unitLabel} on läbitud.</p>
          {test.firstRound && test.round > 1 ? <p>Esimesel korral: {test.firstRound.correct}/{test.firstRound.total}. Läbisid {test.round}. katsega.</p> : null}
          {view.nextUnit
            ? <p>{view.nextUnitOpened ? `${view.nextUnit.label} on nüüd avatud.` : `Järgmine: ${view.nextUnit.label}`}</p>
            : view.allUnitsPassed ? <p>{VOCAB_ALL_PASSED_MESSAGE}</p> : null}
        </div>
        {test.counted === false ? (
          <div className='vocab-reward'>
            <p>Täna on selle õppetüki test juba arvesse läinud. See kord oli harjutamiseks — tähti ja võistluse punkti see ei too.</p>
          </div>
        ) : null}
        {view.reward ? (
          <div className='vocab-reward' data-held={view.reward.held}>
            {view.reward.held
              ? <p>Tähed ootavad vanema kinnitust.</p>
              : view.reward.awardedAmount > 0
              ? <p>Teenitud: <strong>+{formatStars(view.reward.awardedAmount)} ⭐</strong> · Tähed kokku: {formatStars(view.reward.balanceAfter)} ⭐</p>
              : <p>Selle eest tänaseid tähti enam ei tule, aga test on läbitud.</p>}
          </div>
        ) : null}
        <div className='vocab-actions'>
          {view.nextUnit ? <Link className='start-button vocab-start-link' href={`${VOCAB_HOME_ROUTE}/${view.nextUnit.id}/opi`}>Alusta: {view.nextUnit.label}</Link> : null}
          <Link className={view.nextUnit ? 'vocab-secondary-button' : 'start-button vocab-start-link'} href={VOCAB_HOME_ROUTE}>Tagasi õppetükkide juurde</Link>
        </div>
      </VocabularyShell>
    );
  }

  if (test.phase === 'full_summary' && test.lastRound) {
    const wrong = test.lastRound.wrongCount;
    return (
      <VocabularyShell eyebrow={unitLabel} title={`${test.lastRound.correct}/${test.lastRound.total} õigesti`}>
        <div className='vocab-summary' role='status'>
          <p>Läbimiseks on vaja {test.requiredCorrect}/{test.total}.</p>
          <p>Kordame kõigepealt {wrong} sõna.</p>
          <p>Seejärel proovid kõiki {test.total} sõna uuesti.</p>
        </div>
        <div className='vocab-actions'>
          <button type='button' className='start-button' disabled={busy} onClick={() => void send({ type: 'continue' })}>Alusta kordamist</button>
        </div>
      </VocabularyShell>
    );
  }

  if (test.phase === 'correction_summary') {
    return (
      <VocabularyShell eyebrow={unitLabel} title='Parandused tehtud!'>
        <div className='vocab-summary' role='status'>
          <p>Kõik eksitud sõnad on nüüd õigesti kirjutatud.</p>
          <p>Nüüd proovid kõiki {test.total} sõna uuesti.</p>
        </div>
        <div className='vocab-actions'>
          <button type='button' className='start-button' disabled={busy} onClick={() => void send({ type: 'continue' })}>Alusta testi</button>
        </div>
      </VocabularyShell>
    );
  }

  const correcting = test.phase === 'correction';
  return (
    <VocabularyShell eyebrow={unitLabel} title={correcting ? 'Parandamine' : 'Test'}>
      <VocabularyProgress
        value={Math.min(test.position, test.queueLength)}
        total={test.queueLength}
        label={correcting ? 'Parandatavad sõnad' : test.round > 1 ? `${test.round}. katse` : 'Sõnad'}
      />
      {test.prompt ? (
        <AnswerForm
          estonian={test.prompt.estonian}
          feedback={test.feedback}
          busy={busy}
          onAnswer={(answer) => void send({ type: 'answer', answer })}
          onContinue={() => void send({ type: 'continue' })}
        />
      ) : null}
      {!correcting ? <p className='vocab-keyboard-hint'>Läbimiseks on vaja {test.requiredCorrect}/{test.total} õiget vastust ühe korraga.</p> : null}
    </VocabularyShell>
  );
}

export function VocabularyPractice({ unitId }: { unitId: string | null }) {
  const { view, error, busy, send, retry, retrying } = useVocabSession({ unitId, mode: 'practice' });
  const title = 'Korda eksitud sõnu';
  if (error) return <VocabularyShell title={title}><VocabularyProblem error={error} onRetry={retry} retrying={retrying} /></VocabularyShell>;
  if (!view?.practice) return <VocabularyShell title={title}><p className='vocab-loading'>Laadin sõnu…</p></VocabularyShell>;
  const practice = view.practice;

  if (practice.completed) {
    return (
      <VocabularyShell eyebrow={view.unit?.label} title='Kordamine tehtud!'>
        <div className='vocab-summary' role='status'>
          {practice.total > 0 ? <p className='vocab-summary-big'>Esimesel katsel õigesti: <strong>{practice.firstTryCorrect}/{practice.total}</strong></p> : null}
          <p>{practice.total === 0 ? 'Kordamist vajavaid sõnu enam ei ole.' : practice.total === 1 ? 'Sõna sai lõpuks õigesti kirjutatud.' : `Kõik ${practice.total} sõna said lõpuks õigesti kirjutatud.`}</p>
        </div>
        <div className='vocab-actions'>
          <Link className='start-button vocab-start-link' href={VOCAB_HOME_ROUTE}>Tagasi õppetükkide juurde</Link>
        </div>
      </VocabularyShell>
    );
  }

  return (
    <VocabularyShell eyebrow={view.unit?.label} title={title}>
      <VocabularyProgress value={practice.masteredCount} total={practice.total} label='Õigesti kirjutatud' />
      {practice.prompt ? (
        <AnswerForm
          estonian={practice.prompt.estonian}
          feedback={practice.feedback}
          busy={busy}
          onAnswer={(answer) => void send({ type: 'answer', answer })}
          onContinue={() => void send({ type: 'continue' })}
        />
      ) : null}
    </VocabularyShell>
  );
}
