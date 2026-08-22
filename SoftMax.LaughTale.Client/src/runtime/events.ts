/**
 * SoftMax.LaughTale: Zero-Dependency Inter-Island Event Bus
 * 
 * Allows isolated islands on the same page to broadcast and listen
 * to events without global window pollution or framework lock-in.
 */

type Handler<T = any> = (detail: T) => void;
const bus = new Map<string, Set<Handler>>();

/**
 * Emits an event to all subscribed islands.
 */
export function emitIslandEvent<T = any>(event: string, detail?: T): void {
    const handlers = bus.get(event);
    if (handlers) {
        handlers.forEach(fn => {
            try {
                fn(detail);
            } catch (err) {
                console.error(`[SoftMax.LaughTale] Error in event listener for "${event}":`, err);
            }
        });
    }

    // Also dispatch to DOM for external listeners if needed
    window.dispatchEvent(new CustomEvent(`island:${event}`, { detail }));
}

/**
 * Subscribes to an island event. Returns an unsubscribe function.
 */
export function onIslandEvent<T = any>(event: string, handler: Handler<T>): () => void {
    if (!bus.has(event)) {
        bus.set(event, new Set());
    }
    bus.get(event)!.add(handler);

    return () => {
        const set = bus.get(event);
        if (set) {
            set.delete(handler);
            if (set.size === 0) bus.delete(event);
        }
    };
}
