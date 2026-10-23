import { kaardimangHandlers } from '@/lib/server/kaardimang/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Kairi or Kaur playing: the question appeared on screen.
export const POST = kaardimangHandlers('parent').shown.POST;
