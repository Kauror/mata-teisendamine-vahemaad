'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { completedTodayFromHistory, ClientCompletionAttempt } from '@/lib/clientExerciseCompletion';
import { shuffle } from '@/lib/englishGame';
import { formatStars } from '@/lib/formatStars';
import { getValidKiurReadingTasks, KiurReadingTask } from '@/lib/kiurReadingTasks';
import {
  createRunnerSession,
  ensureRunIdInCurrentUrl,
  finalizeRunnerSession,
  getCatalogueContract,
  getLocalAttempt,
  getMergedExerciseHistory,
  isExercisePermittedOffline,
  isRunId,
  loadRunnerSession,
  patchRunnerSession,
  runnerStorageFailure
} from '@/lib/offline/api';
import type { CatalogueContract } from '@/lib/offline/api';
import type { RunnerSessionV3 } from '@/lib/offline/records';
import { getOfflineRunnerCapability } from '@/lib/offline/capabilities';

const RUN_LENGTH = 5;

type Phase = 'start' | 'reading' | 'question' | 'feedback' | 'result';

type SessionTask = KiurReadingTask & {
  shuffledOptions: string[];
};

type ReviewItem = {
  id: string;
  question: string;
  userAnswer: string;
  selectedAnswer: string;
  correctAnswer: number;
  correctAnswerText: string;
  isCorrect: boolean;
  kind: 'choice';
  choiceOptions: string[];
  text: string;
  sourceAuthor: string;
  sourceTitle: string;
  sourceCollection: string;
  evidenceText: string;
};

type ReadingRunnerState = {
  score: number;
  selectedAnswer: string;
  reviewItems: ReviewItem[];
  showStopConfirm: boolean;
};

type ReadingSession = RunnerSessionV3<SessionTask, ReviewItem, ReadingRunnerState, null>;

type Reward = {
  awardedAmount: number;
  balanceAfter: number;
  capReached: boolean;
} | null;

function buildSession() {
  const validTasks = getValidKiurReadingTasks();
  const seed = Date.now() + Math.floor(Math.random() * 100000);
  return shuffle(validTasks, seed)
    .slice(0, Math.min(RUN_LENGTH, validTasks.length))
    .map((task, index) => ({
      ...task,
      shuffledOptions: shuffle(task.options, seed + index * 7919)
    }));
}

function sourceLabel(task: Pick<KiurReadingTask, 'sourceAuthor' | 'sourceTitle' | 'sourceCollection'>) {
  return `Allikas: ${task.sourceAuthor}, "${task.sourceTitle}", ${task.sourceCollection}`;
}

