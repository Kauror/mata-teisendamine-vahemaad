'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { shuffle } from '@/lib/englishGame';
import { formatStars } from '@/lib/formatStars';
import { KIRSI_FIRST_SOUND_TASKS, KirsiFirstSoundTask } from '@/lib/kirsiFirstSoundTasks';
import {
  createRunnerSession,
  ensureRunIdInCurrentUrl,
  finalizeRunnerSession,
  getCatalogueContract,
  getLocalAttempt,
  isExercisePermittedOffline,
  loadRunnerSession,
  patchRunnerSession,
  runnerStorageFailure
} from '@/lib/offline/api';
import type { CatalogueContract } from '@/lib/offline/api';
import type { RunnerSessionV3 } from '@/lib/offline/records';
import { getOfflineRunnerCapability } from '@/lib/offline/capabilities';
import { useRunnerCheckpoint, useVisibleElapsedTimer } from '@/lib/offline/useRunnerLifecycle';

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

type FirstSoundRunnerState = {
  score: number;
  hintCount: number;
  hintVisible: boolean;
  selectedLetter: string | null;
  reviewItems: ReviewItem[];
  showStopConfirm: boolean;
};

type FirstSoundSession = RunnerSessionV3<KirsiFirstSoundTask, ReviewItem, FirstSoundRunnerState, null>;

function buildSession(seed: number) {
  return shuffle(KIRSI_FIRST_SOUND_TASKS, seed).slice(0, QUESTION_COUNT);
}

function getChoiceOptions(task: KirsiFirstSoundTask, seed: number) {
  const choices = task.options.includes(task.correctLetter)
    ? Array.from(new Set(task.options))
    : [task.correctLetter, ...task.options.filter((letter) => letter !== task.correctLetter)].slice(0, task.options.length);

  return shuffle(choices, seed);
}

