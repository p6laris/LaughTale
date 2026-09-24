/**
 * LaughTale: Framework adapter slot/children forwarding (ROADMAP.v5.md Part D).
 *
 * `IslandTagHelper.cs` (and Blazor's `Island.razor`) already wrap any child content written
 * inside `<island name="...">...</island>` in `<div data-slot="default" class="island-slot">` for
 * EVERY island, regardless of adapter - 8 vanilla components already consume it directly via
 * `container.querySelector(':scope > .island-slot')`. The framework adapters (react/vue/preact)
 * never read it, so it was silently wiped out by their destructive mount. This module gives them
 * the exact same extraction convention the vanilla components already use, shared instead of
 * reimplemented three times.
 *
 * Deliberately does NOT touch `[data-slot="fallback"]`/`.island-fallback-template` - a separate,
 * error-boundary-only mechanism owned by `error-boundary.ts` that must still be findable if
 * hydration fails after a framework adapter's mount already ran.
 */

export interface ExtractedSlot {
    /** The slot's captured child nodes, detached from the container. Consumed on first `attach()`. */
    fragment: DocumentFragment;
    /**
     * Called from a framework ref/callback once the real host DOM node for the slot is available.
     * Safe to call with `null` (a framework's unmount-time ref-clear) - it's a no-op.
     */
    attach(hostEl: HTMLElement | null): void;
    /** True once `attach()` has successfully re-inserted the extracted content at least once. */
    wasRendered(): boolean;
}

/**
 * Extracts `:scope > .island-slot`'s children from `container` into a detached DocumentFragment,
 * removing the now-empty wrapper div - mirroring exactly what `fieldset.ts`/`panel.ts`/etc. already
 * do by hand. Moves real nodes (not a re-serialized copy), so anything live inside the slot -
 * including an already-hydrating nested island - survives intact once re-attached.
 */
export function extractIslandSlot(container: HTMLElement): ExtractedSlot | null {
    const slotEl = container.querySelector<HTMLElement>(':scope > .island-slot');
    if (!slotEl) return null;

    const fragment = document.createDocumentFragment();
    Array.from(slotEl.childNodes).forEach((node) => fragment.appendChild(node));
    slotEl.remove();

    let rendered = false;
    return {
        fragment,
        attach(hostEl) {
            if (hostEl && fragment.hasChildNodes()) {
                hostEl.appendChild(fragment);
                rendered = true;
            }
        },
        wasRendered: () => rendered
    };
}

/**
 * Warns once, loudly, when a component received child content but never rendered it - the same
 * "silently dropped content deserves a loud warning" principle hydrator.ts's nested-island
 * destruction check already applies, for this adapter-level failure mode instead.
 */
export function warnIfSlotUnused(extractedSlot: ExtractedSlot | null, container: HTMLElement): void {
    if (!extractedSlot || extractedSlot.wasRendered()) return;
    const name = container.getAttribute('data-island') || container.getAttribute('name') || '(unnamed)';
    console.warn(`[LaughTale] Island '${name}' received child content (via <island>...</island> markup) but its mounted component never rendered it. Render \`props.children\` (React/Preact) or the default slot (Vue) to use it.`);
}

/**
 * Empties a container before a framework mount that APPENDS to its target (Svelte 5's mount(),
 * Solid's render()) rather than replacing its content, so server fallback markup doesn't stay next
 * to the live component. Keeps `<template data-slot="fallback">`: it's inert, and error-boundary.ts
 * reads it if the mount that follows throws. Call after extractIslandSlot(), which has already
 * detached the slot content.
 */
export function clearForAppendingMount(container: HTMLElement): void {
    for (const node of Array.from(container.childNodes)) {
        const isFallbackTemplate = node.nodeName === 'TEMPLATE' && (node as Element).getAttribute('data-slot') === 'fallback';
        if (!isFallbackTemplate) node.remove();
    }
}
