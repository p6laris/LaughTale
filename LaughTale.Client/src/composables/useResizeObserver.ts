/**
 * LaughTale: Composable useResizeObserver
 * Element resize tracking.
 */

export interface UseResizeObserverOptions {
  box?: ResizeObserverBoxOptions;
  signal?: AbortSignal;
}

export interface ElementSize {
  width: number;
  height: number;
}

export interface UseResizeObserverReturn {
  size: ElementSize;
  observe(el: Element): void;
  unobserve(el: Element): void;
  disconnect(): void;
}

export function useResizeObserver(
  callback: (size: ElementSize, entry: ResizeObserverEntry) => void,
  options?: UseResizeObserverOptions
): UseResizeObserverReturn {
  const state: UseResizeObserverReturn = {
    size: { width: 0, height: 0 },
    observe: () => {},
    unobserve: () => {},
    disconnect: () => {}
  };

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        let width = 0;
        let height = 0;

        if (entry.borderBoxSize && entry.borderBoxSize.length > 0) {
          const box = entry.borderBoxSize[0];
          width = box.inlineSize;
          height = box.blockSize;
        } else {
          width = entry.contentRect.width;
          height = entry.contentRect.height;
        }

        const newSize = { width, height };
        state.size = newSize;
        callback(newSize, entry);
      });
    });

    state.observe = (el: Element) => observer.observe(el, options);
    state.unobserve = (el: Element) => observer.unobserve(el);
    state.disconnect = () => observer.disconnect();

    if (options?.signal) {
      options.signal.addEventListener('abort', () => state.disconnect(), { once: true });
    }
  }

  return state;
}
