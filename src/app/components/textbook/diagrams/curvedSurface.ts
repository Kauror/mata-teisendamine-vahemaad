// Geometry for the unit 10 horizon diagrams: the Earth's surface drawn as an
// arc of a (hugely exaggerated) circle, things standing on it pointing away
// from its centre, and sight lines that just touch it (the horizon). Pure
// numbers, so the diagrams stay geometrically honest and a unit test can
// check what is hidden and what is not.

export type Circle = { cx: number; cy: number; r: number };
export type Point = { x: number; y: number };

// The point of the upper arc at horizontal position x.
export function surfacePoint(circle: Circle, x: number): Point {
  return { x, y: circle.cy - Math.sqrt(circle.r * circle.r - (x - circle.cx) * (x - circle.cx)) };
}

// Tilt (degrees, clockwise) of something standing upright on the surface at x.
export function tiltAt(circle: Circle, x: number): number {
  return (Math.asin((x - circle.cx) / circle.r) * 180) / Math.PI;
}

// The point `height` units straight up (away from the centre) from the surface at x.
export function above(circle: Circle, x: number, height: number): Point {
  const base = surfacePoint(circle, x);
  const ux = (base.x - circle.cx) / circle.r;
  const uy = (base.y - circle.cy) / circle.r;
  return { x: base.x + ux * height, y: base.y + uy * height };
}

// Where a sight line from `eye` touches the circle (the horizon), on the side
// given by `direction` (1 = to the right, -1 = to the left).
export function horizonPoint(circle: Circle, eye: Point, direction: 1 | -1): Point {
  const dx = eye.x - circle.cx;
  const dy = eye.y - circle.cy;
  const distance = Math.hypot(dx, dy);
  const eyeAngle = Math.atan2(dy, dx);
  const spread = Math.acos(circle.r / distance);
  // In SVG (y down), turning clockwise from the eye direction goes right over the top.
  const angle = eyeAngle + direction * spread;
  return { x: circle.cx + circle.r * Math.cos(angle), y: circle.cy + circle.r * Math.sin(angle) };
}

// Is point p (above the surface, beyond the horizon) visible from the eye,
// i.e. above the straight sight line through eye and horizon?
export function aboveSightLine(eye: Point, horizon: Point, p: Point): boolean {
  const slope = (horizon.y - eye.y) / (horizon.x - eye.x);
  return p.y < eye.y + slope * (p.x - eye.x);
}

// The sight line's y at x.
export function sightY(eye: Point, horizon: Point, x: number): number {
  return eye.y + ((horizon.y - eye.y) / (horizon.x - eye.x)) * (x - eye.x);
}

export function arcPath(circle: Circle, x1: number, x2: number, bottom: number): string {
  const a = surfacePoint(circle, x1);
  const b = surfacePoint(circle, x2);
  return `M${a.x.toFixed(1)} ${bottom} L${a.x.toFixed(1)} ${a.y.toFixed(1)} A${circle.r} ${circle.r} 0 0 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)} L${b.x.toFixed(1)} ${bottom} Z`;
}

// A band of ground on the surface between x1 and x2, `thickness` deep.
export function bandPath(circle: Circle, x1: number, x2: number, thickness: number): string {
  const a = surfacePoint(circle, x1);
  const b = surfacePoint(circle, x2);
  const inner = circle.r - thickness;
  const ai = { x: circle.cx + ((a.x - circle.cx) * inner) / circle.r, y: circle.cy + ((a.y - circle.cy) * inner) / circle.r };
  const bi = { x: circle.cx + ((b.x - circle.cx) * inner) / circle.r, y: circle.cy + ((b.y - circle.cy) * inner) / circle.r };
  const f = (value: number) => value.toFixed(1);
  return `M${f(a.x)} ${f(a.y)} A${circle.r} ${circle.r} 0 0 1 ${f(b.x)} ${f(b.y)} L${f(bi.x)} ${f(bi.y)} A${inner} ${inner} 0 0 0 ${f(ai.x)} ${f(ai.y)} Z`;
}
