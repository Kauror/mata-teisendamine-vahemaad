import { describe, expect, it } from 'vitest';
import { ENGLISH_PACKS, pickSprintBoardWords, shuffle, sprintKeys } from '@/lib/englishGame';
import { ACTIVE_ENGLISH_VOCABULARY, ENGLISH_VOCABULARY } from '@/lib/englishVocabulary';
import { recomputeScore } from '@/lib/server/attempts/scoreVerifier';

const label = (estonian: string) => estonian.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('et');

describe('sprint board words', () => {
  it('the vocabulary really does share labels between words', () => {
    const labels = ENGLISH_VOCABULARY.map((word) => label(word.estonian));
    expect(new Set(labels).size).toBeLessThan(labels.length);
  });

  it('never puts two words with the same Estonian label on one board', () => {
    const pool = ENGLISH_PACKS.flatMap((pack) => pack.words);
    for (let seed = 1; seed <= 2000; seed++) {
      const board = pickSprintBoardWords(shuffle(pool, seed), 5);
      expect(board).toHaveLength(5);
      expect(new Set(board.map((word) => label(word.estonian))).size).toBe(5);
    }
  });

  // «orange» is both «oranž» (word_196) and «apelsin» (word_610): two identical
  // English cards on one board, and pairing the «wrong» one ends the sprint.
  it('never puts two words with the same English prompt on one board', () => {
    const english = (word: { english: string }) => word.english.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en');
    const prompts = ENGLISH_VOCABULARY.map(english);
    expect(new Set(prompts).size).toBeLessThan(prompts.length);
    const pool = ENGLISH_PACKS.flatMap((pack) => pack.words);
    for (let seed = 1; seed <= 2000; seed++) {
      const board = pickSprintBoardWords(shuffle(pool, seed), 5);
      expect(board).toHaveLength(5);
      expect(new Set(board.map(english)).size).toBe(5);
    }
    const oranges = ENGLISH_VOCABULARY.filter((word) => word.english === 'orange');
    expect(oranges.map((word) => word.estonian)).toEqual(['oranž', 'apelsin']);
    expect(pickSprintBoardWords(oranges, 5)).toEqual([oranges[0]]);
  });

  it('keeps the shuffled order and skips only the repeated label', () => {
    const [hello, hi, i] = ENGLISH_VOCABULARY.slice(1, 4);
    expect(hello.estonian).toBe(hi.estonian);
    expect(pickSprintBoardWords([hello, hi, i], 5).map((word) => word.id)).toEqual([hello.id, i.id]);
  });

  it('spells "so" as "nii" and keeps the old label for uploads from older builds', () => {
    const so = ENGLISH_VOCABULARY.find((word) => word.english === 'so');
    expect(so?.estonian).toBe('nii');
    expect(so?.formerEstonian).toEqual(['nnii']);
  });
  it('never puts two words whose labels share an alternative on one board', () => {
    const byEnglish = (english: string) => ENGLISH_VOCABULARY.find((word) => word.english === english)!;
    const pairs = [['out', 'outside'], ['a', 'an'], ['foot; feet', 'leg']];
    for (const [first, second] of pairs) {
      expect(pickSprintBoardWords([byEnglish(first), byEnglish(second)], 5)).toHaveLength(first === 'foot; feet' ? 2 : 1);
    }
    const keys = (estonian: string) => sprintKeys(estonian, 'et');
    const pool = ENGLISH_PACKS.flatMap((pack) => pack.words);
    for (let seed = 1; seed <= 2000; seed++) {
      const board = pickSprintBoardWords(shuffle(pool, seed), 5);
      expect(board).toHaveLength(5);
      const all = board.flatMap((word) => keys(word.estonian));
      expect(new Set(all).size).toBe(all.length);
    }
  });

  it('splits a label into its alternatives without the bracketed note', () => {
    expect(sprintKeys('välja, väljas', 'et')).toEqual(['välja, väljas', 'välja', 'väljas']);
    expect(sprintKeys('üks (umbmäärane artikkel)', 'et')).toEqual(['üks (umbmäärane artikkel)', 'üks']);
  });

  it('leaves the retired duplicate rows out of new sprints but keeps them verifiable', () => {
    const retired = ENGLISH_VOCABULARY.filter((word) => word.retired);
    expect(retired.map((word) => word.id)).toEqual(['word_087', 'word_437', 'word_564']);
    const pool = ENGLISH_PACKS.flatMap((pack) => pack.words);
    expect(pool).toHaveLength(ACTIVE_ENGLISH_VOCABULARY.length);
    expect(pool.some((word) => word.retired)).toBe(false);
    const pairs = ACTIVE_ENGLISH_VOCABULARY.map((word) => `${word.english}|${word.estonian}`);
    expect(new Set(pairs).size).toBe(pairs.length);
    for (const word of retired) {
      const id = `run:1:0:${word.id}`;
      expect(recomputeScore({ runnerId: 'kiur-english-sprint', learner: 'kiur', subject: 'inglise-keel', topic: 'sprint', category: 'Sprint', difficulty: 'normal', generatorVersion: 'fixed-dataset', seed: 1, questionIds: [id], questions: [{ id, question: word.english, vocabularyId: word.id, direction: 'en-et', userAnswer: word.estonian }] }).score).toBe(1);
    }
  });

  it('translates coat, How many?, to and the articles correctly and still accepts the old labels', () => {
    const expected: Record<string, [string, string]> = {
      coat: ['mantel', 'jope'],
      'How many?': ['Mitu?', 'Kui palju?'],
      to: ['juurde, -le (kuhu?)', 'sisse, juurde (eessõna)'],
      the: ['see, too (määrav artikkel)', 'artikkel'],
      a: ['üks (umbmäärane artikkel)', 'artikkel'],
      an: ['üks (umbmäärane artikkel täishääliku ees)', 'artikkel'],
      'foot; feet': ['jalalaba; jalalabad', 'jalg; jalad']
    };
    for (const [english, [label, former]] of Object.entries(expected)) {
      const word = ENGLISH_VOCABULARY.find((candidate) => candidate.english === english)!;
      expect(word.estonian).toBe(label);
      expect(word.formerEstonian).toEqual([former]);
    }
  });
});
