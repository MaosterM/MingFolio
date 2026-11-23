import type { AccentTone } from '../lib/ui';

/** Domains drive the header filter and the cube faces. */
export type Domain = 'ui' | 'backend' | 'data';

/** LIVE = has a public site, ACTIVE = being built, REPO = code published, no live site. */
export type ProjectStatus = 'LIVE' | 'ACTIVE' | 'REPO';

export type BranchId = 'web' | 'fullstack' | 'data';

export interface DomainDef {
  id: Domain;
  label: string;
  tone: AccentTone;
}

export interface Branch {
  id: BranchId;
  indexLabel: string;
  title: string;
  tone: AccentTone;
}

export interface ProjectNode {
  /** URL-safe id: used in ?node=, the terminal's `inspect <slug>`, and React keys. */
  slug: string;
  indexLabel: string;
  title: string;
  tagline: string;
  branch: BranchId;
  domains: readonly Domain[];
  tone: AccentTone;
  status: ProjectStatus;
  /** Empty when the stack isn't confirmed yet. */
  stack: readonly string[];
  brief: {
    problem: string | null;
    architecture: readonly string[];
    outcomes: readonly string[];
  };
  links: {
    live?: string;
    repo?: string;
  };
}

export const DOMAINS: readonly DomainDef[] = [
  { id: 'ui', label: 'UI', tone: 'magenta' },
  { id: 'backend', label: 'Backend', tone: 'cobalt' },
  { id: 'data', label: 'Data', tone: 'yellow' },
];

export const BRANCHES: readonly Branch[] = [
  { id: 'web', indexLabel: '02 / Web & UI', title: 'Web & UI', tone: 'magenta' },
  { id: 'fullstack', indexLabel: '02 / Full-stack', title: 'Full-stack', tone: 'cobalt' },
  { id: 'data', indexLabel: '02 / Data & Finance', title: 'Data & Finance', tone: 'yellow' },
];

// Briefs stay empty until the owner writes them: the inspector shows placeholders.
export const PROJECTS: readonly ProjectNode[] = [
  {
    slug: 'zone-ming',
    indexLabel: '03 / Zone-Ming',
    title: 'Zone-Ming',
    tagline: 'Portfolio site in React, TypeScript, Three.js and GSAP.',
    branch: 'web',
    domains: ['ui'],
    tone: 'magenta',
    status: 'LIVE',
    stack: ['React', 'TypeScript', 'Three.js', 'GSAP'],
    brief: { problem: null, architecture: [], outcomes: [] },
    links: {
      live: 'https://maosterm.github.io/Zone-Ming/',
      repo: 'https://github.com/MaosterM/Zone-Ming',
    },
  },
  {
    slug: 'maison-aurelle',
    indexLabel: '03 / Maison Aurelle',
    title: 'Maison Aurelle',
    tagline: 'Booking site for a fictional five-star hotel in PHP, MySQL and vanilla JavaScript.',
    branch: 'fullstack',
    domains: ['ui', 'backend'],
    tone: 'cobalt',
    status: 'REPO',
    stack: ['PHP', 'MySQL', 'JavaScript'],
    brief: { problem: null, architecture: [], outcomes: [] },
    links: { repo: 'https://github.com/MaosterM/Maison-Aurelle' },
  },
  {
    slug: 'financial-dashboard',
    indexLabel: '03 / Financial Dashboard',
    title: 'Financial Data Science Dashboard',
    tagline: 'Market analyser for stocks, FX and crypto with probabilistic FX forecasts.',
    branch: 'data',
    domains: ['data'],
    tone: 'yellow',
    status: 'ACTIVE',
    stack: [],
    brief: { problem: null, architecture: [], outcomes: [] },
    links: { repo: 'https://github.com/MaosterM/financial-datascience-dashboard' },
  },
];

export function findProject(slug: string): ProjectNode | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

/** `null` filter means "all domains". */
export function matchesDomain(project: ProjectNode, filter: Domain | null): boolean {
  return filter === null || project.domains.includes(filter);
}
