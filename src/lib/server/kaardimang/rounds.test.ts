import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { isChildWritePath } from '@/lib/peekMode';
import { KAARDIMANG_CHILD_ENABLED } from '@/lib/kaardimang/api';
import { kaardimangHandlers } from '@/lib/server/kaardimang/http';
import { type RoundState } from '@/lib/kaardimang/engine';
import { answer, getOverview, getRound, KaardimangApiError, parentOverview, resetPreview, startRound, type KaardimangContext } from '@/lib/server/kaardimang/rounds';

// DB-backed tests of the Kaardimäng server: frozen rounds, idempotent and
// revision-guarded answers, resume, preview isolation and no real effects
// (VASTUVOTUTESTID.md C 27–32).

const kiur: KaardimangContext = { scope: 'child', learner: 'kiur' };
const preview: KaardimangContext = { scope: 'preview', learner: 'preview' };
let counter = 0;
const aid = () => `action-${++counter}-xx`;

function frozen(roundId: string): RoundState {
  return JSON.parse((db.prepare('SELECT stateJson FROM kaardimang_rounds WHERE id = ?').get(roundId) as { stateJson: string }).stateJson) as RoundState;
}

function code(fn: () => unknown): string {
  try {
    fn();
  } catch (error) {
    expect(error).toBeInstanceOf(KaardimangApiError);
    return (error as KaardimangApiError).code;
  }
  throw new Error('expected an error');
}

function wrongFor(roundId: string, index: number): string {
  const question = frozen(roundId).questions[index];
  if (question.options) return question.options.find((option) => option.id !== question.answerId)!.id;
  return question.answerId === 'EST' ? 'LVA' : 'EST';
}

function playAll(context: KaardimangContext, roundId: string, wrongFirst = 0) {
  let view = getRound(context, roundId);
  let wrongLeft = wrongFirst;
  while (view.status === 'active') {
    const index = view.cursor;
    const right = frozen(roundId).questions[index].answerId;
    const answerId = wrongLeft-- > 0 ? wrongFor(roundId, index) : right;
    view = answer(context, roundId, { actionId: aid(), revision: view.revision, questionIndex: index, answerId }).round;
  }
  return view;
}

const realTables = ['attempts', 'point_ledger', 'daily_leaderboard', 'textbook_test_rounds'];
const realCounts = () => realTables.map((table) => (db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get() as { count: number }).count);

beforeEach(() => {
  db.exec('DELETE FROM kaardimang_rounds; DELETE FROM kaardimang_target_stats;');
});

