import Link from 'next/link';
import db from '@/lib/db';
import { formatDateTime, formatElapsed } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export default async function HistoryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = db.prepare('SELECT * FROM attempts WHERE id = ?').get(id) as { [key:string]: unknown } | undefined;
  if (!row) return <main className='container'><div className='card'><p>Testi ei leitud.</p><Link href='/'>Tagasi</Link></div></main>;
  const a = { ...row, questions: JSON.parse(row.questions) };
  return <main className='container'><h1>Tulemus</h1><section className='card'><h2>{a.score} / {a.questionCount} õige</h2><p>Aeg: {Number.isFinite(a.elapsedSeconds)?formatElapsed(a.elapsedSeconds):'aeg puudub'}</p><p>Teema: {a.category} · Raskus: {a.difficulty}</p><p>{formatDateTime(a.createdAt)}</p></section>
  <section className='card'>{(a.questions as Array<{id:string;question:string;userAnswer:string;expectedUnit:string;correctAnswer:number;isCorrect:boolean}>).map((q,i)=><article key={q.id}><p><strong>{i+1}. {q.question}</strong></p><p>Sinu vastus: {q.userAnswer||'—'} {q.expectedUnit}</p><p>Õige vastus: {q.correctAnswer} {q.expectedUnit}</p><p className={q.isCorrect?'ok':'bad'}>{q.isCorrect?'Õige! Tubli!':'Veel harjutamist — järgmine kord läheb paremini!'}</p></article>)}</section>
  <div className='row'><Link className='btn' href={`/test?category=${encodeURIComponent(a.category)}&difficulty=${a.difficulty}&count=${a.questionCount}&seed=${Date.now()}`}>Tee uuesti</Link><Link className='btn chip active' href='/'>Vali uus harjutus</Link></div></main>;
}
