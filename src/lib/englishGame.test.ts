import { describe, expect, it } from 'vitest';
import { ENGLISH_PACKS, pickSprintBoardWords, shuffle } from '@/lib/englishGame';
import { ENGLISH_VOCABULARY } from '@/lib/englishVocabulary';

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
});
