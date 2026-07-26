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

describe('question visuals', () => {
  const radiusQuestion = {
    id: 'cr-1',
    question: 'Milline sirglõik on raadius?',
    kind: 'choice',
    choiceOptions: ['A', 'B', 'C'],
    correctAnswer: 0,
    visual: 'radius-demo',
    userAnswer: 'C',
    isCorrect: false
  };

  it('replays the drawing a choice question is meaningless without', () => {
    captureMath([...Array.from({ length: 11 }, (_, index) => numericMistake(index + 1)), radiusQuestion]);
    const question = startRemediationSession('kiur').questions
      .find((item) => item.promptText === 'Milline sirglõik on raadius?');
    expect(question?.promptVisual).toBe('radius-demo');
  });

  it('carries the sector angle a question asks about', () => {
    captureMath([
      ...Array.from({ length: 11 }, (_, index) => numericMistake(index + 1)),
      {
        id: 'cm-1',
        question: 'Ring on jagatud kaheks osaks. Värvitud osa on 90°. Kui suur on teine osa?',
        correctAnswer: 270,
        visual: 'sector-missing',
        visualKnownDegrees: 90,
        userAnswer: '180',
        isCorrect: false
      }
    ]);
    const question = startRemediationSession('kiur').questions.find((item) => item.promptVisual === 'sector-missing');
    expect(question?.promptVisualKnownDegrees).toBe(90);
  });

  it('recovers a visual from a snapshot written before promptVisual existed', () => {
    seedUsablePool(11);
    // Exactly what buildSnapshot stored before this field was added: no
    // top-level promptVisual, but the full raw question under
    // originalQuestionData, which it has always kept.
    insertRawMistake('legacy-visual', 'math_multiple_choice', JSON.stringify({
      rendererType: 'math_multiple_choice',
      exerciseKey: 'kiur.math.ring.segaharjutus',
      promptText: 'Milline sirglõik on läbimõõt?',
      correctAnswerLabel: 'B',
      wrongAnswerLabel: 'A',
      choices: ['A', 'B', 'C'],
      originalQuestionData: { ...radiusQuestion, question: 'Milline sirglõik on läbimõõt?', visual: 'diameter-demo' }
    }));

    const question = startRemediationSession('kiur').questions
      .find((item) => item.promptText === 'Milline sirglõik on läbimõõt?');
    expect(question?.promptVisual).toBe('diameter-demo');
  });

  it('drops a question whose visual this build cannot draw rather than showing it blind', () => {
    seedUsablePool(11);
    insertRawMistake('unknown-visual', 'math_multiple_choice', JSON.stringify({
      rendererType: 'math_multiple_choice',
      exerciseKey: 'kiur.math.ring.segaharjutus',
      promptText: 'Millist kujundit näed?',
      correctAnswerLabel: 'A',
      wrongAnswerLabel: 'B',
      choices: ['A', 'B'],
      originalQuestionData: { visual: 'hypercube-demo' }
    }));

    expect(getOpenRenderableMistakeCount('kiur')).toBe(11);
    const session = startRemediationSession('kiur');
    expect(session.questions.some((item) => item.promptText === 'Millist kujundit näed?')).toBe(false);
  });
});

describe('Loodusõpetus mistakes', () => {
  // Real dataset ids: the whole point is that the replay reads the task back
  // from the dataset rather than trusting a copy stored with the answer.
  const READING = 'SCI-READ-001';
  const SORT = 'SCI-SORT-001';

  function captureScience(questions: unknown[]) {
    captureMistakesForAttempt({
      attemptId: insertAttempt(),
      learner: 'kiur',
      subject: 'loodusopetus',
      topic: 'segaharjutus',
      category: 'Loodusõpetus',
      questions
    });
  }

  function savedScience(id: string, type: string, extra: Record<string, unknown> = {}) {
    return {
      id,
      type,
      question: 'salvestatud tekst, mida ei usaldata',
      kind: 'choice',
      correctAnswer: 0,
      isCorrect: false,
      userAnswer: 'See on külm kivipall',
      correctAnswerText: 'vananenud koopia',
      ...extra
    };
  }

  it('captures a single-choice science mistake', () => {
    seedUsablePool(11);
    captureScience([savedScience(READING, 'reading_choice')]);
    expect(getOpenRenderableMistakeCount('kiur')).toBe(12);

    const question = startRemediationSession('kiur').questions.find((item) => item.scienceTaskId === READING);
    expect(question?.rendererType).toBe('science_choice');
    // Rebuilt from the dataset, not from the stale text stored with the answer.
    expect(question?.scienceTitle).toBe('Päikese roll');
    expect(question?.correctAnswerLabel).toBe('See annab valgust ja soojust');
    expect(question?.readingText).toBeTruthy();
    expect(question?.choices).toHaveLength(4);
    expect(question?.choices).toContain('See annab valgust ja soojust');
  });

  it('leaves sort and match out of the pool', () => {
    captureScience([
      savedScience(SORT, 'sort', { userAnswer: 'Elus: koer', selectedGroups: { koer: 'Elus' } }),
      savedScience('SCI-MATCH-001', 'match', { userAnswer: 'täht → põleb', selectedMatches: {} })
    ]);
    expect(getOpenRenderableMistakeCount('kiur')).toBe(0);
  });

  it('skips a task the dataset no longer has', () => {
    seedUsablePool(11);
    captureScience([savedScience(READING, 'reading_choice')]);
    db.prepare("UPDATE mistake_pool SET promptSnapshotJson = replace(promptSnapshotJson, ?, 'SCI-READ-999') WHERE rendererType = 'science_choice'")
      .run(READING);
    expect(getOpenRenderableMistakeCount('kiur')).toBe(11);
  });

  it('ignores a saved answer whose type disagrees with the dataset', () => {
    captureScience([savedScience(READING, 'sort')]);
    expect(getOpenRenderableMistakeCount('kiur')).toBe(0);
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
