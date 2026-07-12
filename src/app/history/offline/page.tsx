'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { getConfirmedAttempt } from '@/lib/offline/api';
import type { ServerAttempt } from '@/lib/shared/types';

type ReviewQuestion = {
  id?: string;
  question?: string;
  userAnswer?: string;
  selectedWord?: string;
  selectedAnswer?: string;
  correctAnswerText?: string;
  correctWord?: string;
  isCorrect?: boolean;
};

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
  return (
    <main className='result-page'>
      <section className='result-shell'>
        <section className='result-summary-card'>
          <h1>Salvestatud tulemus</h1>
          <p className='result-score'>{attempt.score} / {attempt.questionCount} õiget</p>
          <p>See detail on saadaval ka võrguühenduseta.</p>
        </section>
        <section className='result-list'>
          {questions.map((question, index) => (
            <article key={question.id ?? index} className={question.isCorrect ? 'result-review-card correct' : 'result-review-card wrong'}>
              <p className='result-question'>{index + 1}. {question.question ?? 'Küsimus'}</p>
              <p className='answer-line'><span>Sinu vastus:</span> <strong>{question.userAnswer ?? question.selectedWord ?? question.selectedAnswer ?? '—'}</strong></p>
              <p className='answer-line'><span>Õige vastus:</span> <strong>{question.correctAnswerText ?? question.correctWord ?? '—'}</strong></p>
            </article>
          ))}
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
