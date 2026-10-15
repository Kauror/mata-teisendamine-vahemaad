'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Difficulty, GeneratedQuestion } from '@/lib/types';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { generateKirsiSession } from '@/lib/exercises/kirsiMath';
import { compactTopicLabel } from '@/lib/history';
import { formatElapsed, validateAnswerInput } from '@/lib/validation';
import AnalogClockVisual from '@/app/components/AnalogClockVisual';
import { ShapeVisual } from '@/app/components/visuals/CircleVisual';
import {
  createRunnerSession,
  ensureRunIdInCurrentUrl,
  finalizeRunnerSession,
  getCatalogueContract,
  getCatalogueExercise,
  getLocalAttempt,
  loadRunnerSession,
  runnerStorageFailure
} from '@/lib/offline/api';
import type { CatalogueContract } from '@/lib/offline/api';
import type { RunnerSessionV3 } from '@/lib/offline/records';
import { getOfflineRunnerCapability } from '@/lib/offline/capabilities';
import { useRunnerAutosave, useRunnerCheckpoint, useVisibleElapsedTimer } from '@/lib/offline/useRunnerLifecycle';
import { useExerciseActive } from '@/lib/offline/useExerciseActive';
import { contractFromSession, runnerFinalizeContract } from '@/lib/offline/runnerContract';
import RunnerPausedScreen from '@/lib/offline/RunnerPausedScreen';
import { buildMathQuestionResults, mathChoiceLabels, type MathAnswerSnapshot } from '@/lib/mathResults';
import { verifyMathTextAnswer } from '@/lib/shared/answerVerification';
import { composeTextAnswer, textAnswerFields, textAnswerValues } from '@/lib/textAnswerFields';
import { isSupportedMathGeneratorVersion } from '@/lib/exercises/mathGeneratorVersion';
import { buildMathOptionOrder, displayedMathOptions, type MathOptionOrder } from '@/lib/mathOptionOrder';

type MathRunnerState = {
  answers: string[];
  orderingAnswers: string[][];
  choiceAnswers: string[];
  countingFeedback: { answer: string; isCorrect: boolean } | null;
  textFeedback: { answer: string; isCorrect: boolean } | null;
  showStopConfirm: boolean;
};

type MathSession = RunnerSessionV3<GeneratedQuestion, string, MathRunnerState, null>;

const choiceLabels = mathChoiceLabels;

function CountingObjectGrid({ question }: { question: GeneratedQuestion }) {
  if (question.type !== 'counting' || !question.emoji || !question.count) return null;
  const items = Array.from({ length: question.count }, (_, index) => index);
  return (
    <div className='counting-object-grid' aria-label={`${question.count} ${question.objectLabel ?? 'asja'}`}>
      {items.map((item) => <span key={item}>{question.emoji}</span>)}
    </div>
  );
}

