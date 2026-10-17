'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  LEVELS,
  WORLD_PARTS,
  WORLD_SETS,
  findView,
  viewId,
  type LevelId,
  type WorldPartId,
  type WorldSetId
} from '@/content/kaardimang/regions';
import type { MapViewData } from '@/content/kaardimang/types';
import type { KaardimangScope, OverviewResponse, RoundView } from '@/lib/kaardimang/api';
import ExploreMode from './ExploreMode';
import PlayMode from './PlayMode';
import { createKaardimangClient, loadMap, newActionId } from './kaardimangClient';

type Place = WorldPartId | 'world';
type Screen =
  | { name: 'home' }
  | { name: 'part'; place: Place }
  | { name: 'explore'; place: Place; viewId: string }
  | { name: 'play'; place: Place; viewId: string; round: RoundView };

const WORLD = { id: 'world' as const, nameEt: 'Maailm', icon: '🌍' };

function placeName(place: Place) {
  return place === 'world' ? WORLD.nameEt : WORLD_PARTS.find((part) => part.id === place)!.nameEt;
}

function viewTitle(id: string, setId: WorldSetId | null = null): string {
  const view = findView(id);
  if (!view) return id;
  if (view.kind === 'world') return setId ? `Maailm · ${WORLD_SETS.find((set) => set.id === setId)?.nameEt}` : 'Maailm';
  const part = WORLD_PARTS.find((item) => item.id === view.worldPart)!;
  if (view.kind !== 'subregion') return part.id === 'antarctica' ? part.nameEt : `Kogu ${part.nameEt}`;
  return `${part.nameEt} · ${part.subregions.find((sub) => sub.id === view.subregion)?.nameEt}`;
}

function placeOfView(id: string): Place {
  const view = findView(id);
  return view?.worldPart ?? 'world';
}

function useMap(id: string | null) {
  const [state, setState] = useState<{ id: string; map: MapViewData | null; failed: boolean } | null>(null);
  useEffect(() => {
    if (!id) return undefined;
    let live = true;
    setState({ id, map: null, failed: false });
    loadMap(id).then((map) => { if (live) setState({ id, map, failed: false }); }, () => { if (live) setState({ id, map: null, failed: true }); });
    return () => { live = false; };
  }, [id]);
  return state && state.id === id ? state : null;
}

