import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import {
  captureMistakesForAttempt,
  getOpenRenderableMistakeCount,
  REMEDIATION_QUESTION_COUNT,
  startRemediationSession
} from '@/lib/remediation';
import { remediationAnswerMatches } from '@/lib/shared/remediationAnswer';

// Kordamine had no unit coverage at all. These tests pin the two properties the
// screen depends on: every question it hands the child must be answerable, and a
// single unusable row in the pool must never take the whole screen down.

let nextAttemptId = 1;

function insertAttempt() {
  const id = nextAttemptId++;
  db.prepare(`
    INSERT INTO attempts (id, createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, subject, topic)
    VALUES (?, '2026-07-20T10:00:00.000Z', 'Segaharjutus', 'Lihtne', 15, 0, 60, '[]', 'kiur', 'matemaatika', 'arvud-10000')
  `).run(id);
  return id;
}

function captureMath(questions: unknown[]) {
  captureMistakesForAttempt({
    attemptId: insertAttempt(),
    learner: 'kiur',
    subject: 'matemaatika',
    topic: 'arvud-10000',
    category: 'Segaharjutus',
    questions
  });
}

function numericMistake(index: number) {
  return {
    id: `n-${index}`,
    question: `Arvuta: ${index} + ${index}`,
    correctAnswer: index * 2,
    userAnswer: String(index * 2 + 1),
    isCorrect: false
  };
}

// Enough usable mistakes to open a session (REMEDIATION_MIN_OPEN_MISTAKES = 10).
function seedUsablePool(count = 12) {
  captureMath(Array.from({ length: count }, (_, index) => numericMistake(index + 1)));
}

function insertRawMistake(mistakeKey: string, rendererType: string, promptSnapshotJson: string) {
  db.prepare(`
    INSERT INTO mistake_pool (
      learner, mistakeKey, exerciseKey, rendererType, status, promptSnapshotJson, correctAnswerSnapshot,
      lastWrongAnswerSnapshot, wrongCount, reviewWrongCount, firstWrongAt, lastWrongAt, createdAt, updatedAt
    ) VALUES ('kiur', ?, 'kiur.math.segaharjutus', ?, 'open', ?, '1', '2', 99, 0,
      '2026-07-20T10:00:00.000Z', '2026-07-20T10:00:00.000Z', '2026-07-20T10:00:00.000Z', '2026-07-20T10:00:00.000Z')
  `).run(mistakeKey, rendererType, promptSnapshotJson);
}

beforeEach(() => {
  db.prepare('DELETE FROM remediation_session_items').run();
  db.prepare('DELETE FROM remediation_sessions').run();
  db.prepare('DELETE FROM mistake_pool').run();
  db.prepare('DELETE FROM attempts').run();
  nextAttemptId = 1;
});

describe('mistake capture', () => {
  it('captures wrong answers and ignores correct ones', () => {
    captureMath([
      numericMistake(1),
      { id: 'ok', question: 'Arvuta: 5 + 5', correctAnswer: 10, userAnswer: '10', isCorrect: true }
    ]);
    expect(getOpenRenderableMistakeCount('kiur')).toBe(1);
  });
});

describe('startRemediationSession resilience', () => {
  it('builds a full session from a usable pool', () => {
    seedUsablePool();
    const session = startRemediationSession('kiur');
    expect(session.questions).toHaveLength(REMEDIATION_QUESTION_COUNT);
    expect(session.questions.every((question) => question.correctAnswerLabel.length > 0)).toBe(true);
  });

  it('skips a corrupt snapshot instead of breaking the whole screen', () => {
    seedUsablePool();
    insertRawMistake('corrupt', 'math_numeric', '{ not json');

    // The badge must not promise the unusable row either.
    expect(getOpenRenderableMistakeCount('kiur')).toBe(12);
    expect(() => startRemediationSession('kiur')).not.toThrow();
    expect(startRemediationSession('kiur').questions).toHaveLength(REMEDIATION_QUESTION_COUNT);
  });

  it('skips a renderer type this build does not know', () => {
    seedUsablePool();
    insertRawMistake('future', 'holographic_choice', JSON.stringify({
      rendererType: 'holographic_choice',
      promptText: 'Küsimus tulevikust',
      correctAnswerLabel: '42',
      wrongAnswerLabel: '41',
      exerciseKey: 'kiur.math.segaharjutus'
    }));

    expect(getOpenRenderableMistakeCount('kiur')).toBe(12);
    const session = startRemediationSession('kiur');
    expect(session.questions.some((question) => question.promptText === 'Küsimus tulevikust')).toBe(false);
  });

  it('stays closed while too few mistakes are usable', () => {
    captureMath([numericMistake(1), numericMistake(2)]);
    insertRawMistake('corrupt', 'math_numeric', 'nope');
    expect(() => startRemediationSession('kiur')).toThrow(/Kordamine avaneb/);
  });
});

describe('choice rendering', () => {
  it('keeps the correct answer when a question has more options than the cap', () => {
    const options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'õige'];
    captureMath([
      ...Array.from({ length: 11 }, (_, index) => numericMistake(index + 1)),
      {
        id: 'wide',
        question: 'Vali õige vastus',
        kind: 'choice',
        choiceOptions: options,
        correctAnswer: 7,
        userAnswer: 'a',
        isCorrect: false
      }
    ]);

    const session = startRemediationSession('kiur');
    const wide = session.questions.find((question) => question.promptText === 'Vali õige vastus');
    expect(wide).toBeDefined();
    expect(wide?.choices).toContain('õige');
    expect(wide?.correctAnswerLabel).toBe('õige');
  });
});

describe('remediationAnswerMatches', () => {
  it('is the same forgiving comparison on both sides of the wire', () => {
    expect(remediationAnswerMatches(' Õige ', 'oige')).toBe(true);
    expect(remediationAnswerMatches('1,5', '1.5')).toBe(true);
    expect(remediationAnswerMatches('KÄSI', 'kasi')).toBe(true);
    expect(remediationAnswerMatches('5', '6')).toBe(false);
    expect(remediationAnswerMatches('', '3')).toBe(false);
  });
});
