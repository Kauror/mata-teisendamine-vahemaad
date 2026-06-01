import { NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { deleteTaskTemplate } from '@/lib/tasks';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const { id } = await params;
  const taskId = Number(id);
  if (!Number.isInteger(taskId)) return NextResponse.json({ message: 'Vale tegevus.' }, { status: 400 });
  deleteTaskTemplate(taskId);
  return NextResponse.json({ ok: true });
}
