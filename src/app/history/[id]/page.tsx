import Link from 'next/link';
import db from '@/lib/db';
import { formatDateTime, formatElapsed } from '@/lib/validation';
import { isKirsiAttempt } from '@/lib/history';

export const dynamic = 'force-dynamic';

type OrderingCard = { id: string; label: string; valueMm: number };
type SavedQuestion = {
  id: string;
  question: string;
  userAnswer: string;
  expectedUnit: string;
  correctAnswer: number;
  isCorrect: boolean;
  kind?: 'numeric' | 'ordering' | 'choice';
  orderingCards?: OrderingCard[];
  orderingDirection?: 'asc' | 'desc';
};
type AttemptRow = {
  id: number;
  createdAt: string;
  category: string;
  difficulty: string;
  questionCount: number;
  score: number;
  elapsedSeconds: number | null;
  questions: string;
};

function safeParseQuestions(raw: string): SavedQuestion[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as SavedQuestion[] : [];
  } catch {
    return [];
  }
}

export default async function HistoryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = db.prepare('SELECT * FROM attempts WHERE id = ?').get(id) as AttemptRow | undefined;

  if (!row) {
    return <main className='container'><div className='card'><p>Testi ei leitud.</p><Link href='/'>Tagasi</Link></div></main>;
  }

  const questions = safeParseQuestions(row.questions);

  const isKirsi = isKirsiAttempt(row.category);

  const retryParams = new URLSearchParams({
    learner: isKirsi ? 'kirsi' : 'kiur',
    subject: 'matemaatika',
    topic: isKirsi ? 'arvutamine' : 'pikkused',
    category: row.category,
    difficulty: row.difficulty,
    count: String(row.questionCount),
    seed: String(Date.now())
  });

  return (
    <main className='container'>
      <h1>Tulemus</h1>
      <section className='card'><Link className='back-link' href='/history'>Tagasi ajalukku</Link>
        <h2>{row.score} / {row.questionCount} õige</h2>
        <p>Aeg: {typeof row.elapsedSeconds === 'number' && Number.isFinite(row.elapsedSeconds) ? formatElapsed(row.elapsedSeconds) : 'aeg puudub'}</p>
        <p>Teema: {row.category} · Raskus: {row.difficulty}</p>
        <p>{formatDateTime(row.createdAt)}</p>
      </section>

      <section className='card'>
        {questions.map((q, i) => {
          const order = (q.orderingCards ?? [])
            .slice()
            .sort((a, b) => (q.orderingDirection === 'desc' ? b.valueMm - a.valueMm : a.valueMm - b.valueMm))
            .map((c) => c.label)
            .join(' > ');

          return (
            <article key={q.id || `q-${i}`} className={q.isCorrect ? 'result-card correct' : 'result-card wrong'}>
              <p><strong>{i + 1}. {q.question}</strong></p>
              {q.kind === 'ordering'
                ? <><p>Sinu järjestus: {q.userAnswer || '—'}</p><p>Õige järjestus: {order || '—'}</p></>
                : <><p>Sinu vastus: {q.userAnswer || '—'}{isKirsi ? '' : ` ${q.expectedUnit || ''}`}</p><p>Õige vastus: {isKirsi && q.kind === 'choice' ? (q.correctAnswer === -1 ? '<' : q.correctAnswer === 0 ? '=' : '>') : String(q.correctAnswer ?? '—')}{isKirsi ? '' : ` ${q.expectedUnit || ''}`}</p></>}
              <p className={q.isCorrect ? 'ok' : 'bad'}>{q.isCorrect ? 'Õige! Tubli!' : 'Veel harjutamist — järgmine kord läheb paremini!'}</p>
            </article>
          );
        })}
      </section>

      <div className='row'>
        <Link className='btn' href={`/test?${retryParams.toString()}`}>Tee {row.category.toLowerCase()} uuesti</Link>
        <Link className='btn chip active' href={isKirsi ? '/kirsi/matemaatika' : '/kiur/matemaatika'}>Vali uus harjutus</Link>
      </div>
    </main>
  );
}
