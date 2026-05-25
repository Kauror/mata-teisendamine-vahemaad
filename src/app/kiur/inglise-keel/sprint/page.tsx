'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import EnglishMatchingBoard from '@/app/components/EnglishMatchingBoard';
import { ENGLISH_PACKS, shuffle } from '@/lib/englishGame';
import { loadEnglishProgress, saveEnglishProgress } from '@/lib/englishProgress';

export default function SprintPage() {
  const [progress, setProgress] = useState(loadEnglishProgress());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(progress.sprintBestScore || 0);
  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [pairs, setPairs] = useState(0);
  const [boardSeed, setBoardSeed] = useState(1);
  const [ended, setEnded] = useState(false);
  const [savedHistory, setSavedHistory] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const endedRef = useRef(false);

  const sourceWords = useMemo(() => {
    const completed = new Set(progress.completedPacks);
    const packs = ENGLISH_PACKS.filter((p, i) => (completed.size ? completed.has(p.id) : i === 0));
    return packs.flatMap((p) => p.words);
  }, [progress.completedPacks]);

  const boardWords = useMemo(() => shuffle(sourceWords, boardSeed).slice(0, 5), [sourceWords, boardSeed]);

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
    if (!ended || savedHistory) return;
    if (score > best) {
      const p = loadEnglishProgress();
      p.sprintBestScore = score;
      saveEnglishProgress(p);
      setProgress(p);
      setBest(score);
    }

    setSavedHistory(true);
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
        elapsedSeconds: 0,
        questions: [{ id: 'sprint-summary', question: 'Sprinti kokkuvõte', userAnswer: `Õigeid sõnu järjest: ${score}`, correctAnswer: score, isCorrect: true, kind: 'choice' }]
      })
    });
  }, [best, ended, mistakes, pairs, savedHistory, score]);

  if (ended) {
    return <main className='english-page sprint-result-page'><section className='sprint-result-panel'><header className='sprint-result-header'><div className='sprint-result-emoji' aria-hidden>🔤</div><h1 className='sprint-result-title'>Sprint lõppes</h1><p className='sprint-result-subtitle'>Siin on selle sprinti kokkuvõte.</p></header><div className='sprint-result-stats-grid'><article className='sprint-result-stat-card'><p className='sprint-result-stat-label'>Skoor</p><p className='sprint-result-stat-value'>{score}</p></article><article className='sprint-result-stat-card'><p className='sprint-result-stat-label'>Järjest õigesti</p><p className='sprint-result-stat-value'>{streak}</p></article><article className='sprint-result-stat-card'><p className='sprint-result-stat-label'>Parim sprint</p><p className='sprint-result-stat-value'>{Math.max(best, score)}</p></article><article className='sprint-result-stat-card'><p className='sprint-result-stat-label'>Vigu</p><p className='sprint-result-stat-value'>{mistakes}</p></article></div><div className='sprint-result-actions'><button className='sprint-primary-button' onClick={() => location.reload()}>▶ Proovi uuesti</button><Link className='sprint-secondary-button' href='/kiur/inglise-keel'>← Inglise keel</Link><Link className='sprint-secondary-button' href='/kiur'>← Aine valik</Link></div></section></main>;
  }

  return <main className='container english-page'><section className='practice-shell english-shell'>
    <Link className='practice-back-button' href='/kiur/inglise-keel'>← Katkesta sprint</Link>
    <div className='matching-hud'><strong>Sprint</strong><span>Skoor: {score}</span><span>Jada: {streak}</span><span>Aeg: {timeLeft}s</span><span>Parim: {best}</span></div>
    <EnglishMatchingBoard key={`sprint-${boardSeed}`} words={boardWords} onPair={(ok) => {
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
      setTimeLeft((v) => 20 + Math.min(v, 20));
      setBoardSeed((v) => v + 1);
    }} showFeedback={false} />
  </section></main>;
}
