import db from '@/lib/db';
import { isoToAppDate } from '@/lib/appDate';
import { recordDailyLeaderboard } from '@/lib/leaderboard';
import { ensureCurrentRewardPolicy, REWARD_ENGINE_VERSION } from '@/lib/server/rewards/policy';
import { applyRewardProjectionV2, getProjectedRewardV2 } from '@/lib/server/rewards/projection';
import type { RewardView } from '@/lib/textbook/api';
import type { TestRunState } from '@/lib/textbook/testSession';
import type { AnswerItem, AnswerResponse, AnswerSpec, Course, Question } from '@/lib/textbook/types';
import { assertRealEffects, type TextbookContext } from '@/lib/server/textbook/context';

// A passed final test is settled exactly like a passed English vocabulary
// unit test (SPEC D3, lib/server/vocabulary/sessions.ts insertPassedTestAttempt):
// ONE canonical protocol-v2 learning attempt, settled inside the submit
// transaction by the reward v2 projection (the parent's learning-point
// settings, decay, daily cap and streak rules apply unchanged) and counted for
// the daily leaderboard. Once per unit per app day — a repeat pass on the same
// day is practice and creates nothing. Idempotent: the clientAttemptId and the
// textbook_rewards row are both keyed by the test session.
//
// Never for the preview: assertRealEffects refuses any non-child context.

export const TEXTBOOK_RUNNER_ID = 'textbook';
export const TEXTBOOK_RUNNER_VERSION = 'textbook-v1';
export const TEXTBOOK_GENERATOR_VERSION = 'textbook-2026-10';
export const TEXTBOOK_TOPIC = 'opik';

export function textbookExerciseId(learner: string, courseId: string) {
  return `${learner}.textbook.${courseId}`;
}

const MAX_ACTIVE_SECONDS_PER_QUESTION = 120;

function itemText(items: readonly AnswerItem[], id: string) {
  return items.find((item) => item.id === id)?.text ?? id;
}

// A readable form of an answer for the attempt history.
export function describeResponse(answer: AnswerSpec, response: AnswerResponse | undefined): string {
  if (!response || response.type !== answer.type) return '';
  switch (answer.type) {
    case 'single_choice':
      return itemText(answer.options, (response as Extract<AnswerResponse, { type: 'single_choice' }>).optionId);
    case 'multiple_selection':
      return (response as Extract<AnswerResponse, { type: 'multiple_selection' }>).optionIds.map((id) => itemText(answer.options, id)).join(', ');
    case 'matching': {
      const pairs = (response as Extract<AnswerResponse, { type: 'matching' }>).pairs;
      return answer.prompts.map((prompt) => `${prompt.text} – ${pairs[prompt.id] ? itemText(answer.choices, pairs[prompt.id]) : '?'}`).join('; ');
    }
    case 'grouping': {
      const assignments = (response as Extract<AnswerResponse, { type: 'grouping' }>).assignments;
      return answer.items.map((item) => `${item.text}: ${assignments[item.id] ? itemText(answer.groups, assignments[item.id]) : '?'}`).join('; ');
    }
    case 'ordering':
      return (response as Extract<AnswerResponse, { type: 'ordering' }>).order.map((id) => itemText(answer.items, id)).join(' → ');
    case 'diagram_hotspot':
      return (response as Extract<AnswerResponse, { type: 'diagram_hotspot' }>).regionId;
  }
}

// Has a passed test of this unit already counted on this app day?
export function textbookTestCountedOn(learner: string, courseId: string, unitId: string, completionDate: string) {
  return Boolean(db.prepare('SELECT 1 FROM textbook_rewards WHERE learner = ? AND courseId = ? AND unitId = ? AND completionDate = ? LIMIT 1').get(learner, courseId, unitId, completionDate));
}

type SettleInput = {
  sessionId: string;
  course: Course;
  unitId: string;
  startedAt: string;
  state: TestRunState;
  now: string;
};

