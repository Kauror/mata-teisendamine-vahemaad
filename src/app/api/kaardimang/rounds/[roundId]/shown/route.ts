import { kaardimangHandlers } from '@/lib/server/kaardimang/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// A child's map game: the question appeared on screen (speed clock).
export const POST = kaardimangHandlers('child').shown.POST;
