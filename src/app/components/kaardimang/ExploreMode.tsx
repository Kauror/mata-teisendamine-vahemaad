'use client';

import { useCallback, useMemo, useState } from 'react';
import { CATALOG, findCountry, nameOf } from '@/content/kaardimang/catalog';
import { CONTINENTS, WORLD_PARTS, type MapViewDef } from '@/content/kaardimang/regions';
import type { MapViewData } from '@/content/kaardimang/types';
import { PLACE_HINTS } from '@/lib/kaardimang/engine';
import MapView, { type MapLabel, type MapPick, type MapPin } from './MapView';
import { contextNoteEt } from './mapAnswers';

type Selection = { id: string; kind: 'land' | 'marker' | 'area'; wp: string | null; ct: string | null } | null;

const COUNTRY_NAMES: ReadonlySet<string> = new Set(CATALOG.countries.map((country) => country.nameEt));

const ANTARCTICA_FACT = 'Antarktis on manner lõunapooluse ümber. Seal ei ole riike ega pealinnu: inimesed elavad seal ainult teadusjaamades ja enamasti lühikest aega.';

function subregionNames(countryId: string): string {
  const country = findCountry(countryId);
  if (!country) return '';
  const part = WORLD_PARTS.find((item) => item.id === country.worldPart);
  const subs = country.subregions.map((id) => part?.subregions.find((sub) => sub.id === id)?.nameEt).filter(Boolean);
  return [part?.nameEt, subs.join(', ')].filter(Boolean).join(' · ');
}

