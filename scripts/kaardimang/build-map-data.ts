// Builds the Kaardimäng data from the downloaded sources:
//   src/content/kaardimang/catalog.json   countries, capitals, special entities
//   public/kaardimang/maps/<version>/*.json   one pre-projected map per view
//   docs/kaardimang/DATA_AUDIT.{json,md}  coverage, exceptions and checks
//
//   npx tsx scripts/kaardimang/build-map-data.ts <dir with the files in sources.json>
//
// The sources are not committed (13 MB of GeoJSON); sources.json pins each
// one by URL and sha256 and the build refuses a file that does not match.
// Nothing here is guessed: names come from EKI, membership from the UN,
// regions from M49, shapes and capital points from Natural Earth, and every
// human decision from curation.ts. A failed hard check stops the build.

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  geoArea,
  geoAzimuthalEqualArea,
  geoBounds,
  geoCentroid,
  geoContains,
  geoDistance,
  geoEqualEarth,
  geoPath,
  geoStream,
  type GeoProjection
} from 'd3-geo';
import polygonClipping from 'polygon-clipping';
import type { Feature, FeatureCollection, MultiPolygon, Polygon, Position } from 'geojson';
import {
  CONTEXT_NAMES,
  CONTINENT_OVERRIDES,
  COUNTRIES,
  EUROPE_ZONE,
  GENITIVE_ET,
  LARGEST_COUNTRIES,
  MERGE_INTO,
  NE_CODE,
  OCEAN_AREAS,
  ANTARCTIC_OCEAN_AREAS,
  OVERSEAS_PARTS,
  SOUTH_POLE,
  SPECIAL_ENTITIES,
  TRANSCONTINENTAL,
  type CapitalSpec
} from './curation';
import {
  CAPITAL_ROLE_LABELS,
  CONTINENTS,
  DATA_VERSION,
  MAP_VIEWS,
  OCEANS,
  WORLD_PARTS,
  type ContinentId,
  type MapViewDef,
  type WorldPartId
} from '../../src/content/kaardimang/regions';
import type { CatalogCapital, CatalogCountry, KaardimangCatalog, MapViewData, MapViewFeature } from '../../src/content/kaardimang/types';

const ROOT = path.resolve(__dirname, '../..');
const rawDir = process.argv[2];
if (!rawDir) {
  console.error('Usage: tsx scripts/kaardimang/build-map-data.ts <raw source dir>');
  process.exit(2);
}

const sources = JSON.parse(readFileSync(path.join(__dirname, 'sources.json'), 'utf8')) as {
  downloadedOn: string;
  files: Record<string, { file: string; url: string; sha256: string; what: string; license?: string }>;
};

function readSource(key: string): string {
  const entry = sources.files[key];
  const buffer = readFileSync(path.join(rawDir, entry.file));
  const sha = createHash('sha256').update(buffer).digest('hex');
  if (sha !== entry.sha256) throw new Error(`${entry.file}: sha256 ${sha} does not match sources.json`);
  return buffer.toString('utf8');
}

const problems: string[] = [];
const warnings: string[] = [];
function fail(message: string) { problems.push(message); }

