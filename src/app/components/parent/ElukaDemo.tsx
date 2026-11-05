'use client';

import { useEffect, useRef } from 'react';

// The pet room v8 art preview ("Eluka demo"). The room is a plain canvas
// script (public/eluka-demo/room8.js) drawn from the locked art pack; this
// component only gives it its markup and loads it. The script keeps all state
// in the tab: nothing is stored and no child data is read or written.
const MARKUP = `<h2 class="sr-only" style="position:absolute;left:-9999px">Pet rooms v8 for Kiur and Kirsi: the room starts centred on the egg, the egg can be dropped anywhere, a status bar with tooltips and the new Tarkus need, a message after exercises, a while-you-were-away card, the danger state, and the death and new-egg flow.</h2>
<div style="display:flex;flex-direction:column;gap:10px;padding:4px 0">
  <div id="times" style="display:flex;flex-wrap:wrap;gap:6px" role="group" aria-label="Kellaaeg"></div>
  <div id="events" style="display:flex;flex-wrap:wrap;gap:6px" role="group" aria-label="Juhtumid"></div>
  <div id="sim" style="display:flex;flex-wrap:wrap;gap:6px" role="group" aria-label="Aja simulatsioon"></div>
  <div id="rooms" style="display:flex;flex-wrap:wrap;gap:16px"></div>
  <div id="log" style="font-size:12px;color:var(--text-secondary);line-height:1.5"></div>
  <div style="font-size:12px;color:var(--text-secondary);line-height:1.5">Muna näidikud: üleval kolm vajadust – <b>leek</b> = soojus, <b>süda</b> = tuju, <b>öökull</b> = tarkus; all <b>muna</b> = kasv koorumiseni ja <b>kalender</b> = mitmes päev. Puuduta või hoia hiirt näidiku kohal, siis tuleb selgitus. Tarkus kasvab ainult harjutustest. Kui mõni vajadus on kaua tühi, on muna ohus ja võib lõpuks tähtede juurde minna.</div>
  <div style="font-size:13px;color:var(--text-secondary);margin-top:4px">Beebi näidikud pärast koorumist (kõht, tuju, tarkus; vanus, kaal):</div>
  <div id="babyhud" style="display:flex;flex-wrap:wrap;gap:16px"></div>
</div>`;

export default function ElukaDemo() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    node.innerHTML = MARKUP;
    const script = document.createElement('script');
    script.src = '/eluka-demo/room8.js?v=8';
    node.appendChild(script);
    // Leaving the page detaches the canvases, which stops the script's loops.
    return () => { node.innerHTML = ''; };
  }, []);
  return <div ref={host} className='eluka-demo' />;
}
