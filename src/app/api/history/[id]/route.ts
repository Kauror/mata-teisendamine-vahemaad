import { NextResponse } from 'next/server';
import { deleteAttempt } from '@/lib/historyMaintenance';

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
  await getDb();
  const { id } = await params;
  const attemptId = Number(id);
  if (!Number.isInteger(attemptId)) return NextResponse.json({ message: 'Vale tulemus.' }, { status: 400 });

  try {
    const removed = deleteAttempt(attemptId);
    if (removed === 0) return NextResponse.json({ message: 'Tulemust ei leitud.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('History delete failed', error);
    return NextResponse.json({ message: 'Kustutamine ebaõnnestus.' }, { status: 500 });
  }
}
