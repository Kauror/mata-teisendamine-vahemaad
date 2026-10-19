'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import type { MapViewData, MapViewFeature } from '@/content/kaardimang/types';
import { MARKER_MIN_HIT_PX, markerHitRadii } from './mapAnswers';
import { MAX_ZOOM, TAP_SLOP_PX, fullView, panBy, toMap, zoomAround, zoomOf, type ScreenBox, type ZoomView } from './mapZoom';

// One pre-projected map view as SVG. It never moves, zooms or reloads by
// itself: a new question only changes the paint, the pins and the labels
// (props), so the same <svg> stays mounted for the whole round. The player
// can pinch, drag, scroll or press +/− to zoom inside the map's own box, and
// that zoom stays put between questions.
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

function useUnitsPerPixel(ref: React.RefObject<SVGSVGElement | null>, viewW: number, viewH: number) {
  const [units, setUnits] = useState(1);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return undefined;
    const measure = () => {
      const box = svg.getBoundingClientRect();
      if (box.width > 0 && box.height > 0) setUnits(Math.max(viewW / box.width, viewH / box.height));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => observer.disconnect();
  }, [ref, viewW, viewH]);
  return units;
}

// Where the drawing sits on screen. The <svg> box can be wider than the map
// (letterboxed by max-height), so this comes from the drawing's own transform.
function screenBox(svg: SVGSVGElement, view: ZoomView): ScreenBox | null {
  const ctm = svg.getScreenCTM();
  if (!ctm || ctm.a === 0) return null;
  return { left: ctm.e + view.x * ctm.a, top: ctm.f + view.y * ctm.d, width: view.w * ctm.a, height: view.h * ctm.d };
}

type Gesture =
  | { kind: 'idle' }
  | { kind: 'press'; id: number; x0: number; y0: number; touch: boolean }
  | { kind: 'pan'; id: number; x: number; y: number; touch: boolean }
  | { kind: 'pinch'; d0: number; k0: number; at: { x: number; y: number } };

