import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { TelemetryAction } from '../../lib/telemetry';
import { cx } from '../../lib/ui';
import { useSystem } from '../../store/useSystemStore';
import { CommandPrompt } from './CommandPrompt';

const TERMINAL_BODY_ID = 'terminal-body';

/** Tag colour per action. All pass AA contrast on the dark terminal background. */
const ACTION_CLASS: Record<TelemetryAction, string> = {
  BOOT: 'text-periwinkle',
  SYS: 'text-term-muted',
  NAV: 'text-yellow',
  FILTER: 'text-magenta',
  INSPECT: 'text-periwinkle',
  CMD: 'text-term-text',
  OUT: 'text-term-muted',
  DISPATCH: 'text-yellow',
  ERR: 'text-magenta',
};

/** "T+01:07": time since the page loaded, ticking once a second. */
function SessionClock() {
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(start);
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const total = Math.floor((now - start) / 1000);
  const mm = String(Math.floor(total / 60)).padStart(2, '0');
  const ss = String(total % 60).padStart(2, '0');
  return <span className="tabular-nums">T+{mm}:{ss}</span>;
}

/**
 * The dark console docked at the bottom of every page.
 * Collapsed: a 44px bar. Expanded: the live log plus a command prompt.
 * It is dark in both themes: `[color-scheme:dark]` makes every light-dark() token inside resolve to dark.
 */
export function TelemetryTerminal() {
  const { state, setTerminalOpen } = useSystem();
  const { logs, terminalOpen } = state;
  const logRef = useRef<HTMLOListElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Keep the newest line in view.
  useEffect(() => {
    const log = logRef.current;
    if (terminalOpen && log) log.scrollTop = log.scrollHeight;
  }, [logs, terminalOpen]);

  const totalEvents = logs.at(-1)?.id ?? 0;

  return (
    <section
      aria-label="Telemetry terminal"
      className="fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-line bg-term text-term-text [color-scheme:dark]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex min-h-11 items-center gap-3 px-4 md:px-6">
          <span aria-hidden="true" className="flex shrink-0 gap-1.5">
            <span className="size-2.5 bg-yellow" />
            <span className="size-2.5 bg-magenta" />
            <span className="size-2.5 bg-cobalt" />
          </span>
          <span className="file-id truncate">$ portfolio.stream</span>
          <span className="label ml-auto hidden text-term-muted sm:inline">
            <kbd className="border border-term-muted px-1">/</kbd> to type
          </span>
          <span className="label hidden text-term-muted sm:inline">EVT {String(totalEvents).padStart(3, '0')}</span>
          <span className="label ml-auto text-term-muted sm:ml-0">
            <SessionClock />
          </span>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={terminalOpen}
            aria-controls={TERMINAL_BODY_ID}
            onClick={() => setTerminalOpen(!terminalOpen)}
            className="label -mr-2 inline-flex min-h-11 items-center gap-1 px-2 hover:bg-term-text hover:text-term"
          >
            {terminalOpen ? (
              <ChevronDown aria-hidden="true" size={16} strokeWidth={2.25} />
            ) : (
              <ChevronUp aria-hidden="true" size={16} strokeWidth={2.25} />
            )}
            {terminalOpen ? 'Collapse' : 'Expand'}
            <span className="sr-only"> terminal</span>
          </button>
        </div>

        <div id={TERMINAL_BODY_ID} hidden={!terminalOpen} className="border-t-2 border-line">
          {/* role="log" is a polite live region: screen readers announce new lines without interrupting. */}
          <ol
            ref={logRef}
            role="log"
            aria-label="Telemetry log"
            className="h-[min(40dvh,16rem)] overflow-y-auto px-4 py-3 font-mono text-xs sm:text-sm md:px-6"
          >
            {logs.length === 0 && <li className="text-term-muted">(log cleared)</li>}
            {logs.map((event) => (
              <li key={event.id} className="grid grid-cols-[5.5ch_8.5ch_1fr] gap-x-2 leading-relaxed">
                <span className="text-term-muted">{event.elapsedSec}</span>
                <span className={cx('font-medium', ACTION_CLASS[event.action])}>{event.action}</span>
                <span className="break-words whitespace-pre-wrap">{event.message}</span>
              </li>
            ))}
          </ol>
          <CommandPrompt onEscape={() => toggleRef.current?.focus()} />
        </div>
      </div>
    </section>
  );
}
