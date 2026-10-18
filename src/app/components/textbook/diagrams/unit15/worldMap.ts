import worldPaths from '@/app/components/textbook/diagrams/data/world_continent_paths.json';

// The shared Natural Earth land outlines (public domain, generalised; no
// country borders), 720 × 360 equirectangular: north up, the equator at
// y = 180. Imported at build time, never fetched. The Unit 15 maps draw
// them at half size (U15_WORLD_MAP in ./layouts.ts).
export type ContinentId = 'north-america' | 'south-america' | 'eurasia' | 'africa' | 'australia' | 'antarctica';

export const CONTINENT_PATHS: Record<ContinentId, string> = worldPaths.paths;
// Pacific island outlines (New Zealand and others): drawn only in the world-part
// map as part of "Austraalia ja Okeaania", never as a continent of their own.
export const OCEANIA_ISLANDS_PATH: string = worldPaths.supplementaryPaths['oceania-islands'];
// Drawing order: Eurasia last, so its coast lies on top of the neighbouring tap areas.
export const CONTINENT_ORDER: readonly ContinentId[] = ['antarctica', 'south-america', 'north-america', 'africa', 'australia', 'eurasia'];
