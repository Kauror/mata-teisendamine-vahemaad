'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import AnalogClockVisual from '@/app/components/AnalogClockVisual';
import PointsConfetti from '@/app/components/PointsConfetti';
import { NamedShapeVisual } from '@/app/components/visuals/CircleVisual';
import { SCIENCE_EYEBROW, ScienceDataPanel } from '@/app/components/science/ScienceTaskPresentation';
import { formatStars } from '@/lib/formatStars';
// Imported, not redeclared: a local copy of this contract is how the screen
// silently falls behind the renderer types the server actually emits.
import {
  isRemediationAnswerCorrect,
  isTypedAnswerRenderer,
  ORDERING_SEPARATOR,
  type RemediationQuestion
} from '@/lib/shared/remediationQuestion';

type Learner = 'kiur' | 'kirsi';

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

function feedbackText(question: RemediationQuestion) {
  if (question.rendererType === 'initial_sound' && question.targetWord) {
    return `${question.targetWord} algab häälikuga ${question.correctAnswerLabel}.`;
  }
  if (isTypedAnswerRenderer(question.rendererType)) return `Õige vastus on ${question.correctAnswerLabel}.`;
  return `Õige vastus on: ${question.correctAnswerLabel}.`;
}

function promptEyebrow(question: RemediationQuestion) {
  if (question.rendererType === 'initial_sound') return 'Mis häälikuga algab sõna?';
  if (question.rendererType === 'word_picture_choice') return 'Vali õige sõna';
  // The same wording the science runner uses, so the task reads the same here.
  if (question.scienceTaskType) return SCIENCE_EYEBROW[question.scienceTaskType];
  return 'Vasta küsimusele';
}

// Same tap-to-add / move / remove control the runner uses for ordering, down to
// the class names, so the child arranges the cards the same way in both places.
function OrderingAnswerPanel({
  question,
  order,
  disabled,
  onChange,
  onSubmit
}: {
  question: RemediationQuestion;
  order: string[];
  disabled: boolean;
  onChange: (next: string[]) => void;
  onSubmit: () => void;
}) {
  const cards = question.orderingCards ?? [];
  const chosen = new Set(order);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return;
    const next = [...order];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };

  return (
    <div className='ordering-panel'>
      <p>Sinu järjestus</p>
      <div className='row ordering-available'>
        {cards.filter((card) => !chosen.has(card.id)).map((card) => (
          <button type='button' key={card.id} className='chip' disabled={disabled} onClick={() => onChange([...order, card.id])}>
            {card.label}
          </button>
        ))}
      </div>
      <div className='ordering-list'>
        {order.map((id, position) => {
          const card = cards.find((item) => item.id === id);
          if (!card) return null;
          return (
            <div key={id} className='ordering-item'>
              <strong>{position + 1}. {card.label}</strong>
              <div className='row'>
                <button type='button' className='chip ordering-move-button' aria-label='Liiguta üles' disabled={disabled} onClick={() => move(position, position - 1)}>↑</button>
                <button type='button' className='chip ordering-move-button' aria-label='Liiguta alla' disabled={disabled} onClick={() => move(position, position + 1)}>↓</button>
                <button type='button' className='chip danger' disabled={disabled} onClick={() => onChange(order.filter((item) => item !== id))}>Eemalda</button>
              </div>
            </div>
          );
        })}
      </div>
      <button type='button' className='start-button' disabled={disabled || order.length !== cards.length} onClick={onSubmit}>Vasta</button>
    </div>
  );
}

function ScienceReviewMaterial({ question }: { question: RemediationQuestion }) {
  if (question.rendererType !== 'science_choice') return null;
  return (
    <>
      {question.scienceTitle ? <h2 className='science-title'>{question.scienceTitle}</h2> : null}
      {question.scienceDiagram ? <div className='science-diagram'>{question.scienceDiagram}</div> : null}
      {question.scienceData ? <ScienceDataPanel data={question.scienceData} /> : null}
    </>
  );
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

function ShapeReviewVisual({ question }: { question: RemediationQuestion }) {
  if (!question.promptVisual) return null;
  return (
    <div className='remediation-shape-visual'>
      <NamedShapeVisual visual={question.promptVisual} knownDegrees={question.promptVisualKnownDegrees} />
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
  const [orderingOrder, setOrderingOrder] = useState<string[]>([]);
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
    const correct = isRemediationAnswerCorrect(current, answer);
    setSelectedAnswer(answer);
    setAnswers((prev) => [...prev, { sessionItemId: current.sessionItemId, answer, isCorrect: correct }]);
    setShowFeedback(true);
  };

  // The cards are answered as the sequence of their labels, joined the same way
  // the runner joins them, so the two produce the same answer string.
  const submitOrdering = () => {
    if (!current) return;
    const labels = orderingOrder.map((id) => current.orderingCards?.find((card) => card.id === id)?.label ?? '');
    chooseAnswer(labels.join(ORDERING_SEPARATOR));
  };

  const next = async () => {
    if (!current || !answered) return;
    if (index < questions.length - 1) {
      setIndex((value) => value + 1);
      setSelectedAnswer('');
      setOrderingOrder([]);
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
    const isPerfect = result.questionCount > 0 && result.score === result.questionCount;
    return (
      <main className='result-page'>
        {isPerfect ? <PointsConfetti /> : null}
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
                  {question.readingText ? <p className='remediation-reading-text'>{question.readingText}</p> : null}
                  <ScienceReviewMaterial question={question} />
                  <CountingReviewGrid question={question} />
                  <ClockReviewVisual question={question} />
                  <ShapeReviewVisual question={question} />
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
          <ScienceReviewMaterial question={current} />
          {current.readingText ? <p className='remediation-reading-text'>{current.readingText}</p> : null}
          {current.promptImage ? <div className='remediation-prompt-image' aria-label='Pilt'>{current.promptImage}</div> : null}
          <CountingReviewGrid question={current} />
          {current.rendererType !== 'initial_sound' && current.rendererType !== 'word_picture_choice' ? <h1 className='question-text'>{current.promptText}</h1> : null}
          <ClockReviewVisual question={current} />
          <ShapeReviewVisual question={current} />
          {current.rendererType === 'initial_sound' && current.targetWord ? (
            <div className='first-sound-hint-row'>
              {hintVisible || answered ? <strong className='first-sound-word'>Vihje: {current.targetWord}</strong> : <button type='button' className='settings-toggle' onClick={() => setHintVisible(true)}>Näita vihjet</button>}
            </div>
          ) : null}

          {current.rendererType === 'ordering_sequence' ? (
            <OrderingAnswerPanel
              question={current}
              order={orderingOrder}
              disabled={answered}
              onChange={setOrderingOrder}
              onSubmit={submitOrdering}
            />
          ) : isTypedAnswerRenderer(current.rendererType) ? (
            <div className='answer-input-row'>
              <input
                className='answer-input'
                // A text problem's answer can be words or a time, not just a
                // number, so it must not get the decimal keypad.
                inputMode={current.rendererType === 'math_numeric' ? 'decimal' : 'text'}
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