export default function KaardimangApp({ scope, backHref, backLabel }: { scope: KaardimangScope; backHref: string; backLabel: string }) {
  const client = useMemo(() => createKaardimangClient(scope), [scope]);
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [subregion, setSubregion] = useState<Record<string, string | null>>({});
  const [worldSet, setWorldSet] = useState<WorldSetId>('continents');
  const [level, setLevel] = useState<LevelId>('explorer');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    void client.overview().then((result) => {
      if (result.ok) setOverview(result.data);
      else setError(result.error.message);
    });
  };
  useEffect(refresh, [client]);

  const activeViewId = screen.name === 'explore' || screen.name === 'play' ? screen.viewId : null;
  const mapState = useMap(activeViewId);

  const goHome = () => { setError(null); setScreen({ name: 'home' }); refresh(); };
  const openPart = (place: Place) => { setError(null); setScreen({ name: 'part', place }); };

  const selectedViewId = (place: Place) => (place === 'world' ? 'world' : viewId(place, subregion[place] ?? null));

  const start = async (place: Place) => {
    setBusy(true);
    setError(null);
    const id = selectedViewId(place);
    const result = await client.start({ actionId: newActionId(), viewId: id, setId: place === 'world' ? worldSet : null, level });
    setBusy(false);
    if (result.ok) setScreen({ name: 'play', place, viewId: id, round: result.data });
    else setError(result.error.message);
  };

  const resume = async () => {
    if (!overview?.activeRound) return;
    setBusy(true);
    const result = await client.round(overview.activeRound.roundId);
    setBusy(false);
    if (result.ok) setScreen({ name: 'play', place: placeOfView(result.data.viewId), viewId: result.data.viewId, round: result.data });
    else setError(result.error.message);
  };

  const header = (back: { label: string; onClick?: () => void; href?: string }) => (
    back.href
      ? <Link className='practice-back-button' href={back.href}>← {back.label}</Link>
      : <button type='button' className='practice-back-button' onClick={back.onClick}>← {back.label}</button>
  );

  const problem = error ? <p className='km-error' role='alert'>{error}</p> : null;

  if (screen.name === 'home') {
    const active = overview?.activeRound;
    return (
      <main className='tb-page km-page' data-scope={scope}>
        <section className='tb-shell'>
          {header({ label: backLabel, href: backHref })}
          <header className='km-head'>
            <h1>🗺️ Kaardimäng</h1>
            <p className='tb-muted'>Vali, millist maailma osa täna uurid. Vajab internetiühendust.</p>
          </header>
          {scope === 'preview' ? <p className='km-preview-note'>Eelvaade: siin mängitud voorud ei muuda Kiuri andmeid.</p> : null}
          {problem}
          {active ? (
            <div className='km-card km-resume'>
              <p><strong>Pooleli mäng:</strong> {viewTitle(active.viewId, active.setId)} · {active.answered} / {active.total}</p>
              <button type='button' className='tb-button tb-button-primary' disabled={busy} onClick={() => void resume()}>Jätka</button>
            </div>
          ) : null}
          <button type='button' className='km-place km-place-world' onClick={() => openPart('world')}>
            <span className='km-place-icon' aria-hidden>{WORLD.icon}</span>
            <span><strong>Maailm</strong><small>Mandrid, maailmajaod, ookeanid ja suurimad riigid</small></span>
          </button>
          <div className='km-places'>
            {WORLD_PARTS.map((part) => {
              const practiced = overview?.practiced[part.id];
              return (
                <button key={part.id} type='button' className='km-place' onClick={() => openPart(part.id)}>
                  <span className='km-place-icon' aria-hidden>{part.icon}</span>
                  <span>
                    <strong>{part.nameEt}</strong>
                    <small>{part.id === 'antarctica' ? 'Lõunapoolus ja Lõuna-Jäämeri' : practiced ? `Harjutatud ${practiced[0]} / ${practiced[1]}` : 'Riigid ja pealinnad'}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    );
  }

  if (screen.name === 'part') {
    const { place } = screen;
    const part = place === 'world' ? null : WORLD_PARTS.find((item) => item.id === place)!;
    const chosen = subregion[place] ?? null;
    return (
      <main className='tb-page km-page' data-scope={scope}>
        <section className='tb-shell'>
          {header({ label: 'Kõik maailmajaod', onClick: goHome })}
          <header className='km-head'>
            <h1>{place === 'world' ? WORLD.icon : part!.icon} {placeName(place)}</h1>
          </header>
          {problem}
          {place === 'world' ? (
            <fieldset className='km-choice'>
              <legend>Mida harjutame?</legend>
              <div className='km-chips'>
                {WORLD_SETS.map((set) => (
                  <button key={set.id} type='button' className='filter-chip' aria-pressed={worldSet === set.id} onClick={() => setWorldSet(set.id)}>{set.nameEt}</button>
                ))}
              </div>
            </fieldset>
          ) : null}
          {part && part.subregions.length ? (
            <fieldset className='km-choice'>
              <legend>Kus harjutame?</legend>
              <div className='km-chips'>
                <button type='button' className='filter-chip' aria-pressed={chosen === null} onClick={() => setSubregion({ ...subregion, [place]: null })}>Kogu {part.nameEt}</button>
                {part.subregions.map((sub) => {
                  const practiced = overview?.practiced[viewId(part.id, sub.id)];
                  return (
                    <button key={sub.id} type='button' className='filter-chip' aria-pressed={chosen === sub.id} onClick={() => setSubregion({ ...subregion, [place]: sub.id })}>
                      {sub.nameEt}{practiced ? <span className='km-chip-count'> {practiced[0]}/{practiced[1]}</span> : null}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ) : null}
          {place !== 'antarctica' && (place !== 'world' || worldSet === 'largest') ? (
            <fieldset className='km-choice'>
              <legend>Raskusaste</legend>
              <div className='km-chips'>
                {LEVELS.map((item) => (
                  <button key={item.id} type='button' className='filter-chip' aria-pressed={level === item.id} onClick={() => setLevel(item.id)}>{item.nameEt}</button>
                ))}
              </div>
              <p className='tb-muted km-level-note'>{LEVELS.find((item) => item.id === level)?.descriptionEt}</p>
            </fieldset>
          ) : null}
          <div className='km-actions'>
            <button type='button' className='tb-button km-big' onClick={() => setScreen({ name: 'explore', place, viewId: selectedViewId(place) })}>🔎 Uuri kaarti</button>
            <button type='button' className='tb-button tb-button-primary km-big' disabled={busy} onClick={() => void start(place)}>▶ Mängi</button>
          </div>
        </section>
      </main>
    );
  }

  const title = viewTitle(screen.viewId, screen.name === 'play' ? screen.round.setId : null);
  return (
    <main className='tb-page km-page km-page-map' data-scope={scope}>
      <section className='tb-shell km-shell-map'>
        <div className='km-bar'>
          {header({ label: placeName(screen.place), onClick: () => { setScreen({ name: 'part', place: screen.place }); refresh(); } })}
          <h1 className='km-bar-title'>{screen.name === 'explore' ? '🔎 ' : '▶ '}{title}</h1>
        </div>
        {problem}
        {!mapState || (!mapState.map && !mapState.failed) ? <p className='km-feedback'>Laen kaarti…</p> : null}
        {mapState?.failed ? <p className='km-error' role='alert'>Kaarti ei saanud laadida. Kontrolli internetiühendust ja proovi uuesti.</p> : null}
        {mapState?.map && screen.name === 'explore' ? <ExploreMode view={findView(screen.viewId)!} map={mapState.map} title={title} /> : null}
        {mapState?.map && screen.name === 'play' ? (
          <PlayMode
            key={screen.round.roundId}
            client={client}
            map={mapState.map}
            initialRound={screen.round}
            title={title}
            onPlayAgain={() => void (async () => {
              setBusy(true);
              const result = await client.start({ actionId: newActionId(), viewId: screen.viewId, setId: screen.round.setId, level: screen.round.level });
              setBusy(false);
              if (result.ok) setScreen({ ...screen, round: result.data });
              else setError(result.error.message);
            })()}
            onLeave={() => { setScreen({ name: 'part', place: screen.place }); refresh(); }}
          />
        ) : null}
      </section>
    </main>
  );
}
