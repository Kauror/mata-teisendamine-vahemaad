import Link from 'next/link';
import ParentHub from '@/app/components/ParentHub';
import ParentLogin from '@/app/components/ParentLogin';
import type { ParentHaldaTab, ParentView } from '@/app/components/parent/views';
import { hasParentSession, isParentPasswordConfigured } from '@/lib/parentAuth';

// Täna, Halda and Seaded share one gate: the password form until the parent
// is signed in. The form reloads the page, so the parent lands where they
// were going.
export default async function ParentAreaPage({ view, tab }: { view: ParentView; tab?: ParentHaldaTab }) {
  const configured = isParentPasswordConfigured();
  const signedIn = await hasParentSession();

  return (
    <main className='parent-page' data-signed-in={configured && signedIn}>
      <div className='parent-shell'>
        {configured && signedIn ? <ParentHub view={view} tab={tab} /> : (
          <>
            <Link className='subject-back-button' href='/'>← Esilehele</Link>
            <ParentLogin passwordMissing={!configured} />
          </>
        )}
      </div>
    </main>
  );
}
