import { childCourses } from '@/content/textbook/registry';
import { publicationRows } from '@/lib/server/textbook/progress';
import { TEXTBOOK_PAGES } from '@/lib/textbook/api';
import type { Learner } from '@/lib/shared/types';

// Where the child's page links to the textbook, or null while nothing is
// published for them. The link sits on the child's own page rather than only
// behind the Loodusõpetus exercise card, which is in the daily rotation and can
// be hidden — the textbook must not disappear with it.
export function childTextbookHref(learner: Learner): string | null {
  for (const course of childCourses(learner)) {
    const publication = publicationRows(course.id);
    if (course.units.some((unit) => unit.status === 'ready' && publication.get(unit.id)?.published === 1)) {
      return TEXTBOOK_PAGES.childCourse;
    }
  }
  return null;
}
