// The diagrams content may reference — data only. Every `diagram` block,
// `diagram` question context and `diagram_hotspot` question names one of these
// IDs, and the validator refuses anything else. The React SVG component for
// each ID lives in the UI layer (one component per diagram, keyed by `id`);
// it MUST draw exactly the regions listed here, each as a tappable element
// carrying its region ID.
//
// Regions are stable IDs, never pixel coordinates. A region has:
//  - `label`: its real name, shown in lessons and in feedback after answering;
//  - `marker`: a neutral letter drawn on the diagram in hotspot questions,
//    where labels are hidden (otherwise the question answers itself);
//  - `position`: a neutral Estonian description for the accessible list of
//    region buttons ("A – kõige ülemine osa"), which also must not give the
//    answer away.

export type DiagramRegion = {
  id: string;
  label: string;
  marker: string;
  position: string;
};

export type DiagramDefinition = {
  id: string;
  title: string;
  // Accessible description of the whole picture (aria-label / figcaption).
  description: string;
  // What the UI component should draw (authoring note for the SVG builder).
  drawingNote: string;
  // Preview-only demo diagram.
  demo: boolean;
  regions: DiagramRegion[];
};

export const DIAGRAMS: readonly DiagramDefinition[] = [
  {
    id: 'demo-plant-parts',
    title: 'Taime osad',
    description: 'Õistaim ülevalt alla: õis, leht, vars ja maa all juur.',
    drawingNote: 'Upright flowering plant on a soil line. Top to bottom: flower (top), one or two leaves on the stem, the stem, roots below the soil line.',
    demo: true,
    regions: [
      { id: 'flower', label: 'õis', marker: 'A', position: 'kõige ülemine osa' },
      { id: 'leaf', label: 'leht', marker: 'B', position: 'osa varre küljel' },
      { id: 'stem', label: 'vars', marker: 'C', position: 'pikk keskmine osa' },
      { id: 'root', label: 'juur', marker: 'D', position: 'osa mullapinna all' }
    ]
  },
  {
    id: 'demo-water-cycle',
    title: 'Vee ringkäik',
    description: 'Päike soojendab merd, vesi aurustub, ülal tekib pilv ja pilvest sajab vihma tagasi maale ja merre.',
    drawingNote: 'Sun top-left, sea bottom-left with wavy arrows rising (evaporation), a cloud top-right, rain falling from the cloud on the right. Arrows show the loop.',
    demo: true,
    regions: [
      { id: 'sun', label: 'Päike', marker: 'A', position: 'ülemine vasak nurk' },
      { id: 'sea', label: 'meri', marker: 'B', position: 'alumine vasak osa' },
      { id: 'cloud', label: 'pilv', marker: 'C', position: 'ülemine parem osa' },
      { id: 'rain', label: 'vihm', marker: 'D', position: 'parem keskmine osa' }
    ]
  }
];

const BY_ID = new Map(DIAGRAMS.map((diagram) => [diagram.id, diagram]));

export function getDiagram(id: string): DiagramDefinition | null {
  return BY_ID.get(id) ?? null;
}

export function isRegisteredDiagram(id: string): boolean {
  return BY_ID.has(id);
}

// Region IDs in drawing order; empty for an unknown diagram.
export function diagramRegionIds(id: string): string[] {
  return BY_ID.get(id)?.regions.map((region) => region.id) ?? [];
}

// Look-up interface the validator uses, so tests can pass their own registry.
export type DiagramLookup = (id: string) => DiagramDefinition | null;
export const defaultDiagramLookup: DiagramLookup = getDiagram;
