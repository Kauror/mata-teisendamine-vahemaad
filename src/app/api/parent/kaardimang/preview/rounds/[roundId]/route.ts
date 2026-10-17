import { kaardimangHandlers } from '@/lib/server/kaardimang/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Parent preview.
export const GET = kaardimangHandlers('preview').round.GET;
