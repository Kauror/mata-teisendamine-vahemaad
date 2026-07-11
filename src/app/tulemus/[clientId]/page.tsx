'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { getLocalAttempt } from '@/lib/offline/api';
import { useOffline } from '@/app/components/offline/OfflineProvider';
import type { LocalAttempt } from '@/lib/offline/records';

// Local result view for an attempt finished offline (or before its sync
// confirms). Reads straight from IndexedDB; the confirmed server view lives at
// /history/[id] once the attempt has synced.
export default function LocalResultPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const { pendingCount, online } = useOffline();
  const [attempt, setAttempt] = useState<LocalAttempt | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    void getLocalAttempt(clientId).then((row) => { if (!cancelled) setAttempt(row ?? null); });
    return () => { cancelled = true; };
  }, [clientId, pendingCount]);

  if (attempt === undefined) {
    return <main className="container"><section className="question-card">Laadin tulemust…</section></main>;
  }
  if (attempt === null) {
    // Already synced and cleared → its confirmed page is the source of truth.
    return (
      <main className="container" style={{ display: 'grid', gap: 16, placeItems: 'center', minHeight: '50vh', textAlign: 'center' }}>
        <h1>Tulemus on salvestatud</h1>
        <p>See harjutus on sünkroonitud. Vaata seda ajaloost.</p>
        <Link href="/history" className="dashboard-history-link">Ava ajalugu</Link>
      </main>
    );
  }

  const percent = attempt.questionCount > 0 ? Math.round((attempt.score / attempt.questionCount) * 100) : 0;
  const backHref = attempt.learner === 'kirsi' ? '/kirsi' : attempt.learner === 'kiur' ? '/kiur' : '/';

  return (
    <main className="container" style={{ display: 'grid', gap: 16 }}>
      <section className="question-card" style={{ display: 'grid', gap: 12, textAlign: 'center' }}>
        <div style={{ fontSize: 44 }} aria-hidden>{percent >= 50 ? '🎉' : '💪'}</div>
        <h1>Harjutus tehtud!</h1>
        <p style={{ fontSize: 22, fontWeight: 900 }}>{attempt.score} / {attempt.questionCount} õiget</p>
        <div className="offline-stale-chip" style={{ justifySelf: 'center' }}>
          {attempt.status === 'pending' || attempt.status === 'syncing'
            ? 'Ootab sünkroonimist'
            : attempt.status === 'needs_review'
              ? 'Vajab ülevaatamist'
              : 'Salvestatud'}
        </div>
        {!online && <p style={{ color: '#64748b', fontSize: 13 }}>Tähed liidetakse kontole, kui internet naaseb.</p>}
      </section>
      <div className="dashboard-footer-links">
        <Link href={backHref} className="dashboard-history-link">Tagasi</Link>
        <Link href="/history" className="dashboard-history-link">Ajalugu</Link>
      </div>
    </main>
  );
}
