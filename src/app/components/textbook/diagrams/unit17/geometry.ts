import baltic from '@/app/components/textbook/diagrams/data/u17-baltic-country-paths.json';
import world from '@/app/components/textbook/diagrams/data/world_continent_paths.json';

// Unit 17 map geometry, bundled at build time (nothing is fetched at run
// time). Both files are simplified Natural Earth 1:110m public-domain
// outlines: general location only, not legal borders. The continent file is
// the app's shared copy (Units 15–19); the Baltic country file is Unit 17's.

export const CONTINENT_PATHS: Record<string, string> = world.paths;
export const OCEANIA_ISLANDS: string = world.supplementaryPaths['oceania-islands'];

// Country outlines keyed by the file's English names.
export const COUNTRY_PATHS: Record<string, string> = baltic.countries;
// Region ID → country name in the file.
export const REGION_COUNTRY: Record<string, string> = baltic.hotspotIds;
// Drawn for context only (grey, never tappable).
export const CONTEXT_COUNTRIES = ['Norway', 'Denmark', 'Poland', 'Belarus'] as const;
