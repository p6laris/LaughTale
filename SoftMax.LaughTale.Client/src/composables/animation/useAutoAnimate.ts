/**
 * SoftMax.LaughTale: Composable useAutoAnimate (FLIP Engine)
 * Zero-config layout transitions when items in a list or grid are added, removed, or reordered.
 */

export interface AutoAnimateOptions {
    duration?: number;
    easing?: string;
}

export function useAutoAnimate(parent: HTMLElement | null, options: AutoAnimateOptions = {}) {
    if (!parent || typeof window === 'undefined' || !('MutationObserver' in window)) {
        return { destroy: () => {} };
    }

    const duration = options.duration ?? 250;
    const easing = options.easing ?? 'cubic-bezier(0.2, 0, 0, 1)';
    const prevRects = new Map<Element, DOMRect>();

    function recordRects() {
        prevRects.clear();
        Array.from(parent!.children).forEach(child => {
            prevRects.set(child, child.getBoundingClientRect());
        });
    }

    function animate() {
        const currentChildren = Array.from(parent!.children);

        currentChildren.forEach(child => {
            const first = prevRects.get(child);
            const last = child.getBoundingClientRect();

            if (first) {
                const deltaX = first.left - last.left;
                const deltaY = first.top - last.top;

                if (deltaX !== 0 || deltaY !== 0) {
                    child.animate([
                        { transform: `translate(${deltaX}px, ${deltaY}px)` },
                        { transform: 'none' }
                    ], {
                        duration,
                        easing
                    });
                }
            } else {
                // New Element Enter Animation
                child.animate([
                    { opacity: 0, transform: 'scale(0.95)' },
                    { opacity: 1, transform: 'none' }
                ], {
                    duration,
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
