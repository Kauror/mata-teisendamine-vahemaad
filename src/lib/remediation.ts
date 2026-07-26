import db from '@/lib/db';
import { ENGLISH_VOCABULARY } from '@/lib/englishVocabulary';
import { KIRSI_FIRST_SOUND_TASKS } from '@/lib/kirsiFirstSoundTasks';
import { KIRSI_READING_PAIRS } from '@/lib/kirsiReadingPairs';
import { awardStudyPointsForAttempt, exerciseKeyForAttempt } from '@/lib/learningPoints';
import { cleanScienceAnswer, getScienceTaskById } from '@/lib/loodusopetus/tasks';
import { isChoiceTask, type ChoiceScienceTask } from '@/lib/loodusopetus/types';
import {
  hasChoiceList,
  isRemediationAnswerCorrect,
  isRemediationRendererType,
  ORDERING_SEPARATOR,
  type RemediationQuestion,
  type RemediationRendererType
} from '@/lib/shared/remediationQuestion';
import { Learner, nowIso } from '@/lib/tasks';
import { isQuestionVisual } from '@/lib/types';

export { REMEDIATION_RENDERER_TYPES } from '@/lib/shared/remediationQuestion';
export type { RemediationQuestion, RemediationRendererType } from '@/lib/shared/remediationQuestion';

export const REMEDIATION_QUESTION_COUNT = 15;
export const REMEDIATION_MIN_OPEN_MISTAKES = 10;

