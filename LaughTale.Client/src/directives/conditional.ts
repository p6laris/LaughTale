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

    const dispose = effect(() => {
        const state = scope ? scope.state : {};
        const truthy = Boolean(evaluateExpression(expr, state));
        const inDom = element.parentNode !== null;

        if (truthy && !inDom) {
            placeholder.parentNode?.insertBefore(element, placeholder.nextSibling);
        } else if (!truthy && inDom) {
            element.remove();
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
