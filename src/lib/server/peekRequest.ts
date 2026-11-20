import type { NextRequest } from 'next/server';
import { PARENT_SESSION_COOKIE } from '@/lib/auth/constants';
import { verifySession } from '@/lib/auth/session';
import { isPeekReadOnlyRequest } from '@/lib/peekMode';

// The server's view of peek mode for a route handler: the same rule the
// middleware applies to child write paths (a signed parent session rides
// along and the parent did not choose "Vaata nagu laps"). Used where the
// write is decided by the request body (offline sync push) or is a side
// effect of a read (child dashboard settlement).
export async function isPeekingRequest(req: NextRequest) {
  const parent = await verifySession(req.cookies.get(PARENT_SESSION_COOKIE)?.value, 'parent');
  return isPeekReadOnlyRequest({ parentSession: Boolean(parent), cookieHeader: req.headers.get('cookie') });
}
