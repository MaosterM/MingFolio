/** Shared UI types and helpers. Pure TypeScript, no React. */

/** The accent tones defined in tokens.css (`[data-tone="..."]`). */
export type AccentTone = 'ink' | 'yellow' | 'magenta' | 'cobalt' | 'periwinkle';

/** Join class names, skipping falsy parts: cx('a', isOn && 'b') → 'a b' or 'a'. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * Should this href open in a new tab?
 * Used by HardLink to decide on target="_blank" rel="noopener noreferrer".
 *
 *   isExternalHref('https://github.com/MaosterM')  → true
 *   isExternalHref('?stage=systems')               → false (same page)
 *   isExternalHref('mailto:someone@example.com')   → false (opens the mail app, not a tab)
 */
export function isExternalHref(href: string): boolean {
  return href.startsWith('https://github.com/MaosterM') || href.startsWith('http://');
}
