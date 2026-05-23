import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const rows = db.prepare('SELECT id, createdAt, category, difficulty, questionCount, score, elapsedSeconds FROM attempts ORDER BY createdAt DESC').all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const stmt = db.prepare('INSERT INTO attempts (createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const result = stmt.run(body.createdAt, body.category, body.difficulty, body.questionCount, body.score, body.elapsedSeconds, JSON.stringify(body.questions));
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}

export async function DELETE() {
  db.prepare('DELETE FROM attempts').run();
  return NextResponse.json({ ok: true });
}
