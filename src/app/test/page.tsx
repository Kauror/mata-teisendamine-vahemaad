'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category, Difficulty, GeneratedQuestion } from '@/lib/types';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { generateKirsiSession } from '@/lib/exercises/kirsiMath';
import { compactTopicLabel } from '@/lib/history';
import { formatElapsed, isAnswerCorrect, validateAnswerInput } from '@/lib/validation';


const sectorPoint = (degrees: number, radius = 50) => {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return {
    x: 70 + radius * Math.cos(radians),
    y: 70 + radius * Math.sin(radians)
  };
};

const sectorPath = (startDegrees: number, endDegrees: number) => {
  const start = sectorPoint(startDegrees);
  const end = sectorPoint(endDegrees);
  const sweep = endDegrees - startDegrees;
  const largeArc = sweep > 180 ? 1 : 0;
  return `M70 70 L${start.x.toFixed(2)} ${start.y.toFixed(2)} A50 50 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z`;
};

function SectorMissingVisual({ knownDegrees = 90 }: { knownDegrees?: number }) {
  const missingDegrees = 360 - knownDegrees;
  const knownLabel = sectorPoint(knownDegrees / 2, 31);
  const missingLabel = sectorPoint(knownDegrees + missingDegrees / 2, 31);

  return (
    <svg width='170' height='150' aria-label='Puuduv kraad'>
      <circle cx='70' cy='70' r='50' fill='#eef2ff' stroke='#3b82f6' strokeWidth='3' />
      <path d={sectorPath(0, knownDegrees)} fill='#bfdbfe' stroke='#2563eb' strokeWidth='2' />
      <path d={sectorPath(knownDegrees, 360)} fill='#ddd6fe' stroke='#7c3aed' strokeWidth='2' />
      <circle cx='70' cy='70' r='3' fill='#0f172a' />
      <text x={knownLabel.x} y={knownLabel.y} fontSize='12' textAnchor='middle' dominantBaseline='middle'>{knownDegrees}°</text>
      <text x={missingLabel.x} y={missingLabel.y} fontSize='14' textAnchor='middle' dominantBaseline='middle'>?</text>
    </svg>
  );
}

