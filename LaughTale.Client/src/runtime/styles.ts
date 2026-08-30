/**
 * LaughTale: Batched Island CSS Injection & Constructable StyleSheets (LT-703)
 * 
 * Batches island stylesheets in a single microtask frame, preferring document.adoptedStyleSheets
 * when supported to avoid DOM node churn and layout reflow thrashing. Falls back to <style> with CSP nonce.
 */

import { applyNonceToStyle } from '../directives/csp';

const injectedStyles = new Map<string, string>();
const pendingStyles = new Map<string, string>();
const adoptedSheetMap = new Map<string, CSSStyleSheet>();
let flushScheduled = false;

/**
 * Checks if Constructable StyleSheets are supported by the current environment.
 */
export function isAdoptedStyleSheetsSupported(): boolean {
    return typeof document !== 'undefined' &&
        'adoptedStyleSheets' in document &&
        typeof CSSStyleSheet !== 'undefined' &&
        'replaceSync' in CSSStyleSheet.prototype;
}

/**
 * Injects CSS rules for an island dynamically with microtask batching.
 * @param islandName The island name
 * @param css The CSS text content
 */
export function injectIslandStyle(islandName: string, css: string): void {
    if (typeof document === 'undefined') return;

    if (injectedStyles.get(islandName) === css) {
        return; // Already active and identical
    }

    injectedStyles.set(islandName, css);
    pendingStyles.set(islandName, css);

    if (isAdoptedStyleSheetsSupported()) {
        if (!flushScheduled) {
            flushScheduled = true;
            queueMicrotask(flushPendingStyles);
        }
    } else {
        flushPendingStyles();
    }
}

/**
 * Synchronously flushes all pending island stylesheets.
 */
export function flushPendingStyles(): void {
    flushScheduled = false;
    if (typeof document === 'undefined' || pendingStyles.size === 0) {
        return;
    }

    if (isAdoptedStyleSheetsSupported()) {
        const sheetsToAdd: CSSStyleSheet[] = [];

        pendingStyles.forEach((css, islandName) => {
            let sheet = adoptedSheetMap.get(islandName);
            if (!sheet) {
                sheet = new CSSStyleSheet();
                adoptedSheetMap.set(islandName, sheet);
            }
            try {
                sheet.replaceSync(css);
                if (!document.adoptedStyleSheets.includes(sheet)) {
                    sheetsToAdd.push(sheet);
                }
            } catch {
                // Ignore sync errors
            }
        });

        if (sheetsToAdd.length > 0) {
            document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...sheetsToAdd];
        }
    } else {
        // Fallback to <style data-island-style="..."> in document.head
        if (document.head) {
            pendingStyles.forEach((css, islandName) => {
                let styleEl = document.head.querySelector<HTMLStyleElement>(`style[data-island-style="${islandName}"]`);
                if (!styleEl) {
                    styleEl = document.createElement('style');
                    styleEl.setAttribute('data-island-style', islandName);
                    applyNonceToStyle(styleEl);
                    document.head.appendChild(styleEl);
                }
                styleEl.textContent = css;
            });
        }
    }

    pendingStyles.clear();
}

/**
 * Removes injected styles for an island (useful for cleanup/HMR).
 */
export function removeIslandStyle(islandName: string): void {
    if (typeof document === 'undefined') return;

    injectedStyles.delete(islandName);
    pendingStyles.delete(islandName);

    if (isAdoptedStyleSheetsSupported()) {
        const sheet = adoptedSheetMap.get(islandName);
        if (sheet) {
            document.adoptedStyleSheets = document.adoptedStyleSheets.filter(s => s !== sheet);
            adoptedSheetMap.delete(islandName);
        }
    }

    const existing = document.querySelector(`style[data-island-style="${islandName}"]`);
    if (existing) {
        existing.remove();
    }
}

/**
 * Clears all injected island styles.
 */
export function clearAllIslandStyles(): void {
    if (typeof document === 'undefined') return;

    injectedStyles.clear();
    pendingStyles.clear();

    if (isAdoptedStyleSheetsSupported()) {
        document.adoptedStyleSheets = [];
        adoptedSheetMap.clear();
    }

    document.querySelectorAll('style[data-island-style]').forEach(el => el.remove());
}
