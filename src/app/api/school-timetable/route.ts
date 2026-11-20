import { NextResponse } from 'next/server';
import { serializeSchoolTimetable } from '@/lib/schoolTimetable';
import { loadSchoolTimetable } from '@/lib/server/schoolTimetableFile';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// The family's school timetable (behind the family session like every API).
// The page keeps a copy for offline use; see app/components/useAppClock.ts.
export async function GET() {
  return NextResponse.json(serializeSchoolTimetable(loadSchoolTimetable()), { headers: { 'Cache-Control': 'no-store' } });
}
