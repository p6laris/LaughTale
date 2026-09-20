/**
 * LaughTale: Keyed List Transitions (WAAPI)
 *
 * Enter/exit/move animations for `patchList`'s animated path (`runtime/list-patch.ts`). Keyframes
 * are ported 1:1 from `useTransition.ts`'s `getPresetStyles` visual mapping so `l-transition="fade"`
 * looks identical whether it sits on `l-if` or `l-for`. Unlike `useTransition` (inline-style +
 * double-rAF + setTimeout), this uses the real Web Animations API directly, since `patchList` needs
 * a promise it can sequence a DOM removal after, and cancellable in-flight animations (for the
 * exit/re-add race - see `list-patch.ts`).
 */

import type { TransitionPreset } from '../composables/animation/useTransition';
import { PRESET_VISUALS, type SimplePreset } from '../composables/animation/transition-presets';
import { getReducedMotionSafeDuration } from '../styles/animations';

export interface ListTransitionOptions {
    preset: TransitionPreset;
    duration?: number;
    easing?: string;
}

const DEFAULT_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

// Derived from the same PRESET_VISUALS table useTransition.ts's getPresetStyles reads, so
// `l-transition="fade"` looks identical whether it sits on `l-if` or `l-for` by construction.
function enterKeyframes(preset: SimplePreset): Keyframe[] {
    const visual = PRESET_VISUALS[preset];
    const hidden: Keyframe = {};
    const visible: Keyframe = {};
    if (visual.opacity) {
        hidden.opacity = 0;
        visible.opacity = 1;
    }
    if (visual.transform && visual.transform !== 'none') {
        hidden.transform = visual.transform.hidden;
        visible.transform = visual.transform.visible;
    }
    return [hidden, visible];
}

function exitKeyframes(preset: SimplePreset): Keyframe[] {
    return [...enterKeyframes(preset)].reverse();
}

// `Element` already declares `animate`/`getAnimations` (the `Animatable` mixin), so no cast is
// needed to call them - but happy-dom's test DOM (see tests/setup.ts) does not actually implement
// `Element.prototype.animate`, so real feature-detection at runtime is still required.
function supportsWaapi(el: Element): boolean {
    return typeof el.animate === 'function';
}

/**
 * Plays an enter or exit animation on `el` and resolves once it settles (either by finishing or
 * by being cancelled - a cancellation must never hang a caller awaiting this promise, since
 * `list-patch.ts` cancels an in-flight exit when its key reappears). Resolves immediately, with no
 * visual change, when WAAPI isn't available or the reduced-motion-clamped duration is 0.
 *
 * `collapse` has no per-item measured-height equivalent here (patchList's model is synchronous, a
 * collapse needs a real layout pass) - it downgrades to `fade` with a one-time warning per call.
 */
export function playListTransition(el: Element, kind: 'enter' | 'exit', options: ListTransitionOptions): Promise<void> {
    const duration = getReducedMotionSafeDuration(options.duration ?? 200);
    if (duration === 0 || !supportsWaapi(el)) return Promise.resolve();

    let preset: SimplePreset;
    if (options.preset === 'collapse') {
        console.warn('[LaughTale] l-transition="collapse" is not supported on l-for; falling back to "fade".');
        preset = 'fade';
    } else {
        preset = options.preset;
    }

    const frames = kind === 'enter' ? enterKeyframes(preset) : exitKeyframes(preset);
    const anim = el.animate(frames, { duration, easing: options.easing ?? DEFAULT_EASING, fill: 'both' });
    return new Promise<void>((resolve) => {
        anim.onfinish = () => resolve();
        anim.oncancel = () => resolve();
    });
}

/**
 * Fire-and-forget FLIP reposition for a survivor whose rect changed across a `patchList` call -
 * a translate-then-none technique computed synchronously here, since patchList already knows
 * exactly what moved (no MutationObserver needed, unlike the deleted useAutoAnimate.ts).
 */
export function playListMove(el: Element, deltaX: number, deltaY: number, options: { duration?: number; easing?: string }): void {
    if (deltaX === 0 && deltaY === 0) return;
    const duration = getReducedMotionSafeDuration(options.duration ?? 200);
    if (duration === 0 || !supportsWaapi(el)) return;
    el.animate(
        [{ transform: `translate(${deltaX}px, ${deltaY}px)` }, { transform: 'none' }],
        { duration, easing: options.easing ?? 'cubic-bezier(0.2, 0, 0, 1)' }
    );
}
