import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { LINKS, isSafeHref, type LinkKey } from '../../data/profile';
import { runCommand, type CommandContext } from '../../lib/commandRegistry';
import { useSystem } from '../../store/useSystemStore';

const HISTORY_SIZE = 20;

/** True when the key press happened inside something you type into. */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

interface CommandPromptProps {
  /** Called after Escape collapses the terminal, so focus can go somewhere sensible. */
  onEscape: () => void;
}

/**
 * The `$` input line.
 *  - Enter runs the command; ↑/↓ walk through previous commands.
 *  - "/" anywhere on the page (except while typing in a field) opens the terminal and focuses here.
 *  - Escape collapses the terminal.
 */
export function CommandPrompt({ onEscape }: CommandPromptProps) {
  const { state, setStage, inspect, logEvent, clearLogs, setTerminalOpen } = useSystem();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const focusWhenOpen = useRef(false);

  // "/" shortcut, listening on the whole window.
  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      if (document.querySelector('dialog[open]')) return; // a modal owns the keyboard
      event.preventDefault(); // otherwise Firefox opens quick-find
      focusWhenOpen.current = true;
      setTerminalOpen(true);
      inputRef.current?.focus(); // works immediately if the terminal was already open
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setTerminalOpen]);

  // When the "/" shortcut opened a collapsed terminal, focus the input once it is visible.
  useEffect(() => {
    if (state.terminalOpen && focusWhenOpen.current) {
      focusWhenOpen.current = false;
      inputRef.current?.focus();
    }
  }, [state.terminalOpen]);

  const ctx = useMemo<CommandContext>(
    () => ({
      setStage,
      inspect,
      clear: clearLogs,
      openLink: (key: LinkKey) => {
        const href = LINKS[key].href;
        if (!href || !isSafeHref(href)) return;
        window.open(href, '_blank', 'noopener,noreferrer');
        logEvent('DISPATCH', `opened ${key}`);
      },
    }),
    [setStage, inspect, clearLogs, logEvent],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = value.trim();
    if (!raw) return;

    logEvent('CMD', `$ ${raw}`);
    const result = runCommand(raw, ctx);
    for (const line of result.lines) logEvent(result.error ? 'ERR' : 'OUT', line);

    setHistory((previous) => [...previous, raw].slice(-HISTORY_SIZE));
    setHistoryIndex(null);
    setValue('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      setTerminalOpen(false);
      onEscape();
      return;
    }
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    if (history.length === 0) return;
    event.preventDefault();

    const last = history.length - 1;
    let next: number | null;
    if (event.key === 'ArrowUp') next = historyIndex === null ? last : Math.max(0, historyIndex - 1);
    else next = historyIndex === null || historyIndex >= last ? null : historyIndex + 1;

    setHistoryIndex(next);
    setValue(next === null ? '' : (history[next] ?? ''));
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t-2 border-line px-4 md:px-6">
      <span aria-hidden="true" className="font-mono text-yellow">
        $
      </span>
      <label htmlFor="terminal-input" className="sr-only">
        Terminal command. Type help for the list.
      </label>
      <input
        ref={inputRef}
        id="terminal-input"
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={80}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        placeholder="type help"
        className="min-h-11 flex-1 bg-transparent px-1 font-mono text-sm text-term-text placeholder:text-term-muted focus-visible:-outline-offset-2"
      />
    </form>
  );
}
