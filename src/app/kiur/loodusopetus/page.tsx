import Link from 'next/link';

// Kiur's Loodusõpetus is the textbook course. The old mixed exercise
// (/kiur/loodusopetus/test) is archived, see FIXED_CHILD_EXERCISES.
export default function LoodusopetusSetupPage() {
  return (
    <main className='test-page'>
      <section className='test-shell science-setup-shell'>
        <Link className='practice-back-button' href='/kiur'>← Aine valik</Link>

        <section className='question-card science-setup-card'>
          <h1 className='question-text'>🔬 Loodusõpetus</h1>
        </section>

        {/* Kiur's textbook course (online only). This page is Kiur's, so Kirsi never sees it. */}
        <Link className='tb-entry-card' href='/kiur/loodusopetus/opik'>
          <span className='tb-entry-icon' aria-hidden>📖</span>
          <span className='tb-entry-copy'>
            <strong>Õpiku õppetükid</strong>
            <small>Loe, harjuta ja tee test. Vajab internetiühendust.</small>
          </span>
          <span className='tb-entry-arrow' aria-hidden>→</span>
        </Link>
      </section>
    </main>
  );
}
