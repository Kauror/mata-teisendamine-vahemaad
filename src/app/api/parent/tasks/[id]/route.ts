import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { AssignmentMode, deleteTaskTemplate, RecurrenceType, updateTaskTemplate } from '@/lib/tasks';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const { id } = await params;
  const taskId = Number(id);
  if (!Number.isInteger(taskId)) return NextResponse.json({ message: 'Vale tegevus.' }, { status: 400 });
  try {
    const body = await req.json();
    updateTaskTemplate(taskId, {
      title: String(body.title || ''),
      points: Number(body.points || 1),
      assignmentMode: body.assignmentMode as AssignmentMode,
      recurrenceType: body.recurrenceType as RecurrenceType,
      selectedWeekdays: Array.isArray(body.selectedWeekdays) ? body.selectedWeekdays.map(Number) : [],
      startDate: body.startDate || null,
      onceDate: body.onceDate || null,
      requiresApproval: Boolean(body.requiresApproval)
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Tegevust ei saanud salvestada.' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const { id } = await params;
  const taskId = Number(id);
  if (!Number.isInteger(taskId)) return NextResponse.json({ message: 'Vale tegevus.' }, { status: 400 });
  deleteTaskTemplate(taskId);
  return NextResponse.json({ ok: true });
}
