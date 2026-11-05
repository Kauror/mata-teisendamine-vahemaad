'use client';

import { useEffect, useRef } from 'react';
import type { ElukaChild } from '@/app/components/parent/elukaChildren';

// Eluka demo: the pet page as the child will see it later. The room is a plain
// canvas script (public/eluka-demo/pet.js) drawn from the locked art pack; this
// component gives it its markup and its settings, then loads it. The pet is
// saved only in this browser; the script reads the child's exercise history
// (GET, parent session) and writes nothing to the server.
const MARKUP = `
<div id="rooms" class="eluka-rooms"></div>
<details class="eluka-tools">
  <summary>Testimise nupud (ainult demos)</summary>
  <p class="eluka-tools-label">Kellaaeg</p>
  <div id="times" class="eluka-row" role="group" aria-label="Kellaaeg"></div>
  <p class="eluka-tools-label">Juhtumid</p>
  <div id="events" class="eluka-row" role="group" aria-label="Juhtumid"></div>
  <p class="eluka-tools-label">Aeg ja harjutused</p>
  <div id="sim" class="eluka-row" role="group" aria-label="Aeg ja harjutused"></div>
  <div id="log" class="eluka-log"></div>
</details>`;

declare global {
  interface Window { ELUKA?: { child: string; name: string; width: number; height: number } }
}

export default function ElukaDemo({ child }: { child: ElukaChild }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    node.innerHTML = MARKUP;
    window.ELUKA = { child: child.id, name: child.name, width: node.clientWidth, height: window.innerHeight - Math.max(0, node.getBoundingClientRect().top + window.scrollY) };
    const script = document.createElement('script');
    script.src = '/eluka-demo/pet.js?v=11';
    node.appendChild(script);
    // Leaving the page detaches the canvases, which stops the script's loops and timers.
    return () => { node.innerHTML = ''; };
  }, [child]);
  return <div ref={host} className='eluka-demo' />;
}
