'use client';

import type { KeyboardEvent, ReactNode } from 'react';
import { getDiagram, type DiagramDefinition } from '@/lib/textbook/diagramRegistry';
import { DIAGRAM_LAYOUTS, LABEL_LINE_HEIGHT, MARKER_FONT_SIZE, MARKER_RADIUS, labelLines, type LabelLayout, type MarkerLayout } from '@/app/components/textbook/diagrams/diagramLayout';

// Shared frame for the registered diagrams. `lesson` mode shows the real
// region labels; `hotspot` mode hides them and draws only the neutral letter
// markers (the labels would give the answer away), and every region becomes a
// tappable button carrying its region ID. `reveal` marks the correct region
// (and the learner's choice) after answering, and then shows the labels.

export type DiagramMode = 'lesson' | 'hotspot' | 'reveal';

export type DiagramProps = {
  mode: DiagramMode;
  description?: string;
  // Hotspot / reveal state.
  selectedRegionId?: string | null;
  correctRegionId?: string | null;
  onSelectRegion?: (regionId: string) => void;
  disabled?: boolean;
};

export function diagramDefinition(id: string): DiagramDefinition {
  const definition = getDiagram(id);
  if (!definition) throw new Error(`Unknown diagram ${id}`);
  return definition;
}

// In a hotspot question the picture's description would name what is where
// (the answer), so it is replaced by a neutral one that lists the markers only.
export function neutralDiagramDescription(definition: DiagramDefinition): string {
  return `Joonisel on tähtedega märgitud kohad ${definition.regions.map((region) => region.marker).join(', ')}.`;
}

export function DiagramSvg({ diagramId, mode, description, children }: { diagramId: string; mode?: DiagramMode; description?: string; children: ReactNode }) {
  const definition = diagramDefinition(diagramId);
  const layout = DIAGRAM_LAYOUTS[diagramId];
  const titleId = `tb-diagram-${diagramId}-title`;
  const descId = `tb-diagram-${diagramId}-desc`;
  const text = mode === 'hotspot' ? neutralDiagramDescription(definition) : description ?? definition.description;
  return (
    <svg className='tb-diagram-svg' viewBox={`0 0 ${layout.width} ${layout.height}`} role='group' aria-labelledby={titleId} aria-describedby={descId} data-diagram-id={diagramId}>
      <title id={titleId}>{definition.title}</title>
      <desc id={descId}>{text}</desc>
      {children}
    </svg>
  );
}

// The layout's explanatory notes ("Maa vari", "silmapiir"): lessons and
// feedback only, never in a hotspot question.
export function DiagramNotes({ diagramId, mode }: { diagramId: string; mode: DiagramMode }) {
  const notes = DIAGRAM_LAYOUTS[diagramId]?.notes ?? [];
  if (mode === 'hotspot' || notes.length === 0) return null;
  return (
    <g className='tb-diagram-notes' aria-hidden='true'>
      {notes.map((note, index) => (
        <text key={index} className={note.label.onShape ? 'tb-diagram-note tb-diagram-note-light' : 'tb-diagram-note'} x={note.label.x} y={note.label.y} textAnchor={note.label.anchor} fontSize={note.label.fontSize}>
          {note.text}
        </text>
      ))}
    </g>
  );
}

// A label's text: plain, or one <tspan> per line when its layout wraps it.
function LabelText({ label, text }: { label: LabelLayout; text: string }) {
  const lines = labelLines(label, text);
  if (lines.length === 1) return <>{text}</>;
  return <>{lines.map((line, index) => <tspan key={index} x={label.x} dy={index === 0 ? undefined : `${LABEL_LINE_HEIGHT}em`}>{line}</tspan>)}</>;
}

// A second place on the picture where the SAME region shows (the Pacific at
// both edges of a flat world map): its own tap area, marker and label, inside
// the one button, so both places select the one region ID.
export type RegionTwin = { hit: { x: number; y: number; width: number; height: number }; marker: MarkerLayout; label: LabelLayout };

// One region: its drawing, an invisible hit area of at least 44 × 44, and its
// label or marker. In hotspot mode it is a button.
export function DiagramRegion({ diagramId, regionId, props, hit, twin, children }: {
  diagramId: string;
  regionId: string;
  props: DiagramProps;
  // The invisible tap area (a rect in diagram units).
  hit: { x: number; y: number; width: number; height: number };
  twin?: RegionTwin;
  children: ReactNode;
}) {
  const definition = diagramDefinition(diagramId);
  const region = definition.regions.find((item) => item.id === regionId);
  const layout = DIAGRAM_LAYOUTS[diagramId].regions[regionId];
  if (!region || !layout) throw new Error(`Diagram ${diagramId} has no region ${regionId}`);
  const interactive = props.mode === 'hotspot' && Boolean(props.onSelectRegion) && !props.disabled;
  const selected = props.selectedRegionId === regionId;
  const correct = props.mode === 'reveal' && props.correctRegionId === regionId;
  const wrongPick = props.mode === 'reveal' && selected && !correct;
  const select = () => {
    if (interactive) props.onSelectRegion?.(regionId);
  };
  const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select();
    }
  };
  const showLabel = props.mode !== 'hotspot';
  const text = props.mode === 'reveal' ? `${region.marker} – ${region.label}` : region.label;
  const labelOrMarker = (label: LabelLayout, marker: MarkerLayout) => (showLabel ? (
    <text className={label.onShape ? 'tb-diagram-label tb-diagram-label-light' : 'tb-diagram-label'} x={label.x} y={label.y} textAnchor={label.anchor} fontSize={label.fontSize}>
      <LabelText label={label} text={text} />
    </text>
  ) : (
    <g className='tb-diagram-marker'>
      <circle cx={marker.x} cy={marker.y} r={MARKER_RADIUS} />
      <text x={marker.x} y={marker.y} dy='0.35em' textAnchor='middle' fontSize={MARKER_FONT_SIZE}>{region.marker}</text>
    </g>
  ));
  return (
    <g
      className='tb-region'
      data-region-id={regionId}
      data-selected={selected ? 'true' : undefined}
      data-correct={correct ? 'true' : undefined}
      data-wrong={wrongPick ? 'true' : undefined}
      {...(interactive
        ? { role: 'button', tabIndex: 0, 'aria-pressed': selected, 'aria-label': `Ala ${region.marker}`, onClick: select, onKeyDown }
        : { 'aria-hidden': props.mode === 'hotspot' ? undefined : true })}
    >
      <rect className='tb-region-hit' x={hit.x} y={hit.y} width={hit.width} height={hit.height} rx={8} />
      {twin ? <rect className='tb-region-hit' x={twin.hit.x} y={twin.hit.y} width={twin.hit.width} height={twin.hit.height} rx={8} /> : null}
      {children}
      {labelOrMarker(layout.label, layout.marker)}
      {twin ? labelOrMarker(twin.label, twin.marker) : null}
    </g>
  );
}
