'use client';

import { CmMmRulerGraphic, MemoryRule } from '@/app/components/study/StudyPrimitives';

// Visual revision material for "Mõõtühikud" (length units). Pure SVG graphics in
// the app's pastel language, matching the length exercise. Not scored.

const BLUE = '#3b82f6';
const BLUE_DARK = '#2563eb';
const SOFT = '#eef2ff';
const GREEN = '#16a34a';
const INK = '#0f172a';

function UnitLadderGraphic() {
  const units = ['km', 'm', 'dm', 'cm', 'mm'];
  const factors = ['× 1000', '× 10', '× 10', '× 10'];
  const divs = ['÷ 1000', '÷ 10', '÷ 10', '÷ 10'];
  const boxY = (i: number) => 12 + i * 66;
  return (
    <svg className='study-svg' viewBox='0 0 260 330' role='img' aria-label='Ühikuredel: km, m, dm, cm, mm; alla korrutamine, üles jagamine'>
      {units.map((unit, i) => (
        <g key={unit}>
          <rect x='85' y={boxY(i)} width='90' height='36' rx='10' fill={SOFT} stroke={BLUE} strokeWidth='2.5' />
          <text x='130' y={boxY(i) + 24} fontSize='18' fontWeight='800' fill={BLUE_DARK} textAnchor='middle'>{unit}</text>
        </g>
      ))}
      {factors.map((factor, i) => (
        <g key={`f-${i}`}>
          <line x1='60' y1={boxY(i) + 40} x2='60' y2={boxY(i) + 62} stroke={GREEN} strokeWidth='2' markerEnd='url(#arrowDown)' />
          <text x='52' y={boxY(i) + 56} fontSize='12' fontWeight='700' fill={GREEN} textAnchor='end'>{factor}</text>
          <line x1='200' y1={boxY(i + 1) - 4} x2='200' y2={boxY(i + 1) - 26} stroke={BLUE_DARK} strokeWidth='2' markerEnd='url(#arrowUp)' />
          <text x='208' y={boxY(i) + 56} fontSize='12' fontWeight='700' fill={BLUE_DARK}>{divs[i]}</text>
        </g>
      ))}
      <defs>
        <marker id='arrowDown' markerWidth='8' markerHeight='8' refX='4' refY='7' orient='auto'><path d='M1 1 L4 7 L7 1' fill='none' stroke={GREEN} strokeWidth='1.5' /></marker>
        <marker id='arrowUp' markerWidth='8' markerHeight='8' refX='4' refY='1' orient='auto'><path d='M1 7 L4 1 L7 7' fill='none' stroke={BLUE_DARK} strokeWidth='1.5' /></marker>
      </defs>
    </svg>
  );
}

function RoadGraphic() {
  return (
    <svg className='study-svg' viewBox='0 0 300 110' role='img' aria-label='Tee: 3 km lõik ja 250 m lõik, kokku 3250 m'>
      <line x1='20' y1='55' x2='210' y2='55' stroke={BLUE_DARK} strokeWidth='8' strokeLinecap='round' />
      <line x1='210' y1='55' x2='280' y2='55' stroke={GREEN} strokeWidth='8' strokeLinecap='round' />
      <line x1='210' y1='42' x2='210' y2='68' stroke='#ffffff' strokeWidth='2' />
      <text x='115' y='40' fontSize='14' fontWeight='800' fill={BLUE_DARK} textAnchor='middle'>3 km</text>
      <text x='245' y='40' fontSize='13' fontWeight='800' fill={GREEN} textAnchor='middle'>250 m</text>
      <text x='150' y='96' fontSize='14' fontWeight='800' fill={INK} textAnchor='middle'>kogu tee 3250 m</text>
    </svg>
  );
}

function TwoLinesGraphic() {
  return (
    <svg className='study-svg' viewBox='0 0 300 120' role='img' aria-label='Joon A on 54 mm, joon B on 52 mm; A on pikem'>
      <line x1='20' y1='40' x2='236' y2='40' stroke={BLUE_DARK} strokeWidth='7' strokeLinecap='round' />
      <text x='250' y='45' fontSize='13' fontWeight='800' fill={BLUE_DARK}>A</text>
      <text x='128' y='28' fontSize='12' fontWeight='700' fill={INK} textAnchor='middle'>5 cm 4 mm = 54 mm</text>
      <line x1='20' y1='85' x2='228' y2='85' stroke={GREEN} strokeWidth='7' strokeLinecap='round' />
      <text x='250' y='90' fontSize='13' fontWeight='800' fill={GREEN}>B</text>
      <text x='124' y='108' fontSize='12' fontWeight='700' fill={INK} textAnchor='middle'>52 mm</text>
    </svg>
  );
}

