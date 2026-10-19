'use client';

import { useCallback, useMemo, useState } from 'react';
import { findCountry, nameOf, quizCapital } from '@/content/kaardimang/catalog';
import type { MapViewData } from '@/content/kaardimang/types';
import type { AnswerFeedback, RoundView } from '@/lib/kaardimang/api';
import MapView, { type MapLabel, type MapPick, type MapPin } from './MapView';
import { answerIdFor, playAreaPaint, playPaint, scoreLine } from './mapAnswers';
import { newActionId, type createKaardimangClient } from './kaardimangClient';

type Props = {
  client: ReturnType<typeof createKaardimangClient>;
  map: MapViewData;
  initialRound: RoundView;
  title: string;
  onPlayAgain: () => void;
  onLeave: () => void;
};

// Mängi: one question at a time over a map that never moves. The server
// grades; this screen only shows the question, sends the tap or button, and
// keeps a resolved question on screen until the child presses "Järgmine".
export default function PlayMode({ client, map, initialRound, title, onPlayAgain, onLeave }: Props) {
  const [round, setRound] = useState(initialRound);
  const [shown, setShown] = useState(Math.min(initialRound.cursor, initialRound.questions.length - 1));
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(initialRound.status === 'completed');

  const question = round.questions[shown];
  const resolved = Boolean(question?.state.resolved);
  const finished = showSummary && Boolean(round.summary);

  const send = useCallback(async (answerId: string) => {
    if (busy || resolved || round.status !== 'active') return;
    setBusy(true);
    setError(null);
    const result = await client.answer(round.roundId, { actionId: newActionId(), revision: round.revision, questionIndex: shown, answerId });
    setBusy(false);
    if (result.ok) {
      setRound(result.data.round);
      setFeedback(result.data.feedback);
      return;
    }
    if (result.error.round) {
      // Another tab moved on: show the newest state of the same round.
      setRound(result.error.round);
      setShown(Math.min(result.error.round.cursor, result.error.round.questions.length - 1));
      setFeedback(null);
    }
    setError(result.error.message);
  }, [busy, resolved, round, shown, client]);

  const onPick = useCallback((pick: MapPick) => {
    if (!question || question.answering !== 'map') return;
    void send(answerIdFor(question, pick));
  }, [question, send]);

  const next = () => {
    setFeedback(null);
    setError(null);
    if (shown >= round.questions.length - 1) setShowSummary(true);
    else setShown(shown + 1);
  };

  const paint = useCallback((feature: { id: string; wp?: string | null; ct?: string | null }) => (question ? playPaint(question, feature) : null), [question]);
  const areaPaint = useCallback((id: string) => (question ? playAreaPaint(question, id) : null), [question]);

  // Nothing on the map names the answer before it is resolved. Afterwards the
  // right place is labelled, and a country's capital is pinned.
  const { labels, pins } = useMemo(() => {
    const labels: MapLabel[] = [];
    const pins: MapPin[] = [];
    if (!question) return { labels, pins };
    if (question.correctId && question.targetId && (question.targetType === 'country' || question.targetType === 'capital')) {
      const countryId = question.targetId;
      const at = map.labels[countryId] ?? (() => {
        const marker = map.markers.find((item) => item.id === countryId);
        return marker ? [marker.x, marker.y, 0] as [number, number, number] : null;
      })();
      if (at) labels.push({ id: countryId, text: nameOf(countryId), x: at[0], y: at[1], room: at[2], strong: true });
      const country = findCountry(countryId);
      const capital = country ? quizCapital(country) : null;
      const pin = capital ? map.capitals.find((item) => item.id === capital.id) : null;
      if (pin && capital) {
        pins.push({ id: pin.id, x: pin.x, y: pin.y, tone: 'answer' });
        labels.push({ id: `cap-${pin.id}`, text: capital.nameEt, x: pin.x, y: pin.y - 14 * (map.width / 1000), room: 999, strong: true });
      }
    }
    for (const wrong of question.state.wrongIds) {
      const at = map.labels[wrong];
      if (at && question.targetType !== 'continent' && question.targetType !== 'worldPart') labels.push({ id: `wrong-${wrong}`, text: nameOf(wrong), x: at[0], y: at[1], room: at[2] });
    }
    return { labels, pins };
  }, [question, map]);

  if (!question) return null;

  const summary = round.summary;
  const options = question.options?.filter((option) => !question.state.removedOptionIds.includes(option.id) || option.id === question.correctId) ?? [];
  const tone = feedback?.questionIndex === shown ? feedback.outcome : null;
  const message = feedback?.questionIndex === shown ? feedback.messageEt : question.state.attempts > 0 && !resolved ? `Proovi veel. ${question.hintEt ?? ''}`.trim() : '';

  return (
    <section className='km-play' aria-label={`${title}: mäng`}>
      {finished && summary ? (
        <div className='km-card km-summary' role='status'>
          <h2>Voor läbi!</h2>
          <p className='km-summary-score'>{scoreLine(summary.correct, summary.total)}</p>
          {summary.firstTryCorrect < summary.correct ? <p className='tb-muted'>Esimese korraga õigesti: {summary.firstTryCorrect}</p> : null}
          {summary.practicedOf > 0 && round.setId !== 'continents' && round.setId !== 'worldParts' && round.setId !== 'oceans' ? (
            <p>Harjutatud riike {summary.practiced} / {summary.practicedOf}</p>
          ) : null}
          {summary.reviewNames.length ? <p>Järgmine kord võiksid üle vaadata: {summary.reviewNames.join(', ')}</p> : <p>Kõik läks esimese korraga – tubli!</p>}
          <div className='tb-actions'>
            <button type='button' className='tb-button tb-button-primary' onClick={onPlayAgain}>▶ Mängi uuesti</button>
            <button type='button' className='tb-button' onClick={onLeave}>Vali teine kaart</button>
          </div>
        </div>
      ) : (
        <div className='km-card km-question'>
          <div className='km-question-head'>
            <h2 className='km-prompt'>{question.prompt}</h2>
            <p className='km-progress' aria-label={`Küsimus ${shown + 1} / ${round.questions.length}`}>{shown + 1} / {round.questions.length}</p>
          </div>
          {question.answering === 'buttons' ? (
            <div className='km-options'>
              {options.map((option) => {
                const state = question.correctId === option.id ? 'correct' : question.state.wrongIds.includes(option.id) ? 'wrong' : undefined;
                return (
                  <button
                    key={option.id}
                    type='button'
                    className='km-option'
                    data-state={state}
                    disabled={busy || resolved || question.state.removedOptionIds.includes(option.id)}
                    onClick={() => void send(option.id)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}
          {/* Empty until there is something to say: the prompt already says what to do. */}
          <p className='km-feedback' role='status' aria-live='polite' data-tone={tone ?? undefined} data-empty={message ? undefined : 'true'}>
            {message ? `${tone === 'correct' ? '✓ ' : tone === 'revealed' ? '→ ' : ''}${message}` : null}
          </p>
          {error ? <p className='km-error' role='alert'>{error}</p> : null}
          {resolved ? (
            <div className='tb-actions'>
              <button type='button' className='tb-button tb-button-primary' onClick={next} autoFocus>
                {shown >= round.questions.length - 1 ? 'Vaata tulemust' : 'Järgmine'}
              </button>
            </div>
          ) : null}
        </div>
      )}
      <MapView
        data={map}
        ariaLabel={`${title} – kaart`}
        paint={paint}
        areaPaint={areaPaint}
        showAreas={question.targetType === 'ocean'}
        uniform={map.id === 'antarctica' || (map.id === 'world' && round.setId !== 'largest')}
        labels={labels}
        pins={pins}
        focusable={(id) => !finished && question.answering === 'map' && (map.features.some((feature) => feature.id === id && (feature.role === 't' || question.targetType !== 'country')) || map.markers.some((marker) => marker.id === id))}
        nameOf={nameOf}
        onPick={!finished && question.answering === 'map' && !resolved && !busy ? onPick : null}
      />
    </section>
  );
}
