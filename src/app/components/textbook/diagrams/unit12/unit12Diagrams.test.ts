import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import { UNIT12_DIAGRAMS } from '@/lib/textbook/diagrams/unit12';
import { DIAGRAM_LAYOUTS, labelExtent } from '@/app/components/textbook/diagrams/diagramLayout';
import type { DiagramMode } from '@/app/components/textbook/diagrams/DiagramFrame';
import { UNIT12_DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/unit12';

// Words that would answer a Unit 12 hotspot question if they showed in the picture.
const ANSWER_WORDS = /gloobus|kaart|apelsin|koor|aerofoto|foto|joonistus|jõgi|park|hoone|sild|muuseum|legend/i;

function render(diagramId: string, mode: DiagramMode, extra: Record<string, unknown> = {}) {
  return renderToStaticMarkup(createElement(UNIT12_DIAGRAM_COMPONENTS[diagramId], { mode, onSelectRegion: () => {}, ...extra }));
}

// Visible text of the SVG, without <title> (checked separately).
function visibleText(markup: string) {
  return markup.replace(/<title[^>]*>.*?<\/title>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

describe('Unit 12 diagrams', () => {
  it('registers exactly the four diagrams the content uses, with the region IDs the Unit 12 questions name', () => {
    expect(UNIT12_DIAGRAMS.map((diagram) => diagram.id)).toEqual(['u12-globe-flatmap', 'u12-orange-peel', 'u12-aerial-vs-map', 'u12-legend-town']);
    expect(Object.keys(UNIT12_DIAGRAM_COMPONENTS).sort()).toEqual(UNIT12_DIAGRAMS.map((diagram) => diagram.id).sort());
    const regions = Object.fromEntries(UNIT12_DIAGRAMS.map((diagram) => [diagram.id, diagram.regions.map((region) => region.id)]));
    expect(regions).toEqual({
      'u12-globe-flatmap': ['globe', 'flat-map'],
      'u12-orange-peel': ['orange', 'peel-pieces'],
      'u12-aerial-vs-map': ['aerial-panel', 'map-panel'],
      'u12-legend-town': ['river', 'park', 'building', 'bridge', 'museum', 'legend']
    });
  });

  it('keeps titles and hotspot positions neutral', () => {
    for (const diagram of UNIT12_DIAGRAMS) {
      expect(diagram.title, diagram.id).not.toMatch(/gloobus|legend|jõgi|park|hoone|sild|muuseum/i);
      for (const region of diagram.regions) {
        expect(region.position, `${diagram.id}/${region.id}`).not.toMatch(/jõgi|jõe|park|hoone|sild|muuseum|legend|vee|ületus|kast/i);
      }
    }
  });

  it('labels never overlap one another, as "Jõgi" or as "A – Jõgi"', () => {
    for (const diagram of UNIT12_DIAGRAMS) {
      const layout = DIAGRAM_LAYOUTS[diagram.id];
      for (const form of [(label: string) => label, (label: string, marker: string) => `${marker} – ${label}`]) {
        const boxes = diagram.regions.map((region) => {
          const label = layout.regions[region.id].label;
          const { left, right } = labelExtent(label, form(region.label, region.marker));
          return { id: region.id, left, right, top: label.y - label.fontSize, bottom: label.y + 3 };
        });
        for (const box of boxes) {
          for (const other of boxes.filter((item) => item.id !== box.id)) {
            const overlap = box.left < other.right && other.left < box.right && box.top < other.bottom && other.top < box.bottom;
            expect(overlap, `${diagram.id}: ${box.id} label overlaps ${other.id}`).toBe(false);
          }
        }
      }
    }
  });

  it('hotspot mode: only letter markers, one button per region, no label, note, legend word or answer in the picture', () => {
    for (const diagram of UNIT12_DIAGRAMS) {
      const markup = render(diagram.id, 'hotspot');
      expect(markup).not.toContain('tb-diagram-label');
      expect(markup).not.toContain('tb-diagram-note');
      expect(markup).not.toContain('tb-u12-legend-word');
      expect(markup.match(/role="button"/g)?.length, diagram.id).toBe(diagram.regions.length);
      for (const region of diagram.regions) expect(markup).toContain(`data-region-id="${region.id}"`);
      expect(markup).toMatch(/<desc[^>]*>Joonisel on tähtedega märgitud kohad/);
      const text = visibleText(markup.replace(/<desc[^>]*>.*?<\/desc>/g, ''));
      expect(text, diagram.id).toBe(diagram.regions.map((region) => region.marker).join(' '));
      expect(text).not.toMatch(ANSWER_WORDS);
      const title = markup.match(/<title[^>]*>(.*?)<\/title>/)![1];
      expect(title).toBe(getDiagram(diagram.id)!.title);
    }
    // The legend keeps its symbols, its words become blank bars.
    expect(render('u12-legend-town', 'hotspot').match(/tb-u12-legend-blank/g)).toHaveLength(5);
  });

  it('lesson mode shows the labels, the legend words and the "drawing, not a photo" note', () => {
    const town = render('u12-legend-town', 'lesson');
    for (const word of ['muuseum', 'sild', 'jõgi', 'park', 'hoone', 'Kaardi legend', 'Muuseumi märk']) expect(town).toContain(`>${word}<`);
    expect(town).not.toContain('tb-u12-legend-blank');
    expect(town).not.toContain('role="button"');
    const aerial = render('u12-aerial-vs-map', 'lesson');
    expect(aerial).toContain('>joonistus, mitte foto<');
    expect(aerial).toContain('>Aerofotot meenutav vaade<');
    expect(getDiagram('u12-aerial-vs-map')!.description).toMatch(/^Joonis, mitte päris foto/);
    expect(getDiagram('u12-legend-town')!.description).toMatch(/^Väljamõeldud näidiskaart, mitte Tartu kaart/);
    // No real Tartu place names in the invented town.
    expect(town).not.toMatch(/Emajõgi|Kaarisild|Toomemägi|Raekoda|Tartu Mänguasjamuuseum|Inglisild|Kuradisild/);
  });

  it('reveal mode marks the correct region and the wrong pick, and shows "letter – label"', () => {
    const markup = render('u12-legend-town', 'reveal', { correctRegionId: 'bridge', selectedRegionId: 'river' });
    expect(markup).toMatch(/data-region-id="bridge"[^>]*data-correct="true"/);
    expect(markup).toMatch(/data-region-id="river"[^>]*data-wrong="true"/);
    expect(markup).toContain('>D – Sild<');
    expect(markup).not.toContain('role="button"');
  });
});