function normalizeNumberEntry(value: string) {
  const compact = value.replace(/\s/g, '').replace(',', '.');
  if (!/^\d*(?:\.\d*)?$/.test(compact)) return null;
  return compact.replace('.', ',');
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
  const exerciseIdParam = params.get('exerciseId');
  const difficulty = 'Lihtne' as Difficulty;
  const requestedCount = Number(params.get('count'));
  const count = topic === 'tekstulesanded' || categoryParam === 'Tekstülesanded'
    ? 5
    : Number.isSafeInteger(requestedCount) && requestedCount >= 1 && requestedCount <= 15 ? requestedCount : 15;
  const seed = Number(params.get('seed') || 1);

  const isKirsiMath = learner === 'kirsi' && subject === 'matemaatika';
  const baseSelectionUrl = learner === 'kirsi' ? '/kirsi' : learner === 'kiur' ? '/kiur' : '/';

  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [optionOrder, setOptionOrder] = useState<MathOptionOrder | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [orderingAnswers, setOrderingAnswers] = useState<string[][]>([]);
  const [choiceAnswers, setChoiceAnswers] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [countingFeedback, setCountingFeedback] = useState<{ answer: string; isCorrect: boolean } | null>(null);
  const [textFeedback, setTextFeedback] = useState<{ answer: string; isCorrect: boolean } | null>(null);
  // Offline: the catalogue version this session started from (attached to the
  // attempt so the server can validate it historically), plus a stable session id
  // so an interrupted exercise resumes exactly.
  const [sessionReady, setSessionReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const startedAtRef = useRef<string>(new Date().toISOString());
  const contractRef = useRef<CatalogueContract | null>(null);
  // The generator version the run's questions were made with. A run resumed
  // after an app update must finalise with the version it was created with, or
  // the server would re-generate it with the new generator and reject it.
  const generatorVersionRef = useRef<string | null>(null);
  const exerciseIdRef = useRef<string | null>(exerciseIdParam);
  const learnerId: 'kiur' | 'kirsi' | null = learner === 'kiur' || learner === 'kirsi' ? learner : null;

  // Only the catalogue-managed subjects are gated; anything else is allowed.
  const exerciseActive = useExerciseActive({
    learner: learnerId,
    enabled: subject === 'matemaatika' || subject === 'inglise-keel' || subject === 'lugemine',
    exerciseId: exerciseIdParam,
    subject,
    topic,
    category: categoryParam,
    isActive: (body) => (body.exercises ?? []).some((exercise) => {
      if (exerciseIdParam && exercise.id) return exercise.id === exerciseIdParam;
      if (exercise.subject !== subject) return false;
      if (subject === 'matemaatika') {
        if (learner === 'kirsi') return exercise.topic === topic && exercise.category === categoryParam;
        return exercise.topic === topic;
      }
      return exercise.topic === topic || exercise.category === categoryParam;
    })
  });
  const exerciseAvailability = exerciseActive === null ? 'loading' : exerciseActive ? 'allowed' : 'blocked';

  useEffect(() => {
    if (exerciseAvailability === 'loading' || sessionReady) return;
    let cancelled = false;
    void (async () => {
      const id = ensureRunIdInCurrentUrl();
      setRunId(id);
      const existing = await loadRunnerSession<GeneratedQuestion, string, MathRunnerState, null>(id);
      if (cancelled) return;
      if (existing) {
        if (existing.runnerId !== 'math') throw new Error('See salvestatud jooks kuulub teisele harjutusele.');
        const stored = existing.questions;
        const state = existing.runnerState;
        startedAtRef.current = existing.startedAt;
        exerciseIdRef.current = existing.exerciseId;
        contractRef.current = contractFromSession(existing);
        generatorVersionRef.current = existing.generatorVersion;
        setQuestions(stored);
        setOptionOrder((existing.optionOrder ?? null) as MathOptionOrder | null);
        setAnswers(state.answers?.length === stored.length ? state.answers : Array(stored.length).fill(''));
        setChoiceAnswers(state.choiceAnswers?.length === stored.length ? state.choiceAnswers : Array(stored.length).fill(''));
        setOrderingAnswers(state.orderingAnswers?.length === stored.length ? state.orderingAnswers : Array.from({ length: stored.length }, () => []));
        setIndex(Math.min(existing.currentIndex ?? 0, stored.length - 1));
        setElapsed(Math.floor(existing.activeElapsedMs / 1000));
        setCountingFeedback(state.countingFeedback);
        setTextFeedback(state.textFeedback);
        setShowStopConfirm(state.showStopConfirm);
        setSessionReady(true);
        return;
      }
      if (await getLocalAttempt(id)) {
        window.location.replace(`/tulemus?clientId=${encodeURIComponent(id)}`);
        return;
      }
      if (exerciseAvailability !== 'allowed') {
        setSessionReady(true);
        return;
      }
      const contract = learnerId ? await getCatalogueContract(learnerId) : null;
      if (learnerId && !contract) throw new Error('Ühenda seade internetiga, et matemaatikaharjutused ette valmistada.');
      const catalogueExercise = learnerId
        ? await getCatalogueExercise(learnerId, { exerciseId: exerciseIdParam, subject, topic, category: categoryParam })
        : null;
      const resolvedExerciseId = exerciseIdParam ?? catalogueExercise?.id ?? null;
      if (learnerId && !resolvedExerciseId) throw new Error('Harjutuse kataloogikirjet ei leitud.');
      const capability = getOfflineRunnerCapability('math');
      if (!capability) throw new Error('Matemaatikaharjutuse võrguühenduseta leping puudub.');
      const currentVersion = capability.generatorVersion;
      if (!isSupportedMathGeneratorVersion(currentVersion)) throw new Error('Matemaatikaharjutuse küsimuste versioon ei ole toetatud.');
      const generated = isKirsiMath ? generateKirsiSession(categoryParam as never, count, seed, currentVersion) : generateKiurMathSession(topic, categoryParam, difficulty, count, seed, currentVersion);
      const emptyAnswers = Array(generated.length).fill('');
      const emptyOrdering = Array.from({ length: generated.length }, () => [] as string[]);
      const beganAt = new Date().toISOString();
      const initialState: MathRunnerState = {
        answers: emptyAnswers,
        orderingAnswers: emptyOrdering,
        choiceAnswers: emptyAnswers,
        countingFeedback: null,
        textFeedback: null,
        showStopConfirm: false
      };
      const created = await createRunnerSession<GeneratedQuestion, string, MathRunnerState, null>({
        runId: id,
        learner: learnerId,
        runnerId: capability.runnerId,
        exerciseId: resolvedExerciseId,
        subject: subject || null,
        topic,
        category: categoryParam,
        seed,
        questions: generated,
        optionOrder: buildMathOptionOrder(generated, seed),
        answers: initialState.answers,
        currentIndex: 0,
        currentPhase: 'question',
        runnerState: initialState,
        catalogueVersion: contract?.catalogueVersion ?? null,
        rewardPolicyVersion: contract?.rewardPolicyVersion ?? 'legacy-v1',
        generatorVersion: currentVersion,
        runnerVersion: capability.runnerVersion,
        rotationVersion: capability.rotationVersion,
        startedAt: beganAt
      });
      if (cancelled) return;
      contractRef.current = contract;
      generatorVersionRef.current = created.generatorVersion;
      exerciseIdRef.current = resolvedExerciseId;
      startedAtRef.current = created.startedAt;
      setQuestions(created.questions);
      setOptionOrder((created.optionOrder ?? null) as MathOptionOrder | null);
      setAnswers(initialState.answers);
      setChoiceAnswers(initialState.choiceAnswers);
      setOrderingAnswers(initialState.orderingAnswers);
      setIndex(created.currentIndex);
      setElapsed(0);
      setError('');
      setIsSaving(false);
      setSaveError('');
      setShowStopConfirm(false);
      setCountingFeedback(null);
      setTextFeedback(null);
      setSessionReady(true);
    })().catch((cause) => {
      if (!cancelled) setStorageError(runnerStorageFailure(cause).message);
    });
    return () => { cancelled = true; };
  }, [categoryParam, count, difficulty, exerciseAvailability, exerciseIdParam, isKirsiMath, learnerId, seed, sessionReady, subject, topic]);

  const snapshotRef = useRunnerAutosave<MathSession>({
    currentIndex: index,
    currentPhase: countingFeedback || textFeedback ? 'feedback' : 'question',
    answers,
    activeElapsedMs: elapsed * 1000,
    runnerState: { answers, orderingAnswers, choiceAnswers, countingFeedback, textFeedback, showStopConfirm },
    status: storageError ? 'paused' : isSaving ? 'finalizing' : 'active'
  }, {
    enabled: sessionReady && Boolean(questions.length) && !isSaving && !storageError,
    runId,
    setStorageError,
    changes: [answers, choiceAnswers, countingFeedback, index, isSaving, orderingAnswers, questions.length, runId, sessionReady, showStopConfirm, storageError, textFeedback]
  });

  useVisibleElapsedTimer(Boolean(questions.length && sessionReady && !isSaving && !storageError), setElapsed);
  useRunnerCheckpoint<MathSession>({ enabled: sessionReady && !isSaving, runId, snapshotRef, setStorageError });

  useEffect(() => setError(''), [index]);

  const current = questions[index];
  const cards = current?.orderingCards ?? [];
  const selected = orderingAnswers[index] ?? [];
  const selectedSet = new Set(selected);
  const isChoiceQuestion = current?.kind === 'choice';
  const isCountingQuestion = current?.type === 'counting';
  const isClockQuestion = current?.type === 'clock';
  const isTextQuestion = current?.kind === 'text';
  const currentTextFields = current && isTextQuestion ? textAnswerFields(current) : null;

  const getCurrentAnswer = () => {
    if (current.kind === 'ordering') return orderingAnswers[index]?.join('|') ?? '';
    if (isChoiceQuestion) return choiceAnswers[index] ?? '';
    if (isTextQuestion && currentTextFields) return answers[index] ?? '';
    return inputRef.current?.value ?? answers[index] ?? '';
  };

  // Flip the sign of the numeric answer. `inputMode='decimal'` never exposes a
  // minus key on mobile, so this button is the way to enter negative answers.
  const toggleSign = () => {
    if (storageError) return;
    const copy = [...answers];
    const cur = copy[index] ?? '';
    copy[index] = cur.startsWith('-') ? cur.slice(1) : `-${cur}`;
    setAnswers(copy);
    inputRef.current?.focus();
  };

  const chooseCountingAnswer = (answer: string) => {
    if (!current || !isCountingQuestion || countingFeedback || storageError) return;
    const correct = choiceLabels(current).includes(answer);
    const next = [...choiceAnswers];
    next[index] = answer;
    setChoiceAnswers(next);
    setCountingFeedback({ answer, isCorrect: correct });
    setError('');
  };

  if (storageError) return <RunnerPausedScreen variant='test' message={storageError} backHref={baseSelectionUrl} />;
  if (exerciseAvailability === 'loading' || !sessionReady) return <main className='test-page'><section className='test-shell'><section className='question-card'>Taastan harjutust...</section></section></main>;
  if (exerciseAvailability === 'blocked' && !questions.length) return <main className='test-page'><section className='test-shell'><section className='question-card'><h2>Harjutus ei ole saadaval</h2><p>See harjutus ei ole praegu aktiivne.</p><button type='button' className='btn' onClick={() => router.push(baseSelectionUrl)}>Tagasi</button></section></section></main>;
  if (!current) return <main className='test-page'><section className='test-shell'><section className='question-card'><h2>Harjutus ei ole saadaval</h2><p>Valitud teemat ei leitud.</p><button type='button' className='btn' onClick={() => router.push(baseSelectionUrl)}>Tagasi</button></section></section></main>;

  const handleSubmit = async () => {
    if (isSaving) return;
    setShowStopConfirm(false);

    if (current.kind === 'ordering') {
      if (selected.length !== cards.length) return setError('Vali kõik kaardid õigesse järjekorda.');
    } else if (isCountingQuestion) {
      if (!countingFeedback) return setError('Vali vastus.');
    } else if (isTextQuestion) {
      if (!textFeedback) {
        const currentAnswer = getCurrentAnswer();
        const copy = [...answers];
        copy[index] = currentAnswer;
        setAnswers(copy);
        const missingTextAnswer = currentTextFields
          ? textAnswerValues(currentAnswer, currentTextFields).some((value) => !value.trim())
          : !currentAnswer.trim();
        if (missingTextAnswer) {
          setError('Sisesta vastus enne jätkamist.');
          inputRef.current?.focus();
          return;
        }
        setTextFeedback({ answer: currentAnswer, isCorrect: verifyMathTextAnswer(current, currentAnswer) });
        setError('');
        return;
      }
    } else if (isChoiceQuestion) {
      if (!choiceAnswers[index]) return setError('Vali vastus.');
    } else {
      const currentAnswer = getCurrentAnswer();
      const copy = [...answers]; copy[index] = currentAnswer; setAnswers(copy);
      const err = validateAnswerInput(currentAnswer);
      if (err) { setError(err === 'Palun sisesta vastus.' ? 'Sisesta vastus enne jätkamist.' : err); inputRef.current?.focus(); return; }
    }

    const finalAnswers = [...answers];
    if (current.kind !== 'ordering' && !isChoiceQuestion) finalAnswers[index] = getCurrentAnswer();
    const answerSnapshot: MathAnswerSnapshot = {
      answers: finalAnswers,
      orderingAnswers: orderingAnswers.map((answer) => [...answer]),
      choiceAnswers: [...choiceAnswers]
    };
    setAnswers(finalAnswers);
    setError('');
    if (index < count - 1) {
      setCountingFeedback(null);
      setTextFeedback(null);
      return setIndex((v) => v + 1);
    }

    setIsSaving(true);
    const results = buildMathQuestionResults(questions, answerSnapshot);
    const score = results.filter((r) => r.isCorrect).length;

    try {
      // Local-first: save to IndexedDB and clear the session BEFORE any network,
      // then best-effort sync. The result shows immediately, online or off.
      if (!runId) throw new Error('Harjutuse jooksu ID puudub.');
      const outcome = await finalizeRunnerSession({
        ...runnerFinalizeContract('math', contractRef.current, generatorVersionRef.current),
        runId,
        seed,
        questionIds: questions.map((question) => question.id),
        learner: learnerId,
        subject: subject || null,
        topic,
        category: categoryParam,
        difficulty: 'Lihtne',
        exerciseId: exerciseIdRef.current,
        startedAt: startedAtRef.current,
        questionCount: results.length,
        score,
        elapsedSeconds: elapsed,
        questions: results
      });
      if (outcome.serverAttemptId) router.push(`/history/${outcome.serverAttemptId}`);
      else router.push(`/tulemus?clientId=${encodeURIComponent(outcome.clientAttemptId)}`);
    } catch (cause) {
      setStorageError(runnerStorageFailure(cause).message);
      setSaveError('Salvestamine ebaõnnestus. Proovi uuesti.');
      setIsSaving(false);
    }
  };

  const handleStopConfirm = () => {
    router.push(baseSelectionUrl);
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
          <CountingObjectGrid question={current} />
          {isClockQuestion && current.clockHour != null && current.clockMinutes != null && (
            <div className='clock-question-visual'>
              <AnalogClockVisual hour={current.clockHour} minutes={current.clockMinutes} />
            </div>
          )}
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
                {(current.choiceOptions?.length ? displayedMathOptions(current, optionOrder) : ['<', '=', '>']).map((sign) => <button type='button' key={sign} aria-pressed={choiceAnswers[index] === sign} disabled={Boolean(countingFeedback)} className={choiceAnswers[index] === sign ? 'choice-answer-button selected' : 'choice-answer-button'} onClick={() => { if (isCountingQuestion) { chooseCountingAnswer(sign); return; } const next = [...choiceAnswers]; next[index] = sign; setChoiceAnswers(next); }}>{sign}</button>)}
              </div>
            ) : isTextQuestion && currentTextFields ? (
              <div className={currentTextFields.length > 1 ? 'answer-input-row split-answer-row' : 'answer-input-row'}>
                {currentTextFields.map((field, fieldIndex) => {
                  const values = textAnswerValues(answers[index] ?? '', currentTextFields);
                  return (
                    <label className='split-answer-field' key={`${field.unit}-${fieldIndex}`}>
                      <input
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void handleSubmit(); } }}
                        ref={fieldIndex === 0 ? inputRef : undefined}
                        aria-label={`Vastus ${field.unit}`}
                        aria-describedby={error ? 'vastuse-viga' : undefined}
                        className={error ? 'answer-input input-error' : 'answer-input'}
                        inputMode='decimal'
                        value={values[fieldIndex] ?? ''}
                        disabled={Boolean(textFeedback)}
                        onChange={(e) => {
                          const nextValue = normalizeNumberEntry(e.target.value);
                          if (nextValue === null) return;
                          const nextValues = textAnswerValues(answers[index] ?? '', currentTextFields);
                          nextValues[fieldIndex] = nextValue;
                          const copy = [...answers];
                          copy[index] = composeTextAnswer(currentTextFields, nextValues);
                          setAnswers(copy);
                        }}
                        placeholder='Number'
                      />
                      <strong className='answer-unit-pill'>{field.unit}</strong>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className='answer-input-row'>
                <div className='answer-entry'>
                  {!isTextQuestion && (
                    <button type='button' className='answer-sign-toggle' aria-label='Muuda märki (miinus/pluss)' aria-pressed={(answers[index] ?? '').startsWith('-')} disabled={isTextQuestion && Boolean(textFeedback)} onClick={toggleSign}>±</button>
                  )}
                  <input onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void handleSubmit(); } }} ref={inputRef} aria-label='Vastus' aria-describedby={error ? 'vastuse-viga' : undefined} className={error ? 'answer-input input-error' : 'answer-input'} inputMode={isTextQuestion ? 'text' : 'decimal'} value={answers[index] ?? ''} disabled={isTextQuestion && Boolean(textFeedback)} onChange={(e) => { const next = e.target.value; if (isTextQuestion || /^-?\d*([,.]\d*)?$/.test(next)) { const copy = [...answers]; copy[index] = next; setAnswers(copy); } }} placeholder={isTextQuestion ? 'Sisesta vastus' : 'Sisesta number'} />
                </div>
                {!isKirsiMath && current.expectedUnit && <strong className='answer-unit-pill'>{current.expectedUnit}</strong>}
              </div>
            )}
          </div>
          {isCountingQuestion && countingFeedback ? (
            <div className={`counting-feedback ${countingFeedback.isCorrect ? 'correct' : 'wrong'}`}>
              <strong>{countingFeedback.isCorrect ? 'Õige!' : `Õige vastus on ${current.correctAnswerText ?? choiceLabels(current)[0]}.`}</strong>
              <span>{current.explanation}</span>
            </div>
          ) : null}
          {isTextQuestion && textFeedback ? (
            <div className={`counting-feedback ${textFeedback.isCorrect ? 'correct' : 'wrong'}`}>
              <strong>{textFeedback.isCorrect ? 'Õige!' : `Õige vastus on ${current.correctAnswerText}.`}</strong>
              <span>{current.explanation}</span>
            </div>
          ) : null}
        </section>

        {error && <p id='vastuse-viga' className='test-error'>{error}</p>}
        {saveError && <p className='test-error'>{saveError}</p>}

        <footer className='test-actions-panel'>
          <button type='button' className='next-button' onClick={handleSubmit} disabled={isSaving}>{isSaving ? 'Salvestan...' : isTextQuestion && !textFeedback ? 'Vasta' : index === count - 1 ? 'Lõpeta test' : 'Järgmine'}</button>
          {showStopConfirm ? (
            <div className='stop-confirm-panel' role='alertdialog' aria-labelledby='stop-confirm-title'>
              <p id='stop-confirm-title'>Kas soovid harjutuse lõpetada?</p>
              <div className='stop-confirm-actions'>
                <button type='button' className='stop-cancel-button' onClick={() => setShowStopConfirm(false)}>Jätka harjutust</button>
                <button type='button' className='stop-confirm-button' onClick={handleStopConfirm}>Jah, lõpeta</button>
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

export default function TestPage() {
  return <Suspense fallback={<main className='test-page'><section className='test-shell'><section className='question-card'>Laadin küsimusi...</section></section></main>}><TestPageContent /></Suspense>;
}
