import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { MAP_VIEWS, TERRAIN_PAD, TERRAIN_VERSION, mapPath, peaksUrl, terrainUrl } from '@/content/kaardimang/regions';
import { PEAKS, PEAK_BY_ID, type PeaksOverlay } from '@/content/kaardimang/peaks';
import type { MapViewData } from '@/content/kaardimang/types';

// The terrain pictures and mountain tops (scripts/kaardimang/build-terrain.ts)
// against the map files they sit under.

const publicFile = (url: string) => path.join(process.cwd(), 'public', ...url.replace(/^\//, '').split('/'));
const loadView = (id: string) => JSON.parse(readFileSync(publicFile(mapPath(id)), 'utf8')) as MapViewData;
const overlay = JSON.parse(readFileSync(publicFile(peaksUrl()), 'utf8')) as PeaksOverlay;
const worldViews = MAP_VIEWS.filter((view) => view.kind !== 'estonia');

describe('Kaardimäng terrain', () => {
  it('has a picture for every world map view, shaped like the view plus its margin', async () => {
    expect(terrainUrl('estonia')).toBeNull();
    for (const view of worldViews) {
      const file = publicFile(terrainUrl(view.id)!);
      expect(existsSync(file), view.id).toBe(true);
      const meta = await sharp(file).metadata();
      const data = loadView(view.id);
      const expected = (data.width + 2 * TERRAIN_PAD) / (data.height + 2 * TERRAIN_PAD);
      expect(Math.abs(meta.width! / meta.height! - expected), view.id).toBeLessThan(0.01);
      expect(meta.width!, view.id).toBeGreaterThanOrEqual(1700);
      // One map at a time is downloaded: keep each one phone-sized.
      expect(readFileSync(file).length, view.id).toBeLessThan(600 * 1024);
    }
  });

  it('places only known peaks, inside their view, and the seven summits on the world map', () => {
    expect(overlay.version).toBe(TERRAIN_VERSION);
    expect(Object.keys(overlay.peaks).sort()).toEqual(worldViews.map((view) => view.id).sort());
    for (const [viewId, peaks] of Object.entries(overlay.peaks)) {
      const data = loadView(viewId);
      for (const [id, x, y] of peaks) {
        expect(PEAK_BY_ID.has(id), `${viewId} ${id}`).toBe(true);
        expect(x > 0 && x < data.width && y > 0 && y < data.height, `${viewId} ${id}`).toBe(true);
      }
    }
    const ids = (viewId: string) => overlay.peaks[viewId].map(([id]) => id);
    expect(ids('world').sort()).toEqual(PEAKS.filter((peak) => peak.world).map((peak) => peak.id).sort());
    expect(ids('asia-south')).toContain('everest');
    expect(ids('europe-baltics')).toContain('suur-munamagi');
    expect(ids('antarctica')).toContain('vinson');
    expect(ids('africa-east')).toContain('kilimanjaro');
  });

  it('puts Everest where the map has Nepal and China meeting, not somewhere off by a projection', () => {
    // Everest sits on the Nepal–China border: its point is inside Nepal's box.
    const data = loadView('asia-south');
    const [, x, y] = overlay.peaks['asia-south'].find(([id]) => id === 'everest')!;
    const nepal = data.labels.NPL;
    expect(nepal).toBeDefined();
    expect(Math.hypot(x - nepal[0], y - nepal[1])).toBeLessThan(nepal[2]);
  });
});
