import { NextRequest, NextResponse } from 'next/server';
import { publicErrorMessage } from '@/lib/server/http/requestValidation';
import { hasParentSession } from '@/lib/parentAuth';
import { approveTaskAssignment, rejectTaskAssignment } from '@/lib/tasks';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  try {
    const body = await req.json();
    const assignmentId = Number(body.assignmentId);
    if (!Number.isInteger(assignmentId)) return NextResponse.json({ message: 'Vale tegevus.' }, { status: 400 });
    if (body.action === 'approve') return NextResponse.json(approveTaskAssignment(assignmentId));
    if (body.action === 'reject') return NextResponse.json(rejectTaskAssignment(assignmentId));
    return NextResponse.json({ message: 'Vale tegevus.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: publicErrorMessage(error, 'Toimingut ei saanud teha.') }, { status: 409 });
  }
}
