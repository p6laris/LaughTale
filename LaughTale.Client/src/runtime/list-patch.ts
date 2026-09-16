/**
 * LaughTale: Keyed List Reconciliation
 *
 * Patches a container's direct children against an ordered `items` array by
 * key, reusing (rather than recreating) DOM nodes whose key persists across
 * calls - the property that preserves focus/scroll/listeners on unchanged
 * rows. This is keyed *list* patching only, not general tree diffing.
 */

/**
 * Managed children are always plain `div` wrappers created by this function.
 * A generic keyed-list helper has no way to know what tag a given item
 * "should" be, and a `div` is the simplest choice that works for any
 * `innerHTML` content; callers needing a different wrapper tag should not
 * use this helper directly on that container.
 */
export function patchList<T>(
    container: Element,
    items: T[],
    getKey: (item: T) => string,
    renderItem: (item: T) => string
): void {
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
}
