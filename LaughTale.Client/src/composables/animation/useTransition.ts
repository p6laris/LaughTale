/**
 * LaughTale: Composable useTransition
 * Coordinates enter and exit transitions for modals, drawers, tooltips, and collapsing panels.
 */

import { getReducedMotionSafeDuration } from '../../styles/animations';
import { PRESET_VISUALS } from './transition-presets';

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
    const rawDuration = options.duration ?? 200;
    const duration = getReducedMotionSafeDuration(rawDuration);
    const easing = options.easing ?? 'cubic-bezier(0.16, 1, 0.3, 1)';
    const preset = options.preset ?? 'fade';

    // Bumped on every enter()/exit() call. Each rAF/setTimeout continuation below captures the
    // token at schedule time and checks it before touching styles or firing a callback - so a
    // still-pending exit() completion from before a rapid re-entry can't clobber the newer call's
    // styles (e.g. stomping display back to 'none' after enter() already reasserted 'block'), and
    // vice versa. Same shape as the l-if/patchList generation-counter fixes this pass (l-transition,
    // ROADMAP.v5.md Part I): a stale async callback checks whether it's since been superseded.
    let token = 0;

    // Derives from the shared PRESET_VISUALS table (transition-presets.ts) rather than its own
    // per-preset switch, so this and `runtime/list-transitions.ts` (l-for's WAAPI equivalent) can
    // never drift apart on what a given preset actually looks like. `collapse` (useTransition-only -
    // see list-transitions.ts) stays a local special case, since it needs height/overflow, which
    // doesn't fit the opacity/transform shape every other preset shares.
    function getPresetStyles(state: 'hidden' | 'visible'): Partial<CSSStyleDeclaration> {
        if (preset === 'collapse') {
            return {
                height: state === 'visible' ? 'auto' : '0px',
                opacity: state === 'visible' ? '1' : '0',
                overflow: 'hidden'
            };
        }
        const visual = PRESET_VISUALS[preset] ?? PRESET_VISUALS.fade;
        const styles: Partial<CSSStyleDeclaration> = {};
        if (visual.opacity) styles.opacity = state === 'visible' ? '1' : '0';
        if (visual.transform === 'none') {
            styles.transform = 'none';
        } else if (visual.transform) {
            styles.transform = state === 'visible' ? visual.transform.visible : visual.transform.hidden;
        }
        return styles;
    }

    function enter(cb?: () => void) {
        if (!element) return;
        const myToken = ++token;
        options.onEnterStart?.();

        const visible = getPresetStyles('visible');

        if (duration === 0) {
            Object.assign(element.style, visible);
            element.style.display = 'block';
            options.onEnterEnd?.();
            cb?.();
            return;
        }

        element.style.transition = `all ${duration}ms ${easing}`;
        element.style.willChange = 'transform, opacity';

        const hidden = getPresetStyles('hidden');
        Object.assign(element.style, hidden);
        element.style.display = 'block';

        requestAnimationFrame(() => {
            if (myToken !== token) return;
            requestAnimationFrame(() => {
                if (myToken !== token) return;
                Object.assign(element.style, visible);

                setTimeout(() => {
                    if (myToken !== token) return;
                    element.style.willChange = 'auto';
                    options.onEnterEnd?.();
                    cb?.();
                }, duration);
            });
        });
    }

    function exit(cb?: () => void) {
        if (!element) return;
        const myToken = ++token;
        options.onExitStart?.();

        const hidden = getPresetStyles('hidden');

        if (duration === 0) {
            Object.assign(element.style, hidden);
            element.style.display = 'none';
            options.onExitEnd?.();
            cb?.();
            return;
        }

        element.style.transition = `all ${duration}ms ${easing}`;
        element.style.willChange = 'transform, opacity';

        Object.assign(element.style, hidden);

        setTimeout(() => {
            if (myToken !== token) return;
            element.style.display = 'none';
            element.style.willChange = 'auto';
            options.onExitEnd?.();
            cb?.();
        }, duration);
    }

    return { enter, exit };
}
