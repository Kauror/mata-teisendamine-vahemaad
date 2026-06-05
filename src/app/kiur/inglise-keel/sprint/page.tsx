'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import EnglishMatchingBoard from '@/app/components/EnglishMatchingBoard';
import { ENGLISH_PACKS, shuffle } from '@/lib/englishGame';
import { fetchBestEnglishSprintScore } from '@/lib/englishHistory';
import type { EnglishVocabularyWord } from '@/lib/englishVocabulary';

type FailedSprintPair = {
  word: EnglishVocabularyWord;
  chosenOption: EnglishVocabularyWord;
};

type SprintReward = {
  awardedAmount: number;
  balanceAfter: number;
  capReached: boolean;
} | null;

export default function SprintPage() {
  const [runSeed, setRunSeed] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [streak, setStreak] = useState(0);
  const [boardSeed, setBoardSeed] = useState(1);
  const [ended, setEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12);
  const [failedPair, setFailedPair] = useState<FailedSprintPair | null>(null);
  const [reward, setReward] = useState<SprintReward>(null);
  const [sprintActive, setSprintActive] = useState<boolean | null>(null);
  const endedRef = useRef(false);
  const savedHistoryRef = useRef(false);
  const startedAtRef = useRef(Date.now());
  const failedPairRef = useRef<FailedSprintPair | null>(null);
  const scoreRef = useRef(0);
  const pairsRef = useRef(0);
  const mistakesRef = useRef(0);

  const sourceWords = useMemo(() => ENGLISH_PACKS.flatMap((p) => p.words), []);
  const boardShuffleSeed = runSeed + boardSeed * 10_007;
  const boardLayoutSeed = runSeed + boardSeed * 20_011;
  const boardWords = useMemo(() => shuffle(sourceWords, boardShuffleSeed).slice(0, 5), [sourceWords, boardShuffleSeed]);
  const elapsedSeconds = useMemo(() => ended ? Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)) : 0, [ended]);

  useEffect(() => {
    startedAtRef.current = Date.now();
    setRunSeed(Date.now() + Math.floor(Math.random() * 1_000_000));
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetch('/api/learning-exercises/active?learner=kiur')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((body: { exerciseIds?: string[] }) => {
        if (!cancelled) setSprintActive(Boolean(body.exerciseIds?.includes('kiur.english.sprint')));
      })
      .catch(() => {
        if (!cancelled) setSprintActive(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    void fetchBestEnglishSprintScore()
      .then(setBest)
      .catch(() => setBest(0));
  }, []);

  useEffect(() => {
    if (ended || sprintActive !== true) return;
    const t = setInterval(() => {
      setTimeLeft((v) => {
        if (v <= 1) {
          endedRef.current = true;
          setEnded(true);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [ended, sprintActive]);

  useEffect(() => {
    if (!ended || savedHistoryRef.current || sprintActive !== true) return;
    savedHistoryRef.current = true;

    const finalScore = scoreRef.current;
    const finalPairs = pairsRef.current;
    const finalMistakes = mistakesRef.current;
    const finalQuestionCount = Math.max(1, finalPairs + finalMistakes);

    if (finalScore > best) {
      setBest(finalScore);
    }

    const failedPair = failedPairRef.current;
    const questions = failedPair
      ? [{
          id: `sprint-failed-${failedPair.word.id}`,
          question: failedPair.word.english,
          estonian: failedPair.word.estonian,
          userAnswer: failedPair.chosenOption.estonian,
          correctAnswer: 0,
          isCorrect: false,
          kind: 'choice' as const,
          choiceOptions: [failedPair.word.estonian],
          explanation: `Valisid: ${failedPair.chosenOption.estonian}. Õige vastus: ${failedPair.word.estonian}.`
        }]
      : [{
          id: 'sprint-summary',
          question: 'Sprinti kokkuvõte',
          userAnswer: `Õigeid sõnu järjest: ${finalScore}`,
          correctAnswer: finalScore,
          isCorrect: true,
          kind: 'choice' as const
        }];

    void fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        createdAt: new Date().toISOString(),
        learner: 'kiur',
        subject: 'inglise-keel',
        topic: 'sprint',
        category: 'Inglise keel - sprint',
        difficulty: 'Tavaline',
        questionCount: finalQuestionCount,
        score: finalScore,
        elapsedSeconds,
        questions
      })
    }).then((response) => response.ok ? response.json() : null)
      .then((body) => setReward(body?.reward ?? null))
      .catch(() => setReward(null));
  }, [best, elapsedSeconds, ended, sprintActive]);

  if (sprintActive === null) {
    return <main className='container english-page'><section className='practice-shell english-shell'>Laadin sprinti...</section></main>;
  }

  if (!sprintActive) {
    return (
      <main className='container english-page'>
        <section className='practice-shell english-shell'>
          <Link className='practice-back-button' href='/kiur'>&larr; Harjutused</Link>
          <header className='subject-header'>
            <div className='subject-emoji'>ABC</div>
            <h1>Sprint ei ole praegu saadaval</h1>
          </header>
        </section>
      </main>
    );
  }

  if (ended) {
    return <main className='english-page sprint-result-page'>
      <section className='sprint-result-panel'>
        <header className='sprint-result-header'>
          <div className='sprint-result-emoji' aria-hidden>🔤</div>
          <h1 className='sprint-result-title'>Sprint lõppes</h1>
          <p className='sprint-result-subtitle'>Siin on selle sprinti kokkuvõte.</p>
        </header>
        <div className='sprint-result-stats-grid'>
          <article className='sprint-result-stat-card'>
            <p className='sprint-result-stat-label'>Parim sprint</p>
            <p className='sprint-result-stat-value'>{Math.max(best, score)}</p>
          </article>
          <article className='sprint-result-stat-card'>
            <p className='sprint-result-stat-label'>Hetke skoor</p>
            <p className='sprint-result-stat-value'>{score}</p>
          </article>
          <article className='sprint-result-stat-card'>
            <p className='sprint-result-stat-label'>Kulunud aeg</p>
            <p className='sprint-result-stat-value'>{elapsedSeconds}s</p>
          </article>
        </div>
        {failedPair && (
          <section className='sprint-failed-card'>
            <h2>Viimane sõna</h2>
            <p><strong>{failedPair.word.english}</strong> tähendab <strong>{failedPair.word.estonian}</strong>.</p>
            <p>Sina valisid: <strong>{failedPair.chosenOption.estonian}</strong>.</p>
          </section>
        )}
        {reward && (reward.awardedAmount > 0 || reward.capReached) && (
          <section className='sprint-failed-card sprint-reward-card'>
            <h2>Tähed</h2>
            <p>Teenitud: <strong>+{reward.awardedAmount.toLocaleString('et-EE', { maximumFractionDigits: 1 })} ⭐</strong></p>
            <p>Tähed kokku: <strong>{reward.balanceAfter.toLocaleString('et-EE', { maximumFractionDigits: 1 })} ⭐</strong></p>
            {reward.capReached && reward.awardedAmount === 0 && <p>Tänane õppimise punktipiir on täis.</p>}
          </section>
        )}
        <div className='sprint-result-actions'>
          <button className='sprint-primary-button' onClick={() => location.reload()}>▶ Proovi uuesti</button>
          <Link className='sprint-secondary-button' href='/kiur'>← Harjutused</Link>
        </div>
      </section>
    </main>;
  }

  return <main className='container english-page'><section className='practice-shell english-shell'>
    <Link className='practice-back-button' href='/kiur'>← Katkesta sprint</Link>
    <div className='matching-hud'><strong>Sprint</strong><span>Skoor: {score}</span><span>Jada: {streak}</span><span>Aeg: {timeLeft}s</span><span>Parim: {best}</span></div>
    <EnglishMatchingBoard key={`sprint-${boardSeed}`} words={boardWords} layoutSeed={boardLayoutSeed} onPair={(ok, word, chosenOption) => {
      if (endedRef.current) return;
      if (ok) {
        pairsRef.current += 1;
        scoreRef.current += 1;
        setScore(scoreRef.current);
        setStreak((v) => v + 1);
      } else {
        const failed = { word, chosenOption };
        failedPairRef.current = failed;
        setFailedPair(failed);
        endedRef.current = true;
        mistakesRef.current += 1;
        setEnded(true);
      }
    }} onBoardComplete={() => {
      if (endedRef.current) return;
      setTimeLeft((v) => Math.min(16, 12 + Math.min(v, 4)));
      setBoardSeed((v) => v + 1);
    }} showFeedback={false} />
  </section></main>;
}
