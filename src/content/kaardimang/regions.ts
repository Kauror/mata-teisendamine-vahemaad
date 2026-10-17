// Kaardimäng: the world parts, learning sets, levels and map views. This file
// is shared by the data build (scripts/kaardimang), the server and the UI, so
// it holds plain data only.
//
// Terms follow Kiur's textbook: six mandrid (unit 15), six maailmajaod
// (unit 15) and five ookeanid (unit 16). Mandrid and maailmajaod are different
// things and keep different ids even where the Estonian names coincide.

export type WorldPartId = 'europe' | 'asia' | 'africa' | 'americas' | 'oceania' | 'antarctica';
export type ContinentId = 'eurasia' | 'africa' | 'north-america' | 'south-america' | 'australia' | 'antarctica';
export type OceanId = 'pacific' | 'atlantic' | 'indian' | 'arctic' | 'southern';
export type LevelId = 'explorer' | 'traveler' | 'geographer';
export type CapitalRole = 'official' | 'administrative' | 'legislative' | 'judicial' | 'seat_of_government' | 'de_facto' | 'claimed' | 'other';

export type Subregion = { id: string; nameEt: string };
export type WorldPart = { id: WorldPartId; nameEt: string; icon: string; subregions: Subregion[] };

export const DATA_VERSION = '2026-10-17.1';

// genEt: "Leia Antarktise manner."
export const CONTINENTS: Array<{ id: ContinentId; nameEt: string; genEt: string }> = [
  { id: 'eurasia', nameEt: 'Euraasia', genEt: 'Euraasia' },
  { id: 'africa', nameEt: 'Aafrika', genEt: 'Aafrika' },
  { id: 'north-america', nameEt: 'Põhja-Ameerika', genEt: 'Põhja-Ameerika' },
  { id: 'south-america', nameEt: 'Lõuna-Ameerika', genEt: 'Lõuna-Ameerika' },
  { id: 'australia', nameEt: 'Austraalia', genEt: 'Austraalia' },
  { id: 'antarctica', nameEt: 'Antarktis', genEt: 'Antarktise' }
];

export const OCEANS: Array<{ id: OceanId; nameEt: string }> = [
  { id: 'pacific', nameEt: 'Vaikne ookean' },
  { id: 'atlantic', nameEt: 'Atlandi ookean' },
  { id: 'indian', nameEt: 'India ookean' },
  { id: 'arctic', nameEt: 'Põhja-Jäämeri' },
  { id: 'southern', nameEt: 'Lõuna-Jäämeri' }
];

export const WORLD_PARTS: WorldPart[] = [
  {
    id: 'europe', nameEt: 'Euroopa', icon: '🏰', subregions: [
      { id: 'baltics', nameEt: 'Baltikum' },
      { id: 'nordic', nameEt: 'Põhjamaad' },
      { id: 'western', nameEt: 'Lääne-Euroopa' },
      { id: 'central', nameEt: 'Kesk-Euroopa' },
      { id: 'southern', nameEt: 'Lõuna-Euroopa' },
      { id: 'eastern', nameEt: 'Ida-Euroopa' },
      { id: 'balkans', nameEt: 'Balkani piirkond' }
    ]
  },
  {
    id: 'asia', nameEt: 'Aasia', icon: '🐼', subregions: [
      { id: 'east', nameEt: 'Ida-Aasia' },
      { id: 'southeast', nameEt: 'Kagu-Aasia' },
      { id: 'south', nameEt: 'Lõuna-Aasia' },
      { id: 'central', nameEt: 'Kesk-Aasia' },
      { id: 'west', nameEt: 'Lääne-Aasia' }
    ]
  },
  {
    id: 'africa', nameEt: 'Aafrika', icon: '🦁', subregions: [
      { id: 'north', nameEt: 'Põhja-Aafrika' },
      { id: 'west', nameEt: 'Lääne-Aafrika' },
      { id: 'central', nameEt: 'Kesk-Aafrika' },
      { id: 'east', nameEt: 'Ida-Aafrika' },
      { id: 'south', nameEt: 'Lõuna-Aafrika' }
    ]
  },
  {
    id: 'americas', nameEt: 'Ameerika', icon: '🦜', subregions: [
      { id: 'north-large', nameEt: 'USA, Kanada ja Mehhiko' },
      { id: 'central', nameEt: 'Kesk-Ameerika' },
      { id: 'caribbean', nameEt: 'Kariibid' },
      { id: 'south', nameEt: 'Lõuna-Ameerika' }
    ]
  },
  {
    id: 'oceania', nameEt: 'Austraalia ja Okeaania', icon: '🦘', subregions: [
      { id: 'australia-nz', nameEt: 'Austraalia ja Uus-Meremaa' },
      { id: 'melanesia', nameEt: 'Melaneesia' },
      { id: 'micronesia', nameEt: 'Mikroneesia' },
      { id: 'polynesia', nameEt: 'Polüneesia' }
    ]
  },
  { id: 'antarctica', nameEt: 'Antarktika', icon: '🐧', subregions: [] }
];

