/**
 * SoftMax.LaughTale: View Transitions & Persistent Islands Router
 * 
 * Intercepts link navigation, performs animated page morphing via View Transitions API,
 * and preserves persistent island state ([data-persist]) across page navigations.
 */

import { initIslands } from './hydrator';

let isRouterActive = false;

/**
 * Initializes the View Transitions router across the application.
 */
export function enableViewTransitions(): void {
    if (isRouterActive || typeof window === 'undefined') return;
    isRouterActive = true;

    document.addEventListener('click', handleLinkClick);
    window.addEventListener('popstate', handlePopState);
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
    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) {
        return; // Normal anchor jump
    }

    e.preventDefault();
    await navigateTo(url.href, true);
}

async function handlePopState() {
    await navigateTo(window.location.href, false);
}

/**
 * Performs a View Transition navigation to a target URL.
 */
export async function navigateTo(urlStr: string, pushState = true): Promise<void> {
    try {
        const response = await fetch(urlStr, {
            headers: {
                'X-Requested-With': 'SoftMaxIslands-ViewTransition'
            }
        });

        if (!response.ok) {
            window.location.href = urlStr;
            return;
        }

        const htmlText = await response.text();
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(htmlText, 'text/html');

        // Extract persistent elements before updating DOM
        const persistentElements = new Map<string, HTMLElement>();
        document.querySelectorAll<HTMLElement>('[data-persist]').forEach(el => {
            const id = el.dataset.persist;
            if (id) persistentElements.set(id, el);
        });

        // Use native View Transition API if supported
        const updateDom = () => {
            // Update document title
            document.title = newDoc.title;

            // Replace body content
            document.body.innerHTML = newDoc.body.innerHTML;

            // Restore persistent islands into their new matching slots
            persistentElements.forEach((liveEl, id) => {
                const targetSlot = document.querySelector<HTMLElement>(`[data-persist="${id}"]`);
                if (targetSlot && targetSlot.parentNode) {
                    targetSlot.parentNode.replaceChild(liveEl, targetSlot);
                }
            });

            // Hydrate any new islands on the newly rendered page
            initIslands(document.body);

            if (pushState) {
                window.history.pushState({}, '', urlStr);
            }

            // Dispatch navigation event
            window.dispatchEvent(new CustomEvent('island:page-loaded', { detail: { url: urlStr } }));
        };

        if ('startViewTransition' in document) {
            (document as any).startViewTransition(updateDom);
        } else {
            updateDom();
        }

    } catch (err) {
        console.error('[SoftMax.LaughTale] View transition failed, falling back to full navigation:', err);
        window.location.href = urlStr;
    }
}
