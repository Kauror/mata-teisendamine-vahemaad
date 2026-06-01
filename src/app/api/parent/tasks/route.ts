import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { AssignmentMode, createTaskTemplate, RecurrenceType } from '@/lib/tasks';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  try {
    const body = await req.json();
    const id = createTaskTemplate({
      title: String(body.title || ''),
      points: Number(body.points || 1),
      assignmentMode: body.assignmentMode as AssignmentMode,
      recurrenceType: body.recurrenceType as RecurrenceType,
      selectedWeekdays: Array.isArray(body.selectedWeekdays) ? body.selectedWeekdays.map(Number) : [],
      startDate: body.startDate || null,
      onceDate: body.onceDate || null
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Tegevust ei saanud salvestada.' }, { status: 400 });
  }
}
