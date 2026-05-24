'use client';
import Link from 'next/link';
import { ENGLISH_PACKS } from '@/lib/englishGame';
import { loadEnglishProgress } from '@/lib/englishProgress';
import { useEffect, useState } from 'react';

export default function PracticePacksPage() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [stars, setStars] = useState<Record<string, number>>({});
  useEffect(() => { const p = loadEnglishProgress(); setCompleted(p.completedPacks || []); const s: Record<string, number> = {}; Object.entries(p.packResults || {}).forEach(([id, v]) => s[id] = v.bestStars || 0); setStars(s); }, []);
  const unlocked = (id: string, idx: number) => idx === 0 || completed.includes(`pack-${idx}`);
  return <main className='container english-page'><section className='practice-shell english-shell'>
    <Link className='practice-back-button' href='/kiur/inglise-keel'>← Inglise keel</Link>
    <h1>Harjutamine</h1>
    <div className='pack-grid'>{ENGLISH_PACKS.map((p, i) => {
      const ok = unlocked(p.id, i+1);
      return ok ? <Link key={p.id} href={`/kiur/inglise-keel/harjutamine/${p.id}`} className='pack-card'><strong>{p.title}</strong><span>{stars[p.id] ? '★'.repeat(stars[p.id]) : 'Alusta'}</span></Link> : <div key={p.id} className='pack-card' aria-disabled><strong>{p.title}</strong><span>Lukus</span></div>;
    })}</div>
  </section></main>;
}