function OrderCardsGraphic() {
  const cards = [
    { label: '48 mm', mm: 48 },
    { label: '5 cm', mm: 50 },
    { label: '5 cm 3 mm', mm: 53 }
  ];
  return (
    <svg className='study-svg' viewBox='0 0 300 90' role='img' aria-label='Kolm pikkusekaarti lühimast pikimani: 48 mm, 5 cm, 5 cm 3 mm'>
      {cards.map((card, i) => (
        <g key={card.label}>
          <rect x={10 + i * 98} y='20' width='86' height='50' rx='12' fill={SOFT} stroke={BLUE} strokeWidth='2.5' />
          <text x={53 + i * 98} y='42' fontSize='14' fontWeight='800' fill={BLUE_DARK} textAnchor='middle'>{card.label}</text>
          <text x={53 + i * 98} y='60' fontSize='12' fill={INK} textAnchor='middle'>{card.mm} mm</text>
        </g>
      ))}
    </svg>
  );
}

function SquareGraphic() {
  return (
    <svg className='study-svg study-svg-shape' viewBox='0 0 160 150' role='img' aria-label='Ruut, iga külg 5 cm'>
      <rect x='30' y='25' width='100' height='100' fill='#eef3ff' stroke='#4865ff' strokeWidth='3' />
      <text x='80' y='18' fontSize='13' fontWeight='700' fill={INK} textAnchor='middle'>5 cm</text>
      <text x='80' y='143' fontSize='13' fontWeight='700' fill={INK} textAnchor='middle'>5 cm</text>
      <text x='16' y='79' fontSize='13' fontWeight='700' fill={INK} textAnchor='middle'>5 cm</text>
      <text x='144' y='79' fontSize='13' fontWeight='700' fill={INK} textAnchor='middle'>5 cm</text>
    </svg>
  );
}

function RectangleGraphic() {
  return (
    <svg className='study-svg study-svg-shape' viewBox='0 0 200 130' role='img' aria-label='Ristkülik, küljed 8 cm ja 4 cm'>
      <rect x='30' y='30' width='140' height='70' fill='#e9ffe9' stroke='#2e7d32' strokeWidth='3' />
      <text x='100' y='22' fontSize='13' fontWeight='700' fill={INK} textAnchor='middle'>8 cm</text>
      <text x='100' y='120' fontSize='13' fontWeight='700' fill={INK} textAnchor='middle'>8 cm</text>
      <text x='16' y='69' fontSize='13' fontWeight='700' fill={INK} textAnchor='middle'>4 cm</text>
      <text x='184' y='69' fontSize='13' fontWeight='700' fill={INK} textAnchor='middle'>4 cm</text>
    </svg>
  );
}

function TriangleGraphic() {
  return (
    <svg className='study-svg study-svg-shape' viewBox='0 0 200 140' role='img' aria-label='Kolmnurk, küljed 4 cm, 5 cm ja 6 cm'>
      <polygon points='100,20 20,120 180,120' fill='#fff4e6' stroke='#c56a00' strokeWidth='3' />
      <text x='46' y='64' fontSize='13' fontWeight='700' fill={INK} textAnchor='middle'>4 cm</text>
      <text x='154' y='64' fontSize='13' fontWeight='700' fill={INK} textAnchor='middle'>5 cm</text>
      <text x='100' y='136' fontSize='13' fontWeight='700' fill={INK} textAnchor='middle'>6 cm</text>
    </svg>
  );
}

