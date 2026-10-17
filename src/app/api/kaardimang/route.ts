import { kaardimangHandlers } from '@/lib/server/kaardimang/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Kiur's map game (child route). Every rule is enforced in lib/server/kaardimang.
export const GET = kaardimangHandlers('child').overview.GET;
