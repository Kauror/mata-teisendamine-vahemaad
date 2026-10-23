// Builds the Kaardimäng sea outlines (backlog KM-01) that lie over the world
// map: Läänemeri, Vahemeri, Soome laht, … from Natural Earth's marine
// polygons, projected exactly as build-map-data.ts projects world.json. The
// world map itself is not rebuilt; the check at the end compares the projection
// with the world.json in public/ and refuses to write if they differ.
//
//   npx tsx scripts/kaardimang/build-seas.ts <folder with the raw files>

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { geoArea, geoCentroid, geoEqualEarth, geoPath, geoStream, type GeoProjection } from 'd3-geo';
import type { FeatureCollection, MultiPolygon, Polygon, Position } from 'geojson';
import { SEAS, SEAS_DATA_VERSION, mapPath, seasPath } from '../../src/content/kaardimang/regions';
import type { MapViewData, SeasOverlay } from '../../src/content/kaardimang/types';

const ROOT = path.resolve(__dirname, '../..');
const rawDir = process.argv[2];
if (!rawDir) throw new Error('Usage: build-seas.ts <raw folder>');
const sources = JSON.parse(readFileSync(path.join(__dirname, 'sources.json'), 'utf8')) as { files: Record<string, { file: string; sha256: string }> };

function readSource(key: string): string {
  const spec = sources.files[key];
  const text = readFileSync(path.join(rawDir, spec.file));
  const hash = createHash('sha256').update(text).digest('hex');
  if (hash !== spec.sha256) throw new Error(`${spec.file}: sha256 ${hash} does not match sources.json`);
  return text.toString('utf8');
}

/* -------------------------------------------- copied from build-map-data.ts */

type Ring = Position[];
type Poly = Ring[];

function signedArea(ring: Ring): number {
  let sum = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) sum += (ring[i][0] - ring[j][0]) * (ring[i][1] + ring[j][1]);
  return sum / 2;
}
function d3Winding(poly: Poly): Poly {
  return poly.map((ring, index) => {
    const clockwise = signedArea(ring) > 0;
    return (index === 0) === clockwise ? ring : [...ring].reverse();
  });
}
function simplifyRing(points: Position[], tolerance: number): Position[] {
  if (points.length <= 4) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = 1; keep[points.length - 1] = 1;
  const stack: Array<[number, number]> = [[0, points.length - 1]];
  const tol2 = tolerance * tolerance;
  while (stack.length) {
    const [a, b] = stack.pop()!;
    const [ax, ay] = points[a];
    const [bx, by] = points[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let worst = -1;
    let worstD = tol2;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = points[i];
      let d2: number;
      if (len2 === 0) d2 = (px - ax) ** 2 + (py - ay) ** 2;
      else {
        const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
        d2 = (px - ax - t * dx) ** 2 + (py - ay - t * dy) ** 2;
      }
      if (d2 > worstD) { worstD = d2; worst = i; }
    }
    if (worst >= 0) { keep[worst] = 1; stack.push([a, worst], [worst, b]); }
  }
  return points.filter((_, i) => keep[i]);
}
function projectRings(projection: GeoProjection, geometry: Polygon | MultiPolygon): Position[][] {
  const rings: Position[][] = [];
  let current: Position[] | null = null;
  const sink = {
    point(x: number, y: number) { current?.push([x, y]); },
    lineStart() { current = []; },
    lineEnd() { if (current && current.length > 2) rings.push(current); current = null; },
    polygonStart() {},
    polygonEnd() {},
    sphere() {}
  };
  geoStream(geometry, projection.stream(sink as never));
  return rings;
}
function ringBox(rings: Position[][]): [number, number, number, number] {
  let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
  for (const ring of rings) for (const [x, y] of ring) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  return [x0, y0, x1, y1];
}
function encodePath(rings: Position[][], tolerance: number, minSize: number): string {
  let d = '';
  for (const ring of rings) {
    const [x0, y0, x1, y1] = ringBox([ring]);
    if (x1 - x0 < minSize && y1 - y0 < minSize) continue;
    const simple = simplifyRing(ring, tolerance);
    if (simple.length < 3) continue;
    const rounded = simple.map(([x, y]) => [Math.round(x * 10), Math.round(y * 10)]);
    d += `M${rounded[0][0] / 10} ${rounded[0][1] / 10}`;
    for (let i = 1; i < rounded.length; i++) {
      const dx = (rounded[i][0] - rounded[i - 1][0]) / 10;
      const dy = (rounded[i][1] - rounded[i - 1][1]) / 10;
      if (dx === 0 && dy === 0) continue;
      d += `l${dx} ${dy}`;
    }
    d += 'z';
  }
  return d.replace(/ -/g, '-');
}
const round1 = (value: number) => Math.round(value * 10) / 10;

