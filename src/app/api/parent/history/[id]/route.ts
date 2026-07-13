import { NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { deleteAttempt } from '@/lib/historyMaintenance';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await hasParentSession()) {
    return NextResponse.json(
      { code: 'parent_auth_required', message: 'Vanema sisselogimine on vajalik.' },
      { status: 401 }
    );
  }
  const attemptId = Number((await params).id);
  if (!Number.isInteger(attemptId)) {
    return NextResponse.json({ code: 'invalid_history_id', message: 'Vale tulemus.' }, { status: 400 });
  }
  try {
    if (deleteAttempt(attemptId) === 0) {
      return NextResponse.json({ code: 'history_not_found', message: 'Tulemust ei leitud.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Parent history hide failed', error);
    return NextResponse.json(
      { code: 'history_hide_failed', message: 'Tulemust ei saanud peita.' },
      { status: 500 }
    );
  }
}
