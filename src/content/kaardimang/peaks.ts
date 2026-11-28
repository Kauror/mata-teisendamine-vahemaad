// Famous mountain tops drawn on the Kaardimäng maps (a small ▲ and, where
// there is room, the name and height). Decoration only: never a question,
// never tappable, so a name here can never give an answer away.
//
// Heights in metres from the national surveys or the latest accepted
// measurement (Everest 2020, Mont Blanc 2021). `world`: also shown on the
// whole-world map (the highest top of each continent, the "seven summits").

export type Peak = { id: string; nameEt: string; heightM: number; lat: number; lon: number; world?: boolean };

export const PEAKS: Peak[] = [
  { id: 'everest', nameEt: 'Everest', heightM: 8849, lat: 27.9881, lon: 86.925, world: true },
  { id: 'k2', nameEt: 'K2', heightM: 8611, lat: 35.8825, lon: 76.5133 },
  { id: 'somoni', nameEt: 'Ismoil Somoni', heightM: 7495, lat: 38.9417, lon: 72.0153 },
  { id: 'aconcagua', nameEt: 'Aconcagua', heightM: 6961, lat: -32.6532, lon: -70.0109, world: true },
  { id: 'denali', nameEt: 'Denali', heightM: 6190, lat: 63.0692, lon: -151.007, world: true },
  { id: 'kilimanjaro', nameEt: 'Kilimanjaro', heightM: 5895, lat: -3.0674, lon: 37.3556, world: true },
  { id: 'elbrus', nameEt: 'Elbrus', heightM: 5642, lat: 43.3499, lon: 42.4453, world: true },
  { id: 'orizaba', nameEt: 'Orizaba', heightM: 5636, lat: 19.0302, lon: -97.2686 },
  { id: 'ararat', nameEt: 'Ararat', heightM: 5137, lat: 39.7019, lon: 44.2983 },
  { id: 'vinson', nameEt: 'Vinson', heightM: 4892, lat: -78.5254, lon: -85.6171, world: true },
  { id: 'puncak-jaya', nameEt: 'Puncak Jaya', heightM: 4884, lat: -4.0833, lon: 137.1833, world: true },
  { id: 'mont-blanc', nameEt: 'Mont Blanc', heightM: 4806, lat: 45.8326, lon: 6.8652 },
  { id: 'mauna-kea', nameEt: 'Mauna Kea', heightM: 4207, lat: 19.8207, lon: -155.4681 },
  { id: 'toubkal', nameEt: 'Toubkal', heightM: 4167, lat: 31.0597, lon: -7.915 },
  { id: 'kinabalu', nameEt: 'Kinabalu', heightM: 4095, lat: 6.0753, lon: 116.5583 },
  { id: 'fuji', nameEt: 'Fuji', heightM: 3776, lat: 35.3606, lon: 138.7274 },
  { id: 'aoraki', nameEt: 'Aoraki', heightM: 3724, lat: -43.595, lon: 170.1418 },
  { id: 'olympos', nameEt: 'Olümpos', heightM: 2918, lat: 40.0857, lon: 22.3583 },
  { id: 'galdhopiggen', nameEt: 'Galdhøpiggen', heightM: 2469, lat: 61.6364, lon: 8.3125 },
  { id: 'kosciuszko', nameEt: 'Kosciuszko', heightM: 2228, lat: -36.4559, lon: 148.2636, world: true },
  { id: 'suur-munamagi', nameEt: 'Suur Munamägi', heightM: 318, lat: 57.7144, lon: 27.0592 }
];

export const PEAK_BY_ID = new Map(PEAKS.map((peak) => [peak.id, peak]));

// Built per view by build-terrain.ts: [peak id, x, y] in that view's map units.
export type PeaksOverlay = { version: string; source: string; peaks: Record<string, Array<[string, number, number]>> };