function InfoCard({ selection, view }: { selection: NonNullable<Selection>; view: MapViewDef }) {
  const country = findCountry(selection.id);
  const where = view.kind === 'world'
    ? [selection.ct && `Manner: ${CONTINENTS.find((item) => item.id === selection.ct)?.nameEt}`, selection.wp && `Maailmajagu: ${WORLD_PARTS.find((item) => item.id === selection.wp)?.nameEt}`].filter(Boolean).join(' · ')
    : '';
  if (selection.kind === 'area' || selection.id === 'south-pole') {
    const key = selection.id === 'south-pole' ? 'point:south-pole' : `ocean:${selection.id}`;
    return (
      <div className='km-card km-info' role='status'>
        <h2>{nameOf(selection.id).replace(/^./, (ch) => ch.toUpperCase())}</h2>
        <p>{PLACE_HINTS[key]}</p>
      </div>
    );
  }
  if (!country) {
    return (
      <div className='km-card km-info' role='status'>
        <h2>{nameOf(selection.id)}</h2>
        <p>{selection.id === 'ATA' ? ANTARCTICA_FACT : contextNoteEt(nameOf(selection.id), COUNTRY_NAMES)}</p>
        {where ? <p className='tb-muted'>{where}</p> : null}
      </div>
    );
  }
  return (
    <div className='km-card km-info' role='status'>
      <h2><span className='km-flag' aria-hidden>{country.flag}</span> {country.nameEt}</h2>
      {country.otherNamesEt.length ? <p className='tb-muted'>Ka: {country.otherNamesEt.join(', ')}</p> : null}
      {country.capitals.length ? (
        <ul className='km-capitals'>
          {country.capitals.map((capital) => (
            <li key={capital.id}>
              <strong>{capital.nameEt}</strong>
              {country.capitals.length > 1 || capital.role !== 'official' ? <span className='tb-muted'> – {capital.roleLabelEt}</span> : <span className='tb-muted'> – pealinn</span>}
              {capital.noteEt ? <span className='km-note'>{capital.noteEt}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
      {country.noteEt ? <p className='km-note'>{country.noteEt}</p> : null}
      <p className='tb-muted'>{where || subregionNames(country.id)}</p>
    </div>
  );
}

// Uuri kaarti: free looking around. No timer, no score, nothing is saved.
export default function ExploreMode({ view, map, title }: { view: MapViewDef; map: MapViewData; title: string }) {
  const [selection, setSelection] = useState<Selection>(null);
  const [showNames, setShowNames] = useState(false);
  const [showCapitals, setShowCapitals] = useState(false);

  const onPick = useCallback((pick: MapPick) => {
    if (pick.kind === 'sea') setSelection(null);
    else if (pick.kind === 'land') setSelection({ id: pick.id, kind: 'land', wp: pick.wp, ct: pick.ct });
    else setSelection({ id: pick.id, kind: pick.kind, wp: null, ct: null });
  }, []);

  const paint = useCallback((feature: { id: string }) => (selection && feature.id === selection.id ? 'selected' as const : null), [selection]);
  const areaPaint = useCallback((id: string) => (selection?.kind === 'area' && selection.id === id ? 'selected' as const : null), [selection]);

  const listed = useMemo(() => {
    const ids = new Set([...map.features.filter((feature) => feature.role === 't' || feature.role === 's').map((feature) => feature.id), ...map.markers.filter((marker) => findCountry(marker.id)).map((marker) => marker.id)]);
    return CATALOG.countries.filter((country) => ids.has(country.id)).sort((left, right) => left.nameEt.localeCompare(right.nameEt, 'et'));
  }, [map]);

  const { labels, pins } = useMemo(() => {
    const labels: MapLabel[] = [];
    const pins: MapPin[] = [];
    const listedIds = new Set(listed.map((country) => country.id));
    if (showNames) {
      for (const [id, at] of Object.entries(map.labels)) {
        if (listedIds.has(id)) labels.push({ id, text: nameOf(id), x: at[0], y: at[1], room: at[2] });
      }
    }
    const capitalsOf = (countryId: string) => map.capitals.filter((capital) => capital.countryId === countryId);
    const capitalIds = showCapitals ? map.capitals : selection ? capitalsOf(selection.id) : [];
    for (const capital of capitalIds) {
      const record = findCountry(capital.countryId)?.capitals.find((item) => item.id === capital.id);
      pins.push({ id: capital.id, x: capital.x, y: capital.y, tone: selection?.id === capital.countryId ? 'answer' : 'capital' });
      if (record && (showCapitals || selection?.id === capital.countryId)) {
        labels.push({ id: `cap-${capital.id}`, text: record.nameEt, x: capital.x, y: capital.y - 12 * (map.width / 1000), room: 999, strong: selection?.id === capital.countryId });
      }
    }
    if (selection && selection.kind !== 'area') {
      const at = map.labels[selection.id] ?? (() => {
        const marker = map.markers.find((item) => item.id === selection.id);
        return marker ? [marker.x, marker.y, 0] as [number, number, number] : null;
      })();
      if (at) labels.push({ id: `sel-${selection.id}`, text: nameOf(selection.id), x: at[0], y: at[1] + 16 * (map.width / 1000), room: at[2], strong: true });
    }
    return { labels, pins };
  }, [map, listed, showNames, showCapitals, selection]);

  return (
    <section className='km-explore' aria-label={`${title}: uuri kaarti`}>
      {view.kind === 'antarctica' ? null : (
        <div className='km-toggles' role='group' aria-label='Mida kaardil näidata'>
          <button type='button' className='filter-chip' aria-pressed={showNames} onClick={() => setShowNames((value) => !value)}>Riikide nimed</button>
          <button type='button' className='filter-chip' aria-pressed={showCapitals} onClick={() => setShowCapitals((value) => !value)}>Pealinnad</button>
        </div>
      )}
      <MapView
        data={map}
        ariaLabel={`${title} – kaart`}
        paint={paint}
        areaPaint={areaPaint}
        showAreas={view.kind === 'world' || view.kind === 'antarctica'}
        uniform={view.kind === 'world' || view.kind === 'antarctica'}
        labels={labels}
        pins={pins}
        focusable={(id) => Boolean(findCountry(id)) || id === 'ATA' || id === 'south-pole'}
        nameOf={nameOf}
        onPick={onPick}
      />
      {selection ? <InfoCard selection={selection} view={view} /> : <p className='km-feedback'>Puuduta kaardil riiki või kohta, et näha selle nime{view.kind === 'antarctica' ? '' : ' ja pealinna'}.</p>}
      {listed.length ? (
        <details className='km-card km-list'>
          <summary>Riigid sellel kaardil ({listed.length})</summary>
          <div className='km-list-items'>
            {listed.map((country) => (
              <button key={country.id} type='button' className='filter-chip' aria-pressed={selection?.id === country.id}
                onClick={() => setSelection({ id: country.id, kind: 'land', wp: null, ct: null })}>
                <span aria-hidden>{country.flag}</span> {country.nameEt}
              </button>
            ))}
          </div>
        </details>
      ) : null}
    </section>
  );
}
