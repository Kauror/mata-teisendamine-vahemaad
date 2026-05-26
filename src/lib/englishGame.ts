import { ENGLISH_VOCABULARY, EnglishVocabularyWord } from '@/lib/englishVocabulary';
import { shuffleWithSeed } from '@/lib/random';

export type EnglishWordPack = { id: string; title: string; words: EnglishVocabularyWord[] };

export function shuffle<T>(arr: readonly T[], seed = Date.now()) {
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
