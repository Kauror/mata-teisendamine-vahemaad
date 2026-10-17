import { previewHandlers } from '@/lib/server/textbook/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Parent preview route: parent session required, isolated preview learner, no real side effects.
export const POST = previewHandlers.testSubmit.POST;
