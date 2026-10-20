import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import db from '@/lib/db';
import { GET as learningActivity } from '@/app/api/learning-activity/route';
import { GET as homeSummary } from '@/app/api/home-summary/route';
import { loodusopetusOpikCourse } from '@/content/textbook/loodusopetus-opik';
import type { LearningActivity } from '@/lib/server/learningActivity';

const NOW = new Date('2026-10-20T09:00:00.000Z');
const COURSE = loodusopetusOpikCourse.id;
const UNIT = loodusopetusOpikCourse.units.find((unit) => unit.lessons.length > 0)!;
const LESSON = UNIT.lessons[0];

function get(query = '') {
  return learningActivity(new Request(`http://localhost/api/learning-activity${query}`));
}

function seed() {
  db.prepare(`INSERT INTO english_vocab_units (id, unitNumber, title, published, contentVersion, createdAt, updatedAt)
    VALUES ('u-food', 1, 'Food', 1, 1, '2026-10-01T00:00:00.000Z', '2026-10-01T00:00:00.000Z')`).run();
  const vocab = db.prepare(`INSERT INTO english_vocab_sessions (id, learner, unitId, scopeKey, mode, status, stateJson, attemptId, startedAt, updatedAt, completedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const words = JSON.stringify({ words: [{}, {}, {}] });
  // Kiur: a finished study session, a failed test, and an unfinished practice.
  vocab.run('v-study', 'kiur', 'u-food', 'u-food', 'study', 'completed', words, null, '2026-10-19T08:00:00.000Z', '2026-10-19T08:10:00.000Z', '2026-10-19T08:10:00.000Z');
  vocab.run('v-test', 'kiur', 'u-food', 'u-food', 'test', 'completed', JSON.stringify({ words: [{}, {}], rounds: [{ correct: 12, total: 20 }] }), null, '2026-10-19T09:00:00.000Z', '2026-10-19T09:10:00.000Z', '2026-10-19T09:10:00.000Z');
  vocab.run('v-practice', 'kiur', null, '*', 'practice', 'active', words, null, '2026-10-19T10:00:00.000Z', '2026-10-19T10:05:00.000Z', null);

  // A passed test already has its attempt (and stars) in /api/history: not here.
  db.prepare(`INSERT INTO attempts (id, createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, protocolVersion, rewardSettlementStatus)
    VALUES (900, '2026-10-19T11:00:00.000Z', 'Inglise keel - sõnavara', 'Tavaline', 20, 19, 60, '[]', 'kiur', 2, 'eligible')`).run();
  vocab.run('v-passed', 'kiur', 'u-food', 'u-food', 'test', 'completed', words, 900, '2026-10-19T11:00:00.000Z', '2026-10-19T11:00:00.000Z', '2026-10-19T11:00:00.000Z');

  db.prepare(`INSERT INTO textbook_lesson_reads (learner, courseId, unitId, lessonId, contentVersion, firstCompletedAt, lastCompletedAt, completions)
    VALUES ('kiur', ?, ?, ?, 'v1', '2026-10-18T07:00:00.000Z', '2026-10-19T12:00:00.000Z', 2)`).run(COURSE, UNIT.id, LESSON.id);
  db.prepare(`INSERT INTO textbook_practice_sessions (id, learner, courseId, unitId, mode, status, contentVersion, stateJson, objectivesJson, startedAt, updatedAt, completedAt)
    VALUES ('p1', 'kiur', ?, ?, 'normal', 'completed', 'v1', '{}', '[]', '2026-10-19T13:00:00.000Z', '2026-10-19T13:20:00.000Z', '2026-10-19T13:20:00.000Z')`).run(COURSE, UNIT.id);
  const test = db.prepare(`INSERT INTO textbook_test_sessions (id, learner, courseId, unitId, attemptNumber, status, contentVersion, stateJson, objectivesJson, correct, total, passed, attemptId, startedAt, updatedAt, submittedAt)
    VALUES (?, ?, ?, ?, ?, ?, 'v1', '{}', '[]', ?, ?, ?, NULL, ?, ?, ?)`);
  test.run('t-fail', 'kiur', COURSE, UNIT.id, 1, 'submitted', 9, 20, 0, '2026-10-19T14:00:00.000Z', '2026-10-19T14:15:00.000Z', '2026-10-19T14:15:00.000Z');
  test.run('t-active', 'kiur', COURSE, UNIT.id, 2, 'active', null, null, null, '2026-10-19T15:00:00.000Z', '2026-10-19T15:00:00.000Z', null);
  // The parent preview is never a child's history.
  db.prepare(`INSERT INTO textbook_lesson_reads (learner, courseId, unitId, lessonId, contentVersion, firstCompletedAt, lastCompletedAt, completions)
    VALUES ('preview', ?, ?, ?, 'v1', '2026-10-19T16:00:00.000Z', '2026-10-19T16:00:00.000Z', 1)`).run(COURSE, UNIT.id, LESSON.id);
  // Kirsi's own row stays out of Kiur's list.
  vocab.run('k-study', 'kirsi', 'u-food', 'u-food', 'study', 'completed', words, null, '2026-10-19T17:00:00.000Z', '2026-10-19T17:00:00.000Z', '2026-10-19T17:00:00.000Z');
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
  db.pragma('foreign_keys = OFF');
  db.exec(`
    DELETE FROM english_vocab_sessions;
    DELETE FROM english_vocab_units;
    DELETE FROM textbook_lesson_reads;
    DELETE FROM textbook_practice_sessions;
    DELETE FROM textbook_test_sessions;
    DELETE FROM attempts;
  `);
  db.pragma('foreign_keys = ON');
  seed();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('/api/learning-activity', () => {
  it('lists English and Loodusõpetus work without a passed test, newest first, star-free', async () => {
    const rows = await (await get('?learner=kiur')).json() as LearningActivity[];
    expect(rows.map((row) => [row.subject, row.kind, row.title, row.detail])).toEqual([
      ['loodusopetus', 'test', `${UNIT.title} · test`, '9/20 · test ei läinud läbi'],
      ['loodusopetus', 'practice', `${UNIT.title} · harjutamine`, ''],
      ['loodusopetus', 'reading', `Loetud: ${LESSON.title}`, UNIT.title],
      ['inglise-keel', 'practice', 'sõnavara harjutamine', '3 sõna · pooleli'],
      ['inglise-keel', 'test', 'Food · sõnavara test', '12/20 · test ei läinud läbi'],
      ['inglise-keel', 'study', 'Food · sõnavara õppimine', '3 sõna']
    ]);
    expect(new Set(rows.map((row) => row.id)).size).toBe(rows.length);
    expect(rows.every((row) => row.learner === 'kiur')).toBe(true);
  });

  it('pages like the other timelines', async () => {
    const first = await (await get('?learner=kiur&limit=4')).json() as { items: LearningActivity[]; nextCursor: string };
    expect(first.items).toHaveLength(4);
    const second = await (await get(`?learner=kiur&limit=4&cursor=${first.nextCursor}`)).json() as { items: LearningActivity[]; nextCursor: string | null };
    expect(second.items.map((row) => row.title)).toEqual(['Food · sõnavara test', 'Food · sõnavara õppimine']);
    expect(second.nextCursor).toBeNull();
  });

  it('includes both children without a filter and rejects an unknown learner', async () => {
    const rows = await (await get()).json() as LearningActivity[];
    expect(rows[0]).toMatchObject({ learner: 'kirsi', title: 'Food · sõnavara õppimine' });
    expect(rows.some((row) => (row.learner as string) === 'preview')).toBe(false);
    expect((await get('?learner=preview')).status).toBe(400);
  });

  it('gives the home summary each child\'s newest activity for "Viimati"', async () => {
    const summary = await (await homeSummary()).json() as { children: Record<'kiur' | 'kirsi', { latestActivity: LearningActivity | null }> };
    expect(summary.children.kiur.latestActivity).toMatchObject({ title: `${UNIT.title} · test` });
    expect(summary.children.kirsi.latestActivity).toMatchObject({ title: 'Food · sõnavara õppimine' });
  });
});
