// The DEMO course: synthetic content that shows the parent the whole flow in
// the authenticated preview. `previewOnly: true` and no learners — it must
// never appear in a child's course list, child route or child API.

import { DEFAULT_COURSE_SETTINGS, type Course } from '@/lib/textbook/types';
import { DEMO_COURSE_ID } from '@/content/textbook/textbook-demo/shared';
import { demoPlantUnit } from '@/content/textbook/textbook-demo/unitPlant';
import { demoWaterUnit } from '@/content/textbook/textbook-demo/unitWater';

export { DEMO_COURSE_ID };

export const textbookDemoCourse: Course = {
  id: DEMO_COURSE_ID,
  title: 'Näidiskursus (ainult eelvaade)',
  subject: 'loodusopetus',
  learners: [],
  previewOnly: true,
  settings: { ...DEFAULT_COURSE_SETTINGS },
  units: [demoWaterUnit, demoPlantUnit]
};
