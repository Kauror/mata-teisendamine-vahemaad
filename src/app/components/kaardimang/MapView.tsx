'use client';

import { memo, useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import type { MapViewData, MapViewFeature } from '@/content/kaardimang/types';

// One pre-projected map view as SVG. It never moves, zooms or reloads by
// itself: a new question only changes the paint, the pins and the labels
// (props), so the same <svg> stays mounted for the whole round.
//
// Labels and pins are drawn inside the SVG at a constant on-screen size: the
// component measures how many map units one CSS pixel is and scales them.

export type Paint = 'highlight' | 'correct' | 'wrong' | 'selected' | 'dim' | null;
export type MapPick =
  | { kind: 'land'; id: string; wp: string | null; ct: string | null }
  | { kind: 'marker'; id: string }
  | { kind: 'area'; id: string }
  | { kind: 'sea' };
export type MapLabel = { id: string; text: string; x: number; y: number; room: number; strong?: boolean };
export type MapPin = { id: string; x: number; y: number; tone: 'capital' | 'answer' };

type Props = {
  data: MapViewData;
  ariaLabel: string;
  paint: (feature: Pick<MapViewFeature, 'id' | 'wp' | 'ct'>) => Paint;
  areaPaint?: (id: string) => Paint;
  showAreas: boolean;
  labels: MapLabel[];
  pins: MapPin[];
  // Which places can be focused with Tab and named for a screen reader.
  focusable: (id: string) => boolean;
  nameOf: (id: string) => string;
  onPick: ((pick: MapPick) => void) | null;
  // All land one colour (continents, world parts, oceans): no country stands out.
  uniform?: boolean;
};

const LABEL_PX = 12;
const CHAR_PX = 6.6;

function useUnitsPerPixel(ref: React.RefObject<SVGSVGElement | null>, data: MapViewData) {
  const [units, setUnits] = useState(1);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return undefined;
    const measure = () => {
      const box = svg.getBoundingClientRect();
      if (box.width > 0 && box.height > 0) setUnits(Math.max(data.width / box.width, data.height / box.height));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => observer.disconnect();
  }, [ref, data.width, data.height]);
  return units;
}

// Greedy placement: strong labels first, then bigger countries; a label that
// would touch one already placed, or overflow its country, is left out.
function placeLabels(labels: MapLabel[], units: number) {
  const placed: Array<MapLabel & { w: number; h: number }> = [];
  const order = [...labels].sort((left, right) => Number(Boolean(right.strong)) - Number(Boolean(left.strong)) || right.room - left.room);
  for (const label of order) {
    const w = (label.text.length * CHAR_PX + 6) * units;
    const h = (LABEL_PX + 4) * units;
    if (!label.strong && w > label.room * 1.6) continue;
    const clash = placed.some((other) => Math.abs(other.x - label.x) * 2 < other.w + w && Math.abs(other.y - label.y) * 2 < other.h + h);
    if (!clash) placed.push({ ...label, w, h });
  }
  return placed;
}

const Land = memo(function Land({ features, paint, focusable, nameOf, interactive }: {
  features: MapViewFeature[];
  paint: Props['paint'];
  focusable: Props['focusable'];
  nameOf: Props['nameOf'];
  interactive: boolean;
}) {
  return (
    <g className='km-land'>
      {features.map((feature, index) => {
        const tone = paint(feature);
        const canFocus = interactive && focusable(feature.id);
        return (
          <path
            key={`${feature.id}-${index}`}
            d={feature.d}
            data-id={feature.id}
            data-wp={feature.wp ?? ''}
            data-ct={feature.ct ?? ''}
            data-role={feature.role}
            data-paint={tone ?? undefined}
            className='km-feature'
            {...(canFocus ? { tabIndex: 0, role: 'button', 'aria-label': nameOf(feature.id) } : { 'aria-hidden': true })}
          />
        );
      })}
    </g>
  );
});