function RouteMapsGraphic() {
  return (
    <svg className='study-svg' viewBox='0 0 300 190' role='img' aria-label='Kolm teekaarti: kaks järjestikust lõiku, edasi-tagasi, ja kaks erineva pikkusega teed'>
      {/* two consecutive legs */}
      <circle cx='20' cy='30' r='5' fill={BLUE_DARK} /><circle cx='150' cy='30' r='5' fill={BLUE_DARK} /><circle cx='280' cy='30' r='5' fill={BLUE_DARK} />
      <line x1='25' y1='30' x2='145' y2='30' stroke={BLUE_DARK} strokeWidth='4' /><line x1='155' y1='30' x2='275' y2='30' stroke={GREEN} strokeWidth='4' />
      <text x='85' y='22' fontSize='11' fill={INK} textAnchor='middle'>56 km</text><text x='215' y='22' fontSize='11' fill={INK} textAnchor='middle'>48 km</text>
      {/* there and back */}
      <line x1='30' y1='95' x2='270' y2='95' stroke={BLUE_DARK} strokeWidth='4' markerEnd='url(#rm)' />
      <line x1='270' y1='110' x2='30' y2='110' stroke={GREEN} strokeWidth='4' markerEnd='url(#rm2)' />
      <text x='150' y='88' fontSize='11' fill={INK} textAnchor='middle'>93 km edasi</text>
      <text x='150' y='126' fontSize='11' fill={INK} textAnchor='middle'>93 km tagasi</text>
      {/* two roads of different length */}
      <line x1='20' y1='165' x2='250' y2='165' stroke={BLUE_DARK} strokeWidth='4' /><text x='265' y='169' fontSize='11' fill={INK}>129</text>
      <line x1='20' y1='180' x2='185' y2='180' stroke={GREEN} strokeWidth='4' /><text x='200' y='184' fontSize='11' fill={INK}>93</text>
      <defs>
        <marker id='rm' markerWidth='8' markerHeight='8' refX='6' refY='4' orient='auto'><path d='M1 1 L6 4 L1 7' fill='none' stroke={BLUE_DARK} strokeWidth='1.5' /></marker>
        <marker id='rm2' markerWidth='8' markerHeight='8' refX='6' refY='4' orient='auto'><path d='M1 1 L6 4 L1 7' fill='none' stroke={GREEN} strokeWidth='1.5' /></marker>
      </defs>
    </svg>
  );
}

