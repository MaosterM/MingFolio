import { PROFILE } from '../../data/profile';
import { DOMAINS } from '../../data/projects';
import { useSystem } from '../../store/useSystemStore';
import { ScrambleText } from '../fx/ScrambleText';
import { ThemeToggle } from './ThemeToggle';

/** Monogram from the given name, Yi Ming. Swap for a photo when one is supplied. */
const MONOGRAM = 'YM';

/**
 * Compact identity strip: monogram, name (the page's only <h1>), role line,
 * then the domain filter and theme toggle. Deliberately not a tall hero.
 */
export function IdentityHeader() {
  const { state, toggleFilter } = useSystem();

  return (
    <header data-tone="ink" className="frame frame-thick flex flex-col gap-5 p-4 md:flex-row md:items-center md:justify-between md:p-5">
      <div className="flex min-w-0 items-center gap-4">
        {/* Avatar slot: a square monogram until a real photo is supplied. */}
        <div data-tone="ink" aria-hidden="true" className="frame display grid size-14 shrink-0 place-items-center bg-yellow text-xl text-on-accent">
          {MONOGRAM}
        </div>
        <div className="min-w-0">
          <h1 className="display text-2xl sm:text-4xl lg:text-5xl">{PROFILE.name}</h1>
          <p className="label mt-2 text-muted">
            <ScrambleText text={PROFILE.roleLine.join(' / ')} />
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        <div role="group" aria-label="Filter projects by domain" className="flex flex-wrap gap-2">
          <button
            type="button"
            data-tone="ink"
            aria-pressed={state.filter === null}
            onClick={() => toggleFilter(null)}
            className="chip label min-h-11 px-3"
          >
            All
          </button>
          {DOMAINS.map((domain) => (
            <button
              key={domain.id}
              type="button"
              data-tone={domain.tone}
              aria-pressed={state.filter === domain.id}
              onClick={() => toggleFilter(domain.id)}
              className="chip label min-h-11 px-3"
            >
              {domain.label}
            </button>
          ))}
        </div>
        <span aria-hidden="true" className="label hidden px-1 text-muted md:inline">|</span>
        <ThemeToggle />
      </div>
    </header>
  );
}