describe('Kaardimäng rounds', () => {
  it('freezes a round of real targets and never sends an unresolved answer', () => {
    const round = startRound(kiur, { actionId: aid(), viewId: 'africa-north', setId: null, level: 'traveler' });
    expect(round.questions.length).toBeGreaterThanOrEqual(6);
    expect(round.questions.length).toBeLessThanOrEqual(8);
    expect(JSON.stringify(round)).not.toContain('answerId');
    expect(round.questions.every((question) => question.correctId === null)).toBe(true);
  });

  it('returns the same round for a repeated start and keeps one active round per learner', () => {
    const actionId = aid();
    const first = startRound(kiur, { actionId, viewId: 'europe-baltics', setId: null, level: 'explorer' });
    expect(startRound(kiur, { actionId, viewId: 'europe-baltics', setId: null, level: 'explorer' }).roundId).toBe(first.roundId);
    const second = startRound(kiur, { actionId: aid(), viewId: 'asia-east', setId: null, level: 'explorer' });
    expect(getRound(kiur, first.roundId).status).toBe('abandoned');
    expect(getOverview(kiur).activeRound?.roundId).toBe(second.roundId);
  });

  it('applies a double-sent answer once and refuses an old revision (C 29)', () => {
    const round = startRound(kiur, { actionId: aid(), viewId: 'europe-nordic', setId: null, level: 'traveler' });
    const body = { actionId: aid(), revision: round.revision, questionIndex: 0, answerId: frozen(round.roundId).questions[0].answerId };
    const once = answer(kiur, round.roundId, body);
    const again = answer(kiur, round.roundId, body);
    expect(again.round.revision).toBe(once.round.revision);
    expect(again.round.cursor).toBe(1);
    expect((db.prepare("SELECT seen FROM kaardimang_target_stats WHERE learner = 'kiur'").all() as Array<{ seen: number }>).map((row) => row.seen)).toEqual([1]);
    expect(code(() => answer(kiur, round.roundId, { ...body, actionId: aid() }))).toBe('stale');
    expect(code(() => answer(kiur, round.roundId, { actionId: aid(), revision: once.round.revision, questionIndex: 0, answerId: 'EST' }))).toBe('not_current_question');
  });

  it('allows one retry with a hint, then reveals and moves on (B 21)', () => {
    const round = startRound(kiur, { actionId: aid(), viewId: 'europe-nordic', setId: null, level: 'traveler' });
    const wrong = wrongFor(round.roundId, 0);
    const first = answer(kiur, round.roundId, { actionId: aid(), revision: round.revision, questionIndex: 0, answerId: wrong });
    expect(first.feedback.outcome).toBe('wrong_retry');
    expect(first.round.cursor).toBe(0);
    expect(first.round.questions[0].hintEt).toMatch(/Vihje/);
    const open = first.round.questions[0].options?.find((option) => !first.round.questions[0].state.removedOptionIds.includes(option.id) && option.id !== frozen(round.roundId).questions[0].answerId);
    const second = answer(kiur, round.roundId, { actionId: aid(), revision: first.round.revision, questionIndex: 0, answerId: open?.id ?? wrong });
    expect(second.feedback.outcome).toBe('revealed');
    expect(second.round.cursor).toBe(1);
    expect(second.round.questions[0].correctId).toBe(frozen(round.roundId).questions[0].answerId);
  });

  it('resumes the same round with the same questions after a reload (C 28)', () => {
    const round = startRound(kiur, { actionId: aid(), viewId: 'americas-south', setId: null, level: 'geographer' });
    answer(kiur, round.roundId, { actionId: aid(), revision: 0, questionIndex: 0, answerId: frozen(round.roundId).questions[0].answerId });
    const resumed = getRound(kiur, getOverview(kiur).activeRound!.roundId);
    expect(resumed.cursor).toBe(1);
    expect(resumed.questions.map((question) => question.prompt)).toEqual(round.questions.map((question) => question.prompt));
  });

  it('ends with a neutral summary and the places to review', () => {
    const round = startRound(kiur, { actionId: aid(), viewId: 'africa-west', setId: null, level: 'traveler' });
    const done = playAll(kiur, round.roundId, 1);
    expect(done.status).toBe('completed');
    expect(done.summary).toMatchObject({ total: round.questions.length, practicedOf: 16 });
    expect(done.summary!.reviewNames).toHaveLength(1);
    expect(done.summary!.firstTryCorrect).toBe(round.questions.length - 1);
  });

  it('plays the world sets and Antarctica', () => {
    for (const setId of ['continents', 'worldParts', 'oceans', 'largest'] as const) {
      expect(playAll(kiur, startRound(kiur, { actionId: aid(), viewId: 'world', setId, level: 'traveler' }).roundId).status).toBe('completed');
    }
    expect(playAll(kiur, startRound(kiur, { actionId: aid(), viewId: 'antarctica', setId: null, level: 'traveler' }).roundId).status).toBe('completed');
    expect(code(() => startRound(kiur, { actionId: aid(), viewId: 'world', setId: null, level: 'traveler' }))).toBe('invalid_request');
    expect(code(() => startRound(kiur, { actionId: aid(), viewId: 'mars', setId: null, level: 'traveler' }))).toBe('invalid_request');
  });

  it('writes no stars, attempts, ledger or leaderboard rows (C 30–31)', () => {
    const before = realCounts();
    playAll(kiur, startRound(kiur, { actionId: aid(), viewId: 'europe-baltics', setId: null, level: 'explorer' }).roundId);
    expect(realCounts()).toEqual(before);
  });
});

describe('Kaardimäng preview', () => {
  it('keeps the preview learner apart from Kiur and resets only the preview (C 30, 32)', () => {
    const kiurRound = startRound(kiur, { actionId: aid(), viewId: 'europe-baltics', setId: null, level: 'explorer' });
    const previewRound = startRound(preview, { actionId: aid(), viewId: 'europe-baltics', setId: null, level: 'explorer' });
    expect(code(() => getRound(preview, kiurRound.roundId))).toBe('not_found');
    expect(code(() => getRound(kiur, previewRound.roundId))).toBe('not_found');
    playAll(preview, previewRound.roundId);
    expect(getOverview(kiur).practiced['europe-baltics']).toEqual([0, 3]);
    expect(resetPreview().deletedRounds).toBe(1);
    expect(getRound(kiur, kiurRound.roundId).status).toBe('active');
    expect((db.prepare("SELECT COUNT(*) AS count FROM kaardimang_target_stats WHERE learner = 'preview'").get() as { count: number }).count).toBe(0);
  });

  it('summarises coverage and exceptions for the parent', () => {
    const summary = parentOverview();
    expect(summary.countries).toBe(194);
    expect(summary.exploreOnly).toEqual(expect.arrayContaining(['Kosovo', 'Palestiina', 'Taiwan']));
    expect(summary.noCapitalQuestion.map((item) => item.nameEt)).toEqual(expect.arrayContaining(['Lõuna-Aafrika Vabariik', 'Boliivia', 'Vatikan']));
  });

  it('keeps every child route closed while the game is in parent testing', async () => {
    expect(KAARDIMANG_CHILD_ENABLED).toBe(false);
    const response = await kaardimangHandlers('child').overview.GET();
    expect(response.status).toBe(403);
    expect((await response.json()).code).toBe('forbidden');
  });

  it('treats child map-game writes as child writes for peek mode', () => {
    expect(isChildWritePath('/api/kaardimang/rounds')).toBe(true);
    expect(isChildWritePath('/api/parent/kaardimang/preview/rounds')).toBe(false);
  });
});
