import Link from 'next/link';
import { notFound } from 'next/navigation';
import ElukaDemo from '@/app/components/parent/ElukaDemo';
import { elukaChild } from '@/app/components/parent/elukaChildren';
import PreviewGate from '@/app/components/textbook/PreviewGate';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// One child's pet page, as the child will see it once the pet goes live.
export default async function ElukaChildPage({ params }: { params: Promise<{ child: string }> }) {
  const child = elukaChild((await params).child);
  if (!child) notFound();
  return (
    <PreviewGate>
      <main className='eluka-page' data-child={child.id}>
        <div className='eluka-shell eluka-shell-child'>
          <Link className='eluka-back' href='/vanem/eluka-demo'>← Eluka demo</Link>
          <h1>{child.title}</h1>
          <ElukaDemo child={child} />
        </div>
      </main>
    </PreviewGate>
  );
}
