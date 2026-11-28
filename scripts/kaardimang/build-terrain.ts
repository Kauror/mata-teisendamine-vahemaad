// Builds the terrain picture under each Kaardimäng map view:
//   public/kaardimang/terrain/<TERRAIN_VERSION>/<view>.webp
//
//   npx tsx scripts/kaardimang/build-terrain.ts <raster> [out dir]
//
// <raster> is a whole-world plate carrée image (-180..180, 90..-90), pinned in
// terrain-sources.json by sha256; it is not committed (hundreds of MB).
//
// The map views were projected by build-map-data.ts from sources that are not
// on disk either, so this script does not rebuild their projections from
// country shapes. The world and Antarctica views are fixed formulas; every
// other view is an azimuthal equal-area projection whose centre, scale and
// offset are recovered from the view's own capital points (their lon/lat in
// catalog.json, their x/y in the view). The fit must land every capital
// within FIT_LIMIT map units, or the build stops: a picture that does not sit
// under the country shapes would be worse than none.

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { geoAzimuthalEqualArea, geoEqualEarth, geoPath, type GeoProjection } from 'd3-geo';
import { MAP_VIEWS, DATA_VERSION, TERRAIN_PAD, TERRAIN_VERSION, type MapViewDef } from '../../src/content/kaardimang/regions';
import type { KaardimangCatalog, MapViewData } from '../../src/content/kaardimang/types';
import { PEAKS } from '../../src/content/kaardimang/peaks';

const ROOT = path.resolve(__dirname, '../..');
const rasterPath = process.argv[2];
if (!rasterPath) {
  console.error('Usage: tsx scripts/kaardimang/build-terrain.ts <raster> [out dir]');
  process.exit(2);
}
const outDir = process.argv[3] ?? path.join(ROOT, 'public/kaardimang/terrain', TERRAIN_VERSION);

const WIDTH = 1000;
const MARGIN = 24;
// Picture pixels per map unit: 1.6 → about 1700 px across, sharp on a phone at
// 1×–2× zoom and soft (not blocky) at the 8× maximum. The world map covers
// the whole globe in the same width and is the one most zoomed into: double.
function pxPerUnit(def: MapViewDef) {
  return def.kind === 'world' ? 3.2 : 1.6;
}
// 0.4 map units is about 0.15 CSS px on a phone; the view files are rounded to 0.1.
const FIT_LIMIT = 0.4;
// One map unit is about a third of a CSS pixel on a phone.
const BORROWED_LIMIT = 1;
const QUALITY = 74;

/* ----------------------------------------------------------------- sources */

const sources = JSON.parse(readFileSync(path.join(__dirname, 'terrain-sources.json'), 'utf8')) as {
  files: Record<string, { file: string; url: string; sha256: string; what: string; license: string }>;
};
const rasterBuffer = readFileSync(rasterPath);
const rasterSha = createHash('sha256').update(rasterBuffer).digest('hex');
const found = Object.values(sources.files).find((entry) => entry.sha256 === rasterSha);
if (!found) throw new Error(`${rasterPath}: sha256 ${rasterSha} is not in terrain-sources.json`);
const source = found;
console.log(`source: ${source.what}`);

const catalog = JSON.parse(readFileSync(path.join(ROOT, 'src/content/kaardimang/catalog.json'), 'utf8')) as KaardimangCatalog;
const lonLat = new Map<string, [number, number]>();
for (const country of catalog.countries) {
  for (const capital of country.capitals) {
    if (capital.lat !== null && capital.lon !== null) lonLat.set(capital.id, [capital.lon, capital.lat]);
  }
}

function readView(id: string): MapViewData {
  return JSON.parse(readFileSync(path.join(ROOT, 'public/kaardimang/maps', DATA_VERSION, `${id}.json`), 'utf8')) as MapViewData;
}

/* -------------------------------------------------------------- projection */

type Fit = { projection: GeoProjection; worst: number; points: number; borrowed: number; borrowedPoints: number };

function residual(projection: GeoProjection, view: MapViewData): { worst: number; points: number } {
  let worst = 0;
  let points = 0;
  for (const capital of view.capitals) {
    const at = lonLat.get(capital.id);
    const p = at ? projection(at) : null;
    if (!p) continue;
    worst = Math.max(worst, Math.hypot(p[0] - capital.x, p[1] - capital.y));
    points++;
  }
  return { worst, points };
}

