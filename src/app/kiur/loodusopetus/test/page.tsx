'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatElapsed } from '@/lib/validation';
import { seededRng, shuffleWithRng } from '@/lib/random';
import { isScienceSessionSize, pickScienceSession } from '@/lib/loodusopetus/tasks';
import { isChoiceTask, type ScienceData, type ScienceTaskType } from '@/lib/loodusopetus/types';
import {
  createRunnerSession,
  ensureRunIdInCurrentUrl,
  finalizeRunnerSession,
  getLocalAttempt,
  loadRunnerSession,
  patchRunnerSession,
  runnerStorageFailure
} from '@/lib/offline/api';
import type { RunnerSessionV3 } from '@/lib/offline/records';
import { GENERATOR_VERSION, LEGACY_REWARD_POLICY_VERSION, ROTATION_ALGORITHM_VERSION } from '@/lib/shared/types';

const EYEBROW: Record<ScienceTaskType, string> = {
  visual_choice: 'Vaata skeemi ja vali õige vastus',
  reading_choice: 'Loe tekst ja vali õige vastus',
  sort: 'Pane iga asi õigesse rühma',
  match: 'Ühenda mõiste õige seletusega',
  data_evidence: 'Vaata andmeid ja vali õige järeldus'
};

type SavedScienceQuestion = {
  id: string;
  type: ScienceTaskType;
  title: string;
  prompt: string;
  question: string;
  kind: 'choice';
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
  userAnswer: string;
  correctAnswerText: string;
  selectedChoiceId?: string | null;
  diagram?: string;
  diagramExplanation?: string;
  text?: string;
  data?: ScienceData;
  groups?: string[];
  items?: string[];
  correctGroups?: Record<string, string[]>;
  selectedGroups?: Record<string, string>;
  terms?: string[];
  definitions?: string[];
  correctMatches?: Record<string, string>;
  selectedMatches?: Record<string, string>;
  tags?: string[];
};

type ScienceRunnerState = {
  choiceSel: Record<number, string>;
  sortSel: Record<number, Record<string, string>>;
  matchSel: Record<number, Record<string, string>>;
  checked: Record<number, boolean>;
  showStopConfirm: boolean;
};

type ScienceDisplayOrder = Record<string, {
  choices?: Array<{ id: string; text: string }>;
  definitions?: string[];
  items?: string[];
  groups?: string[];
}>;

type ScienceSession = RunnerSessionV3<ReturnType<typeof pickScienceSession>[number], SavedScienceQuestion, ScienceRunnerState, null>;

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (Math.imul(hash, 31) + value.charCodeAt(i)) >>> 0;
  return hash || 1;
}

// Stable per-task shuffle so the option order does not jump between renders.
function shuffleStable<T>(values: T[], seedKey: string): T[] {
  return shuffleWithRng(seededRng(hashString(seedKey)), [...values]);
}

// Answers in the data are written as full sentences ending with a period; the
// trailing dot is dropped when an answer is shown as a short label.
function cleanAnswer(value: string) {
  return value.replace(/\s*\.\s*$/, '').trim();
}

function correctGroupOfItem(groups: Record<string, string[]>, item: string) {
  for (const [group, items] of Object.entries(groups)) {
    if (items.includes(item)) return group;
  }
  return null;
}

function formatGrouping(groups: string[], itemsFor: (group: string) => string[]) {
  return groups.map((group) => `${group}: ${itemsFor(group).map(cleanAnswer).join(', ') || '—'}`).join(' · ');
}

function formatPairs(terms: string[], definitionFor: (term: string) => string | undefined) {
  return terms.map((term) => `${cleanAnswer(term)} → ${cleanAnswer(definitionFor(term) ?? '') || '—'}`).join(' · ');
}

