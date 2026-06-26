import { NextRequest, NextResponse } from 'next/server';
import { awardStudyPointsForAttempt } from '@/lib/learningPoints';
import {
  findLearningExerciseForAttempt,
  isLearner,
  isLearningExerciseActiveForAttempt,
  isLearningExerciseSubject
} from '@/lib/learningExercises';
import { captureMistakesForAttempt } from '@/lib/remediation';
import { recordDailyLeaderboard } from '@/lib/leaderboard';
import { deleteAllHistory } from '@/lib/historyMaintenance';

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
      a.exerciseId,
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
  const questions = Array.isArray(body.questions) ? body.questions : [];

  const exercise = learner && subject ? findLearningExerciseForAttempt({ learner, subject, topic, category }) : null;

  if (learner && subject && !isLearningExerciseActiveForAttempt({ learner, subject, topic, category })) {
    return NextResponse.json({ message: 'Harjutus ei ole praegu aktiivne.' }, { status: 403 });
  }

  const stmt = db.prepare('INSERT INTO attempts (createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, subject, topic, exerciseId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const isLearningAttempt = body.subject !== 'inglise-keel';
  const isTextProblems = body.subject === 'matemaatika' && (topic === 'tekstulesanded' || category === 'Tekstülesanded');
  // Subjects whose session length is variable use the count sent by the client;
  // the fixed 15-question maths sessions are normalised below.
  const usesProvidedCount = body.subject === 'lugemine' || body.subject === 'loodusopetus' || isTextProblems;
  const questionCount = usesProvidedCount ? Number(body.questionCount) || 0 : isLearningAttempt ? 15 : Number(body.questionCount) || 0;
  const score = Math.max(0, Math.min(Math.floor(Number(body.score) || 0), questionCount));
  const result = stmt.run(
    body.createdAt,
    body.category,
    body.difficulty || 'Lihtne',
    questionCount,
    score,
    body.elapsedSeconds,
    JSON.stringify(questions),
    learner,
    subject ?? body.subject ?? null,
    topic || null,
    typeof body.exerciseId === 'string' && body.exerciseId ? body.exerciseId : exercise?.id ?? null
  );
  try {
    captureMistakesForAttempt({ attemptId: Number(result.lastInsertRowid), learner, subject, topic, category, questions });
  } catch (error) {
    console.warn('Mistake capture failed', error);
  }
  const reward = awardStudyPointsForAttempt(Number(result.lastInsertRowid));
  try {
    recordDailyLeaderboard();
  } catch (error) {
    console.warn('Daily leaderboard snapshot failed', error);
  }
  return NextResponse.json({ id: result.lastInsertRowid, reward }, { status: 201 });
}

export async function DELETE() {
  await getDb();
  try {
    deleteAllHistory();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('History wipe failed', error);
    return NextResponse.json({ message: 'Kogu ajaloo kustutamine ebaõnnestus.' }, { status: 500 });
  }
}
