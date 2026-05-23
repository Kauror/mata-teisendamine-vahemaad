'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CATEGORIES, DIFFICULTIES, QUESTION_COUNTS, Category, Difficulty } from '@/lib/types';
import { formatDateTime, formatElapsed } from '@/lib/validation';

type H = { id:number; createdAt:string; category:string; difficulty:string; questionCount:number; score:number; elapsedSeconds:number };

type View = 'avaleht'|'kiur'|'kiur-matemaatika'|'kirsi';

export default function Home() {
  const [history, setHistory] = useState<H[]>([]);
  const [view, setView] = useState<View>('avaleht');
  const [category, setCategory] = useState<Category>('Segaharjutus');
  const [difficulty, setDifficulty] = useState<Difficulty>('Keskmine');
  const [count, setCount] = useState(3);
  const [filter, setFilter] = useState('Kõik');
  useEffect(()=>{fetch('/api/history').then(r=>r.json()).then(setHistory); const v = new URLSearchParams(window.location.search).get('view'); if(v==='kiur'||v==='kiur-matemaatika'||v==='kirsi'||v==='avaleht') setView(v as View);},[]);
  const seed = Date.now();
  const groups = useMemo(()=>{const map = new Map<string,H[]>(); const now=new Date(); const today=now.toDateString(); const y=new Date(now); y.setDate(now.getDate()-1); const yesterday=y.toDateString();
    history.forEach((h)=>{const d=new Date(h.createdAt); const key=d.toDateString()===today?'Täna':d.toDateString()===yesterday?'Eile':d.toLocaleDateString('et-EE'); if(!map.has(key)) map.set(key,[]); map.get(key)!.push(h);}); return map;},[history]);
  const keys=['Kõik',...Array.from(groups.keys())];

  const deleteOne = async (id:number)=>{if(!confirm('Kas kustutada see test ajaloost?')) return; await fetch(`/api/history/${id}`,{method:'DELETE'}); setHistory((h)=>h.filter((x)=>x.id!==id));};

  return <main className='container'><h1>Pikkuste teisendamine</h1>
    {view==='avaleht' && <section className='card'><h2>Vali õppija</h2><div className='grid'><button type='button' className='profile' onClick={()=>setView('kiur')}>👦 Kiur</button><button type='button' className='profile' onClick={()=>setView('kirsi')}>👧 Kirsi</button></div></section>}
    {view==='kirsi' && <section className='card'><h2>Kirsi</h2><p>Kirsi tegevused tulevad hiljem.</p><button type="button" onClick={()=>setView('avaleht')}>Tagasi avalehele</button></section>}
    {view==='kiur' && <section className='card'><h2>Kiur</h2><button type='button' className='profile' onClick={()=>setView('kiur-matemaatika')}>📘 Matemaatika</button><button type="button" onClick={()=>setView('avaleht')}>Tagasi avalehele</button></section>}
    {view==='kiur-matemaatika' && <section className='card'><h2>Matemaatika</h2><p>Vali teema</p><div className='card'><h3>Pikkuste teisendamine</h3><p>Harjuta millimeetreid, sentimeetreid, detsimeetreid, meetreid ja kilomeetreid.</p></div>
      <h3>1. Harjutuse tüüp</h3><div className='grid'>{CATEGORIES.map(c=><button type="button" key={c} className={category===c?'chip active':'chip'} onClick={()=>setCategory(c)}>{c}</button>)}</div>
      <h3>2. Raskus</h3><div className='row'>{DIFFICULTIES.map(d=><button type="button" key={d} className={difficulty===d?'chip active':'chip'} onClick={()=>setDifficulty(d)}>{d}</button>)}</div>
      <h3>3. Küsimuste arv</h3><div className='row'>{QUESTION_COUNTS.map(q=><button type="button" key={q} className={count===q?'chip active':'chip'} onClick={()=>setCount(q)}>{q}</button>)}</div>
      <Link className='btn' href={`/test?learner=kiur&subject=matemaatika&topic=pikkus&category=${encodeURIComponent(category)}&difficulty=${difficulty}&count=${count}&seed=${seed}`}>Alusta</Link>
      <button type="button" onClick={()=>setView('kiur')}>Tagasi Kiuri juurde</button><button type="button" onClick={()=>setView('avaleht')}>Tagasi avalehele</button></section>}

    <section className='card'><h2>Testide ajalugu</h2><div className='row'>{keys.map((k)=><button type="button" key={k} className={filter===k?'chip active':'chip'} onClick={()=>setFilter(k)}>{k}</button>)}</div>
      {Array.from(groups.entries()).filter(([k])=>filter==='Kõik'||filter===k).map(([k,items])=><div key={k}><h3>{k}</h3><ul>{items.map(h=><li key={h.id}><Link href={`/history/${h.id}`}>{formatDateTime(h.createdAt)} • Kiur • Matemaatika • {h.category} • {h.difficulty} • {h.score}/{h.questionCount} • {Number.isFinite(h.elapsedSeconds)?formatElapsed(h.elapsedSeconds):'aeg puudub'}</Link> <button type="button" className='danger' onClick={()=>deleteOne(h.id)}>Kustuta</button></li>)}</ul></div>)}
      <button type="button" className='danger' onClick={async()=>{if(!confirm('Kas kustutame kogu ajaloo?'))return; await fetch('/api/history',{method:'DELETE'}); setHistory([]);}}>Kustuta kogu ajalugu</button>
    </section>
  </main>;
}
