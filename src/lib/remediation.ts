import db from '@/lib/db';
import { ENGLISH_VOCABULARY } from '@/lib/englishVocabulary';
import { KIRSI_FIRST_SOUND_TASKS } from '@/lib/kirsiFirstSoundTasks';
import { KIRSI_READING_PAIRS } from '@/lib/kirsiReadingPairs';
import { awardStudyPointsForAttempt, exerciseKeyForAttempt } from '@/lib/learningPoints';
import { Learner, nowIso } from '@/lib/tasks';

export const REMEDIATION_QUESTION_COUNT = 15;
export const REMEDIATION_MIN_OPEN_MISTAKES = 10;

export type RemediationRendererType =
  | 'math_numeric'
  | 'math_multiple_choice'
  | 'initial_sound'
  | 'word_choice'
  | 'word_picture_choice'
  | 'sprint_word_choice';

type SavedQuestion = {
  id?: string;
  question?: string;
  userAnswer?: string;
  correctAnswer?: number;
  correctAnswers?: number[];
  isCorrect?: boolean;
  kind?: 'numeric' | 'ordering' | 'choice';
  choiceOptions?: string[];
  expectedUnit?: string;
  image?: string;
  word?: string;
  correctLetter?: string;
  selectedLetter?: string;
  correctWord?: string;
  selectedWord?: string;
  correctAnswerText?: string;
  selectedAnswer?: string;
  estonian?: string;
  explanation?: string;
  text?: string;
};

export type RemediationQuestion = {
  sessionItemId: number;
  mistakeId: number;
  rendererType: RemediationRendererType;
  promptText: string;
  promptImage?: string;
  targetWord?: string;
  readingText?: string;
  correctAnswerLabel: string;
  expectedUnit?: string;
  choices?: string[];
};

type PromptSnapshot = RemediationQuestion & {
  exerciseKey: string;
  wrongAnswerLabel: string;
  originalQuestionData: SavedQuestion;
};

type MistakeRow = {
  id: number;
  learner: Learner;
  mistakeKey: string;
  exerciseKey: string;
  rendererType: RemediationRendererType;
  status: 'open' | 'resolved';
  promptSnapshotJson: string;
  correctAnswerSnapshot: string;
  lastWrongAnswerSnapshot: string | null;
  wrongCount: number;
  reviewWrongCount: number;
  firstWrongAt: string;
  lastWrongAt: string;
  lastReviewedAt: string | null;
  resolvedAt: string | null;
  resolvedByAttemptId: number | null;
  sourceAttemptId: number | null;
  sourceQuestionIndex: number | null;
  createdAt: string;
  updatedAt: string;
};

type SessionRow = {
  id: number;
  learner: Learner;
  completedAt: string | null;
  historyAttemptId: number | null;
  score: number | null;
};

type SessionItemRow = {
  id: number;
  sessionId: number;
  mistakeId: number;
  position: number;
  renderedQuestionJson: string;
  childAnswer: string | null;
  isCorrect: number | null;
};

