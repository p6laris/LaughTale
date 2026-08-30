/**
 * LaughTale: Composable useMorphLayout Animation
 * Smoothly morphs geometry and position of an active pill/indicator element across target elements.
 */

export interface MorphLayoutOptions {
    duration?: number;
    easing?: string;
}

export function useMorphLayout(indicator: HTMLElement, options: MorphLayoutOptions = {}) {
    const duration = options.duration ?? 200;
    const easing = options.easing ?? 'cubic-bezier(0.2, 0, 0, 1)';

    indicator.style.position = 'absolute';
    indicator.style.transition = `left ${duration}ms ${easing}, top ${duration}ms ${easing}, width ${duration}ms ${easing}, height ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
    indicator.style.pointerEvents = 'none';

    function moveTo(target: HTMLElement | null) {
        if (!target || !target.offsetParent) {
            indicator.style.opacity = '0';
            return;
        }

        indicator.style.opacity = '1';
        indicator.style.left = `${target.offsetLeft}px`;
        indicator.style.top = `${target.offsetTop}px`;
        indicator.style.width = `${target.offsetWidth}px`;
        indicator.style.height = `${target.offsetHeight}px`;
    }

    return { moveTo };
}
