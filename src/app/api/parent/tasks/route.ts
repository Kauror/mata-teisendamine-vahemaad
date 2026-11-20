import { NextRequest, NextResponse } from 'next/server';
import { readJsonObjectRequest } from '@/lib/server/http/jsonRequest';
import { publicErrorMessage } from '@/lib/server/http/requestValidation';
import { hasParentSession } from '@/lib/parentAuth';
import { AssignmentMode, createTaskTemplate, RecurrenceType } from '@/lib/tasks';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  try {
    const jsonBody = await readJsonObjectRequest(req);
    if (jsonBody instanceof NextResponse) return jsonBody;
    const body = jsonBody;
    const id = createTaskTemplate({
      title: String(body.title || ''),
      points: Number(body.points || 1),
      assignmentMode: body.assignmentMode as AssignmentMode,
      recurrenceType: body.recurrenceType as RecurrenceType,
      selectedWeekdays: Array.isArray(body.selectedWeekdays) ? body.selectedWeekdays.map(Number) : [],
      startDate: typeof body.startDate === 'string' && body.startDate ? body.startDate : null,
      onceDate: typeof body.onceDate === 'string' && body.onceDate ? body.onceDate : null,
      requiresApproval: Boolean(body.requiresApproval)
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: publicErrorMessage(error, 'Tegevust ei saanud salvestada.') }, { status: 400 });
  }
}