export default function LengthsStudyMaterial() {
  return (
    <div className='study-material'>
      <header className='study-material-header'>
        <span className='study-material-icon' aria-hidden>📏</span>
        <div>
          <h2>Mõõtühikud</h2>
          <p>Kordame üle pikkusühikud, teisendamise ja pikkustega arvutamise.</p>
        </div>
      </header>

      <section className='study-section'>
        <h3>Suuremast väiksemani</h3>
        <p className='study-formula study-formula-wide'>km → m → dm → cm → mm</p>
        <div className='study-def-list'>
          <p>km – kilomeeter</p>
          <p>m – meeter</p>
          <p>dm – detsimeeter</p>
          <p>cm – sentimeeter</p>
          <p>mm – millimeeter</p>
        </div>
        <div className='study-relations'>
          <span>1 km = 1000 m</span><span>1 m = 10 dm</span><span>1 m = 100 cm</span>
          <span>1 m = 1000 mm</span><span>1 dm = 10 cm</span><span>1 cm = 10 mm</span>
        </div>
        <div className='study-graphic'><UnitLadderGraphic /></div>
        <MemoryRule>Väiksemas ühikus on sama pikkuse arv suurem. Näide: 1 cm = 10 mm — pikkus jäi samaks, kuid millimeetreid on arvuliselt rohkem.</MemoryRule>
      </section>

      <section className='study-section'>
        <h3>Vali mõõdetava asja järgi sobiv ühik</h3>
        <div className='study-card-row'>
          <div className='study-concept-card'><span className='study-card-emoji' aria-hidden>📄</span><h4>Paberilehe paksus</h4><p className='study-unit-pill'>mm</p><p>Väga väikeseid pikkusi ja paksusi mõõdame millimeetrites.</p></div>
          <div className='study-concept-card'><span className='study-card-emoji' aria-hidden>✏️</span><h4>Pliiatsi pikkus</h4><p className='study-unit-pill'>cm</p><p>Pliiatsi pikkust mõõdame tavaliselt sentimeetrites.</p></div>
          <div className='study-concept-card'><span className='study-card-emoji' aria-hidden>📓</span><h4>Vihiku laius</h4><p className='study-unit-pill'>cm või dm</p><p>Vihiku laiust võib väljendada sentimeetrites või detsimeetrites.</p></div>
          <div className='study-concept-card'><span className='study-card-emoji' aria-hidden>🏫</span><h4>Toa või koolimaja kõrgus</h4><p className='study-unit-pill'>m</p><p>Hooneid ja ruume mõõdame tavaliselt meetrites.</p></div>
          <div className='study-concept-card'><span className='study-card-emoji' aria-hidden>🛣️</span><h4>Linnade vahemaa</h4><p className='study-unit-pill'>km</p><p>Pikki vahemaid mõõdame kilomeetrites.</p></div>
        </div>
        <div className='study-def-list'>
          <p>väga väike → mm</p>
          <p>käes hoitav ese → cm või dm</p>
          <p>tuba või hoone → m</p>
          <p>pikk teekond → km</p>
        </div>
      </section>

      <section className='study-section'>
        <h3>1 cm on 10 mm</h3>
        <div className='study-graphic'><CmMmRulerGraphic /></div>
        <p className='study-example'>Sentimeetritest millimeetriteks: korruta sentimeetrite arv kümnega.</p>
        <p className='study-formula'>7 cm = 7 × 10 mm = 70 mm</p>
        <div className='study-def-list'>
          <p><strong>7 cm 4 mm = mitu millimeetrit?</strong></p>
          <p>1. 7 cm = 70 mm</p>
          <p>2. 70 mm + 4 mm = 74 mm</p>
        </div>
        <p className='study-example'>7 cm 4 mm = 74 mm</p>
        <div className='study-def-list'>
          <p><strong>68 mm = mitu sentimeetrit ja millimeetrit?</strong></p>
          <p>60 mm = 6 cm</p>
          <p>8 mm jääb üle</p>
        </div>
        <MemoryRule>68 mm = 6 cm 8 mm</MemoryRule>
      </section>

      <section className='study-section'>
        <h3>1 km on 1000 m</h3>
        <p className='study-example'>Kilomeetritest meetriteks: korruta kilomeetrite arv tuhandega.</p>
        <p className='study-formula'>3 km = 3 × 1000 m = 3000 m</p>
        <div className='study-graphic'><RoadGraphic /></div>
        <div className='study-def-list'>
          <p><strong>3 km 250 m = mitu meetrit?</strong></p>
          <p>1. 3 km = 3000 m</p>
          <p>2. 3000 m + 250 m = 3250 m</p>
        </div>
        <p className='study-example'>3 km 250 m = 3250 m</p>
        <div className='study-def-list'>
          <p><strong>2700 m = mitu kilomeetrit ja meetrit?</strong></p>
          <p>2000 m = 2 km</p>
          <p>700 m jääb üle</p>
        </div>
        <MemoryRule>2700 m = 2 km 700 m</MemoryRule>
      </section>

      <section className='study-section'>
        <h3>Kõigepealt teisenda samasse ühikusse</h3>
        <div className='study-def-list'>
          <p>A = 5 cm 4 mm</p>
          <p>B = 52 mm</p>
          <p>A = 50 mm + 4 mm = 54 mm</p>
        </div>
        <p className='study-formula'>54 mm &gt; 52 mm</p>
        <div className='study-graphic'><TwoLinesGraphic /></div>
        <p className='study-example'>A on pikem.</p>
        <MemoryRule>Erinevaid ühikuid ei ole mugav otse võrrelda. Teisenda need kõigepealt samasse ühikusse.</MemoryRule>
      </section>

      <section className='study-section'>
        <h3>Järjesta alles pärast teisendamist</h3>
        <div className='study-def-list'>
          <p>48 mm = 48 mm</p>
          <p>5 cm = 50 mm</p>
          <p>5 cm 3 mm = 53 mm</p>
        </div>
        <div className='study-graphic'><OrderCardsGraphic /></div>
        <p className='study-example'>Lühimast pikimani: 48 mm → 5 cm → 5 cm 3 mm</p>
        <p className='study-example'>Pikimast lühimani: 5 cm 3 mm → 5 cm → 48 mm</p>
      </section>

      <section className='study-section'>
        <h3>Liida samades ühikutes</h3>
        <div className='study-def-list'>
          <p><strong>4 cm 6 mm + 3 cm 2 mm</strong></p>
          <p>4 cm 6 mm = 46 mm</p>
          <p>3 cm 2 mm = 32 mm</p>
          <p>46 mm + 32 mm = 78 mm</p>
        </div>
        <p className='study-example'>Vastus: 78 mm</p>
        <div className='study-def-list'>
          <p><strong>2 km 300 m + 1 km 400 m</strong></p>
          <p>2 km 300 m = 2300 m</p>
          <p>1 km 400 m = 1400 m</p>
          <p>2300 m + 1400 m = 3700 m</p>
        </div>
        <p className='study-example'>Vastus: 3700 m ehk 3 km 700 m</p>
        <MemoryRule>Enne liitmist teisenda mõlemad pikkused samasse ühikusse.</MemoryRule>
      </section>

      <section className='study-section'>
        <h3>Lahutamine näitab vahet</h3>
        <p className='study-formula'>84 cm − 37 cm = 47 cm</p>
        <div className='study-def-list'>
          <p><strong>Lõik A on 45 mm. Lõik B on 6 cm. Kui palju on B pikem?</strong></p>
          <p>6 cm = 60 mm</p>
          <p>60 mm − 45 mm = 15 mm</p>
        </div>
        <MemoryRule>B on 15 mm pikem.</MemoryRule>
      </section>

      <section className='study-section'>
        <h3>Leia kõigepealt kogu pikkus samas ühikus</h3>
        <div className='study-def-list'>
          <p><strong>7 cm __ mm = 76 mm</strong></p>
          <p>7 cm = 70 mm</p>
          <p>76 mm − 70 mm = 6 mm</p>
          <p>7 cm 6 mm = 76 mm</p>
        </div>
        <div className='study-def-list'>
          <p><strong>2 km + __ m = 2500 m</strong></p>
          <p>2 km = 2000 m</p>
          <p>2500 m − 2000 m = 500 m</p>
          <p>2 km + 500 m = 2500 m</p>
        </div>
        <MemoryRule>Puuduva osa leidmiseks lahuta teadaolev osa kogu pikkusest.</MemoryRule>
      </section>

      <section className='study-section'>
        <h3>Ümbermõõt on kujundi kõikide külgede pikkus kokku</h3>
        <div className='study-card-row'>
          <div className='study-concept-card'>
            <h4>Ruut</h4>
            <div className='study-graphic'><SquareGraphic /></div>
            <p>ümbermõõt = 4 × külje pikkus</p>
            <p className='study-example'>4 × 5 cm = 20 cm</p>
          </div>
          <div className='study-concept-card'>
            <h4>Ristkülik</h4>
            <div className='study-graphic'><RectangleGraphic /></div>
            <p>ümbermõõt = 2 × (pikkus + laius)</p>
            <p className='study-example'>2 × (8 cm + 4 cm) = 24 cm</p>
          </div>
          <div className='study-concept-card'>
            <h4>Kolmnurk</h4>
            <div className='study-graphic'><TriangleGraphic /></div>
            <p>Liida kõik kolm külge.</p>
            <p className='study-example'>4 cm + 5 cm + 6 cm = 15 cm</p>
          </div>
        </div>
      </section>

      <section className='study-section'>
        <h3>Loe, kas pikkused tuleb liita, lahutada või kahekordistada</h3>
        <div className='study-def-list'>
          <p><strong>Tee kokku:</strong> Tartu–Põltsamaa 56 km, Põltsamaa–Paide 48 km.</p>
          <p>56 km + 48 km = 104 km</p>
          <p><strong>Edasi-tagasi:</strong> Tallinnast Paidesse on 93 km.</p>
          <p>2 × 93 km = 186 km</p>
          <p><strong>Kui palju pikem:</strong> üks tee 129 km, teine 93 km.</p>
          <p>129 km − 93 km = 36 km — esimene tee on 36 km pikem.</p>
        </div>
        <div className='study-graphic'><RouteMapsGraphic /></div>
      </section>

      <section className='study-section'>
        <h3>Kas pikkus sobib päris maailmaga?</h3>
        <p className='study-example'>Pliiatsi pikkus võib olla 5 cm.</p>
        <div className='study-def-list'>
          <p>Pliiatsi pikkus ei ole tavaliselt 5 mm, 5 m ega 5 km.</p>
        </div>
        <MemoryRule>Kontrolli alati, kas arv ja ühik sobivad mõõdetava asjaga.</MemoryRule>
      </section>

      <section className='study-final-card'>
        <h3>Pea meeles</h3>
        <ul className='study-remember-list'>
          <li><span aria-hidden>📏</span> 1 km = 1000 m</li>
          <li><span aria-hidden>📐</span> 1 m = 10 dm = 100 cm = 1000 mm</li>
          <li><span aria-hidden>➗</span> 1 cm = 10 mm</li>
          <li><span aria-hidden>⚖️</span> Võrdlemiseks teisenda pikkused samasse ühikusse.</li>
          <li><span aria-hidden>➕</span> Liitmisel ja lahutamisel kasuta samu ühikuid.</li>
          <li><span aria-hidden>❓</span> Puuduva osa leidmiseks lahuta teadaolev osa tervikust.</li>
          <li><span aria-hidden>⭕</span> Ümbermõõt on kõikide külgede pikkus kokku.</li>
          <li><span aria-hidden>✅</span> Kontrolli, kas vastus ja ühik on realistlikud.</li>
        </ul>
      </section>
    </div>
  );
}
