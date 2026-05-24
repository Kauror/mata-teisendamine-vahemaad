'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import EnglishMatchingBoard from '@/app/components/EnglishMatchingBoard';
import { buildMatchingBoardsForPack, calculatePracticeStars, getEnglishPack } from '@/lib/englishGame';
import { loadEnglishProgress, saveEnglishProgress } from '@/lib/englishProgress';
import { formatElapsed } from '@/lib/validation';

export default function PackGame() {
  const params = useParams<{ packId: string }>();
  const pack = getEnglishPack(params.packId);
  const boards = useMemo(() => (pack ? buildMatchingBoardsForPack(pack) : []), [pack]);
  const [idx, setIdx] = useState(0); const [mistakes, setMistakes] = useState(0); const [correct, setCorrect] = useState(0); const [wrongWords, setWrongWords] = useState<string[]>([]); const [start] = useState(Date.now()); const [done, setDone] = useState(false);
  if (!pack) return <main className='container'><p>Pakki ei leitud.</p></main>;
  const timeSec = Math.max(0, Math.round((Date.now() - start)/1000));
  const current = boards[idx];
  const finish = () => { setDone(true); const stars = calculatePracticeStars(mistakes); const p = loadEnglishProgress(); p.completedPacks = Array.from(new Set([...p.completedPacks, pack.id])); p.packResults[pack.id] = { bestStars: Math.max(stars, p.packResults[pack.id]?.bestStars || 0), bestTimeSeconds: Math.min(timeSec, p.packResults[pack.id]?.bestTimeSeconds || timeSec), completedAt: new Date().toISOString() }; saveEnglishProgress(p); };
  return <main className='container english-page'><section className='practice-shell english-shell'>
    {!done ? <>
      <div className='matching-hud'><strong>Harjutamine</strong><span>{pack.title}</span><span>Laud {idx+1} / {boards.length}</span><span>Vead: {mistakes}</span><span>Aeg: {formatElapsed(timeSec)}</span></div>
      <EnglishMatchingBoard words={current} onPair={(ok, w) => { if (ok) setCorrect((v)=>v+1); else { setMistakes((v)=>v+1); setWrongWords((arr)=>arr.includes(`${w.english} — ${w.estonian}`)?arr:[...arr,`${w.english} — ${w.estonian}`]); } }} onBoardComplete={() => { if (idx < boards.length-1) setIdx((v)=>v+1); else finish(); }} />
    </> : <div className='english-result-card'><h2>Tubli töö!</h2><p>Õigeid vastuseid: {correct}/{pack.words.length}</p><p>Vigu: {mistakes}</p><p>Aeg: {formatElapsed(timeSec)}</p><p>Tulemus: {'★'.repeat(calculatePracticeStars(mistakes))}{'☆'.repeat(3-calculatePracticeStars(mistakes))}</p>{wrongWords.length>0 && <><h3>Harjutamist vajavad sõnad</h3><ul>{wrongWords.map((w)=><li key={w}>{w}</li>)}</ul></>}<div className='row'><button className='btn' onClick={()=>location.reload()}>Mängi uuesti</button><Link className='btn chip' href='/kiur/inglise-keel/harjutamine'>Vali pakk</Link><Link className='btn chip' href='/kiur'>Aine valik</Link></div></div>}
  </section></main>;
}
