import { describe, expect, it } from 'vitest';
import { parseFontFaces, selectFontFiles, selectShellFiles } from '../../../scripts/precache-selection.mjs';

// Shapes copied from a real `next build` (.next/app-build-manifest.json and
// .next/react-loadable-manifest.json), trimmed.
const SHARED = [
  'static/chunks/webpack-1.js',
  'static/chunks/0937d497-1.js',
  'static/chunks/89-1.js',
  'static/chunks/main-app-1.js'
];
const appBuildManifest: Record<string, string[]> = {
  '/layout': [...SHARED, 'static/css/a.css', 'static/chunks/3506-1.js', 'static/chunks/app/layout-1.js'],
  '/_not-found/page': [...SHARED, 'static/chunks/app/_not-found/page-1.js'],
  '/page': [...SHARED, 'static/chunks/2138-1.js', 'static/chunks/app/page-1.js'],
  '/kiur/page': [...SHARED, 'static/chunks/app/kiur/page-1.js'],
  '/opi/kellaaeg/page': [...SHARED, 'static/chunks/1463-1.js', 'static/chunks/app/opi/kellaaeg/page-1.js'],
  '/vanem/page': [...SHARED, 'static/chunks/9336-1.js', 'static/chunks/app/vanem/page-1.js'],
  '/api/stats/route': [...SHARED, 'static/chunks/app/api/stats/route-1.js']
};
const loadableManifest = {
  '..\\..\\..\\..\\node_modules\\next\\dist\\client\\index.js -> ../pages/_app': { id: 5553, files: ['static/chunks/5553.1.js'] },
  '..\\..\\..\\..\\node_modules\\next\\dist\\client\\index.js -> ../pages/_error': { id: 1228, files: ['static/chunks/1228.1.js'] },
  'app\\components\\study\\StudyRunner.tsx -> @/app/components/study/ClockStudyMaterial': { id: 7137, files: ['static/chunks/7137.1.js'] },
  'lib\\offline\\api.ts -> @/lib/offline/runnerSession': { id: 5214, files: [] }
};

describe('precache shell selection (WEB-01)', () => {
  const selected = selectShellFiles({ appBuildManifest, loadableManifest, shellRoutes: ['/', '/kiur', '/opi/kellaaeg'] });

  it('takes the layout, every shell route and the not-found page', () => {
    expect(selected).toEqual(expect.arrayContaining([
      ...SHARED,
      'static/css/a.css',
      'static/chunks/app/layout-1.js',
      'static/chunks/app/page-1.js',
      'static/chunks/2138-1.js',
      'static/chunks/app/kiur/page-1.js',
      'static/chunks/1463-1.js',
      'static/chunks/app/opi/kellaaeg/page-1.js',
      'static/chunks/app/_not-found/page-1.js'
    ]));
  });

  it('keeps our own lazily imported chunks', () => {
    expect(selected).toContain('static/chunks/7137.1.js');
  });

  it('leaves out non-shell routes and the pages router client', () => {
    expect(selected).not.toContain('static/chunks/9336-1.js');
    expect(selected).not.toContain('static/chunks/app/vanem/page-1.js');
    expect(selected).not.toContain('static/chunks/app/api/stats/route-1.js');
    expect(selected).not.toContain('static/chunks/5553.1.js');
    expect(selected).not.toContain('static/chunks/1228.1.js');
  });

  it('never selects pages-router-only runtime files, even when a manifest lists them', () => {
    const files = selectShellFiles({
      appBuildManifest: {
        '/layout': [
          ...SHARED,
          'static/chunks/framework-1.js',
          'static/chunks/main-1.js',
          'static/chunks/polyfills-1.js',
          'static/chunks/pages/_app-1.js'
        ]
      },
      loadableManifest: {},
      shellRoutes: []
    });
    expect(files).toEqual([...SHARED].sort());
  });

  it('refuses a shell route the build does not have', () => {
    expect(() => selectShellFiles({ appBuildManifest, loadableManifest, shellRoutes: ['/missing'] })).toThrow('/missing/page');
  });
});

// The @font-face blocks next/font emits for Nunito (one weight shown).
const NUNITO_CSS = [
  '@font-face{font-family:Nunito;font-weight:600;src:url(/_next/static/media/cyrext.woff2) format("woff2");unicode-range:u+0460-052f,u+1c80-1c8a,u+20b4,u+2de0-2dff,u+a640-a69f,u+fe2e-fe2f}',
  '@font-face{font-family:Nunito;font-weight:600;src:url(/_next/static/media/cyr.woff2) format("woff2");unicode-range:u+0301,u+0400-045f,u+0490-0491,u+04b0-04b1,u+2116}',
  '@font-face{font-family:Nunito;font-weight:600;src:url(/_next/static/media/viet.woff2) format("woff2");unicode-range:u+0102-0103,u+0110-0111,u+0128-0129,u+0168-0169,u+01a0-01a1,u+01af-01b0,u+0300-0301,u+0303-0304,u+0308-0309,u+0323,u+0329,u+1ea0-1ef9,u+20ab}',
  '@font-face{font-family:Nunito;font-weight:600;src:url(/_next/static/media/latinext.p.woff2) format("woff2");unicode-range:u+0100-02ba,u+02bd-02c5,u+02c7-02cc,u+02ce-02d7,u+02dd-02ff,u+0304,u+0308,u+0329,u+1d00-1dbf,u+1e00-1e9f,u+1ef2-1eff,u+2020,u+20a0-20ab,u+20ad-20c4,u+2113,u+2c60-2c7f,u+a720-a7ff}',
  '@font-face{font-family:Nunito;font-weight:600;src:url(/_next/static/media/latin.p.woff2) format("woff2");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}'
].join('');

describe('precache font selection (WEB-10)', () => {
  it('parses unicode-range wildcards and spans', () => {
    const latin = parseFontFaces(NUNITO_CSS).find((face) => face.url.endsWith('latin.p.woff2'));
    expect(latin?.ranges?.[0]).toEqual([0x00, 0xff]);
    expect(latin?.ranges).toContainEqual([0x2000, 0x206f]);
  });

  it('keeps only the latin and latin-ext files the Estonian and English text uses', () => {
    expect(selectFontFiles([NUNITO_CSS, NUNITO_CSS.replace(/600/g, '700')])).toEqual([
      '/_next/static/media/latin.p.woff2',
      '/_next/static/media/latinext.p.woff2'
    ]);
  });

  it('keeps a face without unicode-range, which covers every character', () => {
    expect(selectFontFiles(['@font-face{font-family:X;src:url("/_next/static/media/all.woff2")}'])).toEqual(['/_next/static/media/all.woff2']);
  });
});
