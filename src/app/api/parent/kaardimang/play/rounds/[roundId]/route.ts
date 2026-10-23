import { kaardimangHandlers } from '@/lib/server/kaardimang/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Kairi or Kaur playing: one round.
export const GET = kaardimangHandlers('parent').round.GET;
