import { ACTIVE_ENGLISH_VOCABULARY, EnglishVocabularyWord } from '@/lib/englishVocabulary';
import { shuffleWithSeed } from '@/lib/random';

export type EnglishWordPack = { id: string; title: string; words: EnglishVocabularyWord[] };

export function shuffle<T>(arr: readonly T[], seed = Date.now()) {
  return shuffleWithSeed(arr, seed);
}

// The score verifier compares an answer with the Estonian label as text, so two
// words labelled "Tere!" (Hello./Hi.) are indistinguishable on one board: the
// child cannot tell the two cards apart, yet the board accepts only one of
// them. The board takes words in order and skips any whose label (compared the
// way the verifier compares it) is already on the board. The same holds the
// other way round: «orange» is both «oranž» and «apelsin», «you», «too»,
// «about» and «pool» also appear twice with different labels, and two
// identical English cards cannot be told apart either; so a word whose
// English prompt is already on the board is skipped too.
//
// Labels that are not identical can still be too close to tell apart: «foot»
// (jalalaba; jalad) and «leg» (jalg; jalasäär) once both read «jalg», «out»
// (välja, väljas) and «outside» (väljas) share «väljas», and «a»/«an» are both
// «üks (…)». So each label is split into its alternatives (on «;» and «,»),
// a bracketed note is dropped, and a word is skipped when any alternative is
// already on the board. English prompts are compared the same way.
function normalizedSprintText(value: string, locale: 'et' | 'en') {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase(locale);
}

export function sprintKeys(value: string, locale: 'et' | 'en') {
  const whole = normalizedSprintText(value, locale);
  const keys = new Set([whole]);
  for (const part of whole.replace(/\([^)]*\)/g, ' ').split(/[;,/]/)) {
    const key = part.replace(/^siin:\s*/, '').replace(/[.!?]+$/, '').replace(/\s+/g, ' ').trim();
    if (key) keys.add(key);
  }
  return [...keys];
}

export function pickSprintBoardWords(words: readonly EnglishVocabularyWord[], size: number) {
  const labels = new Set<string>();
  const prompts = new Set<string>();
  const board: EnglishVocabularyWord[] = [];
  for (const word of words) {
    if (board.length === size) break;
    const labelKeys = sprintKeys(word.estonian, 'et');
    const promptKeys = sprintKeys(word.english, 'en');
    if (labelKeys.some((key) => labels.has(key)) || promptKeys.some((key) => prompts.has(key))) continue;
    labelKeys.forEach((key) => labels.add(key));
    promptKeys.forEach((key) => prompts.add(key));
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

// Retired duplicate rows are left out; the verifier still knows them.
export const ENGLISH_PACKS = buildEnglishWordPacks(ACTIVE_ENGLISH_VOCABULARY, 20);
