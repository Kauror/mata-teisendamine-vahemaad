import { shuffleWithSeed } from '@/lib/random';

export type KirsiFirstSoundTask = {
  id: string;
  word: string;
  image: string;
  correctLetter: string;
  options: string[];
};

// Letters an Estonian first-grader hears as the same sound at the start of a
// word (b/p, g/k, d/t). One of them can never be the wrong option for the other.
export const FIRST_SOUND_LOOKALIKES: Readonly<Record<string, readonly string[]>> = {
  B: ['P'], P: ['B'], G: ['K'], K: ['G'], D: ['T'], T: ['D']
};

// Other words a child naturally says for the picture. Their first letters must
// not be offered as wrong options: 👶 is also «titt», 🐷 «põrsas», 🐰 «küülik»,
// 🐦 «tihane» or «varblane», ✋ «peopesa», 🍄 «kärbseseen», 🌳 «kask».
export const FIRST_SOUND_SYNONYM_LETTERS: Readonly<Record<string, readonly string[]>> = {
  beebi: ['T'], siga: ['P'], janes: ['K'], lind: ['T', 'V'], hunt: ['K'], lehm: ['M'], karu: ['M'], kasi: ['P'], seen: ['K'], puu: ['K']
};

// The task ids and right letters are the score contract (scoreVerifier checks
// the letter by id), so they never change; the wrong options may.
export const KIRSI_FIRST_SOUND_TASKS: KirsiFirstSoundTask[] = [
  { id: 'beebi', word: 'BEEBI', image: '👶', correctLetter: 'B', options: ['B', 'M', 'S'] },
  { id: 'kasi', word: 'KÄSI', image: '✋', correctLetter: 'K', options: ['K', 'M', 'S'] },
  { id: 'jalg', word: 'JALG', image: '🦵', correctLetter: 'J', options: ['J', 'K', 'S'] },
  { id: 'suu', word: 'SUU', image: '👄', correctLetter: 'S', options: ['S', 'M', 'U'] },
  { id: 'silm', word: 'SILM', image: '👁️', correctLetter: 'S', options: ['S', 'K', 'I'] },
  { id: 'nina', word: 'NINA', image: '👃', correctLetter: 'N', options: ['N', 'M', 'L'] },
  { id: 'korv', word: 'KÕRV', image: '👂', correctLetter: 'K', options: ['K', 'Õ', 'T'] },
  { id: 'hammas', word: 'HAMMAS', image: '🦷', correctLetter: 'H', options: ['H', 'K', 'M'] },
  { id: 'suda', word: 'SÜDA', image: '❤️', correctLetter: 'S', options: ['S', 'K', 'Ü'] },
  { id: 'kass', word: 'KASS', image: '🐱', correctLetter: 'K', options: ['K', 'P', 'S'] },
  { id: 'koer', word: 'KOER', image: '🐶', correctLetter: 'K', options: ['K', 'T', 'P'] },
  { id: 'siga', word: 'SIGA', image: '🐷', correctLetter: 'S', options: ['S', 'K', 'L'] },
  { id: 'lehm', word: 'LEHM', image: '🐮', correctLetter: 'L', options: ['L', 'N', 'K'] },
  { id: 'kana', word: 'KANA', image: '🐔', correctLetter: 'K', options: ['K', 'T', 'P'] },
  { id: 'part', word: 'PART', image: '🦆', correctLetter: 'P', options: ['P', 'K', 'S'] },
  { id: 'hiir', word: 'HIIR', image: '🐭', correctLetter: 'H', options: ['H', 'N', 'M'] },
  { id: 'karu', word: 'KARU', image: '🐻', correctLetter: 'K', options: ['K', 'R', 'P'] },
  { id: 'hunt', word: 'HUNT', image: '🐺', correctLetter: 'H', options: ['H', 'L', 'M'] },
  { id: 'janes', word: 'JÄNES', image: '🐰', correctLetter: 'J', options: ['J', 'S', 'L'] },
  { id: 'orav', word: 'ORAV', image: '🐿️', correctLetter: 'O', options: ['O', 'A', 'V'] },
  { id: 'siil', word: 'SIIL', image: '🦔', correctLetter: 'S', options: ['S', 'L', 'I'] },
  { id: 'konn', word: 'KONN', image: '🐸', correctLetter: 'K', options: ['K', 'T', 'P'] },
  { id: 'kala', word: 'KALA', image: '🐟', correctLetter: 'K', options: ['K', 'L', 'P'] },
  { id: 'lind', word: 'LIND', image: '🐦', correctLetter: 'L', options: ['L', 'M', 'S'] },
  { id: 'oun', word: 'ÕUN', image: '🍎', correctLetter: 'Õ', options: ['Õ', 'Ü', 'B'] },
  { id: 'pirn', word: 'PIRN', image: '🍐', correctLetter: 'P', options: ['P', 'S', 'M'] },
  { id: 'banaan', word: 'BANAAN', image: '🍌', correctLetter: 'B', options: ['B', 'N', 'S'] },
  { id: 'kiivi', word: 'KIIVI', image: '🥝', correctLetter: 'K', options: ['K', 'V', 'S'] },
  { id: 'sidrun', word: 'SIDRUN', image: '🍋', correctLetter: 'S', options: ['S', 'K', 'T'] },
  { id: 'kirss', word: 'KIRSS', image: '🍒', correctLetter: 'K', options: ['K', 'S', 'P'] },
  { id: 'arbuus', word: 'ARBUUS', image: '🍉', correctLetter: 'A', options: ['A', 'O', 'E'] },
  { id: 'kurk', word: 'KURK', image: '🥒', correctLetter: 'K', options: ['K', 'S', 'R'] },
  { id: 'tomat', word: 'TOMAT', image: '🍅', correctLetter: 'T', options: ['T', 'M', 'P'] },
  { id: 'mais', word: 'MAIS', image: '🌽', correctLetter: 'M', options: ['M', 'N', 'A'] },
  { id: 'sai', word: 'SAI', image: '🥖', correctLetter: 'S', options: ['S', 'P', 'T'] },
  { id: 'leib', word: 'LEIB', image: '🍞', correctLetter: 'L', options: ['L', 'T', 'E'] },
  { id: 'juust', word: 'JUUST', image: '🧀', correctLetter: 'J', options: ['J', 'K', 'T'] },
  { id: 'muna', word: 'MUNA', image: '🥚', correctLetter: 'M', options: ['M', 'N', 'U'] },
  { id: 'vesi', word: 'VESI', image: '💧', correctLetter: 'V', options: ['V', 'K', 'M'] },
  { id: 'maja', word: 'MAJA', image: '🏠', correctLetter: 'M', options: ['M', 'N', 'A'] },
  { id: 'auto', word: 'AUTO', image: '🚗', correctLetter: 'A', options: ['A', 'O', 'E'] },
  { id: 'pall', word: 'PALL', image: '⚽', correctLetter: 'P', options: ['P', 'M', 'S'] },
  { id: 'lill', word: 'LILL', image: '🌸', correctLetter: 'L', options: ['L', 'S', 'K'] },
  { id: 'amber', word: 'ÄMBER', image: '🪣', correctLetter: 'Ä', options: ['Ä', 'A', 'E'] },
  { id: 'ookull', word: 'ÖÖKULL', image: '🦉', correctLetter: 'Ö', options: ['Ö', 'Õ', 'Ü'] },
  { id: 'kell', word: 'KELL', image: '🕒', correctLetter: 'K', options: ['K', 'L', 'T'] },
  { id: 'puu', word: 'PUU', image: '🌳', correctLetter: 'P', options: ['P', 'L', 'M'] },
  { id: 'seen', word: 'SEEN', image: '🍄', correctLetter: 'S', options: ['S', 'L', 'M'] },
  { id: 'leht', word: 'LEHT', image: '🍃', correctLetter: 'L', options: ['L', 'K', 'T'] },
  { id: 'tuli', word: 'TULI', image: '🔥', correctLetter: 'T', options: ['T', 'P', 'K'] }
];

// May `letter` be shown as a wrong option for this task?
export function isFairFirstSoundDistractor(task: Pick<KirsiFirstSoundTask, 'id' | 'correctLetter'>, letter: string) {
  return letter !== task.correctLetter
    && !(FIRST_SOUND_LOOKALIKES[task.correctLetter] ?? []).includes(letter)
    && !(FIRST_SOUND_SYNONYM_LETTERS[task.id] ?? []).includes(letter);
}

// At most this many tasks in one session start with the same letter. K starts
// 12 of the 50 words, so a plain shuffle often asked «K» four or five times.
export const FIRST_SOUND_MAX_PER_LETTER = 2;

export function buildFirstSoundSession(seed: number, count: number) {
  const perLetter = new Map<string, number>();
  const picked: KirsiFirstSoundTask[] = [];
  for (const task of shuffleWithSeed(KIRSI_FIRST_SOUND_TASKS, seed)) {
    const used = perLetter.get(task.correctLetter) ?? 0;
    if (used >= FIRST_SOUND_MAX_PER_LETTER) continue;
    perLetter.set(task.correctLetter, used + 1);
    picked.push(task);
    if (picked.length === count) break;
  }
  return picked;
}
