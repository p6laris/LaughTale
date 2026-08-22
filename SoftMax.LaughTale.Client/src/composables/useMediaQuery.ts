/**
 * SoftMax.LaughTale: Composable useMediaQuery
 * Reactive media query matching.
 */

export interface UseMediaQueryReturn {
  matches: boolean;
  destroy(): void;
}

export const Breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  dark: '(prefers-color-scheme: dark)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  touch: '(hover: none) and (pointer: coarse)',
} as const;

export function useMediaQuery(
  query: string,
  callback?: (matches: boolean) => void
): UseMediaQueryReturn {
  const state: UseMediaQueryReturn = {
    matches: false,
    destroy: () => {}
  };

  if (typeof window !== 'undefined' && 'matchMedia' in window) {
    const mediaQueryList = window.matchMedia(query);
    state.matches = mediaQueryList.matches;

    const listener = (event: MediaQueryListEvent) => {
      state.matches = event.matches;
      if (callback) callback(event.matches);
    };

    if ('addEventListener' in mediaQueryList) {
      mediaQueryList.addEventListener('change', listener);
      state.destroy = () => mediaQueryList.removeEventListener('change', listener);
    } else {
      // Fallback for older browsers
      (mediaQueryList as any).addListener(listener);
      state.destroy = () => (mediaQueryList as any).removeListener(listener);
    }
  }

  return state;
}
