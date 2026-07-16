'use client';

// Visual revision material for "Ring ja ringjoon". Pure SVG so it stays sharp,
// works offline and matches the exercise graphics' pastel language. Nothing here
// is scored or interactive beyond the shared start button rendered by the page.

const BLUE = '#3b82f6';
const BLUE_DARK = '#2563eb';
const FILL = '#bfdbfe';
const SOFT = '#eef2ff';
const GREEN = '#16a34a';
const RED = '#ef4444';
const INK = '#0f172a';

const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
const onCircle = (cx: number, cy: number, r: number, deg: number) => ({
  x: cx + r * Math.cos(toRad(deg)),
  y: cy + r * Math.sin(toRad(deg))
});

// A filled pie sector from 0° (top) clockwise to `endDeg`, over a light full ring.
function pieSectorPath(cx: number, cy: number, r: number, endDeg: number) {
  const start = onCircle(cx, cy, r, 0);
  const end = onCircle(cx, cy, r, endDeg);
  const largeArc = endDeg > 180 ? 1 : 0;
  return `M${cx} ${cy} L${start.x.toFixed(2)} ${start.y.toFixed(2)} A${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z`;
}

function RingjoonGraphic() {
  return (
    <svg className='study-svg' viewBox='0 0 180 160' role='img' aria-label='Ringjoon: ainult ringi ümbritsev joon'>
      <circle cx='90' cy='80' r='58' fill='#ffffff' stroke={BLUE} strokeWidth='7' />
      <line x1='150' y1='24' x2='128' y2='45' stroke={INK} strokeWidth='1.5' />
      <text x='152' y='22' fontSize='14' fontWeight='700' fill={INK}>ringjoon</text>
    </svg>
  );
}

function RingGraphic() {
  return (
    <svg className='study-svg' viewBox='0 0 180 160' role='img' aria-label='Ring: kogu ringjoone sees olev ala'>
      <circle cx='90' cy='80' r='58' fill={FILL} stroke={BLUE} strokeWidth='5' />
      <text x='90' y='85' fontSize='18' fontWeight='800' fill={BLUE_DARK} textAnchor='middle'>ring</text>
    </svg>
  );
}

function LabeledPartsGraphic() {
  const cx = 160;
  const cy = 120;
  const r = 80;
  const radiusTop = onCircle(cx, cy, r, 0); // straight up
  return (
    <svg className='study-svg' viewBox='0 0 320 250' role='img' aria-label='Ringi osad: keskpunkt, raadius, läbimõõt ja ringjoon'>
      {/* ringjoon */}
      <circle cx={cx} cy={cy} r={r} fill={SOFT} stroke={BLUE} strokeWidth='4' />
      {/* läbimõõt: full horizontal line through the centre (twice the radius) */}
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={BLUE_DARK} strokeWidth='6' strokeLinecap='round' />
      {/* raadius: centre to the top edge (visibly half the diameter) */}
      <line x1={cx} y1={cy} x2={radiusTop.x} y2={radiusTop.y} stroke={GREEN} strokeWidth='6' strokeLinecap='round' />
      {/* keskpunkt */}
      <circle cx={cx} cy={cy} r='5' fill={INK} />

      {/* labels with leader lines */}
      <line x1={cx} y1={cy} x2='70' y2='185' stroke={INK} strokeWidth='1.3' />
      <text x='8' y='200' fontSize='14' fontWeight='700' fill={INK}>keskpunkt</text>

      <line x1={cx} y1={cy - r / 2} x2='250' y2='55' stroke={GREEN} strokeWidth='1.3' />
      <text x='250' y='50' fontSize='14' fontWeight='700' fill={GREEN}>raadius</text>

      <line x1={cx - r / 2} y1={cy} x2='60' y2='70' stroke={BLUE_DARK} strokeWidth='1.3' />
      <text x='6' y='66' fontSize='14' fontWeight='700' fill={BLUE_DARK}>läbimõõt</text>

      {(() => { const p = onCircle(cx, cy, r, 40); return <><line x1={p.x} y1={p.y} x2='288' y2='150' stroke={BLUE} strokeWidth='1.3' /><text x='250' y='168' fontSize='14' fontWeight='700' fill={BLUE}>ringjoon</text></>; })()}
    </svg>
  );
}

