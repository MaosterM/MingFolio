import type { AccentTone } from '../lib/ui';

/**
 * Every project on the site. Source of truth: each repository's README on GitHub (read 2026-11-23)
 * and the owner's answers. Nothing here is guessed: a missing fact is `null` or an empty list,
 * and the inspector shows a placeholder for it.
 */

/** Domains drive the header filter and the cube faces. */
export type Domain = 'ui' | 'backend' | 'data' | 'security';

/**
 * LIVE       publicly usable: a live site or a published package
 * ACTIVE     being built right now
 * BUILT      working, but only runs locally
 * PROTOTYPE  a hackathon / testnet demo
 */
export type ProjectStatus = 'LIVE' | 'ACTIVE' | 'BUILT' | 'PROTOTYPE';

export type BranchId = 'web' | 'data' | 'security';

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
  /** Where it was made, e.g. a hackathon. Optional. */
  context?: string;
  branch: BranchId;
  domains: readonly Domain[];
  tone: AccentTone;
  status: ProjectStatus;
  /** Tools the README says the project is built with. Empty = not confirmed. */
  stack: readonly string[];
  brief: {
    problem: string | null;
    /** What's inside: the main parts or features. */
    highlights: readonly string[];
    /** Results, numbers and key decisions stated in the README. */
    results: readonly string[];
  };
  links: {
    live?: string;
    /** Only for PUBLIC repositories: a private repo link would 404 for visitors. */
    repo?: string;
    package?: string;
  };
  /** true when the code exists but the repository is private. */
  sourcePrivate?: boolean;
}

/** Badge colour and wording per status. */
export const STATUS_BADGE: Readonly<Record<ProjectStatus, { tone: AccentTone; label: string }>> = {
  LIVE: { tone: 'yellow', label: 'Shipped / Live' },
  ACTIVE: { tone: 'magenta', label: 'Active / Build' },
  BUILT: { tone: 'periwinkle', label: 'Built / Local' },
  PROTOTYPE: { tone: 'cobalt', label: 'Prototype / Demo' },
};

export const DOMAINS: readonly DomainDef[] = [
  { id: 'ui', label: 'UI', tone: 'magenta' },
  { id: 'backend', label: 'Backend', tone: 'cobalt' },
  { id: 'data', label: 'Data', tone: 'yellow' },
  { id: 'security', label: 'Security', tone: 'periwinkle' },
];

export const BRANCHES: readonly Branch[] = [
  { id: 'web', indexLabel: '02 / Web & UI', title: 'Web & UI', tone: 'magenta' },
  { id: 'data', indexLabel: '02 / Data & Finance', title: 'Data & Finance', tone: 'yellow' },
  { id: 'security', indexLabel: '02 / Security & Trust', title: 'Security & Trust', tone: 'cobalt' },
];

