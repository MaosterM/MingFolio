# MingFolio

A developer portfolio styled as an **observable system**: projects are nodes in an architecture graph,
each one opens in an OS-style inspector window, and a live telemetry terminal logs every interaction.

**Live:** https://maosterm.github.io/MingFolio/

Built by **Cheah Yi Ming**, final-year Computer Science student at Taylor's University, Kuala Lumpur
(specialising in Data Science, minor in Finance).

## What's inside

The page is a four-stage pipeline instead of a scrolling brochure:

| Stage | What it shows |
|---|---|
| `01 / OVERVIEW` | Identity brief, the RMIT Hackathon 2026 award, a system map of counts, and a CSS 3D domain cube |
| `02 / SYSTEMS` | The projects as a node graph: router, branches and project windows on 2px orthogonal connectors |
| `03 / STACK` | Tools from the GitHub profile, each linked to the projects on this site that use it |
| `04 / DISPATCH` | Contact channels (GitHub, LinkedIn) |

Around it:

- **Telemetry terminal**, docked at the bottom. Press <kbd>/</kbd> anywhere to type a command.
- **Project inspector**, a native `<dialog>` with the project's stack and links. <kbd>Esc</kbd> closes it.
- **Domain filter** (UI / Backend / Data) in the header. It dims non-matching nodes and turns the cube.
- **Deep links**: `?stage=systems&node=zone-ming` opens that stage and project; Back and Forward work.
- **Light and dark themes**, following the OS until you choose one.

### Terminal commands

```
help                      list the commands
whoami                    print the profile
ls                        list project nodes
inspect <slug>            open a project spec      e.g. inspect zone-ming
stage <1-4>               switch pipeline stage
open <github|linkedin>    open an external link
clear                     clear the log
```

## Design

Neo-brutalist / technical OS: warm paper canvas, near-black ink, flat accent colours
(yellow, magenta, cobalt, periwinkle), zero border radius, hard unblurred offset shadows,
dark OS title bars, and snappy 120 ms motion with no bounce. Space Grotesk for display,
DM Mono for labels, Inter for body text, all self-hosted.

All design tokens live in [`src/styles/tokens.css`](src/styles/tokens.css). Each colour is defined
once with `light-dark()`, so the two themes can't drift apart.

## Stack

- [Vite](https://vite.dev/) + [React 19](https://react.dev/) + TypeScript (strict)
- [Tailwind CSS v4](https://tailwindcss.com/), configured in CSS
- [Motion](https://motion.dev/) for the stage transitions and the sliding tab fill
- [lucide-react](https://lucide.dev/) icons, [@fontsource](https://fontsource.org/) fonts
- No backend and no router: state lives in a React Context + `useReducer` store, mirrored to the URL query

## Run it locally

Requires Node.js 20.19+, 22.13+ or 23.5+ (developed on Node 24).

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run build      # type check + production build into dist/
```

## Project structure

```
src/
├── data/          profile, projects and stack: the only place content lives
├── lib/           pure TypeScript: stages, URL sync, theme, terminal command registry
├── store/         Context + useReducer store, telemetry log, URL sync
├── styles/        tokens.css: design tokens, base and component classes
└── components/
    ├── primitives/  BrutalCard, HardButton, WindowChrome, AccentBadge
    ├── layout/      IdentityHeader, PipelineNav, ThemeToggle
    ├── views/       the four stages
    ├── inspector/   ProjectInspector
    ├── terminal/    TelemetryTerminal, CommandPrompt
    └── accent/      CoreCube (CSS 3D, isolated so it can be removed)
```

## Accessibility and security

- One `<h1>`, landmarks, headings in order, a skip link, visible focus outlines.
- Stage tabs follow the ARIA tabs pattern (arrow keys, Home and End).
- The inspector uses `showModal()`: focus moves in, the page behind is inert, and <kbd>Esc</kbd> closes it.
- Respects `prefers-reduced-motion`; the cube has a pause control.
- The terminal never evaluates input: commands are matched against an allowlist with `Object.hasOwn`,
  and output renders as text. `open` only uses fixed `https://` links.
- External links use `rel="noopener noreferrer"`. A Content-Security-Policy is added to the production build.

## Deployment

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds
the site and publishes `dist/` to GitHub Pages.
