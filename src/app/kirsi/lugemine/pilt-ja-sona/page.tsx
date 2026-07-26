'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import PictureWordSprintBoard, { type PictureWordSprintBoardState } from '@/app/components/PictureWordSprintBoard';
import PointsConfetti from '@/app/components/PointsConfetti';
import { shuffle } from '@/lib/englishGame';
import { fetchBestKirsiReadingSprintScore } from '@/lib/kirsiReadingHistory';
import { buildKirsiPictureWordQuestion, KIRSI_READING_PAIRS, KirsiReadingPair } from '@/lib/kirsiReadingPairs';
import { formatStars } from '@/lib/formatStars';
import { formatElapsed } from '@/lib/validation';
import {
  createRunnerSession,
  ensureRunIdInCurrentUrl,
  finalizeRunnerSession,
  getCatalogueContract,
  getLocalAttempt,
  isExercisePermittedOffline,
  isRunId,
  loadRunnerSession,
  patchRunnerSession,
  runnerStorageFailure
} from '@/lib/offline/api';
import type { CatalogueContract } from '@/lib/offline/api';
import type { RunnerSessionV3 } from '@/lib/offline/records';
import { getOfflineRunnerCapability } from '@/lib/offline/capabilities';
import { useRunnerCheckpoint, useVisibleElapsedTimer } from '@/lib/offline/useRunnerLifecycle';

type ReviewItem = {
  taskId: string;
  id: string;
  question: string;
  userAnswer: string;
  correctAnswer: number;
  isCorrect: boolean;
  kind: 'choice';
  image: string;
  selectedWord: string;
  correctWord: string;
  vocabularyId: string;
};

type WrongMatch = {
  picture: KirsiReadingPair;
  selected: KirsiReadingPair;
};

type SprintReward = {
  awardedAmount: number;
  balanceAfter: number;
  capReached: boolean;
} | null;

type PictureWordRunnerState = {
  started: boolean;
  score: number;
  streak: number;
  boardIndex: number;
  ended: boolean;
  wrongMatch: WrongMatch | null;
  reviewItems: ReviewItem[];
  showStopConfirm: boolean;
  boardState: PictureWordSprintBoardState;
};

type PictureWordSession = RunnerSessionV3<KirsiReadingPair, ReviewItem, PictureWordRunnerState, null>;

const BOARD_SIZE = 5;

function buildBoardPairs(pool: KirsiReadingPair[], runSeed: number, boardIndex: number) {
  const cycle = Math.floor((boardIndex * BOARD_SIZE) / pool.length);
  const start = (boardIndex * BOARD_SIZE) % pool.length;
  const deck = shuffle(pool, runSeed + cycle * 7919);
  return deck.slice(start, start + BOARD_SIZE);
}

