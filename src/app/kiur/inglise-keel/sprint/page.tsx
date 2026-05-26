'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import EnglishMatchingBoard from '@/app/components/EnglishMatchingBoard';
import { ENGLISH_PACKS, shuffle } from '@/lib/englishGame';
import { fetchBestEnglishSprintScore } from '@/lib/englishHistory';

export default function SprintPage() {
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [pairs, setPairs] = useState(0);
  const [boardSeed, setBoardSeed] = useState(1);
  const [ended, setEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const endedRef = useRef(false);
  const savedHistoryRef = useRef(false);
  const startedAtRef = useRef(Date.now());

  const sourceWords = useMemo(() => ENGLISH_PACKS.flatMap((p) => p.words), []);
  const boardWords = useMemo(() => shuffle(sourceWords, boardSeed).slice(0, 5), [sourceWords, boardSeed]);
  const elapsedSeconds = useMemo(() => ended ? Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)) : 0, [ended]);

  useEffect(() => {
    void fetchBestEnglishSprintScore()
      .then(setBest)
      .catch(() => setBest(0));
  }, []);

  useEffect(() => {
    if (ended) return;
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
  }, [ended]);

  useEffect(() => {
    if (!ended || savedHistoryRef.current) return;
    savedHistoryRef.current = true;

    if (score > best) {
      setBest(score);
    }

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
        questionCount: pairs + mistakes,
        score,
        elapsedSeconds,
        questions: [{ id: 'sprint-summary', question: 'Sprinti kokkuvõte', userAnswer: `Õigeid sõnu järjest: ${score}`, correctAnswer: score, isCorrect: true, kind: 'choice' }]
      })
    });
  }, [best, elapsedSeconds, ended, mistakes, pairs, score]);

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
        <div className='sprint-result-actions'>
          <button className='sprint-primary-button' onClick={() => location.reload()}>▶ Proovi uuesti</button>
          <Link className='sprint-secondary-button' href='/kiur/inglise-keel'>← Inglise keel</Link>
          <Link className='sprint-secondary-button' href='/kiur'>← Aine valik</Link>
        </div>
      </section>
    </main>;
  }

  return <main className='container english-page'><section className='practice-shell english-shell'>
    <Link className='practice-back-button' href='/kiur/inglise-keel'>← Katkesta sprint</Link>
    <div className='matching-hud'><strong>Sprint</strong><span>Skoor: {score}</span><span>Jada: {streak}</span><span>Aeg: {timeLeft}s</span><span>Parim: {best}</span></div>
    <EnglishMatchingBoard key={`sprint-${boardSeed}`} words={boardWords} layoutSeed={boardSeed} onPair={(ok) => {
      if (endedRef.current) return;
      if (ok) {
        setPairs((v) => v + 1);
        setScore((v) => v + 1);
        setStreak((v) => v + 1);
      } else {
        endedRef.current = true;
        setMistakes((v) => v + 1);
        setEnded(true);
      }
    }} onBoardComplete={() => {
      if (endedRef.current) return;
      setTimeLeft((v) => Math.min(30, 15 + Math.min(v, 10)));
      setBoardSeed((v) => v + 1);
    }} showFeedback={false} />
  </section></main>;
}
