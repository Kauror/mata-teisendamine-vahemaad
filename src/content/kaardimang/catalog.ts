// The built Kaardimäng catalog (scripts/kaardimang/build-map-data.ts) with
// the lookups the engine, the server and the UI share.

import rawCatalog from './catalog.json';
import { CONTINENTS, COUNTIES, OCEANS, SEAS, WORLD_PARTS, type MapViewDef } from './regions';
import type { CatalogCapital, CatalogCountry, KaardimangCatalog } from './types';

export const CATALOG = rawCatalog as KaardimangCatalog;

const byId = new Map(CATALOG.countries.map((country) => [country.id, country]));

export function findCountry(id: string): CatalogCountry | undefined {
  return byId.get(id);
}

// The scored countries of a view's set (special entities are never targets).
export function viewCountries(view: MapViewDef): CatalogCountry[] {
  if (view.kind !== 'part' && view.kind !== 'subregion') return [];
  return CATALOG.countries.filter((country) => country.target
    && country.worldPart === view.worldPart
    && (view.kind === 'part' || country.subregions.includes(view.subregion!)));
}

export function quizCapital(country: CatalogCountry): CatalogCapital | null {
  const eligible = country.capitals.filter((capital) => capital.quizEligible);
  return eligible.length === 1 ? eligible[0] : null;
}

// "Riik – pealinn" for feedback and Uuri, or just the country when it has no
// single capital (Vatikan, Boliivia, …): those are explained in Uuri instead.
export function countryWithCapital(country: CatalogCountry): string {
  const capital = quizCapital(country);
  return capital ? `${country.nameEt} – ${capital.nameEt}` : country.nameEt;
}

// The Estonian name of anything a map tap can hit.
export function nameOf(id: string): string {
  return byId.get(id)?.nameEt
    ?? COUNTIES.find((county) => county.id === id)?.nameEt
    ?? COUNTIES.find((county) => county.centreId === id)?.centreEt
    ?? CATALOG.contextNames[id]
    ?? CONTINENTS.find((item) => item.id === id)?.nameEt
    ?? OCEANS.find((item) => item.id === id)?.nameEt
    ?? SEAS.find((item) => item.id === id)?.nameEt
    ?? WORLD_PARTS.find((item) => item.id === id)?.nameEt
    ?? (id === 'south-pole' ? 'lõunapoolus' : id);
}
