/**
 * LaughTale: Conditional Rendering Directive (l-if)
 *
 * Toggles a single element in and out of the DOM based on a reactive expression,
 * without destroying/recreating it - so state on the element (and any directives
 * already bound to its descendants) survives across truthy/falsy toggles.
 */

import { evaluateExpression, getNearestScope } from './reactivity';
import { effect } from '../runtime/signals';
import { registerDirectiveCleanup } from './lifecycle';
import { useTransition } from '../composables/animation/useTransition';
import { parseTransitionAttr } from './transition-attr';

export function bindConditionalDirectives(element: HTMLElement): void {
    if (!element.hasAttribute('l-if')) return;

    const expr = element.getAttribute('l-if')!;
    const scope = getNearestScope(element);

    const parent = element.parentNode;
    if (!parent) return;

    // Replace the element with a comment placeholder that anchors where it goes
    // when shown, then detach the real element (kept, not cloned, so any state or
    // directive bindings on it/its descendants remain valid across toggles).
    const placeholder = document.createComment(`l-if: ${expr}`);
    parent.insertBefore(placeholder, element);
    parent.removeChild(element);

    // Static markup, read once - same convention as `l-key` in list.ts.
    const parsedTransition = parseTransitionAttr(element.getAttribute('l-transition'));
    const transition = parsedTransition
        ? useTransition(element, { preset: parsedTransition.preset, duration: parsedTransition.duration })
        : null;

    // Tracks *intent*, not DOM presence. This matters only once a transition is involved: `exit()`
    // doesn't remove the element synchronously, it animates it and calls back `duration`ms later -
    // so `element.parentNode !== null` stays true for the whole exit animation. Gating on that (as
    // the no-transition path below still correctly does, since there insertion/removal IS synchronous
    // with the branch) would both (a) let a stale exit callback remove an element a later flip already
    // re-showed, and (b) fail to re-run enter() on a rapid re-flip mid-exit, since `inDom` never
    // actually went false. `generation` (bumped on every flip) lets the exit callback recognize when
    // it's stale and become a no-op.
    let visualState: 'hidden' | 'visible' = 'hidden';
    let generation = 0;

    const dispose = effect(() => {
        const state = scope ? scope.state : {};
        const truthy = Boolean(evaluateExpression(expr, state));

        if (!transition) {
            // Unchanged from before transitions existed: DOM presence IS the state here, since
            // insertion/removal both happen synchronously in the same branch that would otherwise
            // update `visualState` - so branching on `inDom` and branching on `visualState` are
            // exactly equivalent for this path.
            const inDom = element.parentNode !== null;
            if (truthy && !inDom) {
                placeholder.parentNode?.insertBefore(element, placeholder.nextSibling);
            } else if (!truthy && inDom) {
                element.remove();
            }
            return;
        }

        if (truthy && visualState !== 'visible') {
            visualState = 'visible';
            generation++;
            if (element.parentNode === null) {
                placeholder.parentNode?.insertBefore(element, placeholder.nextSibling);
            }
            transition.enter();
        } else if (!truthy && visualState !== 'hidden') {
            visualState = 'hidden';
            generation++;
            const myGeneration = generation;
            transition.exit(() => {
                if (myGeneration !== generation) return; // stale callback from a since-superseded toggle - no-op
                element.remove();
            });
        }
    });

    // `teardownDirectives` finds elements via `root.querySelectorAll('*')`, which
    // will NOT discover `element` while it currently sits in its "hidden"
    // (detached) branch. Register the same (idempotent) dispose on the stable
    // parent too - it stays attached in either branch, so a navigation teardown
    // still reaches this cleanup (and therefore any interval/observer-owning
    // descendants) even when the l-if element happens to be hidden at the time.
    registerDirectiveCleanup(element, dispose);
    if (parent instanceof Element) {
        registerDirectiveCleanup(parent, dispose);
    }
}
