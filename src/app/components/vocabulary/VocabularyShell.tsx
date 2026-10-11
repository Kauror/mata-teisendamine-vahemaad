'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { VOCAB_HOME_ROUTE } from '@/lib/vocabulary/constants';
import type { VocabSessionError } from '@/app/components/vocabulary/useVocabSession';

// The frame every vocabulary screen shares: the app's English page background,
// the practice card and a way back to the unit list.
export function VocabularyShell({ title, eyebrow, children, backHref = VOCAB_HOME_ROUTE, backLabel = '← Õppetükid' }: {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <main className='english-page vocab-page'>
      <section className='practice-shell english-shell vocab-shell'>
        <Link className='practice-back-button' href={backHref}>{backLabel}</Link>
        {title ? (
          <header className='vocab-header'>
            {eyebrow ? <p className='vocab-eyebrow'>{eyebrow}</p> : null}
            <h1>{title}</h1>
          </header>
        ) : null}
        {children}
      </section>
    </main>
  );
}

export function VocabularyProblem({ error, onRetry }: { error: VocabSessionError; onRetry: () => void }) {
  return (
    <div className='vocab-problem' role='alert'>
      <p>{error.message}</p>
      {error.retryable ? <button type='button' className='start-button' onClick={onRetry}>Proovi uuesti</button> : null}
      <Link className='vocab-secondary-button' href={VOCAB_HOME_ROUTE}>Tagasi õppetükkide juurde</Link>
    </div>
  );
}

export function VocabularyProgress({ value, total, label }: { value: number; total: number; label: string }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className='vocab-progress'>
      <div className='vocab-progress-row'>
        <span>{label}</span>
        <strong>{value}/{total}</strong>
      </div>
      <div className='vocab-progress-track' role='progressbar' aria-label={label} aria-valuemin={0} aria-valuemax={total} aria-valuenow={value}>
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
