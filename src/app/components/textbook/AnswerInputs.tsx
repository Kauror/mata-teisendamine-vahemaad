'use client';

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { ClientAnswerView, ClientQuestion } from '@/lib/textbook/api';
import type { AnswerResponse } from '@/lib/textbook/types';
import { QuestionContextView } from '@/app/components/textbook/ContentBlocks';
import { DiagramView } from '@/app/components/textbook/diagrams';
import {
  ANSWER_HINTS,
  assignGroup,
  dropIndex,
  moveItem,
  moveItemTo,
  nextOpenPrompt,
  pairPrompt,
  toggleOption,
  type AnswerDraft
} from '@/app/components/textbook/responses';

// The six answer controls. Every one works by tapping buttons (ordering can
// also be dragged, but its ▲▼ buttons always work — nothing is drag-only),
// carries stable IDs in data attributes and sends only IDs. `disabled` freezes the control (after "Kontrolli" in practice).

type InputProps<T extends ClientAnswerView['type']> = {
  questionId: string;
  view: Extract<ClientAnswerView, { type: T }>;
  value: AnswerDraft;
  onChange: (next: AnswerResponse) => void;
  disabled: boolean;
};

function SingleChoiceInput({ view, value, onChange, disabled, questionId }: InputProps<'single_choice'>) {
  const selected = value?.type === 'single_choice' ? value.optionId : null;
  return (
    <div className='tb-options' role='group' aria-labelledby={`${questionId}-stem`}>
      {view.options.map((option) => (
        <button
          key={option.id}
          type='button'
          className='tb-option'
          data-option-id={option.id}
          aria-pressed={selected === option.id}
          disabled={disabled}
          onClick={() => onChange({ type: 'single_choice', optionId: option.id })}
        >
          <span className='tb-option-mark' aria-hidden />
          <span>{option.text}</span>
        </button>
      ))}
    </div>
  );
}

function MultipleSelectionInput({ view, value, onChange, disabled, questionId }: InputProps<'multiple_selection'>) {
  const selected = value?.type === 'multiple_selection' ? value.optionIds : [];
  return (
    <div className='tb-options' role='group' aria-labelledby={`${questionId}-stem`}>
      {view.options.map((option) => (
        <button
          key={option.id}
          type='button'
          className='tb-option tb-option-multi'
          data-option-id={option.id}
          aria-pressed={selected.includes(option.id)}
          disabled={disabled}
          onClick={() => onChange(toggleOption(value, option.id))}
        >
          <span className='tb-option-mark' aria-hidden />
          <span>{option.text}</span>
        </button>
      ))}
    </div>
  );
}