export default function KirsiPictureWordSprintPage() {
  const [runId, setRunId] = useState<string | null>(null);
  const [pairPool, setPairPool] = useState<KirsiReadingPair[]>(KIRSI_READING_PAIRS);
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [beatRecord, setBeatRecord] = useState(false);
  const [streak, setStreak] = useState(0);
  const [boardIndex, setBoardIndex] = useState(0);
  const [ended, setEnded] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [wrongMatch, setWrongMatch] = useState<WrongMatch | null>(null);
  const [reward, setReward] = useState<SprintReward>(null);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [exerciseActive, setExerciseActive] = useState<boolean | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [boardState, setBoardState] = useState<PictureWordSprintBoardState>({ boardKey: '', selectedPictureId: null, selectedWordId: null, completedIds: [] });
  const runSeedRef = useRef(Date.now());
  const startedAtRef = useRef(new Date().toISOString());
  const endedRef = useRef(false);
  const savedHistoryRef = useRef(false);
  const snapshotRef = useRef<Partial<PictureWordSession>>({});
  const contractRef = useRef<CatalogueContract | null>(null);

  const boardPairs = useMemo(() => buildBoardPairs(pairPool, runSeedRef.current, boardIndex), [boardIndex, pairPool]);

  useEffect(() => {
    let cancelled = false;
    void fetch('/api/learning-exercises/active?learner=kirsi')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((body: { exerciseIds?: string[] }) => {
        if (!cancelled) setExerciseActive(Boolean(body.exerciseIds?.includes('kirsi.reading.pilt-ja-sona')));
      })
      .catch(async () => {
        const permitted = await isExercisePermittedOffline('kirsi', { exerciseId: 'kirsi.reading.pilt-ja-sona', subject: 'lugemine', topic: 'pilt-ja-sona', category: 'Lugemine - pilt ja sõna' }).catch(() => false);
        if (!cancelled) setExerciseActive(permitted);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    void fetchBestKirsiReadingSprintScore()
      .then(setBest)
      .catch(() => setBest(0));
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
      const existing = await loadRunnerSession<KirsiReadingPair, ReviewItem, PictureWordRunnerState, null>(candidate);
      if (cancelled) return;
      if (!existing) {
        if (await getLocalAttempt(candidate)) window.location.replace(`/tulemus?clientId=${encodeURIComponent(candidate)}`);
        else setSessionReady(true);
        return;
      }
      if (existing.runnerId !== 'kirsi-picture-word') throw new Error('See salvestatud jooks kuulub teisele harjutusele.');
      const state = existing.runnerState;
      runSeedRef.current = Number(existing.seed);
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
      setPairPool(existing.questions);
      setStarted(state.started);
      setScore(state.score);
      setStreak(state.streak);
      setBoardIndex(state.boardIndex);
      setEnded(state.ended);
      setWrongMatch(state.wrongMatch);
      setReviewItems(state.reviewItems);
      setShowStopConfirm(state.showStopConfirm);
      setBoardState(state.boardState);
      setElapsedSeconds(Math.floor(existing.activeElapsedMs / 1000));
      setSessionReady(true);
    })().catch((error) => {
      if (!cancelled) setStorageError(runnerStorageFailure(error).message);
    });
    return () => { cancelled = true; };
  }, []);

  snapshotRef.current = {
    currentIndex: boardIndex,
    currentPhase: ended ? 'result' : started ? 'matching' : 'start',
    answers: reviewItems,
    activeElapsedMs: elapsedSeconds * 1000,
    runnerState: { started, score, streak, boardIndex, ended, wrongMatch, reviewItems, showStopConfirm, boardState },
    status: storageError ? 'paused' : 'active'
  };

  useEffect(() => {
    if (!sessionReady || !runId || !started || ended || savedHistoryRef.current || storageError) return;
    void patchRunnerSession<PictureWordSession>(runId, snapshotRef.current).catch((error) => setStorageError(runnerStorageFailure(error).message));
  }, [boardIndex, boardState, ended, reviewItems, runId, score, sessionReady, showStopConfirm, started, storageError, streak, wrongMatch]);

  useVisibleElapsedTimer(started && !ended && !storageError, setElapsedSeconds);
  useRunnerCheckpoint<PictureWordSession>({ enabled: sessionReady && started && !ended, runId, snapshotRef, setStorageError });

  useEffect(() => {
    if (!ended || savedHistoryRef.current || exerciseActive !== true || !runId) return;
    savedHistoryRef.current = true;

    // Compare before setBest overwrites it — the result screen renders after this
    // effect, by which point `best` already equals the new score.
    if (score > best && score > 0) {
      setBest(score);
      setBeatRecord(true);
    }

    void (async () => {
      const contract = contractRef.current;
      const capability = getOfflineRunnerCapability('kirsi-picture-word');
      if (!contract || !capability) throw new Error('Harjutuse võrguühenduseta leping puudub.');
      const outcome = await finalizeRunnerSession({
        runId,
        seed: runSeedRef.current,
        runnerId: capability.runnerId,
        questionIds: reviewItems.map((item) => item.taskId),
        rewardPolicyVersion: contract.rewardPolicyVersion,
        generatorVersion: capability.generatorVersion,
        runnerVersion: capability.runnerVersion,
        rotationVersion: capability.rotationVersion,
        learner: 'kirsi',
        subject: 'lugemine',
        topic: 'pilt-ja-sona',
        category: 'Lugemine - pilt ja sõna',
        difficulty: 'Sprint',
        exerciseId: 'kirsi.reading.pilt-ja-sona',
        catalogueVersion: contract.catalogueVersion,
        startedAt: startedAtRef.current,
        questionCount: score + 1,
        score,
        elapsedSeconds,
        questions: reviewItems
      });
      setReward((outcome.reward as SprintReward) ?? null);
    })().catch((error) => {
      savedHistoryRef.current = false;
      setStorageError(runnerStorageFailure(error).message);
    });
  }, [best, elapsedSeconds, ended, exerciseActive, reviewItems, runId, score]);

  const startGame = async () => {
    if (exerciseActive !== true || storageError) return;
    if (ended) {
      window.location.assign('/kirsi/lugemine/pilt-ja-sona');
      return;
    }
    const id = ensureRunIdInCurrentUrl();
    const nextSeed = Date.now();
    const startedAt = new Date().toISOString();
    const initialBoardState: PictureWordSprintBoardState = { boardKey: '', selectedPictureId: null, selectedWordId: null, completedIds: [] };
    try {
      const contract = await getCatalogueContract('kirsi');
      const capability = getOfflineRunnerCapability('kirsi-picture-word');
      if (!contract || !capability) throw new Error('Ühenda seade internetiga, et harjutus ette valmistada.');
      await createRunnerSession<KirsiReadingPair, ReviewItem, PictureWordRunnerState, null>({
        runId: id,
        learner: 'kirsi',
        runnerId: capability.runnerId,
        exerciseId: 'kirsi.reading.pilt-ja-sona',
        subject: 'lugemine',
        topic: 'pilt-ja-sona',
        category: 'Lugemine - pilt ja sõna',
        seed: nextSeed,
        questions: [...KIRSI_READING_PAIRS],
        answers: [],
        currentPhase: 'matching',
        runnerState: { started: true, score: 0, streak: 0, boardIndex: 0, ended: false, wrongMatch: null, reviewItems: [], showStopConfirm: false, boardState: initialBoardState },
        catalogueVersion: contract.catalogueVersion,
        rewardPolicyVersion: contract.rewardPolicyVersion,
        generatorVersion: capability.generatorVersion,
        runnerVersion: capability.runnerVersion,
        rotationVersion: capability.rotationVersion,
        startedAt
      });
      setRunId(id);
      contractRef.current = contract;
      setPairPool([...KIRSI_READING_PAIRS]);
      runSeedRef.current = nextSeed;
      startedAtRef.current = startedAt;
      endedRef.current = false;
      savedHistoryRef.current = false;
      setStarted(true);
      setEnded(false);
      setScore(0);
      setStreak(0);
      setBoardIndex(0);
      setElapsedSeconds(0);
      setWrongMatch(null);
      setReward(null);
      setReviewItems([]);
      setShowStopConfirm(false);
      setBoardState(initialBoardState);
    } catch (error) {
      setStorageError(runnerStorageFailure(error).message);
    }
  };

  const recordPair = (ok: boolean, picture: KirsiReadingPair, selected: KirsiReadingPair) => {
    if (endedRef.current || storageError) return;

    const item: ReviewItem = {
        taskId: `${runId ?? 'run'}:${boardIndex}:${reviewItems.length}:${picture.id}`,
        id: `${runId ?? 'run'}:${boardIndex}:${reviewItems.length}:${picture.id}`,
      question: buildKirsiPictureWordQuestion(picture),
      userAnswer: selected.word,
      correctAnswer: 0,
      isCorrect: ok,
      kind: 'choice',
      image: picture.image,
      selectedWord: selected.word,
        correctWord: picture.word,
        vocabularyId: picture.id
    };
    setReviewItems((prev) => [...prev, item]);

    if (ok) {
      setScore((value) => value + 1);
      setStreak((value) => value + 1);
      return;
    }

    endedRef.current = true;
    setWrongMatch({ picture, selected });
    setEnded(true);
  };

  if (storageError) {
    return (
      <main className='container english-page reading-page'>
        <section className='practice-shell english-shell reading-intro-shell' role='alert'>
          <h1>Harjutus on peatatud</h1>
          <p>{storageError}</p>
          <button type='button' className='start-button' onClick={() => window.location.reload()}>Proovi salvestust uuesti</button>
          <Link className='practice-back-button' href='/kirsi'>Tagasi harjutuste juurde</Link>
        </section>
      </main>
    );
  }

  if (exerciseActive === null || !sessionReady) {
    return <main className='container english-page reading-page'><section className='practice-shell english-shell reading-intro-shell'>Laadin harjutust...</section></main>;
  }

  if (!exerciseActive) {
    return (
      <main className='container english-page reading-page'>
        <section className='practice-shell english-shell reading-intro-shell'>
          <Link className='practice-back-button' href='/kirsi'>&larr; Harjutused</Link>
          <header className='subject-header'>
            <div className='subject-emoji'>ABC</div>
            <h1>Harjutus ei ole praegu saadaval</h1>
          </header>
        </section>
      </main>
    );
  }

  if (!started) {
    return (
      <main className='container english-page reading-page'>
        <section className='practice-shell english-shell reading-intro-shell'>
          <Link className='practice-back-button' href='/kirsi'>← Harjutused</Link>
          <header className='subject-header'>
            <div className='subject-emoji'>🖼️</div>
            <h1>Pilt ja sõna</h1>
          </header>
          <p className='reading-intro-text'>Ühenda pilt õige sõnaga.</p>
          <button type='button' className='start-button' onClick={startGame}>Alusta</button>
        </section>
      </main>
    );
  }

  if (ended) {
    return (
      <main className='english-page sprint-result-page reading-page'>
        {beatRecord ? <PointsConfetti /> : null}
        <section className='sprint-result-panel'>
          <header className='sprint-result-header'>
            <div className='sprint-result-emoji' aria-hidden>🖼️</div>
            <h1 className='sprint-result-title'>Tulemus</h1>
            {beatRecord ? <p className='sprint-record-badge' role='status'><span aria-hidden>🏆</span> Uus rekord!</p> : null}
            <p className='sprint-result-subtitle'>Vaata õiget paari ja proovi soovi korral uuesti.</p>
          </header>
          <div className='sprint-result-stats-grid'>
            <article className='sprint-result-stat-card'>
              <p className='sprint-result-stat-label'>Skoor</p>
              <p className='sprint-result-stat-value'>{score}</p>
            </article>
            <article className='sprint-result-stat-card'>
              <p className='sprint-result-stat-label'>Jada</p>
              <p className='sprint-result-stat-value'>{streak}</p>
            </article>
            <article className='sprint-result-stat-card'>
              <p className='sprint-result-stat-label'>Aeg</p>
              <p className='sprint-result-stat-value'>{formatElapsed(elapsedSeconds)}</p>
            </article>
          </div>
          {wrongMatch ? (
            <section className='reading-correction-card'>
              <div className='reading-correction-picture' aria-label='Valitud pilt'>{wrongMatch.picture.image}</div>
              <p>Sinu valik: <strong>{wrongMatch.selected.word}</strong></p>
              <p>Õige vastus: <strong>{wrongMatch.picture.word}</strong></p>
            </section>
          ) : null}
          {reward ? (
            <section className='reading-correction-card sprint-reward-card'>
              <p>Teenitud: <strong>+{formatStars(reward.awardedAmount)} ⭐</strong></p>
              <p>Tähed kokku: <strong>{formatStars(reward.balanceAfter)} ⭐</strong></p>
              {reward.capReached && reward.awardedAmount === 0 ? <p>Tänane õppimise punktipiir on täis.</p> : null}
            </section>
          ) : null}
          <div className='sprint-result-actions'>
            <button className='sprint-primary-button' onClick={startGame}>▶ Proovi uuesti</button>
            <Link className='sprint-secondary-button' href='/kirsi'>← Harjutused</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className='container english-page reading-page'>
      <section className='practice-shell english-shell'>
        <Link className='practice-back-button' href='/kirsi'>← Katkesta</Link>
        <div className='matching-hud'>
          <strong>Pilt ja sõna</strong>
          <span>Skoor: {score}</span>
          <span>Jada: {streak}</span>
          <span>Aeg: {formatElapsed(elapsedSeconds)}</span>
          <span>Parim: {Math.max(best, score)}</span>
        </div>
        <PictureWordSprintBoard
          pairs={boardPairs}
          layoutSeed={runSeedRef.current + boardIndex}
          state={boardState}
          onStateChange={setBoardState}
          onPair={recordPair}
          onBoardComplete={() => {
            if (endedRef.current) return;
            setBoardIndex((value) => value + 1);
          }}
        />
        <footer className='test-actions-panel'>
          {showStopConfirm ? (
            <div className='stop-confirm-panel' role='alertdialog' aria-labelledby='picture-word-stop-title'>
              <p id='picture-word-stop-title'>Kas soovid harjutuse lõpetada?</p>
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
