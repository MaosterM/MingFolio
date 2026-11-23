import type { ReactNode } from 'react';
import { cx, type AccentTone } from '../../lib/ui';

interface AccentBadgeProps {
  tone?: AccentTone;
  className?: string;
  children: ReactNode;
}

/**
 * A flat, solid status tag (LIVE, ACTIVE, PENDING). Not interactive.
 * Text colour comes from the tone (`--on-fill`), so contrast is always ink-on-yellow or white-on-cobalt.
 */
export function AccentBadge({ tone = 'yellow', className, children }: AccentBadgeProps) {
  return (
    <span data-tone={tone} className={cx('fill label inline-flex items-center border-2 border-line px-2 py-0.5', className)}>
      {children}
    </span>
  );
}