// Returns the attempt id, or null when the pass does not count (already
// counted today). Must run inside the submit transaction.
export function settlePassedTest(context: TextbookContext, input: SettleInput): number | null {
  const learner = assertRealEffects(context);
  const { sessionId, course, unitId, state, now } = input;
  const result = state.result;
  if (!result || !result.passed) throw new Error('Only a passed textbook test is settled.');

  const existing = db.prepare('SELECT attemptId FROM textbook_rewards WHERE sessionId = ?').get(sessionId) as { attemptId: number } | undefined;
  if (existing) return existing.attemptId;
  const completionDate = isoToAppDate(now) ?? now.slice(0, 10);
  if (textbookTestCountedOn(learner, course.id, unitId, completionDate)) return null;

  const clientAttemptId = `textbook-test:${sessionId}`;
  const prior = db.prepare('SELECT id FROM attempts WHERE clientAttemptId = ?').get(clientAttemptId) as { id: number } | undefined;
  if (prior) return prior.id;

  const byId = new Map(result.questions.map((item) => [item.questionId, item]));
  const questions = state.snapshot.questions.map(({ question }: { question: Question }) => {
    const graded = byId.get(question.id);
    return {
      id: `${sessionId}:${question.id}`,
      taskId: question.id,
      question: question.stem,
      userAnswer: describeResponse(question.answer, graded?.response),
      correctAnswer: 0,
      correctAnswerText: describeResponse(question.answer, graded?.correctResponse),
      explanation: question.explanation,
      isCorrect: graded?.correct ?? false,
      kind: 'text' as const
    };
  });
  const wallSeconds = Math.max(0, Math.round((Date.parse(now) - Date.parse(input.startedAt)) / 1000));
  const elapsedSeconds = Number.isFinite(wallSeconds) ? Math.min(wallSeconds, questions.length * MAX_ACTIVE_SECONDS_PER_QUESTION) : 0;
  // A stable category per course (like VOCAB_CATEGORY); the unit is in the
  // questions and in textbook_rewards.
  const category = course.title;
  const policy = ensureCurrentRewardPolicy();
  const inserted = db.prepare(`
    INSERT INTO attempts (
      createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions,
      learner, subject, topic, exerciseId,
      clientAttemptId, deviceId, startedAt, completedAt, rawDeviceCompletedAt, syncedAt,
      catalogueVersion, clientCorrectedCompletedAt, effectiveCompletedAt, completionDate, clockStatus, clockSkewMs,
      rewardPolicyVersion, rewardEngineVersion, generatorVersion, runnerId, runnerVersion,
      rotationVersion, runnerSeed, questionIdsJson, protocolVersion, rewardSettlementStatus, reviewReasonCode
    ) VALUES (?, ?, 'Tavaline', ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, NULL, ?, ?, ?, 'ok', 0, ?, ?, ?, ?, ?, 1, ?, ?, 2, 'eligible', NULL)
  `).run(
    now, category, result.total, result.correct, elapsedSeconds, JSON.stringify(questions),
    learner, course.subject, TEXTBOOK_TOPIC, textbookExerciseId(learner, course.id),
    clientAttemptId, input.startedAt, now, now, now,
    now, now, completionDate,
    policy.version, REWARD_ENGINE_VERSION, TEXTBOOK_GENERATOR_VERSION, TEXTBOOK_RUNNER_ID, TEXTBOOK_RUNNER_VERSION,
    String(state.snapshot.seed), JSON.stringify(state.snapshot.questions.map((frozen) => frozen.question.id))
  );
  const attemptId = Number(inserted.lastInsertRowid);
  db.prepare('INSERT INTO textbook_rewards (sessionId, learner, courseId, unitId, attemptId, completionDate, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(sessionId, learner, course.id, unitId, attemptId, completionDate, now);
  applyRewardProjectionV2(learner, attemptId);
  recordDailyLeaderboard(completionDate);
  return attemptId;
}

export function rewardViewFor(attemptId: number | null): RewardView | null {
  if (!attemptId) return null;
  const attempt = db.prepare('SELECT rewardSettlementStatus FROM attempts WHERE id = ?').get(attemptId) as { rewardSettlementStatus: string } | undefined;
  const reward = getProjectedRewardV2(attemptId);
  return {
    awardedAmount: reward?.awardedAmount ?? 0,
    balanceAfter: reward?.balanceAfter ?? 0,
    held: attempt?.rewardSettlementStatus !== 'eligible'
  };
}
