'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LocalResultContent from '@/app/tulemus/LocalResultContent';

function ResultFromQuery() {
  const params = useSearchParams();
  return <LocalResultContent clientId={params.get('clientId')} />;
}

export default function LocalResultPage() {
  return (
    <Suspense fallback={<main className='container'><section className='question-card'>Laadin tulemust…</section></main>}>
      <ResultFromQuery />
    </Suspense>
  );
}
