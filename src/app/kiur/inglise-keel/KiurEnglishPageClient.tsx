'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { completedTodayFromHistory, ClientCompletionAttempt } from '@/lib/clientExerciseCompletion';
import { fetchBestEnglishSprintScore } from '@/lib/englishHistory';

export default function KiurEnglishPageClient({ sprintActive }: { sprintActive: boolean }) {
  const [best, setBest] = useState(0);
  const [doneToday, setDoneToday] = useState(false);

  useEffect(() => {
    if (!sprintActive) return;
    void fetchBestEnglishSprintScore()
      .then(setBest)
      .catch(() => setBest(0));
  }, [sprintActive]);

  useEffect(() => {
    if (!sprintActive) return;
    void fetch('/api/history')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((attempts: ClientCompletionAttempt[]) => setDoneToday(completedTodayFromHistory(attempts, 'kiur', 'kiur.english.sprint', { subject: 'inglise-keel', topic: 'sprint', category: 'Inglise keel - sprint' })))
      .catch(() => setDoneToday(false));
  }, [sprintActive]);

  return <main className='container english-page'><section className='practice-shell english-shell'>
    <Link className='practice-back-button' href='/kiur'>← Harjutused</Link>
    <header className='subject-header'><div className='subject-emoji'>🔤</div><h1>Inglise keel</h1></header>
    <div className='english-mode-grid'>
      {sprintActive ? (
        <Link href='/kiur/inglise-keel/sprint' className='english-mode-card'>
          {doneToday ? <span className='done-today-marker' aria-label='Täna tehtud'>✓</span> : null}
          <span className='english-mode-icon' aria-hidden>⚡</span><strong>Sprint</strong><span>Parim tulemus: {best}</span>
        </Link>
      ) : (
        <p className='recent-empty'>Harjutusi ei ole praegu aktiivne.</p>
      )}
    </div>
    <Link className='setup-history-link' href='/history'>📄 Ajalugu</Link>
  </section></main>;
}
