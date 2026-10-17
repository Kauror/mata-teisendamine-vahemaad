import { parentKaardimangHandlers } from '@/lib/server/kaardimang/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Parent summary: data coverage and Kiur's map-game progress (read only).
export const GET = parentKaardimangHandlers.overview.GET;