/* ------------------------------------------------------------ source parse */

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;/g, '’').replace(/&#8216;/g, '‘')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)));
}
function stripTags(html: string): string {
  return decodeEntities(html.replace(/<sup>[\s\S]*?<\/sup>/g, '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

type EkiRow = { nameEt: string; sovereign: boolean; variants: string[]; official: string; capitalRaw: string };
function parseEki(html: string): { rows: EkiRow[]; asOf: string } {
  const start = html.indexOf('<table');
  const end = html.indexOf('</table>', start);
  const rows: EkiRow[] = [];
  for (const [, row] of html.slice(start, end).matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
    const cells = [...row.matchAll(/<td>([\s\S]*?)<\/td>/g)].map((match) => match[1]);
    if (cells.length !== 3 || cells[0].includes('Maa lühi- või tavanimi')) continue;
    const bold = /^\s*<strong>([\s\S]*?)<\/strong>/.exec(cells[0]);
    const withoutNative = cells[0].replace(/<sup>[\s\S]*?<\/sup>/g, '').replace(/\(<em>[\s\S]*?<\/em>\)/g, '').replace(/<\/?strong>/g, '');
    const variants = [...withoutNative.matchAll(/~ ([^(~<]+)/g)].map((match) => stripTags(match[1]));
    const raw = stripTags(cells[0]);
    rows.push({
      nameEt: bold ? stripTags(bold[1]) : raw.replace(/^\*/, '').split(/ ~ | \(/)[0].trim(),
      sovereign: Boolean(bold),
      variants,
      official: stripTags(cells[1]),
      capitalRaw: stripTags(cells[2])
    });
  }
  const asOf = /Seis:\s*(\d{1,2}\.\s*\w+\s*20\d\d)/.exec(stripTags(html))?.[1] ?? '';
  return { rows, asOf };
}

type M49Row = { m49: string; iso2: string; iso3: string; region: string; subregion: string; intermediate: string; name: string };
function parseM49(html: string): Map<string, M49Row> {
  const start = html.indexOf('id="downloadTableEN"');
  const body = html.slice(html.indexOf('<tbody>', start), html.indexOf('</tbody>', start));
  const byIso3 = new Map<string, M49Row>();
  for (const [, row] of body.matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
    const cells = [...row.matchAll(/<td>([\s\S]*?)<\/td>/g)].map((match) => stripTags(match[1]));
    if (cells.length < 12 || !cells[11]) continue;
    byIso3.set(cells[11], { region: cells[3], subregion: cells[5], intermediate: cells[7], name: cells[8], m49: cells[9], iso2: cells[10], iso3: cells[11] });
  }
  return byIso3;
}

function parseUnMembers(html: string): Set<string> {
  return new Set([...html.matchAll(/class="flags flags-([a-z]{2})"/g)].map((match) => match[1].toUpperCase()));
}

/* ----------------------------------------------------------------- catalog */

const eki = parseEki(readSource('eki'));
readSource('ekiCorrections');
const m49 = parseM49(readSource('m49'));
const unMembers = parseUnMembers(readSource('unMembers'));
const placesGeo = JSON.parse(readSource('places')) as FeatureCollection;
const countriesGeo = JSON.parse(readSource('countries')) as FeatureCollection<Polygon | MultiPolygon>;

if (unMembers.size !== 193) fail(`UN member page lists ${unMembers.size} members, expected 193`);
if (!eki.asOf.includes('2026')) warnings.push(`EKI list date not found as expected (got "${eki.asOf}")`);

const ekiByName = new Map(eki.rows.map((row) => [row.nameEt, row]));
const usedEki = new Set<string>();

type Place = { name: string; adm0: string; lat: number; lon: number };
const places: Place[] = placesGeo.features.map((feature) => {
  const p = feature.properties as Record<string, unknown>;
  return { name: String(p.name), adm0: String(p.adm0_a3), lat: Number(p.latitude), lon: Number(p.longitude) };
});

function flagOf(iso2: string): string {
  if (!/^[A-Z]{2}$/.test(iso2)) return '';
  return String.fromCodePoint(...[...iso2].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));
}

function genitiveOf(nameEt: string): string {
  if (GENITIVE_ET[nameEt]) return GENITIVE_ET[nameEt];
  // "X ja Y": every name is declined ("Trinidadi ja Tobago"), so the last
  // letter of the whole name is not enough.
  const consonantPart = nameEt.split(' ja ').find((part) => !/[aeiouõäöüé]$/iu.test(part));
  if (consonantPart && consonantPart !== nameEt) fail(`"${nameEt}": "${consonantPart}" ends in a consonant; add the genitive to curation.ts GENITIVE_ET`);
  if (/[aeiouõäöü]$/i.test(nameEt)) return nameEt;
  fail(`"${nameEt}" ends in a consonant but has no genitive in curation.ts GENITIVE_ET`);
  return nameEt;
}

function neCodeOf(id: string): string {
  return NE_CODE[id] ?? id;
}

function splitEkiCapital(text: string): { nameEt: string; otherNames: string[] } {
  const [main, ...alts] = text.split(' ~ ').map((part) => part.replace(/\s*\(.*$/, '').trim());
  return { nameEt: main, otherNames: alts.filter(Boolean) };
}

function continentOf(worldPart: WorldPartId, subregions: string[], id: string): ContinentId | null {
  if (CONTINENT_OVERRIDES[id]) return CONTINENT_OVERRIDES[id] as ContinentId;
  if (worldPart === 'europe' || worldPart === 'asia') return 'eurasia';
  if (worldPart === 'africa') return 'africa';
  if (worldPart === 'antarctica') return 'antarctica';
  if (worldPart === 'americas') return subregions.includes('south') ? 'south-america' : 'north-america';
  return null;
}

function buildCapitals(id: string, row: EkiRow, specs: CapitalSpec[]): CatalogCapital[] {
  const ekiUrl = sources.files.eki.url;
  if (row.capitalRaw.replace(/\([^)]*\)/g, '').includes(',') && specs.some((spec) => !spec.et)) {
    fail(`${id}: EKI lists several capitals ("${row.capitalRaw}"), so every capital needs an explicit et name`);
  }
  if (specs.length > 1 && specs.some((spec) => !spec.et && spec !== specs[0])) {
    fail(`${id}: secondary capitals need an explicit et name`);
  }
  return specs.map((spec, index) => {
    const fromEki = splitEkiCapital(row.capitalRaw);
    const nameEt = spec.et ?? fromEki.nameEt;
    let lat: number | null = null;
    let lon: number | null = null;
    let positionSourceUrl: string = sources.files.places.url;
    if (spec.coord) {
      [lat, lon] = spec.coord;
      positionSourceUrl = spec.coordSource ?? '';
    } else if (spec.ne) {
      const place = places.find((item) => (item.adm0 === neCodeOf(id) || item.adm0 === id) && item.name === spec.ne)
        ?? places.find((item) => item.name === spec.ne && item.adm0 === MERGE_INTO[item.adm0]);
      if (place) { lat = place.lat; lon = place.lon; } else fail(`${id}: capital "${spec.ne}" not found in Natural Earth places`);
    }
    const slug = nameEt.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return {
      id: `${id.toLowerCase()}-${slug || index}`,
      countryId: id,
      nameEt,
      otherNames: [...new Set([...(spec.et ? [] : fromEki.otherNames), ...(spec.otherNames ?? [])])],
      role: spec.role,
      roleLabelEt: CAPITAL_ROLE_LABELS[spec.role],
      lat,
      lon,
      nameSourceUrl: spec.nameSource ?? ekiUrl,
      positionSourceUrl,
      verifiedOn: sources.downloadedOn,
      quizEligible: spec.quiz && lat !== null,
      noteEt: spec.note ?? null
    };
  });
}

const countries: CatalogCountry[] = [];
for (const [id, nameEt, worldPart, subregions, wellKnown, capitalSpecs] of COUNTRIES) {
  const row = ekiByName.get(nameEt);
  if (!row || !row.sovereign) { fail(`${id}: "${nameEt}" is not an independent-country row in the EKI list`); continue; }
  usedEki.add(nameEt);
  const official = m49.get(id);
  if (!official) { fail(`${id}: not in UN M49`); continue; }
  const part = WORLD_PARTS.find((item) => item.id === worldPart)!;
  for (const sub of subregions) if (!part.subregions.some((item) => item.id === sub)) fail(`${id}: unknown subregion ${worldPart}/${sub}`);
  const status = unMembers.has(official.iso2) ? 'un_member' : id === 'VAT' ? 'un_observer' : null;
  if (!status) fail(`${id}: neither a UN member nor the Holy See`);
  if (capitalSpecs.length === 0 && !/^[–-]$/.test(row.capitalRaw)) fail(`${id}: no capital curated but EKI lists "${row.capitalRaw}"`);
  countries.push({
    id,
    iso2: official.iso2,
    m49: official.m49,
    nameEt,
    nameGenEt: genitiveOf(nameEt),
    otherNamesEt: row.variants,
    officialNameEt: row.official,
    status: status ?? 'un_member',
    target: true,
    worldPart,
    subregions,
    wellKnown,
    continent: continentOf(worldPart, subregions, id),
    m49Region: official.region,
    m49Subregion: official.intermediate || official.subregion,
    flag: flagOf(official.iso2),
    noteEt: id === 'VAT' ? 'Vatikan on linnriik: kogu riik on üks väike linn Rooma sees. Eraldi pealinna ei ole.' : null,
    capitals: buildCapitals(id, row, capitalSpecs)
  });
}

for (const [id, nameEt, worldPart, subregions, status, capitalSpecs, noteEt] of SPECIAL_ENTITIES) {
  const row = ekiByName.get(nameEt);
  if (!row) { fail(`${id}: "${nameEt}" missing from the EKI list`); continue; }
  usedEki.add(nameEt);
  const official = m49.get(id);
  const iso2 = official?.iso2 ?? (id === 'XKX' ? 'XK' : '');
  countries.push({
    id,
    iso2,
    m49: official?.m49 ?? null,
    nameEt,
    nameGenEt: genitiveOf(nameEt),
    otherNamesEt: row.variants,
    officialNameEt: row.official,
    status,
    target: false,
    worldPart,
    subregions,
    wellKnown: false,
    continent: continentOf(worldPart, subregions, id),
    m49Region: official?.region ?? null,
    m49Subregion: official ? official.intermediate || official.subregion : null,
    flag: flagOf(iso2),
    noteEt,
    capitals: buildCapitals(id, row, capitalSpecs).map((capital) => ({ ...capital, quizEligible: false }))
  });
}

const targets = countries.filter((country) => country.target);
const coveredIso2 = new Set(targets.map((country) => country.iso2));
for (const iso2 of unMembers) if (!coveredIso2.has(iso2)) fail(`UN member ${iso2} has no catalog row`);
for (const row of eki.rows) if (row.sovereign && !usedEki.has(row.nameEt)) fail(`EKI independent country "${row.nameEt}" not mapped`);
const ids = countries.map((country) => country.id);
if (new Set(ids).size !== ids.length) fail('duplicate country ids');
for (const country of countries) if (country.target && country.subregions.length === 0) fail(`${country.id}: no subregion`);
for (const part of WORLD_PARTS) {
  for (const sub of part.subregions) {
    if (!targets.some((country) => country.worldPart === part.id && country.subregions.includes(sub.id))) fail(`subregion ${part.id}/${sub.id} is empty`);
  }
}
const byId = new Map(countries.map((country) => [country.id, country]));

/* ---------------------------------------------------------------- geometry */

type Ring = Position[];
type Poly = Ring[];
type Part = { poly: Poly; worldPart: WorldPartId | null; continent: ContinentId | null; centroid: [number, number]; area: number };
type Entity = { id: string; kind: 'target' | 'special' | 'context'; nameEt: string; parts: Part[]; label: [number, number]; m49: M49Row | undefined };

function signedArea(ring: Ring): number {
  let sum = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) sum += (ring[i][0] - ring[j][0]) * (ring[i][1] + ring[j][1]);
  return sum / 2; // > 0: clockwise in lon/lat with y up
}
// d3-geo wants exterior rings clockwise and holes counter-clockwise.
function d3Winding(poly: Poly): Poly {
  return poly.map((ring, index) => {
    const clockwise = signedArea(ring) > 0;
    return (index === 0) === clockwise ? ring : [...ring].reverse();
  });
}

const reverseNe = new Map(Object.entries(NE_CODE).map(([id, ne]) => [ne, id]));
const entities = new Map<string, Entity>();
const unnamedContext: string[] = [];

for (const feature of countriesGeo.features) {
  const p = feature.properties as Record<string, string | number>;
  const code = String(p.ADM0_A3);
  const id = MERGE_INTO[code] ?? reverseNe.get(code) ?? code;
  const country = byId.get(id);
  const kind: Entity['kind'] = country ? (country.target ? 'target' : 'special') : 'context';
  const nameEt = country?.nameEt ?? CONTEXT_NAMES[id] ?? '';
  if (!country && !CONTEXT_NAMES[id]) unnamedContext.push(`${code} ${p.NAME}`);
  const polys = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  const iso3 = String(p.ISO_A3_EH);
  const m49Row = m49.get(country?.id ?? iso3);
  let entity = entities.get(id);
  if (!entity) {
    entity = { id, kind, nameEt, parts: [], label: [Number(p.LABEL_X), Number(p.LABEL_Y)], m49: m49Row };
    entities.set(id, entity);
  }
  for (const poly of polys) {
    const fixed = d3Winding(poly);
    const geometry: Polygon = { type: 'Polygon', coordinates: fixed };
    entity.parts.push({ poly: fixed, worldPart: null, continent: null, centroid: geoCentroid(geometry) as [number, number], area: geoArea(geometry) });
  }
}
if (unnamedContext.length) warnings.push(`Context features without an Estonian label (drawn unlabeled): ${unnamedContext.join(', ')}`);
for (const country of countries) if (!entities.has(country.id)) fail(`${country.id}: no geometry in Natural Earth`);

function contextWorldPart(entity: Entity): WorldPartId | null {
  if (entity.id === 'ATA') return 'antarctica';
  switch (entity.m49?.region) {
    case 'Europe': return 'europe';
    case 'Asia': return 'asia';
    case 'Africa': return 'africa';
    case 'Americas': return 'americas';
    case 'Oceania': return 'oceania';
    default: return null;
  }
}

for (const entity of entities.values()) {
  const country = byId.get(entity.id);
  const worldPart = country?.worldPart ?? contextWorldPart(entity);
  const subregions = country?.subregions ?? (entity.m49?.subregion === 'Latin America and the Caribbean' && entity.m49.intermediate === 'South America' ? ['south'] : []);
  const continent = worldPart ? (country?.continent ?? continentOf(worldPart, subregions, entity.id)) : null;
  for (const part of entity.parts) {
    part.worldPart = worldPart;
    part.continent = worldPart === 'oceania' && entity.id !== 'AUS' ? null : continent;
    const overseas = OVERSEAS_PARTS[entity.id]?.find(({ box: [w, s, e, n] }) => part.centroid[0] >= w && part.centroid[0] <= e && part.centroid[1] >= s && part.centroid[1] <= n);
    if (overseas) { part.worldPart = overseas.worldPart; part.continent = overseas.continent as ContinentId | null; }
  }
}

// The three transcontinental countries, split along the Europe/Asia divide.
// Used only by the Maailm view's Maailmajaod set and to frame Europe.
const europeZone: Poly = [EUROPE_ZONE.map(([lon, lat]) => [lon, lat])];
function splitByEurope(entity: Entity): Part[] {
  const out: Part[] = [];
  for (const part of entity.parts) {
    const geom = part.poly as unknown as Parameters<typeof polygonClipping.intersection>[0];
    const inside = polygonClipping.intersection(geom, europeZone as never);
    const outside = polygonClipping.difference(geom, europeZone as never);
    for (const [pieces, worldPart] of [[inside, 'europe'], [outside, 'asia']] as const) {
      for (const piece of pieces) {
        const fixed = d3Winding(piece as Poly);
        const geometry: Polygon = { type: 'Polygon', coordinates: fixed };
        out.push({ poly: fixed, worldPart, continent: 'eurasia', centroid: geoCentroid(geometry) as [number, number], area: geoArea(geometry) });
      }
    }
  }
  return out;
}
const splitParts = new Map(TRANSCONTINENTAL.map((id) => [id, splitByEurope(entities.get(id)!)]));

/* ------------------------------------------------------------- projection */

const WIDTH = 1000;
const MARGIN = 24;

function asMulti(parts: Part[]): MultiPolygon {
  return { type: 'MultiPolygon', coordinates: parts.map((part) => part.poly) };
}

// The parts that frame a view: a country's main land and what lies near it,
// not every far-away island (French Guiana does not frame Western Europe).
function coreParts(entity: Entity, view: MapViewDef): Part[] {
  if (entity.id === 'RUS' && view.worldPart === 'europe') return splitParts.get('RUS')!.filter((part) => part.worldPart === 'europe');
  const main = entity.parts.reduce((best, part) => (part.area > best.area ? part : best));
  const limitKm = entity.id === 'USA' ? 6000 : 2500;
  return entity.parts.filter((part) => geoDistance(part.centroid, main.centroid) * 6371 <= limitKm);
}

function viewTargets(view: MapViewDef): CatalogCountry[] {
  if (view.kind === 'world' || view.kind === 'antarctica') return [];
  return countries.filter((country) => country.worldPart === view.worldPart && (view.kind === 'part' || country.subregions.includes(view.subregion!)));
}

function projectionFor(view: MapViewDef): { projection: GeoProjection; height: number } {
  if (view.kind === 'world') {
    const projection = geoEqualEarth();
    projection.fitWidth(WIDTH - 2 * MARGIN, { type: 'Sphere' });
    const [[, y0], [, y1]] = geoPath(projection).bounds({ type: 'Sphere' });
    const height = Math.ceil(y1 - y0 + 2 * MARGIN);
    projection.fitExtent([[MARGIN, MARGIN], [WIDTH - MARGIN, height - MARGIN]], { type: 'Sphere' });
    return { projection, height };
  }
  if (view.kind === 'antarctica') {
    const projection = geoAzimuthalEqualArea().rotate([0, 90]).clipAngle(78);
    const ring: Ring = Array.from({ length: 73 }, (_, i) => [-180 + i * 5, -20]);
    projection.fitExtent([[MARGIN, MARGIN], [WIDTH - MARGIN, WIDTH - MARGIN]], { type: 'Polygon', coordinates: [ring.reverse()] });
    return { projection, height: WIDTH };
  }
  const frame: Feature<MultiPolygon> = {
    type: 'Feature', properties: {},
    geometry: asMulti(viewTargets(view).flatMap((country) => coreParts(entities.get(country.id)!, view)))
  };
  const [lon, lat] = geoCentroid(frame);
  const projection = geoAzimuthalEqualArea().rotate([-lon, -lat]).clipAngle(90);
  projection.scale(1).translate([0, 0]);
  const [[x0, y0], [x1, y1]] = geoPath(projection).bounds(frame);
  const aspect = Math.min(1.2, Math.max(0.6, (y1 - y0) / (x1 - x0)));
  const height = Math.round(WIDTH * aspect);
  projection.fitExtent([[MARGIN, MARGIN], [WIDTH - MARGIN, height - MARGIN]], frame);
  return { projection, height };
}

/* ------------------------------------------------- rings, simplify, encode */

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

// Streams a geometry through the projection (with its clipping) and collects
// the projected rings, which d3's own path writer would not let us simplify.
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

function ellipse([lon, lat, rx, ry]: [number, number, number, number]): Polygon {
  const ring: Position[] = Array.from({ length: 49 }, (_, i) => {
    const a = (i / 48) * 2 * Math.PI;
    return [lon + rx * Math.cos(a), Math.max(-89.9, Math.min(89.9, lat + ry * Math.sin(a)))];
  });
  let polygon: Polygon = { type: 'Polygon', coordinates: [ring] };
  if (geoArea(polygon) > 2 * Math.PI) polygon = { type: 'Polygon', coordinates: [[...ring].reverse()] };
  return polygon;
}

function band(latOuter: number, latInner: number): Polygon {
  const circle = (lat: number) => Array.from({ length: 73 }, (_, i): Position => [-180 + i * 5, lat]);
  let polygon: Polygon = { type: 'Polygon', coordinates: [circle(latOuter), [...circle(latInner)].reverse()] };
  if (geoArea(polygon) > 2 * Math.PI) polygon = { type: 'Polygon', coordinates: [[...circle(latOuter)].reverse(), circle(latInner)] };
  return polygon;
}

const round1 = (value: number) => Math.round(value * 10) / 10;

/* ------------------------------------------------------------ build views */

const outDir = path.join(ROOT, 'public', 'kaardimang', 'maps', DATA_VERSION);
rmSync(path.join(ROOT, 'public', 'kaardimang', 'maps'), { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

type ViewReport = { id: string; bytes: number; targets: number; tappable: number; markers: number; capitals: number };
const viewReports: ViewReport[] = [];
const tappableIn = new Map<string, Set<string>>();

function buildView(view: MapViewDef): MapViewData {
  const { projection, height } = projectionFor(view);
  projection.clipExtent([[-40, -40], [WIDTH + 40, height + 40]]);
  const tolerance = view.kind === 'world' ? 0.6 : 0.5;
  const scale = WIDTH / 1000;
  const targetIds = new Set(view.kind === 'part' || view.kind === 'subregion' ? viewTargets(view).filter((country) => country.target).map((country) => country.id) : view.kind === 'world' ? LARGEST_COUNTRIES : []);
  const features: MapViewFeature[] = [];
  const markers: MapViewData['markers'] = [];
  const labels: MapViewData['labels'] = {};
  const boxes = new Map<string, [number, number]>();
  const tagged = view.kind === 'world' || view.kind === 'antarctica';

  for (const entity of entities.values()) {
    const groups: Array<{ parts: Part[]; worldPart: WorldPartId | null; continent: ContinentId | null }> = [];
    if (tagged) {
      const parts = view.kind === 'world' && splitParts.has(entity.id) ? splitParts.get(entity.id)! : entity.parts;
      const keys = new Map<string, Part[]>();
      for (const part of parts) {
        const key = `${part.worldPart}|${part.continent}`;
        keys.set(key, [...(keys.get(key) ?? []), part]);
      }
      for (const [key, list] of keys) {
        const [worldPart, continent] = key.split('|');
        groups.push({ parts: list, worldPart: worldPart === 'null' ? null : worldPart as WorldPartId, continent: continent === 'null' ? null : continent as ContinentId });
      }
    } else {
      groups.push({ parts: entity.parts, worldPart: null, continent: null });
    }
    let entityRings: Position[][] = [];
    for (const group of groups) {
      const rings = projectRings(projection, asMulti(group.parts));
      if (!rings.length) continue;
      entityRings = entityRings.concat(rings);
      // A microstate's land can vanish at this scale; its marker still stands for it.
      const d = encodePath(rings, tolerance, 0.8);
      if (!d) continue;
      const role = targetIds.has(entity.id) ? 't' : entity.kind === 'context' ? 'c' : entity.kind === 'special' ? 's' : 'n';
      features.push({ id: entity.id, role, d, ...(tagged ? { wp: group.worldPart, ct: group.continent } : {}) });
    }
    if (!entityRings.length) continue;
    const [x0, y0, x1, y1] = ringBox(entityRings);
    boxes.set(entity.id, [x1 - x0, y1 - y0]);
    const label = projection(entity.label);
    if (label && label[0] >= 0 && label[0] <= WIDTH && label[1] >= 0 && label[1] <= height) {
      labels[entity.id] = [round1(label[0]), round1(label[1]), round1(Math.min(x1 - x0, WIDTH))];
    }
    const country = byId.get(entity.id);
    // Land you can hardly see at this scale (a microstate, an atoll state): a dot
    // stands for it, with a hit circle around it. Visible-but-small countries get
    // no dot; where they are too small to tap they are asked with buttons instead.
    // Land area, not extent: an atoll state spread over 3000 km is still tiny.
    const landArea = entityRings.reduce((sum, ring) => sum + Math.abs(signedArea(ring)), 0);
    // A special entity (Kosovo, Palestiina, Taiwan) gets one only in its own set's view.
    const ownSpecial = country && !country.target && !tagged && country.worldPart === view.worldPart && (view.kind === 'part' || country.subregions.includes(view.subregion!));
    if (country && (targetIds.has(entity.id) || ownSpecial) && landArea < (12 * scale) ** 2) {
      // On the land: the capital for a scattered island state, else NE's label point.
      const capital = country.capitals.find((item) => item.lat !== null && item.lon !== null);
      const atCapital = capital ? projection([capital.lon!, capital.lat!]) : null;
      const inBox = (point: [number, number] | null) => point && point[0] >= x0 && point[0] <= x1 && point[1] >= y0 && point[1] <= y1;
      const at = inBox(atCapital) ? atCapital! : inBox(label) ? label! : [(x0 + x1) / 2, (y0 + y1) / 2];
      markers.push({ id: entity.id, x: round1(at[0]), y: round1(at[1]), r: 5, hr: 34 });
    }
  }

  // Hit circles never overlap: each takes at most half the gap to its nearest neighbour.
  for (const marker of markers) {
    const nearest = Math.min(...markers.filter((other) => other !== marker).map((other) => Math.hypot(other.x - marker.x, other.y - marker.y)), Infinity);
    marker.hr = round1(Math.max(marker.r + 2, Math.min(34, nearest / 2)));
  }

  const tappable = new Set<string>();
  for (const id of targetIds) {
    const box = boxes.get(id);
    if (!box) continue;
    const marker = markers.find((item) => item.id === id);
    // Roughly 10 px on a phone: a child can hit it without hitting a neighbour.
    if (marker ? marker.hr >= 20 : Math.min(box[0], box[1]) >= 28) tappable.add(id);
  }
  tappableIn.set(view.id, tappable);

  const capitals: MapViewData['capitals'] = [];
  for (const country of countries) {
    if (!(targetIds.has(country.id) || (!country.target && features.some((feature) => feature.id === country.id)))) continue;
    for (const capital of country.capitals) {
      if (capital.lat === null || capital.lon === null) continue;
      const at = projection([capital.lon, capital.lat]);
      if (!at || at[0] < 0 || at[0] > WIDTH || at[1] < 0 || at[1] > height) continue;
      capitals.push({ id: capital.id, countryId: country.id, x: round1(at[0]), y: round1(at[1]) });
    }
  }

  const areas: MapViewData['areas'] = [];
  if (view.kind === 'world') {
    for (const [id, list] of Object.entries(OCEAN_AREAS)) {
      for (const spec of list) {
        const d = encodePath(projectRings(projection, ellipse(spec)), 0.4, 1);
        if (d) areas.push({ id, kind: 'ocean', d });
      }
    }
  }
  if (view.kind === 'antarctica') {
    for (const [id, list] of Object.entries(ANTARCTIC_OCEAN_AREAS)) {
      for (const spec of list) {
        const d = encodePath(projectRings(projection, spec === 'band' ? band(-56, -63) : ellipse(spec)), 0.4, 1);
        if (d) areas.push({ id, kind: 'ocean', d });
      }
    }
    const pole = projection(SOUTH_POLE)!;
    // "Leia lõunapoolus" is answered only on the map, and nothing else is near
    // the pole: a 44 px circle on a 360 px phone (1000 units ≈ 338 px).
    markers.push({ id: 'south-pole', x: round1(pole[0]), y: round1(pole[1]), r: 7, hr: 66 });
  }

  const background = view.kind === 'world' ? encodePath(projectRings(projection, { type: 'Polygon', coordinates: [[[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]]] }), 0.4, 1) : null;
  const sphere = view.kind === 'world' ? geoPath(projection).digits(1)({ type: 'Sphere' }) ?? background : null;

  return {
    id: view.id,
    version: DATA_VERSION,
    width: WIDTH,
    height,
    sphere,
    features,
    markers,
    labels,
    capitals,
    areas
  };
}

for (const view of MAP_VIEWS) {
  const data = buildView(view);
  const json = JSON.stringify(data);
  writeFileSync(path.join(outDir, `${view.id}.json`), json);
  viewReports.push({
    id: view.id,
    bytes: json.length,
    targets: new Set([...data.features.filter((feature) => feature.role === 't').map((feature) => feature.id), ...data.markers.map((marker) => marker.id).filter((id) => byId.get(id)?.target)]).size,
    tappable: tappableIn.get(view.id)!.size,
    markers: data.markers.length,
    capitals: data.capitals.length
  });
  if (view.kind === 'world') {
    for (const continent of CONTINENTS) if (!data.features.some((feature) => feature.ct === continent.id)) fail(`world view: continent ${continent.id} has no area`);
    for (const part of WORLD_PARTS) if (!data.features.some((feature) => feature.wp === part.id)) fail(`world view: world part ${part.id} has no area`);
    for (const ocean of OCEANS) if (!data.areas.some((area) => area.id === ocean.id)) fail(`world view: ocean ${ocean.id} has no touch area`);
    const pacificSides = new Set(data.areas.filter((area) => area.id === 'pacific').map((area) => {
      const x = Number(/^M(-?[\d.]+)/.exec(area.d)![1]);
      return x < WIDTH / 2 ? 'left' : 'right';
    }));
    if (pacificSides.size !== 2) fail('world view: the Pacific must be touchable on both map edges');
  }
  if ((view.kind === 'part' || view.kind === 'subregion') && data.features.every((feature) => feature.role !== 't')) fail(`${view.id}: no target countries on the map`);
}

/* ------------------------------------------------------------ write output */

// Tappable views per country, so the engine knows where a map tap is fair.
for (const country of countries) {
  const tappable = MAP_VIEWS.filter((view) => tappableIn.get(view.id)!.has(country.id)).map((view) => view.id);
  (country as CatalogCountry & { tappableIn?: string[] }).tappableIn = tappable;
}

// Capital position check: inside the country, or within 30 km of it (coastal
// capitals on simplified coastlines). Anything else is reported and blocked.
const capitalChecks: Array<{ capitalId: string; countryId: string; status: 'inside' | 'near' | 'outside' | 'no_position'; km: number | null }> = [];
for (const country of countries) {
  const entity = entities.get(country.id);
  for (const capital of country.capitals) {
    if (capital.lat === null || capital.lon === null || !entity) {
      capitalChecks.push({ capitalId: capital.id, countryId: country.id, status: 'no_position', km: null });
      continue;
    }
    const point: [number, number] = [capital.lon, capital.lat];
    const inside = geoContains(asMulti(entity.parts), point);
    let km = 0;
    if (!inside) {
      km = Infinity;
      for (const part of entity.parts) for (const ring of part.poly) for (const vertex of ring) km = Math.min(km, geoDistance(point, vertex as [number, number]) * 6371);
    }
    const status = inside ? 'inside' : km <= 30 ? 'near' : 'outside';
    if (status === 'outside') {
      fail(`${capital.id}: capital point is ${Math.round(km)} km outside ${country.id}`);
      capital.quizEligible = false;
    }
    capitalChecks.push({ capitalId: capital.id, countryId: country.id, status, km: inside ? 0 : Math.round(km * 10) / 10 });
  }
}

const catalog: KaardimangCatalog = {
  version: DATA_VERSION,
  builtFrom: Object.fromEntries(Object.entries(sources.files).map(([key, file]) => [key, { url: file.url, sha256: file.sha256 }])),
  ekiAsOf: eki.asOf,
  countries,
  contextNames: Object.fromEntries([...entities.values()].filter((entity) => entity.kind === 'context' && entity.nameEt).map((entity) => [entity.id, entity.nameEt]))
};
writeFileSync(path.join(ROOT, 'src', 'content', 'kaardimang', 'catalog.json'), `${JSON.stringify(catalog, null, 1)}\n`);

/* ------------------------------------------------------------------- audit */

const perPart = WORLD_PARTS.map((part) => {
  const list = targets.filter((country) => country.worldPart === part.id);
  return {
    worldPart: part.id,
    nameEt: part.nameEt,
    countries: list.length,
    unMembers: list.filter((country) => country.status === 'un_member').length,
    quizCapitals: list.filter((country) => country.capitals.some((capital) => capital.quizEligible)).length,
    noQuizCapital: list.filter((country) => !country.capitals.some((capital) => capital.quizEligible)).map((country) => country.id),
    subregions: part.subregions.map((sub) => {
      const members = list.filter((country) => country.subregions.includes(sub.id));
      const view = `${part.id}-${sub.id}`;
      return {
        id: sub.id,
        nameEt: sub.nameEt,
        countries: members.length,
        tappableOnMap: members.filter((country) => tappableIn.get(view)!.has(country.id)).length,
        answerButtonsOnly: members.filter((country) => !tappableIn.get(view)!.has(country.id)).map((country) => country.id)
      };
    })
  };
});

const audit = {
  dataVersion: DATA_VERSION,
  builtOn: sources.downloadedOn,
  sources: sources.files,
  ekiAsOf: eki.asOf,
  totals: {
    targetCountries: targets.length,
    unMembers: targets.filter((country) => country.status === 'un_member').length,
    unObserversAsTargets: targets.filter((country) => country.status === 'un_observer').map((country) => country.id),
    exploreOnly: countries.filter((country) => !country.target).map((country) => ({ id: country.id, nameEt: country.nameEt, status: country.status, noteEt: country.noteEt })),
    quizEligibleCapitals: countries.flatMap((country) => country.capitals).filter((capital) => capital.quizEligible).length
  },
  perWorldPart: perPart,
  capitalExceptions: countries
    .filter((country) => country.capitals.length !== 1 || country.capitals.some((capital) => !capital.quizEligible || capital.noteEt))
    .map((country) => ({
      id: country.id,
      nameEt: country.nameEt,
      capitals: country.capitals.map((capital) => ({ nameEt: capital.nameEt, role: capital.role, quizEligible: capital.quizEligible, noteEt: capital.noteEt, positionSourceUrl: capital.positionSourceUrl }))
    })),
  capitalPositionChecks: {
    inside: capitalChecks.filter((check) => check.status === 'inside').length,
    nearCoast: capitalChecks.filter((check) => check.status === 'near'),
    outside: capitalChecks.filter((check) => check.status === 'outside'),
    noPosition: capitalChecks.filter((check) => check.status === 'no_position')
  },
  geometry: {
    source: sources.files.countries.what,
    mergedFeatures: MERGE_INTO,
    transcontinentalSplit: TRANSCONTINENTAL,
    overseasParts: Object.fromEntries(Object.entries(OVERSEAS_PARTS).map(([id, list]) => [id, list.map((item) => item.noteEt)])),
    contextFeatures: [...entities.values()].filter((entity) => entity.kind === 'context').map((entity) => `${entity.id} ${entity.nameEt || '(nimeta)'}`)
  },
  views: viewReports,
  warnings,
  problems
};

const docsDir = path.join(ROOT, 'docs', 'kaardimang');
mkdirSync(docsDir, { recursive: true });
writeFileSync(path.join(docsDir, 'DATA_AUDIT.json'), `${JSON.stringify(audit, null, 1)}\n`);

const md: string[] = [];
md.push('# Kaardimäng – andmeaudit', '');
md.push(`Andmeversioon **${DATA_VERSION}**, ehitatud ${sources.downloadedOn}. EKI loendi seis: ${eki.asOf}.`, '');
md.push(problems.length ? `**${problems.length} viga – andmestik ei ole avaldatav.**` : '**Kõik kohustuslikud kontrollid läbitud.**', '');
md.push('## Allikad', '', '| Andmed | Allikas | sha256 |', '| --- | --- | --- |');
for (const file of Object.values(sources.files)) md.push(`| ${file.what} | ${file.url} | \`${file.sha256.slice(0, 16)}…\` |`);
md.push('', '## Kokkuvõte', '');
md.push(`- Mängu sihtriike: **${audit.totals.targetCountries}** (ÜRO liikmed ${audit.totals.unMembers} + Vatikan).`);
md.push(`- Ainult avastamiseks (ei ole hinnatud küsimuste sihtmärk): ${audit.totals.exploreOnly.map((item) => item.nameEt).join(', ')}.`);
md.push(`- Pealinnaküsimustes kasutatavaid pealinnu: ${audit.totals.quizEligibleCapitals}.`);
md.push(`- Pealinnapunktid: ${audit.capitalPositionChecks.inside} riigi sees, ${audit.capitalPositionChecks.nearCoast.length} ranniku lähedal (≤30 km lihtsustatud rannajoonest), ${audit.capitalPositionChecks.outside.length} väljas, ${audit.capitalPositionChecks.noPosition.length} ilma asukohata.`);
md.push('', '## Maailmajaod ja õpperühmad', '', '| Maailmajagu | Riike | Pealinnaküsimusega | Õpperühmad (riike / kaardil puudutatav) |', '| --- | ---: | ---: | --- |');
for (const part of perPart) {
  md.push(`| ${part.nameEt} | ${part.countries} | ${part.quizCapitals} | ${part.subregions.map((sub) => `${sub.nameEt} ${sub.countries}/${sub.tappableOnMap}`).join('; ') || '–'} |`);
}
md.push('', 'Riigid, mida mõnes õpperühma vaates puudutada ei saa (liiga väikesed), küsitakse seal vastusenuppudega („Mis riik on esile tõstetud?“).', '');
md.push('## Pealinnade erandid', '', '| Riik | Pealinn(ad) | Pealinnaküsimuses | Märkus |', '| --- | --- | --- | --- |');
for (const item of audit.capitalExceptions) {
  for (const capital of item.capitals.length ? item.capitals : [{ nameEt: '–', role: '', quizEligible: false, noteEt: byId.get(item.id)?.noteEt ?? '' }]) {
    md.push(`| ${item.nameEt} | ${capital.nameEt}${capital.role ? ` (${CAPITAL_ROLE_LABELS[capital.role as keyof typeof CAPITAL_ROLE_LABELS]})` : ''} | ${capital.quizEligible ? 'jah' : 'ei'} | ${capital.noteEt ?? ''} |`);
  }
}
md.push('', '## Geomeetria otsused', '');
md.push('- Natural Earthi Saksamaa vaatenurga kaart: Krimm on Ukraina osa, Põhja-Küpros Küprose ja Somaliland Somaalia osa (ÜRO seisukoht).');
md.push(`- Liidetud alad: ${Object.entries(MERGE_INTO).map(([from, to]) => `${from} → ${to}`).join(', ')} (Baikonur ja Guantánamo kuuluvad vastavalt Kasahstanile ja Kuubale).`);
md.push('- Venemaa, Kasahstan ja Türgi on Maailmajagude küsimustes jagatud Uurali, Uurali jõe, Kaspia mere, Kuma–Manõtši nõo ja Bosporuse järgi; riigiküsimustes on nad tervikud.');
md.push('- Prantsusmaa ülemeremaad (Prantsuse Guajaana, Guadeloupe, Martinique, Réunion, Mayotte) ja Hollandi Kariibi saared kuuluvad Maailmajagude/Mandrite küsimustes oma geograafilisse piirkonda.');
md.push('- Lääne-Sahara, Kosovo, Palestiina ja Taiwan on kaardil eraldi, kuid ei ole hinnatud küsimuste sihtmärgid; Uuri-režiim selgitab nende staatust neutraalselt.');
md.push('- Ookeanide küsimustes on iga ookeani kohal kindlad süvaookeani puutealad; Vaikne ookean on puudutatav kaardi mõlemal serval sama vastusena. Rannikute lähedal tehtud puudutus ei ole kunagi vale vastus.');
md.push('', '## Kaardivaated', '', '| Vaade | Sihtriike | Kaardil puudutatav | Väikeriigi markereid | Pealinnapunkte | Suurus |', '| --- | ---: | ---: | ---: | ---: | ---: |');
for (const view of viewReports) md.push(`| ${view.id} | ${view.targets} | ${view.tappable} | ${view.markers} | ${view.capitals} | ${Math.round(view.bytes / 1024)} KB |`);
if (warnings.length) md.push('', '## Hoiatused', '', ...warnings.map((warning) => `- ${warning}`));
if (problems.length) md.push('', '## Vead', '', ...problems.map((problem) => `- ${problem}`));
writeFileSync(path.join(docsDir, 'DATA_AUDIT.md'), `${md.join('\n')}\n`);

const total = viewReports.reduce((sum, view) => sum + view.bytes, 0);
console.log(`Kaardimäng ${DATA_VERSION}: ${targets.length} target countries, ${countries.length - targets.length} explore-only, ${viewReports.length} views, ${Math.round(total / 1024)} KB of maps.`);
for (const warning of warnings) console.warn(`warning: ${warning}`);
if (problems.length) {
  for (const problem of problems) console.error(`error: ${problem}`);
  process.exit(1);
}
