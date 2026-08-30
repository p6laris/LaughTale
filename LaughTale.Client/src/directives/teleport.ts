/**
 * LaughTale: DOM Teleportation Directive (l-teleport)
 * Moves elements to target containers (like <body>) to prevent overflow clipping.
 */

export function bindTeleportDirectives(element: HTMLElement): void {
    for (const attr of Array.from(element.attributes)) {
        if (attr.name === 'l-teleport') {
            const targetSelector = attr.value || 'body';
            const targetContainer = document.querySelector(targetSelector);

            if (targetContainer && targetContainer !== element.parentElement) {
                targetContainer.appendChild(element);
            }
        }
    }
}
