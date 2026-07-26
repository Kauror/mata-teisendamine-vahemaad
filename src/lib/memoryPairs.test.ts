import { describe, expect, it } from 'vitest';
import { buildMemoryDeck, MEMORY_CARD_COUNT, MEMORY_PAIR_COUNT, MEMORY_PAIR_SYMBOLS } from '@/lib/memoryPairs';

// A deterministic stand-in for Math.random so a deal can be asserted exactly.
function sequenceRandom(values: number[]) {
  let index = 0;
  return () => values[index++ % values.length];
}

describe('buildMemoryDeck', () => {
  it('deals twelve cards', () => {
    expect(buildMemoryDeck()).toHaveLength(MEMORY_CARD_COUNT);
  });

  it('deals six symbols, each exactly twice', () => {
    const counts = new Map<string, number>();
    for (const card of buildMemoryDeck()) {
      counts.set(card.symbol, (counts.get(card.symbol) ?? 0) + 1);
    }
    expect(counts.size).toBe(MEMORY_PAIR_COUNT);
    expect([...counts.values()].every((count) => count === 2)).toBe(true);
  });

  it('gives every card a unique id so flipped state cannot alias', () => {
    const ids = buildMemoryDeck().map((card) => card.id);
    expect(new Set(ids).size).toBe(MEMORY_CARD_COUNT);
  });

  it('only uses symbols from the pool', () => {
    const pool = new Set(MEMORY_PAIR_SYMBOLS);
    expect(buildMemoryDeck().every((card) => pool.has(card.symbol))).toBe(true);
  });

  it('draws a different symbol set as the random source changes', () => {
    const first = new Set(buildMemoryDeck(sequenceRandom([0.1, 0.4, 0.7])).map((card) => card.symbol));
    const second = new Set(buildMemoryDeck(sequenceRandom([0.9, 0.2, 0.5])).map((card) => card.symbol));
    expect([...first].join()).not.toBe([...second].join());
  });

  it('is deterministic for a given random source', () => {
    const deal = () => buildMemoryDeck(sequenceRandom([0.3, 0.8, 0.15, 0.62])).map((card) => card.symbol).join();
    expect(deal()).toBe(deal());
  });
});
