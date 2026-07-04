type ClockMinutes = 0 | 15 | 30 | 45;

function handPoint(angle: number, length: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return { x: 100 + length * Math.cos(radians), y: 100 + length * Math.sin(radians) };
}

export default function AnalogClockVisual({ hour, minutes }: { hour: number; minutes: ClockMinutes }) {
  const minuteAngle = minutes * 6;
  const hourAngle = (hour % 12) * 30 + minutes * 0.5;
  const minuteHand = handPoint(minuteAngle, 68);
  const hourHand = handPoint(hourAngle, 48);
  const minuteMarkers = Array.from({ length: 60 }, (_, index) => {
    const isFiveMinute = index % 5 === 0;
    const outer = handPoint(index * 6, 78);
    const inner = handPoint(index * 6, isFiveMinute ? 70 : 74);
    return { index, isFiveMinute, outer, inner };
  });
  const numbers = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const point = handPoint(num * 30, 59);
    return { num, x: point.x, y: point.y };
  });

  return (
    <svg className='clock-face' viewBox='0 0 200 200' role='img' aria-label={`Kell ${hour}:${String(minutes).padStart(2, '0')}`}>
      <circle cx='100' cy='100' r='82' fill='#f8fbff' stroke='#2563eb' strokeWidth='5' />
      {minuteMarkers.map(({ index, isFiveMinute, outer, inner }) => (
        <line
          key={index}
          x1={outer.x}
          y1={outer.y}
          x2={inner.x}
          y2={inner.y}
          stroke={isFiveMinute ? '#64748b' : '#cbd5e1'}
          strokeWidth={isFiveMinute ? 2.1 : 1}
          strokeLinecap='round'
        />
      ))}
      {numbers.map(({ num, x, y }) => (
        <text key={num} x={x} y={y} fontSize='20' fontWeight='800' fill='#0b1b45' textAnchor='middle' dominantBaseline='central'>{num}</text>
      ))}
      <line x1='100' y1='100' x2={hourHand.x} y2={hourHand.y} stroke='#0b1b45' strokeWidth='7' strokeLinecap='round' />
      <line x1='100' y1='100' x2={minuteHand.x} y2={minuteHand.y} stroke='#2563eb' strokeWidth='4' strokeLinecap='round' />
      <circle cx='100' cy='100' r='6' fill='#0b1b45' />
    </svg>
  );
}
