import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { KIUR_READING_STORIES } from '@/lib/kiurReadingStories';
import { pickKiurReadingRun } from '@/lib/kiurReadingRun';
import { KIUR_READING_TASKS, getValidKiurReadingTasks, type KiurReadingTask } from '@/lib/kiurReadingTasks';

const birds = KIUR_READING_TASKS.filter((task) => task.sourceCollection === 'Linnunädalad');
const stories = KIUR_READING_TASKS.filter((task) => task.id.startsWith('lugu-'));

const keyIsLongest = (task: KiurReadingTask) => task.options.every((option) => option === task.correctAnswer || option.length < task.correctAnswer.length);
const keyIsShortest = (task: KiurReadingTask) => task.options.every((option) => option === task.correctAnswer || option.length > task.correctAnswer.length);
const share = (tasks: KiurReadingTask[], test: (task: KiurReadingTask) => boolean) => tasks.filter(test).length / tasks.length;
const words = (text: string) => text.split(/\s+/).filter(Boolean).length;

describe('Kiur reading bank', () => {
  it('keeps every task valid', () => {
    expect(getValidKiurReadingTasks()).toHaveLength(KIUR_READING_TASKS.length);
    expect(new Set(KIUR_READING_TASKS.map((task) => task.id)).size).toBe(KIUR_READING_TASKS.length);
  });

  it('never changes the question or key of a bird column (uploaded runs are verified against them)', () => {
    expect(birds).toHaveLength(100);
    const contract = birds.map((task) => `${task.id}|${task.question}|${task.correctAnswer}`).join('\n');
    expect(createHash('sha256').update(contract).digest('hex')).toBe('47bed9d8466a3b52b5df44ad0f0274318192e097d2cdba319b3424fbbe0f7399');
  });

  it('does not give the key away by length: the key is the longest option in at most 25 %', () => {
    expect(share(KIUR_READING_TASKS, keyIsLongest)).toBeLessThanOrEqual(0.25);
    expect(share(birds, keyIsLongest)).toBeLessThanOrEqual(0.25);
    expect(share(stories, keyIsLongest)).toBeLessThanOrEqual(0.25);
    expect(share(KIUR_READING_TASKS, keyIsShortest)).toBeLessThanOrEqual(0.4);
  });

  it('has at least 40 original texts of 80–200 words with two or three questions each', () => {
    expect(KIUR_READING_STORIES.length).toBeGreaterThanOrEqual(40);
    expect(new Set(KIUR_READING_STORIES.map((story) => story.id)).size).toBe(KIUR_READING_STORIES.length);
    for (const story of KIUR_READING_STORIES) {
      expect(words(story.text), story.id).toBeGreaterThanOrEqual(80);
      expect(words(story.text), story.id).toBeLessThanOrEqual(200);
      expect(story.questions.length, story.id).toBeGreaterThanOrEqual(2);
      expect(story.questions.length, story.id).toBeLessThanOrEqual(3);
      expect(story.questions.some((question) => question.type === 'jareldus'), `${story.id} has an inference question`).toBe(true);
      for (const question of story.questions) {
        expect(question.options, `${story.id}: ${question.question}`).toContain(question.answer);
        expect(new Set(question.options).size).toBe(4);
        expect(story.text).toContain(question.evidence);
      }
    }
    const vocabulary = KIUR_READING_STORIES.filter((story) => story.questions.some((question) => question.type === 'sona'));
    expect(vocabulary.length).toBeGreaterThanOrEqual(KIUR_READING_STORIES.length / 2);
    expect(new Set(KIUR_READING_STORIES.map((story) => story.theme))).toEqual(new Set(['jutud', 'loodus', 'Eesti', 'igapäevaelu', 'teadus']));
  });

  it('builds runs that mix themes and never ask twice about one text', () => {
    const valid = getValidKiurReadingTasks();
    for (let seed = 1; seed <= 500; seed++) {
      const run = pickKiurReadingRun(valid, seed, 5);
      expect(run).toHaveLength(5);
      expect(new Set(run.map((task) => task.text)).size).toBe(5);
      const perCollection = new Map<string, number>();
      for (const task of run) perCollection.set(task.sourceCollection, (perCollection.get(task.sourceCollection) ?? 0) + 1);
      expect(Math.max(...perCollection.values())).toBeLessThanOrEqual(2);
      expect(perCollection.size).toBeGreaterThanOrEqual(3);
    }
  });

  it('still fills a run from a tiny bank', () => {
    const tiny = [
      { id: 'a', text: 'A', sourceCollection: 'x' },
      { id: 'b', text: 'B', sourceCollection: 'x' },
      { id: 'c', text: 'C', sourceCollection: 'x' },
      { id: 'd', text: 'C', sourceCollection: 'x' }
    ];
    const run = pickKiurReadingRun(tiny, 7, 5);
    expect(run.map((task) => task.text).sort()).toEqual(['A', 'B', 'C']);
  });
});
