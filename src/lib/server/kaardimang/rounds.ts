import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import db from '@/lib/db';
import { nowIso } from '@/lib/tasks';
import { CATALOG, nameOf, quizCapital, viewCountries } from '@/content/kaardimang/catalog';
import { DATA_VERSION, findView, LEVELS, MAP_VIEWS, WORLD_SETS, type LevelId, type WorldSetId } from '@/content/kaardimang/regions';
import type { MapViewData } from '@/content/kaardimang/types';
import {
  ANSWER_ID_PATTERN,
  buildRound,
  gradeAnswer,
  toClientQuestion,
  type RoundState,
  type TargetStat,
  type ViewGeometry
} from '@/lib/kaardimang/engine';
import type { AnswerResponse, KaardimangErrorCode, KaardimangScope, OverviewResponse, ParentKaardimangResponse, RoundSummary, RoundView } from '@/lib/kaardimang/api';
import { seededRng } from '@/lib/random';

// Kaardimäng rounds on the server. A round is frozen when it starts
// (questions, options, keys, data version) and then only moves forward one
// answer at a time. Every write is idempotent by actionId and guarded by the
// revision. Nothing here touches stars, attempts, history or the textbook.

export type KaardimangLearner = 'kiur' | 'preview';
export type KaardimangContext = { scope: KaardimangScope; learner: KaardimangLearner };

export class KaardimangApiError extends Error {
  constructor(readonly code: KaardimangErrorCode, message: string, readonly round?: RoundView) {
    super(message);
  }
}

type RoundRow = {
  id: string;
  learner: string;
  viewId: string;
  setId: string | null;
  level: LevelId;
  dataVersion: string;
  status: 'active' | 'completed' | 'abandoned';
  stateJson: string;
  revision: number;
  startActionId: string;
  lastActionId: string | null;
  lastResultJson: string | null;
  correct: number;
  firstTryCorrect: number;
  total: number;
};

const geometryCache = new Map<string, ViewGeometry | null>();

// The view's own map file, for the "Vihje: … asub kaardi idaosas" hints.
function viewGeometry(viewId: string): ViewGeometry | null {
  if (!geometryCache.has(viewId)) {
    try {
      const file = path.join(process.cwd(), 'public', 'kaardimang', 'maps', DATA_VERSION, `${viewId}.json`);
      const data = JSON.parse(readFileSync(file, 'utf8')) as MapViewData;
      geometryCache.set(viewId, { width: data.width, height: data.height, labels: data.labels, markers: data.markers });
    } catch {
      geometryCache.set(viewId, null);
    }
  }
  return geometryCache.get(viewId)!;
}

function loadStats(learner: KaardimangLearner): Map<string, TargetStat> {
  const rows = db.prepare('SELECT targetKey, seen, firstTryCorrect, missCount FROM kaardimang_target_stats WHERE learner = ?').all(learner) as Array<TargetStat & { targetKey: string }>;
  return new Map(rows.map((row) => [row.targetKey, row]));
}

// Countries in the view's set that the learner has met in any question.
function practicedIn(viewId: string, stats: Map<string, TargetStat>): [number, number] {
  const view = findView(viewId);
  if (!view) return [0, 0];
  const countries = view.kind === 'world'
    ? CATALOG.countries.filter((country) => country.target && (country.tappableIn ?? []).includes('world'))
    : viewCountries(view);
  const seen = countries.filter((country) => (stats.get(`country:${country.id}`)?.seen ?? 0) + (stats.get(`capital:${country.id}`)?.seen ?? 0) > 0);
  return [seen.length, countries.length];
}

function summaryOf(row: RoundRow, state: RoundState): RoundSummary {
  const [practiced, practicedOf] = practicedIn(row.viewId, loadStats(row.learner as KaardimangLearner));
  const review = state.questions
    .filter((question, index) => state.states[index].attempts > 0)
    .map((question) => nameOf(question.targetId));
  return {
    correct: row.correct,
    firstTryCorrect: row.firstTryCorrect,
    total: row.total,
    practiced,
    practicedOf,
    reviewNames: [...new Set(review)]
  };
}

function toView(row: RoundRow): RoundView {
  const state = JSON.parse(row.stateJson) as RoundState;
  return {
    roundId: row.id,
    viewId: row.viewId,
    setId: row.setId as WorldSetId | null,
    level: row.level,
    dataVersion: row.dataVersion,
    status: row.status,
    revision: row.revision,
    cursor: state.cursor,
    questions: state.questions.map((question, index) => toClientQuestion(question, state.states[index])),
    summary: row.status === 'completed' ? summaryOf(row, state) : null
  };
}