export const LEVELS: Array<{ id: LevelId; nameEt: string; descriptionEt: string }> = [
  { id: 'explorer', nameEt: 'Avastaja', descriptionEt: 'Tuntumad riigid, rohkem vihjeid.' },
  { id: 'traveler', nameEt: 'Rändur', descriptionEt: 'Kõik piirkonna riigid ja pealinnad.' },
  { id: 'geographer', nameEt: 'Geograaf', descriptionEt: 'Kõik riigid, pealinnad ja väikesaared.' }
];

// The Maailm view's learning sets.
export type WorldSetId = 'continents' | 'worldParts' | 'oceans' | 'largest';
export const WORLD_SETS: Array<{ id: WorldSetId; nameEt: string }> = [
  { id: 'continents', nameEt: 'Mandrid' },
  { id: 'worldParts', nameEt: 'Maailmajaod' },
  { id: 'oceans', nameEt: 'Ookeanid' },
  { id: 'largest', nameEt: 'Suurimad riigid' }
];

// One map view per selectable set: 'world', 'antarctica', '<part>' (all of a
// world part) and '<part>-<subregion>'. A view is a fixed, pre-projected map:
// it never pans or zooms by itself, and a round never changes it.
export type MapViewKind = 'world' | 'antarctica' | 'part' | 'subregion';
export type MapViewDef = { id: string; kind: MapViewKind; worldPart: WorldPartId | null; subregion: string | null };

export function viewId(worldPart: WorldPartId | 'world', subregion: string | null): string {
  if (worldPart === 'world' || worldPart === 'antarctica') return worldPart;
  return subregion ? `${worldPart}-${subregion}` : worldPart;
}

export const MAP_VIEWS: MapViewDef[] = [
  { id: 'world', kind: 'world', worldPart: null, subregion: null },
  { id: 'antarctica', kind: 'antarctica', worldPart: 'antarctica', subregion: null },
  ...WORLD_PARTS.filter((part) => part.id !== 'antarctica').flatMap((part): MapViewDef[] => [
    { id: viewId(part.id, null), kind: 'part', worldPart: part.id, subregion: null },
    ...part.subregions.map((sub): MapViewDef => ({ id: viewId(part.id, sub.id), kind: 'subregion', worldPart: part.id, subregion: sub.id }))
  ])
];

export function findView(id: string): MapViewDef | undefined {
  return MAP_VIEWS.find((view) => view.id === id);
}

export function worldPartOf(id: WorldPartId): WorldPart {
  const part = WORLD_PARTS.find((item) => item.id === id);
  if (!part) throw new Error(`Unknown world part ${id}`);
  return part;
}

export const CAPITAL_ROLE_LABELS: Record<CapitalRole, string> = {
  official: 'pealinn',
  administrative: 'halduspealinn',
  legislative: 'seadusandlik pealinn',
  judicial: 'kohtuvõimu pealinn',
  seat_of_government: 'valitsuse asukoht',
  de_facto: 'valitsuse asukoht',
  claimed: 'kuulutatud pealinn',
  other: 'valitsusasutuste asukoht'
};

export function mapUrl(id: string): string {
  return `/kaardimang/maps/${DATA_VERSION}/${id}.json`;
}