export const PROJECTS: readonly ProjectNode[] = [
  // ── Web & UI ────────────────────────────────────────────────────────────────
  {
    slug: 'zone-ming',
    indexLabel: '03 / Zone-Ming',
    title: 'Zone-Ming',
    tagline: 'Personal portfolio with page wipes, a three.js scene and glitch text effects.',
    branch: 'web',
    domains: ['ui'],
    tone: 'magenta',
    status: 'LIVE',
    stack: ['Vite', 'React', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Lenis', 'Three.js', 'React Router'],
    brief: {
      problem: null,
      highlights: [
        'Page wipes: three slanted slabs sweep across while the route changes underneath',
        'Animated background with canvas matrix rain, scanlines and a glitch flicker',
        'A three.js scene of chrome shards that re-form into a new shape on each page',
        'RGB-split glitch and glyph-decode text, with the real text always in the DOM for screen readers',
        'Custom cursor, smooth scrolling, a full-screen mobile menu and reduced-motion support',
      ],
      results: [],
    },
    links: { live: 'https://maosterm.github.io/Zone-Ming/' },
    sourcePrivate: true,
  },
  {
    slug: 'maison-aurelle',
    indexLabel: '03 / Maison Aurelle',
    title: 'Maison Aurelle',
    tagline: 'Booking site for a fictional five-star hotel in PHP, MySQL and vanilla JavaScript.',
    branch: 'web',
    domains: ['ui', 'backend'],
    tone: 'magenta',
    status: 'BUILT',
    stack: ['PHP', 'MySQL', 'JavaScript'],
    brief: {
      problem: 'A learning project: a full hotel booking flow, from a guest’s first booking to the staff front desk.',
      highlights: [
        'Three-step booking with live totals and a booking ID',
        'Manage Reservation: look up, change dates with a preview, cancel, send an inquiry',
        'Staff sign-in and a front desk for reservations, inquiries, rooms and add-ons',
        'An AI concierge chat on every page',
        'A slash-wipe motion system in ink, charcoal, ivory and champagne gold',
      ],
      results: [
        'Guests need no account: a stay is managed with a booking ID and email',
        'Staff sign-in is limited to 5 attempts per 15 minutes per IP; sessions end after 30 idle minutes',
        'Date changes and cancellations email the guest, with calendar files on confirmation',
      ],
    },
    links: {},
    sourcePrivate: true,
  },

  // ── Data & Finance ──────────────────────────────────────────────────────────
  {
    slug: 'bursakit',
    indexLabel: '03 / bursakit',
    title: 'bursakit',
    tagline: 'Python package: Bursa Malaysia stock prices and Malaysian macro data as pandas DataFrames.',
    branch: 'data',
    domains: ['data'],
    tone: 'yellow',
    status: 'LIVE',
    stack: ['Python', 'pandas'],
    brief: {
      problem: null,
      highlights: [
        'Daily prices, dividends and listings for Bursa Malaysia; 1155, 1155.KL and MAYBANK resolve to the same ticker',
        'Malaysian macro series: the Overnight Policy Rate and MYR exchange rates',
        'Cached locally, one schema per data type, more than one source',
        'Ships no data: each user fetches their own, under each source’s terms',
      ],
      results: ['Published on PyPI (alpha), for Python 3.10 or later', 'CI on every push, and the data sources are checked nightly'],
    },
    links: { package: 'https://pypi.org/project/bursakit/', repo: 'https://github.com/MaosterM/bursakit' },
  },
  {
    slug: 'financial-dashboard',
    indexLabel: '03 / Financial Dashboard',
    title: 'Financial Data Science Dashboard',
    tagline: 'Market analyser for stocks, FX and crypto with probabilistic FX forecasts. Being rebuilt from scratch.',
    branch: 'data',
    domains: ['data', 'backend'],
    tone: 'yellow',
    status: 'ACTIVE',
    stack: ['Node.js', 'Express'],
    brief: {
      problem: 'Probabilistic FX forecasts that are evaluated honestly against a random-walk baseline.',
      highlights: [
        'Planned client: Angular, TypeScript, RxJS, lightweight-charts and D3',
        'Planned server: Node.js, Express, MongoDB with Mongoose and WebSockets',
        'Planned ML service: Python, FastAPI, pandas, statsmodels and scikit-learn',
      ],
      results: ['Phase 1 (server skeleton): the Express server runs and exposes GET /health'],
    },
    links: { repo: 'https://github.com/MaosterM/financial-datascience-dashboard' },
  },

  // ── Security & Trust ────────────────────────────────────────────────────────
  {
    slug: 'zenithium',
    indexLabel: '03 / Zenithium',
    title: 'Zenithium',
    tagline: 'Family estate vault: a loved one’s documents open only when the heirs agree together.',
    context: 'RMIT Hackathon 2026 / Team Shuijiao',
    branch: 'security',
    domains: ['security', 'backend'],
    tone: 'cobalt',
    status: 'PROTOTYPE',
    stack: ['Next.js', 'JavaScript', 'TideCloak', 'WebCrypto'],
    brief: {
      problem:
        'After a death, the will, MyKad, land titles and savings records usually sit with one person or firm, and the family simply has to trust them.',
      highlights: [
        'Documents are encrypted in the browser (TideCloak and AES-GCM) before they are saved',
        'The vault key is split between the heirs: it takes 2 of 2 to open it',
        'A Database View shows that the server stores only ciphertext',
      ],
      results: [
        'Won Best Low-Resource Language Solution at RMIT Hackathon 2026',
        'Built for Challenge 2: a working app without unilateral control over protected data or decisions',
        'Honest scope: the quorum approval workflow and death verification are simulated',
      ],
    },
    links: { repo: 'https://github.com/MaosterM/Taylors_MY_Shuijiao_C2' },
  },
  {
    slug: 'ejector-seat',
    indexLabel: '03 / Ejector Seat',
    title: 'Ejector Seat',
    tagline: 'Non-custodial anti-rug agent on BNB Smart Chain testnet.',
    branch: 'security',
    domains: ['security', 'backend'],
    tone: 'cobalt',
    status: 'PROTOTYPE',
    stack: ['Solidity', 'TypeScript', 'Foundry'],
    brief: {
      problem: 'Holders of small, risky tokens lose almost everything when a team dumps its tokens or pulls the liquidity.',
      highlights: [
        'Watches the team’s wallets and the liquidity pool; plain deterministic code sells on a dump signal',
        'The agent’s only power over funds is “sell this token and send the proceeds to the owner”',
        'An LLM writes the risk brief and the explanation, but is never in the sell path and never touches a key',
        'Testnet only: every script refuses to run on any other chain',
      ],
      results: [
        'Demo: the guarded position kept 83.6% of its value, the unguarded one 0.1%, in an 89.8% price crash',
        'The sell was broadcast 185–213 ms after the agent saw the triggering block',
        'forge test passes 6/6 against the real PancakeSwap router',
      ],
    },
    links: {},
    sourcePrivate: true,
  },
];

export function findProject(slug: string): ProjectNode | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

/** `null` filter means "all domains". */
export function matchesDomain(project: ProjectNode, filter: Domain | null): boolean {
  return filter === null || project.domains.includes(filter);
}
