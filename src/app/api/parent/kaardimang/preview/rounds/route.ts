import { kaardimangHandlers } from '@/lib/server/kaardimang/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Parent preview.
export const POST = kaardimangHandlers('preview').start.POST;