type SavedQuestion = {
  id?: string;
  question?: string;
  userAnswer?: string;
  correctAnswer?: number;
  correctAnswers?: number[];
  isCorrect?: boolean;
  kind?: 'numeric' | 'ordering' | 'choice' | 'text';
  choiceOptions?: string[];
  expectedUnit?: string;
  image?: string;
  word?: string;
  correctLetter?: string;
  selectedLetter?: string;
  correctWord?: string;
  selectedWord?: string;
  correctAnswerText?: string;
  acceptedAnswers?: string[];
  selectedAnswer?: string;
  estonian?: string;
  explanation?: string;
  text?: string;
  type?: string;
  emoji?: string;
  objectLabel?: string;
  count?: number;
  choices?: number[];
  orderingCards?: Array<{ id: string; label: string; valueMm: number }>;
  orderingDirection?: 'asc' | 'desc';
  clockHour?: number;
  clockMinutes?: 0 | 15 | 30 | 45;
  visual?: string;
  visualKnownDegrees?: number;
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

// Key/dedup normalization (no decimal-comma folding, so "1,5" and "1.5" stay
// distinct prompts). Answer comparison lives in the shared module below so the
// browser and the server agree; see remediationAnswerMatches.
function normalize(value: unknown) {
  return String(value ?? '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
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

// Every answer that counts as right, plus what the child actually picked, must
// survive the cap — otherwise a question with more options than `total` renders
// without a right answer and cannot be answered at all.
function choicesWithDistractors(snapshot: PromptSnapshot, seed: number, total = 5) {
  const required = unique([
    ...(snapshot.acceptedAnswerLabels?.length ? snapshot.acceptedAnswerLabels : [snapshot.correctAnswerLabel]),
    snapshot.wrongAnswerLabel
  ]);
  const base = unique([...required, ...(snapshot.choices ?? [])]);
  const fillers = distractorsFor(snapshot.rendererType).filter((choice) => !base.some((existing) => normalize(existing) === normalize(choice)));
  return shuffle(unique([...base, ...fillers]).slice(0, Math.max(total, required.length)), seed);
}

// Comparison questions (e.g. "83 ___ 78") carry no choiceOptions; their
// correctAnswer is encoded as -1/0/1 meaning </=/>. Everywhere else in the app
// these render as the three sign buttons, so we map them the same way here.
function comparisonSign(code: number): string {
  return code === -1 ? '<' : code === 0 ? '=' : code === 1 ? '>' : '';
}

function isComparisonQuestion(question: { kind?: string; choiceOptions?: string[] }) {
  return question.kind === 'choice' && !question.choiceOptions?.length;
}

// Every answer that counts as right. Most questions have exactly one; a few
// choice questions list several indexes in correctAnswers ("Vali sobiv ühik"
// accepts mm, cm and dm) and text problems carry spelled-out alternatives in
// acceptedAnswers ("15.05" for "kell 15.05"). Both used to be dropped.
function acceptedLabels(question: SavedQuestion): string[] {
  const options = question.choiceOptions;
  if (options?.length && question.correctAnswers?.length) {
    return unique(question.correctAnswers.map((index) => options[index]).filter((label): label is string => Boolean(label)));
  }
  if (question.acceptedAnswers?.length && typeof question.correctAnswerText === 'string') {
    return unique([question.correctAnswerText, ...question.acceptedAnswers]);
  }
  return [];
}

function correctLabel(question: SavedQuestion) {
  if (typeof question.correctAnswerText === 'string') return question.correctAnswerText;
  if (typeof question.correctWord === 'string') return question.correctWord;
  if (typeof question.correctLetter === 'string') return question.correctLetter;
  if (question.choiceOptions?.length && typeof question.correctAnswer === 'number') return question.choiceOptions[question.correctAnswer] ?? '';
  if (isComparisonQuestion(question) && typeof question.correctAnswer === 'number') {
    const sign = comparisonSign(question.correctAnswer);
    if (sign) return sign;
  }
  if (typeof question.correctAnswer === 'number') return String(question.correctAnswer);
  return '';
}

function rendererFor(learner: Learner, subject: string, topic: string, question: SavedQuestion): RemediationRendererType | null {
  if (subject === 'matemaatika') {
    if (question.kind === 'text' || question.type === 'text-problem') return 'math_text_answer';
    if (learner === 'kirsi' && topic === 'loendamine' && question.type === 'counting') return 'counting_choice';
    if (question.kind === 'ordering') return 'ordering_sequence';
    return question.kind === 'choice' ? 'math_multiple_choice' : 'math_numeric';
  }
  if (learner === 'kirsi' && subject === 'lugemine' && topic === 'esimene-haalik') return 'initial_sound';
  if (learner === 'kirsi' && subject === 'lugemine' && topic === 'pilt-ja-sona') return 'word_picture_choice';
  if (learner === 'kiur' && subject === 'lugemine') return 'word_choice';
  if (learner === 'kiur' && subject === 'inglise-keel' && topic === 'sprint') return 'sprint_word_choice';
  // Only the single-choice science task types. 'sort' and 'match' are answered
  // by grouping items and pairing terms, which Kordamine has no control for, so
  // they stay out of the pool rather than being flattened into a guess.
  if (subject === 'loodusopetus') return scienceChoiceTask(question) ? 'science_choice' : null;
  return null;
}

// The saved science question carries the dataset task id, so the task itself is
// the source of truth for the prompt, the choices and the right answer.
function scienceChoiceTask(question: SavedQuestion): ChoiceScienceTask | null {
  const task = question.id ? getScienceTaskById(question.id) : undefined;
  if (!task || task.type !== question.type || !isChoiceTask(task)) return null;
  return task;
}

type SnapshotInput = {
  learner: Learner;
  subject: string;
  topic: string;
  category: string;
  question: SavedQuestion;
  questionIndex: number;
};

// The dataset id is the only field the replay trusts: the prompt, the diagram,
// the options and the right answer are all read back from the dataset when the
// session is built, so a snapshot can never disagree with the task it refers
// to. The raw saved question is kept alongside for debugging, as elsewhere.
function buildScienceSnapshot(input: SnapshotInput): PromptSnapshot | null {
  const task = scienceChoiceTask(input.question);
  const wrongAnswerLabel = input.question.userAnswer || input.question.selectedAnswer || '';
  if (!task || !wrongAnswerLabel) return null;

  return {
    sessionItemId: 0,
    mistakeId: 0,
    rendererType: 'science_choice',
    exerciseKey: exerciseKeyForAttempt(input.learner, input.category, input.topic),
    promptText: `${task.title}: ${task.prompt}`,
    correctAnswerLabel: cleanScienceAnswer(task.correctAnswerText),
    wrongAnswerLabel,
    scienceTaskId: task.id,
    originalQuestionData: input.question
  };
}

// Ordering is answered by arranging the cards, so the right answer is a
// sequence, not a label. The cards carry the measurement that defines the
// order, so it is derived here once and stored as the sequence the child has to
// reproduce; the cards themselves are kept in the order they were presented in.
function buildOrderingSnapshot(input: SnapshotInput): PromptSnapshot | null {
  const cards = input.question.orderingCards ?? [];
  const wrongAnswerLabel = input.question.userAnswer || '';
  if (cards.length < 2 || !input.question.question || !wrongAnswerLabel) return null;
  if (cards.some((card) => !card.id || !card.label || typeof card.valueMm !== 'number')) return null;

  const correctOrder = [...cards]
    .sort((a, b) => input.question.orderingDirection === 'desc' ? b.valueMm - a.valueMm : a.valueMm - b.valueMm)
    .map((card) => card.label);

  return {
    sessionItemId: 0,
    mistakeId: 0,
    rendererType: 'ordering_sequence',
    exerciseKey: exerciseKeyForAttempt(input.learner, input.category, input.topic),
    promptText: input.question.question,
    correctAnswerLabel: correctOrder.join(ORDERING_SEPARATOR),
    wrongAnswerLabel,
    orderingCards: cards.map((card) => ({ id: card.id, label: card.label })),
    originalQuestionData: input.question
  };
}

function buildSnapshot(input: SnapshotInput): PromptSnapshot | null {
  if (input.question.isCorrect !== false) return null;
  const rendererType = rendererFor(input.learner, input.subject, input.topic, input.question);
  if (!rendererType) return null;
  if (rendererType === 'science_choice') return buildScienceSnapshot(input);
  if (rendererType === 'ordering_sequence') return buildOrderingSnapshot(input);

  const rawPromptText = input.question.question || '';
  const correctAnswerLabel = correctLabel(input.question);
  const wrongAnswerLabel = input.question.userAnswer || input.question.selectedAnswer || input.question.selectedLetter || input.question.selectedWord || '';
  if (!rawPromptText || !correctAnswerLabel || !wrongAnswerLabel) return null;

  const exerciseKey = exerciseKeyForAttempt(input.learner, input.category, input.topic);
  const choices = !hasChoiceList(rendererType)
    ? undefined
    : isComparisonQuestion(input.question)
    ? ['<', '=', '>']
    : unique([...(input.question.choiceOptions ?? []), correctAnswerLabel, wrongAnswerLabel]);
  const accepted = acceptedLabels(input.question);
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
    promptEmoji: rendererType === 'counting_choice' ? input.question.emoji : undefined,
    objectLabel: rendererType === 'counting_choice' ? input.question.objectLabel : undefined,
    count: rendererType === 'counting_choice' ? input.question.count : undefined,
    targetWord: input.question.word,
    readingText: input.question.text,
    correctAnswerLabel,
    acceptedAnswerLabels: accepted.length > 1 ? accepted : undefined,
    wrongAnswerLabel,
    expectedUnit: isKirsiMath ? undefined : input.question.expectedUnit,
    clockHour: input.question.type === 'clock' ? input.question.clockHour : undefined,
    clockMinutes: input.question.type === 'clock' ? input.question.clockMinutes : undefined,
    promptVisual: isQuestionVisual(input.question.visual) ? input.question.visual : undefined,
    promptVisualKnownDegrees: input.question.visualKnownDegrees,
    choices,
    originalQuestionData: input.question
  };
}

function mistakeKeyFor(snapshot: PromptSnapshot) {
  const parts = [snapshot.exerciseKey, snapshot.rendererType, normalize(snapshot.promptText), normalize(snapshot.promptImage), normalize(snapshot.targetWord), normalize(snapshot.correctAnswerLabel)];
  // Appended, never inserted: an extra trailing segment leaves the key of every
  // renderer that does not use it byte-identical, so mistakes already open in
  // the pool keep deduplicating against new captures instead of forking.
  if (snapshot.scienceTaskId) parts.push(snapshot.scienceTaskId);
  return parts.join('|');
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

// A mistake is only usable when this build knows its renderer type AND can
// rebuild a complete question from the stored snapshot. Both the badge and the
// session are built from this one list, so the count a child sees can never
// promise more than the session can actually deliver.
function openRenderableMistakes(learner: Learner) {
  const rows = db.prepare(`
    SELECT *
    FROM mistake_pool
    WHERE learner = ? AND status = 'open'
    ORDER BY wrongCount DESC, lastWrongAt DESC, id ASC
  `).all(learner) as MistakeRow[];
  return rows.filter((row) => isRemediationRendererType(row.rendererType) && questionForMistake(row, 0) !== null);
}

export function getOpenRenderableMistakeCount(learner: Learner) {
  return openRenderableMistakes(learner).length;
}

function parseSnapshot(raw: string): PromptSnapshot | null {
  try {
    const parsed = JSON.parse(raw) as PromptSnapshot;
    return parsed && typeof parsed.promptText === 'string' && typeof parsed.correctAnswerLabel === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

// Repairs comparison snapshots captured before the </=/> mapping fix, where the
// correct answer was stored as the raw code "-1"/"0"/"1" and the choices ended
// up as e.g. ["1", "<"] — making the question impossible. Mutates in place.
function repairLegacyComparison(snapshot: PromptSnapshot) {
  if (snapshot.rendererType !== 'math_multiple_choice') return;
  const original = snapshot.originalQuestionData;
  if (original?.choiceOptions?.length) return; // real multiple-choice, not a comparison
  if (!/^-?[01]$/.test(String(snapshot.correctAnswerLabel))) return;
  const sign = comparisonSign(Number(snapshot.correctAnswerLabel));
  if (!sign) return;
  snapshot.correctAnswerLabel = sign;
  snapshot.choices = ['<', '=', '>'];
}

// Rebuilt entirely from the dataset. If the task is gone, has stopped being a
// choice task, or has two options that read the same (so a text answer could
// not say which was picked), the mistake is skipped rather than guessed at.
function scienceQuestionForSnapshot(snapshot: PromptSnapshot, mistakeId: number, sessionItemId: number, seed: number): RemediationQuestion | null {
  const task = snapshot.scienceTaskId ? getScienceTaskById(snapshot.scienceTaskId) : undefined;
  if (!task || !isChoiceTask(task)) return null;

  const choices = task.choices.map((choice) => cleanScienceAnswer(choice.text));
  const correctAnswerLabel = cleanScienceAnswer(task.correctAnswerText);
  if (unique(choices).length !== choices.length) return null;
  if (!choices.some((choice) => normalize(choice) === normalize(correctAnswerLabel))) return null;

  return {
    sessionItemId,
    mistakeId,
    rendererType: 'science_choice',
    promptText: task.prompt,
    scienceTitle: task.title,
    scienceTaskId: task.id,
    scienceTaskType: task.type,
    scienceDiagram: task.type === 'visual_choice' ? task.diagram : task.type === 'data_evidence' ? task.diagram : undefined,
    scienceData: task.type === 'data_evidence' ? task.data : undefined,
    readingText: task.type === 'reading_choice' ? task.text : undefined,
    correctAnswerLabel,
    choices: shuffle(choices, seed)
  };
}

function questionForMistake(row: MistakeRow, position: number, sessionItemId = 0): RemediationQuestion | null {
  const snapshot = parseSnapshot(row.promptSnapshotJson);
  if (!snapshot) return null;
  repairLegacyComparison(snapshot);
  const seed = row.id * 997 + position * 37;
  if (snapshot.rendererType === 'science_choice') return scienceQuestionForSnapshot(snapshot, row.id, sessionItemId, seed);
  const choices = !hasChoiceList(snapshot.rendererType) ? undefined : choicesWithDistractors(snapshot, seed, snapshot.rendererType === 'initial_sound' ? 3 : 5);
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
  // The raw saved question has been stored in full since the first version of
  // this module, so visuals recorded before promptVisual existed are recovered
  // from there. A visual this build cannot draw makes the whole question
  // unusable rather than a silently pictureless one — never guess.
  const rawVisual = original.visual ?? snapshot.promptVisual;
  if (rawVisual !== undefined && !isQuestionVisual(rawVisual)) return null;
  return {
    sessionItemId,
    mistakeId: row.id,
    rendererType: snapshot.rendererType,
    promptText,
    promptImage,
    promptEmoji: original.emoji ?? snapshot.promptEmoji,
    objectLabel: original.objectLabel ?? snapshot.objectLabel,
    count: original.count ?? snapshot.count,
    targetWord: original.word ?? snapshot.targetWord,
    readingText: original.text ?? snapshot.readingText,
    correctAnswerLabel: snapshot.correctAnswerLabel,
    acceptedAnswerLabels: snapshot.acceptedAnswerLabels,
    orderingCards: snapshot.orderingCards,
    expectedUnit,
    clockHour: original.type === 'clock' ? original.clockHour ?? snapshot.clockHour : snapshot.clockHour,
    clockMinutes: original.type === 'clock' ? original.clockMinutes ?? snapshot.clockMinutes : snapshot.clockMinutes,
    promptVisual: rawVisual,
    promptVisualKnownDegrees: original.visualKnownDegrees ?? snapshot.promptVisualKnownDegrees,
    choices
  };
}

// Explicit return type: `db` is untyped (better-sqlite3 ships no types here),
// so db.transaction() would otherwise widen the whole session to `any` at every
// call site, including the API route.
export function startRemediationSession(learner: Learner): { sessionId: number; questions: RemediationQuestion[] } {
  const openRows = openRenderableMistakes(learner);
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
      // Unreachable: openRenderableMistakes() already proved every row renders.
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
      if (!question) throw new Error('Küsimust ei saanud lugeda.');
      const childAnswer = answerMap.get(item.id) ?? '';
      const isCorrect = isRemediationAnswerCorrect(question, childAnswer);
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
        // What the review screens use to decide how to show the answer, so it
        // has to describe how the child actually answered.
        kind: question.rendererType === 'math_numeric'
          ? 'numeric' as const
          : question.rendererType === 'math_text_answer'
          ? 'text' as const
          : question.rendererType === 'ordering_sequence' ? 'ordering' as const : 'choice' as const,
        choiceOptions: question.choices,
        clockHour: question.clockHour,
        clockMinutes: question.clockMinutes,
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
