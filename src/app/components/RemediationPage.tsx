'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import AnalogClockVisual from '@/app/components/AnalogClockVisual';
import { formatStars } from '@/lib/formatStars';

type Learner = 'kiur' | 'kirsi';
type RendererType = 'math_numeric' | 'math_multiple_choice' | 'counting_choice' | 'initial_sound' | 'word_choice' | 'word_picture_choice' | 'sprint_word_choice';

type RemediationQuestion = {
  sessionItemId: number;
  mistakeId: number;
  rendererType: RendererType;
  promptText: string;
  promptImage?: string;
  promptEmoji?: string;
  objectLabel?: string;
  count?: number;
  targetWord?: string;
  readingText?: string;
  correctAnswerLabel: string;
  expectedUnit?: string;
  clockHour?: number;
  clockMinutes?: 0 | 15 | 30 | 45;
  choices?: string[];
};

type Answer = {
  sessionItemId: number;
  answer: string;
  isCorrect: boolean;
};

type SubmitResult = {
  historyAttemptId: number;
  score: number;
  questionCount: number;
  resolvedCount: number;
  reward: {
    awardedAmount: number;
    balanceAfter: number;
    capReached: boolean;
  } | null;
};

function normalize(value: string) {
  return value.trim().toLowerCase().replace(',', '.');
}

function isCorrect(answer: string, correct: string) {
  return normalize(answer) === normalize(correct);
}

function feedbackText(question: RemediationQuestion) {
  if (question.rendererType === 'initial_sound' && question.targetWord) {
    return `${question.targetWord} algab häälikuga ${question.correctAnswerLabel}.`;
  }
  if (question.rendererType === 'math_numeric') return `Õige vastus on ${question.correctAnswerLabel}.`;
  return `Õige vastus on: ${question.correctAnswerLabel}.`;
}

function promptEyebrow(question: RemediationQuestion) {
  if (question.rendererType === 'initial_sound') return 'Mis häälikuga algab sõna?';
  if (question.rendererType === 'word_picture_choice') return 'Vali õige sõna';
  return 'Vasta küsimusele';
}

function feedbackHeading(question: RemediationQuestion, correct: boolean) {
  if (correct) return 'Õige!';
  if (question.rendererType === 'initial_sound') return `Õige vastus on ${question.correctAnswerLabel}.`;
  return feedbackText(question);
}

function CountingReviewGrid({ question }: { question: RemediationQuestion }) {
  if (question.rendererType !== 'counting_choice' || !question.promptEmoji || !question.count) return null;
  return (
    <div className='counting-object-grid' aria-label={`${question.count} ${question.objectLabel ?? 'asja'}`}>
      {Array.from({ length: question.count }, (_, index) => <span key={index}>{question.promptEmoji}</span>)}
    </div>
  );
}

function ClockReviewVisual({ question }: { question: RemediationQuestion }) {
  if (question.clockHour == null || question.clockMinutes == null) return null;
  return (
    <div className='clock-question-visual'>
      <AnalogClockVisual hour={question.clockHour} minutes={question.clockMinutes} />
    </div>
  );
}

