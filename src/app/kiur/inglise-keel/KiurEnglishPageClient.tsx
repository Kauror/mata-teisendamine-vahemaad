'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchBestEnglishSprintScore } from '@/lib/englishHistory';

export default function KiurEnglishPageClient({ sprintActive }: { sprintActive: boolean }) {
  const [best, setBest] = useState(0);

  useEffect(() => {
    if (!sprintActive) return;
    void fetchBestEnglishSprintScore()
      .then(setBest)
      .catch(() => setBest(0));
  }, [sprintActive]);

  return <main className='container english-page'><section className='practice-shell english-shell'>
    <Link className='practice-back-button' href='/kiur'>← Aine valik</Link>
    <header className='subject-header'><div className='subject-emoji'>🔤</div><h1>Inglise keel</h1></header>
    <div className='english-mode-grid'>
      {sprintActive ? (
        <Link href='/kiur/inglise-keel/sprint' className='english-mode-card'><span className='english-mode-icon' aria-hidden>⚡</span><strong>Sprint</strong><span>Parim tulemus: {best}</span></Link>
      ) : (
        <p className='recent-empty'>Harjutusi ei ole praegu aktiivne.</p>
      )}
    </div>
    <Link className='setup-history-link' href='/history'>📄 Ajalugu</Link>
  </section></main>;
}
