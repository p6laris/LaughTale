/**
 * LaughTale: Composable useAutoAnimate (FLIP Engine)
 * Zero-config layout transitions when items in a list or grid are added, removed, or reordered.
 * Keys elements by data-id / data-key to guarantee smooth FLIP physics without opacity blinking.
 */

export interface AutoAnimateOptions {
    duration?: number;
    easing?: string;
}

export function useAutoAnimate(parent: HTMLElement | null, options: AutoAnimateOptions = {}) {
    if (!parent || typeof window === 'undefined' || typeof MutationObserver === 'undefined') {
        return { destroy: () => {} };
    }

    const duration = options.duration ?? 200;
    const easing = options.easing ?? 'cubic-bezier(0.2, 0, 0, 1)';
    const prevRects = new Map<string, DOMRect>();

    function getKey(el: Element, idx: number): string {
        return el.getAttribute('data-id') || el.getAttribute('data-key') || el.getAttribute('data-row-key') || el.id || `item-${idx}`;
    }

    function recordRects() {
        prevRects.clear();
        if (!parent) return;
        Array.from(parent.children).forEach((child, idx) => {
            prevRects.set(getKey(child, idx), child.getBoundingClientRect());
        });
    }

    function animate() {
        if (!parent) return;
        const currentChildren = Array.from(parent.children);

        currentChildren.forEach((child, idx) => {
            const key = getKey(child, idx);
            const first = prevRects.get(key);
            const last = child.getBoundingClientRect();

            if (first) {
                const deltaX = first.left - last.left;
                const deltaY = first.top - last.top;

                if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
                    child.animate([
                        { transform: `translate(${deltaX}px, ${deltaY}px)` },
                        { transform: 'none' }
                    ], {
                        duration,
                        easing
                    });
                }
            } else {
                // New item enter
                child.animate([
                    { opacity: 0.4, transform: 'scale(0.98)' },
                    { opacity: 1, transform: 'none' }
                ], {
                    duration: 150,
                    easing
                });
            }
        });
    }

    recordRects();

    const observer = new MutationObserver(() => {
        animate();
        recordRects();
    });

    observer.observe(parent, { childList: true });

    return {
        destroy: () => {
            observer.disconnect();
            prevRects.clear();
        }
    };
}
