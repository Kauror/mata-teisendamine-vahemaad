'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CATEGORIES, DIFFICULTIES, QUESTION_COUNTS, Category, Difficulty } from '@/lib/types';
import { formatDateTime, formatElapsed } from '@/lib/validation';

type HistoryItem = { id:number; createdAt:string; category:string; difficulty:string; questionCount:number; score:number; elapsedSeconds:number };

export default function Home() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [category, setCategory] = useState<Category>('Teisendamine');
  const [difficulty, setDifficulty] = useState<Difficulty>('Lihtne');
  const [count, setCount] = useState(5);

  useEffect(() => { fetch('/api/history').then((r) => r.json()).then(setHistory); }, []);

  const clearAll = async () => {
    if (!window.confirm('Kas oled kindel, et soovid kogu ajaloo kustutada?')) return;
    await fetch('/api/history', { method: 'DELETE' });
    setHistory([]);
  };

  return <main className="container"><h1>Pikkuste harjutaja</h1><p>Vali sobiv harjutus ja alusta!</p>
    <section className="card">
      <label>Kategooria</label><select value={category} onChange={(e)=>setCategory(e.target.value as Category)}>{CATEGORIES.map((c)=><option key={c}>{c}</option>)}</select>
      <label>Raskus</label><select value={difficulty} onChange={(e)=>setDifficulty(e.target.value as Difficulty)}>{DIFFICULTIES.map((d)=><option key={d}>{d}</option>)}</select>
      <label>Küsimuste arv</label><div className="row">{QUESTION_COUNTS.map((q)=><button type="button" key={q} className={count===q?'chip active':'chip'} onClick={()=>setCount(q)}>{q}</button>)}</div>
      <Link className="btn" href={`/test?category=${encodeURIComponent(category)}&difficulty=${difficulty}&count=${count}`}>Alusta</Link>
    </section>
    <section className="card"><h2>Testide ajalugu</h2>
      {history.length===0 ? <p>Ajalugu puudub.</p> : <ul>{history.map((h)=><li key={h.id}><Link href={`/history/${h.id}`}>{formatDateTime(h.createdAt)} • {h.category} • {h.difficulty} • {h.questionCount} küsimust • {h.score}/{h.questionCount} • {formatElapsed(h.elapsedSeconds)}</Link></li>)}</ul>}
      <button className="danger" onClick={clearAll}>Kustuta ajalugu</button>
    </section></main>;
}
