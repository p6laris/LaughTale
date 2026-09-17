/**
 * LaughTale: Keyed List Reconciliation
 *
 * Patches a container's direct children against an ordered `items` array by
 * key, reusing (rather than recreating) DOM nodes whose key persists across
 * calls - the property that preserves focus/scroll/listeners on unchanged
 * rows. This is keyed *list* patching only, not general tree diffing.
 */

import type { TransitionPreset } from '../composables/animation/useTransition';
import { playListTransition, playListMove } from './list-transitions';

export interface PatchListTransitionOptions {
    preset: TransitionPreset;
    duration?: number;
    easing?: string;
}

/**
 * Managed children are always plain `div` wrappers created by this function.
 * A generic keyed-list helper has no way to know what tag a given item
 * "should" be, and a `div` is the simplest choice that works for any
 * `innerHTML` content; callers needing a different wrapper tag should not
 * use this helper directly on that container.
 *
 * `transitionOptions` is optional and additive: omitting it (as all 4 pre-existing call sites do)
 * takes the exact original code path below, unchanged. Passing it delegates to `patchListAnimated`
 * (below), which adds enter/exit/move animations on top of the same reconciliation shape.
 */
export function patchList<T>(
    container: Element,
    items: T[],
    getKey: (item: T) => string,
    renderItem: (item: T) => string,
    transitionOptions?: PatchListTransitionOptions
): void {
    if (!transitionOptions) {
        const existingByKey = new Map<string, Element>();
        for (const child of Array.from(container.children)) {
            const key = child.getAttribute('data-key');
            if (key !== null) existingByKey.set(key, child);
        }

        const usedKeys = new Set<string>();
        // The node currently anchoring "insert before here" for the next item.
        // Advances only when the item already sits in the right place; otherwise
        // it stays put and successive inserts stack up before it in order.
        let refNode: Element | null = container.firstElementChild;

        for (const item of items) {
            const key = getKey(item);
            usedKeys.add(key);
            const existing = existingByKey.get(key);

            if (existing) {
                const html = renderItem(item);
                if (existing.innerHTML !== html) {
                    existing.innerHTML = html;
                }
                if (existing === refNode) {
                    refNode = refNode.nextElementSibling;
                } else {
                    container.insertBefore(existing, refNode);
                }
            } else {
                const node = document.createElement('div');
                node.setAttribute('data-key', key);
                node.innerHTML = renderItem(item);
                container.insertBefore(node, refNode);
            }
        }

        for (const [key, el] of existingByKey) {
            if (!usedKeys.has(key)) {
                el.remove();
            }
        }
        return;
    }

    patchListAnimated(container, items, getKey, renderItem, transitionOptions);
}

interface ExitingEntry {
    el: Element;
    cancel: () => void;
}

// Per-container in-flight exit animations, keyed by the item key that's leaving. Module-level (not
// per-call) so a later patchList call on the same container can find and cancel/reuse a node that's
// still mid-exit-animation - see the exit/re-add race handling below.
const exitingByContainer = new WeakMap<Element, Map<string, ExitingEntry>>();

/**
 * The animated counterpart to `patchList`'s default (no-transition) reconciliation above. Same
 * keyed reuse-or-create shape, plus:
 * - a departed key's node isn't removed synchronously; it plays an exit animation first, and is
 *   only actually removed once that settles (unless it's cancelled first - see below);
 * - a key that's mid-exit and reappears in this call is reclaimed (its exit is cancelled and the
 *   same node is reused) instead of creating a duplicate node for it;
 * - newly-created nodes play an enter animation (fire-and-forget);
 * - survivors whose position changed play a FLIP move animation, computed from rects recorded
 *   before this call's reordering.
 */
