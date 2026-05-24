'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ENGLISH_VOCABULARY_COUNT } from '@/lib/englishVocabulary';
import { loadEnglishProgress } from '@/lib/englishProgress';

export default function KiurEnglishPage() {
  const [best, setBest] = useState(0);
  const [learned, setLearned] = useState(0);
  useEffect(() => { const p = loadEnglishProgress(); setBest(p.sprintBestScore || 0); setLearned(Object.values(p.wordStats).filter((w) => w.mastered).length); }, []);
  return <main className='container english-page'><section className='practice-shell english-shell'>
    <Link className='practice-back-button' href='/kiur'>← Aine valik</Link>
    <header className='subject-header'><div className='subject-emoji'>🔤</div><h1>Inglise keel</h1></header>
    <div className='english-mode-grid'>
      <Link href='/kiur/inglise-keel/harjutamine' className='english-mode-card'><strong>✅ Harjutamine</strong><span>Rahulik õpperežiim</span></Link>
      <Link href='/kiur/inglise-keel/sprint' className='english-mode-card'><strong>⚡ Sprint</strong><span>90-sekundiline väljakutse</span></Link>
    </div>
    <p>Õpitud sõnu: {learned} / {ENGLISH_VOCABULARY_COUNT}</p>
    <p>Parim Sprint: {best}</p>
  </section></main>;
}
