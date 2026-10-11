'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { useVocabSession } from '@/app/components/vocabulary/useVocabSession';
import { VocabularyProblem, VocabularyProgress, VocabularyShell } from '@/app/components/vocabulary/VocabularyShell';
import { VOCAB_HOME_ROUTE } from '@/lib/vocabulary/constants';

// A swipe counts only once it is clearly deliberate: at least this far, and
// mostly sideways. A scroll or a resting thumb never answers.
const SWIPE_MIN_PX = 90;
const SWIPE_WIDTH_SHARE = 0.28;
const SWIPE_DIRECTION_RATIO = 1.5;

type Drag = { pointerId: number; x: number; y: number; dx: number; dy: number; horizontal: boolean | null };

export default function VocabularyStudy({ unitId }: { unitId: string }) {
  const { view, error, send, retry } = useVocabSession({ unitId, mode: 'study' });
  const [flipped, setFlipped] = useState(false);
  const [dragX, setDragX] = useState(0);
  const drag = useRef<Drag | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const card = view?.study?.card ?? null;
  // Changes when the next card arrives — even the same word coming straight
  // back as the last card after "Ei teadnud" — but not when a card is merely
  // revealed, so each new card animates in once and gets its own assessment.
  const cardKey = card ? `${card.wordId}:${card.sequence}` : 'none';

  // A resumed session may already have the answer revealed.
  useEffect(() => {
    setFlipped(Boolean(card?.revealed));
    setDragX(0);
  }, [cardKey, card?.revealed]);

  const reveal = useCallback(() => {
    if (!card || flipped) return;
    // The card turns at once; the server records the reveal in the background,
    // and the assessment is queued behind it.
    setFlipped(true);
    void send({ type: 'reveal' });
  }, [card, flipped, send]);

  // One assessment per card. Only an assessment already sent for THIS card
  // blocks another one — the background reveal must not, or a quick "→" right
  // after turning the card would be swallowed.
  const [gradedKey, setGradedKey] = useState<string | null>(null);
  const grading = gradedKey === cardKey;

  const grade = useCallback((known: boolean) => {
    if (!card || !flipped || gradedKey === cardKey) return;
    setGradedKey(cardKey);
    setDragX(0);
    void send({ type: 'grade', known }).then((result) => {
      // A failed request leaves the same card on screen; let the child retry.
      if (!result) setGradedKey(null);
    });
  }, [card, cardKey, flipped, gradedKey, send]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (!flipped && (event.key === ' ' || event.key === 'Enter') && (!target || target === document.body || target === cardRef.current)) {
        event.preventDefault();
        reveal();
      } else if (flipped && event.key === 'ArrowRight') {
        event.preventDefault();
        grade(true);
      } else if (flipped && event.key === 'ArrowLeft') {
        event.preventDefault();
        grade(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, grade, reveal]);

  const threshold = () => Math.max(SWIPE_MIN_PX, (cardRef.current?.offsetWidth ?? 300) * SWIPE_WIDTH_SHARE);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!flipped || grading || (event.pointerType === 'mouse' && event.button !== 0)) return;
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, dy: 0, horizontal: null };
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    current.dx = event.clientX - current.x;
    current.dy = event.clientY - current.y;
    if (current.horizontal === null && Math.hypot(current.dx, current.dy) > 10) {
      current.horizontal = Math.abs(current.dx) > Math.abs(current.dy);
      // A vertical gesture is a scroll: let the page have it.
      if (!current.horizontal) { drag.current = null; setDragX(0); return; }
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (current.horizontal) setDragX(current.dx);
  };
  const endDrag = (event: ReactPointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const current = drag.current;
    drag.current = null;
    if (!current || current.pointerId !== event.pointerId) return;
    const deliberate = current.horizontal && Math.abs(current.dx) >= threshold() && Math.abs(current.dx) > Math.abs(current.dy) * SWIPE_DIRECTION_RATIO;
    if (!cancelled && deliberate) grade(current.dx > 0);
    else setDragX(0);
  };

  if (error) return <VocabularyShell title='Õppimine'><VocabularyProblem error={error} onRetry={retry} /></VocabularyShell>;
  if (!view?.study) return <VocabularyShell title='Õppimine'><p className='vocab-loading'>Laadin kaarte…</p></VocabularyShell>;

  const study = view.study;
  const unitLabel = view.unit?.label ?? '';

  if (study.completed) {
    return (
      <VocabularyShell eyebrow={unitLabel} title='Õppimine lõpetatud'>
        <div className='vocab-summary' role='status'>
          <p className='vocab-summary-big'>Esimesel korral teadsid: <strong>{study.firstKnown}/{study.total}</strong></p>
          <p>Kordamist vajas: <strong>{study.neededRetry} sõna</strong></p>
          <p>Kõik sõnad on nüüd läbi käidud. Test on avatud.</p>
        </div>
        <div className='vocab-actions'>
          <Link className='start-button vocab-start-link' href={`${VOCAB_HOME_ROUTE}/${unitId}/test`}>Tee test</Link>
          <Link className='vocab-secondary-button' href={VOCAB_HOME_ROUTE}>Tagasi õppetükkide juurde</Link>
        </div>
      </VocabularyShell>
    );
  }

  const limit = threshold();
  const lean = Math.max(-1, Math.min(1, dragX / limit));
  const direction = lean > 0.15 ? 'known' : lean < -0.15 ? 'unknown' : null;

  return (
    <VocabularyShell eyebrow={unitLabel} title='Õppimine'>
      <VocabularyProgress value={study.knownCount} total={study.total} label='Selgeks saanud sõnad' />

      <div className='vocab-card-stage'>
        <div
          ref={cardRef}
          key={cardKey}
          className='vocab-card'
          data-flipped={flipped}
          data-direction={direction ?? undefined}
          role='button'
          tabIndex={0}
          aria-label={flipped ? `${card?.estonian} — ${card?.english}` : `${card?.estonian}. Puuduta kaarti, et vastust näha.`}
          onClick={reveal}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(event) => endDrag(event, false)}
          onPointerCancel={(event) => endDrag(event, true)}
          data-dragging={dragX !== 0}
          style={{ '--vocab-drag-x': `${dragX}px`, '--vocab-tilt': `${dragX / 24}deg`, '--vocab-lean-known': Math.max(0, lean), '--vocab-lean-unknown': Math.max(0, -lean) } as CSSProperties}
        >
          <div className='vocab-card-inner'>
            <div className='vocab-card-face vocab-card-front' aria-hidden={flipped}>
              <p className='vocab-card-word' lang='et'>{card?.estonian}</p>
              <p className='vocab-card-hint'>Mõtle ingliskeelne sõna.</p>
              <p className='vocab-card-hint'>Puuduta kaarti, et vastust näha.</p>
            </div>
            <div className='vocab-card-face vocab-card-back' aria-hidden={!flipped} aria-live='polite'>
              <p className='vocab-card-source' lang='et'>{card?.estonian}</p>
              <p className='vocab-card-word' lang='en'>{flipped ? card?.english : ''}</p>
              {flipped && card?.pronunciation ? <p className='vocab-card-pronunciation'>{card.pronunciation}</p> : null}
            </div>
          </div>
          <span className='vocab-swipe-label vocab-swipe-known' aria-hidden>Teadsin ✓</span>
          <span className='vocab-swipe-label vocab-swipe-unknown' aria-hidden>Ei teadnud</span>
        </div>
      </div>

      <div className='vocab-grade-row'>
        <button type='button' className='vocab-grade vocab-grade-unknown' disabled={!flipped || grading} onClick={() => grade(false)}>
          <span aria-hidden>←</span> Ei teadnud
        </button>
        <button type='button' className='vocab-grade vocab-grade-known' disabled={!flipped || grading} onClick={() => grade(true)}>
          Teadsin <span aria-hidden>→</span>
        </button>
      </div>
      <p className='vocab-keyboard-hint'>{flipped ? 'Libista kaarti paremale või vasakule. Klaviatuuril: nooled.' : 'Klaviatuuril: tühik pöörab kaardi.'}</p>
    </VocabularyShell>
  );
}
