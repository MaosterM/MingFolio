# CLAUDE.md

Context for AI coding agents working on this repo. Read it at the start of every session.

## What this is

A personal portfolio site for **Cheah Yi Ming** (GitHub: `MaosterM`), styled as an **observable system**:
a neo-brutalist "technical OS" where the projects are nodes in a graph, each project opens in an OS-style
inspector window, and a live telemetry terminal at the bottom logs every interaction.

It sits beside Zone-Ming (React + TypeScript + Three.js). MingFolio is also React, but its point is a
flat, mechanical, information-dense design system rather than a 3D scene.

**This is a learning project.** The owner studies the code and builds parts of it themself (for example the
Overview stage). Work in small checkpoints, explain what each one adds, and leave meaningful pieces to them.

## Stack and constraints

- **Vite + React 19 + TypeScript** (`"strict": true`). No router: stage and inspected project live in the URL query.
- **Tailwind CSS v4**, configured in CSS (`src/styles/tokens.css`), no `tailwind.config.js`.
- **Motion** (`motion/react`) for layout and enter/exit animation, inside `<MotionConfig reducedMotion="user">`.
- **lucide-react** icons, `strokeWidth={2.25}`. **@fontsource** self-hosted fonts: Space Grotesk, DM Mono, Inter.
- Component-library effects (React Bits, Magic UI, Aceternity, Motion Primitives, Animate UI, Kokonut UI)
  are welcome **as inspiration, rewritten** to match the design system: no gradients, glows, blur or springs.
- No backend. Contact is links only until hosting and an email are decided.
- Deploys to **GitHub Pages** as a static build (`base: './'` in `vite.config.ts`).

Run locally:

```
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + production build into dist/
```

Note: on the Taylor's campus network (`student.taylors.edu.my`) a Fortinet firewall re-signs HTTPS and
`npm install` fails with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`. Install from another network. Never set
`strict-ssl false`.

## File layout

```
index.html                    shell + <noscript> summary of the verified facts
src/main.tsx                  entry: fonts, tokens, theme boot, providers
src/App.tsx                   layout: header, pipeline nav, active stage, footer, terminal
src/styles/tokens.css         Tailwind import, design tokens, base and component classes
src/data/                     profile.ts, projects.ts, stack.ts: the only place content lives
src/lib/                      stages, telemetry, urlSync, theme, commandRegistry (pure TS, no React)
src/store/                    useSystemStore.tsx: Context + useReducer, logEvent, URL sync
src/components/primitives/    BrutalCard, HardButton, WindowChrome, AccentBadge
src/components/layout/        IdentityHeader, PipelineNav
src/components/views/         OverviewStage, SystemsGraph, StackMatrix, DispatchStage
src/components/inspector/     ProjectInspector (native <dialog>)
src/components/terminal/      TelemetryTerminal
src/components/accent/        CoreCube (CSS 3D, removable)
public/                       favicon, static files copied as is
```

## Rules

- **Never invent facts.** No made-up projects, skills, proficiency levels, metrics, testimonials, links or emails.
  Anything unknown stays a `[Bracketed placeholder]` and placeholder links do not render as `<a>`.
- **Content lives in `src/data/`.** Components read from it; they don't hard-code copy about the owner.
- Semantic HTML: one `<h1>`, landmarks (`header`, `nav`, `main`, `footer`), headings in order,
  `alt` on every image, `<button>` for actions and `<a>` for navigation.
- **All colours, fonts and durations come from `src/styles/tokens.css`.** No hex values anywhere else
  (the favicon SVG and the `<noscript>` block are the only exceptions).
- Light and dark themes via `prefers-color-scheme`, with a manual toggle that overrides it
  (`data-theme` on `<html>`, saved in `localStorage` inside try/catch).
- Mobile first. Works at 360px wide with no horizontal scroll. The systems graph collapses to one column below 768px.
- Respect `prefers-reduced-motion`. Animate only `transform` and `opacity`; hard shadows snap, they never tween.
- Anything that moves for more than 5 seconds (the cube) has a pause control.
- Keyboard: visible `:focus-visible` outline, a skip link, arrow keys in the stage tabs, `Esc` closes the
  inspector, `/` focuses the terminal prompt (ignored while typing in a field).
- **Security:** no `eval`, `new Function` or `dangerouslySetInnerHTML`. Terminal input is split into tokens and
  matched against an allowlisted command registry; output renders as React text. `open` only uses the static
  `https://` / `mailto:` links in `src/data/profile.ts`. External links get `target="_blank" rel="noopener noreferrer"`.
