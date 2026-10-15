import { ENGLISH_VOCABULARY, EnglishVocabularyWord } from '@/lib/englishVocabulary';
import { shuffleWithSeed } from '@/lib/random';

export type EnglishWordPack = { id: string; title: string; words: EnglishVocabularyWord[] };

export function shuffle<T>(arr: readonly T[], seed = Date.now()) {
  return shuffleWithSeed(arr, seed);
}

// The score verifier compares an answer with the Estonian label as text, so two
// words labelled "Tere!" (Hello./Hi.) are indistinguishable on one board: the
// child cannot tell the two cards apart, yet the board accepts only one of
// them. The board takes words in order and skips any whose label (compared the
// way the verifier compares it) is already on the board.
function sprintLabel(word: EnglishVocabularyWord) {
  return word.estonian.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('et');
}

export function pickSprintBoardWords(words: readonly EnglishVocabularyWord[], size: number) {
  const labels = new Set<string>();
  const board: EnglishVocabularyWord[] = [];
  for (const word of words) {
    if (board.length === size) break;
    const label = sprintLabel(word);
    if (labels.has(label)) continue;
    labels.add(label);
    board.push(word);
  }
  return board;
}

export function buildEnglishWordPacks(words: EnglishVocabularyWord[], packSize = 20): EnglishWordPack[] {
  const packs: EnglishWordPack[] = [];
  for (let i = 0; i < words.length; i += packSize) {
    const idx = Math.floor(i / packSize) + 1;
    packs.push({ id: `pack-${idx}`, title: `Pakk ${idx}`, words: words.slice(i, i + packSize) });
  }
  return packs;
}

export const ENGLISH_PACKS = buildEnglishWordPacks(ENGLISH_VOCABULARY, 20);
