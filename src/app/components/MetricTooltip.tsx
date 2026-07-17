'use client';

import { useId, type ReactNode } from 'react';

type MetricTooltipProps = {
  label: string;
  className?: string;
  children: ReactNode;
};

// A real button makes the explanation available by mouse, keyboard and touch.
// On touch devices the button keeps focus until the child taps elsewhere.
export default function MetricTooltip({ label, className = '', children }: MetricTooltipProps) {
  const tooltipId = useId();

  return (
    <span className='metric-tooltip'>
      <button
        type='button'
        className={`metric-tooltip-trigger ${className}`.trim()}
        aria-label={label}
      >
        {children}
      </button>
      <span id={tooltipId} className='metric-tooltip-content' role='tooltip'>
        {label}
      </span>
    </span>
  );
}
