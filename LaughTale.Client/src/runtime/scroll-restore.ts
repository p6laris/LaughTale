/**
 * LaughTale: settling scroll restoration for client-side navigation.
 *
 * The router swaps the new page's HTML in and restores the saved scroll position immediately, but
 * the page isn't finished yet: islands hydrate, fonts and images load, and the document keeps
 * growing for a few hundred milliseconds. A one-shot window.scrollTo() at that point goes wrong in
 * two ways:
 *  - clamping: if the page can't scroll that far YET, the browser clamps to the current maximum and
 *    the position is lost once the page grows (a saved 124 became 0 on a tall viewport);
 *  - scroll anchoring: when content ABOVE the viewport grows, the browser shifts scrollY to keep
 *    the visible content still, so the restored value drifts (a saved 123 became 135 in CI).
 *
 * holdScrollPosition() instead keeps the target until the page settles: it turns scroll anchoring
 * off, re-applies the target whenever the document resizes, and lets go as soon as the user scrolls
 * or presses a key, once the document has stopped resizing, or at a hard time limit.
 */

export interface HoldScrollOptions {
    /** Let go this long after the document last resized. */
    settleMs?: number;
    /** Never hold longer than this. */
    maxMs?: number;
}

const USER_SCROLL_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;

let releaseCurrent: (() => void) | null = null;

/** Stops any hold in progress (e.g. because a new navigation started). */
export function releaseScrollHold(): void {
    releaseCurrent?.();
}

export function holdScrollPosition(x: number, y: number, options: HoldScrollOptions = {}): void {
    if (typeof window === 'undefined') return;
    releaseScrollHold();

    const settleMs = options.settleMs ?? 400;
    const maxMs = options.maxMs ?? 3000;
    const root = document.documentElement;
    const previousAnchor = root.style.getPropertyValue('overflow-anchor');
    root.style.setProperty('overflow-anchor', 'none');

    const apply = () => {
        if (Math.abs((window.scrollY || 0) - y) >= 1 || Math.abs((window.scrollX || 0) - x) >= 1) {
            window.scrollTo({ left: x, top: y, behavior: 'instant' as ScrollBehavior });
        }
    };

    const listeners = new AbortController();
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    let observer: ResizeObserver | null = null;

    const release = () => {
        if (releaseCurrent !== release) return;
        releaseCurrent = null;
        listeners.abort();
        observer?.disconnect();
        clearTimeout(settleTimer);
        clearTimeout(maxTimer);
        if (previousAnchor) root.style.setProperty('overflow-anchor', previousAnchor);
        else root.style.removeProperty('overflow-anchor');
    };
    releaseCurrent = release;

    const restartSettle = () => {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(release, settleMs);
    };
    const maxTimer = setTimeout(release, maxMs);

    // The user taking over ends the hold immediately - never fight their scrolling.
    for (const type of USER_SCROLL_EVENTS) {
        window.addEventListener(type, release, { capture: true, passive: true, signal: listeners.signal });
    }

    if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(() => {
            apply();
            restartSettle();
        });
        observer.observe(root);
        if (document.body) observer.observe(document.body);
    }

    apply();
    restartSettle();
}
