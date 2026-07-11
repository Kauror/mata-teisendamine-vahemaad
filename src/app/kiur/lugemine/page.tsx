'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { completedTodayFromHistory, ClientCompletionAttempt } from '@/lib/clientExerciseCompletion';
import { shuffle } from '@/lib/englishGame';
import { formatStars } from '@/lib/formatStars';
import { getValidKiurReadingTasks, KiurReadingTask } from '@/lib/kiurReadingTasks';
import { completeAttempt, getCatalogueVersion, isExercisePermittedOffline } from '@/lib/offline/api';

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
  const startedAtRef = useRef(Date.now());
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
    void fetch('/api/history')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((attempts: ClientCompletionAttempt[]) => setDoneToday(completedTodayFromHistory(attempts, 'kiur', 'kiur.reading.loe-ja-vasta', { subject: 'lugemine', topic: 'loe-ja-vasta', category: 'Lugemine - loe ja vasta' })))
      .catch(() => setDoneToday(false));
  }, []);

  useEffect(() => {
    if (phase !== 'result' || saved || runCount === 0) return;
    setSaved(true);
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));

    void (async () => {
      const catalogueVersion = await getCatalogueVersion('kiur').catch(() => null);
      const outcome = await completeAttempt({
        learner: 'kiur',
        subject: 'lugemine',
        topic: 'loe-ja-vasta',
        category: 'Lugemine - loe ja vasta',
        difficulty: 'Loe ja vasta',
        exerciseId: 'kiur.reading.loe-ja-vasta',
        catalogueVersion,
        startedAt: new Date(startedAtRef.current).toISOString(),
        questionCount: runCount,
        score,
        elapsedSeconds,
        questions: reviewItems
      });
      setReward((outcome.reward as Reward) ?? null);
    })();
  }, [phase, reviewItems, runCount, saved, score]);

  const startRun = () => {
    if (!readingActive) return;
    const nextSession = buildSession();
    startedAtRef.current = Date.now();
    setSession(nextSession);
    setIndex(0);
    setScore(0);
    setSelectedAnswer('');
    setReviewItems([]);
    setReward(null);
    setSaved(false);
    setShowStopConfirm(false);
    answerLockedRef.current = false;
    setPhase(nextSession.length ? 'reading' : 'start');
  };

  const chooseAnswer = (answer: string) => {
    if (!current || phase !== 'question' || answerLockedRef.current) return;
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
    if (index + 1 >= runCount) {
      setPhase('result');
      return;
    }
    setIndex((value) => value + 1);
    setSelectedAnswer('');
    answerLockedRef.current = false;
    setPhase('reading');
  };

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
