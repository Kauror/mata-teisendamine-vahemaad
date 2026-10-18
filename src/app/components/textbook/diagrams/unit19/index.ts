import type { ComponentType } from 'react';
import type { DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import ContinentalDriftDiagram from '@/app/components/textbook/diagrams/unit19/ContinentalDriftDiagram';
import CrustThicknessDiagram from '@/app/components/textbook/diagrams/unit19/CrustThicknessDiagram';
import EarthLayersDiagram from '@/app/components/textbook/diagrams/unit19/EarthLayersDiagram';
import EvidenceDiagram from '@/app/components/textbook/diagrams/unit19/EvidenceDiagram';
import PlateMotionDiagram from '@/app/components/textbook/diagrams/unit19/PlateMotionDiagram';
import PlateWorldDiagram from '@/app/components/textbook/diagrams/unit19/PlateWorldDiagram';

// Unit 19 "Maakera siseehitus": spread into DIAGRAM_COMPONENTS.
export const U19_DIAGRAM_COMPONENTS: Record<string, ComponentType<DiagramProps>> = {
  'u19-earth-layers': EarthLayersDiagram,
  'u19-crust-thickness': CrustThicknessDiagram,
  'u19-evidence': EvidenceDiagram,
  'u19-plate-motion': PlateMotionDiagram,
  'u19-plate-world': PlateWorldDiagram,
  'u19-continental-drift': ContinentalDriftDiagram
};
