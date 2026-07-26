'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { buildMemoryDeck, MEMORY_PAIR_COUNT, type MemoryCard } from '@/lib/memoryPairs';
import type { Learner } from '@/lib/shared/types';

const MISMATCH_HOLD_MS = 800;

export default function MemoryPairsPage({ learner }: { learner: Learner }) {
  const backHref = learner === 'kiur' ? '/kiur' : '/kirsi';
  // The deck is dealt in an effect rather than in useState's initialiser so the
  // server-rendered shell and the first client render agree (Math.random would
  // otherwise produce a hydration mismatch).
  const [deck, setDeck] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const holdTimer = useRef<number | null>(null);

  const clearHold = () => {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  const deal = useCallback(() => {
    clearHold();
    setDeck(buildMemoryDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  }, []);

  useEffect(() => {
    deal();
    return clearHold;
  }, [deal]);

  const pairsFound = matched.length / 2;
  const won = deck.length > 0 && pairsFound === MEMORY_PAIR_COUNT;

  const pick = (card: MemoryCard) => {
    // Ignore taps while a mismatched pair is still on show, and taps on a card
    // that is already face up.
    if (holdTimer.current !== null) return;
    if (flipped.includes(card.id) || matched.includes(card.id)) return;

    if (flipped.length === 0) {
      setFlipped([card.id]);
      return;
    }

    const first = deck.find((item) => item.id === flipped[0]);
    setFlipped([flipped[0], card.id]);
    setMoves((value) => value + 1);

    if (first && first.symbol === card.symbol) {
      setMatched((value) => [...value, first.id, card.id]);
      setFlipped([]);
      return;
    }

    holdTimer.current = window.setTimeout(() => {
      holdTimer.current = null;
      setFlipped([]);
    }, MISMATCH_HOLD_MS);
  };

  return (
    <main className='container subject-flow-page'>
      <section className='practice-shell pairs-shell'>
        <Link className='practice-back-button' href={backHref}>Tagasi</Link>
        <header className='pairs-header'>
          <h1>Paarid</h1>
          <p>Leia kõik {MEMORY_PAIR_COUNT} paari.</p>
        </header>

        <div className='pairs-board'>
          {deck.map((card) => {
            const isMatched = matched.includes(card.id);
            const isUp = isMatched || flipped.includes(card.id);
            return (
              <button
                key={card.id}
                type='button'
                className={`pairs-card${isUp ? ' is-up' : ''}${isMatched ? ' is-done' : ''}`}
                onClick={() => pick(card)}
                aria-label={isUp ? card.symbol : 'Kaart'}
              >
                <span className='pairs-card-inner'>
                  <span className='pairs-face pairs-face-back' aria-hidden>?</span>
                  <span className='pairs-face pairs-face-front' aria-hidden>{card.symbol}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className='pairs-stats'>
          <span>Käigud: {moves}</span>
          <span>Paarid: {pairsFound}/{MEMORY_PAIR_COUNT}</span>
        </div>

        {won ? <p className='pairs-win' role='status'>Kõik paarid leitud! {moves} käiguga.</p> : null}

        <button type='button' className='next-button' onClick={deal}>Uus mäng</button>
      </section>
    </main>
  );
}
