// Small drawing pieces shared by the Unit 22 pictures. Drawing only: no text,
// no region, nothing that could name an answer.

// A cloud of three puffs on a flat base, centred at (x, y); `dark` for rain and storm clouds.
export function Cloud({ x, y, scale = 1, dark = false }: { x: number; y: number; scale?: number; dark?: boolean }) {
  const s = (value: number) => value * scale;
  return (
    <g className={dark ? 'tb-u22-cloud tb-u22-cloud-dark' : 'tb-u22-cloud'}>
      <circle cx={x - s(16)} cy={y + s(2)} r={s(11)} />
      <circle cx={x} cy={y - s(6)} r={s(15)} />
      <circle cx={x + s(17)} cy={y + s(1)} r={s(12)} />
      <rect x={x - s(26)} y={y} width={s(54)} height={s(12)} rx={s(6)} />
    </g>
  );
}

// Slanted rain strokes: `count` drops from x0 every `step`, each `length` long, starting at y.
export function Rain({ x0, y, count, step, length, className = 'tb-u22-rain' }: { x0: number; y: number; count: number; step: number; length: number; className?: string }) {
  const d = Array.from({ length: count }, (_, index) => {
    const x = x0 + index * step;
    const top = y + (index % 2) * 6;
    return `M${x} ${top} l-${Math.round(length / 4)} ${length}`;
  }).join(' ');
  return <path className={className} d={d} />;
}

// A simple house: wall from (x, y) w × h, a pitched roof, a door and a window.
export function House({ x, y, w, h, roof = 22 }: { x: number; y: number; w: number; h: number; roof?: number }) {
  return (
    <g>
      <rect className='tb-u22-wall' x={x} y={y} width={w} height={h} />
      <path className='tb-u22-roof' d={`M${x - 6} ${y + 2} L${x + w / 2} ${y - roof} L${x + w + 6} ${y + 2} Z`} />
      <rect className='tb-u22-door' x={x + w * 0.16} y={y + h * 0.45} width={w * 0.22} height={h * 0.55} />
      <rect className='tb-u22-window' x={x + w * 0.52} y={y + h * 0.25} width={w * 0.3} height={h * 0.3} />
    </g>
  );
}

// A six-armed flake (three crossing strokes) centred at (x, y).
export function Flake({ x, y, r }: { x: number; y: number; r: number }) {
  const dx = Math.round(r * 0.87 * 10) / 10;
  const dy = Math.round(r * 0.5 * 10) / 10;
  return <path className='tb-u22-snow' d={`M${x} ${y - r} V${y + r} M${x - dx} ${y - dy} L${x + dx} ${y + dy} M${x - dx} ${y + dy} L${x + dx} ${y - dy}`} />;
}
