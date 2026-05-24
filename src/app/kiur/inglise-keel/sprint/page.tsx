'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import EnglishMatchingBoard from '@/app/components/EnglishMatchingBoard';
import { ENGLISH_PACKS, shuffle } from '@/lib/englishGame';
import { loadEnglishProgress, saveEnglishProgress } from '@/lib/englishProgress';

export default function SprintPage() {
  const [progress, setProgress] = useState(loadEnglishProgress());
  const [time, setTime] = useState(90);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(progress.sprintBestScore || 0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [pairs, setPairs] = useState(0);
  const [boardSeed, setBoardSeed] = useState(1);
  const [savedHistory, setSavedHistory] = useState(false);
  const boardStartRef = useRef(Date.now());

  const sourceWords = useMemo(() => {
    const completed = new Set(progress.completedPacks);
    const packs = ENGLISH_PACKS.filter((p, i) => (completed.size ? completed.has(p.id) : i === 0));
    return packs.flatMap((p) => p.words);
  }, [progress.completedPacks]);

  const boardWords = useMemo(() => shuffle(sourceWords, boardSeed).slice(0, 5), [sourceWords, boardSeed]);
  const ended = time === 0;

  useEffect(() => {
    if (ended) return;
    const t = setInterval(() => setTime((v) => (v > 0 ? v - 1 : 0)), 1000);
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
        elapsedSeconds: 90,
        questions: [{ id: 'sprint-summary', question: 'Sprinti kokkuvõte', userAnswer: `Õigeid paare: ${pairs}`, correctAnswer: score, isCorrect: true, kind: 'choice' }]
      })
    });
  }, [best, ended, mistakes, pairs, savedHistory, score]);

  if (ended) {
    const acc = pairs + mistakes > 0 ? Math.round((pairs / (pairs + mistakes)) * 100) : 0;
    return <main className='container english-page'><section className='practice-shell english-shell english-result-card'><h2>Aeg läbi!</h2><p>Sinu tulemus: {score}</p><p>Parim tulemus: {Math.max(best, score)}</p><p>Õigeid paare: {pairs}</p><p>Vigu: {mistakes}</p><p>Täpsus: {acc}%</p><p>Pikim seeria: {maxCombo}</p><p>{score >= best ? 'Uus rekord!' : 'Proovi uuesti ja paranda tulemust!'}</p><div className='row'><button className='btn' onClick={() => location.reload()}>Mängi uuesti</button><Link className='btn chip' href='/kiur/inglise-keel'>Inglise keel</Link><Link className='btn chip' href='/kiur'>Aine valik</Link></div></section></main>;
  }

  return <main className='container english-page'><section className='practice-shell english-shell'>
    <Link className='practice-back-button' href='/kiur/inglise-keel'>← Katkesta sprint</Link>
    <div className='matching-hud'><strong>Sprint</strong><span>Aeg: {time}</span><span>Tulemus: {score}</span><span>Parim: {best}</span><span>Seeria: {combo}</span></div>
    <EnglishMatchingBoard key={`sprint-${boardSeed}`} words={boardWords} onPair={(ok) => {
      if (ok) {
        setPairs((v) => v + 1);
        setCombo((v) => {
          const nv = v + 1;
          setMaxCombo((m) => Math.max(m, nv));
          return nv;
        });
        setScore((v) => v + 2 + (((combo + 1) % 5 === 0) ? 1 : 0));
      } else {
        setMistakes((v) => v + 1);
        setCombo(0);
      }
    }} onBoardComplete={() => {
      const boardMs = Date.now() - boardStartRef.current;
      const speedBonus = boardMs <= 15000 ? 2 : 0;
      setScore((v) => v + 3 + speedBonus);
      boardStartRef.current = Date.now();
      setBoardSeed((v) => v + 1);
    }} />
  </section></main>;
}
