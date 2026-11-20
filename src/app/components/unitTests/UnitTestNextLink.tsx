'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { ChildVocabularyHome } from '@/lib/server/vocabulary/overview';
import { VOCAB_HOME_ROUTE } from '@/lib/vocabulary/constants';

// Shown on the words test's "passed" screen: the next step is the unit's
// workbook test, when it has one and it is not done yet.
export function UnitTestNextLink({ unitId }: { unitId: string }) {
  const [state, setState] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    void fetch('/api/english/units', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() as Promise<ChildVocabularyHome> : null))
      .then((home) => {
        if (cancelled || !home) return;
        setState(home.units.find((card) => card.id === unitId)?.unitTest?.state ?? null);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [unitId]);
  if (state !== 'available' && state !== 'in_progress' && state !== 'returned' && state !== 'retake') return null;
  return (
    <div className='ut-next' role='status'>
      <p><strong>Nüüd on avatud lisatest.</strong> See on õpiku test selle õppetüki kohta. Osa vastuseid vaatab üle vanem.</p>
      <Link className='start-button vocab-start-link' href={`${VOCAB_HOME_ROUTE}/${unitId}/lisatest`}>{state === 'in_progress' ? 'Jätka lisatesti' : state === 'returned' ? 'Paranda lisatest' : 'Tee lisatest'}</Link>
    </div>
  );
}
