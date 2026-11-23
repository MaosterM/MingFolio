/**
 * Theme handling. The CSS does the real work (light-dark() in tokens.css);
 * this file only decides what `data-theme` on <html> should be and remembers it.
 *
 *   'system' → no data-theme attribute, the OS preference wins
 *   'light' / 'dark' → data-theme pins that scheme
 */
export type ThemeChoice = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'mingfolio:theme';

function isThemeChoice(value: unknown): value is ThemeChoice {
  return value === 'system' || value === 'light' || value === 'dark';
}

/** The saved choice, or 'system' when nothing is saved or storage is blocked. */
export function readStoredTheme(): ThemeChoice {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return isThemeChoice(value) ? value : 'system';
  } catch {
    return 'system'; // private mode or blocked site data
  }
}

export function storeTheme(choice: ThemeChoice): void {
  try {
    if (choice === 'system') window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Storage unavailable: the theme still applies, it just won't survive a reload.
  }
}

export function applyTheme(choice: ThemeChoice): void {
  const root = document.documentElement;
  if (choice === 'system') delete root.dataset.theme;
  else root.dataset.theme = choice;
}

/** What the user actually sees right now, after resolving 'system'. */
export function effectiveTheme(choice: ThemeChoice): 'light' | 'dark' {
  if (choice !== 'system') return choice;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Which choice the theme toggle button moves to when clicked.
 * `current` is the stored choice ('system' on a first visit).
 */
export function nextTheme(current: ThemeChoice): ThemeChoice {
if (current === 'system') 
return effectiveTheme('system') === 'dark' ? 'light' : 'dark'; if (current === 'light') return 'dark';
return 'light';
}


