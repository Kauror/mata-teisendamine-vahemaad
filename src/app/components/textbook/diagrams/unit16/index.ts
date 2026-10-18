import type { ComponentType } from 'react';
import type { DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import BalticConnectionDiagram from '@/app/components/textbook/diagrams/unit16/BalticConnectionDiagram';
import FiveOceansDiagram from '@/app/components/textbook/diagrams/unit16/FiveOceansDiagram';
import LandWaterDiagram from '@/app/components/textbook/diagrams/unit16/LandWaterDiagram';
import WaterFormsDiagram from '@/app/components/textbook/diagrams/unit16/WaterFormsDiagram';

// Unit 16 "Maailmameri": spread into DIAGRAM_COMPONENTS.
export const U16_DIAGRAM_COMPONENTS: Record<string, ComponentType<DiagramProps>> = {
  'u16-land-water': LandWaterDiagram,
  'u16-five-oceans': FiveOceansDiagram,
  'u16-water-forms': WaterFormsDiagram,
  'u16-baltic-connection': BalticConnectionDiagram
};
