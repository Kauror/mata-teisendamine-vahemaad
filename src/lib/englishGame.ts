import { ENGLISH_VOCABULARY, EnglishVocabularyWord } from '@/lib/englishVocabulary';
import { shuffleWithSeed } from '@/lib/random';

export type EnglishWordPack = { id: string; title: string; words: EnglishVocabularyWord[] };

export function shuffle<T>(arr: T[], seed = Date.now()) {
  return shuffleWithSeed(arr, seed);
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

export function getEnglishPack(packId: string) {
  return ENGLISH_PACKS.find((p) => p.id === packId);
}

export function buildMatchingBoardsForPack(pack: EnglishWordPack, boardSize = 5) {
  const boards: EnglishVocabularyWord[][] = [];
  for (let i = 0; i < pack.words.length; i += boardSize) boards.push(pack.words.slice(i, i + boardSize));
  return boards;
}

export function calculatePracticeStars(mistakes: number) {
  if (mistakes === 0) return 3;
  if (mistakes <= 3) return 2;
  return 1;
}
