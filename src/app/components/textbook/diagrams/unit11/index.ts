import type { ComponentType } from 'react';
import type { DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import AxisPolesDiagram from '@/app/components/textbook/diagrams/unit11/AxisPolesDiagram';
import EquatorParallelsDiagram from '@/app/components/textbook/diagrams/unit11/EquatorParallelsDiagram';
import GlobeTypesDiagram from '@/app/components/textbook/diagrams/unit11/GlobeTypesDiagram';
import MeridiansEstoniaDiagram from '@/app/components/textbook/diagrams/unit11/MeridiansEstoniaDiagram';

// Unit 11 "Gloobus" diagram components, spread into DIAGRAM_COMPONENTS.
export const UNIT11_DIAGRAM_COMPONENTS: Record<string, ComponentType<DiagramProps>> = {
  'u11-globe-types': GlobeTypesDiagram,
  'u11-axis-poles': AxisPolesDiagram,
  'u11-equator-parallels': EquatorParallelsDiagram,
  'u11-meridians-estonia': MeridiansEstoniaDiagram
};

