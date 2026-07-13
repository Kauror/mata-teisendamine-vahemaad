import { describe, expect, it } from 'vitest';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { KIRSI_FIRST_SOUND_TASKS } from '@/lib/kirsiFirstSoundTasks';
import { KIRSI_READING_PAIRS } from '@/lib/kirsiReadingPairs';
import { ENGLISH_VOCABULARY } from '@/lib/englishVocabulary';
import { AttemptContractError, recomputeScore } from '@/lib/server/attempts/scoreVerifier';
import type { GeneratedQuestion } from '@/lib/types';
import { buildMathQuestionResults, type MathAnswerSnapshot } from '@/lib/mathResults';

function answerFor(question: GeneratedQuestion) {
  if (question.kind === 'ordering' && question.orderingCards) {
    return [...question.orderingCards]
      .sort((a, b) => question.orderingDirection === 'desc' ? b.valueMm - a.valueMm : a.valueMm - b.valueMm)
      .map((card) => card.label)
      .join(' → ');
  }
  if (question.kind === 'choice' && question.choiceOptions) return question.choiceOptions[question.correctAnswer];
  if (question.kind === 'text' || question.correctAnswerText) return question.correctAnswerText;
  return String(question.correctAnswer);
}

describe('server-owned score recomputation', () => {
  it('regenerates math questions and ignores forged score/isCorrect flags', () => {
    const expected = generateKiurMathSession('pikkused', 'Teisendamine', 'Lihtne', 5, 42);
    const results = expected.map((question, index) => ({
      ...question,
      userAnswer: index === 0 ? 'definitely wrong' : answerFor(question),
      isCorrect: true
    }));
    const verified = recomputeScore({
      runnerId: 'math', learner: 'kiur', subject: 'matemaatika', topic: 'pikkused', category: 'Teisendamine',
      difficulty: 'Lihtne', seed: 42, questionIds: expected.map((question) => question.id), questions: results
    });
    expect(verified.score).toBe(4);
    expect(verified.isCorrect[0]).toBe(false);
  });

  it('rejects a changed generated question payload', () => {
    const expected = generateKiurMathSession('pikkused', 'Teisendamine', 'Lihtne', 1, 42);
    expect(() => recomputeScore({
      runnerId: 'math', learner: 'kiur', subject: 'matemaatika', topic: 'pikkused', category: 'Teisendamine',
      difficulty: 'Lihtne', seed: 42, questionIds: [expected[0].id], questions: [{ ...expected[0], question: 'forged', userAnswer: '0' }]
    })).toThrowError(AttemptContractError);
  });

  it('uses the fixed first-sound dataset instead of client isCorrect', () => {
    const tasks = KIRSI_FIRST_SOUND_TASKS.slice(0, 2);
    const verified = recomputeScore({
      runnerId: 'kirsi-first-sound', learner: 'kirsi', subject: 'lugemine', topic: 'esimene-haalik', category: 'first',
      difficulty: 'normal', seed: 1, questionIds: tasks.map((task) => task.id), questions: tasks.map((task, index) => ({
        id: task.id, selectedLetter: index === 0 ? task.correctLetter : '!', isCorrect: true
      }))
    });
    expect(verified.score).toBe(1);
  });

  it('rejects forged English and picture-word contract metadata while accepting unmodified answers', () => {
    const english = ENGLISH_VOCABULARY[0];
    const englishId = `run:1:0:${english.id}`;
    const baseEnglish = { id: englishId, question: english.english, vocabularyId: english.id, direction: 'en-et', userAnswer: english.estonian, isCorrect: false };
    expect(recomputeScore({ runnerId: 'kiur-english-sprint', learner: 'kiur', subject: 'inglise-keel', topic: 'sprint', category: 'Sprint', difficulty: 'normal', seed: 1, questionIds: [englishId], questions: [baseEnglish] }).score).toBe(1);
    for (const forged of [{ ...baseEnglish, vocabularyId: ENGLISH_VOCABULARY[1].id }, { ...baseEnglish, direction: 'et-en' }, { ...baseEnglish, question: 'forged' }]) {
      expect(() => recomputeScore({ runnerId: 'kiur-english-sprint', learner: 'kiur', subject: 'inglise-keel', topic: 'sprint', category: 'Sprint', difficulty: 'normal', seed: 1, questionIds: [englishId], questions: [forged] })).toThrow(AttemptContractError);
    }
    const picture = KIRSI_READING_PAIRS[0];
    const pictureId = `run:1:0:${picture.id}`;
    const basePicture = { id: pictureId, question: `${picture.image} â€” ${picture.word}`, vocabularyId: picture.id, selectedWord: picture.word, isCorrect: false };
    expect(recomputeScore({ runnerId: 'kirsi-picture-word', learner: 'kirsi', subject: 'lugemine', topic: 'pilt-ja-sona', category: 'Pilt ja sÃµna', difficulty: 'normal', seed: 1, questionIds: [pictureId], questions: [basePicture] }).score).toBe(1);
    for (const forged of [{ ...basePicture, vocabularyId: KIRSI_READING_PAIRS[1].id }, { ...basePicture, question: 'forged' }]) {
      expect(() => recomputeScore({ runnerId: 'kirsi-picture-word', learner: 'kirsi', subject: 'lugemine', topic: 'pilt-ja-sona', category: 'Pilt ja sÃµna', difficulty: 'normal', seed: 1, questionIds: [pictureId], questions: [forged] })).toThrow(AttemptContractError);
    }
  });

  it('matches client verification over a generated mathematics corpus', () => {
    const corpora = [
      { topic: 'pikkused', category: 'Segaharjutus', count: 15, seed: 42 },
      { topic: 'tekstulesanded', category: 'Tekstülesanded', count: 5, seed: 115 },
      { topic: 'korrutamine', category: 'Korrutamine', count: 15, seed: 7 },
      { topic: 'arvud-10000-piires', category: 'Segaharjutus', count: 15, seed: 99 }
    ];

    for (const corpus of corpora) {
      const questions = generateKiurMathSession(corpus.topic, corpus.category, 'Lihtne', corpus.count, corpus.seed);
      const snapshot: MathAnswerSnapshot = {
        answers: questions.map((question) => question.kind === 'text' ? question.correctAnswerText ?? '' : String(question.correctAnswer)),
        choiceAnswers: questions.map((question) => question.kind === 'choice' ? answerFor(question) ?? '' : ''),
        orderingAnswers: questions.map((question) => question.kind === 'ordering'
          ? [...(question.orderingCards ?? [])].sort((a, b) => question.orderingDirection === 'desc' ? b.valueMm - a.valueMm : a.valueMm - b.valueMm).map((card) => card.id)
          : [])
      };
      const client = buildMathQuestionResults(questions, snapshot);
      const server = recomputeScore({
        runnerId: 'math', learner: 'kiur', subject: 'matemaatika', topic: corpus.topic, category: corpus.category,
        difficulty: 'Lihtne', seed: corpus.seed, questionIds: questions.map((question) => question.id), questions: client
      });
      expect(server.isCorrect).toEqual(client.map((question) => question.isCorrect));
      expect(server.isCorrect.every(Boolean), `${corpus.topic}: ${JSON.stringify(client.filter((question) => !question.isCorrect))}`).toBe(true);

      const incorrectSnapshot: MathAnswerSnapshot = {
        answers: questions.map(() => 'definitely wrong'),
        choiceAnswers: questions.map(() => 'definitely wrong'),
        orderingAnswers: questions.map((question) => [...(question.orderingCards ?? [])].map((card) => card.id).reverse())
      };
      const clientIncorrect = buildMathQuestionResults(questions, incorrectSnapshot);
      const serverIncorrect = recomputeScore({
        runnerId: 'math', learner: 'kiur', subject: 'matemaatika', topic: corpus.topic, category: corpus.category,
        difficulty: 'Lihtne', seed: corpus.seed, questionIds: questions.map((question) => question.id), questions: clientIncorrect
      });
      expect(serverIncorrect.isCorrect).toEqual(clientIncorrect.map((question) => question.isCorrect));
    }
  });
});
