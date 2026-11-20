import { shuffleWithSeed } from '@/lib/random';

export type KirsiReadingPair = {
  id: string;
  word: string;
  image: string;
  // A picture this word used to carry. An offline device can still upload a
  // sprint answered with the old picture, and the score verifier accepts it.
  formerImages?: string[];
};

export function buildKirsiPictureWordQuestion(pair: Pick<KirsiReadingPair, 'image' | 'word'>) {
  return `${pair.image} — ${pair.word}`;
}

// Every question text an uploaded sprint may carry for this pair: the current
// picture and any it replaced.
export function kirsiPictureWordQuestions(pair: KirsiReadingPair) {
  return [pair.image, ...(pair.formerImages ?? [])].map((image) => buildKirsiPictureWordQuestion({ image, word: pair.word }));
}

export const KIRSI_READING_PAIRS: KirsiReadingPair[] = [
  { id: 'ema', word: 'EMA', image: '👩' },
  { id: 'isa', word: 'ISA', image: '👨' },
  { id: 'laps', word: 'LAPS', image: '🧒' },
  { id: 'beebi', word: 'BEEBI', image: '👶' },
  { id: 'kasi', word: 'KÄSI', image: '✋' },
  { id: 'jalg', word: 'JALG', image: '🦵' },
  { id: 'suu', word: 'SUU', image: '👄' },
  { id: 'silm', word: 'SILM', image: '👁️' },
  { id: 'nina', word: 'NINA', image: '👃' },
  { id: 'korv', word: 'KÕRV', image: '👂' },
  { id: 'hammas', word: 'HAMMAS', image: '🦷' },
  { id: 'suda', word: 'SÜDA', image: '❤️' },
  { id: 'kass', word: 'KASS', image: '🐱' },
  { id: 'koer', word: 'KOER', image: '🐶' },
  { id: 'siga', word: 'SIGA', image: '🐷' },
  { id: 'lehm', word: 'LEHM', image: '🐮' },
  { id: 'kana', word: 'KANA', image: '🐔' },
  { id: 'kits', word: 'KITS', image: '🐐' },
  { id: 'part', word: 'PART', image: '🦆' },
  { id: 'hiir', word: 'HIIR', image: '🐭' },
  { id: 'karu', word: 'KARU', image: '🐻' },
  { id: 'hunt', word: 'HUNT', image: '🐺' },
  { id: 'janes', word: 'JÄNES', image: '🐰' },
  { id: 'orav', word: 'ORAV', image: '🐿️' },
  { id: 'siil', word: 'SIIL', image: '🦔' },
  { id: 'konn', word: 'KONN', image: '🐸' },
  { id: 'kala', word: 'KALA', image: '🐟' },
  { id: 'lind', word: 'LIND', image: '🐦' },
  { id: 'oun', word: 'ÕUN', image: '🍎' },
  { id: 'pirn', word: 'PIRN', image: '🍐' },
  { id: 'banaan', word: 'BANAAN', image: '🍌' },
  { id: 'kiivi', word: 'KIIVI', image: '🥝' },
  { id: 'sidrun', word: 'SIDRUN', image: '🍋' },
  { id: 'kirss', word: 'KIRSS', image: '🍒' },
  { id: 'arbuus', word: 'ARBUUS', image: '🍉' },
  { id: 'kurk', word: 'KURK', image: '🥒' },
  { id: 'tomat', word: 'TOMAT', image: '🍅' },
  { id: 'kartul', word: 'KARTUL', image: '🥔' },
  { id: 'mais', word: 'MAIS', image: '🌽' },
  { id: 'sibul', word: 'SIBUL', image: '🧅' },
  // 🥖 (a baguette) is «sai», not «leib»; the two had them the other way round.
  { id: 'sai', word: 'SAI', image: '🥖', formerImages: ['🍞'] },
  { id: 'leib', word: 'LEIB', image: '🍞', formerImages: ['🥖'] },
  { id: 'juust', word: 'JUUST', image: '🧀' },
  { id: 'muna', word: 'MUNA', image: '🥚' },
  { id: 'piim', word: 'PIIM', image: '🥛' },
  { id: 'vesi', word: 'VESI', image: '💧' },
  { id: 'tort', word: 'TORT', image: '🎂' },
  { id: 'pann', word: 'PANN', image: '🍳' },
  { id: 'pott', word: 'POTT', image: '🍲' },
  { id: 'tass', word: 'TASS', image: '☕' },
  { id: 'kauss', word: 'KAUSS', image: '🥣' },
  { id: 'lusikas', word: 'LUSIKAS', image: '🥄' },
  { id: 'kahvel', word: 'KAHVEL', image: '🍴' },
  { id: 'voodi', word: 'VOODI', image: '🛏️' },
  { id: 'tool', word: 'TOOL', image: '🪑' },
  { id: 'diivan', word: 'DIIVAN', image: '🛋️' },
  { id: 'lamp', word: 'LAMP', image: '💡' },
  { id: 'uks', word: 'UKS', image: '🚪' },
  { id: 'aken', word: 'AKEN', image: '🪟' },
  { id: 'maja', word: 'MAJA', image: '🏠' },
  { id: 'auto', word: 'AUTO', image: '🚗' },
  { id: 'buss', word: 'BUSS', image: '🚌' },
  { id: 'laev', word: 'LAEV', image: '🚢' },
  { id: 'lennuk', word: 'LENNUK', image: '✈️' },
  { id: 'ratas', word: 'RATAS', image: '🚲' },
  { id: 'pall', word: 'PALL', image: '⚽' },
  { id: 'nukk', word: 'NUKK', image: '🪆' },
  { id: 'raamat', word: 'RAAMAT', image: '📖' },
  { id: 'puu', word: 'PUU', image: '🌳' },
  { id: 'lill', word: 'LILL', image: '🌸' }
];

