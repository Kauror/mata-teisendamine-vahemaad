import type { ComponentType } from 'react';
import type { DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import AncientEarthDiagram from '@/app/components/textbook/diagrams/AncientEarthDiagram';
import LunarEclipseDiagram from '@/app/components/textbook/diagrams/LunarEclipseDiagram';
import ObserverHeightDiagram from '@/app/components/textbook/diagrams/ObserverHeightDiagram';
import PlantPartsDiagram from '@/app/components/textbook/diagrams/PlantPartsDiagram';
import ShipHorizonDiagram from '@/app/components/textbook/diagrams/ShipHorizonDiagram';
import WaterCycleDiagram from '@/app/components/textbook/diagrams/WaterCycleDiagram';

// The preview demo's two pictures and Unit 10 "Maa kuju": small, so they stay
// in the textbook bundle; every later unit is loaded on demand by DiagramView.
export const UNIT10_DIAGRAM_COMPONENTS: Record<string, ComponentType<DiagramProps>> = {
  'demo-water-cycle': WaterCycleDiagram,
  'demo-plant-parts': PlantPartsDiagram,
  'u10-ancient-earth': AncientEarthDiagram,
  'u10-lunar-eclipse': LunarEclipseDiagram,
  'u10-ship-horizon': ShipHorizonDiagram,
  'u10-observer-height': ObserverHeightDiagram
};
