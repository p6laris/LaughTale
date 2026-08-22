/**
 * SoftMax.LaughTale: Composable usePreferredColorScheme
 * Dark/light mode detection and toggling.
 */

export type ColorScheme = 'light' | 'dark';

export interface UsePreferredColorSchemeOptions {
  storageKey?: string;
  attribute?: string;
}

export interface UsePreferredColorSchemeReturn {
  scheme: ColorScheme;
  isDark: boolean;
  isLight: boolean;
  toggle(): void;
  set(scheme: ColorScheme): void;
  destroy(): void;
}

export function usePreferredColorScheme(
  options?: UsePreferredColorSchemeOptions
): UsePreferredColorSchemeReturn {
  const storageKey = options?.storageKey ?? 'theme';
  const attribute = options?.attribute ?? 'data-theme';

  const state = {
    scheme: 'light' as ColorScheme,
    get isDark() { return this.scheme === 'dark'; },
    get isLight() { return this.scheme === 'light'; },
    toggle: () => {},
    set: (scheme: ColorScheme) => {},
    destroy: () => {}
  };

  if (typeof window === 'undefined') {
    return state as UsePreferredColorSchemeReturn;
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const applyScheme = (scheme: ColorScheme) => {
    state.scheme = scheme;
    document.documentElement.setAttribute(attribute, scheme);
    if (scheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(storageKey, scheme);
    } catch (e) {}
  };

  const init = () => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(storageKey);
    } catch (e) {}

    const htmlTheme = document.documentElement.getAttribute(attribute);

    if (htmlTheme === 'dark' || htmlTheme === 'light') {
      applyScheme(htmlTheme as ColorScheme);
    } else if (saved === 'dark' || saved === 'light') {
      applyScheme(saved as ColorScheme);
    } else {
      applyScheme(mediaQuery.matches ? 'dark' : 'light');
    }
  };

  const listener = (e: MediaQueryListEvent) => {
    try {
      if (!localStorage.getItem(storageKey)) {
        applyScheme(e.matches ? 'dark' : 'light');
      }
    } catch (err) {}
  };

  if ('addEventListener' in mediaQuery) {
    mediaQuery.addEventListener('change', listener);
    state.destroy = () => mediaQuery.removeEventListener('change', listener);
  } else {
    (mediaQuery as any).addListener(listener);
    state.destroy = () => (mediaQuery as any).removeListener(listener);
  }

  state.toggle = () => {
    applyScheme(state.scheme === 'dark' ? 'light' : 'dark');
  };

  state.set = (scheme: ColorScheme) => {
    applyScheme(scheme);
  };

  init();

  return state as UsePreferredColorSchemeReturn;
}
