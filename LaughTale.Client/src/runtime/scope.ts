/**
 * LaughTale: Island Resource Scope & Teardown Lifecycle Helper (LT-201)
 * 
 * Provides automated resource tracking for event listeners, observers, timers, and custom
 * teardown callbacks. Executing scope.dispose() cleanly releases all attached resources,
 * eliminating memory leaks and dangling handlers across SPA navigations.
 */

export interface IslandScope {
    /**
     * Attaches an event listener to a target (element, window, document) and registers automatic removal on dispose.
     */
    on<K extends keyof HTMLElementEventMap>(
        target: EventTarget,
        event: K | string,
        handler: (ev: any) => void,
        options?: boolean | AddEventListenerOptions
    ): void;

    /**
     * Registers an observer (IntersectionObserver, ResizeObserver, MutationObserver) to be disconnected on dispose.
     */
    observe(observer: { disconnect(): void }): void;

    /**
     * Registers a timer ID (setInterval, setTimeout) to be cleared on dispose.
     */
    timer(id: number | NodeJS.Timeout | any): void;

    /**
     * Registers an arbitrary cleanup function to be executed on dispose.
     */
    cleanup(fn: () => void): void;

    /**
     * Executes all registered cleanups in reverse (LIFO) order. Idempotent and fault-tolerant.
     */
    dispose(): void;
}

/**
 * Creates a new IslandScope instance for managing component resource lifecycles.
 */
export function createScope(): IslandScope {
    const cleanups: Array<() => void> = [];
    let isDisposed = false;

    return {
        on(target: EventTarget, event: string, handler: (ev: any) => void, options?: boolean | AddEventListenerOptions) {
            if (isDisposed || !target) return;
            target.addEventListener(event, handler, options);
            cleanups.push(() => {
                target.removeEventListener(event, handler, options);
            });
        },

        observe(observer: { disconnect(): void }) {
            if (isDisposed || !observer) return;
            cleanups.push(() => {
                try {
                    observer.disconnect();
                } catch {
                    // ignore
                }
            });
        },

        timer(id: number | NodeJS.Timeout | any) {
            if (isDisposed || id === null || id === undefined) return;
            cleanups.push(() => {
                try {
                    clearInterval(id);
                    clearTimeout(id);
                } catch {
                    // ignore
                }
            });
        },

        cleanup(fn: () => void) {
            if (isDisposed || typeof fn !== 'function') return;
            cleanups.push(fn);
        },

        dispose() {
            if (isDisposed) return;
            isDisposed = true;

            // Execute cleanups in reverse (LIFO) registration order
            while (cleanups.length > 0) {
                const cleanupFn = cleanups.pop();
                if (typeof cleanupFn === 'function') {
                    try {
                        cleanupFn();
                    } catch (error) {
                        console.error('[LaughTale Scope] Error executing cleanup task:', error);
                    }
                }
            }
        }
    };
}
