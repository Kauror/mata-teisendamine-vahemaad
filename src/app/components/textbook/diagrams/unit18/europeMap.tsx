import europe from '@/app/components/textbook/diagrams/data/u18-europe-country-paths.json';
import world from '@/app/components/textbook/diagrams/data/world_continent_paths.json';

// Unit 18 "Euroopa kaart": the map data the four pictures share. Both files
// are local, generalised Natural Earth outlines (public domain), imported at
// build time — nothing is fetched at runtime.
//
// u18-europe-country-paths.json: the textbook package's 1:110m countries of
// Europe in a 900 × 540 plate carrée (x = (lon + 27) · 9, y = (76 − lat) · 12),
// with Crimea joined to Ukraine and Northern Cyprus to Cyprus (see its
// `changes`). Country names are only keys here; nothing names a country in
// the drawing except the lesson/feedback labels.
export const EUROPE_COUNTRY_PATHS: Readonly<Record<string, string>> = europe.countries;
export const EUROPE_SIZE = { width: europe.width, height: europe.height };

// The shared six-continent outlines (720 × 360 equirectangular).
export const CONTINENT_PATHS: Readonly<Record<string, string>> = world.paths;
export const OCEANIA_ISLANDS: string = world.supplementaryPaths['oceania-islands'];

// A crop of the Europe data, drawn into a picture `width` units wide:
// view = (data − origin) · scale.
export type EuropeView = { originX: number; originY: number; scale: number };

export function europeTransform(view: EuropeView): string {
  return `scale(${view.scale}) translate(${-view.originX} ${-view.originY})`;
}

// Every country except the regions' own (those are drawn inside their region,
// so that tapping the country itself selects it).
export function EuropeBase({ view, exclude }: { view: EuropeView; exclude: readonly string[] }) {
  return (
    <g className='tb-u18-base' transform={europeTransform(view)} aria-hidden='true'>
      {Object.entries(EUROPE_COUNTRY_PATHS).filter(([name]) => !exclude.includes(name)).map(([name, d]) => (
        <path key={name} className='tb-u18-land' d={d} />
      ))}
    </g>
  );
}

// One region's country. Tinted (`tint` 1–5) in lessons and feedback; in a
// hotspot question it has the same neutral land colour as every other country.
export function EuropeCountry({ view, name, tint, hotspot }: { view: EuropeView; name: string; tint: number; hotspot: boolean }) {
  const d = EUROPE_COUNTRY_PATHS[name];
  if (!d) throw new Error(`No country path for ${name}`);
  return (
    <g transform={europeTransform(view)}>
      <path className={hotspot ? 'tb-u18-land tb-u18-target' : `tb-u18-land tb-u18-target tb-u18-tint-${tint}`} d={d} fillRule='evenodd' />
    </g>
  );
}
