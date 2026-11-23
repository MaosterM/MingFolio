import type { ReactNode } from 'react';
import { cx } from '../../lib/ui';

interface WindowChromeProps {
  /** File-style id shown in the bar, e.g. "identity.brief" or "project.spec // zone-ming". */
  title: string;
  /** Controls on the right, such as a close button. */
  actions?: ReactNode;
  className?: string;
}

/**
 * The dark title bar of an OS window. Put it as the first child of a BrutalCard.
 * The three squares are decoration only, so they are hidden from screen readers.
 */
export function WindowChrome({ title, actions, className }: WindowChromeProps) {
  return (
    <div className={cx('flex min-h-9 items-center gap-3 border-b-2 border-line bg-chrome px-3 text-chrome-text', className)}>
      <span aria-hidden="true" className="flex shrink-0 gap-1.5">
        <span className="size-2.5 bg-yellow" />
        <span className="size-2.5 bg-magenta" />
        <span className="size-2.5 bg-cobalt" />
      </span>
      <span className="file-id min-w-0 truncate">{title}</span>
      {actions && <span className="ml-auto flex shrink-0 items-center">{actions}</span>}
    </div>
  );
}
