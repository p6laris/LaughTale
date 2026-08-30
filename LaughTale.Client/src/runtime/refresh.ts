/**
 * LaughTale: Server-Driven Island Refresh with DOM Morphing (P12 / LT-22xx)
 * Re-renders an individual island on demand from the server, morphs the DOM in-place,
 * preserving input focus, active text selections, and scroll positions without full page reloads.
 */

import { rehydrateIsland } from './hydrator';
import type { IslandContext } from './registry';

export interface RefreshOptions {
    endpoint?: string;
    signal?: AbortSignal;
}

/**
 * Refreshes an island container with updated server-rendered state and props.
 * @param container The root island DOM element to refresh.
 * @param newProps Optional updated props to send to the server endpoint.
 * @param options Refresh options including custom endpoint or abort signal.
 */
export async function refreshIsland(
    container: HTMLElement, 
    newProps?: Record<string, any>,
    options: RefreshOptions = {}
): Promise<void> {
    const name = container.getAttribute('data-island');
    if (!name) {
        console.warn('[LaughTale] Cannot refresh element without data-island attribute.');
        return;
    }

    const endpoint = options.endpoint || `/_laughtale/island/${encodeURIComponent(name)}`;
    
    // Antiforgery token resolution
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'LaughTale-IslandRefresh'
    };

    const csrfInput = document.querySelector<HTMLInputElement>('input[name="__RequestVerificationToken"]');
    const csrfMeta = document.querySelector<HTMLMetaElement>('meta[name="request-verification-token"], meta[name="csrf-token"]');
    const token = csrfInput?.value || csrfMeta?.content;
    if (token) {
        headers['RequestVerificationToken'] = token;
        headers['X-CSRF-TOKEN'] = token;
    }

    // Save active focus state
    const activeEl = document.activeElement as HTMLElement | null;
    const isFocusInside = activeEl && container.contains(activeEl);
    const focusedSelector = isFocusInside ? getElementSelector(activeEl, container) : null;
    const selectionStart = (activeEl as HTMLInputElement)?.selectionStart;
    const selectionEnd = (activeEl as HTMLInputElement)?.selectionEnd;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(newProps || {}),
            signal: options.signal
        });

        if (!response.ok) {
            throw new Error(`Failed to refresh island '${name}': HTTP ${response.status}`);
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const incomingRoot = doc.querySelector<HTMLElement>(`[data-island="${name}"]`) || doc.body.firstElementChild as HTMLElement;

        if (incomingRoot) {
            // Update props attribute
            const updatedProps = incomingRoot.getAttribute('data-props');
            if (updatedProps) {
                container.setAttribute('data-props', updatedProps);
            }

            // Morph inner contents while preserving focusable elements
            morphElement(container, incomingRoot);

            // Re-hydrate island with new props
            await rehydrateIsland(container);

            // Restore focus and cursor positions
            if (focusedSelector) {
                const restoredEl = container.querySelector<HTMLElement>(focusedSelector);
                if (restoredEl && typeof restoredEl.focus === 'function') {
                    restoredEl.focus();
                    if (selectionStart !== null && selectionStart !== undefined && typeof (restoredEl as HTMLInputElement).setSelectionRange === 'function') {
                        try {
                            (restoredEl as HTMLInputElement).setSelectionRange(selectionStart, selectionEnd ?? selectionStart);
                        } catch {
                            // ignore selection range errors on unsupported input types
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error(`[LaughTale] Error refreshing island '${name}':`, err);
        throw err;
    }
}

/**
 * Lightweight DOM morphing utility keeping identical nodes and only updating changed attributes/content.
 */
function morphElement(existing: HTMLElement, incoming: HTMLElement): void {
    // 1. Synchronize attributes
    const existingAttrs = Array.from(existing.attributes);
    const incomingAttrs = Array.from(incoming.attributes);

    for (const attr of incomingAttrs) {
        if (existing.getAttribute(attr.name) !== attr.value) {
            existing.setAttribute(attr.name, attr.value);
        }
    }

    for (const attr of existingAttrs) {
        if (!incoming.hasAttribute(attr.name) && attr.name !== 'style') {
            existing.removeAttribute(attr.name);
        }
    }

    // 2. Morph children if incoming has structural contents
    if (incoming.children.length > 0) {
        existing.innerHTML = incoming.innerHTML;
    }
}

/**
 * Generates a relative CSS selector for an element within a container to restore focus.
 */
function getElementSelector(el: HTMLElement, root: HTMLElement): string {
    if (el === root) return '';
    if (el.id) return `#${el.id}`;
    if (el.getAttribute('name')) return `[name="${el.getAttribute('name')}"]`;
    if (el.getAttribute('data-part')) return `[data-part="${el.getAttribute('data-part')}"]`;

    const path: string[] = [];
    let curr: HTMLElement | null = el;

    while (curr && curr !== root) {
        let tag = curr.tagName.toLowerCase();
        if (curr.className) {
            tag += `.${curr.className.trim().split(/\s+/).join('.')}`;
        }
        path.unshift(tag);
        curr = curr.parentElement;
    }

    return path.join(' > ');
}
