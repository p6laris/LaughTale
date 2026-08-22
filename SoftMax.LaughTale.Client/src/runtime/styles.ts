/**
 * SoftMax.LaughTale: Scoped Island CSS On Demand
 * 
 * Injects island stylesheets into <head> only when the island is hydrated,
 * with automatic deduplication.
 */

const injectedStyles = new Set<string>();

/**
 * Injects CSS rules for an island dynamically into the document head.
 * @param islandName The island name
 * @param css The CSS text content
 */
export function injectIslandStyle(islandName: string, css: string): void {
    if (injectedStyles.has(islandName) || typeof document === 'undefined') {
        return;
    }

    injectedStyles.add(islandName);

    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-island-style', islandName);
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
}