export default function MapView({ data, ariaLabel, paint, areaPaint, showAreas, labels, pins, focusable, nameOf, onPick, uniform = false }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const units = useUnitsPerPixel(ref, data);
  const placed = useMemo(() => placeLabels(labels, units), [labels, units]);
  const interactive = Boolean(onPick);

  const pickFrom = (target: Element | null): MapPick | null => {
    const node = target?.closest('[data-pick]') ?? target?.closest('[data-id]');
    if (!node) return null;
    const kind = node.getAttribute('data-pick');
    const id = node.getAttribute('data-id') ?? '';
    if (kind === 'sea') return { kind: 'sea' };
    if (kind === 'area') return { kind: 'area', id };
    if (kind === 'marker') return { kind: 'marker', id };
    return { kind: 'land', id, wp: node.getAttribute('data-wp') || null, ct: node.getAttribute('data-ct') || null };
  };

  const onClick = (event: MouseEvent<SVGSVGElement>) => {
    if (!onPick) return;
    const pick = pickFrom(event.target as Element);
    if (pick) onPick(pick);
  };
  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (!onPick || (event.key !== 'Enter' && event.key !== ' ')) return;
    const pick = pickFrom(event.target as Element);
    if (pick && pick.kind !== 'sea') {
      event.preventDefault();
      onPick(pick);
    }
  };

  return (
    <div className='km-map' data-interactive={interactive ? 'true' : 'false'} data-uniform={uniform ? 'true' : undefined}>
      <svg
        ref={ref}
        viewBox={`0 0 ${data.width} ${data.height}`}
        role='group'
        aria-label={ariaLabel}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        <rect className='km-sea' data-pick='sea' x={0} y={0} width={data.width} height={data.height} />
        {data.sphere ? <path className='km-sphere' data-pick='sea' d={data.sphere} /> : null}
        {data.areas.map((area, index) => (
          <path
            key={`${area.id}-${index}`}
            className='km-area'
            data-pick='area'
            data-id={area.id}
            data-visible={showAreas ? 'true' : 'false'}
            data-paint={areaPaint?.(area.id) ?? undefined}
            d={area.d}
            {...(showAreas && interactive && index === data.areas.findIndex((item) => item.id === area.id)
              ? { tabIndex: 0, role: 'button', 'aria-label': nameOf(area.id) }
              : { 'aria-hidden': true })}
          />
        ))}
        <Land features={data.features} paint={paint} focusable={focusable} nameOf={nameOf} interactive={interactive} />
        <g className='km-markers'>
          {data.markers.map((marker) => {
            const tone = paint({ id: marker.id, wp: null, ct: null });
            const canFocus = interactive && focusable(marker.id);
            return (
              <g
                key={marker.id}
                data-pick='marker'
                data-id={marker.id}
                data-paint={tone ?? undefined}
                className='km-marker'
                {...(canFocus ? { tabIndex: 0, role: 'button', 'aria-label': nameOf(marker.id) } : { 'aria-hidden': true })}
              >
                <circle className='km-marker-hit' cx={marker.x} cy={marker.y} r={Math.max(marker.hr, 10 * units)} />
                <circle className='km-marker-dot' cx={marker.x} cy={marker.y} r={Math.max(marker.r, 4 * units)} />
              </g>
            );
          })}
        </g>
        <g className='km-pins' aria-hidden>
          {pins.map((pin) => (
            <circle key={pin.id} className='km-pin' data-tone={pin.tone} cx={pin.x} cy={pin.y} r={(pin.tone === 'answer' ? 5 : 3.5) * units} />
          ))}
        </g>
        <g className='km-labels' aria-hidden>
          {placed.map((label) => (
            <text
              key={label.id}
              x={label.x}
              y={label.y}
              className='km-label'
              data-strong={label.strong ? 'true' : undefined}
              fontSize={LABEL_PX * units}
              strokeWidth={3 * units}
            >
              {label.text}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
