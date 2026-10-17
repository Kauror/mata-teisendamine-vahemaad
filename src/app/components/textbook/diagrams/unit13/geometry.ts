// Shared geometry of the Unit 13 "Kaardi mõõtkava" diagrams (diagram units).
// The scale pictures are internally consistent: one map centimetre is MAP_CM
// units in both of them, every drawn length is a whole number of map
// centimetres, and every written number is derived from the same constants.
// They never claim a real centimetre on the screen (the SVG scales with the
// device); the questions always state the lengths a calculation needs.

export type Point = { x: number; y: number };

// One "map centimetre" in both scale diagrams.
export const MAP_CM = 120;
export const CM_PER_KM = 100_000;

// Kilometres in nature for one map centimetre at 1 : ratio.
export function kmPerMapCm(ratio: number): number {
  return ratio / CM_PER_KM;
}

// "1 : 5 000 000" — Estonian digit grouping with spaces.
export function ratioText(ratio: number): string {
  return `1 : ${String(ratio).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`;
}

// "1 cm – 50 km" (võrdlusmõõtkava).
export function verbalText(ratio: number): string {
  return `1 cm – ${String(kmPerMapCm(ratio)).replace('.', ',')} km`;
}

// u13-scale-forms: the textbook's 1 : 5 000 000 in three forms. The bar is
// one map centimetre long and is labelled 0 … 50 km, with a middle tick at 25.
export const SCALE_FORMS_RATIO = 5_000_000;
export const SCALE_BAR = { x0: 40, x1: 40 + MAP_CM, y: 46, height: 8 };

// u13-measured-distance: the textbook's Tartu–Võru example, drawn as two
// invented points. The segment is exactly 2 map centimetres, twice the
// panel's 1 cm bar, and 1 : 3 000 000 gives 2 × 30 km = 60 km.
export const MEASURED_RATIO = 3_000_000;
export const MEASURED_MAP_CM = 2;
export const MEASURED_START: Point = { x: 70, y: 110 };
export const MEASURED_END: Point = { x: MEASURED_START.x + MEASURED_MAP_CM * MAP_CM, y: 110 };
export const MEASURED_PANEL_BAR = { x0: 36, x1: 36 + MAP_CM, y: 214, height: 6 };
export function measuredKm(): number {
  return MEASURED_MAP_CM * kmPerMapCm(MEASURED_RATIO);
}

// u13-direct-vs-route: the straight line and a road that bows downwards
// between exactly the same two endpoints (a cubic Bézier).
export const ROUTE_FROM: Point = { x: 60, y: 90 };
export const ROUTE_TO: Point = { x: 335, y: 90 };
export const ROUTE_C1: Point = { x: 150, y: 175 };
export const ROUTE_C2: Point = { x: 255, y: 175 };

export function routePoint(t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * ROUTE_FROM.x + b * ROUTE_C1.x + c * ROUTE_C2.x + d * ROUTE_TO.x,
    y: a * ROUTE_FROM.y + b * ROUTE_C1.y + c * ROUTE_C2.y + d * ROUTE_TO.y
  };
}

export function routeLength(steps = 400): number {
  let length = 0;
  let previous = routePoint(0);
  for (let index = 1; index <= steps; index += 1) {
    const point = routePoint(index / steps);
    length += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }
  return length;
}

export const ROUTE_PATH = `M${ROUTE_FROM.x} ${ROUTE_FROM.y} C${ROUTE_C1.x} ${ROUTE_C1.y} ${ROUTE_C2.x} ${ROUTE_C2.y} ${ROUTE_TO.x} ${ROUTE_TO.y}`;

// u13-area-detail: three framed mini-maps of the same size. Each of the two
// wider views marks, with a dashed box, the area the next view shows; the box
// has the panel's own proportions at 1/ZOOM of its size (8× more detail).
export const AREA_PANEL = { width: 112, height: 140, y: 36, xs: [8, 134, 260] as const };
export const AREA_ZOOM = 8;
export const AREA_INSET = { width: AREA_PANEL.width / AREA_ZOOM, height: AREA_PANEL.height / AREA_ZOOM };
