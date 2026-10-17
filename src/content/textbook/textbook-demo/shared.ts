import type { SourceRef } from '@/lib/textbook/types';

export const DEMO_COURSE_ID = 'textbook-demo';

// Every demo block, objective and question carries this source, so it can
// never be mistaken for textbook content.
export const DEMO_SOURCES: SourceRef[] = [
  { kind: 'supplementary', attribution: 'Harjutaja näidissisu (sünteetiline, ainult vanema eelvaateks)' }
];
