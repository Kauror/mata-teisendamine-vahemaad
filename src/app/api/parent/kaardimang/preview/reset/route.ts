import { parentKaardimangHandlers } from '@/lib/server/kaardimang/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Parent preview reset: deletes only the preview learner's map-game rows.
export const POST = parentKaardimangHandlers.previewReset.POST;
