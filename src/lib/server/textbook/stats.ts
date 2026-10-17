import db from '@/lib/db';
import { assertRealEffects, type TextbookContext } from '@/lib/server/textbook/context';

// Per-objective weak-area statistics for the parent. Real children only: the
// guard refuses a preview context, so a preview run can never show up here.
export function recordObjectiveResult(context: TextbookContext, courseId: string, unitId: string, objectiveId: string, phase: 'practice' | 'test', correct: boolean, now: string) {
  const learner = assertRealEffects(context);
  db.prepare(`
    INSERT INTO textbook_objective_stats (learner, courseId, unitId, objectiveId, updatedAt) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(learner, courseId, unitId, objectiveId) DO NOTHING
  `).run(learner, courseId, unitId, objectiveId, now);
  const column = phase === 'practice' ? (correct ? 'practiceCorrect' : 'practiceWrong') : (correct ? 'testCorrect' : 'testWrong');
  // A "miss" is a wrong answer in a test: that is what the parent's list of
  // repeatedly missed concepts counts.
  const missed = phase === 'test' && !correct;
  db.prepare(`
    UPDATE textbook_objective_stats
    SET ${column} = ${column} + 1,
        missCount = missCount + ?,
        lastMissedAt = CASE WHEN ? = 1 THEN ? ELSE lastMissedAt END,
        updatedAt = ?
    WHERE learner = ? AND courseId = ? AND unitId = ? AND objectiveId = ?
  `).run(missed ? 1 : 0, missed ? 1 : 0, now, now, learner, courseId, unitId, objectiveId);
}
