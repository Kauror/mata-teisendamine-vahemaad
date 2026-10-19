import { describe, expect, it } from 'vitest';
import { MAX_ZOOM, WORLD_TALLER, clampView, isBase, mapFrame, panBy, toMap, zoomAround, zoomOf } from './mapZoom';

// Views compared to 6 decimals: the arithmetic is floating point.
function expectView(actual: { x: number; y: number; w: number; h: number }, wanted: typeof actual) {
  for (const key of ['x', 'y', 'w', 'h'] as const) expect(actual[key]).toBeCloseTo(wanted[key], 6);
}

const W = 1000;
const H = 800;
// A regional map 1.25 : 1 becomes a square box: 800 × 800 shown at 1×, 100 hidden each side.
const REGION = mapFrame(W, H, false);
// The drawing shown 400 × 400 px, 20 px from the left and 100 px down.
const BOX = { left: 20, top: 100, width: 400, height: 400 };

describe('Kaardimäng map frame', () => {
  it('makes a wide map square, hiding its sides', () => {
    expectView(REGION.base, { x: 100, y: 0, w: 800, h: 800 });
    // Europe (1000 × 774) is square too.
    const europe = mapFrame(1000, 774, false).base;
    expect(europe.w / europe.h).toBeCloseTo(1);
  });

  it('never hides more than a quarter of a very wide map', () => {
    const wide = mapFrame(1000, 600, false).base; // 1.67 : 1, like Southern Europe
    expect(wide.w).toBeCloseTo(750);
    expect(wide.w / wide.h).toBeCloseTo(1.25);
  });

  it('keeps a map that is square or taller as it is', () => {
    const tall = mapFrame(1000, 1200, false); // like the Baltics
    expect(tall.base).toEqual({ x: 0, y: 0, w: 1000, h: 1200 });
    expect(tall.base).toEqual(tall.bounds);
  });

  it('gives the world globe empty space above and below instead of cutting it', () => {
    const world = mapFrame(1000, 512, true);
    const pad = (512 * (WORLD_TALLER - 1)) / 2;
    expectView(world.base, { x: 0, y: -pad, w: 1000, h: 512 + 2 * pad });
    expect(world.bounds).toEqual(world.base);
  });
});

describe('Kaardimäng zoom', () => {
  it('starts at 1× on the whole frame', () => {
    expect(zoomOf(REGION.base, REGION)).toBe(1);
    expect(isBase(REGION.base, REGION)).toBe(true);
  });

  it('keeps the point under the fingers in place while zooming', () => {
    const at = toMap(REGION.base, BOX, 120, 200); // a quarter in from the left and top
    expect(at.x).toBeCloseTo(300);
    expect(at.y).toBeCloseTo(200);
    const zoomed = zoomAround(REGION, BOX, 4, at, 120, 200);
    expect(zoomOf(zoomed, REGION)).toBeCloseTo(4);
    const still = toMap(zoomed, BOX, 120, 200);
    expect(still.x).toBeCloseTo(300);
    expect(still.y).toBeCloseTo(200);
  });

  it('never zooms out past the frame or in past the limit, and keeps the aspect ratio', () => {
    expectView(zoomAround(REGION, BOX, 0.2, { x: 500, y: 400 }, 220, 300), REGION.base);
    const deep = zoomAround(REGION, BOX, 50, { x: 500, y: 400 }, 220, 300);
    expect(zoomOf(deep, REGION)).toBeCloseTo(MAX_ZOOM);
    expect(deep.w / deep.h).toBeCloseTo(1);
  });

  it('keeps the view inside the map at the edges', () => {
    const corner = zoomAround(REGION, BOX, 2, { x: 0, y: 0 }, 420, 500);
    expect(corner.x).toBeCloseTo(0);
    expect(corner.y).toBeCloseTo(0);
    expectView(clampView({ x: 900, y: 700, w: 400, h: 400 }, REGION), { x: 600, y: 400, w: 400, h: 400 });
  });

  it('drags the map with the finger, and at 1× only sideways into the hidden sides', () => {
    const view = { x: 300, y: 200, w: 400, h: 400 }; // 2×
    // Finger moves 40 px right and 20 px down: the map follows it.
    expectView(panBy(view, BOX, 40, 20, REGION), { x: 260, y: 180, w: 400, h: 400 });
    // At 1× the hidden 100 units each side can be dragged in, no further.
    expectView(panBy(REGION.base, BOX, 40, 80, REGION), { x: 20, y: 0, w: 800, h: 800 });
    expectView(panBy(REGION.base, BOX, 400, 0, REGION), { x: 0, y: 0, w: 800, h: 800 });
  });
});
