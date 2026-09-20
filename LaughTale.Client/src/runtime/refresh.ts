/**
 * LaughTale: Server-Driven Island Refresh with DOM Morphing (P12 / )
 * Re-renders an individual island on demand from the server, morphs the DOM in-place,
 * preserving input focus, active text selections, and scroll positions without full page reloads.
 */

import { rehydrateIsland } from './hydrator';
import { getIslandUpdateFn } from './island-instances';
import { parseAndReviveProps } from './reviver';
import { emitComponentEvent } from './events';
import type { IslandContext } from './registry';

export interface RefreshOptions {
    endpoint?: string;
    signal?: AbortSignal;
}

/**
 * Thrown by refreshIsland() when the server rejects the refresh with a non-2xx status, carrying
 * the HTTP status code so callers (and the `laughtale:island:refresh-error` listener below) can
 * distinguish "not authorized/session expired" (401/403) from any other refresh failure.
 */
export class IslandRefreshError extends Error {
    constructor(public readonly status: number, public readonly islandName: string) {
        super(`Failed to refresh island '${islandName}': HTTP ${status}`);
        this.name = 'IslandRefreshError';
    }
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
            if (response.status === 401 || response.status === 403) {
                // Distinguishable from any other refresh failure so app code can react (e.g. redirect
                // to login, show a "session expired" toast) instead of treating it as a generic error.
                emitComponentEvent(container, 'island', 'refresh-unauthorized', { name, status: response.status });
            }
            throw new IslandRefreshError(response.status, name);
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const incomingRoot = doc.querySelector<HTMLElement>(`[data-island="${name}"]`) || doc.body.firstElementChild as HTMLElement;

        if (incomingRoot) {
            // Prefer the adapter's own in-place update(props), when the mounted framework
            // instance registered one (see island-instances.ts). This avoids the morph+remount
            // path entirely: morphElement's innerHTML replacement below rips out DOM nodes a
            // React/Vue/Preact instance still holds fiber/vnode/component references to, and
            // the old instance's unmount() then runs against already-mutated DOM (silently, since
            // every adapter swallows unmount errors on disposed DOM). Calling update() instead
            // lets the framework's own reconciler diff against the DOM it actually owns.
            let updatedInPlace = false;
            const updateFn = getIslandUpdateFn(container);

            if (updateFn) {
                try {
                    // Parse props directly off the incoming (not-yet-applied) element - do NOT
                    // write data-props into the live container first and re-read it back.
                    const rawIncomingProps = incomingRoot.getAttribute('data-props')
                        || incomingRoot.getAttribute('props-json')
                        || incomingRoot.getAttribute('props');
                    const parsedProps = parseAndReviveProps(rawIncomingProps);

                    // Still keep the container's own attributes (data-props, data-hydrate, etc.)
                    // consistent with server truth, even though the framework owns its children now.
                    syncContainerAttributes(container, incomingRoot);

                    await updateFn(parsedProps);
                    updatedInPlace = true;
                } catch (err) {
                    console.error(`[LaughTale] Error calling adapter update() for island '${name}'. Falling back to morph+remount for this refresh:`, err);
                }
            }

            if (!updatedInPlace) {
                // Update props attribute
                const updatedProps = incomingRoot.getAttribute('data-props');
                if (updatedProps) {
                    container.setAttribute('data-props', updatedProps);
                }

                // Morph inner contents while preserving focusable elements
                morphElement(container, incomingRoot);

                // Re-hydrate island with new props
                await rehydrateIsland(container);
            }

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
 * Synchronizes an element's own attributes (data-props, data-hydrate, etc.) to match another,
 * removing attributes no longer present (preserving `style`, which may be runtime-managed).
 * Shared by the adapter-update path above and morphElement's legacy fallback below, so a
 * container's attributes stay consistent with server truth regardless of which path handled
 * the refresh.
 */
function syncContainerAttributes(existing: HTMLElement, incoming: HTMLElement): void {
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
}

/**
 * Lightweight DOM morphing utility keeping identical nodes and only updating changed attributes/content.
 */
function morphElement(existing: HTMLElement, incoming: HTMLElement): void {
    // 1. Synchronize attributes
    syncContainerAttributes(existing, incoming);

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
