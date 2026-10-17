'use client';

import type { ClientQuestion, ObjectiveRef } from '@/lib/textbook/api';
import type { AnswerResponse } from '@/lib/textbook/types';
import { DiagramView } from '@/app/components/textbook/diagrams';
import { describeResponse } from '@/app/components/textbook/responses';

// What the child sees after answering in practice (and in the test review
// after submitting): right or wrong, their answer, the correct one, a short
// "why", and a misconception note when the mistake is a known one.
export function AnswerFeedback({ question, response, correct, correctResponse, explanation, misconception, objective, correctionScheduled, compact = false }: {
  question: ClientQuestion;
  response: AnswerResponse | null;
  correct: boolean;
  correctResponse: AnswerResponse;
  explanation: string;
  misconception?: string | null;
  objective?: ObjectiveRef;
  correctionScheduled?: boolean;
  compact?: boolean;
}) {
  const view = question.answer;
  const correctLines = describeResponse(view, correctResponse);
  const ownLines = describeResponse(view, response);
  return (
    <div className='tb-feedback' data-correct={correct ? 'true' : 'false'} role={compact ? undefined : 'status'}>
      <p className='tb-feedback-title'>{correct ? '✓ Õige!' : '✗ Pole päris õige'}</p>
      {view.type === 'diagram_hotspot' && !compact ? (
        <DiagramView
          diagramId={view.diagramId}
          mode='reveal'
          selectedRegionId={response?.type === 'diagram_hotspot' ? response.regionId : null}
          correctRegionId={correctResponse.type === 'diagram_hotspot' ? correctResponse.regionId : null}
        />
      ) : null}
      {!correct ? (
        <div className='tb-feedback-answer' data-kind='own'>
          <span className='tb-feedback-label'>Sinu vastus:</span>
          <ul>{ownLines.map((line, index) => <li key={index}>{line}</li>)}</ul>
        </div>
      ) : null}
      <div className='tb-feedback-answer' data-kind='correct'>
        <span className='tb-feedback-label'>Õige vastus:</span>
        <ul>{correctLines.map((line, index) => <li key={index}>{line}</li>)}</ul>
      </div>
      <p className='tb-feedback-why'><strong>Miks?</strong> {explanation}</p>
      {!correct && misconception ? <p className='tb-feedback-misconception'><strong>Pane tähele:</strong> {misconception}</p> : null}
      {objective && !compact ? <p className='tb-feedback-objective'>Teema: {objective.description}</p> : null}
      {!correct && correctionScheduled ? <p className='tb-feedback-again'>Selle teema juurde tuleb hiljem veel üks küsimus.</p> : null}
    </div>
  );
}
