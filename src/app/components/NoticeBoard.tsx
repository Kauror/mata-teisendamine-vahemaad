'use client';

import { useEffect, useState } from 'react';

export default function NoticeBoard() {
  const [text, setText] = useState('');

  useEffect(() => {
    fetch('/api/notice')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setText(typeof data?.text === 'string' ? data.text : ''))
      .catch(() => setText(''));
  }, []);

  if (!text.trim()) return null;

  return (
    <section className='noticeboard' aria-label='Teated ja reeglid'>
      <h2 className='noticeboard-title'>📌 Teated ja reeglid</h2>
      <div className='noticeboard-text'>{text}</div>
    </section>
  );
}