function normalize(value: unknown) {
  return String(value ?? '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
}

function answerMatches(answer: string, correct: string) {
  return normalize(answer).replace(',', '.') === normalize(correct).replace(',', '.');
}

function unique(values: string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = normalize(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function shuffle<T>(values: T[], seed: number) {
  const copy = [...values];
  let state = seed || 1;
  const next = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function distractorsFor(type: RemediationRendererType) {
  if (type === 'initial_sound') {
    return unique(KIRSI_FIRST_SOUND_TASKS.flatMap((task) => task.options));
  }
  if (type === 'word_picture_choice') {
    return unique(KIRSI_READING_PAIRS.map((pair) => pair.word));
  }
  if (type === 'sprint_word_choice') {
    return unique(ENGLISH_VOCABULARY.map((word) => word.estonian));
  }
  return [];
}

function choicesWithDistractors(snapshot: PromptSnapshot, seed: number, total = 5) {
  const base = unique([...(snapshot.choices ?? []), snapshot.correctAnswerLabel, snapshot.wrongAnswerLabel]);
  const fillers = distractorsFor(snapshot.rendererType).filter((choice) => !base.some((existing) => normalize(existing) === normalize(choice)));
  return shuffle(unique([...base, ...fillers]).slice(0, total), seed);
}

function correctLabel(question: SavedQuestion) {
  if (typeof question.correctAnswerText === 'string') return question.correctAnswerText;
  if (typeof question.correctWord === 'string') return question.correctWord;
  if (typeof question.correctLetter === 'string') return question.correctLetter;
  if (question.choiceOptions?.length && typeof question.correctAnswer === 'number') return question.choiceOptions[question.correctAnswer] ?? '';
  if (typeof question.correctAnswer === 'number') return String(question.correctAnswer);
  return '';
}

function rendererFor(learner: Learner, subject: string, topic: string, question: SavedQuestion): RemediationRendererType | null {
  if (subject === 'matemaatika') {
    if (question.kind === 'ordering') return null;
    return question.kind === 'choice' ? 'math_multiple_choice' : 'math_numeric';
  }
  if (learner === 'kirsi' && subject === 'lugemine' && topic === 'esimene-haalik') return 'initial_sound';
  if (learner === 'kirsi' && subject === 'lugemine' && topic === 'pilt-ja-sona') return 'word_picture_choice';
  if (learner === 'kiur' && subject === 'lugemine') return 'word_choice';
  if (learner === 'kiur' && subject === 'inglise-keel' && topic === 'sprint') return 'sprint_word_choice';
  return null;
}

function buildSnapshot(input: {
  learner: Learner;
  subject: string;
  topic: string;
  category: string;
  question: SavedQuestion;
  questionIndex: number;
}): PromptSnapshot | null {
  if (input.question.isCorrect !== false) return null;
  if (input.question.correctAnswers && input.question.correctAnswers.length > 1) return null;
  const rendererType = rendererFor(input.learner, input.subject, input.topic, input.question);
  if (!rendererType) return null;

  const rawPromptText = input.question.question || '';
  const correctAnswerLabel = correctLabel(input.question);
  const wrongAnswerLabel = input.question.userAnswer || input.question.selectedAnswer || input.question.selectedLetter || input.question.selectedWord || '';
  if (!rawPromptText || !correctAnswerLabel || !wrongAnswerLabel) return null;

  const exerciseKey = exerciseKeyForAttempt(input.learner, input.category, input.topic);
  const choices = rendererType === 'math_numeric'
    ? undefined
    : unique([...(input.question.choiceOptions ?? []), correctAnswerLabel, wrongAnswerLabel]);
  const isKirsiMath = input.learner === 'kirsi' && input.subject === 'matemaatika';
  const promptText = rendererType === 'initial_sound'
    ? ''
    : rendererType === 'word_picture_choice'
    ? 'Vali õige sõna.'
    : input.question.question || '';
  const promptImage = rendererType === 'word_picture_choice' || rendererType === 'initial_sound'
    ? input.question.image
    : undefined;

  return {
    sessionItemId: 0,
    mistakeId: 0,
    rendererType,
    exerciseKey,
    promptText,
    promptImage,
    targetWord: input.question.word,
    readingText: input.question.text,
    correctAnswerLabel,
    wrongAnswerLabel,
    expectedUnit: isKirsiMath ? undefined : input.question.expectedUnit,
    choices,
    originalQuestionData: input.question
  };
}

function mistakeKeyFor(snapshot: PromptSnapshot) {
  return [snapshot.exerciseKey, snapshot.rendererType, normalize(snapshot.promptText), normalize(snapshot.promptImage), normalize(snapshot.targetWord), normalize(snapshot.correctAnswerLabel)].join('|');
}

export function captureMistakesForAttempt(input: {
  attemptId: number;
  learner: Learner | null;
  subject: string | null;
  topic: string;
  category: string;
  questions: unknown;
}) {
  if (!input.learner || !input.subject || input.subject === 'kordamine' || !Array.isArray(input.questions)) return;
  const wrongAt = nowIso();

  for (let index = 0; index < input.questions.length; index += 1) {
    try {
      const question = input.questions[index] as SavedQuestion;
      const snapshot = buildSnapshot({ learner: input.learner, subject: input.subject, topic: input.topic, category: input.category, question, questionIndex: index });
      if (!snapshot) continue;
      const mistakeKey = mistakeKeyFor(snapshot);
      const promptSnapshotJson = JSON.stringify(snapshot);

      db.prepare(`
        INSERT INTO mistake_pool (
          learner, mistakeKey, exerciseKey, rendererType, status, promptSnapshotJson, correctAnswerSnapshot,
          lastWrongAnswerSnapshot, wrongCount, reviewWrongCount, firstWrongAt, lastWrongAt,
          sourceAttemptId, sourceQuestionIndex, createdAt, updatedAt
        )
        VALUES (?, ?, ?, ?, 'open', ?, ?, ?, 1, 0, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(learner, mistakeKey) DO UPDATE SET
          status = 'open',
          promptSnapshotJson = excluded.promptSnapshotJson,
          lastWrongAnswerSnapshot = excluded.lastWrongAnswerSnapshot,
          wrongCount = wrongCount + 1,
          lastWrongAt = excluded.lastWrongAt,
          resolvedAt = NULL,
          resolvedByAttemptId = NULL,
          sourceAttemptId = excluded.sourceAttemptId,
          sourceQuestionIndex = excluded.sourceQuestionIndex,
          updatedAt = excluded.updatedAt
      `).run(input.learner, mistakeKey, snapshot.exerciseKey, snapshot.rendererType, promptSnapshotJson, snapshot.correctAnswerLabel, snapshot.wrongAnswerLabel, wrongAt, wrongAt, input.attemptId, index, wrongAt, wrongAt);
    } catch (error) {
      console.warn('Mistake capture skipped', error);
    }
  }
}

export function getOpenRenderableMistakeCount(learner: Learner) {
  const row = db.prepare(`
    SELECT COUNT(*) as count
    FROM mistake_pool
    WHERE learner = ? AND status = 'open' AND rendererType <> 'unknown'
  `).get(learner) as { count: number } | undefined;
  return row?.count ?? 0;
}

function parseSnapshot(raw: string): PromptSnapshot | null {
  try {
    const parsed = JSON.parse(raw) as PromptSnapshot;
    return parsed && typeof parsed.promptText === 'string' && typeof parsed.correctAnswerLabel === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

function questionForMistake(row: MistakeRow, position: number, sessionItemId = 0): RemediationQuestion | null {
  const snapshot = parseSnapshot(row.promptSnapshotJson);
  if (!snapshot) return null;
  const seed = row.id * 997 + position * 37;
  const choices = snapshot.rendererType === 'math_numeric' ? undefined : choicesWithDistractors(snapshot, seed, snapshot.rendererType === 'initial_sound' ? 3 : 5);
  const original = snapshot.originalQuestionData ?? {};
  const promptText = snapshot.rendererType === 'initial_sound'
    ? ''
    : snapshot.rendererType === 'word_picture_choice'
    ? 'Vali õige sõna.'
    : snapshot.promptText;
  const promptImage = snapshot.rendererType === 'initial_sound' || snapshot.rendererType === 'word_picture_choice'
    ? original.image ?? snapshot.promptImage
    : snapshot.promptImage;
  const expectedUnit = snapshot.exerciseKey.startsWith('kirsi.math.') ? undefined : snapshot.expectedUnit;
  return {
    sessionItemId,
    mistakeId: row.id,
    rendererType: snapshot.rendererType,
    promptText,
    promptImage,
    targetWord: original.word ?? snapshot.targetWord,
    readingText: original.text ?? snapshot.readingText,
    correctAnswerLabel: snapshot.correctAnswerLabel,
    expectedUnit,
    choices
  };
}

function rowsForSession(learner: Learner) {
  return db.prepare(`
    SELECT *
    FROM mistake_pool
    WHERE learner = ? AND status = 'open' AND rendererType <> 'unknown'
    ORDER BY wrongCount DESC, lastWrongAt DESC, id ASC
  `).all(learner) as MistakeRow[];
}

export function startRemediationSession(learner: Learner) {
  const openRows = rowsForSession(learner);
  if (openRows.length < REMEDIATION_MIN_OPEN_MISTAKES) {
    throw new Error('Kordamine avaneb siis, kui kogunenud on 10 asja.');
  }

  const selected = openRows.slice(0, REMEDIATION_QUESTION_COUNT);
  let repeatIndex = 0;
  while (selected.length < REMEDIATION_QUESTION_COUNT) {
    selected.push(openRows[repeatIndex % openRows.length]);
    repeatIndex += 1;
  }

  const createdAt = nowIso();
  const tx = db.transaction(() => {
    const session = db.prepare(`
      INSERT INTO remediation_sessions (learner, startedAt, questionCount, metadataJson)
      VALUES (?, ?, ?, ?)
    `).run(learner, createdAt, REMEDIATION_QUESTION_COUNT, JSON.stringify({ openMistakeCount: openRows.length }));
    const sessionId = Number(session.lastInsertRowid);
    const questions: RemediationQuestion[] = [];

    selected.forEach((row, index) => {
      const question = questionForMistake(row, index);
      if (!question) throw new Error('Harjutust ei saanud alustada.');
      const item = db.prepare(`
        INSERT INTO remediation_session_items (sessionId, mistakeId, position, renderedQuestionJson)
        VALUES (?, ?, ?, ?)
      `).run(sessionId, row.id, index, JSON.stringify(question));
      const sessionItemId = Number(item.lastInsertRowid);
      const questionWithId = { ...question, sessionItemId };
      db.prepare('UPDATE remediation_session_items SET renderedQuestionJson = ? WHERE id = ?').run(JSON.stringify(questionWithId), sessionItemId);
      questions.push(questionWithId);
    });

    return { sessionId, questions };
  });

  return tx();
}

export function getRemediationSession(sessionId: number, learner: Learner) {
  const session = db.prepare('SELECT * FROM remediation_sessions WHERE id = ? AND learner = ?').get(sessionId, learner) as SessionRow | undefined;
  if (!session) return null;
  const items = db.prepare('SELECT * FROM remediation_session_items WHERE sessionId = ? ORDER BY position ASC').all(sessionId) as SessionItemRow[];
  const questions = items.map((item) => parseSnapshotSafeQuestion(item.renderedQuestionJson)).filter((item): item is RemediationQuestion => Boolean(item));
  return { session, questions };
}

function parseSnapshotSafeQuestion(raw: string): RemediationQuestion | null {
  try {
    const parsed = JSON.parse(raw) as RemediationQuestion;
    return parsed && typeof parsed.sessionItemId === 'number' ? parsed : null;
  } catch {
    return null;
  }
}

export function submitRemediationSession(input: {
  learner: Learner;
  sessionId: number;
  answers: Array<{ sessionItemId: number; answer: string }>;
  elapsedSeconds: number;
}) {
  const tx = db.transaction(() => {
    const session = db.prepare('SELECT * FROM remediation_sessions WHERE id = ? AND learner = ?').get(input.sessionId, input.learner) as SessionRow | undefined;
    if (!session) throw new Error('Kordamist ei leitud.');
    if (session.completedAt && session.historyAttemptId) {
      return { historyAttemptId: session.historyAttemptId, score: session.score ?? 0, questionCount: REMEDIATION_QUESTION_COUNT, reward: awardStudyPointsForAttempt(session.historyAttemptId), resolvedCount: 0 };
    }

    const items = db.prepare('SELECT * FROM remediation_session_items WHERE sessionId = ? ORDER BY position ASC').all(input.sessionId) as SessionItemRow[];
    if (items.length !== REMEDIATION_QUESTION_COUNT) throw new Error('Kordamine ei ole valmis.');
    const answerMap = new Map(input.answers.map((answer) => [answer.sessionItemId, String(answer.answer ?? '')]));
    const answeredAt = nowIso();
    const latestByMistake = new Map<number, { allCorrect: boolean; anyWrong: boolean }>();
    const historyQuestions = items.map((item) => {
      const question = parseSnapshotSafeQuestion(item.renderedQuestionJson);
      if (!question) throw new Error('KÃ¼simust ei saanud lugeda.');
      const childAnswer = answerMap.get(item.id) ?? '';
      const isCorrect = answerMatches(childAnswer, question.correctAnswerLabel);
      const current = latestByMistake.get(item.mistakeId) ?? { allCorrect: true, anyWrong: false };
      latestByMistake.set(item.mistakeId, { allCorrect: current.allCorrect && isCorrect, anyWrong: current.anyWrong || !isCorrect });

      db.prepare('UPDATE remediation_session_items SET childAnswer = ?, isCorrect = ?, answeredAt = ? WHERE id = ?')
        .run(childAnswer, isCorrect ? 1 : 0, answeredAt, item.id);

      return {
        id: `kordamine-${item.id}`,
        mistakeId: item.mistakeId,
        rendererType: question.rendererType,
        question: question.promptText,
        image: question.promptImage,
        word: question.targetWord,
        text: question.readingText,
        userAnswer: childAnswer,
        correctAnswer: 0,
        correctAnswerText: question.correctAnswerLabel,
        isCorrect,
        kind: question.rendererType === 'math_numeric' ? 'numeric' as const : 'choice' as const,
        choiceOptions: question.choices,
        expectedUnit: question.expectedUnit
      };
    });

    const score = historyQuestions.filter((question) => question.isCorrect).length;
    const createdAt = nowIso();
    const attempt = db.prepare(`
      INSERT INTO attempts (createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, subject, topic)
      VALUES (?, 'Kordamine', 'Tavaline', ?, ?, ?, ?, ?, 'kordamine', 'kordamine')
    `).run(createdAt, REMEDIATION_QUESTION_COUNT, score, Math.max(0, Math.floor(input.elapsedSeconds || 0)), JSON.stringify(historyQuestions), input.learner);
    const attemptId = Number(attempt.lastInsertRowid);

    let resolvedCount = 0;
    for (const [mistakeId, state] of latestByMistake.entries()) {
      if (state.allCorrect) {
        const result = db.prepare(`
          UPDATE mistake_pool
          SET status = 'resolved', resolvedAt = ?, resolvedByAttemptId = ?, lastReviewedAt = ?, updatedAt = ?
          WHERE id = ?
        `).run(createdAt, attemptId, createdAt, createdAt, mistakeId);
        if (result.changes > 0) resolvedCount += 1;
      } else if (state.anyWrong) {
        db.prepare(`
          UPDATE mistake_pool
          SET status = 'open', reviewWrongCount = reviewWrongCount + 1, lastReviewedAt = ?, lastWrongAt = ?, updatedAt = ?
          WHERE id = ?
        `).run(createdAt, createdAt, createdAt, mistakeId);
      }
    }

    db.prepare(`
      UPDATE remediation_sessions
      SET completedAt = ?, score = ?, historyAttemptId = ?, metadataJson = ?
      WHERE id = ?
    `).run(createdAt, score, attemptId, JSON.stringify({ resolvedCount }), input.sessionId);

    const reward = awardStudyPointsForAttempt(attemptId);
    db.prepare('UPDATE remediation_sessions SET earnedStars = ? WHERE id = ?').run(reward?.awardedAmount ?? 0, input.sessionId);
    return { historyAttemptId: attemptId, score, questionCount: REMEDIATION_QUESTION_COUNT, reward, resolvedCount };
  });

  return tx();
}
