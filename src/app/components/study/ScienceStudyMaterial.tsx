'use client';

import { MemoryRule } from '@/app/components/study/StudyPrimitives';

// Visual revision material for "Loodusõpetus". Six themes, each with a section
// anchor so the entry screen's theme buttons can jump straight to it. Graphics
// are simple, labelled, child-friendly SVGs (no external assets). Not scored.

const INK = '#0f172a';
const SUN = '#f59e0b';

/* ---------------- Maailmaruum ---------------- */

function SolarSystemGraphic() {
  return (
    <svg className='study-svg' viewBox='0 0 320 200' role='img' aria-label='Päike, Maa ja Kuu: Maa tiirleb ümber Päikese, Kuu ümber Maa'>
      <circle cx='45' cy='100' r='28' fill={SUN} stroke='#d97706' strokeWidth='2' />
      <text x='45' y='150' fontSize='12' fontWeight='700' fill={INK} textAnchor='middle'>Päike on täht</text>
      <ellipse cx='45' cy='100' rx='185' ry='78' fill='none' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='5 5' />
      <text x='150' y='16' fontSize='11' fill='#64748b'>orbiit</text>
      <circle cx='222' cy='58' r='12' fill='#3b82f6' stroke='#1d4ed8' strokeWidth='2' />
      <text x='222' y='40' fontSize='12' fontWeight='700' fill={INK} textAnchor='middle'>Maa on planeet</text>
      <circle cx='222' cy='58' r='26' fill='none' stroke='#cbd5e1' strokeWidth='1.2' strokeDasharray='3 3' />
      <circle cx='248' cy='58' r='6' fill='#e2e8f7' stroke='#64748b' strokeWidth='1.5' />
      <text x='272' y='84' fontSize='11' fontWeight='700' fill={INK}>Kuu on Maa kaaslane</text>
    </svg>
  );
}

function RotationGraphic() {
  return (
    <svg className='study-svg study-svg-half' viewBox='0 0 160 170' role='img' aria-label='Maa pöörleb ümber telje: ühel küljel päev, teisel öö'>
      <clipPath id='earthClip'><circle cx='80' cy='85' r='48' /></clipPath>
      <g clipPath='url(#earthClip)'>
        <rect x='32' y='37' width='48' height='96' fill='#fde68a' />
        <rect x='80' y='37' width='48' height='96' fill='#1e293b' />
      </g>
      <circle cx='80' cy='85' r='48' fill='none' stroke='#2563eb' strokeWidth='3' />
      <line x1='80' y1='24' x2='80' y2='146' stroke={INK} strokeWidth='2' strokeDasharray='4 3' />
      <path d='M112 52 A40 40 0 0 1 112 118' fill='none' stroke='#16a34a' strokeWidth='2' markerEnd='url(#rot)' />
      <text x='52' y='89' fontSize='12' fontWeight='800' fill='#92400e' textAnchor='middle'>päev</text>
      <text x='108' y='89' fontSize='12' fontWeight='800' fill='#e2e8f0' textAnchor='middle'>öö</text>
      <defs><marker id='rot' markerWidth='8' markerHeight='8' refX='4' refY='6' orient='auto'><path d='M1 1 L4 6 L7 1' fill='none' stroke='#16a34a' strokeWidth='1.5' /></marker></defs>
    </svg>
  );
}

function RevolutionGraphic() {
  return (
    <svg className='study-svg study-svg-half' viewBox='0 0 180 170' role='img' aria-label='Maa tiirleb ümber Päikese, üks tiir kestab ühe aasta'>
      <ellipse cx='90' cy='85' rx='72' ry='58' fill='none' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='5 5' />
      <circle cx='90' cy='85' r='22' fill={SUN} stroke='#d97706' strokeWidth='2' />
      <circle cx='162' cy='85' r='10' fill='#3b82f6' stroke='#1d4ed8' strokeWidth='2' />
      <path d='M150 30 A66 52 0 0 1 168 62' fill='none' stroke='#16a34a' strokeWidth='2' markerEnd='url(#rev)' />
      <text x='90' y='160' fontSize='12' fontWeight='800' fill={INK} textAnchor='middle'>1 tiir = 1 aasta</text>
      <defs><marker id='rev' markerWidth='8' markerHeight='8' refX='6' refY='4' orient='auto'><path d='M1 1 L6 4 L1 7' fill='none' stroke='#16a34a' strokeWidth='1.5' /></marker></defs>
    </svg>
  );
}

const PLANETS = [
  { name: 'Merkuur', c: '#9ca3af', r: 8 },
  { name: 'Veenus', c: '#e0b978', r: 12 },
  { name: 'Maa', c: '#3b82f6', r: 12 },
  { name: 'Marss', c: '#c1440e', r: 10 },
  { name: 'Jupiter', c: '#d9a066', r: 22 },
  { name: 'Saturn', c: '#e3c07b', r: 19 },
  { name: 'Uraan', c: '#7dd3fc', r: 15 },
  { name: 'Neptuun', c: '#3b6fd4', r: 15 }
];