function loadRow(context: KaardimangContext, roundId: string): RoundRow {
  const row = db.prepare('SELECT * FROM kaardimang_rounds WHERE id = ? AND learner = ?').get(roundId, context.learner) as RoundRow | undefined;
  if (!row) throw new KaardimangApiError('not_found', 'Mänguvooru ei leitud.');
  return row;
}

export function getOverview(context: KaardimangContext): OverviewResponse {
  const active = db.prepare("SELECT * FROM kaardimang_rounds WHERE learner = ? AND status = 'active'").get(context.learner) as RoundRow | undefined;
  const stats = loadStats(context.learner);
  const practiced: OverviewResponse['practiced'] = {};
  for (const view of MAP_VIEWS) if (view.kind === 'part' || view.kind === 'subregion') practiced[view.id] = practicedIn(view.id, stats);
  let activeRound: OverviewResponse['activeRound'] = null;
  if (active) {
    const state = JSON.parse(active.stateJson) as RoundState;
    activeRound = { roundId: active.id, viewId: active.viewId, setId: active.setId as WorldSetId | null, level: active.level, answered: state.cursor, total: active.total };
  }
  return { scope: context.scope, activeRound, practiced };
}

export function getRound(context: KaardimangContext, roundId: string): RoundView {
  return toView(loadRow(context, roundId));
}

// Starts a new round; a round still open for this learner is set aside
// ("abandoned") — one map game at a time. Repeating the same actionId returns
// the round it already started.
export function startRound(context: KaardimangContext, input: { actionId: string; viewId: unknown; setId: unknown; level: unknown }): RoundView {
  const view = typeof input.viewId === 'string' ? findView(input.viewId) : undefined;
  if (!view) throw new KaardimangApiError('invalid_request', 'Sellist kaarti ei ole.');
  const level = LEVELS.find((item) => item.id === input.level)?.id;
  if (!level) throw new KaardimangApiError('invalid_request', 'Sellist raskusastet ei ole.');
  let setId: WorldSetId | null = null;
  if (view.kind === 'world') {
    setId = WORLD_SETS.find((item) => item.id === input.setId)?.id ?? null;
    if (!setId) throw new KaardimangApiError('invalid_request', 'Vali, mida maailmakaardil harjutad.');
  } else if (input.setId !== null && input.setId !== undefined) {
    throw new KaardimangApiError('invalid_request', 'Sellel kaardil ei ole valikut.');
  }

  return db.transaction(() => {
    const repeated = db.prepare('SELECT * FROM kaardimang_rounds WHERE learner = ? AND startActionId = ?').get(context.learner, input.actionId) as RoundRow | undefined;
    if (repeated) return toView(repeated);
    const now = nowIso();
    db.prepare("UPDATE kaardimang_rounds SET status = 'abandoned', updatedAt = ? WHERE learner = ? AND status = 'active'").run(now, context.learner);
    const seed = Math.floor(Math.random() * 2 ** 31);
    const state = buildRound({ view, setId, level }, viewGeometry(view.id), loadStats(context.learner), seededRng(seed));
    const id = `km_${randomUUID()}`;
    db.prepare(`
      INSERT INTO kaardimang_rounds (id, learner, viewId, setId, level, dataVersion, status, stateJson, revision, startActionId, total, startedAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, 'active', ?, 0, ?, ?, ?, ?)
    `).run(id, context.learner, view.id, setId, level, DATA_VERSION, JSON.stringify(state), input.actionId, state.questions.length, now, now);
    return toView(loadRow(context, id));
  }).immediate();
}

function recordTarget(learner: KaardimangLearner, targetKey: string, firstTry: boolean, misses: number, now: string) {
  db.prepare(`
    INSERT INTO kaardimang_target_stats (learner, targetKey, seen, firstTryCorrect, missCount, lastSeenAt, lastMissedAt)
    VALUES (?, ?, 1, ?, ?, ?, ?)
    ON CONFLICT(learner, targetKey) DO UPDATE SET
      seen = seen + 1,
      firstTryCorrect = firstTryCorrect + excluded.firstTryCorrect,
      missCount = missCount + excluded.missCount,
      lastSeenAt = excluded.lastSeenAt,
      lastMissedAt = COALESCE(excluded.lastMissedAt, lastMissedAt)
  `).run(learner, targetKey, firstTry ? 1 : 0, misses, now, misses > 0 ? now : null);
}

