'use client';

import { useEffect, useState } from 'react';
import { NOTICE_URL } from '@/lib/childPageData';

export default function NoticeBoard() {
  const [text, setText] = useState('');

  useEffect(() => {
    // The child pages preload this exact URL (childPageData.ts).
    fetch(NOTICE_URL)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setText(typeof data?.text === 'string' ? data.text : ''))
      .catch(() => setText(''));
  }, []);

  if (!text.trim()) return null;

  return (
    <section className='noticeboard' aria-label='Teated ja reeglid'>
      <details>
        <summary className='noticeboard-title'>📌 Teated ja reeglid</summary>
        <div className='noticeboard-text'>{text}</div>
      </details>
    </section>
  );
}
