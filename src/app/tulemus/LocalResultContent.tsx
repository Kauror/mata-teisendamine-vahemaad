'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Celebration from '@/app/components/Celebration';
import { useOffline } from '@/app/components/offline/OfflineProvider';
import { getConfirmedAttemptByClientId, getLocalAttempt } from '@/lib/offline/api';
import type { LocalAttempt } from '@/lib/offline/records';
import type { ServerAttempt } from '@/lib/shared/types';
import { HELD_REWARD_MESSAGE, isHeldReward } from '@/lib/history';
import {
  reviewContext,
  resolveCorrectAnswer,
  resolveCorrectOrder,
  resolveUserAnswer,
  shouldAppendUnit,
  type ReviewQuestion
} from '@/lib/reviewAnswers';

type ResultRecord =
  | { kind: 'local'; row: LocalAttempt }
  | { kind: 'confirmed'; row: ServerAttempt }
  | null;

export default function LocalResultContent({ clientId }: { clientId: string | null }) {
  const { pendingCount, online } = useOffline();
  const [result, setResult] = useState<ResultRecord | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    if (!clientId) {
      setResult(null);
      return () => { cancelled = true; };
    }
    void Promise.all([getLocalAttempt(clientId), getConfirmedAttemptByClientId(clientId)])
      .then(([local, confirmed]) => {
        if (!cancelled) setResult(local ? { kind: 'local', row: local } : confirmed ? { kind: 'confirmed', row: confirmed } : null);
      })
      .catch(() => { if (!cancelled) setResult(null); });
    return () => { cancelled = true; };
  }, [clientId, pendingCount]);

  if (result === undefined) return <main className='container'><section className='question-card'>Laadin tulemust…</section></main>;
  if (result === null) {
    return (
      <main className='container' style={{ display: 'grid', gap: 16, placeItems: 'center', minHeight: '50vh', textAlign: 'center' }}>
        <h1>Tulemust ei leitud</h1>
        <p>See tulemus ei ole selles seadmes salvestatud.</p>
        <Link href='/history' className='dashboard-history-link'>Ava ajalugu</Link>
      </main>
    );
  }

  const attempt = result.row;
  const percent = attempt.questionCount > 0 ? Math.round((attempt.score / attempt.questionCount) * 100) : 0;
  const backHref = attempt.learner === 'kirsi' ? '/kirsi' : attempt.learner === 'kiur' ? '/kiur' : '/';
  const local = result.kind === 'local' ? result.row : null;
  const status = result.kind === 'confirmed'
    ? 'Sünkroonitud'
    : local?.status === 'pending' || local?.status === 'syncing'
      ? 'Ootab sünkroonimist'
      : local?.status === 'needs_review'
        ? 'Vajab ülevaatamist'
        : local?.status === 'rejected'
          ? 'Tagasi lükatud'
          : 'Salvestatud';
  // The stars are held pending parent approval when the confirmed server row is
  // withheld/needs_review, or the local attempt was flagged for review (RTM3-H02).
  const isHeld = result.kind === 'confirmed'
    ? isHeldReward(result.row.rewardSettlementStatus)
    : local?.status === 'needs_review';

  const questions = Array.isArray(attempt.questions) ? attempt.questions as ReviewQuestion[] : [];
  const ctx = reviewContext(attempt);
  const isPerfect = attempt.questionCount > 0 && attempt.score === attempt.questionCount;

  return (
    <main className='container' style={{ display: 'grid', gap: 16 }}>
      {/* Every question right — the only score that gets the cannon. */}
      {isPerfect ? <Celebration /> : null}
      <section className='question-card' style={{ display: 'grid', gap: 12, textAlign: 'center' }}>
        <div style={{ fontSize: 44 }} aria-hidden>{percent >= 50 ? '🎉' : '💪'}</div>
        <h1>Harjutus tehtud!</h1>
        <p style={{ fontSize: 22, fontWeight: 900 }}>{attempt.score} / {attempt.questionCount} õiget</p>
        <div className='offline-stale-chip' style={{ justifySelf: 'center' }}>{status}</div>
        {isHeld && <p className='result-held-notice' role='status'>{HELD_REWARD_MESSAGE}</p>}
        {result.kind === 'local' && !online && !isHeld && <p style={{ color: '#64748b', fontSize: 13 }}>Tähed liidetakse kontole, kui internet naaseb.</p>}
      </section>
      {questions.length > 0 && (
        <section className='result-list'>
          {questions.map((question, index) => {
            const unit = shouldAppendUnit(question, ctx) ? ` ${question.expectedUnit || ''}` : '';
            return (
              <article key={question.id ?? index} className={question.isCorrect ? 'result-review-card correct' : 'result-review-card wrong'}>
                <p className='result-question'>{index + 1}. {question.question ?? 'Küsimus'}</p>
                {question.kind === 'ordering'
                  ? <div className='answer-review-grid'><p className='answer-line'><span>Sinu järjestus:</span> <strong>{resolveUserAnswer(question) || '—'}</strong></p><p className='answer-line'><span>Õige järjestus:</span> <strong>{resolveCorrectOrder(question) || '—'}</strong></p></div>
                  : <div className='answer-review-grid'><p className='answer-line'><span>Sinu vastus:</span> <strong>{resolveUserAnswer(question) || '—'}{unit}</strong></p><p className='answer-line'><span>Õige vastus:</span> <strong>{resolveCorrectAnswer(question, ctx)}{unit}</strong></p></div>}
                <p className={question.isCorrect ? 'result-status correct' : 'result-status wrong'}>{question.isCorrect ? 'Õige' : 'Vale vastus'}</p>
                {question.explanation && <p className='answer-line'><span>Selgitus:</span> <strong>{question.explanation}</strong></p>}
              </article>
            );
          })}
        </section>
      )}
      <div className='dashboard-footer-links'>
        <Link href={backHref} className='dashboard-history-link'>Tagasi</Link>
        {result.kind === 'confirmed'
          ? <Link href={`/history/offline?id=${result.row.id}`} className='dashboard-history-link'>Vaata kinnitatud tulemust</Link>
          : <Link href='/history' className='dashboard-history-link'>Ajalugu</Link>}
      </div>
    </main>
  );
}
