import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = db.prepare('SELECT * FROM attempts WHERE id = ?').get(id) as { [key: string]: unknown } | undefined;
  if (!row) return NextResponse.json({ message: 'Ei leitud' }, { status: 404 });
  return NextResponse.json({ ...row, questions: JSON.parse(row.questions as string) });
}
