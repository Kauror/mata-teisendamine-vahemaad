import Link from 'next/link';

export const dynamic = 'force-static';

// Offline fallback shown only when a navigation fails and no cached shell exists.
export default function OfflinePage() {
  return (
    <main className="container" style={{ display: 'grid', gap: 16, placeItems: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div style={{ fontSize: 48 }} aria-hidden>📴</div>
      <h1>Võrguühendus puudub</h1>
      <p>Seda lehte ei ole veel võrguühenduseta salvestatud. Ava äpp korra internetiühendusega, siis töötab see ka hiljem ilma internetita.</p>
      <Link href="/" className="dashboard-history-link">Tagasi avalehele</Link>
    </main>
  );
}