function ShapeVisual({ question }: { question: GeneratedQuestion }) {
  if (question.visual) {
    if (question.visual === 'circle-full') return <svg width='140' height='140' aria-label='Täisring'><circle cx='70' cy='70' r='50' fill='#eef2ff' stroke='#3b82f6' strokeWidth='4' /></svg>;
    if (question.visual === 'circle-half') return <svg width='140' height='140' aria-label='Poolring'><path d='M20 70a50 50 0 0 1 100 0Z' fill='#bfdbfe' stroke='#3b82f6' strokeWidth='3' /><path d='M20 70a50 50 0 1 1 100 0' fill='none' stroke='#3b82f6' strokeWidth='4' /></svg>;
    if (question.visual === 'circle-quarter') return <svg width='140' height='140' aria-label='Veerandring'><path d='M70 70 L70 20 A50 50 0 0 1 120 70 Z' fill='#bfdbfe' stroke='#3b82f6' strokeWidth='3' /><circle cx='70' cy='70' r='50' fill='none' stroke='#3b82f6' strokeWidth='4' /></svg>;
    if (question.visual === 'ring-outline') return <svg width='140' height='140' aria-label='Ringjoon'><circle cx='70' cy='70' r='52' fill='none' stroke='#3b82f6' strokeWidth='6' /></svg>;
    if (question.visual === 'ring-filled') return <svg width='140' height='140' aria-label='Ring'><circle cx='70' cy='70' r='52' fill='#bfdbfe' stroke='#3b82f6' strokeWidth='4' /></svg>;
    if (question.visual === 'radius-demo') return <svg width='160' height='140' aria-label='Raadiuse näide'><circle cx='70' cy='70' r='50' fill='none' stroke='#3b82f6' strokeWidth='3' /><circle cx='70' cy='70' r='4' fill='#0f172a' /><line x1='70' y1='70' x2='120' y2='70' stroke='#16a34a' strokeWidth='4' /><line x1='70' y1='70' x2='100' y2='40' stroke='#ef4444' strokeWidth='3' /><line x1='30' y1='90' x2='95' y2='95' stroke='#f59e0b' strokeWidth='3' /><text x='123' y='74' fontSize='14'>A</text><text x='102' y='38' fontSize='14'>B</text><text x='97' y='100' fontSize='14'>C</text><text x='58' y='64' fontSize='14'>O</text></svg>;
    if (question.visual === 'diameter-demo') return <svg width='160' height='140' aria-label='Läbimõõdu näide'><circle cx='70' cy='70' r='50' fill='none' stroke='#3b82f6' strokeWidth='3' /><circle cx='70' cy='70' r='4' fill='#0f172a' /><line x1='20' y1='70' x2='120' y2='70' stroke='#16a34a' strokeWidth='4' /><line x1='70' y1='70' x2='105' y2='40' stroke='#ef4444' strokeWidth='3' /><line x1='30' y1='95' x2='95' y2='98' stroke='#f59e0b' strokeWidth='3' /><text x='122' y='74' fontSize='14'>B</text><text x='107' y='39' fontSize='14'>A</text><text x='97' y='104' fontSize='14'>C</text><text x='58' y='64' fontSize='14'>O</text></svg>;
    if (question.visual === 'point-position') return <svg width='160' height='140' aria-label='Punkti asukoht'><circle cx='70' cy='70' r='50' fill='#eff6ff' stroke='#3b82f6' strokeWidth='3' /><circle cx='62' cy='58' r='4' fill='#16a34a' /><text x='68' y='56' fontSize='12'>A</text><circle cx='120' cy='70' r='4' fill='#f59e0b' /><text x='126' y='74' fontSize='12'>B</text><circle cx='135' cy='35' r='4' fill='#ef4444' /><text x='141' y='39' fontSize='12'>C</text></svg>;
    if (question.visual === 'concentric-circles') return <svg width='160' height='140' aria-label='Sama keskpunktiga ringjooned'><circle cx='70' cy='70' r='52' fill='none' stroke='#6366f1' strokeWidth='3' /><circle cx='70' cy='70' r='30' fill='none' stroke='#22c55e' strokeWidth='3' /><circle cx='70' cy='70' r='4' fill='#0f172a' /></svg>;
    if (question.visual === 'sector-missing') return <SectorMissingVisual knownDegrees={question.visualKnownDegrees} />;
    if (question.visual === 'place-value-blocks') return <svg width='220' height='140' aria-label='Järguplokid'><rect x='10' y='20' width='34' height='34' fill='#bfdbfe' stroke='#3b82f6' /><rect x='50' y='20' width='24' height='24' fill='#c7f9cc' stroke='#16a34a' /><rect x='80' y='20' width='16' height='16' fill='#fde68a' stroke='#d97706' /><rect x='102' y='24' width='10' height='10' fill='#fecdd3' stroke='#e11d48' /><text x='10' y='70' fontSize='12'>Tuhandelised</text><text x='90' y='70' fontSize='12'>Sajalised</text><text x='10' y='88' fontSize='12'>Kümnelised</text><text x='90' y='88' fontSize='12'>Ühelised</text></svg>;
    if (question.visual === 'division-groups') return <svg width='220' height='120' aria-label='Jagamisrühmad'><rect x='10' y='20' width='55' height='70' rx='10' fill='#eef2ff' stroke='#6366f1' /><rect x='80' y='20' width='55' height='70' rx='10' fill='#eef2ff' stroke='#6366f1' /><rect x='150' y='20' width='55' height='70' rx='10' fill='#eef2ff' stroke='#6366f1' /><text x='20' y='45' fontSize='12'>1. rühm</text><text x='90' y='45' fontSize='12'>2. rühm</text><text x='160' y='45' fontSize='12'>3. rühm</text></svg>;
  }
  if (question.category !== 'Ümbermõõt') return null;
  if (question.question.includes('Ruudu')) {
    return <svg width='140' height='140' aria-label='Ruudu joonis'><rect x='20' y='20' width='100' height='100' fill='#eef3ff' stroke='#4865ff' /></svg>;
  }
  if (question.question.includes('Kolmnurga')) {
    return <svg width='180' height='120' aria-label='Kolmnurga joonis'><polygon points='90,18 20,105 160,105' fill='#fff4e6' stroke='#c56a00' /></svg>;
  }
  if (!question.question.includes('Ristküliku')) return null;
  return <svg width='180' height='120' aria-label='Ristküliku joonis'><rect x='20' y='20' width='140' height='70' fill='#e9ffe9' stroke='#2e7d32' /></svg>;
}

