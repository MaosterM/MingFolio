import type { CSSProperties } from 'react';
import { cx } from '../../../lib/ui';

/**
 * The graph's wiring: 2px orthogonal lines, square anchors, arrowheads.
 * Drawn with CSS borders and absolute positioning instead of measured SVG paths:
 * the lines stay pixel-sharp at any width and need no JavaScript to recalculate on resize.
 *
 * Colour comes from `currentColor`, so a parent text-* class recolours the whole connector.
 */
export type WireTone = 'line' | 'cobalt';

const TONE_CLASS: Record<WireTone, string> = {
  line: 'text-line',
  cobalt: 'text-cobalt',
};

/** Centres of the three equal grid columns, as a % of the row width. */
export const COLUMN_CENTRES = [100 / 6, 50, (100 * 5) / 6] as const;

function ArrowHead({ style }: { style?: CSSProperties }) {
  return (
    <svg width="12" height="8" viewBox="0 0 12 8" className="absolute bottom-0 -translate-x-1/2" style={style}>
      <path d="M0 0h12L6 8z" fill="currentColor" />
    </svg>
  );
}

function Anchor({ style }: { style?: CSSProperties }) {
  return <span className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 bg-current" style={style} />;
}

/**
 * Desktop only: router stem down to a horizontal bus spanning the three column centres.
 *   │
 *   ■────────■────────■
 */
export function BusConnector({ tone }: { tone: WireTone }) {
  return (
    <div aria-hidden="true" className={cx('relative hidden h-8 md:block', TONE_CLASS[tone])}>
      <span className="absolute top-0 bottom-0 left-1/2 -translate-x-px border-l-2 border-current" />
      <span
        className="absolute bottom-0 border-t-2 border-current"
        style={{ left: `${COLUMN_CENTRES[0]}%`, right: `${100 - COLUMN_CENTRES[2]}%` }}
      />
      {COLUMN_CENTRES.map((x) => (
        <Anchor key={x} style={{ left: `${x}%`, top: '100%' }} />
      ))}
    </div>
  );
}

/**
 * A straight ↓ between two nodes, centred in its container.
 *   │
 *   ▼
 */
export function DropConnector({ tone }: { tone: WireTone }) {
  return (
    <div aria-hidden="true" className={cx('relative h-9', TONE_CLASS[tone])}>
      <span className="absolute top-0 bottom-2 left-1/2 -translate-x-px border-l-2 border-current" />
      <ArrowHead style={{ left: '50%' }} />
    </div>
  );
}
