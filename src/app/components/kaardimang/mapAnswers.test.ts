import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { CATALOG } from '@/content/kaardimang/catalog';
import { DATA_VERSION, MAP_VIEWS } from '@/content/kaardimang/regions';
import type { MapViewData } from '@/content/kaardimang/types';
import { emptyState, NO_AREA_ANSWER, SEA_ANSWER, type ClientQuestion } from '@/lib/kaardimang/engine';
import { answerIdFor, markerHitRadii, playAreaPaint, playPaint, scoreLine } from './mapAnswers';

function question(targetType: ClientQuestion['targetType'], extra: Partial<ClientQuestion> = {}): ClientQuestion {
  return {
    id: 'q1', kind: 'find_country', answering: 'map', targetType, targetId: 'EST', targetKey: 'country:EST', prompt: '', options: null,
    highlightId: null, hideCapitalId: null, state: emptyState(), correctId: null, explainEt: null, hintEt: null, ...extra
  };
}

describe('answerIdFor', () => {
  it('answers a continent or world-part question with the land it belongs to', () => {
    expect(answerIdFor(question('continent'), { kind: 'land', id: 'RUS', wp: 'europe', ct: 'eurasia' })).toBe('eurasia');
    expect(answerIdFor(question('worldPart'), { kind: 'land', id: 'RUS', wp: 'asia', ct: 'eurasia' })).toBe('asia');
    expect(answerIdFor(question('continent'), { kind: 'land', id: 'NZL', wp: 'oceania', ct: null })).toBe(NO_AREA_ANSWER);
  });

  it('counts the South Pole dot as Antarctica in a continent question (it sits on the continent)', () => {
    expect(answerIdFor(question('continent'), { kind: 'marker', id: 'south-pole' })).toBe('antarctica');
    expect(answerIdFor(question('point', { kind: 'find_point', targetId: 'south-pole' }), { kind: 'marker', id: 'south-pole' })).toBe('south-pole');
  });

  it('turns open sea into the neutral answer and keeps ocean areas as oceans', () => {
    expect(answerIdFor(question('country'), { kind: 'sea' })).toBe(SEA_ANSWER);
    expect(answerIdFor(question('country'), { kind: 'area', id: 'pacific' })).toBe(SEA_ANSWER);
    expect(answerIdFor(question('ocean'), { kind: 'area', id: 'pacific' })).toBe('pacific');
    expect(answerIdFor(question('country'), { kind: 'marker', id: 'VAT' })).toBe('VAT');
  });
});

describe('markerHitRadii', () => {
  const views = MAP_VIEWS.map((view) => JSON.parse(readFileSync(path.join(process.cwd(), 'public', 'kaardimang', 'maps', DATA_VERSION, `${view.id}.json`), 'utf8')) as MapViewData);

  // 360 px phone (≈338 px of map), a tablet and a wide desktop map.
  it.each([1000 / 338, 1000 / 740, 1])('never lets two hit circles overlap, so a tap means one country (%f units/px)', (units) => {
    for (const view of views) {
      const radii = markerHitRadii(view.markers, units);
      for (const a of view.markers) {
        const halfGap = Math.min(Infinity, ...view.markers.filter((other) => other !== a).map((other) => Math.hypot(a.x - other.x, a.y - other.y) / 2));
        expect(radii.get(a.id)!, `${view.id}/${a.id}`).toBeGreaterThanOrEqual(Math.min(a.hr, halfGap));
        for (const b of view.markers) {
          if (a.id >= b.id) continue;
          const gap = Math.hypot(a.x - b.x, a.y - b.y);
          expect(radii.get(a.id)! + radii.get(b.id)!, `${view.id}: ${a.id}/${b.id}`).toBeLessThanOrEqual(gap + 0.01);
        }
      }
    }
  });

  it('keeps the 10 px minimum for a marker with room around it', () => {
    const radii = markerHitRadii([{ id: 'MLT', x: 100, y: 100, hr: 12 }, { id: 'TUN', x: 400, y: 100, hr: 34 }], 3);
    expect(radii.get('MLT')).toBe(30);
    expect(radii.get('TUN')).toBe(34);
  });
});

describe('playPaint', () => {
  it('paints the answer, the misses and the highlight, never revealing an unresolved answer', () => {
    const open = question('country', { highlightId: 'LVA', state: { ...emptyState(), attempts: 1, wrongIds: ['LTU'] } });
    expect(playPaint(open, { id: 'LVA' })).toBe('highlight');
    expect(playPaint(open, { id: 'LTU' })).toBe('wrong');
    expect(playPaint(open, { id: 'EST' })).toBeNull();
    expect(playPaint({ ...open, correctId: 'EST' }, { id: 'EST' })).toBe('correct');
    expect(playAreaPaint(question('ocean', { correctId: 'pacific' }), 'pacific')).toBe('correct');
  });

  it('dims land that is on no continent during a continent question', () => {
    expect(playPaint(question('continent'), { id: 'NZL', ct: null })).toBe('dim');
  });
});

describe('scoreLine', () => {
  it('agrees in Estonian', () => {
    expect(scoreLine(6, 8)).toBe('8 küsimusest 6 õiget');
    expect(scoreLine(1, 8)).toBe('8 küsimusest 1 õige');
  });
});
