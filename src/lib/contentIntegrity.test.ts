import { describe, expect, it } from 'vitest';
import { ENGLISH_VOCABULARY } from '@/lib/englishVocabulary';
import { generateKirsiSession } from '@/lib/exercises/kirsiMath';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { KIRSI_FIRST_SOUND_TASKS } from '@/lib/kirsiFirstSoundTasks';
import { KIRSI_READING_PAIRS } from '@/lib/kirsiReadingPairs';
import { KIUR_READING_TASKS, getValidKiurReadingTasks } from '@/lib/kiurReadingTasks';
import { KIUR_MATH_TOPICS } from '@/lib/kiurMathTopics';
import { kiurTextProblemPool } from '@/lib/kiurTextProblems';
import type { GeneratedQuestion } from '@/lib/types';

const CORRUPTED_TEXT = /\uFFFD|Ã.|Â.|â€|ðŸ|\b(undefined|NaN|\[object Object\])\b/;

function expectUniqueNonEmptyIds(items: Array<{ id: string }>) {
  const ids = items.map((item) => item.id);
  expect(ids.every((id) => id.trim().length > 0)).toBe(true);
  expect(new Set(ids).size).toBe(ids.length);
}

function expectCleanText(...values: string[]) {
  for (const value of values) {
    expect(value.trim()).not.toBe('');
    expect(value).not.toMatch(CORRUPTED_TEXT);
  }
}

function expectValidGeneratedQuestions(questions: GeneratedQuestion[], expectedCount: number) {
  expect(questions).toHaveLength(expectedCount);
  expectUniqueNonEmptyIds(questions);
  for (const question of questions) {
    expectCleanText(question.question);
    expect(Number.isFinite(question.correctAnswer)).toBe(true);
    if (question.explanation) expectCleanText(question.explanation);
    if (question.choiceOptions) {
      expect(question.choiceOptions.length).toBeGreaterThan(1);
      expect(new Set(question.choiceOptions).size).toBe(question.choiceOptions.length);
      expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
      expect(question.correctAnswer).toBeLessThan(question.choiceOptions.length);
    }
    if (question.kind === 'ordering') {
      const cards = question.orderingCards ?? [];
      expect(cards.length).toBeGreaterThan(1);
      expect(new Set(cards.map((card) => card.id)).size).toBe(cards.length);
      expect(cards.every((card) => card.label.trim().length > 0 && Number.isFinite(card.valueMm))).toBe(true);
      expect(['asc', 'desc']).toContain(question.orderingDirection);
    }
  }
}

describe('static learning content integrity', () => {
  it('keeps the English vocabulary identifiable and renderable', () => {
    expect(ENGLISH_VOCABULARY.length).toBeGreaterThan(100);
    expectUniqueNonEmptyIds(ENGLISH_VOCABULARY);
    for (const word of ENGLISH_VOCABULARY) expectCleanText(word.english, word.estonian);
  });

  it('keeps every Kiur reading task valid and evidence-backed', () => {
    expectUniqueNonEmptyIds(KIUR_READING_TASKS);
    expect(getValidKiurReadingTasks()).toHaveLength(KIUR_READING_TASKS.length);
    for (const task of KIUR_READING_TASKS) {
      expectCleanText(task.text, task.question, task.correctAnswer, task.evidenceText, task.sourceTitle, task.sourceAuthor);
      expect(task.options).toHaveLength(4);
      expect(new Set(task.options).size).toBe(task.options.length);
      expect(task.options).toContain(task.correctAnswer);
      expect(task.text).toContain(task.evidenceText);
    }
  });

  it('keeps text problems complete and free of duplicate accepted answers', () => {
    expectUniqueNonEmptyIds(kiurTextProblemPool);
    for (const task of kiurTextProblemPool) {
      expectCleanText(task.question, task.answer, task.solution);
      if (task.acceptedAnswers) {
        expect(new Set(task.acceptedAnswers).size).toBe(task.acceptedAnswers.length);
        for (const answer of task.acceptedAnswers) expectCleanText(answer);
      }
    }
  });

  it('keeps Kirsi picture-word and first-sound content internally consistent', () => {
    expectUniqueNonEmptyIds(KIRSI_READING_PAIRS);
    for (const pair of KIRSI_READING_PAIRS) {
      expectCleanText(pair.word, pair.image);
      expect(pair.word).toBe(pair.word.toLocaleUpperCase('et-EE'));
    }

    expectUniqueNonEmptyIds(KIRSI_FIRST_SOUND_TASKS);
    for (const task of KIRSI_FIRST_SOUND_TASKS) {
      expectCleanText(task.word, task.image, task.correctLetter);
      expect(task.correctLetter).toBe([...task.word][0]);
      expect(task.options).toContain(task.correctLetter);
      expect(new Set(task.options).size).toBe(task.options.length);
    }
  });
});

describe('generated mathematics content integrity', () => {
  const seeds = [1, 2, 42, 20260727];

  it('generates valid Kiur sessions across every published topic and seed', () => {
    for (const topic of KIUR_MATH_TOPICS) {
      const count = topic.id === 'tekstulesanded' ? 5 : 15;
      for (const seed of seeds) {
        expectValidGeneratedQuestions(
          generateKiurMathSession(topic.id, topic.defaultCategory, 'Lihtne', count, seed),
          count
        );
      }
    }
  });

  it('generates valid Kirsi sessions across every published mode and seed', () => {
    const modes: Array<Parameters<typeof generateKirsiSession>[0]> = [
      'Loendamine',
      'Arvutamine 10 piires',
      'Arvutamine 20 piires',
      'Suurem või väiksem kuni 100',
      'Segaülesanded',
      'Kellaaeg'
    ];
    for (const mode of modes) {
      for (const seed of seeds) {
        expectValidGeneratedQuestions(generateKirsiSession(mode, 15, seed), 15);
      }
    }
  });
});
