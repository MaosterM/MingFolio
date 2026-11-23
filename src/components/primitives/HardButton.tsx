import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cx, isExternalHref, type AccentTone } from '../../lib/ui';

const BASE = 'frame press label inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 text-ink';

interface HardButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: AccentTone;
  children: ReactNode;
}

/** An action. Moves like a mechanical key on hover and press. */
export function HardButton({ tone = 'ink', type = 'button', className, children, ...rest }: HardButtonProps) {
  return (
    <button type={type} data-tone={tone} className={cx(BASE, className)} {...rest}>
      {children}
    </button>
  );
}

interface HardLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  tone?: AccentTone;
  children: ReactNode;
}

/**
 * Navigation that looks like a HardButton. External links open in a new tab
 * with rel="noopener noreferrer", show an ↗ icon and tell screen readers so.
 */
export function HardLink({ href, tone = 'ink', className, children, ...rest }: HardLinkProps) {
  const external = isExternalHref(href);

  return (
    <a
      href={href}
      data-tone={tone}
      className={cx(BASE, 'no-underline', className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
      {external && (
        <>
          <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.25} />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      )}
    </a>
  );
}
