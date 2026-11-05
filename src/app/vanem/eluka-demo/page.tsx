import Link from 'next/link';
import ElukaDemo from '@/app/components/parent/ElukaDemo';
import PreviewGate from '@/app/components/textbook/PreviewGate';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Eluka demo: the pet room art preview, for the parent only until the pet goes
// live for the children. It reads and writes nothing.
export default async function ElukaDemoPage() {
  return (
    <PreviewGate>
      <main className='eluka-page'>
        <div className='eluka-shell'>
          <Link className='eluka-back' href='/vanem/seaded'>← Seaded</Link>
          <h1>Eluka demo</h1>
          <p className='eluka-note'>Lemmiklooma toa proov (v8). Lapsed seda ei näe ja midagi ei salvestata – lehe uuesti avamine alustab otsast.</p>
          <ElukaDemo />
        </div>
      </main>
    </PreviewGate>
  );
}
