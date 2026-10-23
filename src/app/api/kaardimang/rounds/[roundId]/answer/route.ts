import { kaardimangHandlers } from '@/lib/server/kaardimang/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// A child's map game (child route, ?player=kiur|kirsi).
export const POST = kaardimangHandlers('child').answer.POST;
