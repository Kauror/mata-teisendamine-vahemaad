import { NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { deleteAllHistory } from '@/lib/historyMaintenance';
import { GET as getVisibleHistory } from '@/app/api/history/route';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json(
    { code: 'parent_auth_required', message: 'Vanema sisselogimine on vajalik.' },
    { status: 401 }
  );
}

export async function GET(request: Request) {
  if (!await hasParentSession()) return unauthorized();
  return getVisibleHistory(request);
}

export async function DELETE() {
  if (!await hasParentSession()) return unauthorized();
  try {
    deleteAllHistory();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Parent history hide-all failed', error);
    return NextResponse.json(
      { code: 'history_hide_failed', message: 'Ajalugu ei saanud peita.' },
      { status: 500 }
    );
  }
}
