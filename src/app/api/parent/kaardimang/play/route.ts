import { kaardimangHandlers } from '@/lib/server/kaardimang/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Kairi or Kaur playing (?player=): overview.
export const GET = kaardimangHandlers('parent').overview.GET;
