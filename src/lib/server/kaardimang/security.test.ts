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
  it('names no unresolved answer anywhere in a question except the options and the highlighted shape', () => {
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
        // The options must list the answer, and a "which country is highlighted"
        // question must highlight it; nothing else may carry it.
        const visible: Record<string, unknown> = { ...question };
        delete visible.options;
        if (question.kind === 'name_highlighted') delete visible.highlightId;
        expect(JSON.stringify(visible), `${round.viewId} ${question.kind}`).not.toContain(`"${keys[index].answerId}"`);
        expect(JSON.stringify(visible), `${round.viewId} ${question.kind}`).not.toContain(`:${keys[index].answerId}"`);
        checked += 1;
      });
    }
    expect(checked).toBeGreaterThan(20);
  });

  it('reveals the target once the question is resolved, for the answer label on the map', async () => {
    const round = startRound(preview, { actionId: aid(), viewId: 'europe-baltics', setId: null, level: 'explorer' });
    const key = frozen(round.roundId).questions[0];
    const { answer } = await import('@/lib/server/kaardimang/rounds');
    const after = answer(preview, round.roundId, { actionId: aid(), revision: round.revision, questionIndex: 0, answerId: key.answerId }).round;
    expect(after.questions[0].correctId).toBe(key.answerId);
    expect(after.questions[0].targetId).toBe(key.targetId);
  });
});

describe('Kaardimäng child routes while closed', () => {
  it('refuses every child route with 403 before reading the request', async () => {
    const child = kaardimangHandlers('child');
    const post = (body: unknown) => new NextRequest('https://example.test/api/kaardimang/rounds', { method: 'POST', body: JSON.stringify(body) });
    const params = { params: Promise.resolve({ roundId: `km_${'0'.repeat(8)}-0000-0000-0000-${'0'.repeat(12)}` }) };
    const responses = [
      await child.overview.GET(),
      await child.start.POST(post({ actionId: aid(), viewId: 'europe-baltics', setId: null, level: 'explorer' })),
      await child.round.GET(new NextRequest('https://example.test/api/kaardimang/rounds/x'), params),
      await child.answer.POST(post({ actionId: aid(), revision: 0, questionIndex: 0, answerId: 'EST' }), params)
    ];
    expect(responses.map((response) => response.status)).toEqual([403, 403, 403, 403]);
    expect((db.prepare('SELECT COUNT(*) AS count FROM kaardimang_rounds').get() as { count: number }).count).toBe(0);
  });
});