export default function RemediationPage({ learner }: { learner: Learner }) {
  const backHref = learner === 'kiur' ? '/kiur' : '/kirsi';
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<RemediationQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const startedAtRef = useRef(Date.now());

  useEffect(() => {
    startedAtRef.current = Date.now();
    void fetch('/api/remediation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ learner })
    })
      .then((response) => response.ok ? response.json() : response.json().then((body) => Promise.reject(body)))
      .then((body: { sessionId: number; questions: RemediationQuestion[] }) => {
        setSessionId(body.sessionId);
        setQuestions(body.questions);
      })
      .catch((body) => {
        // Remediation builds a live server session from the current mistake pool,
        // so it needs internet. Offline, degrade with a friendly message rather
        // than a broken screen.
        const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
        setError(offline ? 'See harjutus vajab internetiühendust.' : (body?.message || 'Kordamine ei ole praegu saadaval.'));
      });
  }, [learner]);

  const current = questions[index];
  const currentAnswer = answers.find((answer) => answer.sessionItemId === current?.sessionItemId);
  const answered = Boolean(currentAnswer);
  const currentIsCorrect = Boolean(currentAnswer?.isCorrect);

  const chooseAnswer = (answer: string) => {
    if (!current || answered) return;
    const correct = isCorrect(answer, current.correctAnswerLabel);
    setSelectedAnswer(answer);
    setAnswers((prev) => [...prev, { sessionItemId: current.sessionItemId, answer, isCorrect: correct }]);
    setShowFeedback(true);
  };

  const next = async () => {
    if (!current || !answered) return;
    if (index < questions.length - 1) {
      setIndex((value) => value + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setHintVisible(false);
      return;
    }

    if (!sessionId || isSubmitting) return;
    setIsSubmitting(true);
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
    try {
      const response = await fetch(`/api/remediation/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learner, answers: answers.map(({ sessionItemId, answer }) => ({ sessionItemId, answer })), elapsedSeconds })
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || 'Kordamist ei saanud salvestada.');
      setResult(body as SubmitResult);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Kordamist ei saanud salvestada.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <main className='container subject-flow-page'>
        <section className='practice-shell remediation-shell'>
          <Link className='practice-back-button' href={backHref}>Tagasi</Link>
          <h1>Kordamine</h1>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  if (result) {
    const belowThreshold = result.score / result.questionCount < 0.5;
    return (
      <main className='result-page'>
        <section className='result-shell'>
          <section className='result-summary-card'>
            <h1>Kordamine</h1>
            <p className='result-score'>Tulemus: {result.score}/{result.questionCount}</p>
            <div className='result-meta-grid'>
              <span>Teenitud: +{formatStars(result.reward?.awardedAmount ?? 0)} ⭐</span>
              {result.reward ? <span>Tähed kokku: {formatStars(result.reward.balanceAfter)} ⭐</span> : null}
              <span>Parandatud: {result.resolvedCount}</span>
              {belowThreshold ? <span>Kordamine annab tähti alates 50% tulemusest.</span> : null}
              {result.reward?.capReached && result.reward.awardedAmount === 0 ? <span>Tänane õppimise punktipiir on täis.</span> : null}
              {result.reward?.capReached && result.reward.awardedAmount === 0 ? <span>Harjutus salvestati.</span> : null}
            </div>
          </section>
          <section className='result-list'>
            {questions.map((question, i) => {
              const answer = answers.find((item) => item.sessionItemId === question.sessionItemId);
              return (
                <article key={question.sessionItemId} className={answer?.isCorrect ? 'result-review-card correct' : 'result-review-card wrong'}>
                  <p className='result-question'>{i + 1}. {question.promptText || promptEyebrow(question)}</p>
                  {question.promptImage ? <div className='remediation-prompt-image'>{question.promptImage}</div> : null}
                  <CountingReviewGrid question={question} />
                  <ClockReviewVisual question={question} />
                  <div className='answer-review-grid'>
                    <p className='answer-line'><span>Sinu vastus:</span> <strong>{answer?.answer || '—'}</strong></p>
                    <p className='answer-line'><span>Õige vastus:</span> <strong>{question.correctAnswerLabel}</strong></p>
                  </div>
                  <p className={answer?.isCorrect ? 'result-status correct' : 'result-status wrong'}>{answer?.isCorrect ? 'Õige' : 'Vale vastus'}</p>
                </article>
              );
            })}
          </section>
          <div className='result-actions'>
            <Link className='btn' href={`/history/${result.historyAttemptId}`}>Ajalugu</Link>
            <Link className='btn chip active' href={backHref}>Tagasi</Link>
          </div>
        </section>
      </main>
    );
  }

  if (!current) {
    return <main className='container subject-flow-page'><section className='practice-shell remediation-shell'>Laadin kordamist...</section></main>;
  }

  return (
    <main className='container subject-flow-page'>
      <section className='practice-shell remediation-shell'>
        <Link className='practice-back-button' href={backHref}>Tagasi</Link>
        <header className='test-header'>
          <div className='test-meta'>
            <span aria-hidden>↻</span>
            <div>
              <p>Kordamine</p>
              <strong>{index + 1} / {questions.length}</strong>
            </div>
          </div>
        </header>

        <section className='question-card remediation-question-card'>
          <p className='question-eyebrow'>{promptEyebrow(current)}</p>
          {current.readingText ? <p className='remediation-reading-text'>{current.readingText}</p> : null}
          {current.promptImage ? <div className='remediation-prompt-image' aria-label='Pilt'>{current.promptImage}</div> : null}
          <CountingReviewGrid question={current} />
          {current.rendererType !== 'initial_sound' && current.rendererType !== 'word_picture_choice' ? <h1 className='question-text'>{current.promptText}</h1> : null}
          <ClockReviewVisual question={current} />
          {current.rendererType === 'initial_sound' && current.targetWord ? (
            <div className='first-sound-hint-row'>
              {hintVisible || answered ? <strong className='first-sound-word'>Vihje: {current.targetWord}</strong> : <button type='button' className='settings-toggle' onClick={() => setHintVisible(true)}>Näita vihjet</button>}
            </div>
          ) : null}

          {current.rendererType === 'math_numeric' ? (
            <div className='answer-input-row'>
              <input
                className='answer-input'
                inputMode='decimal'
                value={selectedAnswer}
                disabled={answered}
                onChange={(event) => setSelectedAnswer(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && selectedAnswer.trim()) {
                    event.preventDefault();
                    chooseAnswer(selectedAnswer);
                  }
                }}
                placeholder='Sisesta vastus'
              />
              {current.expectedUnit ? <strong className='answer-unit-pill'>{current.expectedUnit}</strong> : null}
              <button type='button' className='start-button' disabled={!selectedAnswer.trim() || answered} onClick={() => chooseAnswer(selectedAnswer)}>Vasta</button>
            </div>
          ) : (
            <div className={current.rendererType === 'initial_sound' ? 'first-sound-options' : 'choice-answer-grid'}>
              {(current.choices ?? []).map((choice) => (
                <button
                  key={choice}
                  type='button'
                  disabled={answered}
                  className={current.rendererType === 'initial_sound' ? 'first-sound-option' : 'choice-answer-button'}
                  onClick={() => chooseAnswer(choice)}
                >
                  {choice}
                </button>
              ))}
            </div>
          )}

          {showFeedback ? (
            <div className={`first-sound-feedback ${currentIsCorrect ? 'correct' : 'wrong'}`}>
              <strong>{feedbackHeading(current, currentIsCorrect)}</strong>
              {!currentIsCorrect && current.rendererType === 'initial_sound' ? <span>{feedbackText(current)}</span> : null}
            </div>
          ) : null}
        </section>

        <footer className='test-actions-panel'>
          <button type='button' className='next-button' disabled={!answered || isSubmitting} onClick={next}>
            {isSubmitting ? 'Salvestan...' : index === questions.length - 1 ? 'Lõpeta' : 'Järgmine'}
          </button>
          <Link className='stop-button' href={backHref}>Lõpeta</Link>
        </footer>
      </section>
    </main>
  );
}
