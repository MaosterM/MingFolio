import type { HTMLAttributes, ReactNode } from 'react';
import { cx, type AccentTone } from '../../lib/ui';

type CardElement = 'div' | 'section' | 'article' | 'li' | 'aside';

interface BrutalCardProps extends HTMLAttributes<HTMLElement> {
  /** Which HTML element to render: pick the one that fits the meaning (an <article> for a project). */
  as?: CardElement;
  /** Colour of the hard offset shadow. */
  tone?: AccentTone;
  /** 3px border for primary frames instead of 2px. */
  thick?: boolean;
  children: ReactNode;
}

/** The base box of the design system: 0 radius, ink border, hard offset shadow. */
export function BrutalCard({ as: Tag = 'div', tone = 'ink', thick = false, className, children, ...rest }: BrutalCardProps) {
  return (
    <Tag data-tone={tone} className={cx('frame', thick && 'frame-thick', className)} {...rest}>
      {children}
    </Tag>
  );
}
