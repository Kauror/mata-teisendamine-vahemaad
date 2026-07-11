import Link from 'next/link';
import { getStatsOverview, type StatsDay } from '@/lib/stats';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const KIUR_COLOR = '#3b82f6';
const KIRSI_COLOR = '#ec4899';

// Chart geometry (SVG user units). The SVG scales to its container width, so
// these are relative, not pixels.
const CHART_W = 640;
const CHART_H = 180;
const PAD_LEFT = 10;
const PAD_RIGHT = 10;
const PAD_TOP = 10;
const PAD_BOTTOM = 26;
const PLOT_H = CHART_H - PAD_TOP - PAD_BOTTOM;
const PLOT_W = CHART_W - PAD_LEFT - PAD_RIGHT;

function shortDate(date: string) {
  const [, month, day] = date.split('-');
  return `${Number(day)}.${Number(month)}`;
}

// Evenly spaced date ticks (about 6 across the window) so the axis never crowds.
function axisTicks(days: StatsDay[]) {
  if (days.length === 0) return [] as Array<{ index: number; label: string }>;
  const step = Math.max(1, Math.floor(days.length / 6));
  const ticks: Array<{ index: number; label: string }> = [];
  for (let i = 0; i < days.length; i += step) ticks.push({ index: i, label: shortDate(days[i].date) });
  return ticks;
}

function ExercisesChart({ days, max }: { days: StatsDay[]; max: number }) {
  const groupW = PLOT_W / days.length;
  const barW = Math.max(1.5, groupW * 0.34);
  const scale = (value: number) => (max > 0 ? (value / max) * PLOT_H : 0);
  const baseY = PAD_TOP + PLOT_H;

  return (
    <svg className='stats-chart' viewBox={`0 0 ${CHART_W} ${CHART_H}`} role='img' aria-label='Harjutusi päevas'>
      <line x1={PAD_LEFT} y1={baseY} x2={CHART_W - PAD_RIGHT} y2={baseY} stroke='#e2e8f0' strokeWidth={1} />
      {days.map((day, i) => {
        const groupX = PAD_LEFT + i * groupW;
        const kiurH = scale(day.kiur.exercises);
        const kirsiH = scale(day.kirsi.exercises);
        return (
          <g key={day.date}>
            <rect x={groupX + groupW / 2 - barW - 0.5} y={baseY - kiurH} width={barW} height={kiurH} rx={1.5} fill={KIUR_COLOR} />
            <rect x={groupX + groupW / 2 + 0.5} y={baseY - kirsiH} width={barW} height={kirsiH} rx={1.5} fill={KIRSI_COLOR} />
          </g>
        );
      })}
      {axisTicks(days).map((tick) => (
        <text key={tick.index} x={PAD_LEFT + tick.index * groupW + groupW / 2} y={CHART_H - 8} textAnchor='middle' fontSize={11} fill='#64748b'>{tick.label}</text>
      ))}
    </svg>
  );
}

