import { parentKaardimangHandlers } from '@/lib/server/kaardimang/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// The family competition: read it, open one, end it early or extend it.
export const GET = parentKaardimangHandlers.competition.GET;
export const POST = parentKaardimangHandlers.competition.POST;
