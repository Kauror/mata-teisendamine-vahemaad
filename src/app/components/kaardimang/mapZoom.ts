// Kaardimäng zoom: the pure arithmetic behind pinching, dragging and the
// +/− buttons. A view is the SVG viewBox. Every view keeps the frame's aspect
// ratio, so the drawing never changes size on screen, only scale.

export type ZoomView = { x: number; y: number; w: number; h: number };
// Where the drawing sits on screen (CSS px). It does not change while zooming,
// because every view has the same aspect ratio.
export type ScreenBox = { left: number; top: number; width: number; height: number };
// The area the view may roam (`bounds`) and the whole-map view at 1× (`base`).
export type MapFrame = { bounds: ZoomView; base: ZoomView };

export const MAX_ZOOM = 8;
// A finger that moves further than this is dragging the map, not tapping it.
export const TAP_SLOP_PX = 8;
// Kaur (19.10): the map box is square when it can be. A wide map is cut at the
// sides to a square, but never loses more than this share of its width
// (the hidden sides slide into view with a sideways drag).
export const MAX_HIDDEN_SHARE = 0.25;
// The world globe would lose half of itself as a square, so its box is only
// this much taller than the globe, with empty space above and below.
export const WORLD_TALLER = 1.21;

// A map already square or taller keeps its own shape and hides nothing.
export function mapFrame(width: number, height: number, padded: boolean): MapFrame {
  const bounds = { x: 0, y: 0, w: width, h: height };
  if (padded) {
    const pad = (height * (WORLD_TALLER - 1)) / 2;
    const room = { x: 0, y: -pad, w: width, h: height + 2 * pad };
    return { bounds: room, base: room };
  }
  const aspect = width / height;
  if (aspect <= 1) return { bounds, base: bounds };
  const boxAspect = Math.max(1, aspect * (1 - MAX_HIDDEN_SHARE));
  const w = height * boxAspect;
  return { bounds, base: { x: (width - w) / 2, y: 0, w, h: height } };
}

export function zoomOf(view: ZoomView, frame: MapFrame) {
  return frame.base.w / view.w;
}

// Keeps the zoom between 1× and MAX_ZOOM and the view inside the bounds.
export function clampView(view: ZoomView, frame: MapFrame): ZoomView {
  const { bounds, base } = frame;
  const k = Math.min(MAX_ZOOM, Math.max(1, base.w / view.w));
  const w = base.w / k;
  const h = base.h / k;
  return {
    x: Math.min(bounds.x + bounds.w - w, Math.max(bounds.x, view.x)),
    y: Math.min(bounds.y + bounds.h - h, Math.max(bounds.y, view.y)),
    w,
    h,
  };
}

export function isBase(view: ZoomView, frame: MapFrame) {
  const { base } = frame;
  const near = (a: number, b: number) => Math.abs(a - b) < base.w * 1e-6;
  return near(view.x, base.x) && near(view.y, base.y) && near(view.w, base.w);
}

// The map point under a screen point.
export function toMap(view: ZoomView, box: ScreenBox, sx: number, sy: number) {
  return { x: view.x + ((sx - box.left) / box.width) * view.w, y: view.y + ((sy - box.top) / box.height) * view.h };
}

// Zooms to `k` so that map point `at` stays under screen point (sx, sy).
export function zoomAround(frame: MapFrame, box: ScreenBox, k: number, at: { x: number; y: number }, sx: number, sy: number): ZoomView {
  const zoom = Math.min(MAX_ZOOM, Math.max(1, k));
  const w = frame.base.w / zoom;
  const h = frame.base.h / zoom;
  return clampView({ x: at.x - ((sx - box.left) / box.width) * w, y: at.y - ((sy - box.top) / box.height) * h, w, h }, frame);
}

// Moves the view by a screen-pixel drag.
export function panBy(view: ZoomView, box: ScreenBox, dx: number, dy: number, frame: MapFrame): ZoomView {
  return clampView({ ...view, x: view.x - (dx / box.width) * view.w, y: view.y - (dy / box.height) * view.h }, frame);
}
