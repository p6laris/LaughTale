/**
 * LaughTale: View Transitions & Persistent Islands Router (Hardened Edition)
 * 
 * Intercepts link navigation, aborts in-flight navigations upon new clicks, verifies same-origin
 * on redirects, dispatches laughtale:unmount on destroyed islands, reconciles <head> metadata & stylesheets,
 * synchronizes image decoding, manages scroll restoration, performs animated page morphing via View Transitions API,
 * preserves persistent island state ([data-persist]), and executes scripts with CSP nonces.
 */

import { initIslands } from './hydrator';
import { initDirectives } from '../directives/index';
import { applyNonceToScript } from '../directives/csp';
import { prefetchManager } from '../router/prefetch';
import { isReducedMotionPreferred } from '../styles/animations';
import { announce } from '../accessibility/announcer';

let isRouterActive = false;
let inFlightController: AbortController | null = null;

/**
 * Initializes the View Transitions router across the application.
 */
export function enableViewTransitions(): void {
    if (isRouterActive || typeof window === 'undefined') return;
    isRouterActive = true;

    // Enable manual scroll restoration to prevent native scroll jumping during view transitions
    if ('history' in window && 'scrollRestoration' in window.history) {
        try {
            window.history.scrollRestoration = 'manual';
        } catch {
            // ignore
        }
    }

    document.addEventListener('click', handleLinkClick);
    window.addEventListener('popstate', handlePopState);
    prefetchManager.observeViewportLinks(document);

    // Attach intent-based prefetching for hover and touch
    document.addEventListener('mouseover', (e) => {
        const anchor = (e.target as HTMLElement)?.closest?.('a');
        if (anchor && anchor.href) {
            prefetchManager.attachHoverListener(anchor);
        }
    }, { passive: true });
}

async function handleLinkClick(e: MouseEvent) {
    // Ignore non-left click, modifier keys, or canceled events
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.defaultPrevented) {
        return;
    }

    const anchor = (e.target as HTMLElement).closest('a');
    if (!anchor || !anchor.href) return;

    // Check if same-origin link and not excluded
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (anchor.target && anchor.target !== '_self') return;
    if (anchor.hasAttribute('download') || anchor.getAttribute('data-no-transition') !== null) return;
    const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, '');
    const targetPath = url.pathname.toLowerCase().replace(/\/$/, '');
    if ((currentPath === targetPath || !targetPath) && url.hash) {
        return; // Normal anchor jump / local hash navigation
    }

    e.preventDefault();
    await navigateTo(url.href, true);
}

async function handlePopState(e: PopStateEvent) {
    const state = e.state || {};
    const restoreScroll = (typeof state.scrollY === 'number') ? {
        scrollX: state.scrollX || 0,
        scrollY: state.scrollY
    } : undefined;

    await navigateTo(window.location.href, false, restoreScroll);
}

/**
 * Diffs and reconciles the document head with elements from the newly fetched document.
 * Preserves security tokens (<meta name="csp-nonce">), viewport, and charset while
 * updating dynamic page metadata and route stylesheets.
 */