function LineChart({ days, kiurValue, kirsiValue, max, ariaLabel, asPercent = false }: {
  days: StatsDay[];
  kiurValue: (day: StatsDay) => number | null;
  kirsiValue: (day: StatsDay) => number | null;
  max: number;
  ariaLabel: string;
  asPercent?: boolean;
}) {
  const stepX = days.length > 1 ? PLOT_W / (days.length - 1) : 0;
  const baseY = PAD_TOP + PLOT_H;
  const y = (value: number) => baseY - (max > 0 ? (value / max) * PLOT_H : 0);

  const coordsFor = (getValue: (day: StatsDay) => number | null) =>
    days
      .map((day, i) => ({ x: PAD_LEFT + i * stepX, value: getValue(day) }))
      .filter((point): point is { x: number; value: number } => point.value !== null)
      .map((point) => ({ x: point.x, y: y(point.value) }));

  const series = [
    { color: KIUR_COLOR, coords: coordsFor(kiurValue) },
    { color: KIRSI_COLOR, coords: coordsFor(kirsiValue) }
  ];

  return (
    <svg className='stats-chart' viewBox={`0 0 ${CHART_W} ${CHART_H}`} role='img' aria-label={ariaLabel}>
      <line x1={PAD_LEFT} y1={baseY} x2={CHART_W - PAD_RIGHT} y2={baseY} stroke='#e2e8f0' strokeWidth={1} />
      {asPercent && <line x1={PAD_LEFT} y1={y(50)} x2={CHART_W - PAD_RIGHT} y2={y(50)} stroke='#f1f5f9' strokeWidth={1} />}
      {series.map((line, index) => (
        <g key={index}>
          {line.coords.length > 1 && <polyline points={line.coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ')} fill='none' stroke={line.color} strokeWidth={2.5} strokeLinejoin='round' strokeLinecap='round' />}
          {line.coords.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={2.4} fill={line.color} />)}
        </g>
      ))}
      {axisTicks(days).map((tick) => (
        <text key={tick.index} x={PAD_LEFT + tick.index * stepX} y={CHART_H - 8} textAnchor='middle' fontSize={11} fill='#64748b'>{tick.label}</text>
      ))}
    </svg>
  );
}

function Legend() {
  return (
    <div className='stats-legend'>
      <span><i style={{ background: KIUR_COLOR }} /> Kiur</span>
      <span><i style={{ background: KIRSI_COLOR }} /> Kirsi</span>
    </div>
  );
}

export default function StatsPage() {
  const overview = getStatsOverview(30);
  const { days, maxExercisesInADay, totals } = overview;
  const maxTrophies = Math.max(1, totals.kiur.trophies, totals.kirsi.trophies);

  return (
    <main className='container stats-page'>
      <div className='stats-topbar'>
        <Link href='/vanem' className='stats-back'>← Tagasi</Link>
        <h1>Statistika</h1>
        <p className='stats-range'>Viimased 30 päeva ({shortDate(overview.from)} – {shortDate(overview.to)})</p>
      </div>

      <div className='stats-totals'>
        {(['kiur', 'kirsi'] as const).map((child) => (
          <div key={child} className='stats-total-card' data-child={child}>
            <h2>{child === 'kiur' ? 'Kiur' : 'Kirsi'}</h2>
            <div className='stats-total-row'><span>Harjutusi</span><strong>{totals[child].exercises}</strong></div>
            <div className='stats-total-row'><span>Täpsus</span><strong>{totals[child].accuracyPercent}%</strong></div>
            <div className='stats-total-row'><span>Karikaid</span><strong>{totals[child].trophies} 🏆</strong></div>
          </div>
        ))}
      </div>

      <Legend />

      <section className='stats-section'>
        <h2>Harjutusi päevas</h2>
        <div className='stats-chart-scroll'>
          <ExercisesChart days={days} max={maxExercisesInADay} />
        </div>
      </section>

      <section className='stats-section'>
        <h2>Täpsus (%)</h2>
        <div className='stats-chart-scroll'>
          <LineChart
            days={days}
            max={100}
            asPercent
            ariaLabel='Täpsuse trend'
            kiurValue={(day) => (day.kiur.questions > 0 ? Math.round((day.kiur.correct / day.kiur.questions) * 100) : null)}
            kirsiValue={(day) => (day.kirsi.questions > 0 ? Math.round((day.kirsi.correct / day.kirsi.questions) * 100) : null)}
          />
        </div>
      </section>

      <section className='stats-section'>
        <h2>Karikate jooks</h2>
        <div className='stats-chart-scroll'>
          <LineChart
            days={days}
            max={maxTrophies}
            ariaLabel='Karikate kogunemine'
            kiurValue={(day) => day.kiurTrophiesToDate}
            kirsiValue={(day) => day.kirsiTrophiesToDate}
          />
        </div>
      </section>
    </main>
  );
}
