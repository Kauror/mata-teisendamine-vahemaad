import type { ComponentType } from 'react';
import type { DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import AreaDetailDiagram from '@/app/components/textbook/diagrams/unit13/AreaDetailDiagram';
import DirectVsRouteDiagram from '@/app/components/textbook/diagrams/unit13/DirectVsRouteDiagram';
import MeasuredDistanceDiagram from '@/app/components/textbook/diagrams/unit13/MeasuredDistanceDiagram';
import ScaleFormsDiagram from '@/app/components/textbook/diagrams/unit13/ScaleFormsDiagram';

// Unit 13 "Kaardi mõõtkava": the React SVG per registry ID, spread into
// DIAGRAM_COMPONENTS (../index.tsx).
export const UNIT13_DIAGRAM_COMPONENTS: Record<string, ComponentType<DiagramProps>> = {
  'u13-area-detail': AreaDetailDiagram,
  'u13-scale-forms': ScaleFormsDiagram,
  'u13-measured-distance': MeasuredDistanceDiagram,
  'u13-direct-vs-route': DirectVsRouteDiagram
};
