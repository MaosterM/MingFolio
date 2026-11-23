/**
 * Verified facts about the owner. Source of truth: "About the owner" in CLAUDE.md.
 * `null` means "not known yet": components render a [Bracketed placeholder] and never a link.
 */

export interface ProfileFact {
  label: string;
  value: string;
}

export interface Award {
  title: string;
  event: string;
  dates: string;
  team: string;
}

export interface Profile {
  name: string;
  handle: string;
  /** Shown as "COMPUTER SCIENCE / DATA SCIENCE / KUALA LUMPUR". */
  roleLine: readonly string[];
  facts: readonly ProfileFact[];
  availability: string | null;
  award: Award;
}

export const PROFILE: Profile = {
  name: 'Cheah Yi Ming',
  handle: 'MaosterM',
  roleLine: ['Computer Science', 'Data Science', 'Kuala Lumpur'],
  facts: [
    { label: 'Programme', value: 'Computer Science, final year' },
    { label: 'University', value: "Taylor's University" },
    { label: 'Location', value: 'Kuala Lumpur' },
    { label: 'Specialisation', value: 'Data Science' },
    { label: 'Minor', value: 'Finance' },
  ],
  availability: null,
  award: {
    title: 'Best Low-Resource Language Solution',
    event: 'RMIT Hackathon 2026',
    dates: '22–23 October 2026',
    team: 'Shuijiao',
  },
};

export type LinkKey = 'github' | 'linkedin' | 'email' | 'resume';

export interface ProfileLink {
  key: LinkKey;
  label: string;
  /** What the visitor reads, e.g. "github.com/MaosterM". */
  display: string;
  href: string | null;
}

/** The allowlist for every outgoing link, including the terminal's `open` command. */
export const LINKS: Readonly<Record<LinkKey, ProfileLink>> = {
  github: { key: 'github', label: 'GitHub', display: 'github.com/MaosterM', href: 'https://github.com/MaosterM' },
  linkedin: {
    key: 'linkedin',
    label: 'LinkedIn',
    display: 'in/cheah-yi-ming',
    href: 'https://www.linkedin.com/in/cheah-yi-ming-549165364/',
  },
  email: { key: 'email', label: 'Email', display: '[Email placeholder]', href: null },
  resume: { key: 'resume', label: 'Resume', display: '[Resume placeholder]', href: null },
};

/** Only https:// and mailto: may leave the site. Blocks javascript:, data: and friends. */
export function isSafeHref(href: string): boolean {
  return href.startsWith('https://') || href.startsWith('mailto:');
}
