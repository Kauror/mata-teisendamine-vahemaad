import { describe, expect, it } from 'vitest';
import { MAX_ZOOM, clampView, fullView, panBy, toMap, zoomAround, zoomOf } from './mapZoom';

const W = 1000;
const H = 600;
// The drawing shown 500 × 300 px, 20 px from the left and 100 px down.
const BOX = { left: 20, top: 100, width: 500, height: 300 };

describe('Kaardimäng zoom', () => {
  it('starts with the whole map', () => {
    expect(fullView(W, H)).toEqual({ x: 0, y: 0, w: W, h: H });
    expect(zoomOf(fullView(W, H), W)).toBe(1);
  });

  it('keeps the point under the fingers in place while zooming', () => {
    const at = toMap(fullView(W, H), BOX, 145, 175); // a quarter in from the left and top
    expect(at).toEqual({ x: 250, y: 150 });
    const zoomed = zoomAround(W, H, BOX, 4, at, 145, 175);
    expect(zoomOf(zoomed, W)).toBe(4);
    expect(toMap(zoomed, BOX, 145, 175)).toEqual({ x: 250, y: 150 });
  });

  it('never zooms out past the whole map or in past the limit, and keeps the aspect ratio', () => {
    const out = zoomAround(W, H, BOX, 0.2, { x: 500, y: 300 }, 270, 250);
    expect(out).toEqual(fullView(W, H));
    const deep = zoomAround(W, H, BOX, 50, { x: 500, y: 300 }, 270, 250);
    expect(zoomOf(deep, W)).toBe(MAX_ZOOM);
    expect(deep.w / deep.h).toBeCloseTo(W / H);
  });

  it('keeps the view inside the map at the edges', () => {
    const corner = zoomAround(W, H, BOX, 2, { x: 0, y: 0 }, 520, 400);
    expect(corner.x).toBe(0);
    expect(corner.y).toBe(0);
    expect(clampView({ x: 900, y: 500, w: 500, h: 300 }, W, H)).toEqual({ x: 500, y: 300, w: 500, h: 300 });
  });

  it('drags the map with the finger', () => {
    const view = { x: 250, y: 150, w: 500, h: 300 }; // 2×
    // Finger moves 50 px right and 30 px down: the map follows it.
    expect(panBy(view, BOX, 50, 30, W, H)).toEqual({ x: 200, y: 120, w: 500, h: 300 });
    // At the whole-map view there is nowhere to move.
    expect(panBy(fullView(W, H), BOX, 80, 80, W, H)).toEqual(fullView(W, H));
  });
});
