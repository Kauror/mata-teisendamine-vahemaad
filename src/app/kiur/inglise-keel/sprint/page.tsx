'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import EnglishMatchingBoard, { type EnglishMatchingBoardState } from '@/app/components/EnglishMatchingBoard';
import { ENGLISH_PACKS, shuffle } from '@/lib/englishGame';
import { fetchBestEnglishSprintScore } from '@/lib/englishHistory';
import type { EnglishVocabularyWord } from '@/lib/englishVocabulary';
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

type FailedSprintPair = {
  word: EnglishVocabularyWord;
  chosenOption: EnglishVocabularyWord;
};

type SprintReward = {
  awardedAmount: number;
  balanceAfter: number;
  capReached: boolean;
} | null;

type SprintReviewItem = {
  id: string;
  taskId: string;
  question: string;
  userAnswer: string;
  correctAnswer: number;
  correctAnswerText: string;
  isCorrect: boolean;
  kind: 'choice';
  choiceOptions: string[];
  explanation?: string;
};

type EnglishSprintRunnerState = {
  score: number;
  streak: number;
  boardSeed: number;
  ended: boolean;
  timeLeft: number;
  failedPair: FailedSprintPair | null;
  pairs: number;
  mistakes: number;
  boardState: EnglishMatchingBoardState;
  reviewItems: SprintReviewItem[];
};

type EnglishSprintSession = RunnerSessionV3<EnglishVocabularyWord, SprintReviewItem, EnglishSprintRunnerState, null>;

