import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getDb() {
  return (await import('@/lib/db')).default;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = await getDb();
  const { id } = await params;
  const row = db.prepare('SELECT * FROM attempts WHERE id = ?').get(id) as { [key: string]: unknown } | undefined;
  if (!row) return NextResponse.json({ message: 'Ei leitud' }, { status: 404 });
  return NextResponse.json({ ...row, questions: JSON.parse(row.questions as string) });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = await getDb();
  const { id } = await params;
  db.prepare('DELETE FROM attempts WHERE id = ?').run(id);
  return NextResponse.json({ ok: true });
}
