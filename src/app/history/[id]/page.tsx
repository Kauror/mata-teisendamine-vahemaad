import Link from 'next/link';
import db from '@/lib/db';
import { formatDateTime, formatElapsed } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export default async function HistoryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = db.prepare('SELECT * FROM attempts WHERE id = ?').get(id) as any;
  if (!row) return <main className="container"><p>Testi ei leitud.</p><Link href="/">Tagasi</Link></main>;
  const attempt = { ...row, questions: JSON.parse(row.questions) };
  return <main className="container"><h1>Tulemus</h1><section className="card"><p>{attempt.score} / {attempt.questionCount}</p><p>Aeg: {formatElapsed(attempt.elapsedSeconds)}</p><p>{formatDateTime(attempt.createdAt)}</p></section>
  <section className="card"><ul>{attempt.questions.map((q:any, i:number)=><li key={q.id}><p>{i+1}. {q.question}</p><p>Sinu vastus: {q.userAnswer || '—'} {q.expectedUnit}</p><p>Õige vastus: {q.correctAnswer} {q.expectedUnit}</p><p className={q.isCorrect?'ok':'bad'}>{q.isCorrect?'Õige':'Vale'}</p></li>)}</ul></section>
  <div className="row"><Link className="btn" href="/">Tee uus test</Link><Link className="btn secondary" href="/">Tagasi avalehele</Link></div></main>;
}
