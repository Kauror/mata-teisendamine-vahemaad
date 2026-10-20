import { getUnit as getTextbookUnit } from '@/content/textbook/registry';
import db from '@/lib/db';
import type { TimelineCursor } from '@/lib/server/timelinePage';
import type { Learner } from '@/lib/tasks';

// Kaur (20.10): English and Loodusõpetus work that is not a passed test left
// no trace outside its own page, because only a passed test writes an
// `attempts` row (the one that gives stars and counts as today's card). This
// is the rest of that work as a read-only, star-free timeline for the history
// and the home card: vocabulary study/practice sessions and failed tests,
// textbook practice, tests that did not count, and lessons read. Nothing here
// touches attempts, stars or today's cards.

export type LearningActivityKind = 'study' | 'practice' | 'test' | 'reading';
export type LearningActivity = {
  // Unique across sources: the source row's rowid × 4 + the source number.
  id: number;
  createdAt: string;
  learner: Learner;
  subject: 'inglise-keel' | 'loodusopetus';
  kind: LearningActivityKind;
  title: string;
  detail: string;
};

type SourceRow = {
  id: number;
  at: string;
  source: 'vocab' | 'tbPractice' | 'tbTest' | 'tbRead';
  learner: Learner;
  status: string | null;
  mode: string | null;
  unitTitle: string | null;
  courseId: string | null;
  unitId: string | null;
  lessonId: string | null;
  correct: number | null;
  total: number | null;
  passed: number | null;
  stateJson: string | null;
};

// Every source as one newest-first list. A vocabulary session that produced
// an attempt (a passed test) and a textbook test with an attempt are left out:
// those are already in /api/history with their stars.
const SOURCES_SQL = `
  SELECT s.rowid * 4 + 0 AS id, COALESCE(s.completedAt, s.updatedAt) AS at, 'vocab' AS source, s.learner, s.status, s.mode,
         u.title AS unitTitle, NULL AS courseId, s.unitId, NULL AS lessonId, NULL AS correct, NULL AS total, NULL AS passed, s.stateJson
    FROM english_vocab_sessions s LEFT JOIN english_vocab_units u ON u.id = s.unitId
   WHERE s.attemptId IS NULL
  UNION ALL
  SELECT p.rowid * 4 + 1, COALESCE(p.completedAt, p.updatedAt), 'tbPractice', p.learner, p.status, p.mode,
         NULL, p.courseId, p.unitId, NULL, NULL, NULL, NULL, NULL
    FROM textbook_practice_sessions p
   WHERE p.learner IN ('kiur', 'kirsi') AND p.status IN ('active', 'completed')
  UNION ALL
  SELECT t.rowid * 4 + 2, t.submittedAt, 'tbTest', t.learner, t.status, NULL,
         NULL, t.courseId, t.unitId, NULL, t.correct, t.total, t.passed, NULL
    FROM textbook_test_sessions t
   WHERE t.learner IN ('kiur', 'kirsi') AND t.status = 'submitted' AND t.attemptId IS NULL
  UNION ALL
  SELECT r.rowid * 4 + 3, r.lastCompletedAt, 'tbRead', r.learner, NULL, NULL,
         NULL, r.courseId, r.unitId, r.lessonId, NULL, NULL, NULL, NULL
    FROM textbook_lesson_reads r
   WHERE r.learner IN ('kiur', 'kirsi')
`;

function vocabDetail(row: SourceRow): { kind: LearningActivityKind; detail: string } {
  let state: { words?: unknown[]; rounds?: Array<{ correct: number; total: number }> } = {};
  try { state = JSON.parse(row.stateJson ?? '{}') as typeof state; } catch { /* keep the bare row */ }
  const unfinished = row.status !== 'completed';
  const words = Array.isArray(state.words) ? state.words.length : 0;
  const wordsText = words > 0 ? `${words} sõna` : '';
  if (row.mode === 'test') {
    const last = state.rounds?.at(-1);
    const score = last ? `${last.correct}/${last.total}` : '';
    return { kind: 'test', detail: [score, unfinished ? 'pooleli' : 'test ei läinud läbi'].filter(Boolean).join(' · ') };
  }
  const kind = row.mode === 'study' ? 'study' : 'practice';
  return { kind, detail: [wordsText, unfinished ? 'pooleli' : ''].filter(Boolean).join(' · ') };
}

export function describeActivity(row: SourceRow): LearningActivity {
  const base = { id: row.id, createdAt: row.at, learner: row.learner };
  if (row.source === 'vocab') {
    const { kind, detail } = vocabDetail(row);
    const what = kind === 'study' ? 'õppimine' : kind === 'test' ? 'test' : 'harjutamine';
    const unit = row.unitTitle ? `${row.unitTitle} · ` : '';
    return { ...base, subject: 'inglise-keel', kind, title: `${unit}sõnavara ${what}`, detail };
  }
  const unit = row.courseId && row.unitId ? getTextbookUnit(row.courseId, row.unitId) : null;
  const unitTitle = unit?.title ?? 'Õppetükk';
  if (row.source === 'tbRead') {
    const lesson = unit?.lessons.find((item) => item.id === row.lessonId);
    return { ...base, subject: 'loodusopetus', kind: 'reading', title: `Loetud: ${lesson?.title ?? unitTitle}`, detail: lesson ? unitTitle : '' };
  }
  if (row.source === 'tbPractice') {
    return { ...base, subject: 'loodusopetus', kind: 'practice', title: `${unitTitle} · harjutamine`, detail: row.status === 'completed' ? '' : 'pooleli' };
  }
  const score = row.correct !== null && row.total !== null ? `${row.correct}/${row.total}` : '';
  // A passed test without an attempt is a second pass of the unit on a day it already counted.
  const note = row.passed ? 'läbitud, täna juba arvestatud' : 'test ei läinud läbi';
  return { ...base, subject: 'loodusopetus', kind: 'test', title: `${unitTitle} · test`, detail: [score, note].filter(Boolean).join(' · ') };
}

// Newest first; `limit` < 1 returns every row (the unpaged legacy form).
export function queryLearningActivity({ learner, limit, before }: { learner?: Learner | null; limit: number; before?: TimelineCursor | null }): LearningActivity[] {
  const clauses = ['at IS NOT NULL'];
  const params: Array<string | number> = [];
  if (learner) { clauses.push('learner = ?'); params.push(learner); }
  if (before) { clauses.push('(at < ? OR (at = ? AND id < ?))'); params.push(before.at, before.at, before.id); }
  const rows = db.prepare(`
    SELECT * FROM (${SOURCES_SQL})
    WHERE ${clauses.join(' AND ')}
    ORDER BY at DESC, id DESC
    ${limit > 0 ? 'LIMIT ?' : ''}
  `).all(...params, ...(limit > 0 ? [limit] : [])) as SourceRow[];
  return rows.map(describeActivity);
}
