/**
 * Checks if the user prefers reduced motion via the prefers-reduced-motion media query.
 */
export function isReducedMotionPreferred(): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Returns 0ms if the user prefers reduced motion, or the normal duration otherwise.
 */
export function getReducedMotionSafeDuration(normalDurationMs: number): number {
    return isReducedMotionPreferred() ? 0 : normalDurationMs;
}

