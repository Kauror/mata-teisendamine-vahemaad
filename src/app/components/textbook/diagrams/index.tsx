'use client';

import type { ComponentType } from 'react';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import type { DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import AncientEarthDiagram from '@/app/components/textbook/diagrams/AncientEarthDiagram';
import LunarEclipseDiagram from '@/app/components/textbook/diagrams/LunarEclipseDiagram';
import ObserverHeightDiagram from '@/app/components/textbook/diagrams/ObserverHeightDiagram';
import PlantPartsDiagram from '@/app/components/textbook/diagrams/PlantPartsDiagram';
import ShipHorizonDiagram from '@/app/components/textbook/diagrams/ShipHorizonDiagram';
import WaterCycleDiagram from '@/app/components/textbook/diagrams/WaterCycleDiagram';
import { UNIT13_DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/unit13';

export type { DiagramMode, DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

// One React SVG component per registry ID (src/lib/textbook/diagramRegistry.ts).
// The validator refuses content naming any other ID.
export const DIAGRAM_COMPONENTS: Record<string, ComponentType<DiagramProps>> = {
  'demo-water-cycle': WaterCycleDiagram,
  'demo-plant-parts': PlantPartsDiagram,
  'u10-ancient-earth': AncientEarthDiagram,
  'u10-lunar-eclipse': LunarEclipseDiagram,
  'u10-ship-horizon': ShipHorizonDiagram,
  'u10-observer-height': ObserverHeightDiagram,
  ...UNIT13_DIAGRAM_COMPONENTS
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