/* ------------------------------------- the world projection, as in world.json */

const WIDTH = 1000;
const MARGIN = 24;
const projection = geoEqualEarth();
projection.fitWidth(WIDTH - 2 * MARGIN, { type: 'Sphere' });
const [[, y0], [, y1]] = geoPath(projection).bounds({ type: 'Sphere' });
const height = Math.ceil(y1 - y0 + 2 * MARGIN);
projection.fitExtent([[MARGIN, MARGIN], [WIDTH - MARGIN, height - MARGIN]], { type: 'Sphere' });

const world = JSON.parse(readFileSync(path.join(ROOT, 'public', mapPath('world')), 'utf8')) as MapViewData;
const sphere = geoPath(projection).digits(1)({ type: 'Sphere' });
if (world.width !== WIDTH || world.height !== height || world.sphere !== sphere) {
  throw new Error(`The projection does not match world.json (${world.width}×${world.height} vs ${WIDTH}×${height}); rebuild both together.`);
}
projection.clipExtent([[-40, -40], [WIDTH + 40, height + 40]]);

/* ------------------------------------------------------------------- seas */

const marine = JSON.parse(readSource('marine')) as FeatureCollection<Polygon | MultiPolygon>;
const problems: string[] = [];
const areas: SeasOverlay['areas'] = [];
const labels: SeasOverlay['labels'] = {};

for (const sea of SEAS) {
  const names = Array.isArray(sea.ne) ? sea.ne : [sea.ne];
  const features = names.map((name) => marine.features.find((item) => (item.properties as Record<string, unknown>).name === name));
  const missing = names.filter((_, index) => !features[index]);
  if (missing.length) { problems.push(`${sea.id}: no ${missing.map((name) => `"${name}"`).join(', ')} in the marine polygons`); continue; }
  const polys = features.flatMap((feature) => (feature!.geometry.type === 'Polygon' ? [feature!.geometry.coordinates] : feature!.geometry.coordinates));
  const geometry: MultiPolygon = { type: 'MultiPolygon', coordinates: polys.map((poly) => d3Winding(poly)) };
  const rings = projectRings(projection, geometry);
  const d = encodePath(rings, 0.3, 0.5);
  if (!d) { problems.push(`${sea.id}: nothing to draw`); continue; }
  areas.push({ id: sea.id, kind: 'sea', d });
  const largest = geometry.coordinates.reduce((best, poly) => (geoArea({ type: 'Polygon', coordinates: poly }) > geoArea({ type: 'Polygon', coordinates: best }) ? poly : best));
  const at = projection(geoCentroid({ type: 'Polygon', coordinates: largest }))!;
  const [bx0, , bx1] = ringBox(rings);
  labels[sea.id] = [round1(at[0]), round1(at[1]), round1(bx1 - bx0)];
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

// The gulfs are drawn after their sea, so a tap on Soome laht finds the gulf first.
areas.sort((left, right) => Number(Boolean(SEAS.find((sea) => sea.id === left.id)?.partOf)) - Number(Boolean(SEAS.find((sea) => sea.id === right.id)?.partOf)));

const overlay: SeasOverlay = { version: SEAS_DATA_VERSION, width: WIDTH, height, areas, labels };
const file = path.join(ROOT, 'public', seasPath());
rmSync(path.join(ROOT, 'public', 'kaardimang', 'seas'), { recursive: true, force: true });
mkdirSync(path.dirname(file), { recursive: true });
writeFileSync(file, JSON.stringify(overlay));
console.log(`world-seas.json: ${areas.length} seas, ${JSON.stringify(overlay).length} bytes`);
