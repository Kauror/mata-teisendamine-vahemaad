'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useOffline } from '@/app/components/offline/OfflineProvider';
import { getConfirmedAttemptByClientId, getLocalAttempt } from '@/lib/offline/api';
import type { LocalAttempt } from '@/lib/offline/records';
import type { ServerAttempt } from '@/lib/shared/types';

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

  return (
    <main className='container' style={{ display: 'grid', gap: 16 }}>
      <section className='question-card' style={{ display: 'grid', gap: 12, textAlign: 'center' }}>
        <div style={{ fontSize: 44 }} aria-hidden>{percent >= 50 ? '🎉' : '💪'}</div>
        <h1>Harjutus tehtud!</h1>
        <p style={{ fontSize: 22, fontWeight: 900 }}>{attempt.score} / {attempt.questionCount} õiget</p>
        <div className='offline-stale-chip' style={{ justifySelf: 'center' }}>{status}</div>
        {result.kind === 'local' && !online && <p style={{ color: '#64748b', fontSize: 13 }}>Tähed liidetakse kontole, kui internet naaseb.</p>}
      </section>
      <div className='dashboard-footer-links'>
        <Link href={backHref} className='dashboard-history-link'>Tagasi</Link>
        {result.kind === 'confirmed'
          ? <Link href={`/history/${result.row.id}`} className='dashboard-history-link'>Vaata kinnitatud tulemust</Link>
          : <Link href='/history' className='dashboard-history-link'>Ajalugu</Link>}
      </div>
    </main>
  );
}
