import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getDb() {
  return (await import('@/lib/db')).default;
}

function safeParseQuestions(raw: unknown) {
  if (typeof raw !== 'string') return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = await getDb();
  const { id } = await params;
  const row = db.prepare('SELECT * FROM attempts WHERE id = ?').get(id) as { [key: string]: unknown } | undefined;
  if (!row) return NextResponse.json({ message: 'Ei leitud' }, { status: 404 });
  return NextResponse.json({ ...row, questions: safeParseQuestions(row.questions) });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = await getDb();
  const { id } = await params;
  const attemptId = Number(id);
  if (!Number.isInteger(attemptId)) return NextResponse.json({ message: 'Vale tulemus.' }, { status: 400 });

  const deleteAttempt = db.transaction(() => {
    db.prepare('DELETE FROM streak_bonus_awards WHERE attemptId = ?').run(attemptId);
    db.prepare('DELETE FROM study_attempt_rewards WHERE attemptId = ?').run(attemptId);
    db.prepare('DELETE FROM attempts WHERE id = ?').run(attemptId);
  });
  deleteAttempt();
  return NextResponse.json({ ok: true });
}
