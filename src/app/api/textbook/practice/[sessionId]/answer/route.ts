import { childHandlers } from '@/lib/server/textbook/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Child textbook route (the course child). Every gate is enforced in lib/server/textbook.
export const POST = childHandlers.practiceAnswer.POST;
