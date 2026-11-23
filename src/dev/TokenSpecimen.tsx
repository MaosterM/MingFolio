import { useState } from 'react';
import { applyTheme, effectiveTheme, nextTheme, readStoredTheme, storeTheme, type ThemeChoice } from '../lib/theme';
import { AccentBadge } from '../components/primitives/AccentBadge';
import { BrutalCard } from '../components/primitives/BrutalCard';
import { HardButton, HardLink } from '../components/primitives/HardButton';
import { WindowChrome } from '../components/primitives/WindowChrome';
import StoreProbe from './StoreProbe';

/**
 * A living style sheet: every token on one page, in whichever theme is active.
 * Dev aid only. App.tsx stops rendering it once the real shell exists.
 */

const ACCENTS = ['yellow', 'magenta', 'cobalt', 'periwinkle'] as const;
const SURFACES = [
  { name: 'canvas', className: 'bg-canvas' },
  { name: 'surface', className: 'bg-surface' },
  { name: 'ink', className: 'bg-ink' },
  { name: 'muted', className: 'bg-muted' },
  { name: 'chrome', className: 'bg-chrome' },
  { name: 'term', className: 'bg-term' },
] as const;

export default function TokenSpecimen() {
  const [choice, setChoice] = useState<ThemeChoice>(readStoredTheme);

  function cycleTheme() {
    const next = nextTheme(choice);
    applyTheme(next);
    storeTheme(next);
    setChoice(next);
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8 md:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-muted">dev / token.specimen</p>
          <h1 className="display mt-2 text-4xl md:text-6xl">Design tokens</h1>
        </div>
        <button type="button" onClick={cycleTheme} className="frame press label min-h-11 px-4">
          Theme: {choice} → {effectiveTheme(choice)}
        </button>
      </header>

      <section aria-labelledby="sp-surfaces">
        <h2 id="sp-surfaces" className="label mb-3 text-muted">01 / surfaces</h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SURFACES.map((s) => (
            <li key={s.name} className="frame">
              <div className={`h-16 border-b-2 border-line ${s.className}`} />
              <p className="file-id px-2 py-1.5">--{s.name}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sp-accents">
        <h2 id="sp-accents" className="label mb-3 text-muted">02 / accents + on-fill text</h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {ACCENTS.map((tone) => (
            <li key={tone} data-tone={tone} className="fill border-2 border-line px-3 py-6">
              <span className="label">{tone}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sp-type">
        <h2 id="sp-type" className="label mb-3 text-muted">03 / type roles</h2>
        <div className="frame flex flex-col gap-4 p-5">
          <p className="display text-5xl">Cheah Yi Ming</p>
          <p className="label">01 / Overview — status / label / mono</p>
          <p className="file-id">identity.brief · project.spec · sys.telemetry</p>
          <p className="max-w-prose">
            Inter body copy. Final-year Computer Science student at Taylor&rsquo;s University, Kuala Lumpur,
            specialising in Data Science with a minor in Finance.
          </p>
          <p>
            Unknown facts render as <span className="placeholder">[Email placeholder]</span>, never as links.
          </p>
        </div>
      </section>

      <section aria-labelledby="sp-shadows">
        <h2 id="sp-shadows" className="label mb-3 text-muted">04 / hard shadows + press (hover and click these)</h2>
        <div className="flex flex-wrap gap-6">
          {(['ink', ...ACCENTS] as const).map((tone) => (
            <button key={tone} type="button" data-tone={tone} className="frame press label min-h-11 px-5">
              {tone} →
            </button>
          ))}
          <div className="frame frame-thick label px-5 py-3">3px frame</div>
        </div>
      </section>

      <section aria-labelledby="sp-chrome">
        <h2 id="sp-chrome" className="label mb-3 text-muted">05 / os window + terminal colours</h2>
        <div className="frame frame-thick max-w-md">
          <div className="flex items-center gap-2 bg-chrome px-3 py-2 text-chrome-text">
            <span className="size-2.5 bg-yellow" aria-hidden="true" />
            <span className="size-2.5 bg-magenta" aria-hidden="true" />
            <span className="size-2.5 bg-cobalt" aria-hidden="true" />
            <span className="file-id ml-2">project.spec // zone-ming</span>
          </div>
          <div className="bg-term px-3 py-3 font-mono text-sm text-term-text">
            <p><span className="text-term-muted">001.2</span> <span className="text-yellow">NAV</span> switched stage -&gt; 02 / SYSTEMS</p>
            <p><span className="text-term-muted">004.8</span> <span className="text-magenta">FILTER</span> highlighted domain: data</p>
            <p><span className="text-term-muted">009.4</span> <span className="text-periwinkle">INSPECT</span> opened spec: zone-ming</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="sp-primitives">
        <h2 id="sp-primitives" className="label mb-3 text-muted">06 / primitives</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <BrutalCard as="article" tone="magenta" aria-labelledby="sp-zone">
            <WindowChrome title="project.spec // zone-ming" />
            <div className="flex flex-col gap-3 p-4">
              <p className="label text-muted">03 / Web &amp; UI</p>
              <h3 id="sp-zone" className="display text-2xl">Zone-Ming</h3>
              <p>Portfolio site in React, TypeScript, Three.js and GSAP.</p>
              <div className="flex flex-wrap gap-2">
                <AccentBadge tone="yellow">Live</AccentBadge>
                <AccentBadge tone="periwinkle">React</AccentBadge>
                <AccentBadge tone="cobalt">TypeScript</AccentBadge>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <HardButton tone="magenta">Inspect →</HardButton>
                <HardLink href="https://github.com/MaosterM/Zone-Ming">Source repo</HardLink>
              </div>
            </div>
          </BrutalCard>

          <BrutalCard thick tone="cobalt">
            <WindowChrome title="primitive.links" actions={<HardButton className="px-2" aria-label="Close (demo)">[X]</HardButton>} />
            <ul className="flex flex-col gap-3 p-4">
              <li>
                <HardLink href="https://github.com/MaosterM" tone="yellow">GitHub</HardLink>
                <span className="file-id ml-3 text-muted">external → new tab + ↗</span>
              </li>
              <li>
                <HardLink href="?stage=systems">Systems stage</HardLink>
                <span className="file-id ml-3 text-muted">same page</span>
              </li>
              <li>
                <span className="placeholder">[Email placeholder]</span>
                <span className="file-id ml-3 text-muted">unknown → never a link</span>
              </li>
            </ul>
          </BrutalCard>
        </div>
      </section>

      <section aria-labelledby="sp-store">
        <h2 id="sp-store" className="label mb-3 text-muted">07 / store probe (click, then use Back / Forward)</h2>
        <StoreProbe />
      </section>
    </main>
  );
}
