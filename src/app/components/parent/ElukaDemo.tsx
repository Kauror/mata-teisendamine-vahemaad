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
  interface Window {
    ELUKA?: { child: string; name: string; width: number; height: number; exitHref?: string };
    __pet?: { save: () => void };
  }
}

export default function ElukaDemo({ child }: { child: ElukaChild }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    let size = { width: 0, height: 0 };
    const mount = () => {
      node.innerHTML = MARKUP;
      size = { width: node.clientWidth, height: window.innerHeight - Math.max(0, node.getBoundingClientRect().top + window.scrollY) };
      // exitHref: the in-game way back to the app (the demo returns to the child picker).
      window.ELUKA = { child: child.id, name: child.name, exitHref: '/vanem/eluka-demo', ...size };
      const script = document.createElement('script');
      script.src = '/eluka-demo/pet.js?v=17';
      node.appendChild(script);
    };
    mount();
    // The game is sized once, so a turned phone draws it again at the new size (saved first). A
    // small height change (the browser's address bar sliding away) keeps the game as it is.
    let wait: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(wait);
      wait = setTimeout(() => {
        const height = window.innerHeight - Math.max(0, node.getBoundingClientRect().top + window.scrollY);
        if (Math.abs(node.clientWidth - size.width) < 2 && Math.abs(height - size.height) < size.height * 0.15) return;
        window.__pet?.save();
        mount();
      }, 250);
    };
    window.addEventListener('resize', onResize);
    // Leaving the page detaches the canvases, which stops the script's loops, timers and listeners.
    return () => {
      clearTimeout(wait);
      window.removeEventListener('resize', onResize);
      window.__pet?.save();
      node.innerHTML = '';
      document.documentElement.style.removeProperty('--eluka-hud');
    };
  }, [child]);
  return <div ref={host} className='eluka-demo' />;
}
