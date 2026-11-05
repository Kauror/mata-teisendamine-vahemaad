import Link from 'next/link';
import { ELUKA_CHILDREN } from '@/app/components/parent/elukaChildren';
import PreviewGate from '@/app/components/textbook/PreviewGate';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Eluka demo: pick a child and see their pet page the way they will see it,
// for the parent only until the pet goes live for the children.
export default async function ElukaDemoPage() {
  return (
    <PreviewGate>
      <main className='eluka-page'>
        <div className='eluka-shell'>
          <Link className='eluka-back' href='/vanem/seaded'>← Seaded</Link>
          <h1>Eluka demo</h1>
          <p className='eluka-note'>Vali laps ja näed tema lemmiklooma lehte nii, nagu ta seda hiljem näeb. Lapsed seda veel ei näe.</p>
          <div className='eluka-pick'>
            {ELUKA_CHILDREN.map((child) => (
              <Link key={child.id} className='eluka-pick-child' data-child={child.id} href={`/vanem/eluka-demo/${child.id}`}>{child.name}</Link>
            ))}
          </div>
          <p className='eluka-note'>Muna elab päris ajas ja salvestub ainult selles brauseris. Tarkus kasvab lapse päris harjutustest; demo ei muuda tema tähti ega tulemusi.</p>
        </div>
      </main>
    </PreviewGate>
  );
}
