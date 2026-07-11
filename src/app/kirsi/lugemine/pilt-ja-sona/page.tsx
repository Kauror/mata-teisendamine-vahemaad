'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import PictureWordSprintBoard from '@/app/components/PictureWordSprintBoard';
import { shuffle } from '@/lib/englishGame';
import { fetchBestKirsiReadingSprintScore } from '@/lib/kirsiReadingHistory';
import { KIRSI_READING_PAIRS, KirsiReadingPair } from '@/lib/kirsiReadingPairs';
import { formatStars } from '@/lib/formatStars';
import { formatElapsed } from '@/lib/validation';
import { completeAttempt, getCatalogueVersion, isExercisePermittedOffline } from '@/lib/offline/api';

type ReviewItem = {
  id: string;
  question: string;
  userAnswer: string;
  correctAnswer: number;
  isCorrect: boolean;
  kind: 'choice';
  image: string;
  selectedWord: string;
  correctWord: string;
};

type WrongMatch = {
  picture: KirsiReadingPair;
  selected: KirsiReadingPair;
};

type SprintReward = {
  awardedAmount: number;
  balanceAfter: number;
  capReached: boolean;
} | null;

const BOARD_SIZE = 5;

function buildBoardPairs(runSeed: number, boardIndex: number) {
  const cycle = Math.floor((boardIndex * BOARD_SIZE) / KIRSI_READING_PAIRS.length);
  const start = (boardIndex * BOARD_SIZE) % KIRSI_READING_PAIRS.length;
  const deck = shuffle(KIRSI_READING_PAIRS, runSeed + cycle * 7919);
  return deck.slice(start, start + BOARD_SIZE);
}