export async function reconcileHead(newHead: HTMLHeadElement): Promise<void> {
    if (!document.head || !newHead) return;

    // Helper: compute a key for head elements to diff them accurately
    const getHeadKey = (el: Element): string | null => {
        const tagName = el.tagName.toLowerCase();
        if (tagName === 'title') return 'title';
        if (tagName === 'meta') {
            const name = el.getAttribute('name');
            if (name) {
                // Protected global meta tokens
                if (name === 'viewport' || name === 'csp-nonce') return null;
                return `meta:name:${name.toLowerCase()}`;
            }
            const prop = el.getAttribute('property');
            if (prop) return `meta:property:${prop.toLowerCase()}`;
            const httpEquiv = el.getAttribute('http-equiv');
            if (httpEquiv) return `meta:http-equiv:${httpEquiv.toLowerCase()}`;
            if (el.hasAttribute('charset')) return null; // Protected charset
            return `meta:raw:${el.outerHTML}`;
        }
        if (tagName === 'link') {
            const rel = (el.getAttribute('rel') || '').toLowerCase();
            const href = el.getAttribute('href') || '';
            if (rel === 'stylesheet') return `link:stylesheet:${href}`;
            if (rel === 'canonical') return `link:canonical`;
            if (rel === 'icon' || rel === 'shortcut icon') return `link:icon`;
            return `link:${rel}:${href}`;
        }
        return null;
    };

    // 1. Index existing dynamic head elements
    const existingDynamicElements = new Map<string, Element>();
    Array.from(document.head.children).forEach(child => {
        // Do not touch dynamic island injected styles
        if (child.hasAttribute('data-island-style')) return;
        const key = getHeadKey(child);
        if (key) {
            existingDynamicElements.set(key, child);
        }
    });

    // 2. Process incoming head elements
    const newKeys = new Set<string>();
    const pendingStylesheets: Promise<void>[] = [];

    Array.from(newHead.children).forEach(incomingEl => {
        const key = getHeadKey(incomingEl);
        if (!key) return; // Static / ignored tag
        newKeys.add(key);

        const existing = existingDynamicElements.get(key);
        if (existing) {
            // If identical, keep it
            if (existing.outerHTML === incomingEl.outerHTML) {
                return;
            }
            // Replace if modified
            const clone = incomingEl.cloneNode(true) as HTMLElement;
            existing.replaceWith(clone);
        } else {
            // New head element
            const clone = incomingEl.cloneNode(true) as HTMLElement;
            if (clone.tagName.toLowerCase() === 'link' && clone.getAttribute('rel')?.toLowerCase() === 'stylesheet') {
                const sheetPromise = new Promise<void>(resolve => {
                    const timeout = setTimeout(resolve, 500); // 500ms safety fallback
                    clone.onload = () => { clearTimeout(timeout); resolve(); };
                    clone.onerror = () => { clearTimeout(timeout); resolve(); };
                });
                pendingStylesheets.push(sheetPromise);
            }
            document.head.appendChild(clone);
        }
    });

    // 3. Remove obsolete head elements
    existingDynamicElements.forEach((existingEl, key) => {
        if (!newKeys.has(key)) {
            existingEl.remove();
        }
    });

    // 4. Await all pending stylesheets to prevent FOUC
    if (pendingStylesheets.length > 0) {
        await Promise.all(pendingStylesheets);
    }
}

/**
 * Performs a hardened, race-condition-free View Transition navigation to a target URL.
 */
