/**
 * SoftMax.LaughTale: Scoped Island CSS On Demand
 * 
 * Injects island stylesheets into <head> only when the island is hydrated,
 * with automatic deduplication and CSP nonce support.
 */

import { applyNonceToStyle } from '../directives/csp';

const injectedStyles = new Set<string>();

/**
 * Injects CSS rules for an island dynamically into the document head.
 * Includes CSP nonce when available and deduplication.
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
    applyNonceToStyle(styleEl);
    document.head.appendChild(styleEl);
}

/**
 * Removes injected styles for an island (useful for cleanup/HMR).
 */
export function removeIslandStyle(islandName: string): void {
    if (typeof document === 'undefined') return;
    const existing = document.querySelector(`style[data-island-style="${islandName}"]`);
    if (existing) {
        existing.remove();
        injectedStyles.delete(islandName);
    }
}
