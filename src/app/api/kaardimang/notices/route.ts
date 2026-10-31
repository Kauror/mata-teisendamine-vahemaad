import { kaardimangHandlers } from '@/lib/server/kaardimang/http';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// A child (?player=kiur|kirsi) closed a one-shot notice: the results splash or the last-days reminder.
export const POST = kaardimangHandlers('child').notices.POST;