function worldProjection(): GeoProjection {
  const projection = geoEqualEarth();
  projection.fitWidth(WIDTH - 2 * MARGIN, { type: 'Sphere' });
  const [[, y0], [, y1]] = geoPath(projection).bounds({ type: 'Sphere' });
  const height = Math.ceil(y1 - y0 + 2 * MARGIN);
  projection.fitExtent([[MARGIN, MARGIN], [WIDTH - MARGIN, height - MARGIN]], { type: 'Sphere' });
  return projection;
}

function antarcticProjection(): GeoProjection {
  const projection = geoAzimuthalEqualArea().rotate([0, 90]).clipAngle(78);
  const ring = Array.from({ length: 73 }, (_, i) => [-180 + i * 5, -20]).reverse();
  projection.fitExtent([[MARGIN, MARGIN], [WIDTH - MARGIN, WIDTH - MARGIN]], { type: 'Polygon', coordinates: [ring] });
  return projection;
}

// For a centre (lon, lat), the best scale and offset are a linear least squares
// fit: x = k·px + tx, y = k·py + ty.
function fitAt(lon: number, lat: number, pairs: Pair[]) {
  const unit = geoAzimuthalEqualArea().rotate([-lon, -lat]).clipAngle(90).scale(1).translate([0, 0]);
  const rows = pairs.map((pair) => ({ p: unit(pair.ll), x: pair.x, y: pair.y })).filter((row) => row.p) as Array<{ p: [number, number]; x: number; y: number }>;
  const n = rows.length;
  if (n < 3) return null;
  let sp = 0, sx = 0, sy = 0, spp = 0, sxp = 0, syq = 0, sq = 0;
  for (const { p, x, y } of rows) {
    sp += p[0]; sq += p[1]; sx += x; sy += y;
    spp += p[0] * p[0] + p[1] * p[1];
    sxp += x * p[0]; syq += y * p[1];
  }
  // Shared k, separate tx/ty: minimise Σ (k·p - t - xy)².
  const k = (sxp + syq - (sp * sx + sq * sy) / n) / (spp - (sp * sp + sq * sq) / n);
  const tx = (sx - k * sp) / n;
  const ty = (sy - k * sq) / n;
  let err = 0;
  for (const { p, x, y } of rows) err += (k * p[0] + tx - x) ** 2 + (k * p[1] + ty - y) ** 2;
  return { k, tx, ty, err };
}

type Pair = { ll: [number, number]; x: number; y: number };

// Label anchors are Natural Earth label points: the same lon/lat in every
// view. A sub-region view with few capitals borrows them from its world-part
// view (already fitted on dozens of capitals) to pin its own projection.
function labelPairs(view: MapViewData, parent: { view: MapViewData; projection: GeoProjection } | null): Pair[] {
  if (!parent) return [];
  const pairs: Pair[] = [];
  for (const [id, [x, y]] of Object.entries(view.labels)) {
    const there = parent.view.labels[id];
    const ll = there ? parent.projection.invert!([there[0], there[1]]) : null;
    if (ll) pairs.push({ ll, x, y });
  }
  return pairs;
}

function fittedProjection(view: MapViewData, extra: Pair[]): GeoProjection {
  const pairs: Pair[] = view.capitals.flatMap((capital) => {
    const ll = lonLat.get(capital.id);
    return ll ? [{ ll, x: capital.x, y: capital.y }] : [];
  }).concat(extra);
  if (pairs.length < 6) throw new Error(`${view.id}: only ${pairs.length} capitals to fit the projection`);
  const cost = (lon: number, lat: number) => fitAt(lon, lat, pairs)?.err ?? Infinity;
  // Nelder–Mead over the centre, from the mean capital position.
  let simplex: Array<[number, number]> = [];
  const lon0 = pairs.reduce((sum, pair) => sum + pair.ll[0], 0) / pairs.length;
  const lat0 = pairs.reduce((sum, pair) => sum + pair.ll[1], 0) / pairs.length;
  simplex = [[lon0, lat0], [lon0 + 5, lat0], [lon0, lat0 + 5]];
  let values = simplex.map(([a, b]) => cost(a, b));
  for (let iteration = 0; iteration < 4000; iteration++) {
    const order = [0, 1, 2].sort((a, b) => values[a] - values[b]);
    simplex = order.map((i) => simplex[i]);
    values = order.map((i) => values[i]);
    if (Math.abs(values[2] - values[0]) < 1e-12 && iteration > 50) break;
    const c: [number, number] = [(simplex[0][0] + simplex[1][0]) / 2, (simplex[0][1] + simplex[1][1]) / 2];
    const at = (t: number): [number, number] => [c[0] + t * (simplex[2][0] - c[0]), c[1] + t * (simplex[2][1] - c[1])];
    const r = at(-1); const fr = cost(...r);
    if (fr < values[0]) {
      const e = at(-2); const fe = cost(...e);
      if (fe < fr) { simplex[2] = e; values[2] = fe; } else { simplex[2] = r; values[2] = fr; }
    } else if (fr < values[1]) {
      simplex[2] = r; values[2] = fr;
    } else {
      const k = at(0.5); const fk = cost(...k);
      if (fk < values[2]) { simplex[2] = k; values[2] = fk; } else {
        for (const i of [1, 2]) {
          simplex[i] = [(simplex[0][0] + simplex[i][0]) / 2, (simplex[0][1] + simplex[i][1]) / 2];
          values[i] = cost(...simplex[i]);
        }
      }
    }
  }
  const [lon, lat] = simplex[0];
  const fit = fitAt(lon, lat, pairs)!;
  return geoAzimuthalEqualArea().rotate([-lon, -lat]).clipAngle(90).scale(fit.k).translate([fit.tx, fit.ty]);
}

