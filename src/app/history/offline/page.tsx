'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { getConfirmedAttempt } from '@/lib/offline/api';
import type { ServerAttempt } from '@/lib/shared/types';
import {
  reviewContext,
  resolveCorrectAnswer,
  resolveCorrectOrder,
  resolveUserAnswer,
  shouldAppendUnit,
  type ReviewQuestion
} from '@/lib/reviewAnswers';

function OfflineHistoryDetailContent() {
  const params = useSearchParams();
  const id = Number(params.get('id'));
  const [attempt, setAttempt] = useState<ServerAttempt | null | undefined>(undefined);

  useEffect(() => {
    if (!Number.isSafeInteger(id) || id < 1) { setAttempt(null); return; }
    void getConfirmedAttempt(id).then((row) => setAttempt(row ?? null)).catch(() => setAttempt(null));
  }, [id]);

  if (attempt === undefined) return <main className='container'><section className='question-card'>Laadin salvestatud tulemust…</section></main>;
  if (!attempt) return <main className='container'><section className='question-card'><h1>Tulemust ei leitud</h1><p>See kinnitatud tulemus ei ole selles seadmes salvestatud.</p><Link href='/history'>Ajalugu</Link></section></main>;

  const questions = Array.isArray(attempt.questions) ? attempt.questions as ReviewQuestion[] : [];
  const ctx = reviewContext(attempt);
  return (
    <main className='result-page'>
      <section className='result-shell'>
        <section className='result-summary-card'>
          <h1>Salvestatud tulemus</h1>
          <p className='result-score'>{attempt.score} / {attempt.questionCount} õiget</p>
          <p>See detail on saadaval ka võrguühenduseta.</p>
        </section>
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
          {questions.length === 0 && <p>Küsimuste detail puudub selles vanemas salvestuses.</p>}
        </section>
        <Link className='practice-back-button result-history-back-link' href='/history'>Ajalugu</Link>
      </section>
    </main>
  );
}

export default function OfflineHistoryDetailPage() {
  return <Suspense fallback={<main className='container'><section className='question-card'>Laadin salvestatud tulemust…</section></main>}><OfflineHistoryDetailContent /></Suspense>;
}
