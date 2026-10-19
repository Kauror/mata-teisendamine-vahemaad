'use client';

import { useState, type ReactNode } from 'react';

// The question list on a result page opens on the mistakes, which is what a
// child looks back for; "Kõik" shows the right answers too. The cards are
// rendered by the page (also on the server) and only hidden here with CSS.
export default function ResultFilter({ wrongCount, total, children }: { wrongCount: number; total: number; children: ReactNode }) {
  const [onlyWrong, setOnlyWrong] = useState(wrongCount > 0);

  return (
    <>
      {wrongCount > 0 && wrongCount < total && (
        <div className='result-filter' role='group' aria-label='Näita'>
          <button type='button' aria-pressed={onlyWrong} onClick={() => setOnlyWrong(true)}>Valed vastused ({wrongCount})</button>
          <button type='button' aria-pressed={!onlyWrong} onClick={() => setOnlyWrong(false)}>Kõik ({total})</button>
        </div>
      )}
      <section className='result-list' data-only-wrong={onlyWrong && wrongCount < total}>{children}</section>
    </>
  );
}
