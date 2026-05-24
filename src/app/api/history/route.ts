import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getDb() {
  return (await import('@/lib/db')).default;
}

export async function GET() {
  const db = await getDb();
  const rows = db.prepare('SELECT id, createdAt, category, difficulty, questionCount, score, elapsedSeconds, learner, subject, topic FROM attempts ORDER BY createdAt DESC').all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const db = await getDb();
  const body = await req.json();
  const stmt = db.prepare('INSERT INTO attempts (createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, subject, topic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const result = stmt.run(
    body.createdAt,
    body.category,
    body.difficulty,
    body.questionCount,
    body.score,
    body.elapsedSeconds,
    JSON.stringify(body.questions),
    body.learner ?? null,
    body.subject ?? null,
    body.topic ?? null
  );
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}

export async function DELETE() {
  const db = await getDb();
  db.prepare('DELETE FROM attempts').run();
  return NextResponse.json({ ok: true });
}
