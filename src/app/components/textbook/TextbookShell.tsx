'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import type { TextbookScope } from '@/lib/textbook/api';
import PeekModeBanner from '@/app/components/PeekModeBanner';
import type { TextbookClientError } from '@/app/components/textbook/textbookClient';

// The frame every textbook screen shares: page background, card column, a way
// back, and the banner that says whose data this is — the peek banner on the
// child's screens, the preview banner in the parent preview.
export function TextbookShell({ scope, title, eyebrow, backHref, backLabel, children, wide = false }: {
  scope: TextbookScope;
  title?: string;
  eyebrow?: string;
  backHref: string;
  backLabel: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <main className='tb-page' data-scope={scope}>
      <section className={wide ? 'tb-shell tb-shell-wide' : 'tb-shell'}>
        <Link className='practice-back-button tb-back' href={backHref}>{backLabel}</Link>
        {scope === 'preview' ? <PreviewBanner /> : <PeekModeBanner />}
        {title ? (
          <header className='tb-header'>
            {eyebrow ? <p className='tb-eyebrow'>{eyebrow}</p> : null}
            <h1>{title}</h1>
          </header>
        ) : null}
        {children}
      </section>
    </main>
  );
}

export function PreviewBanner() {
  return (
    <div className='tb-preview-banner' role='status'>
      <span aria-hidden>👁️</span>
      <span className='tb-preview-banner-text'><strong>Eelvaade — lapse andmeid ei muudeta.</strong> Tähti ei anta ja lapse õppetükid ei avane.</span>
      <Link className='tb-preview-banner-link' href='/vanem'>Vanema ala</Link>
    </div>
  );
}

export function TextbookProblem({ error, onRetry, retrying = false, backHref, backLabel }: {
  error: TextbookClientError;
  onRetry?: () => void;
  retrying?: boolean;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div className='tb-problem' role='alert' data-error-code={error.code}>
      <p>{error.message}</p>
      {error.problems && error.problems.length > 0 ? (
        <ul className='tb-problem-list'>{error.problems.map((problem, index) => <li key={index}>{problem.message}</li>)}</ul>
      ) : null}
      <div className='tb-actions'>
        {error.retryable && onRetry ? <button type='button' className='tb-button tb-button-primary' disabled={retrying} onClick={onRetry}>{retrying ? 'Proovin…' : 'Proovi uuesti'}</button> : null}
        <Link className='tb-button' href={backHref}>{backLabel}</Link>
      </div>
    </div>
  );
}

export function TextbookLoading({ text }: { text: string }) {
  return <p className='tb-loading' role='status'>{text}</p>;
}

export function TextbookProgress({ value, total, label }: { value: number; total: number; label: string }) {
  const percent = total > 0 ? Math.round((Math.min(value, total) / total) * 100) : 0;
  return (
    <div className='tb-progress'>
      <div className='tb-progress-row'>
        <span>{label}</span>
        <strong>{value}/{total}</strong>
      </div>
      <div className='tb-progress-track' role='progressbar' aria-label={label} aria-valuemin={0} aria-valuemax={total} aria-valuenow={value}>
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