function RadiusToDiameterGraphic() {
  return (
    <svg className='study-svg' viewBox='0 0 300 120' role='img' aria-label='Raadius 4 cm ja läbimõõt 8 cm: läbimõõt on kaks raadiust'>
      {/* radius 4 cm */}
      <line x1='20' y1='40' x2='120' y2='40' stroke={GREEN} strokeWidth='7' strokeLinecap='round' />
      <text x='70' y='28' fontSize='14' fontWeight='700' fill={GREEN} textAnchor='middle'>4 cm</text>
      <text x='70' y='60' fontSize='12' fill={INK} textAnchor='middle'>raadius</text>
      {/* diameter 8 cm = two radiuses */}
      <line x1='20' y1='90' x2='220' y2='90' stroke={BLUE_DARK} strokeWidth='7' strokeLinecap='round' />
      <line x1='120' y1='82' x2='120' y2='98' stroke='#ffffff' strokeWidth='2' />
      <text x='120' y='112' fontSize='14' fontWeight='700' fill={BLUE_DARK} textAnchor='middle'>8 cm</text>
      <text x='250' y='94' fontSize='12' fill={INK}>läbimõõt</text>
    </svg>
  );
}

function DiameterHalvesGraphic() {
  return (
    <svg className='study-svg' viewBox='0 0 300 110' role='img' aria-label='Läbimõõt 10 cm jaguneb kaheks pooleks, kumbki 5 cm'>
      <line x1='30' y1='55' x2='270' y2='55' stroke={BLUE_DARK} strokeWidth='7' strokeLinecap='round' />
      <line x1='150' y1='40' x2='150' y2='70' stroke='#ffffff' strokeWidth='3' />
      <text x='150' y='30' fontSize='14' fontWeight='700' fill={BLUE_DARK} textAnchor='middle'>10 cm</text>
      <text x='90' y='90' fontSize='13' fontWeight='700' fill={GREEN} textAnchor='middle'>5 cm</text>
      <text x='210' y='90' fontSize='13' fontWeight='700' fill={GREEN} textAnchor='middle'>5 cm</text>
    </svg>
  );
}

function PointPositionGraphic() {
  const cx = 110;
  const cy = 100;
  const r = 74;
  const onEdge = onCircle(cx, cy, r, 300);
  return (
    <svg className='study-svg' viewBox='0 0 220 200' role='img' aria-label='Punkt A ringi sees, punkt B ringjoone peal, punkt C ringist väljas'>
      <circle cx={cx} cy={cy} r={r} fill={SOFT} stroke={BLUE} strokeWidth='4' />
      {/* A inside */}
      <circle cx={cx - 24} cy={cy + 6} r='6' fill={GREEN} />
      <text x={cx - 24} y={cy - 6} fontSize='16' fontWeight='800' fill={INK} textAnchor='middle'>A</text>
      {/* B on the outline */}
      <circle cx={onEdge.x} cy={onEdge.y} r='6' fill={RED} />
      <text x={onEdge.x + 12} y={onEdge.y - 8} fontSize='16' fontWeight='800' fill={INK}>B</text>
      {/* C outside */}
      <circle cx='200' cy='36' r='6' fill='#7c3aed' />
      <text x='200' y='22' fontSize='16' fontWeight='800' fill={INK} textAnchor='middle'>C</text>
    </svg>
  );
}

function ConcentricGraphic() {
  const cx = 130;
  const cy = 110;
  return (
    <svg className='study-svg' viewBox='0 0 300 210' role='img' aria-label='Kaks sama keskpunktiga ringjoont: väiksem ja suurem raadius'>
      <circle cx={cx} cy={cy} r='90' fill='none' stroke={BLUE_DARK} strokeWidth='4' />
      <circle cx={cx} cy={cy} r='45' fill='none' stroke={GREEN} strokeWidth='4' />
      <circle cx={cx} cy={cy} r='4' fill={INK} />
      {/* smaller radius */}
      <line x1={cx} y1={cy} x2={cx - 45} y2={cy} stroke={GREEN} strokeWidth='4' />
      <line x1={cx - 22} y1={cy} x2='40' y2='175' stroke={GREEN} strokeWidth='1.2' />
      <text x='6' y='190' fontSize='13' fontWeight='700' fill={GREEN}>väiksem raadius</text>
      {/* larger radius */}
      <line x1={cx} y1={cy} x2={cx} y2={cy - 90} stroke={BLUE_DARK} strokeWidth='4' />
      <line x1={cx} y1={cy - 60} x2='250' y2='30' stroke={BLUE_DARK} strokeWidth='1.2' />
      <text x='220' y='24' fontSize='13' fontWeight='700' fill={BLUE_DARK}>suurem raadius</text>
    </svg>
  );
}

