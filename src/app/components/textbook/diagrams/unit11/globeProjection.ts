// Orthographic projection of a globe for the unit 11 diagrams, so lines drawn
// on them are where they really are: parallels stay parallel, meridians meet
// at the poles, Estonia sits at its real latitude and longitude. Pure numbers,
// unit-tested in unit11Diagrams.test.ts.
//
// The viewer looks at longitude 0 (the middle of the picture) from
// `elevation` degrees above the equator plane; SVG y grows downwards.

export type Globe = { cx: number; cy: number; r: number; elevation: number };
export type GlobePoint = { x: number; y: number; visible: boolean };

const RAD = Math.PI / 180;
const f = (value: number) => value.toFixed(1);

export function project(globe: Globe, latitude: number, longitude: number): GlobePoint {
  const phi = latitude * RAD;
  const lambda = longitude * RAD;
  const e = globe.elevation * RAD;
  const depth = Math.cos(phi) * Math.cos(lambda) * Math.cos(e) + Math.sin(phi) * Math.sin(e);
  return {
    x: globe.cx + globe.r * Math.cos(phi) * Math.sin(lambda),
    y: globe.cy - globe.r * (Math.sin(phi) * Math.cos(e) - Math.cos(phi) * Math.cos(lambda) * Math.sin(e)),
    visible: depth >= -1e-9
  };
}

function polyline(points: GlobePoint[]): string {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${f(point.x)} ${f(point.y)}`).join(' ');
}

// The visible front part of a parallel, west to east.
export function parallelPoints(globe: Globe, latitude: number): GlobePoint[] {
  const points: GlobePoint[] = [];
  for (let longitude = -180; longitude <= 180; longitude += 2) points.push(project(globe, latitude, longitude));
  return points.filter((point) => point.visible);
}

// The visible part of a meridian, north to south.
export function meridianPoints(globe: Globe, longitude: number): GlobePoint[] {
  const points: GlobePoint[] = [];
  for (let latitude = 90; latitude >= -90; latitude -= 2) points.push(project(globe, latitude, longitude));
  return points.filter((point) => point.visible);
}

export const parallelPath = (globe: Globe, latitude: number) => polyline(parallelPoints(globe, latitude));
export const meridianPath = (globe: Globe, longitude: number) => polyline(meridianPoints(globe, longitude));

// The visible part of a hemisphere: the equator's front arc closed along the
// globe's outline over the top (north) or the bottom (south).
export function hemispherePath(globe: Globe, hemisphere: 'north' | 'south'): string {
  const equator = parallelPoints(globe, 0);
  const end = equator[equator.length - 1];
  const start = equator[0];
  // From the east end back to the west end along the outline: over the top is counterclockwise on screen.
  const sweep = hemisphere === 'north' ? 0 : 1;
  return `${polyline(equator)} L${f(end.x)} ${f(end.y)} A${globe.r} ${globe.r} 0 0 ${sweep} ${f(start.x)} ${f(start.y)} Z`;
}

// The visible western (left) or eastern (right) half, split by the middle meridian.
// Only exact when the viewer looks straight at the equator (elevation 0).
export function sideHalfPath(globe: Globe, side: 'west' | 'east'): string {
  const top = `${f(globe.cx)} ${f(globe.cy - globe.r)}`;
  const bottom = `${f(globe.cx)} ${f(globe.cy + globe.r)}`;
  return `M${top} A${globe.r} ${globe.r} 0 0 ${side === 'west' ? 0 : 1} ${bottom} Z`;
}