// Tap a row, then the choice that belongs to it. The next open row becomes
// active automatically; tapping a pair again undoes it.
function MatchingInput({ view, value, onChange, disabled, questionId }: InputProps<'matching'>) {
  const pairs = value?.type === 'matching' ? value.pairs : {};
  const [active, setActive] = useState<string | null>(() => nextOpenPrompt(view, value));
  const activePrompt = active ?? nextOpenPrompt(view, value);
  const promptNumber = (promptId: string) => view.prompts.findIndex((prompt) => prompt.id === promptId) + 1;
  const usedBy = (choiceId: string) => Object.entries(pairs).find(([, choice]) => choice === choiceId)?.[0] ?? null;

  const choose = (choiceId: string) => {
    const promptId = activePrompt;
    if (!promptId) return;
    const next = pairPrompt(value, promptId, choiceId);
    onChange(next);
    setActive(nextOpenPrompt(view, next, promptId));
  };

  return (
    <div className='tb-matching'>
      <ol className='tb-matching-prompts' aria-label='Paaritavad read'>
        {view.prompts.map((prompt, index) => {
          const choiceId = pairs[prompt.id];
          const choice = view.choices.find((item) => item.id === choiceId);
          return (
            <li key={prompt.id}>
              <button
                type='button'
                className='tb-matching-prompt'
                data-prompt-id={prompt.id}
                aria-pressed={activePrompt === prompt.id}
                aria-describedby={`${questionId}-pair-${prompt.id}`}
                disabled={disabled}
                onClick={() => setActive(prompt.id)}
              >
                <span className='tb-pair-number' aria-hidden>{index + 1}</span>
                <span className='tb-matching-prompt-text'>{prompt.text}</span>
                <span className='tb-matching-paired' id={`${questionId}-pair-${prompt.id}`}>
                  {choice ? <>→ {choice.text}</> : <span className='tb-muted'>vali vaste</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className='tb-matching-help' aria-live='polite'>
        {activePrompt ? <>Vaste reale {promptNumber(activePrompt)}: „{view.prompts.find((prompt) => prompt.id === activePrompt)?.text}“</> : 'Kõik read on paaris. Puuduta rida, kui tahad muuta.'}
      </p>
      <div className='tb-matching-choices' role='group' aria-label='Vasted'>
        {view.choices.map((choice) => {
          const owner = usedBy(choice.id);
          return (
            <button
              key={choice.id}
              type='button'
              className='tb-matching-choice'
              data-choice-id={choice.id}
              data-used={owner ? 'true' : undefined}
              aria-pressed={Boolean(activePrompt && pairs[activePrompt] === choice.id)}
              disabled={disabled}
              onClick={() => choose(choice.id)}
            >
              {owner ? <span className='tb-pair-number' aria-label={`rida ${promptNumber(owner)}`}>{promptNumber(owner)}</span> : null}
              <span>{choice.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Every item lists the groups as buttons: tap the group it belongs to.
function GroupingInput({ view, value, onChange, disabled }: InputProps<'grouping'>) {
  const assignments = value?.type === 'grouping' ? value.assignments : {};
  return (
    <ul className='tb-grouping'>
      {view.items.map((item) => (
        <li key={item.id} className='tb-grouping-item' data-item-id={item.id}>
          <span className='tb-grouping-label' id={`tb-group-item-${item.id}`}>{item.text}</span>
          <span className='tb-grouping-groups' role='group' aria-labelledby={`tb-group-item-${item.id}`}>
            {view.groups.map((group) => (
              <button
                key={group.id}
                type='button'
                className='tb-group-chip'
                data-item-id={item.id}
                data-group-id={group.id}
                aria-pressed={assignments[item.id] === group.id}
                disabled={disabled}
                onClick={() => onChange(assignGroup(value, item.id, group.id))}
              >
                {group.text}
              </button>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}

type OrderingDrag = {
  id: string;
  pointerId: number;
  startY: number;
  dy: number;
  // Measured at pointer-down: the dragged row and the others' midpoints.
  top: number;
  height: number;
  otherMidpoints: number[];
  target: number;
  moved: boolean;
};

// A drag must travel this far before it counts (a tap on the handle is not a drag).
const DRAG_SLOP_PX = 4;

// ▲▼ buttons, or drag a row by its ⠿ handle (pointer events: touch and
// mouse). While dragging, the row is lifted and a line marks where it lands.
// A finished drag counts as acting on the question, like a button move.
function OrderingInput({ view, value, onChange, disabled }: InputProps<'ordering'>) {
  const order = value?.type === 'ordering' ? value.order : view.items.map((item) => item.id);
  const [announcement, setAnnouncement] = useState('');
  const [drag, setDrag] = useState<OrderingDrag | null>(null);
  const dragRef = useRef<OrderingDrag | null>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const textOf = (id: string) => view.items.find((item) => item.id === id)?.text ?? id;
  const commit = (next: string[], id: string) => {
    onChange({ type: 'ordering', order: next });
    setAnnouncement(`„${textOf(id)}“ on nüüd kohal ${next.indexOf(id) + 1}.`);
  };
  const move = (id: string, delta: -1 | 1) => commit(moveItem(order, id, delta), id);

  const update = (next: OrderingDrag | null) => {
    dragRef.current = next;
    setDrag(next);
  };

  const startDrag = (id: string) => (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (disabled || dragRef.current || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const rows = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[data-item-id]') ?? []);
    const own = rows.find((row) => row.dataset.itemId === id);
    if (!own) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = own.getBoundingClientRect();
    const otherMidpoints = rows.filter((row) => row !== own).map((row) => {
      const box = row.getBoundingClientRect();
      return box.top + box.height / 2;
    });
    update({ id, pointerId: event.pointerId, startY: event.clientY, dy: 0, top: rect.top, height: rect.height, otherMidpoints, target: order.indexOf(id), moved: false });
  };

  const moveDrag = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const current = dragRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    event.preventDefault();
    const dy = event.clientY - current.startY;
    const moved = current.moved || Math.abs(dy) > DRAG_SLOP_PX;
    const target = dropIndex(current.otherMidpoints, current.top + current.height / 2 + dy);
    update({ ...current, dy, moved, target });
  };

  const endDrag = (cancelled: boolean) => (event: ReactPointerEvent<HTMLSpanElement>) => {
    const current = dragRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    update(null);
    if (!cancelled && current.moved) commit(moveItemTo(order, current.id, current.target), current.id);
  };

  // The drop marker: a line above or below the row the dragged one lands next to.
  const from = drag ? order.indexOf(drag.id) : -1;
  const dropMarker = (id: string, index: number): 'before' | 'after' | undefined => {
    if (!drag || !drag.moved || drag.id === id || drag.target === from) return undefined;
    if (drag.target < from && index === drag.target) return 'before';
    if (drag.target > from && index === drag.target) return 'after';
    return undefined;
  };

  return (
    <div className='tb-ordering'>
      {view.firstLabel ? <p className='tb-ordering-end'>⬆ {view.firstLabel}</p> : null}
      <ol className='tb-ordering-list' ref={listRef} data-dragging={drag?.moved ? 'true' : undefined}>
        {order.map((id, index) => {
          const lifted = drag?.id === id && drag.moved;
          return (
            <li
              key={id}
              className='tb-ordering-item'
              data-item-id={id}
              data-lifted={lifted ? 'true' : undefined}
              data-drop={dropMarker(id, index)}
              style={lifted ? { transform: `translateY(${drag.dy}px)` } : undefined}
            >
              <span
                className='tb-drag-handle'
                data-drag-handle={id}
                aria-hidden
                data-disabled={disabled ? 'true' : undefined}
                onPointerDown={startDrag(id)}
                onPointerMove={moveDrag}
                onPointerUp={endDrag(false)}
                onPointerCancel={endDrag(true)}
                onLostPointerCapture={endDrag(true)}
              >⠿</span>
              <span className='tb-pair-number' aria-hidden>{index + 1}</span>
              <span className='tb-ordering-text'>{textOf(id)}</span>
              <span className='tb-ordering-moves'>
                <button type='button' className='tb-move' data-move='up' disabled={disabled || index === 0} aria-label={`Tõsta „${textOf(id)}“ üles`} onClick={() => move(id, -1)}>▲</button>
                <button type='button' className='tb-move' data-move='down' disabled={disabled || index === order.length - 1} aria-label={`Tõsta „${textOf(id)}“ alla`} onClick={() => move(id, 1)}>▼</button>
              </span>
            </li>
          );
        })}
      </ol>
      {view.lastLabel ? <p className='tb-ordering-end'>⬇ {view.lastLabel}</p> : null}
      {value?.type !== 'ordering' ? (
        <button type='button' className='tb-button tb-ordering-confirm' disabled={disabled} onClick={() => onChange({ type: 'ordering', order })}>See järjekord sobib</button>
      ) : null}
      <p className='sr-only' aria-live='polite'>{announcement}</p>
    </div>
  );
}

// The diagram with letter markers only (labels hidden), plus the same regions
// as a list of buttons for anyone who cannot or would rather not tap the
// picture.
function DiagramHotspotInput({ view, value, onChange, disabled }: InputProps<'diagram_hotspot'>) {
  const selected = value?.type === 'diagram_hotspot' ? value.regionId : null;
  const pick = (regionId: string) => onChange({ type: 'diagram_hotspot', regionId });
  return (
    <div className='tb-hotspot'>
      <DiagramView diagramId={view.diagramId} mode='hotspot' selectedRegionId={selected} onSelectRegion={pick} disabled={disabled} />
      <div className='tb-hotspot-list' role='group' aria-label='Vali joonisel koht'>
        {view.regions.map((region) => (
          <button
            key={region.id}
            type='button'
            className='tb-hotspot-button'
            data-region-button={region.id}
            aria-pressed={selected === region.id}
            aria-label={`Vali ${region.marker}`}
            disabled={disabled}
            onClick={() => pick(region.id)}
          >
            {region.marker}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AnswerInput({ question, value, onChange, disabled }: { question: ClientQuestion; value: AnswerDraft; onChange: (next: AnswerResponse) => void; disabled: boolean }) {
  const common = { questionId: question.id, value, onChange, disabled };
  const view = question.answer;
  switch (view.type) {
    case 'single_choice':
      return <SingleChoiceInput {...common} view={view} />;
    case 'multiple_selection':
      return <MultipleSelectionInput {...common} view={view} />;
    case 'matching':
      return <MatchingInput {...common} view={view} />;
    case 'grouping':
      return <GroupingInput {...common} view={view} />;
    case 'ordering':
      return <OrderingInput {...common} view={view} />;
    case 'diagram_hotspot':
      return <DiagramHotspotInput {...common} view={view} />;
  }
}

// Stem, context and the answer control. Keyed by question by the caller, so
// local state (the active matching row) never leaks between questions.
export function QuestionCard({ question, value, onChange, disabled, eyebrow }: {
  question: ClientQuestion;
  value: AnswerDraft;
  onChange: (next: AnswerResponse) => void;
  disabled: boolean;
  eyebrow?: string;
}) {
  const hotspotDiagram = question.answer.type === 'diagram_hotspot' ? question.answer.diagramId : undefined;
  return (
    <section className='tb-question' data-question-id={question.id} data-answer-type={question.answer.type} aria-labelledby={`${question.id}-stem`}>
      {eyebrow ? <p className='tb-question-eyebrow'>{eyebrow}</p> : null}
      {question.context ? <QuestionContextView context={question.context} hotspotDiagramId={hotspotDiagram} /> : null}
      <h2 className='tb-question-stem' id={`${question.id}-stem`}>{question.stem}</h2>
      <p className='tb-question-hint'>{ANSWER_HINTS[question.answer.type]}</p>
      <AnswerInput question={question} value={value} onChange={onChange} disabled={disabled} />
    </section>
  );
}
