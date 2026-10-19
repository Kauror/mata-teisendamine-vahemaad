import { describe, expect, it } from 'vitest';
import { MAX_ZOOM, clampView, isBase, mapFrame, panBy, toMap, zoomAround, zoomOf } from './mapZoom';

// Views compared to 6 decimals: the arithmetic is floating point.
function expectView(actual: { x: number; y: number; w: number; h: number }, wanted: typeof actual) {
  for (const key of ['x', 'y', 'w', 'h'] as const) expect(actual[key]).toBeCloseTo(wanted[key], 6);
}

const W = 1100;
const H = 600;
// A regional map (land to its edges): 1000 × 600 shown at 1×, 50 hidden each side.
const REGION = mapFrame(W, H, false);
// The drawing shown 500 × 300 px, 20 px from the left and 100 px down.
const BOX = { left: 20, top: 100, width: 500, height: 300 };

describe('Kaardimäng zoom', () => {
  it('makes the map box 10% taller than the map', () => {
    expectView(REGION.base, { x: 50, y: 0, w: 1000, h: 600 });
    expect((W / H) / (REGION.base.w / REGION.base.h)).toBeCloseTo(1.1);
    // A globe gets the height as empty space above and below instead.
    const world = mapFrame(1000, 500, true);
    expectView(world.base, { x: 0, y: -25, w: 1000, h: 550 });
    expect(world.bounds).toEqual(world.base);
  });

  it('starts at 1× on the whole frame', () => {
    expect(zoomOf(REGION.base, REGION)).toBe(1);
    expect(isBase(REGION.base, REGION)).toBe(true);
  });

  it('keeps the point under the fingers in place while zooming', () => {
    const at = toMap(REGION.base, BOX, 145, 175); // a quarter in from the left and top
    expect(at).toEqual({ x: 300, y: 150 });
    const zoomed = zoomAround(REGION, BOX, 4, at, 145, 175);
    expect(zoomOf(zoomed, REGION)).toBe(4);
    expect(toMap(zoomed, BOX, 145, 175)).toEqual({ x: 300, y: 150 });
  });

  it('never zooms out past the frame or in past the limit, and keeps the aspect ratio', () => {
    const out = zoomAround(REGION, BOX, 0.2, { x: 550, y: 300 }, 270, 250);
    expectView(out, REGION.base);
    const deep = zoomAround(REGION, BOX, 50, { x: 550, y: 300 }, 270, 250);
    expect(zoomOf(deep, REGION)).toBe(MAX_ZOOM);
    expect(deep.w / deep.h).toBeCloseTo(REGION.base.w / REGION.base.h);
  });

  it('keeps the view inside the map at the edges', () => {
    const corner = zoomAround(REGION, BOX, 2, { x: 0, y: 0 }, 520, 400);
    expect(corner.x).toBe(0);
    expect(corner.y).toBe(0);
    expectView(clampView({ x: 900, y: 500, w: 500, h: 300 }, REGION), { x: 600, y: 300, w: 500, h: 300 });
  });

  it('drags the map with the finger, and at 1× only sideways into the cropped edges', () => {
    const view = { x: 250, y: 150, w: 500, h: 300 }; // 2×
    // Finger moves 50 px right and 30 px down: the map follows it.
    expectView(panBy(view, BOX, 50, 30, REGION), { x: 200, y: 120, w: 500, h: 300 });
    // At 1× the hidden 50 units each side can be dragged in, no further.
    expectView(panBy(REGION.base, BOX, 80, 80, REGION), { x: 0, y: 0, w: 1000, h: 600 });
    expect(isBase(panBy(REGION.base, BOX, 80, 0, REGION), REGION)).toBe(false);
  });
});
