import type { ComponentType } from 'react';
import type { DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import ContinentWorldPartLinksDiagram from '@/app/components/textbook/diagrams/unit15/ContinentWorldPartLinksDiagram';
import LandWaterDiagram from '@/app/components/textbook/diagrams/unit15/LandWaterDiagram';
import WorldContinentsDiagram from '@/app/components/textbook/diagrams/unit15/WorldContinentsDiagram';
import WorldPartsDiagram from '@/app/components/textbook/diagrams/unit15/WorldPartsDiagram';

// Unit 15 "Mandrid ja maailmajaod": spread into DIAGRAM_COMPONENTS.
export const U15_DIAGRAM_COMPONENTS: Record<string, ComponentType<DiagramProps>> = {
  'u15-land-water': LandWaterDiagram,
  'u15-world-continents': WorldContinentsDiagram,
  'u15-world-parts': WorldPartsDiagram,
  'u15-continent-worldpart-links': ContinentWorldPartLinksDiagram
};
