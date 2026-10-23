import Link from 'next/link';
import KaardimangApp from '@/app/components/kaardimang/KaardimangApp';
import { KAARDIMANG_CHILD_ENABLED } from '@/lib/kaardimang/api';

// Kirsi's map game: the same game as Kiur's, at her own level (the parent sets it).
export default function KirsiKaardimangPage() {
  if (!KAARDIMANG_CHILD_ENABLED) {
    return (
      <main className='tb-page km-page'>
        <section className='tb-shell'>
          <Link className='practice-back-button' href='/kirsi'>← Kirsi</Link>
          <p className='km-preview-note'>Kaardimäng on veel testimisel. Varsti saad seda mängida!</p>
        </section>
      </main>
    );
  }
  return <KaardimangApp scope='child' player='kirsi' backHref='/kirsi' backLabel='Kirsi' />;
}
