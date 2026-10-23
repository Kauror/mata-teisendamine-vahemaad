import { kaardimangHandlers } from '@/lib/server/kaardimang/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Kairi or Kaur playing: an answer.
export const POST = kaardimangHandlers('parent').answer.POST;
