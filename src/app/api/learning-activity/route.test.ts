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
    DELETE FROM kaardimang_points;
    DELETE FROM kaardimang_rounds;
    DELETE FROM kaardimang_competitions;
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

  it('shows Kaardimäng rounds (Kaur 04.11: map games were missing from the history)', async () => {
    db.prepare(`INSERT INTO kaardimang_competitions (id, title, viewsJson, startDate, endDate, rewardsJson, status, createdAt)
      VALUES (7, 'Novembri võistlus', '[]', '2026-10-28', '2026-11-05', '[]', 'active', '2026-10-28T00:00:00.000Z')`).run();
    const round = db.prepare(`INSERT INTO kaardimang_rounds (id, learner, viewId, setId, level, dataVersion, status, stateJson, revision, startActionId,
      correct, firstTryCorrect, total, startedAt, updatedAt, completedAt, competitionId, playDate)
      VALUES (?, ?, ?, ?, ?, 'v', ?, '{}', 3, ?, ?, 0, 8, ?, ?, ?, ?, '2026-10-19')`);
    // Kiur: a counted round on Northern Europe, a practice round on the world's oceans, one left after a right answer, one left at once.
    round.run('r-count', 'kiur', 'europe-nordic', null, 'traveler', 'completed', 'a1', 7, '2026-10-19T18:00:00.000Z', '2026-10-19T18:05:00.000Z', '2026-10-19T18:05:00.000Z', 7);
    round.run('r-world', 'kiur', 'world', 'oceans', 'explorer', 'completed', 'a2', 8, '2026-10-19T18:10:00.000Z', '2026-10-19T18:12:00.000Z', '2026-10-19T18:12:00.000Z', null);
    round.run('r-left', 'kiur', 'estonia', null, 'explorer', 'abandoned', 'a3', 2, '2026-10-19T18:20:00.000Z', '2026-10-19T18:22:00.000Z', null, null);
    round.run('r-empty', 'kiur', 'estonia', null, 'explorer', 'abandoned', 'a4', 0, '2026-10-19T18:30:00.000Z', '2026-10-19T18:30:00.000Z', null, null);
    // The parent preview and the parents' own rounds are no child's history.
    round.run('r-preview', 'preview', 'estonia', null, 'explorer', 'completed', 'a5', 8, '2026-10-19T18:40:00.000Z', '2026-10-19T18:41:00.000Z', '2026-10-19T18:41:00.000Z', null);
    round.run('r-kaur', 'kaur', 'estonia', null, 'explorer', 'completed', 'a6', 8, '2026-10-19T18:50:00.000Z', '2026-10-19T18:51:00.000Z', '2026-10-19T18:51:00.000Z', 7);
    const point = db.prepare(`INSERT INTO kaardimang_points (roundId, questionIndex, competitionId, player, targetKey, points, speedBonus, newlyLearned, createdAt)
      VALUES ('r-count', ?, 7, 'kiur', ?, ?, ?, 0, '2026-10-19T18:04:00.000Z')`);
    point.run(0, 'country:NOR', 2, 1);
    point.run(1, 'country:SWE', 1, 0);

    const rows = await (await get('?learner=kiur')).json() as LearningActivity[];
    const maps = rows.filter((row) => row.subject === 'kaardimang');
    expect(maps.map((row) => [row.kind, row.title, row.detail])).toEqual([
      ['map', 'Eesti', '2/8 · Avastaja · pooleli'],
      ['map', 'Maailm · Ookeanid', '8/8 · Avastaja'],
      ['map', 'Euroopa · Põhjamaad', '7/8 · Rändur · 4 punkti võistlusel']
    ]);
    expect(rows[0]).toMatchObject({ subject: 'kaardimang', createdAt: '2026-10-19T18:22:00.000Z' });
    expect(new Set(rows.map((row) => row.id)).size).toBe(rows.length);
    const everyone = await (await get()).json() as LearningActivity[];
    expect(everyone.filter((row) => row.subject === 'kaardimang')).toHaveLength(3);
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