function projectionFor(def: MapViewDef, view: MapViewData, parent: { view: MapViewData; projection: GeoProjection } | null): Fit {
  const extra = def.kind === 'subregion' ? labelPairs(view, parent) : [];
  const projection = def.kind === 'world' ? worldProjection() : def.kind === 'antarctica' ? antarcticProjection() : fittedProjection(view, extra);
  let { worst, points } = residual(projection, view);
  if (def.kind === 'antarctica') {
    // No capitals here: the South Pole marker checks the formula instead.
    const pole = view.markers.find((marker) => marker.id === 'south-pole');
    const at = projection([0, -90]);
    worst = pole && at ? Math.hypot(at[0] - pole.x, at[1] - pole.y) : Infinity;
    points = 1;
  }
  // Borrowed label points carry the parent's error, magnified by the zoom
  // from the parent to this view: they get a looser limit of their own.
  let borrowed = 0;
  for (const pair of extra) {
    const p = projection(pair.ll);
    if (p) borrowed = Math.max(borrowed, Math.hypot(p[0] - pair.x, p[1] - pair.y));
  }
  return { projection, worst, points, borrowed, borrowedPoints: extra.length };
}

/* ------------------------------------------------------------------ raster */

type Level = { data: Buffer; w: number; h: number };
let meta: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>>;
const levels = new Map<number, Level>();
async function level(shrink: number): Promise<Level> {
  const cached = levels.get(shrink);
  if (cached) return cached;
  const w = Math.round(meta.width! / shrink);
  const h = Math.round(meta.height! / shrink);
  let image = sharp(rasterBuffer, { limitInputPixels: false }).removeAlpha().toColourspace('srgb');
  if (shrink > 1) image = image.resize(w, h, { kernel: 'lanczos3' });
  const data = await image.raw().toBuffer();
  const made = { data, w, h };
  levels.set(shrink, made);
  console.log(`  raster level 1/${shrink}: ${w}×${h}`);
  return made;
}

function sample(src: Level, lon: number, lat: number, out: Buffer, at: number) {
  let u = ((lon + 180) / 360) * src.w - 0.5;
  const v = Math.min(src.h - 1, Math.max(0, ((90 - lat) / 180) * src.h - 0.5));
  u = ((u % src.w) + src.w) % src.w;
  const x0 = Math.floor(u);
  const y0 = Math.floor(v);
  const x1 = (x0 + 1) % src.w;
  const y1 = Math.min(src.h - 1, y0 + 1);
  const fx = u - x0;
  const fy = v - y0;
  for (let c = 0; c < 3; c++) {
    const a = src.data[(y0 * src.w + x0) * 3 + c];
    const b = src.data[(y0 * src.w + x1) * 3 + c];
    const d = src.data[(y1 * src.w + x0) * 3 + c];
    const e = src.data[(y1 * src.w + x1) * 3 + c];
    out[at + c] = Math.round((a * (1 - fx) + b * fx) * (1 - fy) + (d * (1 - fx) + e * fx) * fy);
  }
  out[at + 3] = 255;
}

