/**
 * LaughTale: Directive Cleanup Registry
 *
 * WeakMap-per-element registry (mirrors `reactivity.ts`'s `elementScopeMap`)
 * letting directives register teardown callbacks that run when their element
 * is torn down - e.g. across an SPA navigation that discards a subtree.
 */

const cleanupMap = new WeakMap<Element, Set<() => void>>();

export function registerDirectiveCleanup(element: Element, cleanup: () => void): void {
    let cleanups = cleanupMap.get(element);
    if (!cleanups) {
        cleanups = new Set();
        cleanupMap.set(element, cleanups);
    }
    cleanups.add(cleanup);
}

export function teardownDirectives(root: ParentNode, opts?: { skip?: (el: Element) => boolean }): void {
    const elements = Array.from(root.querySelectorAll<Element>('*'));
    if (root instanceof Element) {
        elements.unshift(root);
    }

    for (const el of elements) {
        const cleanups = cleanupMap.get(el);
        if (!cleanups) continue;
        if (opts?.skip?.(el)) continue;

        for (const cleanup of cleanups) {
            try {
                cleanup();
            } catch (err) {
                console.error('[LaughTale] Directive cleanup threw:', err);
            }
        }
        cleanupMap.delete(el);
    }
}
