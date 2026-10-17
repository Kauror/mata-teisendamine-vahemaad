import Link from 'next/link';
import KaardimangApp from '@/app/components/kaardimang/KaardimangApp';
import { KAARDIMANG_CHILD_ENABLED } from '@/lib/kaardimang/api';

// Kiur's map game: every world part, its countries and capitals. Online only.
// While the game is in parent testing this page only says so.
export default function KaardimangPage() {
  if (!KAARDIMANG_CHILD_ENABLED) {
    return (
      <main className='tb-page km-page'>
        <section className='tb-shell'>
          <Link className='practice-back-button' href='/kiur/loodusopetus'>← Loodusõpetus</Link>
          <p className='km-preview-note'>Kaardimäng on veel testimisel. Varsti saad seda mängida!</p>
        </section>
      </main>
    );
  }
  return <KaardimangApp scope='child' backHref='/kiur/loodusopetus' backLabel='Loodusõpetus' />;
}