export default function KiurReadingPage() {
  const [runId, setRunId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('start');
  const [session, setSession] = useState<SessionTask[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [reward, setReward] = useState<Reward>(null);
  const [saved, setSaved] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [readingActive, setReadingActive] = useState(false);
  const [doneToday, setDoneToday] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startedAtRef = useRef(new Date().toISOString());
  const seedRef = useRef<number | string>(0);
  const snapshotRef = useRef<Partial<ReadingSession>>({});
  const contractRef = useRef<CatalogueContract | null>(null);
  const answerLockedRef = useRef(false);

  const current = session[index];
  const runCount = session.length;
  const isCorrect = Boolean(current && selectedAnswer === current.correctAnswer);

  useEffect(() => {
    void fetch('/api/learning-exercises/active?learner=kiur')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((body) => setReadingActive(Array.isArray(body.exerciseIds) && body.exerciseIds.includes('kiur.reading.loe-ja-vasta')))
      .catch(async () => {
        const permitted = await isExercisePermittedOffline('kiur', { exerciseId: 'kiur.reading.loe-ja-vasta', subject: 'lugemine', topic: 'loe-ja-vasta', category: 'Lugemine - loe ja vasta' }).catch(() => false);
        setReadingActive(permitted);
      });
  }, []);

  useEffect(() => {
    void getMergedExerciseHistory()
      .then((attempts) => setDoneToday(completedTodayFromHistory(attempts as ClientCompletionAttempt[], 'kiur', 'kiur.reading.loe-ja-vasta', { subject: 'lugemine', topic: 'loe-ja-vasta', category: 'Lugemine - loe ja vasta' })))
      .catch(() => setDoneToday(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const candidate = new URL(window.location.href).searchParams.get('run');
      if (!isRunId(candidate)) {
        setSessionReady(true);
        return;
      }
      setRunId(candidate);
      const existing = await loadRunnerSession<SessionTask, ReviewItem, ReadingRunnerState, null>(candidate);
      if (cancelled) return;
      if (!existing) {
        if (await getLocalAttempt(candidate)) window.location.replace(`/tulemus?clientId=${encodeURIComponent(candidate)}`);
        else setSessionReady(true);
        return;
      }
      if (existing.runnerId !== 'kiur-reading') throw new Error('See salvestatud jooks kuulub teisele harjutusele.');
      const state = existing.runnerState;
      startedAtRef.current = existing.startedAt;
      seedRef.current = existing.seed ?? 0;
      contractRef.current = {
        catalogueVersion: existing.catalogueVersion ?? '',
        rewardPolicyVersion: existing.rewardPolicyVersion ?? 'legacy-v1',
        generatorVersion: existing.generatorVersion,
        runnerVersion: existing.runnerVersion,
        algorithmVersion: existing.rotationVersion ?? 1,
        rotationVersion: existing.rotationVersion ?? 1,
        dailyLimit: 0
      };
      setSession(existing.questions);
      setIndex(existing.currentIndex);
      setPhase(existing.currentPhase as Phase);
      setScore(state.score);
      setSelectedAnswer(state.selectedAnswer);
      setReviewItems(state.reviewItems);
      setShowStopConfirm(state.showStopConfirm);
      setElapsedSeconds(Math.floor(existing.activeElapsedMs / 1000));
      answerLockedRef.current = existing.currentPhase === 'feedback';
      setSessionReady(true);
    })().catch((error) => {
      if (!cancelled) setStorageError(runnerStorageFailure(error).message);
    });
    return () => { cancelled = true; };
  }, []);

  snapshotRef.current = {
    currentIndex: index,
    currentPhase: phase,
    answers: reviewItems,
    activeElapsedMs: elapsedSeconds * 1000,
    runnerState: { score, selectedAnswer, reviewItems, showStopConfirm },
    status: storageError ? 'paused' : 'active'
  };

  useEffect(() => {
    if (!sessionReady || !runId || phase === 'start' || phase === 'result' || saved || storageError) return;
    void patchRunnerSession<ReadingSession>(runId, snapshotRef.current).catch((error) => setStorageError(runnerStorageFailure(error).message));
  }, [index, phase, reviewItems, runId, saved, score, selectedAnswer, sessionReady, showStopConfirm, storageError]);

  useEffect(() => {
    if (!sessionReady || saved || storageError || phase === 'start' || phase === 'result') return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') setElapsedSeconds((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase, saved, sessionReady, storageError]);

  useEffect(() => {
    if (!runId || !sessionReady || phase === 'start' || saved) return;
    const checkpoint = () => void patchRunnerSession<ReadingSession>(runId, snapshotRef.current).catch((error) => setStorageError(runnerStorageFailure(error).message));
    const timer = window.setInterval(checkpoint, 5000);
    const onVisibility = () => { if (document.visibilityState === 'hidden') checkpoint(); };
    window.addEventListener('pagehide', checkpoint);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('pagehide', checkpoint);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [phase, runId, saved, sessionReady]);

  useEffect(() => {
    if (phase !== 'result' || saved || runCount === 0 || !runId) return;
    setSaved(true);

    void (async () => {
      const contract = contractRef.current;
      const capability = getOfflineRunnerCapability('kiur-reading');
      if (!contract || !capability) throw new Error('Harjutuse võrguühenduseta leping puudub.');
      const outcome = await finalizeRunnerSession({
        runId,
        seed: seedRef.current,
        runnerId: capability.runnerId,
        questionIds: session.map((task) => task.id),
        rewardPolicyVersion: contract.rewardPolicyVersion,
        generatorVersion: capability.generatorVersion,
        runnerVersion: capability.runnerVersion,
        rotationVersion: capability.rotationVersion,
        learner: 'kiur',
        subject: 'lugemine',
        topic: 'loe-ja-vasta',
        category: 'Lugemine - loe ja vasta',
        difficulty: 'Loe ja vasta',
        exerciseId: 'kiur.reading.loe-ja-vasta',
        catalogueVersion: contract.catalogueVersion,
        startedAt: startedAtRef.current,
        questionCount: runCount,
        score,
        elapsedSeconds: Math.max(1, elapsedSeconds),
        questions: reviewItems
      });
      setReward((outcome.reward as Reward) ?? null);
    })().catch((error) => {
      setSaved(false);
      setStorageError(runnerStorageFailure(error).message);
    });
  }, [elapsedSeconds, phase, reviewItems, runCount, runId, saved, score, session]);

  const startRun = async () => {
    if (!readingActive || storageError) return;
    if (phase === 'result') {
      window.location.assign('/kiur/lugemine');
      return;
    }
    const nextSession = buildSession();
    if (!nextSession.length) return;
    const id = ensureRunIdInCurrentUrl();
    const contract = await getCatalogueContract('kiur');
    const capability = getOfflineRunnerCapability('kiur-reading');
    if (!contract || !capability) {
      setStorageError('Ühenda seade internetiga, et harjutus ette valmistada.');
      return;
    }
    const startedAt = new Date().toISOString();
    const nextSeed = Date.now();
    try {
      await createRunnerSession<SessionTask, ReviewItem, ReadingRunnerState, null>({
        runId: id,
        learner: 'kiur',
        runnerId: 'kiur-reading',
        exerciseId: 'kiur.reading.loe-ja-vasta',
        subject: 'lugemine',
        topic: 'loe-ja-vasta',
        category: 'Lugemine - loe ja vasta',
        seed: nextSeed,
        questions: nextSession,
        answers: [],
        currentPhase: 'reading',
        runnerState: { score: 0, selectedAnswer: '', reviewItems: [], showStopConfirm: false },
        catalogueVersion: contract.catalogueVersion,
        rewardPolicyVersion: contract.rewardPolicyVersion,
        generatorVersion: capability.generatorVersion,
        runnerVersion: capability.runnerVersion,
        rotationVersion: capability.rotationVersion,
        startedAt
      });
      startedAtRef.current = startedAt;
      seedRef.current = nextSeed;
      contractRef.current = contract;
      setRunId(id);
      setSession(nextSession);
      setIndex(0);
      setScore(0);
      setSelectedAnswer('');
      setReviewItems([]);
      setReward(null);
      setSaved(false);
      setShowStopConfirm(false);
      setElapsedSeconds(0);
      answerLockedRef.current = false;
      setPhase('reading');
    } catch (error) {
      setStorageError(runnerStorageFailure(error).message);
    }
  };

  const chooseAnswer = (answer: string) => {
    if (!current || phase !== 'question' || answerLockedRef.current || storageError) return;
    answerLockedRef.current = true;
    const correct = answer === current.correctAnswer;
    setSelectedAnswer(answer);
    if (correct) setScore((value) => value + 1);
    setReviewItems((items) => [...items, {
      id: current.id,
      question: current.question,
      userAnswer: answer,
      selectedAnswer: answer,
      correctAnswer: current.shuffledOptions.indexOf(current.correctAnswer),
      correctAnswerText: current.correctAnswer,
      isCorrect: correct,
      kind: 'choice',
      choiceOptions: current.shuffledOptions,
      text: current.text,
      sourceAuthor: current.sourceAuthor,
      sourceTitle: current.sourceTitle,
      sourceCollection: current.sourceCollection,
      evidenceText: current.evidenceText
    }]);
    setPhase('feedback');
  };

  const next = () => {
    if (storageError) return;
    if (index + 1 >= runCount) {
      setPhase('result');
      return;
    }
    setIndex((value) => value + 1);
    setSelectedAnswer('');
    answerLockedRef.current = false;
    setPhase('reading');
  };

  if (storageError) {
    return (
      <main className='container english-page kiur-reading-page'>
        <section className='practice-shell english-shell kiur-reading-shell' role='alert'>
          <h1>Harjutus on peatatud</h1>
          <p>{storageError}</p>
          <button type='button' className='start-button' onClick={() => window.location.reload()}>Proovi salvestust uuesti</button>
          <Link className='practice-back-button' href='/kiur'>Tagasi harjutuste juurde</Link>
        </section>
      </main>
    );
  }

  if (!sessionReady) {
    return <main className='container english-page kiur-reading-page'><section className='practice-shell english-shell kiur-reading-shell'>Taastan harjutust...</section></main>;
  }

  if (phase === 'start') {
    const hasTasks = readingActive && getValidKiurReadingTasks().length > 0;
    return (
      <main className='container english-page kiur-reading-page'>
        <section className='practice-shell english-shell reading-intro-shell kiur-reading-shell'>
          <Link className='practice-back-button' href='/kiur'>← Harjutused</Link>
          <header className='subject-header'>
            <div className='subject-emoji'>📖</div>
            <h1>Lugemine</h1>
          </header>
          {hasTasks ? (
            <section className='english-mode-grid'>
              <article className='english-mode-card kiur-reading-start-card'>
                {doneToday ? <span className='done-today-marker' aria-label='Täna tehtud'>✓</span> : null}
                <span className='english-mode-icon' aria-hidden>📖</span>
                <strong>Loe ja vasta</strong>
                <span>Loe lühike tekst läbi ja vasta küsimusele.</span>
                <button type='button' className='start-button' onClick={startRun}>Alusta</button>
              </article>
            </section>
          ) : (
            <p className='reading-intro-text'>Lugemisharjutused tulevad peagi.</p>
          )}
        </section>
      </main>
    );
  }

  if (phase === 'result') {
    return (
      <main className='english-page sprint-result-page kiur-reading-page'>
        <section className='sprint-result-panel kiur-reading-result-panel'>
          <header className='sprint-result-header'>
            <div className='sprint-result-emoji' aria-hidden>📖</div>
            <h1 className='sprint-result-title'>Tulemus</h1>
            <p className='sprint-result-subtitle'>Õigeid vastuseid: {score} / {runCount}</p>
          </header>
          {reward ? (
            <section className='reading-correction-card sprint-reward-card'>
              <p>Teenitud: <strong>+{formatStars(reward.awardedAmount)} ⭐</strong></p>
              <p>Tähed kokku: <strong>{formatStars(reward.balanceAfter)} ⭐</strong></p>
              {reward.capReached && reward.awardedAmount === 0 ? <p>Tänane õppimise punktipiir on täis.</p> : null}
            </section>
          ) : null}
          <section className='kiur-reading-review-list'>
            {reviewItems.map((item, itemIndex) => (
              <article key={item.id} className={item.isCorrect ? 'kiur-reading-review-card correct' : 'kiur-reading-review-card wrong'}>
                <div className='kiur-reading-review-head'>
                  <strong>{itemIndex + 1}. {item.isCorrect ? 'Õige' : 'Vale vastus'}</strong>
                  <span>{sourceLabel(item)}</span>
                </div>
                <p className='kiur-reading-review-text'>{item.text}</p>
                <div className='answer-review-grid'>
                  <p className='answer-line'><span>Küsimus:</span> <strong>{item.question}</strong></p>
                  <p className='answer-line'><span>Sinu vastus:</span> <strong>{item.selectedAnswer}</strong></p>
                  <p className='answer-line'><span>Õige vastus:</span> <strong>{item.correctAnswerText}</strong></p>
                  {!item.isCorrect ? <p className='answer-line'><span>Tekstis oli kirjas:</span> <strong>{item.evidenceText}</strong></p> : null}
                </div>
              </article>
            ))}
          </section>
          <div className='sprint-result-actions'>
            <button className='sprint-primary-button' onClick={startRun}>Harjuta uuesti</button>
            <Link className='sprint-secondary-button' href='/kiur'>Harjutused</Link>
          </div>
        </section>
      </main>
    );
  }

  if (!current) return null;

  return (
    <main className='container english-page kiur-reading-page'>
      <section className='practice-shell english-shell kiur-reading-shell'>
        <Link className='practice-back-button' href='/kiur'>← Harjutused</Link>
        <div className='matching-hud'>
          <strong>Loe ja vasta</strong>
          <span>{index + 1} / {runCount}</span>
          <span>Õigeid: {score}</span>
        </div>

        {phase === 'reading' ? (
          <section className='kiur-reading-card'>
            <p className='question-eyebrow'>Loe tekst läbi</p>
            <p className='kiur-reading-text'>{current.text}</p>
            <p className='kiur-reading-source'>{sourceLabel(current)}</p>
            <button type='button' className='start-button' onClick={() => {
              answerLockedRef.current = false;
              setPhase('question');
            }}>Olen lugenud</button>
          </section>
        ) : null}

        {phase === 'question' ? (
          <section className='kiur-reading-card'>
            <p className='question-eyebrow'>{index + 1} / {runCount}</p>
            <h1 className='kiur-reading-question'>{current.question}</h1>
            <div className='kiur-reading-options'>
              {current.shuffledOptions.map((option) => (
                <button key={option} type='button' className='choice-answer-button' onClick={() => chooseAnswer(option)}>
                  {option}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {phase === 'feedback' ? (
          <section className={isCorrect ? 'kiur-reading-feedback correct' : 'kiur-reading-feedback wrong'}>
            <h1>{isCorrect ? 'Õige' : `Õige vastus: ${current.correctAnswer}`}</h1>
            {!isCorrect ? (
              <>
                <p>Tekstis oli kirjas:</p>
                <strong>{current.evidenceText}</strong>
              </>
            ) : null}
            <button type='button' className='start-button' onClick={next}>Järgmine</button>
          </section>
        ) : null}

        <footer className='test-actions-panel'>
          {showStopConfirm ? (
            <div className='stop-confirm-panel' role='alertdialog' aria-labelledby='kiur-reading-stop-title'>
              <p id='kiur-reading-stop-title'>Kas soovid harjutuse lõpetada?</p>
              <div className='stop-confirm-actions'>
                <button type='button' className='stop-cancel-button' onClick={() => setShowStopConfirm(false)}>Jätka harjutust</button>
                <Link className='stop-confirm-button' href='/kiur'>Jah, lõpeta</Link>
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
