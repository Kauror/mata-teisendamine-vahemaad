'use client';

import { useEffect, useState } from 'react';
import { NOTICE_URL } from '@/lib/childPageData';

type PointsRuleSection = { id: string; title: string; lines: string[] };

// The parent's notice text, and under it "Mille eest tärne saab": a list the
// server builds from the live settings (/api/points-rules), so it changes by
// itself when the parent adds a task, a streak rule or changes the points.
export default function NoticeBoard() {
  const [text, setText] = useState('');
  const [rules, setRules] = useState<PointsRuleSection[]>([]);

  useEffect(() => {
    // The child pages preload this exact URL (childPageData.ts).
    fetch(NOTICE_URL)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setText(typeof data?.text === 'string' ? data.text : ''))
      .catch(() => setText(''));
    fetch('/api/points-rules', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setRules(Array.isArray(data?.sections) ? data.sections as PointsRuleSection[] : []))
      .catch(() => setRules([]));
  }, []);

  if (!text.trim() && rules.length === 0) return null;

  return (
    <section className='noticeboard' aria-label='Teated ja reeglid'>
      {text.trim() ? (
        <details>
          <summary className='noticeboard-title'>📌 Teated ja reeglid</summary>
          <div className='noticeboard-text'>{text}</div>
        </details>
      ) : null}
      {rules.length > 0 ? (
        <details className='noticeboard-points'>
          <summary className='noticeboard-title'>⭐ Mille eest tärne saab</summary>
          <div className='noticeboard-points-body'>
            {rules.map((section) => (
              <div key={section.id} className='noticeboard-points-section'>
                <p className='noticeboard-points-heading'>{section.title}</p>
                <ul>
                  {section.lines.map((line) => <li key={line}>{line}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </section>
  );
}
