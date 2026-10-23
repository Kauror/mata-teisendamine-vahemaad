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
// The Eesti map is built separately (scripts/kaardimang/build-estonia.ts), so
// adding it did not rebuild, and cannot invalidate, the world maps above.
export const ESTONIA_DATA_VERSION = '2026-10-23.1';

// Eesti: the 15 maakonnad and their keskused (Kaur, 19.10: the easiest first
// stage, for Kirsi). Prompts use the everyday -maa name ("Leia kaardilt
// Harjumaa."); Uuri also shows the official "Harju maakond". The -maa name is
// the same in the genitive ("Mis on Harjumaa keskus?").
export type CountyId =
  | 'ee-harju' | 'ee-hiiu' | 'ee-ida-viru' | 'ee-jogeva' | 'ee-jarva' | 'ee-laane' | 'ee-laane-viru' | 'ee-polva'
  | 'ee-parnu' | 'ee-rapla' | 'ee-saare' | 'ee-tartu' | 'ee-valga' | 'ee-viljandi' | 'ee-voru';
export type County = { id: CountyId; iso: string; nameEt: string; officialEt: string; centreId: string; centreEt: string; wellKnown: boolean };
export const COUNTIES: County[] = [
  { id: 'ee-harju', iso: 'EE-37', nameEt: 'Harjumaa', officialEt: 'Harju maakond', centreId: 'ee-harju-c', centreEt: 'Tallinn', wellKnown: true },
  { id: 'ee-hiiu', iso: 'EE-39', nameEt: 'Hiiumaa', officialEt: 'Hiiu maakond', centreId: 'ee-hiiu-c', centreEt: 'Kärdla', wellKnown: true },
  { id: 'ee-ida-viru', iso: 'EE-44', nameEt: 'Ida-Virumaa', officialEt: 'Ida-Viru maakond', centreId: 'ee-ida-viru-c', centreEt: 'Jõhvi', wellKnown: true },
  { id: 'ee-jogeva', iso: 'EE-49', nameEt: 'Jõgevamaa', officialEt: 'Jõgeva maakond', centreId: 'ee-jogeva-c', centreEt: 'Jõgeva', wellKnown: false },
  { id: 'ee-jarva', iso: 'EE-51', nameEt: 'Järvamaa', officialEt: 'Järva maakond', centreId: 'ee-jarva-c', centreEt: 'Paide', wellKnown: false },
  { id: 'ee-laane', iso: 'EE-57', nameEt: 'Läänemaa', officialEt: 'Lääne maakond', centreId: 'ee-laane-c', centreEt: 'Haapsalu', wellKnown: false },
  { id: 'ee-laane-viru', iso: 'EE-59', nameEt: 'Lääne-Virumaa', officialEt: 'Lääne-Viru maakond', centreId: 'ee-laane-viru-c', centreEt: 'Rakvere', wellKnown: false },
  { id: 'ee-polva', iso: 'EE-65', nameEt: 'Põlvamaa', officialEt: 'Põlva maakond', centreId: 'ee-polva-c', centreEt: 'Põlva', wellKnown: false },
  { id: 'ee-parnu', iso: 'EE-67', nameEt: 'Pärnumaa', officialEt: 'Pärnu maakond', centreId: 'ee-parnu-c', centreEt: 'Pärnu', wellKnown: true },
  { id: 'ee-rapla', iso: 'EE-70', nameEt: 'Raplamaa', officialEt: 'Rapla maakond', centreId: 'ee-rapla-c', centreEt: 'Rapla', wellKnown: false },
  { id: 'ee-saare', iso: 'EE-74', nameEt: 'Saaremaa', officialEt: 'Saare maakond', centreId: 'ee-saare-c', centreEt: 'Kuressaare', wellKnown: true },
  { id: 'ee-tartu', iso: 'EE-78', nameEt: 'Tartumaa', officialEt: 'Tartu maakond', centreId: 'ee-tartu-c', centreEt: 'Tartu', wellKnown: true },
  { id: 'ee-valga', iso: 'EE-82', nameEt: 'Valgamaa', officialEt: 'Valga maakond', centreId: 'ee-valga-c', centreEt: 'Valga', wellKnown: false },
  { id: 'ee-viljandi', iso: 'EE-84', nameEt: 'Viljandimaa', officialEt: 'Viljandi maakond', centreId: 'ee-viljandi-c', centreEt: 'Viljandi', wellKnown: false },
  { id: 'ee-voru', iso: 'EE-86', nameEt: 'Võrumaa', officialEt: 'Võru maakond', centreId: 'ee-voru-c', centreEt: 'Võru', wellKnown: false }
];
export const ESTONIA = { id: 'estonia' as const, nameEt: 'Eesti', icon: '🦔' };

export function findCounty(id: string): County | undefined {
  return COUNTIES.find((county) => county.id === id);
}

// genEt: "Leia Antarktise manner."
export const CONTINENTS: Array<{ id: ContinentId; nameEt: string; genEt: string }> = [
  { id: 'eurasia', nameEt: 'Euraasia', genEt: 'Euraasia' },
  { id: 'africa', nameEt: 'Aafrika', genEt: 'Aafrika' },
  { id: 'north-america', nameEt: 'Põhja-Ameerika', genEt: 'Põhja-Ameerika' },
  { id: 'south-america', nameEt: 'Lõuna-Ameerika', genEt: 'Lõuna-Ameerika' },
  { id: 'australia', nameEt: 'Austraalia', genEt: 'Austraalia' },
  { id: 'antarctica', nameEt: 'Antarktis', genEt: 'Antarktise' }
];

