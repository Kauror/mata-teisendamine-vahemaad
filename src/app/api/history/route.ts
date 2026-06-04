import { NextRequest, NextResponse } from 'next/server';
import { awardStudyPointsForAttempt } from '@/lib/learningPoints';
import {
  isLearner,
  isLearningExerciseActiveForAttempt,
  isLearningExerciseSubject
} from '@/lib/learningExercises';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getDb() {
  return (await import('@/lib/db')).default;
}

export async function GET() {
  const db = await getDb();
  const rows = db.prepare(`
    SELECT
      a.id, a.createdAt, a.category, a.difficulty, a.questionCount, a.score, a.elapsedSeconds, a.learner, a.subject, a.topic,
      r.awardedAmount as earnedStars,
      r.dailyCap as learningDailyCap,
      r.dailyLearningEarnedAfter as dailyLearningEarnedAfter
    FROM attempts a
    LEFT JOIN study_attempt_rewards r ON r.attemptId = a.id
    ORDER BY a.createdAt DESC
  `).all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const db = await getDb();
  const body = await req.json();
  const learner = isLearner(body.learner) ? body.learner : null;
  const subject = isLearningExerciseSubject(body.subject) ? body.subject : null;
  const topic = typeof body.topic === 'string' ? body.topic : '';
  const category = typeof body.category === 'string' ? body.category : '';

  if (learner && subject && !isLearningExerciseActiveForAttempt({ learner, subject, topic, category })) {
    return NextResponse.json({ message: 'Harjutus ei ole praegu aktiivne.' }, { status: 403 });
  }

  const stmt = db.prepare('INSERT INTO attempts (createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, subject, topic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const isLearningAttempt = body.subject !== 'inglise-keel';
  const questionCount = body.subject === 'lugemine' ? Number(body.questionCount) || 0 : isLearningAttempt ? 15 : Number(body.questionCount) || 0;
  const score = Math.max(0, Math.min(Math.floor(Number(body.score) || 0), questionCount));
  const result = stmt.run(
    body.createdAt,
    body.category,
    body.difficulty || 'Lihtne',
    questionCount,
    score,
    body.elapsedSeconds,
    JSON.stringify(body.questions),
    learner,
    subject ?? body.subject ?? null,
    topic || null
  );
  const reward = awardStudyPointsForAttempt(Number(result.lastInsertRowid));
  return NextResponse.json({ id: result.lastInsertRowid, reward }, { status: 201 });
}

export async function DELETE() {
  const db = await getDb();
  const deleteHistory = db.transaction(() => {
    db.prepare('DELETE FROM streak_bonus_awards').run();
    db.prepare('DELETE FROM study_attempt_rewards').run();
    db.prepare('DELETE FROM attempts').run();
  });
  deleteHistory();
  return NextResponse.json({ ok: true });
}
