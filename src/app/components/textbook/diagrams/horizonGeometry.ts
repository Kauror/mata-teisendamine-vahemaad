import { above, horizonPoint, type Circle } from '@/app/components/textbook/diagrams/curvedSurface';

// Positions for the two unit 10 horizon diagrams (ShipHorizonDiagram,
// ObserverHeightDiagram), kept out of the .tsx files so the unit tests can
// check the geometry: what the curve hides, and how far each horizon is.
// The curvature is hugely exaggerated; nothing here is to scale.

/* u10-ship-horizon (380 × 260) */
export const SHIP_SEA: Circle = { cx: 200, cy: 480, r: 300 };
export const SHIP_OBSERVER_X = 70;
// The person drawing's eye (head centre) is 28 units above its feet.
export const SHIP_OBSERVER_EYE = 28;
export const NEAR_SHIP_X = 140;
export const FAR_SHIP_X = 330;
// Ship drawing heights above the waterline: hull top and mast top.
export const SHIP_HULL_TOP = 18;
export const SHIP_MAST_TOP = 75;
export const SHIP_EYE = above(SHIP_SEA, SHIP_OBSERVER_X, SHIP_OBSERVER_EYE);
export const SHIP_HORIZON = horizonPoint(SHIP_SEA, SHIP_EYE, 1);

/* u10-observer-height (360 × 270): the beach person looks left, the tower person right. */
export const HEIGHT_SEA: Circle = { cx: 160, cy: 440, r: 260 };
export const BEACH_X = 128;
// The person drawing's eye (head centre) is 25 units above its feet.
export const BEACH_EYE = 25;
export const TOWER_X = 200;
export const TOWER_HEIGHT = 36;
// The tower-top person stands on the platform, 3 units above the tower body.
export const TOWER_STAND = TOWER_HEIGHT + 3;
export const TOWER_EYE = TOWER_STAND + 25;
export const BEACH_EYE_POINT = above(HEIGHT_SEA, BEACH_X, BEACH_EYE);
export const TOWER_EYE_POINT = above(HEIGHT_SEA, TOWER_X, TOWER_EYE);
export const BEACH_HORIZON = horizonPoint(HEIGHT_SEA, BEACH_EYE_POINT, -1);
export const TOWER_HORIZON = horizonPoint(HEIGHT_SEA, TOWER_EYE_POINT, 1);
