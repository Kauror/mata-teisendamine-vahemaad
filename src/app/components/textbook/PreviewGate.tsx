import Link from 'next/link';
import type { ReactNode } from 'react';
import { hasParentSession } from '@/lib/parentAuth';

// Server-side guard for the parent preview pages. The preview API refuses
// anyone without a parent session anyway; this only spares the page from
// rendering a preview it could never load.
export default async function PreviewGate({ children }: { children: ReactNode }) {
  if (await hasParentSession()) return <>{children}</>;
  return (
    <main className='tb-page' data-scope='preview'>
      <section className='tb-shell'>
        <div className='tb-problem' role='alert'>
          <p>Eelvaade on ainult lapsevanemale. Logi enne vanema alasse sisse.</p>
          <div className='tb-actions'>
            <Link className='tb-button tb-button-primary' href='/vanem'>Ava vanema ala</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