export async function navigateTo(
    urlStr: string,
    pushState = true,
    restoreScroll?: { scrollX?: number; scrollY?: number }
): Promise<void> {
    // 1. In-Flight Navigation Cancellation
    // Abort previous in-flight request if user rapidly clicked a new link
    if (inFlightController) {
        inFlightController.abort();
    }
    inFlightController = new AbortController();
    const signal = inFlightController.signal;

    // Save scroll coordinates of current page before departure
    if (pushState && typeof window !== 'undefined' && 'history' in window) {
        try {
            window.history.replaceState({
                ...window.history.state,
                scrollX: window.scrollX || 0,
                scrollY: window.scrollY || 0
            }, '', window.location.href);
        } catch {
            // ignore
        }
    }

    try {
        let finalUrl = new URL(urlStr, window.location.href);
        let htmlText = prefetchManager.getCachedResponse(urlStr);

        if (!htmlText) {
            const response = await fetch(urlStr, {
                signal,
                headers: {
                    'X-Requested-With': 'SoftMaxIslands-ViewTransition'
                }
            });

            if (!response.ok) {
                window.location.href = urlStr;
                return;
            }

            // 2. Cross-Origin Redirect Verification
            // If an open redirect navigated cross-origin, fall back to native browser navigation
            if (response.url) {
                finalUrl = new URL(response.url, window.location.href);
            }
            if (finalUrl.origin !== window.location.origin) {
                console.warn(`[LaughTale Router] Blocked cross-origin HTML injection from "${finalUrl.href}". Falling back to hard navigation.`);
                window.location.href = finalUrl.href;
                return;
            }

            htmlText = await response.text();
            prefetchManager.setCachedResponse(urlStr, htmlText);
        }

        const parser = new DOMParser();
        const newDoc = parser.parseFromString(htmlText, 'text/html');

        // 3. Dispatch unmount lifecycle event to active unpersisted islands
        document.querySelectorAll<HTMLElement>('[data-island]').forEach(el => {
            if (!el.closest('[data-persist]')) {
                el.dispatchEvent(new CustomEvent('laughtale:unmount', { bubbles: false }));
            }
        });

        // 4. Extract persistent elements before updating DOM
        const persistentElements = new Map<string, HTMLElement>();
        document.querySelectorAll<HTMLElement>('[data-persist]').forEach(el => {
            const id = el.dataset.persist;
            if (id) persistentElements.set(id, el);
        });

        // 5. Extract executable scripts from incoming document body
        const newScripts = Array.from(newDoc.body.querySelectorAll('script'));
        newScripts.forEach(s => s.remove());

        // Use native View Transition API if supported
        const updateDom = async () => {
            // Update document title
            document.title = newDoc.title;

            // Reconcile <head> (meta tags, OpenGraph, canonical links, route stylesheets)
            if (newDoc.head) {
                await reconcileHead(newDoc.head);
            }

            // Await critical image decodes with 500ms safety timeout to eliminate visual stutter
            const images = Array.from(newDoc.body.querySelectorAll('img[src]'));
            const imagePromises = images.map(img => {
                if ('decode' in img && typeof (img as any).decode === 'function') {
                    return (img as HTMLImageElement).decode().catch(() => {});
                }
                return Promise.resolve();
            });
            if (imagePromises.length > 0) {
                await Promise.race([Promise.all(imagePromises), new Promise(r => setTimeout(r, 500))]);
            }

            // Replace body content
            document.body.innerHTML = newDoc.body.innerHTML;

            // Restore persistent islands into their new matching slots
            persistentElements.forEach((liveEl, id) => {
                const targetSlot = document.querySelector<HTMLElement>(`[data-persist="${id}"]`);
                if (targetSlot && targetSlot.parentNode) {
                    targetSlot.parentNode.replaceChild(liveEl, targetSlot);
                }
            });

            // Re-execute scripts with CSP nonce stamping
            newScripts.forEach(script => {
                if (script.type && script.type !== 'text/javascript' && script.type !== 'module' && script.type !== 'application/javascript') {
                    return; // Skip JSON or template scripts
                }
                const newScript = document.createElement('script');
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                newScript.textContent = script.textContent;
                applyNonceToScript(newScript);
                document.body.appendChild(newScript);
            });

            // Hydrate any new islands & directives on the newly rendered page
            initIslands(document.body);
            initDirectives(document.body);

            // Handle scroll restoration or hash anchor
            if (restoreScroll && typeof restoreScroll.scrollY === 'number') {
                window.scrollTo({ left: restoreScroll.scrollX || 0, top: restoreScroll.scrollY, behavior: 'instant' as any });
            } else {
                const targetUrl = new URL(urlStr, window.location.origin);
                if (targetUrl.hash) {
                    const targetEl = document.querySelector(targetUrl.hash);
                    if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
                }
            }

            if (pushState) {
                window.history.pushState({ scrollX: 0, scrollY: 0 }, '', finalUrl.href);
            }

            // Dispatch navigation event
            window.dispatchEvent(new CustomEvent('island:page-loaded', { detail: { url: finalUrl.href } }));

            // Accessible Focus Management & Page Announcement (LT-803)
            const focusTarget = document.querySelector<HTMLElement>('[data-skip-target]') ||
                document.querySelector<HTMLElement>('h1') ||
                document.querySelector<HTMLElement>('[autofocus]') ||
                document.querySelector<HTMLElement>('main');
            if (focusTarget) {
                if (!focusTarget.hasAttribute('tabindex')) {
                    focusTarget.setAttribute('tabindex', '-1');
                }
                focusTarget.focus({ preventScroll: true });
            }

            const titleAnnouncement = document.title ? `${document.title} loaded` : 'Page loaded';
            announce(titleAnnouncement, 'polite');
        };

        if ('startViewTransition' in document && !isReducedMotionPreferred()) {
            await (document as any).startViewTransition(updateDom);
        } else {
            await updateDom();
        }

    } catch (err: any) {
        if (err?.name === 'AbortError' || signal.aborted) {
            // Navigation was superseded by a newer navigation; exit silently
            return;
        }
        console.error('[LaughTale] View transition failed, falling back to full navigation:', err);
        window.location.href = urlStr;
    } finally {
        if (inFlightController?.signal === signal) {
            inFlightController = null;
        }
    }
}
