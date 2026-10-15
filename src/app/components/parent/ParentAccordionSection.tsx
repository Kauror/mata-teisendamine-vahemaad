'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

// The content mounts only once the section is opened, so a closed section's
// panel never loads its data. `keepMounted`: once opened, the content stays
// mounted (just hidden) when the section is closed, so work in progress — a
// half-done import, a half-edited form, opened history pages, library filters —
// is not thrown away by collapsing it.
export function ParentAccordionSection({ title, summary, open, onToggle, children, keepMounted = false }: { title: string; summary: string; open: boolean; onToggle: () => void; children: ReactNode; keepMounted?: boolean }) {
  const [opened, setOpened] = useState(open);
  useEffect(() => { if (open) setOpened(true); }, [open]);
  const mounted = open || (keepMounted && opened);
  return (
    <section className='parent-accordion-section'>
      <button type='button' className='parent-accordion-toggle' aria-expanded={open} onClick={onToggle}>
        <span>{title}</span>
        <strong>{summary}</strong>
      </button>
      {mounted && <div className='parent-accordion-content' hidden={!open}>{children}</div>}
    </section>
  );
}
