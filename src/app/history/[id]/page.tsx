import Link from 'next/link';
import db from '@/lib/db';
import { formatDateTime, formatElapsed } from '@/lib/validation';

export const dynamic = 'force-dynamic';

type OrderingCard = {
  id: string;
  label: string;
  valueMm: number;
};

type SavedQuestion = {
  id?: string;
  question: string;
  userAnswer: string;
  expectedUnit: string;
  correctAnswer: number;
  isCorrect: boolean;
  kind?: 'numeric' | 'ordering';
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
    return Array.isArray(parsed) ? (parsed as SavedQuestion[]) : [];
  } catch {
    return [];
  }
}

export default async function HistoryDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const row = db
    .prepare('SELECT * FROM attempts WHERE id = ?')
    .get(id) as AttemptRow | undefined;

  if (!row) {
    return (
      <main className="container">
        <div className="card">
          <p>Testi ei leitud.</p>
          <Link className="btn" href="/">
            Tagasi
          </Link>
        </div>
      </main>
    );
  }

  const questions = safeParseQuestions(row.questions);

  const retryParams = new URLSearchParams({
    category: row.category,
    difficulty: row.difficulty,
    count: String(row.questionCount),
    seed: String(Date.now()),
  });

  return (
    <main className="container">
      <h1>Tulemus</h1>

      <section className="card">
        <h2>
          {row.score} / {row.questionCount} õige
        </h2>
        <p>
          Aeg:{' '}
          {Number.isFinite(Number(row.elapsedSeconds))
            ? formatElapsed(Number(row.elapsedSeconds))
            : 'aeg puudub'}
        </p>
        <p>
          Teema: {row.category} · Raskus: {row.difficulty}
        </p>
        <p>{formatDateTime(row.createdAt)}</p>
      </section>

      <section className="card">
        {questions.map((q, i) => {
          const correctOrdering = (q.orderingCards ?? [])
            .slice()
            .sort((a, b) =>
              q.orderingDirection === 'desc'
                ? b.valueMm - a.valueMm
                : a.valueMm - b.valueMm
            )
            .map((card) => card.label)
            .join(' > ');

          return (
            <article key={q.id ?? `${i}-${q.question}`}>
              <p>
                <strong>
                  {i + 1}. {q.question}
                </strong>
              </p>

              {q.kind === 'ordering' ? (
                <>
                  <p>Sinu järjestus: {q.userAnswer || '—'}</p>
                  <p>Õige järjestus: {correctOrdering}</p>
                </>
              ) : (
                <>
                  <p>
                    Sinu vastus: {q.userAnswer || '—'} {q.expectedUnit}
                  </p>
                  <p>
                    Õige vastus: {q.correctAnswer} {q.expectedUnit}
                  </p>
                </>
              )}

              <p className={q.isCorrect ? 'ok' : 'bad'}>
                {q.isCorrect
                  ? 'Õige! Tubli!'
                  : 'Veel harjutamist — järgmine kord läheb paremini!'}
              </p>
            </article>
          );
        })}
      </section>

      <div className="row">
        <Link className="btn" href={`/test?${retryParams.toString()}`}>
          Tee uuesti
        </Link>
        <Link className="btn secondary" href="/">
          Vali uus harjutus
        </Link>
      </div>
    </main>
  );
}
