'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { csrfHeaders } from '@/lib/auth/client';
import type { ParentUnitSummary, ParentWordDetail } from '@/lib/server/vocabulary/overview';
import type { ImportCell, ImportMapping, ImportMode, ImportPlan, ImportTable } from '@/lib/vocabulary/importPlan';

// "Inglise keele sõnavara" inside the parent hub: import textbook words from a
// spreadsheet, publish and unlock units, and follow Kiur's progress per unit
// and per word. Every request carries the parent CSRF token.

function fetch(input: RequestInfo | URL, init: RequestInit = {}) {
  return globalThis.fetch(input, { ...init, headers: csrfHeaders(init.headers, 'parent_csrf') });
}

async function request<T>(input: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(input, init);
  const body = await response.json().catch(() => ({})) as T & { message?: string };
  if (!response.ok) throw new Error(body.message || 'Päring ebaõnnestus.');
  return body;
}

function json(method: string, body: unknown): RequestInit {
  return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

function unitWord(count: number) {
  return count === 1 ? 'õppetükk' : 'õppetükki';
}

// Why the child can or cannot open a unit, in the parent's words. Manual
// opening has no effect on an unpublished unit, so it is never offered as the fix.
function accessLabel(unit: ParentUnitSummary): { text: string; tone: 'good' | 'muted' | 'warn' } {
  if (unit.accessReason === 'unpublished') {
    if (unit.published && unit.wordCount === 0) return { text: 'Lukus: sõnad puuduvad', tone: 'muted' };
    return { text: 'Lukus: ootab avaldamist', tone: unit.waitingForPublish ? 'warn' : 'muted' };
  }
  if (unit.accessReason === 'locked') {
    return { text: unit.previousUnitNumber !== null ? `Lukus: avaneb pärast Unit ${unit.previousUnitNumber} testi` : 'Lapsele lukus', tone: 'muted' };
  }
  if (unit.accessReason === 'first') return { text: 'Lapsele avatud (esimene õppetükk)', tone: 'good' };
  if (unit.accessReason === 'previous_passed') return { text: `Lapsele avatud (Unit ${unit.previousUnitNumber} läbitud)`, tone: 'good' };
  return { text: 'Lapsele avatud', tone: 'good' };
}

function dateLabel(value: string | null) {
  return value ? new Date(value).toLocaleDateString('et-EE', { day: 'numeric', month: 'numeric', year: 'numeric' }) : '–';
}

function scoreLabel(score: { correct: number; total: number; percent: number } | null) {
  return score ? `${score.correct}/${score.total} (${score.percent}%)` : '–';
}

type ParsedSheet = { name: string; rows: ImportTable; error?: string | null; suggestedMapping: ImportMapping };
type Preview = { plan: ImportPlan; planHash: string };

const MAPPING_FIELDS: Array<{ key: 'english' | 'estonian' | 'pronunciation' | 'accepted' | 'unit' | 'title'; label: string; required?: boolean }> = [
  { key: 'english', label: 'Ingliskeelne sõna', required: true },
  { key: 'estonian', label: 'Eestikeelne sõna', required: true },
  { key: 'pronunciation', label: 'Hääldus' },
  { key: 'accepted', label: 'Vastuvõetavad vastused' },
  { key: 'unit', label: 'Õppetüki number' },
  { key: 'title', label: 'Õppetüki pealkiri' }
];

function columnLetter(index: number) {
  let name = '';
  let value = index + 1;
  while (value > 0) {
    name = String.fromCharCode(65 + ((value - 1) % 26)) + name;
    value = Math.floor((value - 1) / 26);
  }
  return name;
}

function VocabularyImport({ onImported, setNotice, setError }: { onImported: () => void; setNotice: (value: string) => void; setError: (value: string) => void }) {
  const [fileName, setFileName] = useState('');
  const [sheets, setSheets] = useState<ParsedSheet[]>([]);
  const [sheetIndex, setSheetIndex] = useState(0);
  const [mapping, setMapping] = useState<ImportMapping | null>(null);
  const [mode, setMode] = useState<ImportMode>('merge');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  // Every change to the sheet, mapping or mode invalidates a preview — even
  // one still on its way, so a late answer for old settings is ignored.
  const previewTicket = useRef(0);

  const sheet = sheets[sheetIndex];
  const columnCount = useMemo(() => Math.min(30, Math.max(0, ...(sheet?.rows ?? []).slice(0, 200).map((row) => row.length))), [sheet]);
  const headerCells: ImportCell[] = mapping?.headerRow !== null && mapping?.headerRow !== undefined ? sheet?.rows[mapping.headerRow] ?? [] : [];

  const resetPreview = () => {
    previewTicket.current += 1;
    setPreview(null);
  };

  const updateMapping = (next: ImportMapping) => {
    setMapping(next);
    resetPreview();
  };

  const chooseSheet = (index: number, list = sheets) => {
    setSheetIndex(index);
    setMapping(list[index]?.suggestedMapping ?? null);
    resetPreview();
  };

  const readFile = async (file: File | undefined) => {
    // A cancelled file dialog keeps whatever was loaded before.
    if (!file) return;
    resetPreview();
    setSheets([]);
    setBusy(true);
    try {
      const body = await request<{ sheets: ParsedSheet[] }>('/api/parent/english-vocabulary/import/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream', 'x-file-name': encodeURIComponent(file.name) },
        body: await file.arrayBuffer()
      });
      setFileName(file.name);
      setSheets(body.sheets);
      // Prefer the readable sheet that holds the most rows.
      const best = body.sheets.reduce((bestIndex, candidate, index) => {
        if (candidate.error) return bestIndex;
        const current = body.sheets[bestIndex];
        return !current || current.error || candidate.rows.length > current.rows.length ? index : bestIndex;
      }, 0);
      chooseSheet(best, body.sheets);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Faili ei saanud lugeda.');
    } finally {
      setBusy(false);
    }
  };

  const setColumn = (key: typeof MAPPING_FIELDS[number]['key'], value: string) => {
    if (!mapping) return;
    updateMapping({ ...mapping, [key]: value === '' ? null : Number(value) });
  };

  // Only rows up to the last one with content are sent.
  const rowsToSend = () => {
    const rows = sheet?.rows ?? [];
    let last = rows.length - 1;
    while (last >= 0 && !(rows[last] ?? []).some((cell) => cell.v.trim())) last -= 1;
    return rows.slice(0, last + 1).map((row) => row ?? []);
  };

  const check = async () => {
    if (!sheet || !mapping) return;
    const ticket = ++previewTicket.current;
    setBusy(true);
    try {
      const result = await request<Preview>('/api/parent/english-vocabulary/import/preview', json('POST', { rows: rowsToSend(), mapping, mode }));
      if (ticket === previewTicket.current) setPreview(result);
    } catch (error) {
      if (ticket === previewTicket.current) setError(error instanceof Error ? error.message : 'Eelvaadet ei saanud teha.');
    } finally {
      setBusy(false);
    }
  };

  const commit = async () => {
    if (!sheet || !mapping || !preview) return;
    setBusy(true);
    try {
      await request('/api/parent/english-vocabulary/import/commit', json('POST', { rows: rowsToSend(), mapping, mode, planHash: preview.planHash, fileName }));
      setNotice('Sõnad imporditud. Uued õppetükid on avaldamata — avalda need, kui oled valmis.');
      setSheets([]);
      resetPreview();
      setFileName('');
      onImported();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Importimine ebaõnnestus.');
      resetPreview();
    } finally {
      setBusy(false);
    }
  };

  const errors = preview?.plan.issues.filter((issue) => issue.severity === 'error') ?? [];
  const warnings = preview?.plan.issues.filter((issue) => issue.severity === 'warning') ?? [];

  return (
    <section className='parent-card'>
      <h3>Impordi sõnad failist</h3>
      <p>Excel (.xlsx), CSV või tabeldusmärgiga tekst. Fail loetakse, kontrollitakse ja näidatakse enne salvestamist eelvaatena. Midagi ei avaldata automaatselt.</p>
      <label className='parent-form'><span>Fail</span><input
        type='file'
        accept='.xlsx,.csv,.tsv,.txt'
        disabled={busy}
        onChange={(event) => {
          // Cleared after reading, so choosing the same (corrected) file again
          // is seen as a change.
          const input = event.currentTarget;
          void readFile(input.files?.[0]).finally(() => { input.value = ''; });
        }}
      /></label>
      {fileName && sheets.length ? <p>Loetud fail: <strong>{fileName}</strong></p> : null}

      {sheet && mapping ? (
        <fieldset className='parent-form vocab-import-form' disabled={busy}>
          {sheets.length > 1 ? (
            <label><span>Leht</span>
              <select value={sheetIndex} onChange={(event) => chooseSheet(Number(event.target.value))}>
                {sheets.map((item, index) => <option key={`${item.name}-${index}`} value={index} disabled={Boolean(item.error)}>{item.name} {item.error ? '(ei saa lugeda)' : `(${item.rows.length} rida)`}</option>)}
              </select>
            </label>
          ) : null}
          {mapping.defaultUnit ? <p>Lehe nime järgi kuuluvad sõnad õppetükki <strong>Unit {mapping.defaultUnit}</strong>, kui failis pole teisiti märgitud.</p> : null}
          <label><span>Päiserida</span>
            <select value={mapping.headerRow ?? ''} onChange={(event) => updateMapping({ ...mapping, headerRow: event.target.value === '' ? null : Number(event.target.value) })}>
              <option value=''>Päiserida puudub</option>
              {sheet.rows.slice(0, 20).map((row, index) => <option key={index} value={index}>Rida {index + 1}: {row.map((cell) => cell.v).filter(Boolean).join(' · ').slice(0, 60) || '(tühi)'}</option>)}
            </select>
          </label>
          <div className='vocab-import-mapping'>
            {MAPPING_FIELDS.map((field) => (
              <label key={field.key}><span>{field.label}{field.required ? ' *' : ''}</span>
                <select value={mapping[field.key] ?? ''} onChange={(event) => setColumn(field.key, event.target.value)}>
                  {!field.required ? <option value=''>—</option> : null}
                  {Array.from({ length: columnCount }, (_, index) => (
                    <option key={index} value={index}>{columnLetter(index)}{headerCells[index]?.v ? ` — ${headerCells[index].v.slice(0, 30)}` : ''}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <label className='parent-checkbox'><input type='checkbox' checked={mapping.unitHeaderRows} onChange={(event) => updateMapping({ ...mapping, unitHeaderRows: event.target.checked })} /> Õppetükke alustavad pealkirjaread (nt „UNIT 3 | Thank you“)</label>
          <fieldset className='parent-form'>
            <legend>Olemasolevad õppetükid</legend>
            <label className='parent-checkbox'><input type='radio' name='vocab-import-mode' checked={mode === 'merge'} onChange={() => { setMode('merge'); resetPreview(); }} /> Lisa ja uuenda (midagi ei eemaldata)</label>
            <label className='parent-checkbox'><input type='radio' name='vocab-import-mode' checked={mode === 'replace'} onChange={() => { setMode('replace'); resetPreview(); }} /> Asenda õppetüki sõnad failis olevatega (puuduvad sõnad peidetakse, ajalugu jääb alles)</label>
          </fieldset>
          <div className='parent-action-row'>
            <button type='button' onClick={() => void check()}>{busy ? 'Kontrollin…' : 'Kontrolli'}</button>
          </div>
        </fieldset>
      ) : null}

      {preview ? (
        <div className='vocab-admin'>
          <p>
            <strong>{preview.plan.totals.rows}</strong> sõna, <strong>{preview.plan.totals.units}</strong> {unitWord(preview.plan.totals.units)}
            {preview.plan.totals.newUnits ? ` (uusi ${preview.plan.totals.newUnits})` : ''} ·
            uusi sõnu {preview.plan.totals.new}, muudetud {preview.plan.totals.updated}, muutmata {preview.plan.totals.unchanged}
            {preview.plan.totals.restored ? `, taastatud ${preview.plan.totals.restored}` : ''}
            {preview.plan.totals.retired ? `, peidetakse ${preview.plan.totals.retired}` : ''}
            {preview.plan.totals.emptyRows ? ` · tühje ridu ${preview.plan.totals.emptyRows}` : ''}
          </p>
          <div className='vocab-word-table-wrap'>
            <table className='vocab-word-table'>
              <thead><tr><th>Õppetükk</th><th>Sõnu</th><th>Uus</th><th>Muudetud</th><th>Muutmata</th><th>Peidetakse</th></tr></thead>
              <tbody>
                {preview.plan.units.map((unit) => (
                  <tr key={unit.unitNumber}>
                    <td>Unit {unit.unitNumber} — {unit.title}{unit.unitId ? '' : ' (uus)'}{unit.titleChanged ? ' (pealkiri muutub)' : ''}</td>
                    <td>{unit.activeWordCount}</td>
                    <td>{unit.counts.new + unit.counts.restored}</td>
                    <td>{unit.counts.updated}</td>
                    <td>{unit.counts.unchanged + unit.counts.kept}</td>
                    <td>{unit.counts.retired}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {errors.length ? <p><strong>Vigu: {errors.length}.</strong> Paranda need failis ja proovi uuesti — vigadega faili ei impordita.</p> : null}
          {errors.length || warnings.length ? (
            <ul className='vocab-import-issues'>
              {[...errors, ...warnings].map((issue, index) => <li key={index} data-severity={issue.severity}>{issue.row ? `Rida ${issue.row}: ` : ''}{issue.message}</li>)}
            </ul>
          ) : null}
          <div className='parent-action-row'>
            <button type='button' className='filter-chip' onClick={() => setPreview(null)}>Tühista</button>
            <button type='button' disabled={busy || !preview.plan.canCommit} onClick={() => void commit()}>Impordi</button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

type WordForm = { estonian: string; english: string; pronunciation: string; accepted: string };
const emptyWordForm: WordForm = { estonian: '', english: '', pronunciation: '', accepted: '' };

function toPayload(form: WordForm) {
  return { estonian: form.estonian, english: form.english, pronunciation: form.pronunciation, acceptedAnswers: form.accepted.split(/[;|]/u).map((value) => value.trim()).filter(Boolean) };
}

function UnitWords({ unit, setError, onChanged }: { unit: ParentUnitSummary; setError: (value: string) => void; onChanged: () => void }) {
  const [data, setData] = useState<{ words: ParentWordDetail[]; mostMissed: Array<{ id: string; english: string; estonian: string; mistakes: number }> } | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<WordForm>(emptyWordForm);
  const [newWord, setNewWord] = useState<WordForm>(emptyWordForm);

  const load = useCallback(() => {
    void request<NonNullable<typeof data>>(`/api/parent/english-vocabulary/units/${unit.id}`).then(setData).catch((error: Error) => setError(error.message));
  }, [setError, unit.id]);
  useEffect(load, [load, unit.contentVersion]);

  const save = async (wordId: string) => {
    try {
      await request(`/api/parent/english-vocabulary/words/${wordId}`, json('PATCH', toPayload(form)));
      setEditing(null);
      onChanged();
      load();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sõna ei saanud salvestada.');
    }
  };
  const setRetired = async (wordId: string, retired: boolean) => {
    try {
      await request(`/api/parent/english-vocabulary/words/${wordId}`, json('PATCH', { retired }));
      onChanged();
      load();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sõna ei saanud muuta.');
    }
  };
  const add = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await request(`/api/parent/english-vocabulary/units/${unit.id}/words`, json('POST', toPayload(newWord)));
      setNewWord(emptyWordForm);
      onChanged();
      load();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sõna ei saanud lisada.');
    }
  };

  if (!data) return <p>Laadin sõnu…</p>;
  const weak = data.words.filter((word) => word.needsPractice && !word.retired);
  return (
    <div className='vocab-admin'>
      {data.mostMissed.length ? <p><strong>Kõige sagedamini valesti kirjutatud:</strong> {data.mostMissed.map((word) => `${word.english} (${word.mistakes}×)`).join(', ')}</p> : null}
      {weak.length ? <p><strong>Vajab veel harjutamist:</strong> {weak.map((word) => word.english).join(', ')}</p> : null}
      <div className='vocab-word-table-wrap'>
        <table className='vocab-word-table'>
          <thead>
            <tr>
              <th>Eesti</th><th>Inglise</th><th>Hääldus</th>
              <th title='Kaardid: teadsin / ei teadnud'>Õppimine ✓/✗</th>
              <th title='Täistesti vastused'>Test ✓/✗</th>
              <th title='Valesti kirjutatud parandusvoorus'>Parandus ✗</th>
              <th title='Korda eksitud sõnu'>Kordamine ✓/✗</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {data.words.map((word) => editing === word.id ? (
              <tr key={word.id}>
                <td><input aria-label='Eestikeelne sõna' value={form.estonian} onChange={(event) => setForm({ ...form, estonian: event.target.value })} /></td>
                <td><input aria-label='Ingliskeelne sõna' value={form.english} onChange={(event) => setForm({ ...form, english: event.target.value })} /></td>
                <td><input aria-label='Hääldus' value={form.pronunciation} onChange={(event) => setForm({ ...form, pronunciation: event.target.value })} /></td>
                <td colSpan={4}><input aria-label='Vastuvõetavad vastused (eralda semikooloniga)' placeholder='muud õiged vastused; eralda ;' value={form.accepted} onChange={(event) => setForm({ ...form, accepted: event.target.value })} /></td>
                <td className='vocab-admin-actions'>
                  <button type='button' className='view-button' onClick={() => void save(word.id)}>Salvesta</button>
                  <button type='button' className='filter-chip' onClick={() => setEditing(null)}>Tühista</button>
                </td>
              </tr>
            ) : (
              <tr key={word.id} data-retired={word.retired} data-weak={word.needsPractice}>
                <td>{word.estonian}</td>
                <td>{word.english}{word.acceptedAnswers.length ? <small> ({word.acceptedAnswers.join(', ')})</small> : null}{word.recentWrongAnswers.length ? <small> · kirjutas: {word.recentWrongAnswers.join(', ')}</small> : null}</td>
                <td>{word.pronunciation}</td>
                <td>{word.studyCorrect}/{word.studyWrong}</td>
                <td>{word.testCorrect}/{word.testWrong}</td>
                <td>{word.correctionWrong}</td>
                <td>{word.practiceCorrect}/{word.practiceWrong}</td>
                <td className='vocab-admin-actions'>
                  {!word.retired ? <button type='button' className='view-button' onClick={() => { setEditing(word.id); setForm({ estonian: word.estonian, english: word.english, pronunciation: word.pronunciation, accepted: word.acceptedAnswers.join('; ') }); }}>Muuda</button> : null}
                  <button type='button' className='filter-chip' onClick={() => void setRetired(word.id, !word.retired)}>{word.retired ? 'Taasta' : 'Peida'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form className='parent-form parent-task-form' onSubmit={(event) => void add(event)}>
        <label><span>Eestikeelne sõna</span><input value={newWord.estonian} maxLength={200} onChange={(event) => setNewWord({ ...newWord, estonian: event.target.value })} /></label>
        <label><span>Ingliskeelne sõna</span><input value={newWord.english} maxLength={200} onChange={(event) => setNewWord({ ...newWord, english: event.target.value })} /></label>
        <label><span>Hääldus</span><input value={newWord.pronunciation} maxLength={100} onChange={(event) => setNewWord({ ...newWord, pronunciation: event.target.value })} /></label>
        <label><span>Vastuvõetavad vastused</span><input value={newWord.accepted} placeholder='eralda semikooloniga' onChange={(event) => setNewWord({ ...newWord, accepted: event.target.value })} /></label>
        <div className='parent-action-row'><button type='submit' disabled={!newWord.estonian.trim() || !newWord.english.trim()}>Lisa sõna</button></div>
      </form>
    </div>
  );
}

function UnitRow({ unit, onChanged, setError, setNotice }: { unit: ParentUnitSummary; onChanged: () => void; setError: (value: string) => void; setNotice: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(unit.title);
  const [unitNumber, setUnitNumber] = useState(String(unit.unitNumber));

  const patch = async (body: Record<string, unknown>, notice: string) => {
    try {
      await request(`/api/parent/english-vocabulary/units/${unit.id}`, json('PATCH', body));
      setNotice(notice);
      setEditing(false);
      onChanged();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Õppetükki ei saanud muuta.');
    }
  };
  const remove = async () => {
    if (!window.confirm(`Kustutada ${unit.label}?`)) return;
    try {
      await request(`/api/parent/english-vocabulary/units/${unit.id}`, { method: 'DELETE' });
      setNotice('Õppetükk kustutatud.');
      onChanged();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Õppetükki ei saanud kustutada.');
    }
  };

  const access = accessLabel(unit);
  // Manual opening only works on a published unit with words; an existing
  // manual flag can still be removed.
  const canUnlockByHand = unit.accessReason !== 'unpublished' || unit.manualUnlock;
  const studyState = unit.studyCompletedAt ? 'Õppimine tehtud' : unit.studyInProgress ? `Õppimine pooleli (${unit.studyInProgress.known}/${unit.studyInProgress.total})` : unit.started ? 'Alustatud' : 'Alustamata';

  return (
    <div className='vocab-admin-unit' data-waiting={unit.waitingForPublish ? 'true' : undefined}>
      <div className='vocab-admin-unit-head'>
        <strong>{unit.label}</strong>
        <div className='vocab-admin-chips'>
          <span className='vocab-admin-chip' data-tone={unit.published ? 'good' : 'muted'}>{unit.published ? 'Avaldatud' : 'Avaldamata'}</span>
          <span className='vocab-admin-chip' data-tone={access.tone}>{access.text}</span>
          {unit.manualUnlock ? <span className='vocab-admin-chip'>Käsitsi avatud</span> : null}
          <span className='vocab-admin-chip'>{studyState}</span>
          {unit.testUnlocked && !unit.testPassedAt ? <span className='vocab-admin-chip'>Test avatud</span> : null}
          {unit.testPassedAt ? <span className='vocab-admin-chip' data-tone='good'>Läbitud {dateLabel(unit.testPassedAt)}</span> : null}
          {unit.weakCount ? <span className='vocab-admin-chip' data-tone='warn'>Vajab kordamist: {unit.weakCount}</span> : null}
        </div>
      </div>
      {unit.waitingForPublish ? <p className='vocab-admin-waiting' role='status'>Kiur on {unit.waitingForPublish.passedUnitLabel} läbinud — avalda {unit.label}, et see avaneks.</p> : null}
      <dl className='vocab-admin-stats'>
        <div><dt>Sõnu</dt><dd>{unit.wordCount}{unit.retiredWordCount ? ` (+${unit.retiredWordCount} peidetud)` : ''}</dd></div>
        <div><dt>Õppimine esimesel korral</dt><dd>{unit.studyFirstKnown !== null && unit.studyTotal ? `${unit.studyFirstKnown}/${unit.studyTotal}` : '–'}</dd></div>
        <div><dt>Esimene test</dt><dd>{scoreLabel(unit.firstTest)}</dd></div>
        <div><dt>Viimane test</dt><dd>{scoreLabel(unit.latestTest)}</dd></div>
        <div><dt>Parim test</dt><dd>{scoreLabel(unit.bestTest)}</dd></div>
        <div><dt>Testivoore / testikordi</dt><dd>{unit.fullRounds} / {unit.testSessions}</dd></div>
        <div><dt>Läbitud</dt><dd>{unit.testPassedAt ? `${dateLabel(unit.testPassedAt)} · ${unit.passedScore}/${unit.passedTotal}` : '–'}</dd></div>
      </dl>
      {editing ? (
        <form className='parent-form parent-task-form' onSubmit={(event) => { event.preventDefault(); void patch(unit.hasHistory ? { title } : { title, unitNumber: Number(unitNumber) }, 'Õppetükk muudetud.'); }}>
          <label><span>Number</span><input type='number' min={1} max={999} value={unitNumber} disabled={unit.hasHistory} onChange={(event) => setUnitNumber(event.target.value)} /></label>
          <label><span>Pealkiri</span><input value={title} maxLength={80} onChange={(event) => setTitle(event.target.value)} /></label>
          {unit.hasHistory ? <p>Numbrit ei saa muuta, sest laps on seda õppetükki juba kasutanud.</p> : null}
          <div className='parent-action-row'>
            <button type='button' className='filter-chip' onClick={() => setEditing(false)}>Tühista</button>
            <button type='submit'>Salvesta</button>
          </div>
        </form>
      ) : null}
      <div className='vocab-admin-actions'>
        <button type='button' className='view-button' disabled={!unit.published && unit.wordCount === 0} onClick={() => void patch({ published: !unit.published }, unit.published ? 'Õppetükk peidetud.' : 'Õppetükk avaldatud.')}>{unit.published ? 'Peida lapse eest' : 'Avalda'}</button>
        {canUnlockByHand ? <button type='button' className='filter-chip' onClick={() => void patch({ manualUnlock: !unit.manualUnlock }, unit.manualUnlock ? 'Käsitsi avamine eemaldatud.' : 'Õppetükk avatud käsitsi.')}>{unit.manualUnlock ? 'Eemalda käsitsi avamine' : 'Ava käsitsi'}</button> : null}
        <button type='button' className='filter-chip' onClick={() => { if (!editing) { setTitle(unit.title); setUnitNumber(String(unit.unitNumber)); } setEditing(!editing); }}>Muuda</button>
        <button type='button' className='filter-chip' aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Peida sõnad' : 'Sõnad ja statistika'}</button>
        {!unit.hasHistory ? <button type='button' className='delete-button' onClick={() => void remove()}>Kustuta</button> : null}
      </div>
      {open ? <UnitWords unit={unit} setError={setError} onChanged={onChanged} /> : null}
    </div>
  );
}

export default function ParentEnglishVocabulary({ setNotice, setError, onSummary }: { setNotice: (value: string) => void; setError: (value: string) => void; onSummary?: (summary: string) => void }) {
  const [units, setUnits] = useState<ParentUnitSummary[] | null>(null);
  const [unitNumber, setUnitNumber] = useState('');
  const [title, setTitle] = useState('');

  const load = useCallback(() => {
    void request<{ units: ParentUnitSummary[] }>('/api/parent/english-vocabulary')
      .then((body) => setUnits(body.units))
      .catch((error: Error) => setError(error.message));
  }, [setError]);
  useEffect(load, [load]);

  useEffect(() => {
    if (!units || !onSummary) return;
    const published = units.filter((unit) => unit.published).length;
    onSummary(`${units.length} ${unitWord(units.length)} · avaldatud ${published}`);
  }, [onSummary, units]);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await request('/api/parent/english-vocabulary/units', json('POST', { unitNumber: Number(unitNumber), title }));
      setUnitNumber('');
      setTitle('');
      setNotice('Õppetükk loodud.');
      load();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Õppetükki ei saanud luua.');
    }
  };

  return (
    <>
      <section className='parent-card'>
        <p>Kiur õpib iga õppetüki kõigepealt kaartidega ja teeb siis kirjutamistesti. Järgmine avaldatud õppetükk avaneb, kui test on ühe korraga vähemalt 95%. Avaldamata õppetükki laps ei näe — see ei avane ka käsitsi, enne kui on avaldatud. Avaldatud õppetüki saab avada ka käsitsi, ilma eelmise testita. Harjutus ise lülitatakse sisse „Harjutuste kogu“ all (Sõnavara).</p>
      </section>
      <VocabularyImport onImported={load} setNotice={setNotice} setError={setError} />
      <section className='parent-card'>
        <h3>Õppetükid</h3>
        {units === null ? <p>Laadin…</p> : units.length === 0 ? <p>Õppetükke veel ei ole. Impordi sõnad failist või loo õppetükk käsitsi.</p> : (
          <div className='vocab-admin'>
            {units.map((unit) => <UnitRow key={unit.id} unit={unit} onChanged={load} setError={setError} setNotice={setNotice} />)}
          </div>
        )}
        <form className='parent-form parent-task-form' onSubmit={(event) => void create(event)}>
          <label><span>Õppetüki number</span><input type='number' min={1} max={999} value={unitNumber} onChange={(event) => setUnitNumber(event.target.value)} placeholder='7' /></label>
          <label><span>Pealkiri</span><input value={title} maxLength={80} onChange={(event) => setTitle(event.target.value)} placeholder='My Family' /></label>
          <div className='parent-action-row'><button type='submit' disabled={!unitNumber}>Loo õppetükk</button></div>
        </form>
      </section>
    </>
  );
}
