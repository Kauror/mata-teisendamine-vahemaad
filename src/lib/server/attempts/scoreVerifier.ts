import { generateKirsiSession } from '@/lib/exercises/kirsiMath';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { ENGLISH_VOCABULARY } from '@/lib/englishVocabulary';
import { KIRSI_FIRST_SOUND_TASKS } from '@/lib/kirsiFirstSoundTasks';
import { KIRSI_READING_PAIRS } from '@/lib/kirsiReadingPairs';
import { KIUR_READING_TASKS } from '@/lib/kiurReadingTasks';
import { LOODUSOPETUS_TASKS } from '@/lib/loodusopetus/tasks';
import { isChoiceTask, type ScienceTask } from '@/lib/loodusopetus/types';
import type { Difficulty, GeneratedQuestion } from '@/lib/types';
import { verifyGeneratedMathAnswer } from '@/lib/shared/answerVerification';

type ResultRow = Record<string, unknown>;

export type VerifiableAttempt = {
  runnerId: string;
  learner: 'kiur' | 'kirsi';
  subject: string;
  topic: string;
  category: string;
  difficulty: string;
  seed: number | string;
  questionIds: string[];
  questions: unknown[];
};

export type VerifiedScore = {
  score: number;
  questionCount: number;
  isCorrect: boolean[];
};

export class AttemptContractError extends Error {
  readonly code = 'question_contract_mismatch';
}

function row(value: unknown): ResultRow {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new AttemptContractError('Question result must be an object.');
  return value as ResultRow;
}

function normalize(value: unknown) {
  return String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('et');
}

function answerOf(result: ResultRow) {
  return result.userAnswer ?? result.selectedAnswer ?? result.selectedLetter ?? result.selectedWord ?? result.answer ?? '';
}

function uniqueQuestionIds(input: VerifiableAttempt) {
  if (input.questionIds.length !== input.questions.length || input.questionIds.length === 0) {
    throw new AttemptContractError('questionIds must match the question result count.');
  }
  if (new Set(input.questionIds).size !== input.questionIds.length) throw new AttemptContractError('Duplicate question IDs are not allowed.');
  input.questions.forEach((question, index) => {
    if (String(row(question).id ?? '') !== input.questionIds[index]) throw new AttemptContractError(`Question ID mismatch at position ${index}.`);
  });
}

function numberSeed(value: number | string) {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isSafeInteger(parsed)) throw new AttemptContractError('Runner seed is invalid.');
  return parsed;
}

function verifyMathQuestion(expected: GeneratedQuestion, actual: ResultRow) {
  if (actual.id !== expected.id || actual.question !== expected.question) throw new AttemptContractError(`Generated question ${expected.id} does not match its immutable contract.`);
  return verifyGeneratedMathAnswer(expected, answerOf(actual));
}

function verifyMath(input: VerifiableAttempt) {
  const count = input.questions.length;
  const seed = numberSeed(input.seed);
  const expected = input.learner === 'kirsi'
    ? generateKirsiSession(input.category as Parameters<typeof generateKirsiSession>[0], count, seed)
    : generateKiurMathSession(input.topic, input.category, input.difficulty as Difficulty, count, seed);
  if (expected.length !== count) throw new AttemptContractError('Generator returned an unexpected question count.');
  return expected.map((question, index) => verifyMathQuestion(question, row(input.questions[index])));
}

function verifyKiurReading(input: VerifiableAttempt) {
  const contracts = new Map(KIUR_READING_TASKS.map((task) => [task.id, task]));
  return input.questions.map((question, index) => {
    const actual = row(question);
    const expected = contracts.get(input.questionIds[index]);
    if (!expected || actual.question !== expected.question) throw new AttemptContractError(`Unknown reading task ${input.questionIds[index]}.`);
    return normalize(answerOf(actual)) === normalize(expected.correctAnswer);
  });
}

function verifyFirstSound(input: VerifiableAttempt) {
  const contracts = new Map(KIRSI_FIRST_SOUND_TASKS.map((task) => [task.id, task]));
  return input.questions.map((question, index) => {
    const expected = contracts.get(input.questionIds[index]);
    if (!expected) throw new AttemptContractError(`Unknown first-sound task ${input.questionIds[index]}.`);
    return normalize(answerOf(row(question))) === normalize(expected.correctLetter);
  });
}