async function render(def: MapViewDef, view: MapViewData, projection: GeoProjection) {
  const PX_PER_UNIT = pxPerUnit(def);
  const w = Math.round((view.width + 2 * TERRAIN_PAD) * PX_PER_UNIT);
  const h = Math.round((view.height + 2 * TERRAIN_PAD) * PX_PER_UNIT);
  // Degrees per output pixel at the centre picks the pyramid level: the
  // coarsest level that still has at least one source pixel per output pixel.
  const centre = projection.invert!([view.width / 2, view.height / 2])!;
  const step = projection.invert!([view.width / 2 + 1 / PX_PER_UNIT, view.height / 2])!;
  const degPerPx = Math.max(1e-6, Math.hypot((step[0] - centre[0]) * Math.cos((centre[1] * Math.PI) / 180), step[1] - centre[1]));
  const fullPxPerDeg = meta.width! / 360;
  let shrink = 1;
  while (shrink < 64 && fullPxPerDeg / (shrink * 2) >= 1.4 / degPerPx) shrink *= 2;
  const src = await level(shrink);
  const out = Buffer.alloc(w * h * 4);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const x = (i + 0.5) / PX_PER_UNIT - TERRAIN_PAD;
      const y = (j + 0.5) / PX_PER_UNIT - TERRAIN_PAD;
      const ll = projection.invert!([x, y]);
      if (!ll || !Number.isFinite(ll[0]) || !Number.isFinite(ll[1])) continue;
      // Off the globe (the world map's corners): the inverse lands somewhere,
      // but projecting it back does not return to this pixel.
      if (def.kind === 'world') {
        const back = projection(ll);
        if (!back || Math.abs(back[0] - x) > 0.05 || Math.abs(back[1] - y) > 0.05 || Math.abs(ll[1]) > 90) continue;
      }
      sample(src, ll[0], ll[1], out, (j * w + i) * 4);
    }
  }
  const webp = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: QUALITY, alphaQuality: 60, effort: 6, smartSubsample: true })
    .toBuffer();
  return { webp, w, h, shrink };
}

/* -------------------------------------------------------------------- main */

async function main() {
meta = await sharp(rasterBuffer, { limitInputPixels: false }).metadata();
mkdirSync(outDir, { recursive: true });
const report: string[] = [];
const peaks: Record<string, Array<[string, number, number]>> = {};
let failed = false;
const fitted = new Map<string, { view: MapViewData; projection: GeoProjection }>();
for (const def of MAP_VIEWS.filter((item) => item.kind !== 'estonia')) {
  const view = readView(def.id);
  const parent = def.kind === 'subregion' && def.worldPart ? fitted.get(def.worldPart) ?? null : null;
  if (def.kind === 'subregion' && !parent) throw new Error(`${def.id}: its world-part view ${def.worldPart} must be built first`);
  const fit = projectionFor(def, view, parent);
  fitted.set(def.id, { view, projection: fit.projection });
  const ok = fit.worst <= FIT_LIMIT && fit.borrowed <= BORROWED_LIMIT;
  const borrowedNote = fit.borrowedPoints ? `, ${fit.borrowed.toFixed(3)} over ${fit.borrowedPoints} borrowed label points` : '';
  console.log(`${def.id}: fit ${fit.worst.toFixed(3)} units over ${fit.points} capitals${borrowedNote}${ok ? '' : '  ← TOO FAR'}`);
  if (!ok) { failed = true; continue; }
  const { webp, w, h, shrink } = await render(def, view, fit.projection);
  writeFileSync(path.join(outDir, `${def.id}.webp`), webp);
  report.push(`${def.id}\t${w}×${h}\t1/${shrink}\t${(webp.length / 1024).toFixed(0)} KB\tfit ${fit.worst.toFixed(3)}`);
  const inView: Array<[string, number, number]> = [];
  for (const peak of PEAKS.filter((item) => def.kind !== 'world' || item.world)) {
    const p = fit.projection([peak.lon, peak.lat]);
    if (!p || p[0] < 4 || p[0] > view.width - 4 || p[1] < 4 || p[1] > view.height - 4) continue;
    if (def.kind === 'world') {
      const back = fit.projection.invert!(p);
      if (!back || Math.abs(back[1] - peak.lat) > 0.01) continue;
    }
    inView.push([peak.id, Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10]);
  }
  peaks[def.id] = inView;
}
if (failed) {
  console.error('Projection fit failed for at least one view; nothing is trustworthy.');
  process.exit(1);
}
writeFileSync(path.join(outDir, 'peaks.json'), `${JSON.stringify({ version: TERRAIN_VERSION, source: source.url, peaks })}\n`);
console.log(report.join('\n'));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