function CmMmRulerGraphic() {
  const left = 20;
  const right = 280;
  const ticks = Array.from({ length: 11 }, (_, index) => left + (index * (right - left)) / 10);
  return (
    <svg className='study-svg' viewBox='0 0 300 120' role='img' aria-label='1 cm jaguneb kümneks millimeetriks'>
      <rect x={left} y='40' width={right - left} height='34' rx='6' fill={SOFT} stroke={BLUE} strokeWidth='3' />
      {ticks.map((x, index) => (
        <line key={index} x1={x} y1='40' x2={x} y2={index % 10 === 0 ? 74 : 62} stroke={BLUE_DARK} strokeWidth={index % 10 === 0 ? 3 : 1.5} />
      ))}
      <text x='150' y='28' fontSize='14' fontWeight='800' fill={BLUE_DARK} textAnchor='middle'>1 cm</text>
      <text x='150' y='98' fontSize='13' fontWeight='700' fill={INK} textAnchor='middle'>10 mm</text>
    </svg>
  );
}

function DegreesCircleGraphic({ filled, label }: { filled: number; label: string }) {
  const cx = 70;
  const cy = 70;
  const r = 56;
  const full = filled >= 360;
  return (
    <svg className='study-svg study-svg-degrees' viewBox='0 0 140 140' role='img' aria-label={label}>
      <circle cx={cx} cy={cy} r={r} fill={SOFT} stroke={BLUE} strokeWidth='4' />
      {full
        ? <circle cx={cx} cy={cy} r={r} fill={FILL} stroke={BLUE} strokeWidth='4' />
        : <path d={pieSectorPath(cx, cy, r, filled)} fill={FILL} stroke={BLUE_DARK} strokeWidth='2' />}
      <circle cx={cx} cy={cy} r='3' fill={INK} />
    </svg>
  );
}

function MissingSectorGraphic() {
  const cx = 100;
  const cy = 100;
  const r = 78;
  const knownMid = onCircle(cx, cy, r * 0.55, 60);
  const missingMid = onCircle(cx, cy, r * 0.55, 240);
  return (
    <svg className='study-svg' viewBox='0 0 200 200' role='img' aria-label='Ring on jagatud kaheks osaks: teadaolev 120 kraadi ja puuduv osa'>
      <circle cx={cx} cy={cy} r={r} fill={SOFT} stroke={BLUE} strokeWidth='3' />
      <path d={pieSectorPath(cx, cy, r, 120)} fill={FILL} stroke={BLUE_DARK} strokeWidth='2' />
      <circle cx={cx} cy={cy} r='4' fill={INK} />
      <text x={knownMid.x} y={knownMid.y} fontSize='16' fontWeight='800' fill={BLUE_DARK} textAnchor='middle' dominantBaseline='middle'>120°</text>
      <text x={missingMid.x} y={missingMid.y} fontSize='20' fontWeight='800' fill='#7c3aed' textAnchor='middle' dominantBaseline='middle'>?</text>
    </svg>
  );
}

function MemoryRule({ children }: { children: React.ReactNode }) {
  return <p className='study-memory-rule'>{children}</p>;
}