export default function KirsiPictureWordSprintPage() {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [streak, setStreak] = useState(0);
  const [boardIndex, setBoardIndex] = useState(0);
  const [ended, setEnded] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [wrongMatch, setWrongMatch] = useState<WrongMatch | null>(null);
  const [reward, setReward] = useState<SprintReward>(null);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [exerciseActive, setExerciseActive] = useState<boolean | null>(null);
  const runSeedRef = useRef(Date.now());
  const startedAtRef = useRef(Date.now());
  const endedRef = useRef(false);
  const savedHistoryRef = useRef(false);

  const boardPairs = useMemo(() => buildBoardPairs(runSeedRef.current, boardIndex), [boardIndex]);

  useEffect(() => {
    let cancelled = false;
    void fetch('/api/learning-exercises/active?learner=kirsi')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((body: { exerciseIds?: string[] }) => {
        if (!cancelled) setExerciseActive(Boolean(body.exerciseIds?.includes('kirsi.reading.pilt-ja-sona')));
      })
      .catch(async () => {
        const permitted = await isExercisePermittedOffline('kirsi', { exerciseId: 'kirsi.reading.pilt-ja-sona', subject: 'lugemine', topic: 'pilt-ja-sona', category: 'Lugemine - pilt ja sõna' }).catch(() => false);
        if (!cancelled) setExerciseActive(permitted);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    void fetchBestKirsiReadingSprintScore()
      .then(setBest)
      .catch(() => setBest(0));
  }, []);

  useEffect(() => {
    if (!started || ended) return;
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [ended, started]);

  useEffect(() => {
    if (!ended || savedHistoryRef.current || exerciseActive !== true) return;
    savedHistoryRef.current = true;

    if (score > best) {
      setBest(score);
    }

    void (async () => {
      const catalogueVersion = await getCatalogueVersion('kirsi').catch(() => null);
      const outcome = await completeAttempt({
        learner: 'kirsi',
        subject: 'lugemine',
        topic: 'pilt-ja-sona',
        category: 'Lugemine - pilt ja sõna',
        difficulty: 'Sprint',
        exerciseId: 'kirsi.reading.pilt-ja-sona',
        catalogueVersion,
        startedAt: new Date(startedAtRef.current).toISOString(),
        questionCount: score + 1,
        score,
        elapsedSeconds,
        questions: reviewItems
      });
      setReward((outcome.reward as SprintReward) ?? null);
    })();
  }, [best, elapsedSeconds, ended, exerciseActive, reviewItems, score]);

  const startGame = () => {
    if (exerciseActive !== true) return;
    runSeedRef.current = Date.now();
    startedAtRef.current = Date.now();
    endedRef.current = false;
    savedHistoryRef.current = false;
    setStarted(true);
    setEnded(false);
    setScore(0);
    setStreak(0);
    setBoardIndex(0);
    setElapsedSeconds(0);
    setWrongMatch(null);
    setReward(null);
    setReviewItems([]);
    setShowStopConfirm(false);
  };

  const recordPair = (ok: boolean, picture: KirsiReadingPair, selected: KirsiReadingPair) => {
    if (endedRef.current) return;

    const item: ReviewItem = {
      id: `${picture.id}-${Date.now()}`,
      question: `${picture.image} — ${picture.word}`,
      userAnswer: selected.word,
      correctAnswer: 0,
      isCorrect: ok,
      kind: 'choice',
      image: picture.image,
      selectedWord: selected.word,
      correctWord: picture.word
    };
    setReviewItems((prev) => [...prev, item]);

    if (ok) {
      setScore((value) => value + 1);
      setStreak((value) => value + 1);
      return;
    }

    endedRef.current = true;
    setWrongMatch({ picture, selected });
    setElapsedSeconds(Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)));
    setEnded(true);
  };

  if (exerciseActive === null) {
    return <main className='container english-page reading-page'><section className='practice-shell english-shell reading-intro-shell'>Laadin harjutust...</section></main>;
  }

  if (!exerciseActive) {
    return (
      <main className='container english-page reading-page'>
        <section className='practice-shell english-shell reading-intro-shell'>
          <Link className='practice-back-button' href='/kirsi'>&larr; Harjutused</Link>
          <header className='subject-header'>
            <div className='subject-emoji'>ABC</div>
            <h1>Harjutus ei ole praegu saadaval</h1>
          </header>
        </section>
      </main>
    );
  }

  if (!started) {
    return (
      <main className='container english-page reading-page'>
        <section className='practice-shell english-shell reading-intro-shell'>
          <Link className='practice-back-button' href='/kirsi'>← Harjutused</Link>
          <header className='subject-header'>
            <div className='subject-emoji'>🖼️</div>
            <h1>Pilt ja sõna</h1>
          </header>
          <p className='reading-intro-text'>Ühenda pilt õige sõnaga.</p>
          <button type='button' className='start-button' onClick={startGame}>Alusta</button>
        </section>
      </main>
    );
  }

  if (ended) {
    return (
      <main className='english-page sprint-result-page reading-page'>
        <section className='sprint-result-panel'>
          <header className='sprint-result-header'>
            <div className='sprint-result-emoji' aria-hidden>🖼️</div>
            <h1 className='sprint-result-title'>Tulemus</h1>
            <p className='sprint-result-subtitle'>Vaata õiget paari ja proovi soovi korral uuesti.</p>
          </header>
          <div className='sprint-result-stats-grid'>
            <article className='sprint-result-stat-card'>
              <p className='sprint-result-stat-label'>Skoor</p>
              <p className='sprint-result-stat-value'>{score}</p>
            </article>
            <article className='sprint-result-stat-card'>
              <p className='sprint-result-stat-label'>Jada</p>
              <p className='sprint-result-stat-value'>{streak}</p>
            </article>
            <article className='sprint-result-stat-card'>
              <p className='sprint-result-stat-label'>Aeg</p>
              <p className='sprint-result-stat-value'>{formatElapsed(elapsedSeconds)}</p>
            </article>
          </div>
          {wrongMatch ? (
            <section className='reading-correction-card'>
              <div className='reading-correction-picture' aria-label='Valitud pilt'>{wrongMatch.picture.image}</div>
              <p>Sinu valik: <strong>{wrongMatch.selected.word}</strong></p>
              <p>Õige vastus: <strong>{wrongMatch.picture.word}</strong></p>
            </section>
          ) : null}
          {reward ? (
            <section className='reading-correction-card sprint-reward-card'>
              <p>Teenitud: <strong>+{formatStars(reward.awardedAmount)} ⭐</strong></p>
              <p>Tähed kokku: <strong>{formatStars(reward.balanceAfter)} ⭐</strong></p>
              {reward.capReached && reward.awardedAmount === 0 ? <p>Tänane õppimise punktipiir on täis.</p> : null}
            </section>
          ) : null}
          <div className='sprint-result-actions'>
            <button className='sprint-primary-button' onClick={startGame}>▶ Proovi uuesti</button>
            <Link className='sprint-secondary-button' href='/kirsi'>← Harjutused</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className='container english-page reading-page'>
      <section className='practice-shell english-shell'>
        <Link className='practice-back-button' href='/kirsi'>← Katkesta</Link>
        <div className='matching-hud'>
          <strong>Pilt ja sõna</strong>
          <span>Skoor: {score}</span>
          <span>Jada: {streak}</span>
          <span>Aeg: {formatElapsed(elapsedSeconds)}</span>
          <span>Parim: {Math.max(best, score)}</span>
        </div>
        <PictureWordSprintBoard
          key={`reading-${boardIndex}`}
          pairs={boardPairs}
          layoutSeed={runSeedRef.current + boardIndex}
          onPair={recordPair}
          onBoardComplete={() => {
            if (endedRef.current) return;
            setBoardIndex((value) => value + 1);
          }}
        />
        <footer className='test-actions-panel'>
          {showStopConfirm ? (
            <div className='stop-confirm-panel' role='alertdialog' aria-labelledby='picture-word-stop-title'>
              <p id='picture-word-stop-title'>Kas soovid harjutuse lõpetada?</p>
              <div className='stop-confirm-actions'>
                <button type='button' className='stop-cancel-button' onClick={() => setShowStopConfirm(false)}>Jätka harjutust</button>
                <Link className='stop-confirm-button' href='/kirsi'>Jah, lõpeta</Link>
              </div>
            </div>
          ) : (
            <button type='button' className='stop-button' onClick={() => setShowStopConfirm(true)}>Lõpeta harjutus</button>
          )}
        </footer>
      </section>
    </main>
  );
}
