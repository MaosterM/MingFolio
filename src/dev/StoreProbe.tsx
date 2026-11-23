import { useEffect, useState } from 'react';
import { DOMAINS, PROJECTS } from '../data/projects';
import { STAGES } from '../lib/stages';
import { useSystem } from '../store/useSystemStore';
import { HardButton } from '../components/primitives/HardButton';
import { BrutalCard } from '../components/primitives/BrutalCard';
import { WindowChrome } from '../components/primitives/WindowChrome';

/**
 * Dev aid: drive the store by hand and watch state, URL and log update.
 * Try a button, then the browser's Back button, then reload with the URL it produced.
 */
export default function StoreProbe() {
  const { state, setStage, toggleFilter, inspect, clearLogs } = useSystem();

  // The provider writes the URL in its own effect, which runs after this component's effects,
  // so read the address bar one tick later.
  const [search, setSearch] = useState(window.location.search);
  useEffect(() => {
    const id = window.setTimeout(() => setSearch(window.location.search));
    return () => window.clearTimeout(id);
  }, [state.stage, state.inspected]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <BrutalCard tone="yellow">
        <WindowChrome title="store.controls" />
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-wrap gap-2">
            {STAGES.map((s) => (
              <HardButton key={s.id} tone={state.stage === s.id ? 'yellow' : 'ink'} onClick={() => setStage(s.id)}>
                {s.index}
              </HardButton>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map((d) => (
              <HardButton key={d.id} tone={state.filter === d.id ? d.tone : 'ink'} onClick={() => toggleFilter(d.id)}>
                {d.label}
              </HardButton>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {PROJECTS.map((p) => (
              <HardButton key={p.slug} onClick={() => inspect(p.slug)}>
                {p.slug}
              </HardButton>
            ))}
            <HardButton onClick={() => inspect(null)}>Close</HardButton>
            <HardButton onClick={() => inspect('not-a-project')}>Bad slug</HardButton>
          </div>
        </div>
      </BrutalCard>

      <BrutalCard tone="cobalt">
        <WindowChrome title="store.state" actions={<HardButton onClick={clearLogs}>Clear</HardButton>} />
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 p-4 font-mono text-sm">
          <dt className="text-muted">stage</dt>
          <dd>{state.stage}</dd>
          <dt className="text-muted">filter</dt>
          <dd>{state.filter ?? 'null'}</dd>
          <dt className="text-muted">inspected</dt>
          <dd>{state.inspected ?? 'null'}</dd>
          <dt className="text-muted">url</dt>
          <dd className="break-all">{search || '(empty)'}</dd>
          <dt className="text-muted">logs</dt>
          <dd>{state.logs.length}</dd>
        </dl>
        <ol className="max-h-48 overflow-auto border-t-2 border-line bg-term px-4 py-3 font-mono text-xs text-term-text">
          {state.logs.length === 0 && <li className="text-term-muted">(no log lines yet)</li>}
          {state.logs.map((e) => (
            <li key={e.id}>
              <span className="text-term-muted">{e.elapsedSec}</span> <span className="text-yellow">{e.action}</span>{' '}
              {e.message}
            </li>
          ))}
        </ol>
      </BrutalCard>
    </div>
  );
}
