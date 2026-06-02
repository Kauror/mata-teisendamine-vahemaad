'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { shuffle } from '@/lib/englishGame';
import { formatStars } from '@/lib/formatStars';
import { KIRSI_FIRST_SOUND_TASKS, KirsiFirstSoundTask } from '@/lib/kirsiFirstSoundTasks';

const QUESTION_COUNT = 10;

type Reward = {
  awardedAmount: number;
  balanceAfter: number;
  capReached: boolean;
} | null;

type ReviewItem = {
  id: string;
  question: string;
  userAnswer: string;
  correctAnswer: number;
  isCorrect: boolean;
  kind: 'choice';
  choiceOptions: string[];
  image: string;
  word: string;
  correctLetter: string;
  selectedLetter: string;
  hintUsed: boolean;
};

function buildSession(seed: number) {
  return shuffle(KIRSI_FIRST_SOUND_TASKS, seed).slice(0, QUESTION_COUNT);
}

export default function KirsiFirstSoundPage() {
  const [seed, setSeed] = useState(0);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [reward, setReward] = useState<Reward>(null);
  const [saved, setSaved] = useState(false);
  const startedAtRef = useRef(Date.now());
  const session = useMemo(() => buildSession(seed), [seed]);
  const current: KirsiFirstSoundTask | undefined = session[index];
  const answered = selectedLetter !== null;
  const isCorrect = Boolean(current && selectedLetter === current.correctLetter);
  const optionSeed = seed + index * 1777;
  const options = useMemo(() => current ? shuffle(current.options, optionSeed) : [], [current, optionSeed]);

  useEffect(() => {
    startedAtRef.current = Date.now();
    setSeed(Date.now());
  }, []);

  useEffect(() => {
    if (index < QUESTION_COUNT || saved) return;
    setSaved(true);
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));

    void fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        createdAt: new Date().toISOString(),
        learner: 'kirsi',
        subject: 'lugemine',
        topic: 'esimene-haalik',
        category: 'Lugemine - esimene häälik',
        questionCount: QUESTION_COUNT,
        score,
        elapsedSeconds,
        questions: reviewItems
      })
    }).then((response) => response.ok ? response.json() : null)
      .then((body) => setReward(body?.reward ?? null))
      .catch(() => setReward(null));
  }, [index, reviewItems, saved, score]);

  const reset = () => {
    startedAtRef.current = Date.now();
    setSeed(Date.now());
    setIndex(0);
    setScore(0);
    setHintCount(0);
    setHintVisible(false);
    setSelectedLetter(null);
    setReviewItems([]);
    setReward(null);
    setSaved(false);
  };

  const chooseLetter = (letter: string) => {
    if (!current || answered) return;
    const correct = letter === current.correctLetter;
    const orderedOptions = options.length ? options : current.options;
    setSelectedLetter(letter);
    if (correct) setScore((value) => value + 1);
    setReviewItems((items) => [...items, {
      id: current.id,
      question: `${current.image} — esimene häälik`,
      userAnswer: letter,
      correctAnswer: orderedOptions.indexOf(current.correctLetter),
      isCorrect: correct,
      kind: 'choice',
      choiceOptions: orderedOptions,
      image: current.image,
      word: current.word,
      correctLetter: current.correctLetter,
      selectedLetter: letter,
      hintUsed: hintVisible
    }]);
  };

  const showHint = () => {
    if (hintVisible || answered) return;
    setHintVisible(true);
    setHintCount((value) => value + 1);
  };

  const next = () => {
    setIndex((value) => value + 1);
    setHintVisible(false);
    setSelectedLetter(null);
  };

  if (index >= QUESTION_COUNT) {
    return (
      <main className='english-page sprint-result-page reading-page'>
        <section className='sprint-result-panel'>
          <header className='sprint-result-header'>
            <div className='sprint-result-emoji' aria-hidden>🔤</div>
            <h1 className='sprint-result-title'>Tulemus</h1>
            <p className='sprint-result-subtitle'>Tubli harjutamine.</p>
          </header>
          <div className='sprint-result-stats-grid'>
            <article className='sprint-result-stat-card'>
              <p className='sprint-result-stat-label'>Õigeid</p>
              <p className='sprint-result-stat-value'>{score}/{QUESTION_COUNT}</p>
            </article>
            <article className='sprint-result-stat-card'>
              <p className='sprint-result-stat-label'>Vihjeid kasutatud</p>
              <p className='sprint-result-stat-value'>{hintCount}</p>
            </article>
            <article className='sprint-result-stat-card'>
              <p className='sprint-result-stat-label'>Tähed</p>
              <p className='sprint-result-stat-value'>{reward ? `+${formatStars(reward.awardedAmount)}` : '...'}</p>
            </article>
          </div>
          {reward ? (
            <section className='reading-correction-card sprint-reward-card'>
              <p>Tähed kokku: <strong>{formatStars(reward.balanceAfter)} ⭐</strong></p>
              {reward.capReached && reward.awardedAmount === 0 ? <p>Tänane õppimise punktipiir on täis.</p> : null}
            </section>
          ) : null}
          <div className='sprint-result-actions'>
            <button className='sprint-primary-button' onClick={reset}>▶ Proovi uuesti</button>
            <Link className='sprint-secondary-button' href='/kirsi/lugemine'>← Lugemine</Link>
            <Link className='sprint-secondary-button' href='/kirsi'>← Aine valik</Link>
          </div>
        </section>
      </main>
    );
  }

  if (!current) return null;

  return (
    <main className='container english-page reading-page'>
      <section className='practice-shell english-shell first-sound-shell'>
        <Link className='practice-back-button' href='/kirsi/lugemine'>← Lugemine</Link>
        <div className='matching-hud'>
          <strong>Esimene häälik</strong>
          <span>{index + 1}/{QUESTION_COUNT}</span>
          <span>Õigeid: {score}</span>
          <span>Vihjeid: {hintCount}</span>
        </div>
        <section className='first-sound-card'>
          <p className='question-eyebrow'>Mis on pildil oleva sõna esimene häälik?</p>
          <div className='first-sound-image' aria-label='Pilt'>{current.image}</div>
          <p className='first-sound-instruction'>Märgi õige täht.</p>
          <div className='first-sound-hint-row'>
            {hintVisible || answered ? <strong className='first-sound-word'>{current.word}</strong> : <button type='button' className='settings-toggle' onClick={showHint}>Näita sõna</button>}
          </div>
          <div className='first-sound-options'>
            {options.map((letter) => {
              const isSelected = selectedLetter === letter;
              const isAnswer = answered && letter === current.correctLetter;
              const isWrong = answered && isSelected && letter !== current.correctLetter;
              return (
                <button
                  key={letter}
                  type='button'
                  className={`first-sound-option ${isAnswer ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                  disabled={answered}
                  onClick={() => chooseLetter(letter)}
                >
                  {letter}
                </button>
              );
            })}
          </div>
          {answered ? (
            <div className={`first-sound-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
              <strong>{isCorrect ? 'Õige!' : `Õige täht on ${current.correctLetter}.`}</strong>
              {!isCorrect ? <span>Sina valisid: {selectedLetter}</span> : null}
            </div>
          ) : null}
          <button type='button' className='start-button' disabled={!answered} onClick={next}>Järgmine</button>
        </section>
      </section>
    </main>
  );
}
