// Kaardimäng zoom: the pure arithmetic behind pinching, dragging and the
// +/− buttons. A view is the SVG viewBox; it always keeps the map's own
// aspect ratio, so the drawing never changes size on screen, only scale.

export type ZoomView = { x: number; y: number; w: number; h: number };
// Where the drawing sits on screen (CSS px). It does not change while zooming,
// because every view has the same aspect ratio.
export type ScreenBox = { left: number; top: number; width: number; height: number };

export const MAX_ZOOM = 8;
// A finger that moves further than this is dragging the map, not tapping it.
export const TAP_SLOP_PX = 8;

export function fullView(width: number, height: number): ZoomView {
  return { x: 0, y: 0, w: width, h: height };
}

export function zoomOf(view: ZoomView, width: number) {
  return width / view.w;
}

// Keeps the zoom between 1× and MAX_ZOOM and the view inside the map.
export function clampView(view: ZoomView, width: number, height: number): ZoomView {
  const k = Math.min(MAX_ZOOM, Math.max(1, width / view.w));
  const w = width / k;
  const h = height / k;
  return {
    x: Math.min(width - w, Math.max(0, view.x)),
    y: Math.min(height - h, Math.max(0, view.y)),
    w,
    h,
  };
}

// The map point under a screen point.
export function toMap(view: ZoomView, box: ScreenBox, sx: number, sy: number) {
  return { x: view.x + ((sx - box.left) / box.width) * view.w, y: view.y + ((sy - box.top) / box.height) * view.h };
}

// Zooms to `k` so that map point `at` stays under screen point (sx, sy).
export function zoomAround(width: number, height: number, box: ScreenBox, k: number, at: { x: number; y: number }, sx: number, sy: number): ZoomView {
  const zoom = Math.min(MAX_ZOOM, Math.max(1, k));
  const w = width / zoom;
  const h = height / zoom;
  return clampView({ x: at.x - ((sx - box.left) / box.width) * w, y: at.y - ((sy - box.top) / box.height) * h, w, h }, width, height);
}

// Moves the view by a screen-pixel drag.
export function panBy(view: ZoomView, box: ScreenBox, dx: number, dy: number, width: number, height: number): ZoomView {
  return clampView({ ...view, x: view.x - (dx / box.width) * view.w, y: view.y - (dy / box.height) * view.h }, width, height);
}
