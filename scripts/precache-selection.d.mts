// Types for the precache selection, so the unit test can import it.
export function appBuildManifestKey(route: string): string;
export function isPagesRouterOnly(file: string): boolean;
export function selectShellFiles(input: {
  appBuildManifest: Record<string, string[]>;
  loadableManifest: Record<string, { files?: string[] }>;
  shellRoutes: string[];
}): string[];
export function parseFontFaces(css: string): { url: string; ranges: [number, number][] | null }[];
export const APP_TEXT_CODE_POINTS: number[];
export function selectFontFiles(cssTexts: string[], codePoints?: number[]): string[];
