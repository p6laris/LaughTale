/**
 * LaughTale: Headless useScrollLock Composable
 * Disables background page scrolling when modals or offcanvas drawers are active.
 */

let lockCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';

export function useScrollLock(signal?: AbortSignal) {
    function lock() {
        if (typeof document === 'undefined') return;

        if (lockCount === 0) {
            originalOverflow = document.body.style.overflow;
            originalPaddingRight = document.body.style.paddingRight;

            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }
        }
        lockCount++;
    }

    function unlock() {
        if (typeof document === 'undefined') return;

        lockCount = Math.max(0, lockCount - 1);
        if (lockCount === 0) {
            document.body.style.overflow = originalOverflow;
            document.body.style.paddingRight = originalPaddingRight;
        }
    }

    if (signal) {
        signal.addEventListener('abort', unlock, { once: true });
    }

    return { lock, unlock };
}