// Pinch, drag, wheel and +/− for one map. While fingers move, the viewBox is
// written straight to the DOM (hundreds of paths must not re-render per
// frame); React state catches up when the gesture ends, which re-sizes the
// labels and dots for the new zoom.
function useMapZoom(ref: React.RefObject<SVGSVGElement | null>, width: number, height: number) {
  const [view, setView] = useState<ZoomView>(() => fullView(width, height));
  const live = useRef(view);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<Gesture>({ kind: 'idle' });
  // Set when the last press became a drag or a pinch: its click is not a pick.
  const dragged = useRef(false);

  const apply = useCallback((next: ZoomView, commit: boolean) => {
    live.current = next;
    ref.current?.setAttribute('viewBox', `${next.x} ${next.y} ${next.w} ${next.h}`);
    if (commit) setView(next);
  }, [ref]);

  useEffect(() => {
    if (live.current.w !== width || live.current.h !== height || live.current.x !== 0 || live.current.y !== 0) apply(fullView(width, height), true);
  }, [apply, width, height]);

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 1) {
      dragged.current = false;
      gesture.current = { kind: 'press', id: event.pointerId, x0: event.clientX, y0: event.clientY, touch: event.pointerType !== 'mouse' };
      return;
    }
    const svg = ref.current;
    const [a, b] = [...pointers.current.values()];
    const box = svg ? screenBox(svg, live.current) : null;
    if (pointers.current.size !== 2 || !a || !b || !box) return;
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    gesture.current = { kind: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, k0: zoomOf(live.current, width), at: toMap(live.current, box, mx, my) };
    dragged.current = true;
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const svg = ref.current;
    if (!svg || !pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const current = gesture.current;
    if (current.kind === 'pinch') {
      const [a, b] = [...pointers.current.values()];
      const box = screenBox(svg, live.current);
      if (!a || !b || !box) return;
      const k = current.k0 * (Math.hypot(a.x - b.x, a.y - b.y) / current.d0);
      apply(zoomAround(width, height, box, k, current.at, (a.x + b.x) / 2, (a.y + b.y) / 2), false);
      return;
    }
    if (current.kind === 'press' && current.id === event.pointerId) {
      if (Math.hypot(event.clientX - current.x0, event.clientY - current.y0) < TAP_SLOP_PX) return;
      // Captured only now: capturing on press would retarget a tap's click.
      try { svg.setPointerCapture(event.pointerId); } catch { /* the pointer is already gone */ }
      dragged.current = true;
      gesture.current = { kind: 'pan', id: event.pointerId, x: current.x0, y: current.y0, touch: current.touch };
    }
    const pan = gesture.current;
    if (pan.kind !== 'pan' || pan.id !== event.pointerId) return;
    const dx = event.clientX - pan.x;
    const dy = event.clientY - pan.y;
    gesture.current = { ...pan, x: event.clientX, y: event.clientY };
    if (zoomOf(live.current, width) <= 1.001) {
      // Not zoomed in: a finger drag scrolls the page as it would elsewhere.
      if (pan.touch) window.scrollBy(0, -dy);
      return;
    }
    const box = screenBox(svg, live.current);
    if (box) apply(panBy(live.current, box, dx, dy, width, height), false);
  };

  const onPointerEnd = (event: PointerEvent<SVGSVGElement>) => {
    if (!pointers.current.delete(event.pointerId)) return;
    const was = gesture.current.kind;
    const rest = [...pointers.current.entries()];
    if (rest.length === 1 && was === 'pinch') {
      // One finger lifted: the other carries on as a drag.
      const [id, at] = rest[0];
      gesture.current = { kind: 'pan', id, x: at.x, y: at.y, touch: true };
    } else if (rest.length === 0) {
      gesture.current = { kind: 'idle' };
    }
    if (was === 'pan' || was === 'pinch') setView(live.current);
  };

  // The wheel and a trackpad pinch zoom the map; the listener can't be passive.
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return undefined;
    const onWheel = (event: WheelEvent) => {
      const box = screenBox(svg, live.current);
      if (!box) return;
      event.preventDefault();
      const k = zoomOf(live.current, width) * Math.exp(-event.deltaY * (event.ctrlKey ? 0.01 : 0.002));
      apply(zoomAround(width, height, box, k, toMap(live.current, box, event.clientX, event.clientY), event.clientX, event.clientY), true);
    };
    // Safari's own pinch gesture would zoom the whole page.
    const stop = (event: Event) => event.preventDefault();
    svg.addEventListener('wheel', onWheel, { passive: false });
    svg.addEventListener('gesturestart', stop);
    svg.addEventListener('gesturechange', stop);
    return () => {
      svg.removeEventListener('wheel', onWheel);
      svg.removeEventListener('gesturestart', stop);
      svg.removeEventListener('gesturechange', stop);
    };
  }, [ref, apply, width, height]);

  const zoomBy = (factor: number) => {
    const svg = ref.current;
    const box = svg ? screenBox(svg, live.current) : null;
    if (!box) return;
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    apply(zoomAround(width, height, box, zoomOf(live.current, width) * factor, toMap(live.current, box, cx, cy), cx, cy), true);
  };

  return {
    view,
    zoom: zoomOf(view, width),
    wasDrag: () => dragged.current,
    handlers: { onPointerDown, onPointerMove, onPointerUp: onPointerEnd, onPointerCancel: onPointerEnd },
    zoomBy,
    reset: () => apply(fullView(width, height), true),
  };
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
  const { view, zoom, wasDrag, handlers, zoomBy, reset } = useMapZoom(ref, data.width, data.height);
  const units = useUnitsPerPixel(ref, view.w, view.h);
  const placed = useMemo(() => placeLabels(labels, units), [labels, units]);
  const tapRadii = useMemo(() => markerHitRadii(data.markers, units), [data.markers, units]);
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
    if (!onPick || wasDrag()) return;
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
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        role='group'
        aria-label={ariaLabel}
        onClick={onClick}
        onKeyDown={onKeyDown}
        {...handlers}
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
                <circle className='km-marker-tap' cx={marker.x} cy={marker.y} r={tapRadii.get(marker.id) ?? marker.hr} />
                <circle className='km-marker-hit' cx={marker.x} cy={marker.y} r={Math.max(marker.hr, MARKER_MIN_HIT_PX * units)} />
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
      <div className='km-zoom'>
        <button type='button' className='km-zoom-button' aria-label='Suurenda kaarti' disabled={zoom >= MAX_ZOOM - 0.01} onClick={() => zoomBy(2)}>+</button>
        <button type='button' className='km-zoom-button' aria-label='Vähenda kaarti' disabled={zoom <= 1.01} onClick={() => zoomBy(0.5)}>−</button>
        {zoom > 1.01 ? <button type='button' className='km-zoom-button' aria-label='Näita kogu kaarti' onClick={reset}>⟲</button> : null}
      </div>
    </div>
  );
}