// Pictures a first-grader easily takes for each other. Two of them on one
// board make the match a guess: 🍳 could be the egg, 🧒 the baby, 🍲 the bowl.
export const KIRSI_PICTURE_LOOKALIKES: ReadonlyArray<readonly [string, string]> = [
  ['pann', 'muna'],
  ['laps', 'beebi'],
  ['pott', 'kauss'],
  ['sai', 'leib'],
  ['tass', 'piim'],
  ['tass', 'kauss']
];

function lookalike(a: string, b: string) {
  return KIRSI_PICTURE_LOOKALIKES.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

// The run's deck for one pass through the pool, re-ordered so no board of
// `boardSize` holds two look-alike pictures: the later card of a clashing pair
// swaps places with the first card elsewhere in the deck for which neither
// board then clashes. Deterministic for a seed, so a resumed run gets the same
// boards.
function separatedDeck(pool: KirsiReadingPair[], seed: number, boardSize: number) {
  const deck = shuffleWithSeed(pool, seed);
  const boardOf = (at: number) => Math.floor(at / boardSize);
  const clashesAt = (card: KirsiReadingPair, at: number, ignore: number) => deck.some((other, position) =>
    position !== ignore && position !== at && boardOf(position) === boardOf(at) && lookalike(card.id, other.id));
  for (let index = 0; index < deck.length; index += 1) {
    if (!clashesAt(deck[index], index, index)) continue;
    const swap = deck.findIndex((card, candidate) => boardOf(candidate) !== boardOf(index)
      && !clashesAt(card, index, index)
      && !clashesAt(deck[index], candidate, candidate));
    if (swap >= 0) [deck[index], deck[swap]] = [deck[swap], deck[index]];
  }
  return deck;
}

export function buildKirsiPictureWordBoard(pool: KirsiReadingPair[], runSeed: number, boardIndex: number, boardSize: number) {
  const cycle = Math.floor((boardIndex * boardSize) / pool.length);
  const start = (boardIndex * boardSize) % pool.length;
  return separatedDeck(pool, runSeed + cycle * 7919, boardSize).slice(start, start + boardSize);
}
