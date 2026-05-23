'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CATEGORIES, DIFFICULTIES, QUESTION_COUNTS, Category, Difficulty } from '@/lib/types';
import { formatDateTime, formatElapsed } from '@/lib/validation';

type H = { id:number; createdAt:string; category:string; difficulty:string; questionCount:number; score:number; elapsedSeconds:number };

export default function Home() {
  const [history, setHistory] = useState<H[]>([]);
  const [category, setCategory] = useState<Category>('Segaharjutus');
  const [difficulty, setDifficulty] = useState<Difficulty>('Keskmine');
  const [count, setCount] = useState(3);
  useEffect(()=>{fetch('/api/history').then(r=>r.json()).then(setHistory);},[]);
  const seed = useMemo(() => Date.now(), []);
  return <main className='container'><h1>Pikkuste harjutaja</h1><p>Harjuta pikkusühikuid samm-sammult!</p>
  <section className='card'><h3>1. Harjutuse tüüp</h3><div className='grid'>{CATEGORIES.map(c=><button key={c} className={category===c?'chip active':'chip'} onClick={()=>setCategory(c)}>{c}</button>)}</div>
  <h3>2. Raskus</h3><div className='row'>{DIFFICULTIES.map(d=><button key={d} className={difficulty===d?'chip active':'chip'} onClick={()=>setDifficulty(d)}>{d}</button>)}</div>
  <h3>3. Küsimuste arv</h3><div className='row'>{QUESTION_COUNTS.map(q=><button key={q} className={count===q?'chip active':'chip'} onClick={()=>setCount(q)}>{q}</button>)}</div>
  <p><strong>{category} · {difficulty} · {count} küsimust</strong></p>
  <Link className='btn' href={`/test?category=${encodeURIComponent(category)}&difficulty=${difficulty}&count=${count}&seed=${seed}`}>Alusta</Link></section>
  <section className='card'><h2>Testide ajalugu</h2>{history.length===0?<p>Ajalugu puudub.</p>:<ul>{history.map(h=><li key={h.id}><Link href={`/history/${h.id}`}>{formatDateTime(h.createdAt)} • {h.category} • {h.difficulty} • {h.score}/{h.questionCount} • {Number.isFinite(h.elapsedSeconds)?formatElapsed(h.elapsedSeconds):'aeg puudub'}</Link></li>)}</ul>}<button className='danger' onClick={async()=>{if(!confirm('Kas kustutame kogu ajaloo?'))return; await fetch('/api/history',{method:'DELETE'}); setHistory([]);}}>Kustuta ajalugu</button></section></main>;
}