// Mered (backlog KM-01): the seas and gulfs of Kiur's textbook (Unit 16:
// Läänemeri, Põhjameri, Vahemeri, Soome, Bengali, Guinea and Pärsia laht) and
// nine well-known ones (Kaur, 23.10). `ne` names the Natural Earth marine
// polygons drawn as this sea (Vahemeri is the main basin and its eleven named
// parts); `partOf` makes a tap on a gulf count for its sea.
export type SeaId =
  | 'baltic' | 'north' | 'mediterranean' | 'black' | 'red' | 'caribbean' | 'arabian' | 'south-china'
  | 'finland' | 'riga' | 'bothnia' | 'mexico' | 'bengal' | 'guinea' | 'persian' | 'hudson';
export type Sea = { id: SeaId; nameEt: string; ne: string | string[]; partOf?: SeaId; textbook: boolean };
export const SEAS: Sea[] = [
  { id: 'baltic', nameEt: 'Läänemeri', ne: 'Baltic Sea', textbook: true },
  { id: 'north', nameEt: 'Põhjameri', ne: 'North Sea', textbook: true },
  {
    id: 'mediterranean', nameEt: 'Vahemeri', textbook: true,
    ne: ['Mediterranean Sea', 'Adriatic Sea', 'Ionian Sea', 'Aegean Sea', 'Tyrrhenian Sea', 'Ligurian Sea', 'Balearic Sea', 'Alboran Sea', 'Sea of Crete', 'Golfe du Lion', 'Gulf of Gabès', 'Gulf of Sidra']
  },
  { id: 'finland', nameEt: 'Soome laht', ne: 'Gulf of Finland', partOf: 'baltic', textbook: true },
  { id: 'bengal', nameEt: 'Bengali laht', ne: 'Bay of Bengal', textbook: true },
  { id: 'guinea', nameEt: 'Guinea laht', ne: 'Gulf of Guinea', textbook: true },
  { id: 'persian', nameEt: 'Pärsia laht', ne: 'Persian Gulf', textbook: true },
  { id: 'black', nameEt: 'Must meri', ne: ['Black Sea', 'Sea of Azov'], textbook: false },
  { id: 'red', nameEt: 'Punane meri', ne: 'Red Sea', textbook: false },
  { id: 'caribbean', nameEt: 'Kariibi meri', ne: 'Caribbean Sea', textbook: false },
  { id: 'arabian', nameEt: 'Araabia meri', ne: 'Arabian Sea', textbook: false },
  { id: 'south-china', nameEt: 'Lõuna-Hiina meri', ne: 'South China Sea', textbook: false },
  { id: 'riga', nameEt: 'Liivi laht', ne: 'Gulf of Riga', partOf: 'baltic', textbook: false },
  { id: 'bothnia', nameEt: 'Botnia laht', ne: 'Gulf of Bothnia', partOf: 'baltic', textbook: false },
  { id: 'mexico', nameEt: 'Mehhiko laht', ne: 'Gulf of Mexico', textbook: false },
  { id: 'hudson', nameEt: 'Hudsoni laht', ne: 'Hudson Bay', textbook: false }
];
// The sea outlines are built separately (scripts/kaardimang/build-seas.ts) and
// laid over the world map, which itself is unchanged.
export const SEAS_DATA_VERSION = '2026-10-23.1';

export function findSea(id: string): Sea | undefined {
  return SEAS.find((sea) => sea.id === id);
}

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
export type WorldSetId = 'continents' | 'worldParts' | 'oceans' | 'seas' | 'largest';
export const WORLD_SETS: Array<{ id: WorldSetId; nameEt: string }> = [
  { id: 'continents', nameEt: 'Mandrid' },
  { id: 'worldParts', nameEt: 'Maailmajaod' },
  { id: 'oceans', nameEt: 'Ookeanid' },
  { id: 'seas', nameEt: 'Mered' },
  { id: 'largest', nameEt: 'Suurimad riigid' }
];

// One map view per selectable set: 'world', 'antarctica', '<part>' (all of a
// world part) and '<part>-<subregion>'. A view is a fixed, pre-projected map:
// it never pans or zooms by itself, and a round never changes it.
export type MapViewKind = 'world' | 'antarctica' | 'part' | 'subregion' | 'estonia';
export type MapViewDef = { id: string; kind: MapViewKind; worldPart: WorldPartId | null; subregion: string | null };

export function viewId(worldPart: WorldPartId | 'world', subregion: string | null): string {
  if (worldPart === 'world' || worldPart === 'antarctica') return worldPart;
  return subregion ? `${worldPart}-${subregion}` : worldPart;
}

export const MAP_VIEWS: MapViewDef[] = [
  { id: 'world', kind: 'world', worldPart: null, subregion: null },
  { id: 'estonia', kind: 'estonia', worldPart: null, subregion: null },
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

// The public path of a view's map file. The world build empties maps/, so
// the separately built Eesti map lives beside it, in eesti/.
export function mapPath(id: string): string {
  return id === 'estonia' ? `kaardimang/eesti/${ESTONIA_DATA_VERSION}/estonia.json` : `kaardimang/maps/${DATA_VERSION}/${id}.json`;
}

export function mapUrl(id: string): string {
  return `/${mapPath(id)}`;
}

// The sea outlines laid over the world map.
export function seasPath(): string {
  return `kaardimang/seas/${SEAS_DATA_VERSION}/world-seas.json`;
}

export function dataVersionOf(viewId: string): string {
  return viewId === 'estonia' ? ESTONIA_DATA_VERSION : DATA_VERSION;
}