function ScienceDataPanel({ data }: { data: ScienceData }) {
  return (
    <div className='science-data'>
      {data.diagram ? <div className='science-diagram'>{data.diagram}</div> : null}
      {data.table?.length ? (
        <div className='science-table-wrap'>
          <table className='science-table'>
            <tbody>
              {data.table.map((rawRow, rowIndex) => (
                <tr key={rowIndex}>
                  {rawRow.map((cell, cellIndex) =>
                    rowIndex === 0
                      ? <th key={cellIndex}>{cell}</th>
                      : <td key={cellIndex}>{cell}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {data.cards?.length ? (
        <div className='science-data-cards'>
          {data.cards.map((card, cardIndex) => (
            <div key={cardIndex} className='science-data-card'>
              <strong>{card[0]}</strong>
              <span>{card.slice(1).join(' ')}</span>
            </div>
          ))}
        </div>
      ) : null}
      {data.setup ? <p className='science-info-box'>{data.setup}</p> : null}
      {data.example ? <p className='science-info-box'>{data.example}</p> : null}
    </div>
  );
}

function ScienceTestContent() {
  const params = useSearchParams();
  const router = useRouter();

  const countParam = Number(params.get('count'));
  const count = isScienceSessionSize(countParam) ? countParam : 10;
  const seed = Number(params.get('seed')) || 1;

  const [runId, setRunId] = useState<string | null>(null);
  const [session, setSession] = useState<ReturnType<typeof pickScienceSession>>([]);
  const [displayOrder, setDisplayOrder] = useState<ScienceDisplayOrder>({});

  const [index, setIndex] = useState(0);
  const [choiceSel, setChoiceSel] = useState<Record<number, string>>({});
  const [sortSel, setSortSel] = useState<Record<number, Record<string, string>>>({});
  const [matchSel, setMatchSel] = useState<Record<number, Record<string, string>>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [startedAt, setStartedAt] = useState(new Date().toISOString());
  const seedRef = useRef<number | string>(seed);
  const snapshotRef = useRef<Partial<ScienceSession>>({});

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const id = ensureRunIdInCurrentUrl();
      setRunId(id);
      const existing = await loadRunnerSession<ReturnType<typeof pickScienceSession>[number], SavedScienceQuestion, ScienceRunnerState, null>(id);
      if (cancelled) return;
      if (existing) {
        if (existing.runnerId !== 'kiur-science') throw new Error('See salvestatud jooks kuulub teisele harjutusele.');
        const state = existing.runnerState;
        seedRef.current = existing.seed ?? seed;
        setStartedAt(existing.startedAt);
        setSession(existing.questions as ReturnType<typeof pickScienceSession>);
        setDisplayOrder((existing.optionOrder ?? {}) as ScienceDisplayOrder);
        setIndex(existing.currentIndex);
        setChoiceSel(state.choiceSel);
        setSortSel(state.sortSel);
        setMatchSel(state.matchSel);
        setChecked(state.checked);
        setShowStopConfirm(state.showStopConfirm);
        setElapsed(Math.floor(existing.activeElapsedMs / 1000));
        setSessionReady(true);
        return;
      }
      if (await getLocalAttempt(id)) {
        window.location.replace(`/tulemus?clientId=${encodeURIComponent(id)}`);
        return;
      }
      const questions = pickScienceSession(count, seed);
      const order: ScienceDisplayOrder = {};
      for (const task of questions) {
        order[task.id] = {
          choices: isChoiceTask(task) ? shuffleStable(task.choices, `${task.id}:${seed}:choices`) : undefined,
          definitions: task.type === 'match' ? shuffleStable(task.definitions, `${task.id}:${seed}:defs`) : undefined,
          items: task.type === 'sort' ? shuffleStable(task.items, `${task.id}:${seed}:items`) : undefined,
          groups: task.type === 'sort' ? shuffleStable(task.groups, `${task.id}:${seed}:groups`) : undefined
        };
      }
      const beganAt = new Date().toISOString();
      await createRunnerSession<ReturnType<typeof pickScienceSession>[number], SavedScienceQuestion, ScienceRunnerState, null>({
        runId: id,
        learner: 'kiur',
        runnerId: 'kiur-science',
        exerciseId: 'kiur.science.loodusopetus',
        subject: 'loodusopetus',
        topic: 'segaharjutus',
        category: 'Loodusõpetus',
        seed,
        questions,
        optionOrder: order,
        answers: [],
        currentPhase: 'question',
        runnerState: { choiceSel: {}, sortSel: {}, matchSel: {}, checked: {}, showStopConfirm: false },
        catalogueVersion: null,
        rewardPolicyVersion: LEGACY_REWARD_POLICY_VERSION,
        generatorVersion: GENERATOR_VERSION,
        runnerVersion: 'science-v1',
        rotationVersion: ROTATION_ALGORITHM_VERSION,
        startedAt: beganAt
      });
      if (cancelled) return;
      seedRef.current = seed;
      setStartedAt(beganAt);
      setSession(questions);
      setDisplayOrder(order);
      setSessionReady(true);
    })().catch((cause) => {
      if (!cancelled) setStorageError(runnerStorageFailure(cause).message);
    });
    return () => { cancelled = true; };
  }, [count, seed]);

  snapshotRef.current = {
    currentIndex: index,
    currentPhase: checked[index] ? 'feedback' : 'question',
    activeElapsedMs: elapsed * 1000,
    runnerState: { choiceSel, sortSel, matchSel, checked, showStopConfirm },
    status: storageError ? 'paused' : 'active'
  };

  useEffect(() => {
    if (!sessionReady || !runId || isSaving || storageError) return;
    void patchRunnerSession<ScienceSession>(runId, snapshotRef.current).catch((cause) => setStorageError(runnerStorageFailure(cause).message));
  }, [checked, choiceSel, index, isSaving, matchSel, runId, sessionReady, showStopConfirm, sortSel, storageError]);

  useEffect(() => {
    if (!session.length || !sessionReady || isSaving || storageError) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') setElapsed((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isSaving, session.length, sessionReady, storageError]);

  useEffect(() => {
    if (!sessionReady || !runId || isSaving) return;
    const checkpoint = () => void patchRunnerSession<ScienceSession>(runId, snapshotRef.current).catch((cause) => setStorageError(runnerStorageFailure(cause).message));
    const timer = window.setInterval(checkpoint, 5000);
    const onVisibility = () => { if (document.visibilityState === 'hidden') checkpoint(); };
    window.addEventListener('pagehide', checkpoint);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('pagehide', checkpoint);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isSaving, runId, sessionReady]);

  useEffect(() => setError(''), [index]);

  const current = session[index];

  // The data often lists choices/items/groups in an order where the correct
  // answer sits on a predictable diagonal. Shuffle the display order (mixing in
  // the session seed) so answer positions vary and reveal no pattern.
  const displayChoices = useMemo(() => (current && isChoiceTask(current) ? (displayOrder[current.id]?.choices ?? current.choices) as typeof current.choices : []), [current, displayOrder]);
  const displayDefinitions = useMemo(() => (current?.type === 'match' ? displayOrder[current.id]?.definitions ?? current.definitions : []), [current, displayOrder]);
  const displaySortItems = useMemo(() => (current?.type === 'sort' ? displayOrder[current.id]?.items ?? current.items : []), [current, displayOrder]);
  const displaySortGroups = useMemo(() => (current?.type === 'sort' ? displayOrder[current.id]?.groups ?? current.groups : []), [current, displayOrder]);

  if (storageError) {
    return (
      <main className='test-page'>
        <section className='test-shell'>
          <section className='question-card' role='alert'>
            <h2>Harjutus on peatatud</h2>
            <p>{storageError}</p>
            <button type='button' className='next-button' onClick={() => window.location.reload()}>Proovi salvestust uuesti</button>
            <button type='button' className='stop-button' onClick={() => router.push('/kiur')}>Tagasi</button>
          </section>
        </section>
      </main>
    );
  }

  if (!sessionReady) {
    return <main className='test-page'><section className='test-shell'><section className='question-card'>Taastan harjutust...</section></section></main>;
  }

  if (!current) {
    return (
      <main className='test-page'>
        <section className='test-shell'>
          <section className='question-card'>
            <h2>Harjutus ei ole saadaval</h2>
            <button type='button' className='next-button' onClick={() => router.push('/kiur')}>Tagasi</button>
          </section>
        </section>
      </main>
    );
  }

  const isChecked = Boolean(checked[index]);

  const isAnswered = (i: number) => {
    const task = session[i];
    if (!task) return false;
    if (isChoiceTask(task)) return Boolean(choiceSel[i]);
    if (task.type === 'sort') return task.items.every((item) => sortSel[i]?.[item]);
    if (task.type === 'match') return task.terms.every((term) => matchSel[i]?.[term]);
    return false;
  };

  const isCorrect = (i: number) => {
    const task = session[i];
    if (!task) return false;
    if (isChoiceTask(task)) return choiceSel[i] === task.correctAnswer;
    if (task.type === 'sort') {
      const selection = sortSel[i] ?? {};
      return task.items.every((item) => selection[item] === correctGroupOfItem(task.correctGroups, item));
    }
    if (task.type === 'match') {
      const selection = matchSel[i] ?? {};
      return task.terms.every((term) => selection[term] === task.correctMatches[term]);
    }
    return false;
  };

  const serialize = (i: number): SavedScienceQuestion => {
    const task = session[i];
    const correct = isCorrect(i);
    const base: SavedScienceQuestion = {
      id: task.id,
      type: task.type,
      title: task.title,
      prompt: task.prompt,
      question: `${task.title}: ${task.prompt}`,
      kind: 'choice',
      correctAnswer: 0,
      isCorrect: correct,
      explanation: task.explanation,
      userAnswer: '—',
      correctAnswerText: '—',
      tags: task.tags
    };

    if (isChoiceTask(task)) {
      const selected = task.choices.find((choice) => choice.id === choiceSel[i]);
      base.userAnswer = selected ? cleanAnswer(selected.text) : '—';
      base.correctAnswerText = cleanAnswer(task.correctAnswerText);
      base.selectedChoiceId = choiceSel[i] ?? null;
      if (task.type === 'visual_choice') {
        base.diagram = task.diagram;
        base.diagramExplanation = task.diagramExplanation;
      }
      if (task.type === 'reading_choice') base.text = task.text;
      if (task.type === 'data_evidence') {
        base.data = task.data;
        if (task.diagram) base.diagram = task.diagram;
        if (task.diagramExplanation) base.diagramExplanation = task.diagramExplanation;
      }
      return base;
    }

    if (task.type === 'sort') {
      const selection = sortSel[i] ?? {};
      base.userAnswer = formatGrouping(task.groups, (group) => task.items.filter((item) => selection[item] === group));
      base.correctAnswerText = formatGrouping(task.groups, (group) => task.correctGroups[group] ?? []);
      base.groups = task.groups;
      base.items = task.items;
      base.correctGroups = task.correctGroups;
      base.selectedGroups = selection;
      return base;
    }

    // match
    const selection = matchSel[i] ?? {};
    base.userAnswer = formatPairs(task.terms, (term) => selection[term]);
    base.correctAnswerText = formatPairs(task.terms, (term) => task.correctMatches[term]);
    base.terms = task.terms;
    base.definitions = task.definitions;
    base.correctMatches = task.correctMatches;
    base.selectedMatches = selection;
    return base;
  };

  const handleCheck = () => {
    if (storageError) return;
    if (!isAnswered(index)) {
      setError('Vali vastus enne jätkamist.');
      return;
    }
    setError('');
    setChecked((prev) => ({ ...prev, [index]: true }));
  };

  const finish = async () => {
    if (isSaving || !runId || storageError) return;
    setIsSaving(true);
    setSaveError('');
    const results = session.map((_, i) => serialize(i));
    const score = results.filter((result) => result.isCorrect).length;
    try {
      // Science is always available and not part of the rotating catalogue, so no
      // catalogueVersion is attached. Local-first save, then best-effort sync.
      const outcome = await finalizeRunnerSession({
        runId,
        seed: seedRef.current,
        runnerId: 'kiur-science',
        questionIds: session.map((task) => task.id),
        rewardPolicyVersion: LEGACY_REWARD_POLICY_VERSION,
        generatorVersion: GENERATOR_VERSION,
        runnerVersion: 'science-v1',
        rotationVersion: ROTATION_ALGORITHM_VERSION,
        learner: 'kiur',
        subject: 'loodusopetus',
        topic: 'segaharjutus',
        category: 'Loodusõpetus',
        difficulty: 'segaharjutus',
        exerciseId: 'kiur.science.loodusopetus',
        catalogueVersion: null,
        startedAt,
        questionCount: session.length,
        score,
        elapsedSeconds: elapsed,
        questions: results
      });
      if (outcome.serverAttemptId) router.push(`/history/${outcome.serverAttemptId}`);
      else router.push(`/tulemus?clientId=${encodeURIComponent(outcome.clientAttemptId)}`);
    } catch (cause) {
      setStorageError(runnerStorageFailure(cause).message);
      setSaveError('Salvestamine ebaõnnestus. Proovi uuesti.');
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    if (storageError) return;
    if (index < session.length - 1) {
      setIndex((value) => value + 1);
      return;
    }
    void finish();
  };

  const setSortGroup = (item: string, group: string) => {
    if (isChecked || storageError) return;
    setSortSel((prev) => ({ ...prev, [index]: { ...(prev[index] ?? {}), [item]: group } }));
  };

  const setMatchDefinition = (term: string, definition: string) => {
    if (isChecked || storageError) return;
    setMatchSel((prev) => ({ ...prev, [index]: { ...(prev[index] ?? {}), [term]: definition } }));
  };

  const correct = isChecked && isCorrect(index);
  const percent = Math.round(((index + 1) / session.length) * 100);
  const primaryLabel = !isChecked
    ? 'Kontrolli vastust'
    : index === session.length - 1
    ? (isSaving ? 'Salvestan...' : 'Lõpeta')
    : 'Järgmine';

  return (
    <main className='test-page'>
      <section className='test-shell'>
        <header className='test-header'>
          <div className='test-meta'>
            <span aria-hidden>🔬</span>
            <div>
              <p>Loodusõpetus</p>
              <strong>{session.length} küsimust</strong>
            </div>
          </div>
          <div className='test-timer'><span aria-hidden>⏱️</span><span>Aeg {formatElapsed(elapsed)}</span></div>
        </header>

        <section className='test-progress-card'>
          <div className='progress-row'><strong>Küsimus {index + 1} / {session.length}</strong><span>{percent}%</span></div>
          <div className='progress-track'><span style={{ width: `${percent}%` }} /></div>
        </section>

        <section className='question-card'>
          <p className='question-eyebrow'>{EYEBROW[current.type]}</p>
          <h1 className='question-text science-title'>{current.title}</h1>

          {current.type === 'visual_choice' ? <div className='science-diagram'>{current.diagram}</div> : null}
          {current.type === 'reading_choice' ? <div className='science-reading-text'>{current.text}</div> : null}
          {current.type === 'data_evidence' ? <ScienceDataPanel data={current.data} /> : null}

          <p className='science-prompt'>{current.prompt}</p>

          {isChoiceTask(current) ? (
            <div className='choice-answer-grid'>
              {displayChoices.map((choice) => (
                <button
                  type='button'
                  key={choice.id}
                  aria-pressed={choiceSel[index] === choice.id}
                  disabled={isChecked}
                  className={choiceSel[index] === choice.id ? 'choice-answer-button science-choice selected' : 'choice-answer-button science-choice'}
                  onClick={() => setChoiceSel((prev) => ({ ...prev, [index]: choice.id }))}
                >
                  {cleanAnswer(choice.text)}
                </button>
              ))}
            </div>
          ) : null}

          {current.type === 'sort' ? (
            <div className='science-sort-list'>
              {displaySortItems.map((item) => (
                <div key={item} className='science-sort-item'>
                  <span className='science-sort-label'>{cleanAnswer(item)}</span>
                  <div className='science-sort-groups'>
                    {displaySortGroups.map((group) => (
                      <button
                        type='button'
                        key={group}
                        disabled={isChecked}
                        aria-pressed={sortSel[index]?.[item] === group}
                        className={sortSel[index]?.[item] === group ? 'science-group-chip selected' : 'science-group-chip'}
                        onClick={() => setSortGroup(item, group)}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {current.type === 'match' ? (
            <div className='science-match-list'>
              {current.terms.map((term) => {
                const selection = matchSel[index] ?? {};
                const usedElsewhere = new Set(Object.entries(selection).filter(([key]) => key !== term).map(([, value]) => value));
                return (
                  <label key={term} className='science-match-row'>
                    <span className='science-match-term'>{term}</span>
                    <select
                      className='science-match-select'
                      disabled={isChecked}
                      value={selection[term] ?? ''}
                      onChange={(event) => setMatchDefinition(term, event.target.value)}
                    >
                      <option value='' disabled>Vali seletus…</option>
                      {displayDefinitions.map((definition) => (
                        <option key={definition} value={definition} disabled={usedElsewhere.has(definition)}>{cleanAnswer(definition)}</option>
                      ))}
                    </select>
                  </label>
                );
              })}
            </div>
          ) : null}

          {isChecked ? (
            <div className={`science-feedback ${correct ? 'correct' : 'wrong'}`}>
              <strong>{correct ? 'Õige!' : 'Vaata õiget vastust'}</strong>
              {current.type === 'sort' ? (
                <div className='science-feedback-pairs'>
                  <span className='science-feedback-heading'>Õige jaotus:</span>
                  {current.groups.map((group) => (
                    <span key={group} className='science-feedback-pair'>{group}: {(current.correctGroups[group] ?? []).map(cleanAnswer).join(', ')}</span>
                  ))}
                </div>
              ) : current.type === 'match' ? (
                <div className='science-feedback-pairs'>
                  <span className='science-feedback-heading'>Õiged paarid:</span>
                  {current.terms.map((term) => (
                    <span key={term} className='science-feedback-pair'>{cleanAnswer(term)} → {cleanAnswer(current.correctMatches[term])}</span>
                  ))}
                </div>
              ) : (
                <span>Õige vastus: <strong className='science-feedback-answer'>{cleanAnswer(current.correctAnswerText)}</strong></span>
              )}
              <span className='science-feedback-explanation'>Selgitus: {current.explanation}</span>
              {current.type === 'visual_choice' ? <span className='science-feedback-explanation'>Skeemi selgitus: {current.diagramExplanation}</span> : null}
              {current.type === 'data_evidence' && current.diagramExplanation ? <span className='science-feedback-explanation'>Skeemi selgitus: {current.diagramExplanation}</span> : null}
            </div>
          ) : null}
        </section>

        {error && <p className='test-error'>{error}</p>}
        {saveError && <p className='test-error'>{saveError}</p>}

        <footer className='test-actions-panel'>
          <button
            type='button'
            className='next-button'
            disabled={(!isChecked && !isAnswered(index)) || isSaving}
            onClick={isChecked ? handleNext : handleCheck}
          >
            {primaryLabel}
          </button>
          {showStopConfirm ? (
            <div className='stop-confirm-panel' role='alertdialog' aria-labelledby='science-stop-title'>
              <p id='science-stop-title'>Kas soovid harjutuse lõpetada?</p>
              <div className='stop-confirm-actions'>
                <button type='button' className='stop-cancel-button' onClick={() => setShowStopConfirm(false)}>Jätka harjutust</button>
                <button type='button' className='stop-confirm-button' onClick={() => router.push('/kiur')}>Jah, lõpeta</button>
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

export default function LoodusopetusTestPage() {
  return (
    <Suspense fallback={<main className='test-page'><section className='test-shell'><section className='question-card'>Laadin küsimusi...</section></section></main>}>
      <ScienceTestContent />
    </Suspense>
  );
}
