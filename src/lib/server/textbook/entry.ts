import { childCourses } from '@/content/textbook/registry';
import { publicationRows } from '@/lib/server/textbook/progress';
import type { Learner } from '@/lib/shared/types';

// Kiur's Loodusõpetus page, whose only entry is the textbook course.
export const CHILD_LOODUSOPETUS_PAGE = '/kiur/loodusopetus';

// Where the child's page links to Loodusõpetus (the textbook), or null while no
// textbook unit is published for them. The card is always shown on the child's
// own page, outside the daily exercise rotation and the parent's library, so the
// textbook cannot disappear with a rotated or hidden exercise.
export function childLoodusopetusHref(learner: Learner): string | null {
  for (const course of childCourses(learner)) {
    const publication = publicationRows(course.id);
    if (course.units.some((unit) => unit.status === 'ready' && publication.get(unit.id)?.published === 1)) {
      return CHILD_LOODUSOPETUS_PAGE;
    }
  }
  return null;
}
