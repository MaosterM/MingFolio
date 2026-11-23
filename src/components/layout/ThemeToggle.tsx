import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { applyTheme, effectiveTheme, nextTheme, readStoredTheme, storeTheme, type ThemeChoice } from '../../lib/theme';
import { useSystem } from '../../store/useSystemStore';

/** Light/dark switch. The cycle itself is nextTheme() in lib/theme.ts. */
export function ThemeToggle() {
  const { logEvent } = useSystem();
  const [choice, setChoice] = useState<ThemeChoice>(readStoredTheme);

  const showing = effectiveTheme(choice);
  const upcoming = effectiveTheme(nextTheme(choice));

  function handleClick() {
    const next = nextTheme(choice);
    applyTheme(next);
    storeTheme(next);
    setChoice(next);
    logEvent('SYS', `theme -> ${effectiveTheme(next)}`);
  }

  const Icon = showing === 'dark' ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Switch to ${upcoming} theme`}
      className="chip label inline-flex min-h-11 items-center gap-2 px-3"
      data-tone="ink"
    >
      <Icon aria-hidden="true" size={16} strokeWidth={2.25} />
      <span aria-hidden="true">{showing}</span>
    </button>
  );
}
