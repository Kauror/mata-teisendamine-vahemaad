import type { ComponentType } from 'react';
import type { DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import AerialMapDiagram from '@/app/components/textbook/diagrams/unit12/AerialMapDiagram';
import GlobeFlatMapDiagram from '@/app/components/textbook/diagrams/unit12/GlobeFlatMapDiagram';
import LegendTownDiagram from '@/app/components/textbook/diagrams/unit12/LegendTownDiagram';
import OrangePeelDiagram from '@/app/components/textbook/diagrams/unit12/OrangePeelDiagram';

// Unit 12 "Kaart" components, keyed by registry ID (src/lib/textbook/diagrams/unit12.ts).
export const UNIT12_DIAGRAM_COMPONENTS: Record<string, ComponentType<DiagramProps>> = {
  'u12-globe-flatmap': GlobeFlatMapDiagram,
  'u12-orange-peel': OrangePeelDiagram,
  'u12-aerial-vs-map': AerialMapDiagram,
  'u12-legend-town': LegendTownDiagram
};
