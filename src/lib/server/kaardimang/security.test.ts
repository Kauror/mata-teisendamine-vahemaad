import { beforeEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { type RoundState } from '@/lib/kaardimang/engine';
import { kaardimangHandlers } from '@/lib/server/kaardimang/http';
import { getRound, startRound, type KaardimangContext } from '@/lib/server/kaardimang/rounds';

// Security regressions for the map game: the browser must not be able to read
// an unresolved question's answer out of the round JSON, and every child route
// stays closed while the game is in parent testing.

const preview: KaardimangContext = { scope: 'preview', learner: 'preview' };
let counter = 0;
const aid = () => `security-${++counter}-xx`;

function frozen(roundId: string): RoundState {
  return JSON.parse((db.prepare('SELECT stateJson FROM kaardimang_rounds WHERE id = ?').get(roundId) as { stateJson: string }).stateJson) as RoundState;
}

beforeEach(() => {
  db.exec('DELETE FROM kaardimang_rounds; DELETE FROM kaardimang_target_stats;');
});

describe('Kaardimäng answer secrecy (SEC-01)', () => {
  it('names no unresolved answer anywhere in a question', () => {
    const rounds = [
      startRound(preview, { actionId: aid(), viewId: 'europe-nordic', setId: null, level: 'geographer' }),
      startRound(preview, { actionId: aid(), viewId: 'africa-west', setId: null, level: 'geographer' }),
      startRound(preview, { actionId: aid(), viewId: 'world', setId: 'oceans', level: 'traveler' }),
      startRound(preview, { actionId: aid(), viewId: 'world', setId: 'continents', level: 'traveler' }),
      startRound(preview, { actionId: aid(), viewId: 'antarctica', setId: null, level: 'traveler' })
    ];
    let checked = 0;
    for (const started of rounds) {
      const round = getRound(preview, started.roundId);
      const keys = frozen(round.roundId).questions;
      round.questions.forEach((question, index) => {
        expect(question.correctId).toBeNull();
        expect(question.correctOptionId).toBeNull();
        // A "which country is highlighted" question must highlight the shape,
        // so its option ids are opaque per round: neither the highlighted id
        // nor anything derived from it (a capital's id starts with its
        // country's) may be an option id, and the labels are all that name the
        // places (SEC-01, review B5).
        const visible: Record<string, unknown> = { ...question };
        if (question.highlightId) delete visible.highlightId;
        const json = JSON.stringify(visible);
        expect(json, `${round.viewId} ${question.kind}`).not.toContain(`"${keys[index].answerId}"`);
        expect(json, `${round.viewId} ${question.kind}`).not.toContain(`:${keys[index].answerId}"`);
        for (const option of question.options ?? []) {
          expect(option.id).toMatch(/^o[0-9a-f]{16}$/);
          expect(keys[index].options?.some((frozenOption) => frozenOption.id === option.id)).toBe(false);
        }
        // Option ids differ from round to round, so they cannot be learned.
        checked += 1;
      });
    }
    expect(checked).toBeGreaterThan(20);
  });

  it('gives the same place a different option id in every round, and still grades it', async () => {
    const { answer } = await import('@/lib/server/kaardimang/rounds');
    const first = startRound(preview, { actionId: aid(), viewId: 'europe-nordic', setId: null, level: 'geographer' });
    const firstButtons = first.questions.flatMap((question) => question.options ?? []).map((option) => option.id);
    const second = startRound(preview, { actionId: aid(), viewId: 'europe-nordic', setId: null, level: 'geographer' });
    const secondButtons = second.questions.flatMap((question) => question.options ?? []).map((option) => option.id);
    expect(firstButtons.length).toBeGreaterThan(0);
    expect(firstButtons.filter((id) => secondButtons.includes(id))).toEqual([]);

    // A round whose first question is a button question (Avastaja counties:
    // "which county is highlighted" or its centre).
    let round = getRound(preview, startRound(preview, { actionId: aid(), viewId: 'estonia', setId: null, level: 'explorer' }).roundId);
    for (let tries = 0; tries < 30 && !round.questions[0].options; tries += 1) {
      round = getRound(preview, startRound(preview, { actionId: aid(), viewId: 'estonia', setId: null, level: 'explorer' }).roundId);
    }
    const key = frozen(round.roundId).questions[0];
    expect(key.answering).toBe('buttons');
    // The place id itself is refused; the button's token is graded.
    expect(() => answer(preview, round.roundId, { actionId: aid(), revision: round.revision, questionIndex: 0, answerId: key.answerId })).toThrow();
    const label = key.options!.find((option) => option.id === key.answerId)!.label;
    const token = round.questions[0].options!.find((option) => option.label === label)!.id;
    const after = answer(preview, round.roundId, { actionId: aid(), revision: round.revision, questionIndex: 0, answerId: token }).round;
    expect(after.questions[0].state.resolved).toBe('correct');
    expect(after.questions[0].correctOptionId).toBe(token);
    expect(after.questions[0].correctId).toBe(key.answerId);
  });

  it('reveals the target once the question is resolved, for the answer label on the map', async () => {
    const round = startRound(preview, { actionId: aid(), viewId: 'europe-baltics', setId: null, level: 'explorer' });
    const key = frozen(round.roundId).questions[0];
    const { answer, optionTokenForTests } = await import('@/lib/server/kaardimang/rounds');
    const after = answer(preview, round.roundId, { actionId: aid(), revision: round.revision, questionIndex: 0, answerId: optionTokenForTests(round.roundId, 0, key.answerId) }).round;
    expect(after.questions[0].correctId).toBe(key.answerId);
    expect(after.questions[0].targetId).toBe(key.targetId);
  });
});

describe('Kaardimäng child routes', () => {
  it('refuses a player who is not a child before writing anything', async () => {
    const child = kaardimangHandlers('child');
    const post = (query: string, body: unknown) => new NextRequest(`https://example.test/api/kaardimang/rounds${query}`, { method: 'POST', body: JSON.stringify(body) });
    const params = { params: Promise.resolve({ roundId: `km_${'0'.repeat(8)}-0000-0000-0000-${'0'.repeat(12)}` }) };
    const responses = [
      await child.start.POST(post('?player=kaur', { actionId: aid(), viewId: 'europe-baltics', setId: null, level: 'explorer' })),
      await child.start.POST(post('?player=preview', { actionId: aid(), viewId: 'europe-baltics', setId: null, level: 'explorer' })),
      await child.answer.POST(post('?player=kairi', { actionId: aid(), revision: 0, questionIndex: 0, answerId: 'EST' }), params),
      await child.shown.POST(post('?player=nobody', { questionIndex: 0 }), params)
    ];
    expect(responses.map((response) => response.status)).toEqual([400, 400, 400, 400]);
    expect((db.prepare('SELECT COUNT(*) AS count FROM kaardimang_rounds').get() as { count: number }).count).toBe(0);
  });
});