export default function SprintPage() {
  const [runId, setRunId] = useState<string | null>(null);
  const [runSeed, setRunSeed] = useState(0);
  const [wordPool, setWordPool] = useState<EnglishVocabularyWord[]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [streak, setStreak] = useState(0);
  const [boardSeed, setBoardSeed] = useState(1);
  const [ended, setEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12);
  const [failedPair, setFailedPair] = useState<FailedSprintPair | null>(null);
  const [reward, setReward] = useState<SprintReward>(null);
  const [sprintActive, setSprintActive] = useState<boolean | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [pairs, setPairs] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [boardState, setBoardState] = useState<EnglishMatchingBoardState>({ boardKey: '', selectedEnglishId: null, selectedEstonianId: null, completedIds: [], feedback: '' });
  const [reviewItems, setReviewItems] = useState<SprintReviewItem[]>([]);
  const endedRef = useRef(false);
  const savedHistoryRef = useRef(false);
  const startedAtRef = useRef(new Date().toISOString());
  const failedPairRef = useRef<FailedSprintPair | null>(null);
  const scoreRef = useRef(0);
  const pairsRef = useRef(0);
  const mistakesRef = useRef(0);
  const snapshotRef = useRef<Partial<EnglishSprintSession>>({});
  const contractRef = useRef<CatalogueContract | null>(null);

  const boardShuffleSeed = runSeed + boardSeed * 10_007;
  const boardLayoutSeed = runSeed + boardSeed * 20_011;
  const boardWords = useMemo(() => shuffle(wordPool, boardShuffleSeed).slice(0, 5), [wordPool, boardShuffleSeed]);

  useEffect(() => {
    let cancelled = false;
    void fetch('/api/learning-exercises/active?learner=kiur')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((body: { exerciseIds?: string[] }) => {
        if (!cancelled) setSprintActive(Boolean(body.exerciseIds?.includes('kiur.english.sprint')));
      })
      .catch(async () => {
        // Offline: fall back to the cached catalogue instead of blocking.
        const permitted = await isExercisePermittedOffline('kiur', { exerciseId: 'kiur.english.sprint', subject: 'inglise-keel', topic: 'sprint', category: 'Inglise keel - sprint' }).catch(() => false);
        if (!cancelled) setSprintActive(permitted);
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
    if (sprintActive !== true || sessionReady) return;
    let cancelled = false;
    void (async () => {
      const id = ensureRunIdInCurrentUrl();
      setRunId(id);
      const existing = await loadRunnerSession<EnglishVocabularyWord, SprintReviewItem, EnglishSprintRunnerState, null>(id);
      if (cancelled) return;
      if (existing) {
        if (existing.runnerId !== 'kiur-english-sprint') throw new Error('See salvestatud jooks kuulub teisele harjutusele.');
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
        endedRef.current = state.ended;
        failedPairRef.current = state.failedPair;
        scoreRef.current = state.score;
        pairsRef.current = state.pairs;
        mistakesRef.current = state.mistakes;
        setRunSeed(Number(existing.seed));
        setWordPool(existing.questions);
        setScore(state.score);
        setStreak(state.streak);
        setBoardSeed(state.boardSeed);
        setEnded(state.ended);
        setTimeLeft(state.timeLeft);
        setFailedPair(state.failedPair);
        setPairs(state.pairs);
        setMistakes(state.mistakes);
        setBoardState(state.boardState);
        setReviewItems(state.reviewItems ?? existing.answers ?? []);
        setElapsedSeconds(Math.floor(existing.activeElapsedMs / 1000));
        setSessionReady(true);
        return;
      }
      if (await getLocalAttempt(id)) {
        window.location.replace(`/tulemus?clientId=${encodeURIComponent(id)}`);
        return;
      }
      const seed = Date.now();
      const words = ENGLISH_PACKS.flatMap((pack) => pack.words).map((word) => ({ ...word }));
      const initialBoardState: EnglishMatchingBoardState = { boardKey: '', selectedEnglishId: null, selectedEstonianId: null, completedIds: [], feedback: '' };
      const contract = await getCatalogueContract('kiur');
      const capability = getOfflineRunnerCapability('kiur-english-sprint');
      if (!contract || !capability) throw new Error('Ühenda seade internetiga, et sprint enne võrguühenduseta kasutamist ette valmistada.');
      const startedAt = new Date().toISOString();
      await createRunnerSession<EnglishVocabularyWord, SprintReviewItem, EnglishSprintRunnerState, null>({
        runId: id,
        learner: 'kiur',
        runnerId: capability.runnerId,
        exerciseId: 'kiur.english.sprint',
        subject: 'inglise-keel',
        topic: 'sprint',
        category: 'Inglise keel - sprint',
        seed,
        questions: words,
        answers: [],
        currentPhase: 'matching',
        runnerState: { score: 0, streak: 0, boardSeed: 1, ended: false, timeLeft: 12, failedPair: null, pairs: 0, mistakes: 0, boardState: initialBoardState, reviewItems: [] },
        catalogueVersion: contract.catalogueVersion,
        rewardPolicyVersion: contract.rewardPolicyVersion,
        generatorVersion: capability.generatorVersion,
        rotationVersion: capability.rotationVersion,
        runnerVersion: capability.runnerVersion,
        startedAt
      });
      if (cancelled) return;
      startedAtRef.current = startedAt;
      contractRef.current = contract;
      setRunSeed(seed);
      setWordPool(words);
      setBoardState(initialBoardState);
      setSessionReady(true);
    })().catch((error) => {
      if (!cancelled) setStorageError(runnerStorageFailure(error).message);
    });
    return () => { cancelled = true; };
  }, [sessionReady, sprintActive]);

  snapshotRef.current = {
    currentIndex: boardSeed,
    currentPhase: ended ? 'result' : 'matching',
    answers: reviewItems,
    activeElapsedMs: elapsedSeconds * 1000,
    runnerState: { score, streak, boardSeed, ended, timeLeft, failedPair, pairs, mistakes, boardState, reviewItems },
    status: storageError ? 'paused' : 'active'
  };

  useEffect(() => {
    if (!sessionReady || !runId || ended || savedHistoryRef.current || storageError) return;
    void patchRunnerSession<EnglishSprintSession>(runId, snapshotRef.current).catch((error) => setStorageError(runnerStorageFailure(error).message));
  }, [boardSeed, boardState, ended, failedPair, mistakes, pairs, reviewItems, runId, score, sessionReady, storageError, streak, timeLeft]);

  useEffect(() => {
    if (ended || sprintActive !== true || !sessionReady || storageError) return;
    const t = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      setElapsedSeconds((value) => value + 1);
      setTimeLeft((v) => {
        if (v <= 1) {
          endedRef.current = true;
          setEnded(true);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [ended, sessionReady, sprintActive, storageError]);

  useEffect(() => {
    if (!runId || !sessionReady || ended) return;
    const checkpoint = () => void patchRunnerSession<EnglishSprintSession>(runId, snapshotRef.current).catch((error) => setStorageError(runnerStorageFailure(error).message));
    const timer = window.setInterval(checkpoint, 5000);
    const onVisibility = () => { if (document.visibilityState === 'hidden') checkpoint(); };
    window.addEventListener('pagehide', checkpoint);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('pagehide', checkpoint);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [ended, runId, sessionReady]);

  useEffect(() => {
    if (!ended || savedHistoryRef.current || sprintActive !== true || !runId) return;
    savedHistoryRef.current = true;

    const finalScore = scoreRef.current;
    const finalPairs = pairsRef.current;
    const finalMistakes = mistakesRef.current;
    const finalQuestionCount = Math.max(1, finalPairs + finalMistakes);

    if (finalScore > best) {
      setBest(finalScore);
    }

    const questions = reviewItems;

    // Local-first: save the run to IndexedDB, then best-effort sync. The result
    // shows immediately whether online or off.
    void (async () => {
      const contract = contractRef.current;
      const capability = getOfflineRunnerCapability('kiur-english-sprint');
      if (!contract || !capability) throw new Error('Harjutuse kataloogileping puudub.');
      const outcome = await finalizeRunnerSession({
        runId,
        seed: runSeed,
        runnerId: capability.runnerId,
        questionIds: reviewItems.map((item) => item.taskId),
        rewardPolicyVersion: contract.rewardPolicyVersion,
        generatorVersion: capability.generatorVersion,
        runnerVersion: capability.runnerVersion,
        rotationVersion: capability.rotationVersion,
        learner: 'kiur',
        subject: 'inglise-keel',
        topic: 'sprint',
        category: 'Inglise keel - sprint',
        difficulty: 'Tavaline',
        exerciseId: 'kiur.english.sprint',
        catalogueVersion: contract.catalogueVersion,
        startedAt: startedAtRef.current,
        questionCount: finalQuestionCount,
        score: finalScore,
        elapsedSeconds,
        questions
      });
      setReward((outcome.reward as SprintReward) ?? null);
    })().catch((error) => {
      savedHistoryRef.current = false;
      setStorageError(runnerStorageFailure(error).message);
    });
  }, [best, elapsedSeconds, ended, reviewItems, runId, runSeed, sprintActive]);

  if (storageError) {
    return (
      <main className='container english-page'>
        <section className='practice-shell english-shell' role='alert'>
          <h1>Sprint on peatatud</h1>
          <p>{storageError}</p>
          <button type='button' className='start-button' onClick={() => window.location.reload()}>Proovi salvestust uuesti</button>
          <Link className='practice-back-button' href='/kiur'>Tagasi harjutuste juurde</Link>
        </section>
      </main>
    );
  }

  if (sprintActive === null || !sessionReady) {
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
          <button className='sprint-primary-button' onClick={() => window.location.assign('/kiur/inglise-keel/sprint')}>▶ Proovi uuesti</button>
          <Link className='sprint-secondary-button' href='/kiur'>← Harjutused</Link>
        </div>
      </section>
    </main>;
  }

  return <main className='container english-page'><section className='practice-shell english-shell'>
    <Link className='practice-back-button' href='/kiur'>← Katkesta sprint</Link>
    <div className='matching-hud'><strong>Sprint</strong><span>Skoor: {score}</span><span>Jada: {streak}</span><span>Aeg: {timeLeft}s</span><span>Parim: {best}</span></div>
    <EnglishMatchingBoard words={boardWords} layoutSeed={boardLayoutSeed} state={boardState} onStateChange={setBoardState} onPair={(ok, word, chosenOption) => {
      if (endedRef.current || storageError) return;
      const item: SprintReviewItem = {
        id: `${runId ?? 'run'}-${reviewItems.length}`,
        taskId: word.id,
        question: word.english,
        userAnswer: chosenOption.estonian,
        correctAnswer: 0,
        correctAnswerText: word.estonian,
        isCorrect: ok,
        kind: 'choice',
        choiceOptions: [word.estonian],
        explanation: ok ? undefined : `Valisid: ${chosenOption.estonian}. Õige vastus: ${word.estonian}.`
      };
      setReviewItems((items) => [...items, item]);
      if (ok) {
        pairsRef.current += 1;
        setPairs(pairsRef.current);
        scoreRef.current += 1;
        setScore(scoreRef.current);
        setStreak((v) => v + 1);
      } else {
        const failed = { word, chosenOption };
        failedPairRef.current = failed;
        setFailedPair(failed);
        endedRef.current = true;
        mistakesRef.current += 1;
        setMistakes(mistakesRef.current);
        setEnded(true);
      }
    }} onBoardComplete={() => {
      if (endedRef.current) return;
      setTimeLeft((v) => Math.min(16, 12 + Math.min(v, 4)));
      setBoardSeed((v) => v + 1);
    }} showFeedback={false} />
  </section></main>;
}
