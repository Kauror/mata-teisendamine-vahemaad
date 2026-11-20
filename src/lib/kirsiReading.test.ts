import { describe, expect, it } from 'vitest';
import {
  buildFirstSoundSession,
  FIRST_SOUND_LOOKALIKES,
  FIRST_SOUND_MAX_PER_LETTER,
  FIRST_SOUND_SYNONYM_LETTERS,
  isFairFirstSoundDistractor,
  KIRSI_FIRST_SOUND_TASKS
} from '@/lib/kirsiFirstSoundTasks';
import { buildKirsiPictureWordBoard, KIRSI_PICTURE_LOOKALIKES, KIRSI_READING_PAIRS } from '@/lib/kirsiReadingPairs';

describe('Esimene häälik', () => {
  it('never offers a same-sounding letter (B/P, G/K, D/T) or a synonym\'s letter as a wrong option', () => {
    for (const task of KIRSI_FIRST_SOUND_TASKS) {
      for (const option of task.options.filter((letter) => letter !== task.correctLetter)) {
        expect(isFairFirstSoundDistractor(task, option), `${task.word}: ${option}`).toBe(true);
        expect(FIRST_SOUND_LOOKALIKES[task.correctLetter] ?? []).not.toContain(option);
      }
    }
    // The review's examples.
    const byId = new Map(KIRSI_FIRST_SOUND_TASKS.map((task) => [task.id, task]));
    expect(byId.get('beebi')!.options).not.toContain('P');
    expect(byId.get('beebi')!.options).not.toContain('T');
    expect(byId.get('siga')!.options).not.toContain('P');
    expect(byId.get('janes')!.options).not.toContain('K');
    expect(byId.get('lind')!.options).not.toContain('T');
    expect(byId.get('kurk')!.options).not.toContain('G');
    expect(Object.keys(FIRST_SOUND_SYNONYM_LETTERS).every((id) => byId.has(id))).toBe(true);
  });

  it('keeps the ids and right letters the score verifier checks', () => {
    expect(KIRSI_FIRST_SOUND_TASKS).toHaveLength(50);
    for (const task of KIRSI_FIRST_SOUND_TASKS) expect(task.correctLetter).toBe([...task.word][0]);
  });

  it('asks no letter more than twice in a session, over 1000 sessions', () => {
    const answers = new Map<string, number>();
    for (let seed = 1; seed <= 1000; seed += 1) {
      const session = buildFirstSoundSession(seed, 10);
      expect(session).toHaveLength(10);
      expect(new Set(session.map((task) => task.id)).size).toBe(10);
      const perLetter = new Map<string, number>();
      for (const task of session) {
        perLetter.set(task.correctLetter, (perLetter.get(task.correctLetter) ?? 0) + 1);
        answers.set(task.correctLetter, (answers.get(task.correctLetter) ?? 0) + 1);
      }
      expect(Math.max(...perLetter.values())).toBeLessThanOrEqual(FIRST_SOUND_MAX_PER_LETTER);
    }
    // K starts 12 of 50 words; a plain shuffle made it 24 % of all answers.
    expect(answers.get('K')! / 10_000).toBeLessThan(0.2);
  });
});

describe('Pilt ja sõna boards', () => {
  it('names only pairs that exist', () => {
    const ids = new Set(KIRSI_READING_PAIRS.map((pair) => pair.id));
    for (const [a, b] of KIRSI_PICTURE_LOOKALIKES) expect(ids.has(a) && ids.has(b), `${a}/${b}`).toBe(true);
  });

  it('never puts two look-alike pictures on one board, and still shows every picture once per pass', () => {
    const boardsPerPass = Math.floor(KIRSI_READING_PAIRS.length / 5);
    for (let seed = 1; seed <= 500; seed += 1) {
      const runSeed = seed * 104729;
      for (let boardIndex = 0; boardIndex < boardsPerPass * 2; boardIndex += 1) {
        const ids = buildKirsiPictureWordBoard(KIRSI_READING_PAIRS, runSeed, boardIndex, 5).map((pair) => pair.id);
        for (const [a, b] of KIRSI_PICTURE_LOOKALIKES) expect(ids.includes(a) && ids.includes(b), `${seed}/${boardIndex}: ${ids.join(',')}`).toBe(false);
      }
      const firstPass = Array.from({ length: boardsPerPass }, (_, boardIndex) => buildKirsiPictureWordBoard(KIRSI_READING_PAIRS, runSeed, boardIndex, 5)).flat();
      expect(new Set(firstPass.map((pair) => pair.id)).size).toBe(boardsPerPass * 5);
    }
  });

  it('is the same board for the same run and board, so a resumed run matches', () => {
    expect(buildKirsiPictureWordBoard(KIRSI_READING_PAIRS, 77, 3, 5)).toEqual(buildKirsiPictureWordBoard(KIRSI_READING_PAIRS, 77, 3, 5));
  });
});
