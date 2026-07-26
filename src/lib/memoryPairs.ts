// "Paarid" — the hidden pair-matching minigame. Deliberately free of stars,
// attempts and history: it never touches the ledger, so it also needs no server.
// The deck is dealt fresh on the client every time the page mounts.

export const MEMORY_PAIR_COUNT = 6;
export const MEMORY_CARD_COUNT = MEMORY_PAIR_COUNT * 2;

// Bigger than the deck on purpose — six of these are drawn per game, so two
// games in a row look different even before the positions are shuffled.
export const MEMORY_PAIR_SYMBOLS = [
  '⭐', '🔥', '🎁', '🏆', '✏️', '🖼️', '🍎', '🚀',
  '🐝', '🌸', '🎲', '🦄', '🐧', '🍓', '⚽', '🌞',
  '🐬', '🎨', '🍀', '🐢'
];

export type MemoryCard = {
  id: string;
  symbol: string;
};

function shuffle<T>(values: T[], random: () => number) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Six random symbols, each twice, in random positions. `random` is injectable so
// the deal can be asserted in tests.
export function buildMemoryDeck(random: () => number = Math.random): MemoryCard[] {
  const symbols = shuffle(MEMORY_PAIR_SYMBOLS, random).slice(0, MEMORY_PAIR_COUNT);
  const deck = symbols.flatMap((symbol, index) => [
    { id: `${index}-a`, symbol },
    { id: `${index}-b`, symbol }
  ]);
  return shuffle(deck, random);
}
