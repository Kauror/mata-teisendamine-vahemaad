import Link from 'next/link';
import ParentHub from '@/app/components/ParentHub';
import ParentLogin from '@/app/components/ParentLogin';
import { hasParentSession, isParentPasswordConfigured } from '@/lib/parentAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function ParentPage() {
  const configured = isParentPasswordConfigured();
  const signedIn = await hasParentSession();

  return (
    <main className='parent-page'>
      <div className='parent-shell'>
        <Link className='subject-back-button' href='/'>← Rollivalik</Link>
        {configured && signedIn ? <ParentHub /> : <ParentLogin passwordMissing={!configured} />}
      </div>
    </main>
  );
}
