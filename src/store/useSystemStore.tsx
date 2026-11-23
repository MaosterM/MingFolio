/**
 * The app's single source of UI state: which stage is open, which domain is filtered,
 * which project is inspected, and the telemetry log.
 *
 * Pattern: React Context + useReducer.
 *   - reducer()        pure function: (old state, action) → new state. No side effects.
 *   - SystemProvider   owns the state, logs events, keeps the URL in sync.
 *   - useSystem()      how components read state and call actions.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { findProject, PROJECTS, type Domain } from '../data/projects';
import { stageLabel, type StageId } from '../lib/stages';
import { formatElapsed, type TelemetryAction, type TelemetryEvent } from '../lib/telemetry';
import { readUrlState, writeUrlState, type UrlState } from '../lib/urlSync';

/** Older lines are dropped so a long session can't grow memory forever. */
export const MAX_LOGS = 100;

export interface SystemState {
  stage: StageId;
  filter: Domain | null;
  inspected: string | null;
  logs: TelemetryEvent[];
  terminalOpen: boolean;
}

type Action =
  | { type: 'stage'; stage: StageId }
  | { type: 'filter'; filter: Domain | null }
  | { type: 'inspect'; slug: string | null }
  | { type: 'sync'; url: UrlState }
  | { type: 'log'; event: TelemetryEvent }
  | { type: 'clearLogs' }
  | { type: 'terminal'; open: boolean };

function reducer(state: SystemState, action: Action): SystemState {
  switch (action.type) {
    case 'stage':
      return { ...state, stage: action.stage };
    case 'filter':
      return { ...state, filter: action.filter };
    case 'inspect':
      return { ...state, inspected: action.slug };
    case 'sync':
      return { ...state, stage: action.url.stage, inspected: action.url.slug };
    case 'log': {
      const logs = [...state.logs, action.event];
      return { ...state, logs: logs.slice(-MAX_LOGS) };
    }
    case 'clearLogs':
      return { ...state, logs: [] };
    case 'terminal':
      return { ...state, terminalOpen: action.open };
  }
}

function createInitialState(): SystemState {
  const url = readUrlState(window.location.search);
  return { stage: url.stage, filter: null, inspected: url.slug, logs: [], terminalOpen: false };
}

export interface SystemApi {
  state: SystemState;
  setStage: (stage: StageId) => void;
  /** Same domain twice clears the filter; null clears it too. */
  toggleFilter: (domain: Domain | null) => void;
  /** A slug opens the inspector, null closes it. Unknown slugs are refused and logged. */
  inspect: (slug: string | null) => void;
  logEvent: (action: TelemetryAction, message: string) => void;
  clearLogs: () => void;
  setTerminalOpen: (open: boolean) => void;
}

const SystemContext = createContext<SystemApi | null>(null);

export function SystemProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  // Actions compare against the latest state without being re-created on every render.
  const stateRef = useRef(state);
  useLayoutEffect(() => {
    stateRef.current = state;
  });

  const bootTime = useRef(performance.now());
  const nextId = useRef(0);

  const logEvent = useCallback((action: TelemetryAction, message: string) => {
    nextId.current += 1;
    const elapsedSec = formatElapsed((performance.now() - bootTime.current) / 1000);
    dispatch({ type: 'log', event: { id: nextId.current, elapsedSec, action, message } });
  }, []);

  const setStage = useCallback(
    (stage: StageId) => {
      if (stateRef.current.stage === stage) return;
      dispatch({ type: 'stage', stage });
      logEvent('NAV', `switched stage -> ${stageLabel(stage)}`);
    },
    [logEvent],
  );

  const toggleFilter = useCallback(
    (domain: Domain | null) => {
      const next = domain === stateRef.current.filter ? null : domain;
      if (next === stateRef.current.filter) return;
      dispatch({ type: 'filter', filter: next });
      logEvent('FILTER', next ? `highlighted domain: ${next}` : 'cleared domain filter');
    },
    [logEvent],
  );

  const inspect = useCallback(
    (slug: string | null) => {
      if (slug === stateRef.current.inspected) return;
      if (slug !== null && !findProject(slug)) {
        logEvent('ERR', `no node named "${slug}"`);
        return;
      }
      dispatch({ type: 'inspect', slug });
      logEvent('INSPECT', slug ? `opened spec: ${slug}` : 'closed spec');
    },
    [logEvent],
  );

  const clearLogs = useCallback(() => dispatch({ type: 'clearLogs' }), []);
  const setTerminalOpen = useCallback((open: boolean) => dispatch({ type: 'terminal', open }), []);

  // One BOOT line per page load. The ref survives React StrictMode's double effect run in dev.
  const booted = useRef(false);
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    logEvent('BOOT', `session started · ${PROJECTS.length} nodes · ${stageLabel(stateRef.current.stage)}`);
  }, [logEvent]);

  // State → URL. The first sync replaces (cleans up a bad link); later ones push history entries.
  const firstUrlSync = useRef(true);
  useEffect(() => {
    const url = { stage: state.stage, slug: state.inspected };
    writeUrlState(url, firstUrlSync.current ? 'replace' : 'push');
    firstUrlSync.current = false;
  }, [state.stage, state.inspected]);

  // URL → state, when the visitor presses Back or Forward.
  useEffect(() => {
    function onPopState() {
      const url = readUrlState(window.location.search);
      dispatch({ type: 'sync', url });
      logEvent('NAV', `history -> ${stageLabel(url.stage)}${url.slug ? ` · ${url.slug}` : ''}`);
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [logEvent]);

  const api = useMemo<SystemApi>(
    () => ({ state, setStage, toggleFilter, inspect, logEvent, clearLogs, setTerminalOpen }),
    [state, setStage, toggleFilter, inspect, logEvent, clearLogs, setTerminalOpen],
  );

  return <SystemContext.Provider value={api}>{children}</SystemContext.Provider>;
}

export function useSystem(): SystemApi {
  const api = useContext(SystemContext);
  if (!api) throw new Error('useSystem() must be used inside <SystemProvider>');
  return api;
}
