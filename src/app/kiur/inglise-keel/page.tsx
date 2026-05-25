'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function KiurEnglishPage() {
  const [best, setBest] = useState(0);
  useEffect(() => {
    void fetch('/api/history')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rows: Array<{ subject?: string | null; topic?: string | null; score?: number }>) => {
        const sprintScores = rows
          .filter((row) => row.subject === 'inglise-keel' && row.topic === 'sprint')
          .map((row) => (typeof row.score === 'number' ? row.score : 0));
        setBest(sprintScores.length ? Math.max(...sprintScores) : 0);
      })
      .catch(() => setBest(0));
  }, []);
  return <main className='container english-page'><section className='practice-shell english-shell'>
    <Link className='practice-back-button' href='/kiur'>← Aine valik</Link>
    <header className='subject-header'><div className='subject-emoji'>🔤</div><h1>Inglise keel</h1></header>
    <div className='english-mode-grid'>
      <Link href='/kiur/inglise-keel/sprint' className='english-mode-card'><strong>Sprint</strong></Link>
    </div>
    <p>Parim Sprint: {best}</p>
    <Link className='setup-history-link' href='/history'>📄 Vaata ajalugu</Link>
  </section></main>;
}