function choiceLabels(question: GeneratedQuestion) {
  const options = question.choiceOptions;
  if (!options?.length) {
    return [question.correctAnswer === -1 ? '<' : question.correctAnswer === 0 ? '=' : '>'];
  }

  const answerIndexes = question.correctAnswers?.length ? question.correctAnswers : [question.correctAnswer];
  return answerIndexes.map((answerIndex) => options[answerIndex]).filter((answer): answer is string => Boolean(answer));
}

function testTopicLabel(topic: string, category: string, isKirsiMath: boolean) {
  if (isKirsiMath) return category;
  if (topic === 'ring-ja-ringjoon') return 'Ring ja ringjoon';
  return compactTopicLabel(topic, category) || category;
}

function TestPageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const learner = params.get('learner') || '';
  const subject = params.get('subject') || '';
  const topic = params.get('topic') || '';
  const categoryParam = params.get('category') || 'Teisendamine';
  const category = categoryParam as Category;
  const difficulty = (params.get('difficulty') || 'Lihtne') as Difficulty;
  const rawCount = Number(params.get('count') || 10);
  const count = [10, 25].includes(rawCount) ? rawCount : 10;
  const seed = Number(params.get('seed') || Date.now());

  const isKirsiMath = learner === 'kirsi' && subject === 'matemaatika' && topic === 'arvutamine';
  const isKiurMath = learner === 'kiur' && subject === 'matemaatika';
  const baseSelectionUrl = isKirsiMath ? '/kirsi/matemaatika' : isKiurMath ? '/kiur/matemaatika' : '/';

  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [orderingAnswers, setOrderingAnswers] = useState<string[][]>([]);
  const [choiceAnswers, setChoiceAnswers] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    const generated = isKirsiMath ? generateKirsiSession(categoryParam as never, count, seed) : generateKiurMathSession(topic, categoryParam, difficulty, count, seed);
    setQuestions(generated);
    setAnswers(Array(generated.length).fill(''));
    setChoiceAnswers(Array(generated.length).fill(''));
    setOrderingAnswers(Array.from({ length: generated.length }, () => []));
    setIndex(0);
    setElapsed(0);
    setError('');
    setIsSaving(false);
    setSaveError('');
  }, [category, categoryParam, difficulty, count, seed, isKirsiMath, topic]);

  useEffect(() => {
    if (!questions.length) return;
    const timer = setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => clearInterval(timer);
  }, [questions.length]);

  useEffect(() => setError(''), [index]);

  const current = questions[index];
  const cards = current?.orderingCards ?? [];
  const selected = orderingAnswers[index] ?? [];
  const selectedSet = new Set(selected);
  const isChoiceQuestion = current?.kind === 'choice';

  const getCurrentAnswer = () => {
    if (current.kind === 'ordering') return orderingAnswers[index]?.join('|') ?? '';
    if (isChoiceQuestion) return choiceAnswers[index] ?? '';
    return inputRef.current?.value ?? answers[index] ?? '';
  };

  if (!current) return <main className='test-page'><section className='test-shell'><section className='question-card'><h2>Harjutus ei ole saadaval</h2><p>Valitud teemat ei leitud.</p><button type='button' className='btn' onClick={() => router.push(baseSelectionUrl)}>Tagasi</button></section></section></main>;

  const finalizeResults = () => {
    return questions.map((question, i) => {
      if (question.kind === 'ordering') {
        const orderedCards = [...(question.orderingCards ?? [])].sort((a, b) => (question.orderingDirection === 'desc' ? b.valueMm - a.valueMm : a.valueMm - b.valueMm));
        const orderedIds = orderedCards.map((c) => c.id);
        const userOrder = orderingAnswers[i] ?? [];
        const labelMap = new Map((question.orderingCards ?? []).map((c) => [c.id, c.label]));
        return { ...question, userAnswer: userOrder.map((id) => labelMap.get(id) ?? id).join(' → '), isCorrect: JSON.stringify(userOrder) === JSON.stringify(orderedIds), correctAnswer: 0 };
      }
      if (question.kind === 'choice') {
        const answer = choiceAnswers[i] ?? '';
        const correctLabels = choiceLabels(question);
        return { ...question, userAnswer: answer, correctAnswer: question.correctAnswer, isCorrect: correctLabels.includes(answer) };
      }
      return { ...question, userAnswer: answers[i], isCorrect: isAnswerCorrect(answers[i], question.correctAnswer) };
    });
  };

  const handleSubmit = async () => {
    if (isSaving) return;

    if (current.kind === 'ordering') {
      if (selected.length !== cards.length) return setError('Vali kõik kaardid õigesse järjekorda.');
    } else if (isChoiceQuestion) {
      if (!choiceAnswers[index]) return setError('Vali sobiv märk.');
    } else {
      const currentAnswer = getCurrentAnswer();
      const copy = [...answers]; copy[index] = currentAnswer; setAnswers(copy);
      const err = validateAnswerInput(currentAnswer);
      if (err) { setError(err === 'Palun sisesta vastus.' ? 'Sisesta vastus enne jätkamist.' : err); inputRef.current?.focus(); return; }
    }

    setError('');
    if (index < count - 1) return setIndex((v) => v + 1);

    setIsSaving(true);
    const results = finalizeResults();
    const score = results.filter((r) => r.isCorrect).length;

    try {
      const res = await fetch('/api/history', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ createdAt: new Date().toISOString(), category: categoryParam, difficulty: isKirsiMath ? 'Lihtne' : difficulty, questionCount: count, score, elapsedSeconds: elapsed, questions: results, learner: learner || null, subject: subject || null, topic: topic || null })
      });
      if (!res.ok) throw new Error('save-failed');
      const body = await res.json();
      router.push(`/history/${body.id}`);
    } catch {
      setSaveError('Salvestamine ebaõnnestus. Proovi uuesti.');
    } finally {
      setIsSaving(false);
    }
  };

  const percent = Math.round(((index + 1) / count) * 100);
  const topicEmoji = topic === 'mootuhikud-pikkused' || topic === 'pikkused' ? '📏' : topic === 'jagamine-kahekohaline-uhekohaline' ? '➗' : topic === 'arvud-10000-piires' || topic === 'arvud-10000' ? '🔢' : topic === 'ring-ja-ringjoon' ? '⭕' : '🧮';
  const metaLabel = testTopicLabel(topic, categoryParam, isKirsiMath);

  return (
    <main className='test-page'>
      <section className='test-shell'>
        <header className='test-header'>
          <div className='test-meta'>
            <span aria-hidden>{topicEmoji}</span>
            <div>
              <p>{metaLabel}</p>
              <strong>{count} küsimust</strong>
            </div>
          </div>
          <div className='test-timer'><span aria-hidden>⏱️</span><span>Aeg {formatElapsed(elapsed)}</span></div>
        </header>

        <section className='test-progress-card'>
          <div className='progress-row'><strong>Küsimus {index + 1} / {count}</strong><span>{percent}%</span></div>
          <div className='progress-track'><span style={{ width: `${percent}%` }} /></div>
        </section>

        <section className='question-card'>
          <p className='question-eyebrow'>Vasta küsimusele</p>
          <h1 className='question-text'>{current.question}</h1>
          {!isKirsiMath && <ShapeVisual question={current} />}
          <div className='answer-area'>
            {current.kind === 'ordering' ? (
              <div className='ordering-panel'>
                <p>Sinu järjestus</p>
                <p>Vali kõik kaardid õigesse järjekorda.</p>
                <div className='row ordering-available'>
                  {cards.filter((c) => !selectedSet.has(c.id)).map((c) => <button type='button' key={c.id} className='chip' onClick={() => setOrderingAnswers((prev) => { const next = [...prev]; next[index] = [...(next[index] ?? []), c.id]; return next; })}>{c.label}</button>)}
                </div>
                <div className='ordering-list'>
                  {selected.map((id, pos) => {
                    const card = cards.find((c) => c.id === id); if (!card) return null;
                    return <div key={id} className='ordering-item'><strong>{pos + 1}. {card.label}</strong><div className='row'><button type='button' className='chip ordering-move-button' aria-label='Liiguta üles' title='Liiguta üles' onClick={() => setOrderingAnswers((prev) => { const next=[...prev]; const arr=[...(next[index]??[])]; if(pos>0)[arr[pos-1],arr[pos]]=[arr[pos],arr[pos-1]]; next[index]=arr; return next; })}>↑</button><button type='button' className='chip ordering-move-button' aria-label='Liiguta alla' title='Liiguta alla' onClick={() => setOrderingAnswers((prev) => { const next=[...prev]; const arr=[...(next[index]??[])]; if(pos<arr.length-1)[arr[pos+1],arr[pos]]=[arr[pos],arr[pos+1]]; next[index]=arr; return next; })}>↓</button><button type='button' className='chip danger' onClick={() => setOrderingAnswers((prev) => { const next=[...prev]; next[index]=(next[index]??[]).filter((x)=>x!==id); return next; })}>Eemalda</button></div></div>;
                  })}
                </div>
                <button type='button' className='danger' onClick={() => setOrderingAnswers((prev) => { const next = [...prev]; next[index] = []; return next; })}>Tühjenda valik</button>
              </div>
            ) : isChoiceQuestion ? (
              <div className='choice-answer-grid' onKeyDown={(e) => { if (e.key === 'Enter' && choiceAnswers[index]) { e.preventDefault(); void handleSubmit(); } }}>
                {(current.choiceOptions?.length ? current.choiceOptions : ['<', '=', '>']).map((sign) => <button type='button' key={sign} aria-pressed={choiceAnswers[index] === sign} className={choiceAnswers[index] === sign ? 'choice-answer-button selected' : 'choice-answer-button'} onClick={() => { const next = [...choiceAnswers]; next[index] = sign; setChoiceAnswers(next); }}>{sign}</button>)}
              </div>
            ) : (
              <div className='answer-input-row'>
                <input onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void handleSubmit(); } }} ref={inputRef} aria-label='Vastus' aria-describedby={error ? 'vastuse-viga' : undefined} className={error ? 'answer-input input-error' : 'answer-input'} inputMode='decimal' value={answers[index] ?? ''} onChange={(e) => { const next = e.target.value; if (/^\d*([,.]\d*)?$/.test(next)) { const copy = [...answers]; copy[index] = next; setAnswers(copy); } }} placeholder='Sisesta number' />
                {!isKirsiMath && current.expectedUnit && <strong className='answer-unit-pill'>{current.expectedUnit}</strong>}
              </div>
            )}
          </div>
        </section>

        {error && <p id='vastuse-viga' className='test-error'>{error}</p>}
        {saveError && <p className='test-error'>{saveError}</p>}

        <footer className='test-actions-panel'>
          <button type='button' className='stop-button' onClick={() => router.push(baseSelectionUrl)}>Lõpeta</button>
          <button type='button' className='next-button' onClick={handleSubmit} disabled={isSaving}>{isSaving ? 'Salvestan...' : index === count - 1 ? 'Lõpeta test' : 'Järgmine'}</button>
        </footer>
      </section>
    </main>
  );
}

export default function TestPage() {
  return <Suspense fallback={<main className='test-page'><section className='test-shell'><section className='question-card'>Laadin küsimusi...</section></section></main>}><TestPageContent /></Suspense>;
}