function sameStringMap(actual: unknown, expected: Record<string, string>) {
  if (typeof actual !== 'object' || actual === null || Array.isArray(actual)) return false;
  const entries = Object.entries(actual as Record<string, unknown>);
  const expectedEntries = Object.entries(expected);
  return entries.length === expectedEntries.length && expectedEntries.every(([key, value]) => normalize((actual as Record<string, unknown>)[key]) === normalize(value));
}

function expectedScienceGroups(task: Extract<ScienceTask, { type: 'sort' }>) {
  const result: Record<string, string> = {};
  for (const [group, items] of Object.entries(task.correctGroups)) for (const item of items) result[item] = group;
  return result;
}

function verifyScience(input: VerifiableAttempt) {
  const contracts = new Map(LOODUSOPETUS_TASKS.map((task) => [task.id, task]));
  return input.questions.map((question, index) => {
    const actual = row(question);
    const expected = contracts.get(input.questionIds[index]);
    if (!expected || actual.type !== expected.type) throw new AttemptContractError(`Unknown science task ${input.questionIds[index]}.`);
    if (isChoiceTask(expected)) return actual.selectedChoiceId === expected.correctAnswer;
    if (expected.type === 'sort') return sameStringMap(actual.selectedGroups, expectedScienceGroups(expected));
    if (expected.type === 'match') return sameStringMap(actual.selectedMatches, expected.correctMatches);
    return false;
  });
}

function verifyPictureWords(input: VerifiableAttempt) {
  const contracts = new Map(KIRSI_READING_PAIRS.map((pair) => [pair.id, pair]));
  return input.questions.map((question, index) => {
    const actual = row(question);
    const vocabularyId = input.questionIds[index].split(':').at(-1);
    const expected = vocabularyId ? contracts.get(vocabularyId) : undefined;
    if (!expected || (actual.vocabularyId !== undefined && actual.vocabularyId !== vocabularyId) || actual.question !== `${expected.image} â€” ${expected.word}`) throw new AttemptContractError(`Unknown picture-word task ${input.questionIds[index]}.`);
    return normalize(actual.selectedWord ?? answerOf(actual)) === normalize(expected.word);
  });
}

function verifyEnglish(input: VerifiableAttempt) {
  const contracts = new Map(ENGLISH_VOCABULARY.map((word) => [word.id, word]));
  return input.questions.map((question, index) => {
    const actual = row(question);
    const vocabularyId = input.questionIds[index].split(':').at(-1);
    const expected = vocabularyId ? contracts.get(vocabularyId) : undefined;
    // The currently supported immutable runner contract is English prompt ->
    // Estonian response.  Direction is not client-selectable.
    if (!expected || (actual.vocabularyId !== undefined && actual.vocabularyId !== vocabularyId) || (actual.direction !== undefined && actual.direction !== 'en-et') || actual.question !== expected.english) throw new AttemptContractError(`Unknown English vocabulary item ${input.questionIds[index]}.`);
    const expectedAnswer = expected.estonian;
    return normalize(answerOf(actual)) === normalize(expectedAnswer);
  });
}

export function recomputeScore(input: VerifiableAttempt): VerifiedScore {
  uniqueQuestionIds(input);
  let correctness: boolean[];
  if (input.runnerId.includes('math')) correctness = verifyMath(input);
  else if (input.runnerId === 'kiur-reading') correctness = verifyKiurReading(input);
  else if (input.runnerId === 'kirsi-first-sound') correctness = verifyFirstSound(input);
  else if (input.runnerId === 'kirsi-picture-word') correctness = verifyPictureWords(input);
  else if (input.runnerId === 'kiur-science') correctness = verifyScience(input);
  else if (input.runnerId === 'kiur-english-sprint' || input.runnerId === 'kiur-english-practice') correctness = verifyEnglish(input);
  else throw new AttemptContractError(`Unsupported runner contract: ${input.runnerId}`);
  return {
    score: correctness.filter(Boolean).length,
    questionCount: correctness.length,
    isCorrect: correctness
  };
}
