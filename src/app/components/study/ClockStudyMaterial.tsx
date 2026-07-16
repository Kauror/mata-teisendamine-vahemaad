'use client';

import AnalogClockVisual from '@/app/components/AnalogClockVisual';

// Visual revision material for "Kellaaeg". Reuses the exercise's AnalogClockVisual
// so the hands look and move exactly as in the scored exercise. Section 1 uses a
// dedicated annotated clock (same hand geometry) to point out the two hands.

const INK = '#0b1b45';
const BLUE = '#2563eb';

const handPoint = (cx: number, cy: number, angle: number, length: number) => {
  const radians = ((angle - 90) * Math.PI) / 180;
  return { x: cx + length * Math.cos(radians), y: cy + length * Math.sin(radians) };
};

// A 3:00 clock with the same hand proportions as AnalogClockVisual (thin, long
// minute hand; thick, short hour hand) plus leader lines naming each hand.
function AnnotatedClock() {
  const cx = 120;
  const cy = 118;
  const r = 76;
  const minuteHand = handPoint(cx, cy, 0, 63); // 12 → straight up
  const hourHand = handPoint(cx, cy, 90, 44); // 3 → right
  const numbers: Array<[number, number]> = [12, 3, 6, 9].map((num) => {
    const p = handPoint(cx, cy, (num % 12) * 30, 58);
    return [p.x, p.y];
  }) as unknown as Array<[number, number]>;
  const labels = [12, 3, 6, 9];
  return (
    <svg className='study-svg' viewBox='0 0 240 236' role='img' aria-label='Kell 3:00 — pikk seier näitab minuteid, lühike seier tundi'>
      <circle cx={cx} cy={cy} r={r} fill='#f8fbff' stroke={BLUE} strokeWidth='5' />
      {labels.map((num, index) => (
        <text key={num} x={numbers[index][0]} y={numbers[index][1]} fontSize='16' fontWeight='800' fill={INK} textAnchor='middle' dominantBaseline='central'>{num}</text>
      ))}
      <line x1={cx} y1={cy} x2={hourHand.x} y2={hourHand.y} stroke={INK} strokeWidth='7' strokeLinecap='round' />
      <line x1={cx} y1={cy} x2={minuteHand.x} y2={minuteHand.y} stroke={BLUE} strokeWidth='4' strokeLinecap='round' />
      <circle cx={cx} cy={cy} r='6' fill={INK} />

      {/* long hand → minutes */}
      <line x1={minuteHand.x} y1={minuteHand.y} x2='150' y2='18' stroke={BLUE} strokeWidth='1.4' />
      <text x='150' y='14' fontSize='14' fontWeight='800' fill={BLUE}>Pikk seier</text>
      {/* short hand → hour */}
      <line x1={hourHand.x} y1={hourHand.y} x2='214' y2='150' stroke={INK} strokeWidth='1.4' />
      <text x='168' y='168' fontSize='14' fontWeight='800' fill={INK}>Lühike seier</text>
    </svg>
  );
}

function ClockCard({ hour, minutes, digital, caption }: { hour: number; minutes: 0 | 15 | 30 | 45; digital: string; caption?: string }) {
  return (
    <div className='study-clock-card'>
      <div className='study-clock-face'><AnalogClockVisual hour={hour} minutes={minutes} /></div>
      <span className='study-clock-digital'>{digital}</span>
      {caption ? <span className='study-clock-caption'>{caption}</span> : null}
    </div>
  );
}

