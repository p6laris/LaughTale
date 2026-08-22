/**
 * SoftMax.LaughTale: Composable useEventListener
 * Lifecycle-safe event listener registration with automatic unbinding and target normalization.
 */

export function useEventListener<K extends keyof HTMLElementEventMap>(
    target: EventTarget | null | undefined,
    type: K | string,
    listener: (ev: any) => any,
    options?: boolean | AddEventListenerOptions
): () => void {
    if (!target || typeof target.addEventListener !== 'function') {
        return () => {};
    }

    target.addEventListener(type, listener, options);

    return () => {
        target.removeEventListener(type, listener, options);
    };
}
