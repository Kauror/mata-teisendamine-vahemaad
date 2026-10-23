'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ESTONIA, LEVELS, MAP_VIEWS, WORLD_PARTS, type LevelId } from '@/content/kaardimang/regions';
import { KAARDIMANG_PAGES, type CompetitionSummary, type ParentCompetitionResponse } from '@/lib/kaardimang/api';
import { DEFAULT_REWARDS, MEDALS, PLAYER_NAMES, PLAYERS, type KaardimangPlayer } from '@/lib/kaardimang/competition';
import { parentKaardimangClient } from './kaardimangClient';

// The parent's side of the family competition (backlog KM-02): each player's
// level, opening a competition on chosen maps for a number of days with the
// stars for places 1–3, ending it early or extending it, and past results.
// Kairi and Kaur play from here.

function viewLabel(id: string): string {
  const view = MAP_VIEWS.find((item) => item.id === id);
  if (!view) return id;
  if (view.kind === 'estonia') return ESTONIA.nameEt;
  if (view.kind === 'world') return 'Maailm';
  const part = WORLD_PARTS.find((item) => item.id === view.worldPart)!;
  if (view.kind !== 'subregion') return part.id === 'antarctica' ? part.nameEt : `Kogu ${part.nameEt}`;
  return part.subregions.find((sub) => sub.id === view.subregion)?.nameEt ?? id;
}

// Eesti first, then each world part with its own regions.
const VIEW_GROUPS: Array<{ label: string; ids: string[] }> = [
  { label: 'Eesti ja maailm', ids: ['estonia', 'world'] },
  ...WORLD_PARTS.filter((part) => part.id !== 'antarctica').map((part) => ({
    label: part.nameEt,
    ids: MAP_VIEWS.filter((view) => view.worldPart === part.id).map((view) => view.id)
  }))
];

function Standings({ competition }: { competition: CompetitionSummary }) {
  return (
    <ol className='km-comp-table'>
      {competition.standings.map((row) => (
        <li key={row.player}>
          <span>{row.rank <= 3 && row.points > 0 ? MEDALS[row.rank - 1] : `${row.rank}.`}</span>
          <strong>{PLAYER_NAMES[row.player]}</strong>
          <span>{row.points} p · õpitud {row.learnedTotal}</span>
        </li>
      ))}
    </ol>
  );
}