function patchListAnimated<T>(
    container: Element,
    items: T[],
    getKey: (item: T) => string,
    renderItem: (item: T) => string,
    transitionOptions: PatchListTransitionOptions
): void {
    let exitingLookup = exitingByContainer.get(container);
    if (!exitingLookup) {
        exitingLookup = new Map<string, ExitingEntry>();
        exitingByContainer.set(container, exitingLookup);
    }
    // Bound to a fresh `const` so closures below (which TS cannot otherwise prove still see a
    // narrowed, non-undefined `let`) capture a value TS knows is always a `Map`.
    const exiting: Map<string, ExitingEntry> = exitingLookup;

    // A key currently exiting that reappears in this call's items: cancel its exit animation (this
    // resolves the pending playListTransition promise via `oncancel`, a no-op) and drop it from the
    // exiting set so the reconciliation loop below picks its existing node back up as a survivor.
    const nextKeys = new Set<string>(items.map(getKey));
    for (const key of nextKeys) {
        const inFlight = exiting.get(key);
        if (inFlight) {
            inFlight.cancel();
            exiting.delete(key);
        }
    }

    const isExiting = (el: Element): boolean => {
        const key = el.getAttribute('data-key');
        return key !== null && exiting.has(key);
    };

    const existingByKey = new Map<string, Element>();
    for (const child of Array.from(container.children)) {
        const key = child.getAttribute('data-key');
        if (key !== null && !exiting.has(key)) existingByKey.set(key, child);
    }

    // FLIP step 1: record survivor rects before this call reorders anything.
    const beforeRects = new Map<string, DOMRect>();
    for (const [key, el] of existingByKey) {
        beforeRects.set(key, el.getBoundingClientRect());
    }

    const usedKeys = new Set<string>();
    const createdByKey = new Map<string, Element>();

    // Same "insert before here" cursor as the non-animated path, except it also skips over any
    // still-exiting node - that node's DOM position is mid-animation, not part of the current order.
    let refNode: Element | null = container.firstElementChild;
    while (refNode && isExiting(refNode)) {
        refNode = refNode.nextElementSibling;
    }

    for (const item of items) {
        const key = getKey(item);
        usedKeys.add(key);
        const existing = existingByKey.get(key);

        if (existing) {
            const html = renderItem(item);
            if (existing.innerHTML !== html) {
                existing.innerHTML = html;
            }
            if (existing === refNode) {
                refNode = refNode.nextElementSibling;
                while (refNode && isExiting(refNode)) {
                    refNode = refNode.nextElementSibling;
                }
            } else {
                container.insertBefore(existing, refNode);
            }
        } else {
            const node = document.createElement('div');
            node.setAttribute('data-key', key);
            node.innerHTML = renderItem(item);
            container.insertBefore(node, refNode);
            createdByKey.set(key, node);
        }
    }

    // FLIP step 2: any survivor whose rect actually changed gets a move animation. Departing keys
    // are deliberately excluded here even though they're still in `existingByKey` at this point (the
    // exit-registration loop below hasn't run yet) - a node about to exit shouldn't also get a move
    // animation just because reconciliation shifted it before removal; that's wasted work at best,
    // and at worst competes with its own exit animation on the same `transform` property for
    // scale/slide-* presets.
    for (const [key, el] of existingByKey) {
        if (!usedKeys.has(key)) continue;
        const before = beforeRects.get(key);
        if (!before) continue;
        const after = el.getBoundingClientRect();
        playListMove(el, before.left - after.left, before.top - after.top, {
            duration: transitionOptions.duration,
            easing: transitionOptions.easing
        });
    }

    // Enter: newly-created nodes, fire-and-forget.
    for (const el of createdByKey.values()) {
        void playListTransition(el, 'enter', transitionOptions);
    }

    // Exit: a departed key's node is not removed synchronously. It's registered as exiting first
    // (so a later patchList call within the same tick, e.g. a rapid re-add, can find and reclaim it)
    // and only actually removed once its exit animation settles - and only if that map entry still
    // points at this exact element, i.e. it wasn't reclaimed/cancelled in the meantime.
    for (const [key, el] of existingByKey) {
        if (usedKeys.has(key)) continue;

        const entry: ExitingEntry = {
            el,
            cancel: () => {
                for (const anim of el.getAnimations?.() ?? []) {
                    anim.cancel();
                }
            }
        };
        exiting.set(key, entry);

        void playListTransition(el, 'exit', transitionOptions).then(() => {
            const current = exiting.get(key);
            if (current && current.el === el) {
                exiting.delete(key);
                el.remove();
            }
        });
    }
}
