import { parentHandlers } from '@/lib/server/textbook/parentHttp';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Parent textbook route: parent session required (and CSRF for mutations, via the middleware).
export const GET = parentHandlers.unit.GET;
