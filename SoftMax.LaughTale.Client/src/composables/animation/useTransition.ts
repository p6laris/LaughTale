/**
 * SoftMax.LaughTale: Composable useTransition
 * Coordinates enter and exit transitions for modals, drawers, tooltips, and collapsing panels.
 */

export type TransitionPreset = 'fade' | 'scale' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'collapse';

export interface UseTransitionOptions {
    preset?: TransitionPreset;
    duration?: number; // ms
    easing?: string;
    onEnterStart?: () => void;
    onEnterEnd?: () => void;
    onExitStart?: () => void;
    onExitEnd?: () => void;
}

export function useTransition(element: HTMLElement | null, options: UseTransitionOptions = {}) {
    const duration = options.duration ?? 200;
    const easing = options.easing ?? 'cubic-bezier(0.16, 1, 0.3, 1)';
    const preset = options.preset ?? 'fade';

    function getPresetStyles(state: 'hidden' | 'visible'): Partial<CSSStyleDeclaration> {
        switch (preset) {
            case 'fade':
                return {
                    opacity: state === 'visible' ? '1' : '0',
                    transform: 'none'
                };
            case 'scale':
                return {
                    opacity: state === 'visible' ? '1' : '0',
                    transform: state === 'visible' ? 'scale(1)' : 'scale(0.95)'
                };
            case 'slide-up':
                return {
                    opacity: state === 'visible' ? '1' : '0',
                    transform: state === 'visible' ? 'translateY(0)' : 'translateY(12px)'
                };
            case 'slide-down':
                return {
                    opacity: state === 'visible' ? '1' : '0',
                    transform: state === 'visible' ? 'translateY(0)' : 'translateY(-12px)'
                };
            case 'slide-left':
                return {
                    transform: state === 'visible' ? 'translateX(0)' : 'translateX(100%)'
                };
            case 'slide-right':
                return {
                    transform: state === 'visible' ? 'translateX(0)' : 'translateX(-100%)'
                };
            case 'collapse':
                return {
                    height: state === 'visible' ? 'auto' : '0px',
                    opacity: state === 'visible' ? '1' : '0',
                    overflow: 'hidden'
                };
            default:
                return { opacity: state === 'visible' ? '1' : '0' };
        }
    }

    function enter(cb?: () => void) {
        if (!element) return;
        options.onEnterStart?.();

        element.style.transition = `all ${duration}ms ${easing}`;
        element.style.willChange = 'transform, opacity';

        const hidden = getPresetStyles('hidden');
        Object.assign(element.style, hidden);
        element.style.display = 'block';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const visible = getPresetStyles('visible');
                Object.assign(element.style, visible);

                setTimeout(() => {
                    element.style.willChange = 'auto';
                    options.onEnterEnd?.();
                    cb?.();
                }, duration);
            });
        });
    }

    function exit(cb?: () => void) {
        if (!element) return;
        options.onExitStart?.();

        element.style.transition = `all ${duration}ms ${easing}`;
        element.style.willChange = 'transform, opacity';

        const hidden = getPresetStyles('hidden');
        Object.assign(element.style, hidden);

        setTimeout(() => {
            element.style.display = 'none';
            element.style.willChange = 'auto';
            options.onExitEnd?.();
            cb?.();
        }, duration);
    }

    return { enter, exit };
}
