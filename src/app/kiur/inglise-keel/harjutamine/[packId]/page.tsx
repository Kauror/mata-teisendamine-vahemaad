import { redirect } from 'next/navigation';

// The old practice packs were removed long ago; an old bookmark lands on the
// English page instead of a dead end.
export default function RemovedPracticePage() {
  redirect('/kiur/inglise-keel');
}
