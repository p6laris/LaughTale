/**
 * LaughTale: Headless useClickOutside Composable
 * Detects pointer and mouse clicks outside of a target element with support for ignore elements.
 */

export interface UseClickOutsideOptions {
    ignoreElements?: Array<HTMLElement | null | undefined>;
    capture?: boolean;
}

export function useClickOutside(
    target: HTMLElement | null,
    handler: (e: MouseEvent | TouchEvent) => void,
    options: UseClickOutsideOptions = {}
) {
    if (!target || typeof document === 'undefined') return { destroy: () => {} };

    function listener(e: MouseEvent | TouchEvent) {
        const path = e.composedPath ? e.composedPath() : [];
        const clickedNode = e.target as Node;

        if (target && (target === clickedNode || target.contains(clickedNode) || path.includes(target))) {
            return;
        }

        if (options.ignoreElements) {
            for (const el of options.ignoreElements) {
                if (el && (el === clickedNode || el.contains(clickedNode) || path.includes(el))) {
                    return;
                }
            }
        }

        handler(e);
    }

    const capture = options.capture ?? false;
    document.addEventListener('pointerdown', listener, { capture });
    document.addEventListener('touchstart', listener, { capture });

    return {
        destroy: () => {
            document.removeEventListener('pointerdown', listener, { capture });
            document.removeEventListener('touchstart', listener, { capture });
        }
    };
}