export default function KirsiFirstSoundPage() {
  const [runId, setRunId] = useState<string | null>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [session, setSession] = useState<KirsiFirstSoundTask[]>([]);
  const [optionOrder, setOptionOrder] = useState<Record<string, string[]>>({});
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [reward, setReward] = useState<Reward>(null);
  const [saved, setSaved] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [exerciseActive, setExerciseActive] = useState<boolean | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startedAtRef = useRef(new Date().toISOString());
  const snapshotRef = useRef<Partial<FirstSoundSession>>({});
  const contractRef = useRef<CatalogueContract | null>(null);
  const current: KirsiFirstSoundTask | undefined = session[index];
  const answered = selectedLetter !== null;
  const isCorrect = Boolean(current && selectedLetter === current.correctLetter);
  const options = useMemo(() => current ? (optionOrder[current.id] ?? current.options) : [], [current, optionOrder]);

  useEffect(() => {
    let cancelled = false;
    void fetch('/api/learning-exercises/active?learner=kirsi')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((body: { exerciseIds?: string[] }) => {
        if (!cancelled) setExerciseActive(Boolean(body.exerciseIds?.includes('kirsi.reading.esimene-haalik')));
      })
      .catch(async () => {
        const permitted = await isExercisePermittedOffline('kirsi', { exerciseId: 'kirsi.reading.esimene-haalik', subject: 'lugemine', topic: 'esimene-haalik', category: 'Lugemine - esimene häälik' }).catch(() => false);
        if (!cancelled) setExerciseActive(permitted);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (exerciseActive !== true || sessionReady) return;
    let cancelled = false;
    void (async () => {
      const id = ensureRunIdInCurrentUrl();
      setRunId(id);
      const existing = await loadRunnerSession<KirsiFirstSoundTask, ReviewItem, FirstSoundRunnerState, null>(id);
      if (cancelled) return;
      if (existing) {
        if (existing.runnerId !== 'kirsi-first-sound') throw new Error('See salvestatud jooks kuulub teisele harjutusele.');
        const state = existing.runnerState;
        startedAtRef.current = existing.startedAt;
        contractRef.current = {
          catalogueVersion: existing.catalogueVersion ?? '',
          rewardPolicyVersion: existing.rewardPolicyVersion ?? 'legacy-v1',
          generatorVersion: existing.generatorVersion,
          runnerVersion: existing.runnerVersion,
          algorithmVersion: existing.rotationVersion ?? 1,
          rotationVersion: existing.rotationVersion ?? 1,
          dailyLimit: 0
        };
        setSeed(Number(existing.seed));
        setSession(existing.questions);
        setOptionOrder((existing.optionOrder ?? {}) as Record<string, string[]>);
        setIndex(existing.currentIndex);
        setScore(state.score);
        setHintCount(state.hintCount);
        setHintVisible(state.hintVisible);
        setSelectedLetter(state.selectedLetter);
        setReviewItems(state.reviewItems);
        setShowStopConfirm(state.showStopConfirm);
        setElapsedSeconds(Math.floor(existing.activeElapsedMs / 1000));
        setSessionReady(true);
        return;
      }
      if (await getLocalAttempt(id)) {
        window.location.replace(`/tulemus?clientId=${encodeURIComponent(id)}`);
        return;
      }
      const nextSeed = Date.now();
      const questions = buildSession(nextSeed);
      const orderedOptions = Object.fromEntries(questions.map((task, taskIndex) => [task.id, getChoiceOptions(task, nextSeed + taskIndex * 1777)]));
      const contract = await getCatalogueContract('kirsi');
      const capability = getOfflineRunnerCapability('kirsi-first-sound');
      if (!contract || !capability) throw new Error('Ühenda seade internetiga, et harjutus ette valmistada.');
      const startedAt = new Date().toISOString();
      await createRunnerSession<KirsiFirstSoundTask, ReviewItem, FirstSoundRunnerState, null>({
        runId: id,
        learner: 'kirsi',
        runnerId: 'kirsi-first-sound',
        exerciseId: 'kirsi.reading.esimene-haalik',
        subject: 'lugemine',
        topic: 'esimene-haalik',
        category: 'Lugemine - esimene häälik',
        seed: nextSeed,
        questions,
        optionOrder: orderedOptions,
        answers: [],
        currentIndex: 0,
        currentPhase: 'question',
        runnerState: { score: 0, hintCount: 0, hintVisible: false, selectedLetter: null, reviewItems: [], showStopConfirm: false },
        catalogueVersion: contract.catalogueVersion,
        rewardPolicyVersion: contract.rewardPolicyVersion,
        generatorVersion: capability.generatorVersion,
        runnerVersion: capability.runnerVersion,
        rotationVersion: capability.rotationVersion,
        startedAt
      });
      if (cancelled) return;
      startedAtRef.current = startedAt;
      contractRef.current = contract;
      setSeed(nextSeed);
      setSession(questions);
      setOptionOrder(orderedOptions);
      setSessionReady(true);
    })().catch((error) => {
      if (!cancelled) setStorageError(runnerStorageFailure(error).message);
    });
    return () => { cancelled = true; };
  }, [exerciseActive, sessionReady]);

  snapshotRef.current = {
    currentIndex: index,
    currentPhase: index >= session.length && session.length ? 'result' : selectedLetter ? 'feedback' : 'question',
    answers: reviewItems,
    activeElapsedMs: elapsedSeconds * 1000,
    runnerState: { score, hintCount, hintVisible, selectedLetter, reviewItems, showStopConfirm },
    status: storageError ? 'paused' : 'active'
  };

  useEffect(() => {
    if (!sessionReady || !runId || saved || storageError || (session.length > 0 && index >= session.length)) return;
    void patchRunnerSession<FirstSoundSession>(runId, snapshotRef.current).catch((error) => {
      setStorageError(runnerStorageFailure(error).message);
    });
  }, [hintCount, hintVisible, index, reviewItems, runId, saved, score, selectedLetter, session.length, sessionReady, showStopConfirm, storageError]);

  useVisibleElapsedTimer(sessionReady && !saved && !storageError && index < session.length, setElapsedSeconds);
  useRunnerCheckpoint<FirstSoundSession>({ enabled: sessionReady && !saved, runId, snapshotRef, setStorageError });

  useEffect(() => {
    if (!sessionReady || !runId || index < session.length || saved || exerciseActive !== true || !session.length) return;
    setSaved(true);

    void (async () => {
      const contract = contractRef.current;
      const capability = getOfflineRunnerCapability('kirsi-first-sound');
      if (!contract || !capability) throw new Error('Harjutuse võrguühenduseta leping puudub.');
      const outcome = await finalizeRunnerSession({
        runId,
        seed: seed ?? 0,
        runnerId: capability.runnerId,
        questionIds: session.map((task) => task.id),
        rewardPolicyVersion: contract.rewardPolicyVersion,
        generatorVersion: capability.generatorVersion,
        runnerVersion: capability.runnerVersion,
        rotationVersion: capability.rotationVersion,
        learner: 'kirsi',
        subject: 'lugemine',
        topic: 'esimene-haalik',
        category: 'Lugemine - esimene häälik',
        exerciseId: 'kirsi.reading.esimene-haalik',
        catalogueVersion: contract.catalogueVersion,
        startedAt: startedAtRef.current,
        questionCount: session.length,
        score,
        elapsedSeconds: Math.max(1, elapsedSeconds),
        questions: reviewItems
      });
      setReward((outcome.reward as Reward) ?? null);
    })().catch((error) => {
      setSaved(false);
      setStorageError(runnerStorageFailure(error).message);
    });
  }, [elapsedSeconds, exerciseActive, index, reviewItems, runId, saved, score, seed, session, sessionReady]);

  const reset = () => {
    window.location.assign('/kirsi/lugemine/esimene-haalik');
  };

  const chooseLetter = (letter: string) => {
    if (exerciseActive !== true || !current || answered || storageError) return;
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
    if (exerciseActive !== true || hintVisible || answered || storageError) return;
    setHintVisible(true);
    setHintCount((value) => value + 1);
  };

  const next = () => {
    if (storageError) return;
    setIndex((value) => value + 1);
    setHintVisible(false);
    setSelectedLetter(null);
  };

  if (storageError) {
    return (
      <main className='container english-page reading-page'>
        <section className='practice-shell english-shell first-sound-shell' role='alert'>
          <h1>Harjutus on peatatud</h1>
          <p>{storageError}</p>
          <button type='button' className='start-button' onClick={() => window.location.reload()}>Proovi salvestust uuesti</button>
          <Link className='practice-back-button' href='/kirsi'>Tagasi harjutuste juurde</Link>
        </section>
      </main>
    );
  }

  if (exerciseActive === null || seed === null || !sessionReady) {
    return <main className='container english-page reading-page'><section className='practice-shell english-shell first-sound-shell'>Laadin harjutust...</section></main>;
  }

  if (!exerciseActive) {
    return (
      <main className='container english-page reading-page'>
        <section className='practice-shell english-shell first-sound-shell'>
          <Link className='practice-back-button' href='/kirsi'>&larr; Harjutused</Link>
          <header className='subject-header'>
            <div className='subject-emoji'>ABC</div>
            <h1>Harjutus ei ole praegu saadaval</h1>
          </header>
        </section>
      </main>
    );
  }

  if (session.length > 0 && index >= session.length) {
    return (
      <main className='english-page sprint-result-page reading-page'>
        <section className='sprint-result-panel'>
          <header className='sprint-result-header'>
            <div className='sprint-result-emoji' aria-hidden>🔤</div>
            <h1 className='sprint-result-title'>Tulemus</h1>
            <p className='sprint-result-subtitle'>Harjutus on lõpetatud.</p>
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
            <Link className='sprint-secondary-button' href='/kirsi'>← Harjutused</Link>
          </div>
        </section>
      </main>
    );
  }

  if (!current) return null;

  return (
    <main className='container english-page reading-page'>
      <section className='practice-shell english-shell first-sound-shell'>
        <Link className='practice-back-button' href='/kirsi'>← Harjutused</Link>
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
        <footer className='test-actions-panel'>
          {showStopConfirm ? (
            <div className='stop-confirm-panel' role='alertdialog' aria-labelledby='first-sound-stop-title'>
              <p id='first-sound-stop-title'>Kas soovid harjutuse lõpetada?</p>
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