- No secrets in `VITE_*` variables: they are compiled into the public bundle.

## About the owner (verified facts only)

- Final-year Computer Science student at Taylor's University, Kuala Lumpur.
  Specialising in Data Science, minor in Finance.
- Team Shuijiao won **Best Low-Resource Language Solution** at RMIT Hackathon 2026 (22-23 October).
- Projects:
  - **Zone-Ming**: portfolio site in React, TypeScript, Three.js and GSAP.
    https://github.com/MaosterM/Zone-Ming, live at https://maosterm.github.io/Zone-Ming/
  - **Maison Aurelle**: booking site for a fictional five-star hotel in PHP, MySQL and vanilla JavaScript.
    https://github.com/MaosterM/Maison-Aurelle
  - **Financial Data Science Dashboard**: market analyser for stocks, FX and crypto with probabilistic
    FX forecasts. In progress. Stack not yet confirmed. https://github.com/MaosterM/financial-datascience-dashboard
- Tools listed on the GitHub profile: JavaScript, TypeScript, React, C++, CSS, HTML, Docker, Figma,
  Jupyter, MySQL, PHP, Ubuntu, VS Code, Apache, Electron, IntelliJ.
- Links: https://www.linkedin.com/in/cheah-yi-ming-549165364/ and https://github.com/MaosterM
- Email: `[Email placeholder]`. Availability: `[Availability placeholder]`. Resume: `[Resume placeholder]`.

## Design direction: Neo-Brutalist / Technical OS

The page is an **interactive system inspector**, not a scrolling brochure. No full-bleed hero, no
"About, three project cards, Contact" scroll, no glassmorphism, soft shadows, gradients or rounded pills,
no bouncy springs.

- **Surfaces:** warm paper canvas, crisp white cards, near-black ink for every line and word. Dark theme
  inverts canvas and ink; the terminal stays dark in both.
- **Accents (flat, never shaded):** yellow `active / featured`, magenta `UI`, cobalt `backend / connectors`,
  periwinkle `secondary badges`. Ink text on yellow, magenta, periwinkle and white; white text on cobalt.
- **Geometry:** `0` radius everywhere. `2px` ink borders, `3px` on primary frames and the inspector.
- **Hard shadows:** `4px 4px 0` with no blur, in ink or an accent. Pressing shifts the element `2px` down-right
  and shrinks the shadow to `2px` (hover) or `0` (active), like a mechanical key.
- **Type:** Space Grotesk 700 ALL CAPS, tracking `-0.03em`, for display. DM Mono uppercase, tracking `0.08em`,
  for labels (`01 / OVERVIEW`, `STATUS`), lowercase for file-style ids (`identity.brief`). Inter for body copy.
- **Motifs:** dark OS title bars with square window controls; orthogonal `2px` connectors with square anchors
  and arrowheads; slashes and pipes as separators; a dark CLI strip with timestamps and colour-coded tags.
- **Motion:** `120ms`, `cubic-bezier(0.2, 0, 0, 1)`, zero overshoot. Hover states flip colours instantly.
- **Structure:** identity strip, then a 4-stage pipeline (`01 / OVERVIEW`, `02 / SYSTEMS`, `03 / STACK`,
  `04 / DISPATCH`), the active stage below it, and the telemetry terminal docked at the bottom.
- **3D accent (trial):** one CSS-3D cube whose faces are the domains (CORE, UI, BACKEND, DATA). It turns to the
  active filter. It may be removed; keep it isolated in `src/components/accent/`.

## Git

- `main` only receives merges. Work on a branch per feature (`feat/foundation`, `feat/terminal`, `fix/nav-focus`).
- **Commit often**: one commit per checkpoint, small enough to read in one sitting.
- **The owner runs git themself.** At each checkpoint, give the exact commands (add, commit, push) and a short
  walkthrough of the code; do not commit on their behalf.
- Conventional commits: `feat(terminal): add the command prompt`, `chore: scaffold vite`, `docs: update CLAUDE.md`.
- **Never add `Co-Authored-By: Claude` or "Generated with Claude Code" lines** to commits or PRs.

## Done means

Checked in a browser at 360px and desktop width, in light and dark, with the keyboard only,
with reduced motion on, and with no console errors. `npm run build` passes.
