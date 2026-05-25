import { ENGLISH_VOCABULARY, EnglishVocabularyWord } from '@/lib/englishVocabulary';

export type EnglishWordPack = { id: string; title: string; words: EnglishVocabularyWord[] };

export function shuffle<T>(arr: T[], seed = Date.now()) {
  let t = seed >>> 0;
  const rng = () => { t += 0x6D2B79F5; let x = Math.imul(t ^ (t >>> 15), 1 | t); x ^= x + Math.imul(x ^ (x >>> 7), 61 | x); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
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