function PlanetStripGraphic() {
  return (
    <div className='study-scroll-x'>
      <svg viewBox='0 0 760 90' role='img' aria-label='Planeedid Päikesest alates: Merkuur, Veenus, Maa, Marss, Jupiter, Saturn, Uraan, Neptuun' style={{ minWidth: 640, height: 90 }}>
        <circle cx='24' cy='45' r='20' fill={SUN} stroke='#d97706' strokeWidth='2' />
        {PLANETS.map((planet, i) => {
          const x = 110 + i * 82;
          return (
            <g key={planet.name}>
              <circle cx={x} cy='40' r={planet.r} fill={planet.c} stroke='#334155' strokeWidth='1' />
              {planet.name === 'Saturn' ? <ellipse cx={x} cy='40' rx={planet.r + 8} ry='4' fill='none' stroke='#a8843f' strokeWidth='2' /> : null}
              <text x={x} y='82' fontSize='12' fontWeight='700' fill={INK} textAnchor='middle'>{planet.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ---------------- Maa ja kaart ---------------- */

function CompassGraphic() {
  return (
    <svg className='study-svg study-svg-half' viewBox='0 0 180 180' role='img' aria-label='Ilmakaared: põhi üleval, lõuna all, ida paremal, lääs vasakul'>
      <line x1='90' y1='30' x2='90' y2='150' stroke='#2563eb' strokeWidth='3' markerStart='url(#cn)' markerEnd='url(#cs)' />
      <line x1='30' y1='90' x2='150' y2='90' stroke='#16a34a' strokeWidth='3' markerStart='url(#cw)' markerEnd='url(#ce)' />
      <text x='90' y='22' fontSize='13' fontWeight='800' fill={INK} textAnchor='middle'>PÕHI</text>
      <text x='90' y='170' fontSize='13' fontWeight='800' fill={INK} textAnchor='middle'>LÕUNA</text>
      <text x='158' y='94' fontSize='13' fontWeight='800' fill={INK}>IDA</text>
      <text x='22' y='94' fontSize='13' fontWeight='800' fill={INK} textAnchor='end'>LÄÄS</text>
      <defs>
        <marker id='cn' markerWidth='10' markerHeight='10' refX='5' refY='2' orient='auto'><path d='M1 8 L5 1 L9 8' fill='#2563eb' /></marker>
        <marker id='cs' markerWidth='10' markerHeight='10' refX='5' refY='8' orient='auto'><path d='M1 2 L5 9 L9 2' fill='#2563eb' /></marker>
        <marker id='ce' markerWidth='10' markerHeight='10' refX='8' refY='5' orient='auto'><path d='M2 1 L9 5 L2 9' fill='#16a34a' /></marker>
        <marker id='cw' markerWidth='10' markerHeight='10' refX='2' refY='5' orient='auto'><path d='M8 1 L1 5 L8 9' fill='#16a34a' /></marker>
      </defs>
    </svg>
  );
}

function GlobeMapGraphic() {
  return (
    <svg className='study-svg study-svg-half' viewBox='0 0 200 150' role='img' aria-label='Gloobus on Maa ümar mudel, kaart kujutab Maad tasapinnal'>
      <circle cx='55' cy='75' r='42' fill='#dbeafe' stroke='#2563eb' strokeWidth='2.5' />
      <path d='M13 75 H97 M55 33 V117' fill='none' stroke='#93c5fd' strokeWidth='1' />
      <ellipse cx='55' cy='75' rx='20' ry='42' fill='none' stroke='#93c5fd' strokeWidth='1' />
      <path d='M40 60 q10 -8 20 2 q8 8 -2 14 q-14 6 -18 -6 z' fill='#86efac' stroke='#16a34a' strokeWidth='1' />
      <text x='55' y='134' fontSize='12' fontWeight='700' fill={INK} textAnchor='middle'>gloobus</text>
      <rect x='118' y='40' width='70' height='70' rx='6' fill='#dbeafe' stroke='#2563eb' strokeWidth='2.5' />
      <path d='M132 60 q12 -6 22 4 q6 10 -6 16 q-16 4 -18 -8 z' fill='#86efac' stroke='#16a34a' strokeWidth='1' />
      <text x='153' y='128' fontSize='12' fontWeight='700' fill={INK} textAnchor='middle'>kaart</text>
    </svg>
  );
}

function EstoniaMapGraphic() {
  return (
    <svg className='study-svg' viewBox='0 0 260 180' role='img' aria-label='Eesti asub Läänemere ääres, naabrid on Läti ja Venemaa'>
      <rect x='0' y='0' width='260' height='180' fill='#dbeafe' />
      <text x='40' y='150' fontSize='12' fontWeight='700' fill='#1d4ed8'>Läänemeri</text>
      <path d='M70 60 q40 -20 90 -6 q30 8 34 40 q-6 34 -50 40 q-60 6 -78 -20 q-10 -34 4 -54 z' fill='#bbf7d0' stroke='#16a34a' strokeWidth='2' />
      <circle cx='120' cy='92' r='6' fill='#dc2626' />
      <text x='120' y='82' fontSize='13' fontWeight='800' fill={INK} textAnchor='middle'>Eesti</text>
      <text x='210' y='120' fontSize='11' fontWeight='700' fill={INK}>Venemaa</text>
      <text x='120' y='158' fontSize='11' fontWeight='700' fill={INK} textAnchor='middle'>Läti</text>
    </svg>
  );
}

function EarthLayersGraphic() {
  return (
    <svg className='study-svg' viewBox='0 0 220 190' role='img' aria-label='Maa kihid väljast sissepoole: maakoor, vahevöö, tuum'>
      <circle cx='95' cy='95' r='80' fill='#a16207' stroke='#78350f' strokeWidth='2' />
      <circle cx='95' cy='95' r='55' fill='#ea580c' />
      <circle cx='95' cy='95' r='26' fill='#dc2626' />
      <line x1='95' y1='15' x2='205' y2='30' stroke={INK} strokeWidth='1' /><text x='150' y='28' fontSize='12' fontWeight='700' fill={INK}>maakoor</text>
      <line x1='120' y1='60' x2='205' y2='95' stroke={INK} strokeWidth='1' /><text x='150' y='98' fontSize='12' fontWeight='700' fill={INK}>vahevöö</text>
      <line x1='95' y1='95' x2='205' y2='160' stroke='#ffffff' strokeWidth='1' /><text x='160' y='163' fontSize='12' fontWeight='700' fill={INK}>tuum</text>
    </svg>
  );
}

function VolcanoGraphic() {
  return (
    <svg className='study-svg' viewBox='0 0 240 190' role='img' aria-label='Vulkaani läbilõige: magma Maa sees, laava pinnal, kraater tipus, tuhk ja gaasid'>
      <rect x='0' y='120' width='240' height='70' fill='#d6c3a5' />
      <polygon points='120,40 30,150 210,150' fill='#8b6f4e' stroke='#5b4633' strokeWidth='2' />
      <path d='M112 42 L128 42 L150 150 L90 150 Z' fill='#dc2626' opacity='0.85' />
      <ellipse cx='120' cy='150' rx='60' ry='8' fill='#dc2626' opacity='0.7' />
      <path d='M116 40 q-6 -18 6 -26 q10 8 4 26' fill='#9ca3af' opacity='0.7' />
      <text x='120' y='30' fontSize='12' fontWeight='700' fill={INK} textAnchor='middle'>kraater</text>
      <text x='185' y='150' fontSize='12' fontWeight='800' fill='#b91c1c'>laava</text>
      <text x='120' y='178' fontSize='12' fontWeight='800' fill='#7f1d1d' textAnchor='middle'>magma (Maa sees)</text>
    </svg>
  );
}

/* ---------------- Vesi ja ilm ---------------- */

function WaterCycleGraphic() {
  return (
    <svg className='study-svg' viewBox='0 0 240 200' role='img' aria-label='Veeringe: veekogu, aurumine, pilv, sademed, tagasi veekogusse'>
      <ellipse cx='120' cy='168' rx='90' ry='18' fill='#60a5fa' stroke='#2563eb' strokeWidth='2' />
      <text x='120' y='173' fontSize='12' fontWeight='800' fill='#0b1b45' textAnchor='middle'>veekogu</text>
      <path d='M180 60 q28 6 24 30 q-4 20 -30 20 q-40 2 -40 -22 q0 -22 30 -26 q10 -20 16 -2 z' fill='#e2e8f0' stroke='#94a3b8' strokeWidth='2' />
      <text x='168' y='72' fontSize='12' fontWeight='700' fill={INK}>pilv</text>
      <path d='M62 150 C40 110 44 78 78 62' fill='none' stroke='#16a34a' strokeWidth='2.5' markerEnd='url(#wc)' />
      <text x='30' y='104' fontSize='11' fontWeight='700' fill='#16a34a'>aurumine</text>
      <line x1='150' y1='108' x2='150' y2='150' stroke='#2563eb' strokeWidth='2.5' markerEnd='url(#wc2)' />
      <line x1='170' y1='108' x2='170' y2='150' stroke='#2563eb' strokeWidth='2.5' markerEnd='url(#wc2)' />
      <text x='196' y='134' fontSize='11' fontWeight='700' fill='#2563eb'>sademed</text>
      <defs>
        <marker id='wc' markerWidth='9' markerHeight='9' refX='4' refY='2' orient='auto'><path d='M1 8 L4 1 L8 8' fill='#16a34a' /></marker>
        <marker id='wc2' markerWidth='9' markerHeight='9' refX='4' refY='7' orient='auto'><path d='M1 1 L4 8 L8 1' fill='#2563eb' /></marker>
      </defs>
    </svg>
  );
}

function WeatherCardGraphic() {
  return (
    <div className='study-weather-card'>
      <span className='study-weather-icon' aria-hidden>⛅</span>
      <div className='study-weather-rows'>
        <span><strong>12 °C</strong> temperatuur</span>
        <span><strong>tuul 6 m/s</strong></span>
        <span><strong>vihm 4 mm</strong></span>
        <span><strong>poolpilves</strong></span>
      </div>
    </div>
  );
}

/* ---------------- Elusloodus ---------------- */

function PlantGraphic() {
  return (
    <svg className='study-svg' viewBox='0 0 220 220' role='img' aria-label='Taime osad: juur, vars, leht, õis, vili'>
      <rect x='0' y='160' width='220' height='60' fill='#e7d3b3' />
      <path d='M110 160 L104 200 M110 160 L118 202 M110 160 L92 196 M110 160 L128 194' stroke='#a16207' strokeWidth='2' fill='none' />
      <line x1='110' y1='60' x2='110' y2='160' stroke='#16a34a' strokeWidth='5' />
      <path d='M110 120 q-40 -10 -46 -34 q34 -4 46 20 z' fill='#22c55e' stroke='#15803d' strokeWidth='1.5' />
      <path d='M110 100 q40 -10 46 -34 q-34 -4 -46 20 z' fill='#22c55e' stroke='#15803d' strokeWidth='1.5' />
      <circle cx='110' cy='52' r='16' fill='#f472b6' stroke='#be185d' strokeWidth='2' />
      <circle cx='150' cy='96' r='9' fill='#ef4444' stroke='#b91c1c' strokeWidth='1.5' />
      <text x='150' y='188' fontSize='12' fontWeight='700' fill={INK}>juur</text>
      <text x='150' y='140' fontSize='12' fontWeight='700' fill={INK}>vars</text>
      <text x='18' y='96' fontSize='12' fontWeight='700' fill={INK}>leht</text>
      <text x='110' y='24' fontSize='12' fontWeight='700' fill={INK} textAnchor='middle'>õis</text>
      <text x='168' y='98' fontSize='12' fontWeight='700' fill={INK}>vili</text>
    </svg>
  );
}

function FoodChainGraphic() {
  return (
    <div className='study-foodchain' role='img' aria-label='Toiduahel: rohi, jänes, rebane; nool liigub toidult sööja poole'>
      <span><span className='study-foodchain-emoji' aria-hidden>🌱</span>rohi</span>
      <span className='study-foodchain-arrow' aria-hidden>→</span>
      <span><span className='study-foodchain-emoji' aria-hidden>🐇</span>jänes</span>
      <span className='study-foodchain-arrow' aria-hidden>→</span>
      <span><span className='study-foodchain-emoji' aria-hidden>🦊</span>rebane</span>
    </div>
  );
}

/* ---------------- Inimene ja tervis ---------------- */

function HumanBodyGraphic() {
  return (
    <svg className='study-svg' viewBox='0 0 200 230' role='img' aria-label='Inimese keha: aju, kopsud, süda, magu'>
      <circle cx='100' cy='34' r='24' fill='#fde2c8' stroke='#c2764a' strokeWidth='2' />
      <path d='M70 66 q30 -12 60 0 l6 90 q-36 12 -72 0 z' fill='#fde2c8' stroke='#c2764a' strokeWidth='2' />
      <ellipse cx='100' cy='30' rx='13' ry='10' fill='#f9a8d4' opacity='0.8' />
      <ellipse cx='84' cy='98' rx='11' ry='16' fill='#bfdbfe' opacity='0.9' />
      <ellipse cx='116' cy='98' rx='11' ry='16' fill='#bfdbfe' opacity='0.9' />
      <path d='M100 92 l10 8 l-10 12 l-10 -12 z' fill='#f87171' />
      <ellipse cx='100' cy='134' rx='16' ry='12' fill='#fca5a5' opacity='0.9' />
      <line x1='124' y1='30' x2='170' y2='24' stroke={INK} strokeWidth='1' /><text x='172' y='27' fontSize='12' fontWeight='700' fill={INK}>aju</text>
      <line x1='72' y1='98' x2='24' y2='90' stroke={INK} strokeWidth='1' /><text x='4' y='93' fontSize='12' fontWeight='700' fill={INK}>kopsud</text>
      <line x1='110' y1='104' x2='170' y2='108' stroke={INK} strokeWidth='1' /><text x='172' y='111' fontSize='12' fontWeight='700' fill={INK}>süda</text>
      <line x1='100' y1='138' x2='24' y2='150' stroke={INK} strokeWidth='1' /><text x='4' y='153' fontSize='12' fontWeight='700' fill={INK}>magu</text>
    </svg>
  );
}

/* ---------------- Uurimine ja andmed ---------------- */

function PlantTableGraphic() {
  return (
    <div className='study-scroll-x'>
      <table className='study-table'>
        <thead><tr><th>Taim</th><th>Tingimus</th><th>Kasv 7 päevaga</th></tr></thead>
        <tbody>
          <tr><td>A</td><td>valguses</td><td>6 cm</td></tr>
          <tr><td>B</td><td>pimedas</td><td>1 cm</td></tr>
        </tbody>
      </table>
    </div>
  );
}

export default function ScienceStudyMaterial() {
  return (
    <div className='study-material'>
      <header className='study-material-header'>
        <span className='study-material-icon' aria-hidden>🔬</span>
        <div>
          <h2>Loodusõpetus</h2>
          <p>Kordame enne harjutamist üle kõige tähtsamad teadmised.</p>
        </div>
      </header>

      {/* ---- 1. Maailmaruum ---- */}
      <section className='study-theme' id='teema-maailmaruum'>
        <h2 className='study-theme-title'><span aria-hidden>🌌</span> Maailmaruum</h2>

        <div className='study-section'>
          <h3>Päike, planeedid ja kuud</h3>
          <div className='study-def-list'>
            <p><strong>Päike</strong> — Päike on täht. Täht kiirgab ise valgust ja soojust. Päike annab Maale valgust ja soojust.</p>
            <p><strong>Planeet</strong> — Planeet tiirleb ümber tähe ega tee ise valgust. Planeet paistab, sest peegeldab tähe valgust. Maa on Päikesest kolmas planeet.</p>
            <p><strong>Kuu</strong> — Kuu on planeedi kaaslane. Meie Kuu tiirleb ümber Maa. Kuu ei tee ise valgust — me näeme Kuud, sest see peegeldab Päikese valgust.</p>
            <p><strong>Orbiit</strong> — Orbiit on keha liikumistee teise keha ümber.</p>
          </div>
          <div className='study-graphic'><SolarSystemGraphic /></div>
        </div>

        <div className='study-section'>
          <h3>Pöörlemine ja tiirlemine</h3>
          <div className='study-def-list'>
            <p><strong>Pöörlemine</strong> — keerlemine ümber oma telje. Maa pöörlemine põhjustab päeva ja öö vaheldumise. Päikese poole pööratud küljel on päev, eemale pööratud küljel öö.</p>
            <p><strong>Tiirlemine</strong> — liikumine ümber teise keha. Maa tiirleb ümber Päikese, Kuu ümber Maa. Maa üks tiir ümber Päikese kestab ühe aasta.</p>
            <p><strong>Aastaajad</strong> — tekivad Maa telje kalde ja Maa ümber Päikese tiirlemise tõttu. Suvel langeb päikesevalgus meie piirkonnale otsesemalt ja päevad on pikemad.</p>
          </div>
          <div className='study-two-graphics'>
            <div className='study-graphic'><RotationGraphic /><span className='study-graphic-caption'>Maa pöörleb</span></div>
            <div className='study-graphic'><RevolutionGraphic /><span className='study-graphic-caption'>Maa tiirleb</span></div>
          </div>
          <MemoryRule>Pöörlemine toimub ümber oma telje. Tiirlemine toimub ümber teise keha.</MemoryRule>
        </div>

        <div className='study-section'>
          <h3>Planeetide järjekord</h3>
          <p>Planeedid Päikesest alates:</p>
          <p className='study-formula study-formula-wide'>Merkuur – Veenus – Maa – Marss – Jupiter – Saturn – Uraan – Neptuun</p>
          <PlanetStripGraphic />
          <div className='study-def-list'>
            <p>Merkuur on Päikesele lähim planeet.</p>
            <p>Maa on kolmas planeet.</p>
            <p>Saturn on tuntud oma rõngaste poolest.</p>
          </div>
        </div>

        <div className='study-section'>
          <h3>Kuu faasid</h3>
          <p>Kuu nähtav valgustatud osa muutub. Neid muutusi nimetatakse Kuu faasideks.</p>
          <div className='study-emoji-grid'>
            <div className='study-emoji-card'><span aria-hidden>🌑</span><strong>noorkuu</strong></div>
            <div className='study-emoji-card'><span aria-hidden>🌓</span><strong>poolkuu</strong></div>
            <div className='study-emoji-card'><span aria-hidden>🌕</span><strong>täiskuu</strong></div>
            <div className='study-emoji-card'><span aria-hidden>🌘</span><strong>kahanev Kuu</strong></div>
          </div>
          <div className='study-def-list'>
            <p>Noorkuu ajal on Maalt nähtav Kuu külg peaaegu tume.</p>
            <p>Täiskuu ajal näeme Kuu valgustatud külge peaaegu tervikuna.</p>
          </div>
        </div>

        <div className='study-section'>
          <h3>Veel maailmaruumi mõisteid</h3>
          <div className='study-def-list'>
            <p><strong>Asteroid</strong> — väike kivine taevakeha, mis tiirleb ümber Päikese.</p>
            <p><strong>Komeet</strong> — koosneb jääst, tolmust ja kivimist. Päikese lähedal võib komeedile tekkida nähtav saba.</p>
            <p><strong>Meteoor</strong> — valgusjälg taevas, mis tekib väikese kosmosekeha liikumisel Maa atmosfääris.</p>
            <p><strong>Tähtkuju</strong> — taevas nähtav tähtede muster, millele inimesed on nime andnud.</p>
          </div>
        </div>
      </section>

      {/* ---- 2. Maa ja kaart ---- */}
      <section className='study-theme' id='teema-maa-ja-kaart'>
        <h2 className='study-theme-title'><span aria-hidden>🌍</span> Maa ja kaart</h2>

        <div className='study-section'>
          <h3>Gloobus ja kaart</h3>
          <div className='study-def-list'>
            <p><strong>Gloobus</strong> — Maa ümar mudel.</p>
            <p><strong>Kaart</strong> — kujutab Maad või mõnda piirkonda tasapinnal. Kaart aitab leida kohti, veekogusid, riike ja liikumissuundi.</p>
            <p><strong>Kompass</strong> — aitab ilmakaari leida.</p>
            <p><strong>Mõõtkava</strong> — näitab, kuidas kaardil olev vahemaa vastab tegelikule vahemaale.</p>
          </div>
          <div className='study-two-graphics'>
            <div className='study-graphic'><CompassGraphic /></div>
            <div className='study-graphic'><GlobeMapGraphic /></div>
          </div>
          <div className='study-def-list'>
            <p>Tavalisel kaardil: põhi on üleval, lõuna all, ida paremal, lääs vasakul.</p>
          </div>
        </div>

        <div className='study-section'>
          <h3>Eesti asukoht</h3>
          <div className='study-def-list'>
            <p>Eesti on riik Euroopas.</p>
            <p>Eesti asub Läänemere ääres.</p>
            <p>Eesti maismaanaabrid on Läti ja Venemaa.</p>
          </div>
          <div className='study-graphic'><EstoniaMapGraphic /></div>
        </div>

        <div className='study-section'>
          <h3>Maismaa ja vesi</h3>
          <div className='study-def-list'>
            <p><strong>Manner</strong> — väga suur maismaa-ala.</p>
            <p><strong>Maailmajagu</strong> — suur piirkond, kuhu kuuluvad riigid ja saared. Euroopa ja Aafrika on maailmajaod.</p>
            <p><strong>Ookean</strong> — väga suur soolase vee ala.</p>
            <p><strong>Meri</strong> — ookeanist väiksem soolase vee ala.</p>
            <p><strong>Saar</strong> — maismaa, mida ümbritseb igast küljest vesi.</p>
            <p>Näited: Eesti – riik, Euroopa – maailmajagu, Atlandi ookean – ookean, Saaremaa – saar.</p>
          </div>
        </div>

        <div className='study-section'>
          <h3>Maa kihid</h3>
          <p>Maa koosneb kihtidest. Väljast sissepoole: maakoor, vahevöö, tuum. Maakoor on Maa kõige välimine tahke kiht.</p>
          <div className='study-graphic'><EarthLayersGraphic /></div>
        </div>

        <div className='study-section'>
          <h3>Vulkaan</h3>
          <div className='study-def-list'>
            <p><strong>Magma</strong> — Maa sees olev sulanud kivim.</p>
            <p><strong>Laava</strong> — magma, mis on jõudnud Maa pinnale.</p>
            <p><strong>Kraater</strong> — vulkaani tipus või pinnal olev ava või lohk.</p>
            <p>Vulkaanist võivad purske ajal väljuda laava, tuhk ja gaasid.</p>
          </div>
          <div className='study-graphic'><VolcanoGraphic /></div>
          <MemoryRule>Magma on Maa sees. Laava on Maa pinnal.</MemoryRule>
        </div>

        <div className='study-section'>
          <h3>Maavärin, kivimid ja muld</h3>
          <div className='study-def-list'>
            <p><strong>Maavärin</strong> — Maa pinna äkiline värisemine. Võib tekkida, kui maakoores vabaneb järsku energia.</p>
            <p><strong>Murrang</strong> — pragu või murdekoht maakoores, mille ääres kivimid võivad liikuda.</p>
            <p><strong>Seismoloog</strong> — teadlane, kes uurib maavärinaid.</p>
            <p><strong>Kivim</strong> — looduslik tahke aine, millest koosneb osa maakoorest.</p>
            <p><strong>Mineraal</strong> — looduslik aine, millest kivimid võivad koosneda.</p>
            <p><strong>Muld</strong> — maapinna pealmine kiht, kus saavad kasvada taimed.</p>
            <p><strong>Setted</strong> — väikesed osakesed, mis võivad vee või tuule abil kuhjuda.</p>
          </div>
        </div>
      </section>

      {/* ---- 3. Vesi ja ilm ---- */}
      <section className='study-theme' id='teema-vesi-ja-ilm'>
        <h2 className='study-theme-title'><span aria-hidden>💧</span> Vesi ja ilm</h2>

        <div className='study-section'>
          <h3>Vee kolm olekut</h3>
          <div className='study-emoji-grid'>
            <div className='study-emoji-card'><span aria-hidden>🧊</span><strong>tahke</strong><small>jää ja lumi</small></div>
            <div className='study-emoji-card'><span aria-hidden>💧</span><strong>vedel</strong><small>vihm, järve- ja kraanivesi</small></div>
            <div className='study-emoji-card'><span aria-hidden>♨️</span><strong>gaasiline</strong><small>veeaur</small></div>
          </div>
          <p>Nooltega saab näidata sulamist, külmumist ja aurumist.</p>
        </div>

        <div className='study-section'>
          <h3>Veeringe</h3>
          <p>Vesi liigub looduses pidevalt. Seda nimetatakse veeringeks.</p>
          <div className='study-def-list'>
            <p><strong>1. Aurumine</strong> — Päike soojendab vett. Vedel vesi muutub veeauruks ja liigub õhku.</p>
            <p><strong>2. Kondenseerumine</strong> — veeaur jahtub ja muutub väikesteks veepiiskadeks. Nii tekivad pilved.</p>
            <p><strong>3. Sademed</strong> — vesi langeb pilvedest maapinnale vihma, lume, lörtsi või rahena.</p>
            <p><strong>4. Kogunemine</strong> — vesi koguneb jõgedesse, järvedesse, meredesse ja maapinda. Seejärel algab ring uuesti.</p>
          </div>
          <div className='study-graphic'><WaterCycleGraphic /></div>
        </div>

        <div className='study-section'>
          <h3>Ilm</h3>
          <p>Ilm näitab õhu seisundit kindlas kohas ja ajal.</p>
          <div className='study-def-list'>
            <p><strong>Temperatuur</strong> — kui soe või külm on. Mõõdetakse kraadides.</p>
            <p><strong>Tuul</strong> — õhu liikumine. Kiirust võib mõõta meetrites sekundis.</p>
            <p><strong>Sademed</strong> — hulka võib mõõta millimeetrites.</p>
            <p><strong>Pilvisus</strong> — kui suur osa taevast on pilvedega kaetud.</p>
          </div>
          <WeatherCardGraphic />
        </div>

        <div className='study-section'>
          <h3>Äike</h3>
          <p>Äikese ajal näeme välku ja kuuleme müristamist. Välk kuumutab õhku väga kiiresti ja õhu järsk paisumine tekitab müristamise heli.</p>
          <div className='study-def-list'>
            <p>Mine siseruumi või autosse.</p>
            <p>Väldi vees olemist.</p>
            <p>Ära seisa üksiku puu all.</p>
            <p>Ära hoia kinni suurest metallobjektist.</p>
          </div>
        </div>
      </section>

      {/* ---- 4. Elusloodus ---- */}
      <section className='study-theme' id='teema-elusloodus'>
        <h2 className='study-theme-title'><span aria-hidden>🌱</span> Elusloodus</h2>

        <div className='study-section'>
          <h3>Elus, eluta ja kunagi elus olnud</h3>
          <div className='study-def-list'>
            <p><strong>Elusolend</strong> — kasvab, vajab energiat ja reageerib ümbrusele. Näited: taim, loom, seen, bakter.</p>
            <p><strong>Eluta</strong> — kivi ja plastpudel ei ole elusolendid.</p>
            <p><strong>Kunagi elus olnud</strong> — kuivanud leht ja puutükk ei ole enam elus, kuid pärinesid elusast taimest.</p>
          </div>
        </div>

        <div className='study-section'>
          <h3>Rakk, bakter ja seen</h3>
          <div className='study-def-list'>
            <p><strong>Rakk</strong> — väga väike ehitusüksus, millest organismid koosnevad.</p>
            <p><strong>Bakter</strong> — väga väike üherakuline organism. Kõik bakterid ei ole kahjulikud — paljud on looduses ja inimese kehas kasulikud.</p>
            <p><strong>Seen</strong> — seened ei ole taimed ega loomad. Paljud seened lagundavad surnud organismide jäänuseid.</p>
          </div>
        </div>

        <div className='study-section'>
          <h3>Taime osad</h3>
          <div className='study-def-list'>
            <p><strong>Juur</strong> — kinnitab taime mulda ning võtab mullast vett ja mineraalaineid.</p>
            <p><strong>Vars</strong> — toetab taime ja ühendab juuri lehtedega.</p>
            <p><strong>Leht</strong> — lehtedes valmistab taim valguse abil endale toitu.</p>
            <p><strong>Õis</strong> — õiest võivad areneda vili ja seemned.</p>
          </div>
          <div className='study-graphic'><PlantGraphic /></div>
        </div>

        <div className='study-section'>
          <h3>Mida taim kasvamiseks vajab?</h3>
          <div className='study-def-list'>
            <p>Taim vajab tavaliselt vett, valgust, õhku ja sobivat temperatuuri.</p>
            <p>Rohelised taimeosad kasutavad toidu valmistamiseks valgust, vett ja õhus olevat süsihappegaasi. Taim eraldab selle käigus hapnikku.</p>
          </div>
        </div>

        <div className='study-section'>
          <h3>Toiduahel</h3>
          <p>Toiduahel näitab, kes keda sööb ja kuidas energia looduses edasi liigub.</p>
          <FoodChainGraphic />
          <div className='study-def-list'>
            <p><strong>Tootja</strong> — valmistab ise toitu. Toiduahela tootja on tavaliselt taim.</p>
            <p><strong>Tarbija</strong> — saab energiat teisi organisme süües. Loomad on tarbijad.</p>
            <p><strong>Lagundaja</strong> — lagundab surnud organismide jäänuseid. Seened ja paljud bakterid on lagundajad.</p>
          </div>
          <MemoryRule>Nool liigub toidult sööja poole.</MemoryRule>
        </div>

        <div className='study-section'>
          <h3>Loomade toitumine</h3>
          <div className='study-def-list'>
            <p><strong>Taimtoiduline</strong> — sööb peamiselt taimi. Näited: lehm, jänes.</p>
            <p><strong>Kiskja (lihasööja)</strong> — püüab ja sööb teisi loomi. Näited: hunt, ilves.</p>
            <p><strong>Kõigesööja</strong> — sööb nii taimset kui loomset toitu. Näited: karu, inimene.</p>
            <p><strong>Saakloom</strong> — loom, keda teine loom võib püüda ja süüa.</p>
          </div>
        </div>

        <div className='study-section'>
          <h3>Elupaik ja kohastumus</h3>
          <div className='study-def-list'>
            <p><strong>Elupaik</strong> — koht, kus organism elab.</p>
            <p><strong>Kohastumus</strong> — omadus, mis aitab organismil oma elupaigas toime tulla.</p>
            <p>Paks karv ja rasvakiht aitavad külmas sooja hoida.</p>
            <p>Kaktuse paks vars aitab kuivas kohas vett säilitada.</p>
            <p>Uimed ja voolujooneline keha aitavad vees liikuda.</p>
            <p>Linnu noka kuju võib sobida kindla toidu söömiseks.</p>
          </div>
        </div>

        <div className='study-section'>
          <h3>Putukad</h3>
          <div className='study-def-list'>
            <p>Putukal on kuus jalga. Paljudel putukatel on pea, rindmik ja tagakeha.</p>
            <p>Näited: liblikas, mesilane, sipelgas.</p>
            <p>Ämblikul on kaheksa jalga. Seetõttu ei ole ämblik putukas.</p>
          </div>
        </div>
      </section>

      {/* ---- 5. Inimene ja tervis ---- */}
      <section className='study-theme' id='teema-inimene-ja-tervis'>
        <h2 className='study-theme-title'><span aria-hidden>🫀</span> Inimene ja tervis</h2>

        <div className='study-section'>
          <h3>Tähtsad elundid</h3>
          <div className='study-def-list'>
            <p><strong>Süda</strong> — pumpab verd kehas ringi.</p>
            <p><strong>Veri</strong> — kannab kehas hapnikku ja toitaineid.</p>
            <p><strong>Kopsud</strong> — aitavad hapnikul õhust verre liikuda.</p>
            <p><strong>Magu</strong> — osaleb toidu seedimises.</p>
            <p><strong>Aju</strong> — juhib keha tööd ja aitab mõelda.</p>
          </div>
          <div className='study-graphic'><HumanBodyGraphic /></div>
        </div>

        <div className='study-section'>
          <h3>Luustik, lihased ja nahk</h3>
          <div className='study-def-list'>
            <p><strong>Luustik</strong> — toetab keha ja kaitseb elundeid. Kolju kaitseb aju, rinnakorv kaitseb südant ja kopse.</p>
            <p><strong>Lihased</strong> — tõmbuvad kokku ja aitavad luid liigutada.</p>
            <p><strong>Nahk</strong> — kaitseb keha väljastpoolt ning aitab tunda puudutust, sooja ja külma.</p>
          </div>
        </div>

        <div className='study-section'>
          <h3>Meeled</h3>
          <p>Meeled annavad meile infot ümbritseva maailma kohta.</p>
          <div className='study-def-list'>
            <p>silmad – nägemine</p>
            <p>kõrvad – kuulmine</p>
            <p>nina – haistmine</p>
            <p>keel – maitsmine</p>
            <p>nahk – kompimine</p>
          </div>
        </div>

        <div className='study-section'>
          <h3>Liikumine</h3>
          <p>Liikumisel vajavad lihased rohkem hapnikku. Seetõttu süda töötab kiiremini, pulss kiireneb ja hingamine kiireneb.</p>
          <MemoryRule>Pärast jooksmist või hüplemist on pulss ja hingamine tavaliselt kiiremad kui puhkeolekus.</MemoryRule>
        </div>

        <div className='study-section'>
          <h3>Tervist toetavad harjumused</h3>
          <div className='study-def-list'>
            <p>Tervist aitavad hoida: piisav uni, igapäevane liikumine, mitmekesine toit, vee joomine, käte pesemine, hammaste pesemine.</p>
            <p>Tervist võivad kahjustada: väga vähene uni, halb hügieen, pidevalt ainult magusate jookide joomine, väga vähene liikumine.</p>
          </div>
        </div>
      </section>

      {/* ---- 6. Uurimine ja andmed ---- */}
      <section className='study-theme' id='teema-uurimine-ja-andmed'>
        <h2 className='study-theme-title'><span aria-hidden>🔎</span> Uurimine ja andmed</h2>

        <div className='study-section'>
          <h3>Vaatlus või arvamus?</h3>
          <div className='study-def-list'>
            <p><strong>Vaatlus</strong> — kirjeldab seda, mida tegelikult nähti või mõõdeti. Näited: taim on 12 cm kõrge; vesi on klaasis hägune; õues on 8 °C.</p>
            <p><strong>Arvamus</strong> — väljendab inimese hinnangut või tunnet. Näited: see taim on kõige ilusam; pilv näeb välja nagu draakon.</p>
          </div>
          <MemoryRule>Vaatlust saab kontrollida. Arvamus võib eri inimestel olla erinev.</MemoryRule>
        </div>

        <div className='study-section'>
          <h3>Õiglane katse</h3>
          <p>Katses muudetakse üht asja ja vaadatakse, mis juhtub.</p>
          <div className='study-def-list'>
            <p><strong>Uurimisküsimus:</strong> kas valgus mõjutab taime kasvu?</p>
            <p>Taim A on valguses, taim B on pimedas.</p>
            <p>Mõlemad taimed saavad sama palju vett ja on sama liiki.</p>
            <p>Mõõdetakse mõlema taime kasvu.</p>
          </div>
          <MemoryRule>Kui uurime valguse mõju, peavad teised tingimused olema võimalikult samad.</MemoryRule>
        </div>

        <div className='study-section'>
          <h3>Katse neli osa</h3>
          <div className='study-def-list'>
            <p><strong>1. Uurimisküsimus</strong> — mida tahame teada saada?</p>
            <p><strong>2. Tingimused</strong> — mida muudame ja mida hoiame samana?</p>
            <p><strong>3. Mõõtmine või vaatlus</strong> — milliseid andmeid kogume?</p>
            <p><strong>4. Järeldus</strong> — mida andmed näitavad?</p>
          </div>
        </div>

        <div className='study-section'>
          <h3>Andmed, tõend ja järeldus</h3>
          <div className='study-def-list'>
            <p><strong>Andmed</strong> — kogutud mõõtmised või tähelepanekud.</p>
            <p><strong>Tabel</strong> — esitab andmed ridade ja veergudena.</p>
            <p><strong>Graafik</strong> — aitab väärtusi võrrelda ja muutusi näha.</p>
            <p><strong>Tõend</strong> — vaatlus või andmed, mis aitavad väidet kontrollida.</p>
            <p><strong>Järeldus</strong> — vastus, mis tehakse andmete põhjal.</p>
          </div>
        </div>

        <div className='study-section'>
          <h3>Kuidas tabelit lugeda?</h3>
          <PlantTableGraphic />
          <div className='study-def-list'>
            <p>1. Vaata, mida mõõdeti.</p>
            <p>2. Võrdle väärtusi.</p>
            <p>3. Leia suurim, väikseim või muutunud väärtus.</p>
            <p>4. Vali järeldus, mida andmed tegelikult toetavad.</p>
          </div>
          <p className='study-example'>Selles katses kasvas valguses olnud taim rohkem.</p>
          <MemoryRule>Ära järelda, et kõik taimed kasvavad alati täpselt samamoodi.</MemoryRule>
        </div>

        <div className='study-section'>
          <h3>Mitu mõõtmist on parem kui üks</h3>
          <p>Üks tulemus võib olla juhuslik või sisaldada mõõtmisviga. Mitme mõõtmise või mitme uuritava organismiga saab kontrollida, kas tulemus kordub.</p>
          <MemoryRule>Järeldus peab põhinema andmetel, mitte oletusel.</MemoryRule>
        </div>
      </section>

      <section className='study-final-card'>
        <h3>Kõige tähtsam lühidalt</h3>
        <ul className='study-remember-list'>
          <li><span aria-hidden>☀️</span> Päike on täht ja Maa on planeet.</li>
          <li><span aria-hidden>🌗</span> Maa pöörlemine põhjustab päeva ja öö.</li>
          <li><span aria-hidden>🗓️</span> Maa tiir ümber Päikese kestab ühe aasta.</li>
          <li><span aria-hidden>🌋</span> Magma on Maa sees, laava Maa pinnal.</li>
          <li><span aria-hidden>💧</span> Veeringes vesi aurub, moodustab pilvi ja langeb sademetena tagasi.</li>
          <li><span aria-hidden>🌱</span> Taim on toiduahelas tavaliselt tootja.</li>
          <li><span aria-hidden>🐞</span> Putukal on kuus jalga.</li>
          <li><span aria-hidden>🫀</span> Süda pumpab verd ja kopsud aitavad hapnikul verre liikuda.</li>
          <li><span aria-hidden>🔎</span> Vaatlus kirjeldab nähtut, järeldus põhineb andmetel.</li>
        </ul>
      </section>
    </div>
  );
}
