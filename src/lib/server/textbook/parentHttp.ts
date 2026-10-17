import { NextRequest } from 'next/server';
import type { Learner } from '@/lib/shared/types';
import { TextbookApiError, previewContext } from '@/lib/server/textbook/context';
import { actionIdOf, readJson, requireParent, runTextbookRoute as run, segment } from '@/lib/server/textbook/http';
import { buildCourseOverview, resolveCourse } from '@/lib/server/textbook/learner';
import { getParentOverview, getParentUnitDetail, resetPreview, setManualUnlock, setPublished } from '@/lib/server/textbook/parent';
import { loadCourseState } from '@/lib/server/textbook/progress';

// Parent textbook routes. Every handler checks the parent session itself
// (GETs are not covered by the middleware's parent check); mutations are also
// guarded by the middleware's parent session + CSRF check.

type Params<T> = { params: Promise<T> };
type UnitParams = { courseId: string; unitId: string };

function booleanOf(body: Record<string, unknown>, key: string): boolean {
  const value = body[key];
  if (typeof value !== 'boolean') throw new TextbookApiError('invalid_request', 'Päring on vigane.');
  return value;
}

function learnerOf(body: Record<string, unknown>): Learner | undefined {
  const value = body.learner;
  if (value === undefined || value === null) return undefined;
  if (value === 'kiur' || value === 'kirsi') return value;
  throw new TextbookApiError('invalid_request', 'Laps on vigane.');
}

export const parentHandlers = {
  overview: {
    GET: () => run(async () => {
      await requireParent();
      return getParentOverview();
    })
  },
  unit: {
    GET: (_req: NextRequest, { params }: Params<UnitParams>) => run(async () => {
      await requireParent();
      const { courseId, unitId } = await params;
      return getParentUnitDetail(segment(courseId), segment(unitId));
    })
  },
  publish: {
    POST: (req: NextRequest, { params }: Params<UnitParams>) => run(async () => {
      await requireParent();
      const { courseId, unitId } = await params;
      const body = await readJson(req);
      actionIdOf(body);
      return setPublished(segment(courseId), segment(unitId), booleanOf(body, 'published'));
    })
  },
  unlock: {
    POST: (req: NextRequest, { params }: Params<UnitParams>) => run(async () => {
      await requireParent();
      const { courseId, unitId } = await params;
      const body = await readJson(req);
      actionIdOf(body);
      return setManualUnlock(segment(courseId), segment(unitId), booleanOf(body, 'unlocked'), learnerOf(body));
    })
  },
  previewStart: {
    POST: (req: NextRequest) => run(async () => {
      await requireParent();
      const body = await readJson(req);
      actionIdOf(body);
      if (typeof body.courseId !== 'string') throw new TextbookApiError('invalid_request', 'Kursus puudub.');
      const context = previewContext();
      const course = resolveCourse(context, segment(body.courseId));
      return buildCourseOverview(context, loadCourseState(context, course));
    })
  },
  previewReset: {
    POST: (req: NextRequest) => run(async () => {
      await requireParent();
      const body = await readJson(req);
      actionIdOf(body);
      const courseId = body.courseId === undefined || body.courseId === null ? undefined : body.courseId;
      if (courseId !== undefined && typeof courseId !== 'string') throw new TextbookApiError('invalid_request', 'Kursus on vigane.');
      return resetPreview(courseId === undefined ? undefined : segment(courseId));
    })
  }
};
