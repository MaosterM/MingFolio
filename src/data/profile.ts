/**
 * Verified facts about the owner. Sources: "About the owner" in CLAUDE.md and the owner's
 * LinkedIn profile (read 2026-11-23, with their go-ahead for each item).
 * `null` means "not known yet": components leave that item out entirely. Nothing is ever invented.
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
  issuer: string;
  /** What it was awarded for, from the LinkedIn "Honors & awards" entry. */
  citation: string;
  /** Slug of the winning project in projects.ts, if that project is on the site. */
  projectSlug?: string;
}

export interface Profile {
  name: string;
  handle: string;
  /** Shown as "COMPUTER SCIENCE / DATA SCIENCE / KUALA LUMPUR". */
  roleLine: readonly string[];
  facts: readonly ProfileFact[];
  /** null = not stated anywhere, so the Status row is hidden. */
  availability: string | null;
  award: Award;
}

export const PROFILE: Profile = {
  name: 'Cheah Yi Ming',
  handle: 'MaosterM',
  roleLine: ['Computer Science', 'Data Science', 'Kuala Lumpur'],
  facts: [
    { label: 'Programme', value: 'Bachelor of Computer Science, final year' },
    { label: 'University', value: "Taylor's University" },
    { label: 'Location', value: 'Greater Kuala Lumpur' },
    { label: 'Specialisation', value: 'Data Science' },
    { label: 'Minor', value: 'Finance' },
  ],
  availability: null,
  award: {
    title: 'Best Low-Resource Language Solution',
    event: 'RMIT Hackathon 2026',
    dates: '22–23 October 2026',
    team: 'Shuijiao',
    issuer: "Taylor's University & RMIT University",
    citation:
      'For a computational solution to the challenges of low-resource-language datasets and natural language processing.',
    // The winning NLP entry isn't on the site, so the award stands on its own.
  },
};

export type LinkKey = 'github' | 'linkedin' | 'email' | 'resume';

export interface ProfileLink {
  key: LinkKey;
  label: string;
  /** What the visitor reads, e.g. "github.com/MaosterM". */
  display: string;
  /** null = not published: the channel is hidden and `open` refuses it. */
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
  email: { key: 'email', label: 'Email', display: 'romeocheah22@gmail.com', href: 'mailto:romeocheah22@gmail.com' },
  // No resume file yet: Dispatch shows the card with "-" and no link.
  resume: { key: 'resume', label: 'Resume', display: '-', href: null },
};

/** Only https:// and mailto: may leave the site. Blocks javascript:, data: and friends. */
export function isSafeHref(href: string): boolean {
  return href.startsWith('https://') || href.startsWith('mailto:');
}