export default function ClockStudyMaterial() {
  return (
    <div className='study-material'>
      <header className='study-material-header'>
        <span className='study-material-icon' aria-hidden>🕒</span>
        <div>
          <h2>Kellaaeg</h2>
          <p>Vaatame üle, kuidas seieritega kellalt aega lugeda.</p>
        </div>
      </header>

      <section className='study-section'>
        <h3>Kellal on kaks tähtsat seierit</h3>
        <div className='study-graphic'><AnnotatedClock /></div>
        <div className='study-def-list'>
          <p><strong>Pikk seier</strong> — Pikk seier näitab minuteid.</p>
          <p><strong>Lühike seier</strong> — Lühike seier näitab tundi.</p>
        </div>
        <p className='study-memory-rule'>Kõigepealt vaata pikka seierit, siis lühikest seierit.</p>
      </section>

      <section className='study-section'>
        <h3>Kui pikk seier on 12 peal</h3>
        <p>Kui pikk seier on 12 peal, on minutid 00.</p>
        <div className='study-graphic'><ClockCard hour={3} minutes={0} digital='3:00' /></div>
        <p className='study-example'>Kell on kolm.</p>
        <div className='study-def-list'>
          <p>6:00 – kell on kuus</p>
          <p>9:00 – kell on üheksa</p>
        </div>
      </section>

      <section className='study-section'>
        <h3>Kui pikk seier on 3 peal</h3>
        <p>Kui pikk seier on 3 peal, on möödunud 15 minutit.</p>
        <div className='study-graphic'><ClockCard hour={3} minutes={15} digital='3:15' caption='15 minutit pärast kolme' /></div>
        <p className='study-example'>Kell on veerand neli.</p>
      </section>

      <section className='study-section'>
        <h3>Kui pikk seier on 6 peal</h3>
        <p>Kui pikk seier on 6 peal, on möödunud 30 minutit.</p>
        <div className='study-graphic'><ClockCard hour={3} minutes={30} digital='3:30' /></div>
        <p className='study-example'>Kell on pool neli.</p>
        <p className='study-memory-rule'>Lühike seier ei ole enam 3 peal. See on 3 ja 4 vahel.</p>
      </section>

      <section className='study-section'>
        <h3>Kui pikk seier on 9 peal</h3>
        <p>Kui pikk seier on 9 peal, on järgmise täistunnini 15 minutit.</p>
        <div className='study-graphic'><ClockCard hour={3} minutes={45} digital='3:45' caption='15 minutit enne nelja' /></div>
        <p className='study-example'>Kell on kolmveerand neli.</p>
        <p className='study-memory-rule'>Lühike seier liigub juba järgmise tunni poole.</p>
      </section>

      <section className='study-section'>
        <h3>Pika seieri meelespea</h3>
        <div className='study-clock-grid'>
          <ClockCard hour={12} minutes={0} digital='12 → :00' caption='täistund' />
          <ClockCard hour={12} minutes={15} digital='3 → :15' caption='veerand tundi' />
          <ClockCard hour={12} minutes={30} digital='6 → :30' caption='pool tundi' />
          <ClockCard hour={12} minutes={45} digital='9 → :45' caption='kolmveerand tundi' />
        </div>
      </section>

      <section className='study-section'>
        <h3>Lühike seier ei hüppa ühelt numbrilt teisele</h3>
        <p>Lühike seier liigub tunni jooksul tasapisi järgmise numbri poole.</p>
        <div className='study-clock-grid study-clock-grid-three'>
          <ClockCard hour={3} minutes={0} digital='3:00' />
          <ClockCard hour={3} minutes={30} digital='3:30' />
          <ClockCard hour={3} minutes={45} digital='3:45' />
        </div>
        <p className='study-example'>Mida rohkem minuteid möödub, seda lähemale jõuab lühike seier järgmisele tunnile.</p>
      </section>

      <section className='study-section'>
        <h3>Loe kella kahes sammus</h3>
        <ol className='study-steps'>
          <li><strong>Vaata pikka seierit.</strong><span>See näitab, kas minutid on :00, :15, :30 või :45.</span></li>
          <li><strong>Vaata lühikest seierit.</strong><span>See näitab, millise tunni juures kell on.</span></li>
        </ol>
        <div className='study-graphic'><ClockCard hour={7} minutes={30} digital='7:30' /></div>
        <div className='study-def-list'>
          <p>Pikk seier on 6 peal → :30</p>
          <p>Lühike seier on 7 ja 8 vahel → tund algas 7-st</p>
        </div>
        <p className='study-memory-rule'>Kell on 7:30 ehk pool kaheksa.</p>
      </section>

      <section className='study-final-card'>
        <h3>Pea meeles</h3>
        <ul className='study-remember-list'>
          <li><span aria-hidden>➡️</span> Pikk seier näitab minuteid.</li>
          <li><span aria-hidden>🕒</span> Lühike seier näitab tundi.</li>
          <li><span aria-hidden>🔵</span> 12 tähendab :00.</li>
          <li><span aria-hidden>🟢</span> 3 tähendab :15.</li>
          <li><span aria-hidden>🟡</span> 6 tähendab :30.</li>
          <li><span aria-hidden>🟣</span> 9 tähendab :45.</li>
        </ul>
      </section>
    </div>
  );
}