export default function RingStudyMaterial() {
  return (
    <div className='study-material'>
      <header className='study-material-header'>
        <span className='study-material-icon' aria-hidden>⭕</span>
        <div>
          <h2>Ring ja ringjoon</h2>
          <p>Vaatame üle ringi tähtsamad osad ja reeglid.</p>
        </div>
      </header>

      <section className='study-section'>
        <h3>Ring ja ringjoon ei ole sama</h3>
        <div className='study-card-row'>
          <div className='study-concept-card'>
            <h4>Ringjoon</h4>
            <div className='study-graphic'><RingjoonGraphic /></div>
            <p>Ringjoon on ainult ringi ümbritsev joon.</p>
          </div>
          <div className='study-concept-card'>
            <h4>Ring</h4>
            <div className='study-graphic'><RingGraphic /></div>
            <p>Ring on kogu ringjoone sees olev ala.</p>
          </div>
        </div>
        <MemoryRule>Ringjoon on joon. Ring on kogu kujund.</MemoryRule>
      </section>

      <section className='study-section'>
        <h3>Ringi tähtsad osad</h3>
        <div className='study-graphic'><LabeledPartsGraphic /></div>
        <div className='study-def-list'>
          <p><strong>Keskpunkt</strong> — Keskpunkt on punkt täpselt ringi keskel.</p>
          <p><strong>Raadius</strong> — Raadius läheb keskpunktist ringjooneni.</p>
          <p><strong>Läbimõõt</strong> — Läbimõõt läheb ühest servast teise ja läbib keskpunkti.</p>
        </div>
      </section>

      <section className='study-section'>
        <h3>Raadius ja läbimõõt on omavahel seotud</h3>
        <div className='study-card-row'>
          <div className='study-rule-card'>
            <span className='study-rule-label'>Läbimõõdu leidmine</span>
            <p className='study-formula'>läbimõõt = 2 × raadius</p>
            <div className='study-graphic'><RadiusToDiameterGraphic /></div>
            <p className='study-example'>Kui raadius on 4 cm, siis läbimõõt on 8 cm.</p>
          </div>
          <div className='study-rule-card'>
            <span className='study-rule-label'>Raadiuse leidmine</span>
            <p className='study-formula'>raadius = läbimõõt ÷ 2</p>
            <div className='study-graphic'><DiameterHalvesGraphic /></div>
            <p className='study-example'>Kui läbimõõt on 10 cm, siis raadius on 5 cm.</p>
          </div>
        </div>
        <MemoryRule>Läbimõõt on alati kaks korda pikem kui raadius.</MemoryRule>
      </section>

      <section className='study-section'>
        <h3>Punkti asukoht</h3>
        <div className='study-graphic'><PointPositionGraphic /></div>
        <div className='study-def-list'>
          <p>A on ringi sees.</p>
          <p>B on ringjoone peal.</p>
          <p>C on ringist väljas.</p>
        </div>
      </section>

      <section className='study-section'>
        <h3>Suurem raadius tähendab suuremat ringjoont</h3>
        <p>Kui ringjoontel on sama keskpunkt, on suurema raadiusega ringjoon suurem.</p>
        <div className='study-graphic'><ConcentricGraphic /></div>
        <MemoryRule>Mida suurem on raadius, seda suurem on ringjoon.</MemoryRule>
      </section>

      <section className='study-section'>
        <h3>Võrdle samu ühikuid</h3>
        <p>Enne pikkuste võrdlemist teisenda need samasse ühikusse.</p>
        <p className='study-formula study-formula-wide'>1 cm = 10 mm</p>
        <div className='study-graphic'><CmMmRulerGraphic /></div>
        <p className='study-example'>4 cm = 40 mm</p>
        <MemoryRule>Seega on 4 cm ja 40 mm sama pikad.</MemoryRule>
      </section>

      <section className='study-section'>
        <h3>Täisring on 360 kraadi</h3>
        <div className='study-degrees-grid'>
          <div className='study-degrees-card'>
            <DegreesCircleGraphic filled={360} label='Täisring, 360 kraadi' />
            <strong>Täisring</strong>
            <span>360°</span>
          </div>
          <div className='study-degrees-card'>
            <DegreesCircleGraphic filled={180} label='Poolring, 180 kraadi' />
            <strong>Poolring</strong>
            <span>180°</span>
          </div>
          <div className='study-degrees-card'>
            <DegreesCircleGraphic filled={90} label='Veerandring, 90 kraadi' />
            <strong>Veerandring</strong>
            <span>90°</span>
          </div>
          <div className='study-degrees-card'>
            <DegreesCircleGraphic filled={270} label='Kolmveerandring, 270 kraadi' />
            <strong>Kolmveerandring</strong>
            <span>270°</span>
          </div>
        </div>
      </section>

      <section className='study-section'>
        <h3>Kuidas leida puuduv osa?</h3>
        <p>Täisring on 360°. Lahuta teadaolev osa 360 kraadist.</p>
        <div className='study-graphic'><MissingSectorGraphic /></div>
        <p className='study-example'>Üks osa on 120°.</p>
        <p className='study-formula study-formula-wide'>360° − 120° = 240°</p>
        <MemoryRule>Puuduv osa on 240°.</MemoryRule>
      </section>

      <section className='study-final-card'>
        <h3>Pea meeles</h3>
        <ul className='study-remember-list'>
          <li><span aria-hidden>⭕</span> Ringjoon on joon, ring on kogu ala.</li>
          <li><span aria-hidden>📏</span> Raadius läheb keskpunktist ringjooneni.</li>
          <li><span aria-hidden>↔️</span> Läbimõõt läbib keskpunkti.</li>
          <li><span aria-hidden>✖️</span> Läbimõõt = 2 × raadius.</li>
          <li><span aria-hidden>🔄</span> Täisring = 360°.</li>
        </ul>
      </section>
    </div>
  );
}
