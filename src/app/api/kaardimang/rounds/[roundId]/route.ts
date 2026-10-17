import { kaardimangHandlers } from '@/lib/server/kaardimang/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Kiur's map game (child route).
export const GET = kaardimangHandlers('child').round.GET;
