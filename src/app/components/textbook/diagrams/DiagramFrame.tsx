'use client';

import type { KeyboardEvent, ReactNode } from 'react';
import { getDiagram, type DiagramDefinition } from '@/lib/textbook/diagramRegistry';
import { DIAGRAM_LAYOUTS, MARKER_FONT_SIZE, MARKER_RADIUS } from '@/app/components/textbook/diagrams/diagramLayout';

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

export function DiagramSvg({ diagramId, description, children }: { diagramId: string; description?: string; children: ReactNode }) {
  const definition = diagramDefinition(diagramId);
  const layout = DIAGRAM_LAYOUTS[diagramId];
  const titleId = `tb-diagram-${diagramId}-title`;
  const descId = `tb-diagram-${diagramId}-desc`;
  return (
    <svg className='tb-diagram-svg' viewBox={`0 0 ${layout.width} ${layout.height}`} role='group' aria-labelledby={titleId} aria-describedby={descId} data-diagram-id={diagramId}>
      <title id={titleId}>{definition.title}</title>
      <desc id={descId}>{description ?? definition.description}</desc>
      {children}
    </svg>
  );
}

// One region: its drawing, an invisible hit area of at least 44 × 44, and its
// label or marker. In hotspot mode it is a button.
export function DiagramRegion({ diagramId, regionId, props, hit, children }: {
  diagramId: string;
  regionId: string;
  props: DiagramProps;
  // The invisible tap area (a rect in diagram units).
  hit: { x: number; y: number; width: number; height: number };
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
      {children}
      {showLabel ? (
        <text className={layout.label.onShape ? 'tb-diagram-label tb-diagram-label-light' : 'tb-diagram-label'} x={layout.label.x} y={layout.label.y} textAnchor={layout.label.anchor} fontSize={layout.label.fontSize}>
          {props.mode === 'reveal' ? `${region.marker} – ${region.label}` : region.label}
        </text>
      ) : (
        <g className='tb-diagram-marker'>
          <circle cx={layout.marker.x} cy={layout.marker.y} r={MARKER_RADIUS} />
          <text x={layout.marker.x} y={layout.marker.y} dy='0.35em' textAnchor='middle' fontSize={MARKER_FONT_SIZE}>{region.marker}</text>
        </g>
      )}
    </g>
  );
}
