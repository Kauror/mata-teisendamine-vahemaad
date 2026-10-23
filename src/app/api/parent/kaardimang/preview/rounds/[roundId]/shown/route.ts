import { kaardimangHandlers } from '@/lib/server/kaardimang/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Parent preview: the question appeared on screen.
export const POST = kaardimangHandlers('preview').shown.POST;