export default function KaardimangCompetitionPanel() {
  const [data, setData] = useState<ParentCompetitionResponse | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState('Eesti maakonnad');
  const [views, setViews] = useState<string[]>(['estonia']);
  const [days, setDays] = useState(14);
  const [rewards, setRewards] = useState<[number, number, number]>([...DEFAULT_REWARDS]);
  const [extendBy, setExtendBy] = useState(3);
  const [confirmEnd, setConfirmEnd] = useState(false);

  useEffect(() => {
    void parentKaardimangClient.competition().then((result) => {
      if (result.ok) setData(result.data);
      else setMessage(result.error.message);
    });
  }, []);

  const apply = async (work: () => ReturnType<typeof parentKaardimangClient.competition>, done: string) => {
    setBusy(true);
    setMessage(null);
    const result = await work();
    setBusy(false);
    setConfirmEnd(false);
    if (result.ok) { setData(result.data); setMessage(done); } else setMessage(result.error.message);
  };

  const active = data?.active ?? null;
  const toggleView = (id: string) => setViews((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  return (
    <div className='km-parent km-parent-comp'>
      {message ? <p role='status'>{message}</p> : null}

      <div className='tb-actions'>
        {(['kairi', 'kaur'] as const).map((player) => (
          <Link key={player} className='tb-button tb-button-primary' href={KAARDIMANG_PAGES.parent(player)}>▶ Mängi {player === 'kairi' ? 'Kairina' : 'Kaurina'}</Link>
        ))}
      </div>

      {data ? (
        <>
          <h3>Tasemed</h3>
          <div className='km-levels'>
            {PLAYERS.map((player: KaardimangPlayer) => (
              <label key={player} className='km-level-row'>
                <span>{PLAYER_NAMES[player]}</span>
                <select value={data.levels[player]} disabled={busy} onChange={(event) => void apply(() => parentKaardimangClient.setLevel(player, event.target.value as LevelId), `${PLAYER_NAMES[player]}: tase muudetud.`)}>
                  {LEVELS.map((level) => <option key={level.id} value={level.id}>{level.nameEt}</option>)}
                </select>
              </label>
            ))}
          </div>

          <h3>Võistlus</h3>
          {active ? (
            <div className='km-card km-comp'>
              <p className='km-comp-title'>🏆 „{active.title}“ · {active.daysLeftEt} (kuni {active.endDate.split('-').reverse().join('.')})</p>
              <p className='tb-muted'>Kaardid: {active.views.map(viewLabel).join(', ')}. Auhinnad lastele: {active.rewards.join(' / ')} tähte.</p>
              <Standings competition={active} />
              <div className='tb-actions'>
                <label className='km-inline'>Pikenda <input type='number' min={1} max={60} value={extendBy} onChange={(event) => setExtendBy(Number(event.target.value))} /> päeva</label>
                <button type='button' className='filter-chip' disabled={busy} onClick={() => void apply(() => parentKaardimangClient.changeCompetition({ action: 'extend', id: active.id, days: extendBy }), 'Võistlust pikendati.')}>Pikenda</button>
                {confirmEnd ? (
                  <>
                    <button type='button' className='filter-chip' disabled={busy} onClick={() => void apply(() => parentKaardimangClient.changeCompetition({ action: 'end', id: active.id }), 'Võistlus lõpetati, auhinnad on jagatud.')}>Jah, lõpeta ja jaga auhinnad</button>
                    <button type='button' className='filter-chip' onClick={() => setConfirmEnd(false)}>Loobu</button>
                  </>
                ) : <button type='button' className='filter-chip' onClick={() => setConfirmEnd(true)}>Lõpeta kohe</button>}
              </div>
            </div>
          ) : (
            <form className='km-card km-comp-form' onSubmit={(event) => {
              event.preventDefault();
              void apply(() => parentKaardimangClient.changeCompetition({ action: 'create', title, views, days, rewards }), 'Võistlus on avatud.');
            }}>
              <label>Nimi <input value={title} maxLength={60} onChange={(event) => setTitle(event.target.value)} required /></label>
              <fieldset>
                <legend>Kaardid</legend>
                {VIEW_GROUPS.map((group) => (
                  <div key={group.label} className='km-chips'>
                    {group.ids.map((id) => (
                      <button key={id} type='button' className='filter-chip' aria-pressed={views.includes(id)} onClick={() => toggleView(id)}>{viewLabel(id)}</button>
                    ))}
                  </div>
                ))}
              </fieldset>
              <label>Kestus <input type='number' min={1} max={60} value={days} onChange={(event) => setDays(Number(event.target.value))} /> päeva</label>
              <fieldset>
                <legend>Tähed lastele (1. / 2. / 3. koht)</legend>
                <div className='km-rewards'>
                  {rewards.map((stars, index) => (
                    <input key={index} type='number' min={0} max={200} aria-label={`${index + 1}. koht`} value={stars}
                      onChange={(event) => setRewards((current) => current.map((value, i) => (i === index ? Number(event.target.value) : value)) as [number, number, number])} />
                  ))}
                </div>
              </fieldset>
              <p className='tb-muted'>Punkte annavad iga mängija päeva kolm esimest vooru nendel kaartidel. Vanemad saavad medali, tähti mitte.</p>
              <button type='submit' className='tb-button tb-button-primary' disabled={busy || views.length === 0}>Ava võistlus</button>
            </form>
          )}

          {data.history.length ? (
            <details>
              <summary>Varasemad võistlused ({data.history.length})</summary>
              {data.history.map((competition) => (
                <div key={competition.id} className='km-comp-history'>
                  <p><strong>„{competition.title}“</strong> · lõppes {competition.endDate.split('-').reverse().join('.')}</p>
                  <Standings competition={competition} />
                </div>
              ))}
            </details>
          ) : null}
        </>
      ) : <p>Laadin...</p>}
    </div>
  );
}
