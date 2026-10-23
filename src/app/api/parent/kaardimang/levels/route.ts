import { parentKaardimangHandlers } from '@/lib/server/kaardimang/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// The parent sets a player's level.
export const POST = parentKaardimangHandlers.levels.POST;
