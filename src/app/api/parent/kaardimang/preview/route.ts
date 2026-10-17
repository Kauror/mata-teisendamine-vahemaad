import { kaardimangHandlers } from '@/lib/server/kaardimang/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Parent preview: parent session required; acts for the isolated preview learner.
export const GET = kaardimangHandlers('preview').overview.GET;
