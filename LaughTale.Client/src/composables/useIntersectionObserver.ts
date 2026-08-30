/**
 * LaughTale: Composable useIntersectionObserver
 * Reactive viewport intersection tracking.
 */

export interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
  signal?: AbortSignal;
}

export interface UseIntersectionObserverReturn {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
  observe(el: Element): void;
  unobserve(el: Element): void;
  disconnect(): void;
}

export function useIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: UseIntersectionObserverOptions
): UseIntersectionObserverReturn {
  const state: UseIntersectionObserverReturn = {
    isIntersecting: false,
    entry: null,
    observe: () => {},
    unobserve: () => {},
    disconnect: () => {}
  };

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        state.isIntersecting = entry.isIntersecting;
        state.entry = entry;
        callback(entry);
        
        if (entry.isIntersecting && options?.once) {
          observer.unobserve(entry.target);
        }
      });
    }, options);

    state.observe = (el: Element) => observer.observe(el);
    state.unobserve = (el: Element) => observer.unobserve(el);
    state.disconnect = () => observer.disconnect();

    if (options?.signal) {
      options.signal.addEventListener('abort', () => state.disconnect(), { once: true });
    }
  }

  return state;
}
