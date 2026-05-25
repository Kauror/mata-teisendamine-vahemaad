'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadEnglishProgress } from '@/lib/englishProgress';

export default function KiurEnglishPage() {
  const [best, setBest] = useState(0);
  useEffect(() => { const p = loadEnglishProgress(); setBest(p.sprintBestScore || 0); }, []);
  return <main className='container english-page'><section className='practice-shell english-shell'>
    <Link className='practice-back-button' href='/kiur'>← Aine valik</Link>
    <header className='subject-header'><div className='subject-emoji'>🔤</div><h1>Inglise keel</h1></header>
    <div className='english-mode-grid'>
      <Link href='/kiur/inglise-keel/harjutamine' className='english-mode-card'><strong>Harjutamine</strong></Link>
      <Link href='/kiur/inglise-keel/sprint' className='english-mode-card'><strong>Sprint</strong></Link>
    </div>
    <p>Parim Sprint: {best}</p>
  </section></main>;
}