export function answer(context: KaardimangContext, roundId: string, input: { actionId: string; revision: number; questionIndex: unknown; answerId: unknown }): AnswerResponse {
  if (typeof input.answerId !== 'string' || !ANSWER_ID_PATTERN.test(input.answerId)) throw new KaardimangApiError('invalid_request', 'Vastus puudub.');
  if (typeof input.questionIndex !== 'number' || !Number.isInteger(input.questionIndex)) throw new KaardimangApiError('invalid_request', 'Küsimus puudub.');
  const answerId = input.answerId;
  const questionIndex = input.questionIndex;
  return db.transaction(() => {
    const row = loadRow(context, roundId);
    // A retried request: already applied, return what it returned.
    if (row.lastActionId === input.actionId && row.lastResultJson) {
      return { round: toView(row), feedback: JSON.parse(row.lastResultJson) as AnswerResponse['feedback'] };
    }
    if (row.status !== 'active') throw new KaardimangApiError('stale', 'See mänguvoor on juba lõppenud.', toView(row));
    if (row.revision !== input.revision) throw new KaardimangApiError('stale', 'Mäng jätkus teises aknas.', toView(row));
    const state = JSON.parse(row.stateJson) as RoundState;
    if (questionIndex !== state.cursor) throw new KaardimangApiError('not_current_question', 'See küsimus ei ole praegu ekraanil.', toView(row));
    const question = state.questions[state.cursor];
    let result: ReturnType<typeof gradeAnswer>;
    try {
      result = gradeAnswer(question, state.states[state.cursor], answerId);
    } catch {
      throw new KaardimangApiError('invalid_request', 'See vastus ei sobi selle küsimusega.');
    }
    const now = nowIso();
    const states = [...state.states];
    states[state.cursor] = result.state;
    let { correct, firstTryCorrect } = row;
    let cursor = state.cursor;
    if (result.state.resolved) {
      if (result.state.resolved === 'correct') correct += 1;
      if (result.state.firstTry) firstTryCorrect += 1;
      recordTarget(context.learner, question.targetKey, Boolean(result.state.firstTry), result.state.attempts, now);
      cursor += 1;
    }
    const completed = cursor >= state.questions.length;
    const feedback = { questionIndex: state.cursor, outcome: result.outcome, messageEt: result.messageEt };
    const update = db.prepare(`
      UPDATE kaardimang_rounds
      SET stateJson = ?, revision = revision + 1, lastActionId = ?, lastResultJson = ?, correct = ?, firstTryCorrect = ?,
          status = ?, completedAt = ?, updatedAt = ?
      WHERE id = ? AND revision = ?
    `).run(JSON.stringify({ ...state, states, cursor }), input.actionId, JSON.stringify(feedback), correct, firstTryCorrect,
      completed ? 'completed' : 'active', completed ? now : null, now, row.id, row.revision);
    if (update.changes !== 1) throw new KaardimangApiError('stale', 'Mäng jätkus teises aknas.', toView(loadRow(context, roundId)));
    return { round: toView(loadRow(context, roundId)), feedback };
  }).immediate();
}

// Parent preview: forget everything the preview learner did. Only rows whose
// learner is 'preview' are touched.
export function resetPreview(): { deletedRounds: number } {
  return db.transaction(() => {
    const rounds = db.prepare("DELETE FROM kaardimang_rounds WHERE learner = 'preview'").run().changes;
    db.prepare("DELETE FROM kaardimang_target_stats WHERE learner = 'preview'").run();
    return { deletedRounds: rounds };
  }).immediate();
}

// The parent's read-only summary: data coverage and Kiur's progress.
export function parentOverview(): ParentKaardimangResponse {
  const stats = loadStats('kiur');
  const targets = CATALOG.countries.filter((country) => country.target);
  const practiced = targets.filter((country) => (stats.get(`country:${country.id}`)?.seen ?? 0) + (stats.get(`capital:${country.id}`)?.seen ?? 0) > 0);
  const toReview = [...stats.entries()]
    .filter(([key, stat]) => stat.missCount > stat.firstTryCorrect && (key.startsWith('country:') || key.startsWith('capital:')))
    .sort((left, right) => right[1].missCount - left[1].missCount)
    .slice(0, 10)
    .map(([key]) => nameOf(key.split(':')[1]));
  const rounds = (db.prepare("SELECT COUNT(*) AS count FROM kaardimang_rounds WHERE learner = 'kiur' AND status = 'completed'").get() as { count: number }).count;
  return {
    dataVersion: DATA_VERSION,
    ekiAsOf: CATALOG.ekiAsOf,
    countries: targets.length,
    exploreOnly: CATALOG.countries.filter((country) => !country.target).map((country) => country.nameEt),
    noCapitalQuestion: targets.filter((country) => !quizCapital(country)).map((country) => ({
      nameEt: country.nameEt,
      reasonEt: country.capitals.length === 0 ? (country.noteEt ?? 'Pealinna ei ole.') : country.capitals.length > 1
        ? `Mitu pealinna: ${country.capitals.map((capital) => `${capital.nameEt} (${capital.roleLabelEt})`).join(', ')}.`
        : (country.capitals[0].noteEt ?? 'Pealinna staatus vajab selgitust.')
    })),
    kiur: { rounds, practiced: practiced.length, practicedOf: targets.length, toReview: [...new Set(toReview)] }
  };
}
