// Builds the Kaardimäng "Eesti" map: the 15 maakonnad, their keskused and the
// neighbouring countries for context. Separate from build-map-data.ts on
// purpose: the world maps and the catalog stay byte-for-byte as they are.
//
//   npx tsx scripts/kaardimang/build-estonia.ts <folder with the raw files>
//
// Reads ne_10m_admin_1_states_provinces.geojson (the counties),
// ne_10m_admin_0_countries_deu.geojson (the neighbours) and ne_10m_lakes.geojson
// (Peipsi, Pihkva järv, Võrtsjärv and Narva veehoidla are cut out of the land),
// all pinned in sources.json, and writes public/kaardimang/eesti/<version>/estonia.json.
// The geometry helpers are copied from build-map-data.ts, unchanged.

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { geoArea, geoAzimuthalEqualArea, geoCentroid, geoContains, geoStream, type GeoProjection } from 'd3-geo';
import polygonClipping from 'polygon-clipping';
import type { Feature, FeatureCollection, MultiPolygon, Polygon, Position } from 'geojson';
import { COUNTIES, ESTONIA_DATA_VERSION, mapPath } from '../../src/content/kaardimang/regions';
import type { MapViewData, MapViewFeature } from '../../src/content/kaardimang/types';

const ROOT = path.resolve(__dirname, '../..');
const rawDir = process.argv[2];
if (!rawDir) throw new Error('Usage: build-estonia.ts <raw folder>');
const sources = JSON.parse(readFileSync(path.join(__dirname, 'sources.json'), 'utf8')) as {
  files: Record<string, { file: string; sha256: string }>;
  estonia: { centres: Record<string, { lat: number; lon: number; source: string }> };
};

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

/* -------------------------------------------------------------- the build */

const WIDTH = 1000;
const MARGIN = 24;
const NEIGHBOURS = ['LVA', 'RUS', 'FIN', 'SWE'];
const problems: string[] = [];

const admin1 = JSON.parse(readSource('admin1')) as FeatureCollection<Polygon | MultiPolygon>;
const countriesGeo = JSON.parse(readSource('countries')) as FeatureCollection<Polygon | MultiPolygon>;
const lakesGeo = JSON.parse(readSource('lakes')) as FeatureCollection<Polygon | MultiPolygon>;

// Every lake that reaches into the map's area (lon 21–29, lat 57–60).
type Coords = Array<Array<Array<[number, number]>>>;
const coordsOf = (geometry: Polygon | MultiPolygon) => (geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates) as Coords;
const lakes = lakesGeo.features.map((feature) => coordsOf(feature.geometry)).filter((polys) => polys.some((poly) => poly[0].some(([x, y]) => x > 21 && x < 29 && y > 57 && y < 60)));
if (!lakesGeo.features.some((feature) => (feature.properties as Record<string, unknown>).name === 'Lake Peipus')) problems.push('lakes: no Lake Peipus');

// Land without the lakes, wound the way d3-geo wants it.
function multi(geometry: Polygon | MultiPolygon): MultiPolygon {
  const land = lakes.length ? polygonClipping.difference(coordsOf(geometry), ...lakes) : coordsOf(geometry);
  return { type: 'MultiPolygon', coordinates: land.map((poly) => d3Winding(poly)) };
}

const countyGeometry = new Map<string, MultiPolygon>();
for (const feature of admin1.features) {
  const p = feature.properties as Record<string, unknown>;
  if (p.adm0_a3 !== 'EST') continue;
  const county = COUNTIES.find((item) => item.iso === p.iso_3166_2);
  if (!county) { problems.push(`unknown Estonian admin-1 ${String(p.iso_3166_2)}`); continue; }
  countyGeometry.set(county.id, multi(feature.geometry));
}
for (const county of COUNTIES) if (!countyGeometry.has(county.id)) problems.push(`${county.id}: no geometry`);

const frame: Feature<MultiPolygon> = {
  type: 'Feature', properties: {},
  geometry: { type: 'MultiPolygon', coordinates: [...countyGeometry.values()].flatMap((geometry) => geometry.coordinates) }
};
const [lon, lat] = geoCentroid(frame);
const projection = geoAzimuthalEqualArea().rotate([-lon, -lat]).clipAngle(90);
// Square: Estonia is about 1.5 times wider than tall, and a wide map is shown
// cropped to a square box (mapZoom.ts), which would cut off Hiiumaa, Saaremaa
// and Ida-Virumaa. Fitted by width and centred, the square adds the Gulf of
// Finland above and Latvia below instead, and the whole of Estonia stays in view.
const height = WIDTH;
projection.fitExtent([[MARGIN, MARGIN], [WIDTH - MARGIN, height - MARGIN]], frame);
projection.clipExtent([[-40, -40], [WIDTH + 40, height + 40]]);

const features: MapViewFeature[] = [];
const labels: MapViewData['labels'] = {};
const capitals: MapViewData['capitals'] = [];

for (const feature of countriesGeo.features) {
  const code = String((feature.properties as Record<string, unknown>).ADM0_A3);
  if (!NEIGHBOURS.includes(code)) continue;
  const d = encodePath(projectRings(projection, multi(feature.geometry)), 0.5, 2);
  if (d) features.push({ id: code, role: 'c', d });
}

for (const county of COUNTIES) {
  const geometry = countyGeometry.get(county.id);
  if (!geometry) continue;
  const rings = projectRings(projection, geometry);
  const d = encodePath(rings, 0.4, 1.5);
  if (!d) { problems.push(`${county.id}: nothing to draw`); continue; }
  features.push({ id: county.id, role: 't', d });
  // The label sits on the county's largest piece (Saaremaa, not the sea between islands).
  const largest = geometry.coordinates.reduce((best, poly) => (geoArea({ type: 'Polygon', coordinates: poly }) > geoArea({ type: 'Polygon', coordinates: best }) ? poly : best));
  const at = projection(geoCentroid({ type: 'Polygon', coordinates: largest }))!;
  const [x0, , x1] = ringBox(rings);
  labels[county.id] = [round1(at[0]), round1(at[1]), round1(x1 - x0)];

  const centre = sources.estonia.centres[county.centreId];
  if (!centre) { problems.push(`${county.centreId}: no coordinates in sources.json`); continue; }
  if (!geoContains(geometry, [centre.lon, centre.lat])) problems.push(`${county.centreId}: ${county.centreEt} is not inside ${county.nameEt}`);
  const pin = projection([centre.lon, centre.lat])!;
  capitals.push({ id: county.centreId, countryId: county.id, x: round1(pin[0]), y: round1(pin[1]) });
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

const data: MapViewData = {
  id: 'estonia',
  version: ESTONIA_DATA_VERSION,
  width: WIDTH,
  height,
  sphere: null,
  features,
  markers: [],
  labels,
  capitals,
  areas: []
};
const file = path.join(ROOT, 'public', mapPath('estonia'));
rmSync(path.join(ROOT, 'public', 'kaardimang', 'eesti'), { recursive: true, force: true });
mkdirSync(path.dirname(file), { recursive: true });
writeFileSync(file, JSON.stringify(data));
console.log(`estonia.json: ${WIDTH} × ${height}, ${features.length} features, ${capitals.length} centres, ${JSON.stringify(data).length} bytes`);
