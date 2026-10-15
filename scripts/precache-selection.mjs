// Chooses which /_next/static files the service worker precaches. Pure
// functions over the build manifests, so the selection is unit-testable
// (src/lib/offline/precacheSelection.test.ts); build-sw.mjs does the file I/O.
//
// The precache is all-or-nothing (docs/rtm-offline-gate.md), so every file in
// it is a file every phone must download before it is offline-ready. It holds
// exactly what the App Router shell can load:
//   - the chunks and CSS that .next/app-build-manifest.json lists for /layout,
//     Next's not-found page and every shell route;
//   - the lazily imported chunks (next/dynamic or import()) from our own code,
//     listed in .next/react-loadable-manifest.json;
//   - the font files whose unicode-range covers the app's own text.
// Pages-router files never load in the App Router shell, and polyfills-* is a
// <script noModule> that module-capable browsers (every supported iPhone) skip.

const PAGES_ROUTER_ONLY = /^static\/chunks\/(?:framework-|main-(?!app-)|polyfills-|pages\/)/;
// react-loadable-manifest keys are "<importing module> -> <request>"; Next's
// own pages-router client lazily imports pages/_app and pages/_error.
const NEXT_PAGES_CLIENT = /node_modules[\\/]next[\\/]dist[\\/]client[\\/]/;
const NOT_FOUND_ENTRY = '/_not-found/page';

export function appBuildManifestKey(route) {
  return route === '/' ? '/page' : `${route}/page`;
}

export function isPagesRouterOnly(file) {
  return PAGES_ROUTER_ONLY.test(file);
}

/**
 * @param {{ appBuildManifest: Record<string, string[]>, loadableManifest: Record<string, { files?: string[] }>, shellRoutes: string[] }} input
 *   appBuildManifest is the `pages` object of .next/app-build-manifest.json.
 * @returns {string[]} build-relative files ("static/chunks/…"), sorted.
 */
export function selectShellFiles({ appBuildManifest, loadableManifest, shellRoutes }) {
  const keys = ['/layout', ...shellRoutes.map(appBuildManifestKey)];
  const missing = keys.filter((key) => !appBuildManifest[key]);
  if (missing.length) throw new Error(`app-build-manifest has no entry for: ${missing.join(', ')}`);
  if (appBuildManifest[NOT_FOUND_ENTRY]) keys.push(NOT_FOUND_ENTRY);

  const files = new Set(keys.flatMap((key) => appBuildManifest[key]));
  for (const [key, entry] of Object.entries(loadableManifest)) {
    const importer = key.split(' -> ')[0];
    if (NEXT_PAGES_CLIENT.test(importer)) continue;
    for (const file of entry.files ?? []) files.add(file);
  }
  return [...files].filter((file) => !isPagesRouterOnly(file)).sort();
}

function parseUnicodeRange(value) {
  return value.split(',').map((part) => {
    const token = part.trim().toLowerCase().replace(/^u\+/, '');
    if (token.includes('?')) return [parseInt(token.replace(/\?/g, '0'), 16), parseInt(token.replace(/\?/g, 'f'), 16)];
    const [lo, hi = lo] = token.split('-');
    return [parseInt(lo, 16), parseInt(hi, 16)];
  });
}

/** @returns {{ url: string, ranges: [number, number][] | null }[]} one per src url; null ranges = all code points. */
export function parseFontFaces(css) {
  const faces = [];
  for (const [, body] of css.matchAll(/@font-face\s*\{([^}]*)\}/g)) {
    const range = /unicode-range\s*:\s*([^;]+)/i.exec(body);
    const ranges = range ? parseUnicodeRange(range[1]) : null;
    for (const [, url] of body.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) faces.push({ url, ranges });
  }
  return faces;
}

// The letters the app's text is written in: English and Estonian. Google's
// latin and latin-ext subsets cover these; cyrillic and vietnamese do not.
export const APP_TEXT_CODE_POINTS = [
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  ...'ÕÄÖÜõäöüŠšŽž'
].map((ch) => ch.codePointAt(0));

/**
 * Font files a page can actually request: a browser downloads a face only when
 * the text uses a code point in its unicode-range.
 * @param {string[]} cssTexts
 * @returns {string[]} URLs as written in the CSS, sorted, unique.
 */
export function selectFontFiles(cssTexts, codePoints = APP_TEXT_CODE_POINTS) {
  const urls = new Set();
  for (const css of cssTexts) {
    for (const face of parseFontFaces(css)) {
      if (!/\.(?:woff2?|ttf|otf)$/.test(face.url)) continue;
      if (!face.ranges || codePoints.some((cp) => face.ranges.some(([lo, hi]) => cp >= lo && cp <= hi))) urls.add(face.url);
    }
  }
  return [...urls].sort();
}
