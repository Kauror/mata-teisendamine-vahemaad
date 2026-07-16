'use client';

import Link from 'next/link';

export type StudyTheme = { icon: string; label: string; onSelect: () => void };

// Shared decision screen shown before an exercise that has a study page. The
// child can start straight away or revise the material first — reading is
// optional and never required to begin. Some study pages (Loodusõpetus) also
// offer theme buttons that jump straight to a section.
export default function StudyEntryScreen({
  icon,
  title,
  intro,
  subIntro,
  themes,
  backHref,
  onStart,
  onLearn
}: {
  icon: string;
  title: string;
  intro: string;
  subIntro?: string;
  themes?: StudyTheme[];
  backHref: string;
  onStart: () => void;
  onLearn: () => void;
}) {
  return (
    <section className='study-entry-card'>
      <p className='study-eyebrow'>Õpi ja korda</p>
      <div className='study-entry-heading'>
        <span className='study-entry-icon' aria-hidden>{icon}</span>
        <h1>{title}</h1>
      </div>
      <p className='study-entry-intro'>{intro}</p>
      {subIntro ? <p className='study-entry-subintro'>{subIntro}</p> : null}
      {themes?.length ? (
        <div className='study-theme-grid'>
          {themes.map((theme) => (
            <button type='button' key={theme.label} className='study-theme-button' onClick={theme.onSelect}>
              <span aria-hidden>{theme.icon}</span> {theme.label}
            </button>
          ))}
        </div>
      ) : null}
      <div className='study-entry-actions'>
        <button type='button' className='study-primary-button' onClick={onStart}>Alusta harjutust</button>
        <button type='button' className='study-secondary-button' onClick={onLearn}>Õpi enne</button>
      </div>
      <Link className='study-back-link' href={backHref}>← Tagasi harjutuste juurde</Link>
    </section>
  );
}
