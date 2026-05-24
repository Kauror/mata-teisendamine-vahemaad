'use client';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import EnglishMatchingBoard from '@/app/components/EnglishMatchingBoard';
import { buildMatchingBoardsForPack, calculatePracticeStars, getEnglishPack } from '@/lib/englishGame';
import { EnglishProgress, isEnglishPackUnlocked, loadEnglishProgress, saveCompletedEnglishPack } from '@/lib/englishProgress';
import { formatElapsed } from '@/lib/validation';

export default function PackGame() {
  const params = useParams<{ packId: string }>();
  const pack = getEnglishPack(params.packId);
  const boards = useMemo(() => (pack ? buildMatchingBoardsForPack(pack) : []), [pack]);
  const [idx, setIdx] = useState(0); const [mistakes, setMistakes] = useState(0); const [correct, setCorrect] = useState(0); const [wrongWords, setWrongWords] = useState<string[]>([]); const [start] = useState(Date.now()); const [done, setDone] = useState(false); const [saved, setSaved] = useState(false);
  const [progress, setProgress] = useState<EnglishProgress | null>(null);
  useEffect(() => setProgress(loadEnglishProgress()), []);
  const isUnlocked = !!pack && !!progress && isEnglishPackUnlocked(pack.id, progress.completedPacks);
  const timeSec = Math.max(0, Math.round((Date.now() - start)/1000));
  const current = boards[idx];
  const finish = useCallback(() => {
    if (!pack) return;
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - start) / 1000));
    const updatedProgress = saveCompletedEnglishPack(pack.id, calculatePracticeStars(mistakes), elapsedSeconds);
    setProgress(updatedProgress);
    setDone(true);
  }, [mistakes, pack, start]);

  useEffect(() => {
    if (!pack || !isUnlocked || !done || saved) return;
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - start) / 1000));
    const wrongSet = new Set(wrongWords);
    const questions = pack.words.map((w) => ({
      id: w.id,
      question: `${w.english} — ${w.estonian}`,
      userAnswer: wrongSet.has(`${w.english} — ${w.estonian}`) ? 'Viga ja parandatud' : 'Õige',
      correctAnswer: 1,
      isCorrect: true,
      kind: 'choice',
      expectedUnit: 'sõnapaar'
    }));
    setSaved(true);
    void fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        createdAt: new Date().toISOString(),
        learner: 'kiur',
        subject: 'inglise-keel',
        topic: 'harjutamine',
        category: 'Inglise keel - harjutamine',
        difficulty: 'Tavaline',
        questionCount: pack.words.length,
        score: correct,
        elapsedSeconds,
        questions
      })
    });
  }, [correct, done, isUnlocked, pack, saved, start, wrongWords]);

  if (!pack) return <main className='container'><p>Pakki ei leitud.</p></main>;
  if (!progress) return <main className='container english-page'><section className='practice-shell english-shell english-result-card'><p>Laadin pakki...</p></section></main>;
  if (!isUnlocked) return <main className='container english-page'><section className='practice-shell english-shell english-result-card'><h2>Pakk on lukus</h2><p>Ava eelmine pakk enne selle harjutuse alustamist.</p><Link className='btn chip' href='/kiur/inglise-keel/harjutamine'>Tagasi pakkide juurde</Link></section></main>;
  return <main className='container english-page'><section className='practice-shell english-shell'>
    {!done ? <>
      <div className='matching-hud'><strong>Harjutamine</strong><span>{pack.title}</span><span>Laud {idx+1} / {boards.length}</span><span>Vead: {mistakes}</span><span>Aeg: {formatElapsed(timeSec)}</span></div>
      <EnglishMatchingBoard key={`${pack.id}-${idx}`} words={current} onPair={(ok, w) => { if (ok) setCorrect((v)=>v+1); else { setMistakes((v)=>v+1); setWrongWords((arr)=>arr.includes(`${w.english} — ${w.estonian}`)?arr:[...arr,`${w.english} — ${w.estonian}`]); } }} onBoardComplete={() => { if (idx < boards.length-1) setIdx((v)=>v+1); else finish(); }} />
    </> : <div className='english-result-card'><h2>Pakk lõpetatud</h2><p>Õigeid vastuseid: {correct}/{pack.words.length}</p><p>Vigu: {mistakes}</p><p>Aeg: {formatElapsed(timeSec)}</p><p>Tulemus: {'★'.repeat(calculatePracticeStars(mistakes))}{'☆'.repeat(3-calculatePracticeStars(mistakes))}</p>{wrongWords.length>0 && <><h3>Harjutamist vajavad sõnad</h3><ul>{wrongWords.map((w)=><li key={w}>{w}</li>)}</ul></>}<div className='row'><button className='btn' onClick={()=>location.reload()}>Mängi uuesti</button><Link className='btn chip' href='/kiur/inglise-keel/harjutamine'>Vali pakk</Link><Link className='btn chip' href='/kiur'>Aine valik</Link></div></div>}
  </section></main>;
}
