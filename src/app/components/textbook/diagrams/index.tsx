'use client';

import type { ComponentType } from 'react';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import type { DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import PlantPartsDiagram from '@/app/components/textbook/diagrams/PlantPartsDiagram';
import WaterCycleDiagram from '@/app/components/textbook/diagrams/WaterCycleDiagram';

export type { DiagramMode, DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

// One React SVG component per registry ID (src/lib/textbook/diagramRegistry.ts).
// The validator refuses content naming any other ID.
export const DIAGRAM_COMPONENTS: Record<string, ComponentType<DiagramProps>> = {
  'demo-water-cycle': WaterCycleDiagram,
  'demo-plant-parts': PlantPartsDiagram
};

export function DiagramView({ diagramId, ...props }: DiagramProps & { diagramId: string }) {
  const Component = DIAGRAM_COMPONENTS[diagramId];
  const definition = getDiagram(diagramId);
  if (!Component || !definition) {
    return <p className='tb-diagram-missing'>Joonist ei saa näidata.</p>;
  }
  return (
    <div className='tb-diagram' data-mode={props.mode}>
      <Component {...props} />
    </div>
  );
}
