import type { ComponentType } from 'react';
import type { DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import BalticRegionDiagram from '@/app/components/textbook/diagrams/unit17/BalticRegionDiagram';
import EstoniaWatersDiagram from '@/app/components/textbook/diagrams/unit17/EstoniaWatersDiagram';
import HemispheresDiagram from '@/app/components/textbook/diagrams/unit17/HemispheresDiagram';
import WorldLocationDiagram from '@/app/components/textbook/diagrams/unit17/WorldLocationDiagram';

// Unit 17 "Eesti geograafiline asend": spread into DIAGRAM_COMPONENTS.
export const U17_DIAGRAM_COMPONENTS: Record<string, ComponentType<DiagramProps>> = {
  'u17-hemispheres': HemispheresDiagram,
  'u17-world-location': WorldLocationDiagram,
  'u17-baltic-region': BalticRegionDiagram,
  'u17-estonia-waters': EstoniaWatersDiagram
};
