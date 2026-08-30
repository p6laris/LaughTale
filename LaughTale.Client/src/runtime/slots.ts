/**
 * LaughTale: Server Slot Projection Helper
 * 
 * Extracts server-rendered slot HTML passed from C# Razor into client islands.
 */

/**
 * Finds and returns a slot container element within an island.
 * @param container The island root DOM element.
 * @param name The slot name (default: "default").
 */
export function getSlot(container: HTMLElement, name = 'default'): HTMLElement | null {
    return container.querySelector(`[data-slot="${name}"]`);
}

/**
 * Checks whether an island element contains a slot with the specified name.
 * @param container The island root DOM element.
 * @param name The slot name (default: "default").
 */
export function hasSlot(container: HTMLElement, name = 'default'): boolean {
    return getSlot(container, name) !== null;
}

/**
 * Extracts and detaches the server-rendered HTML content of a slot.
 */
export function extractSlotContent(container: HTMLElement, name = 'default'): string {
    const slotEl = getSlot(container, name);
    if (!slotEl) return '';
    return slotEl.innerHTML;
}
