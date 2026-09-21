/**
 * LaughTale: Server Fragment Action Engine (HTMX Style)
 * Intercepts user triggers, requests partial Razor HTML from C# server endpoints,
 * and morphs/swaps the response into the DOM without full page reloads.
 */

import { initDirectives } from './index';
import { initIslands } from '../runtime/hydrator';

export function bindServerAction(element: HTMLElement): void {
    let method = 'GET';
    let url = '';

    if (element.hasAttribute('l-get')) { method = 'GET'; url = element.getAttribute('l-get')!; }
    else if (element.hasAttribute('l-post')) { method = 'POST'; url = element.getAttribute('l-post')!; }
    else if (element.hasAttribute('l-put')) { method = 'PUT'; url = element.getAttribute('l-put')!; }
    else if (element.hasAttribute('l-delete')) { method = 'DELETE'; url = element.getAttribute('l-delete')!; }
    else return;

    const targetSelector = element.getAttribute('l-target');
    const swapMode = element.getAttribute('l-swap') || 'innerHTML';
    const indicatorSelector = element.getAttribute('l-indicator');
    const confirmMessage = element.getAttribute('l-confirm');
    const rawTrigger = element.getAttribute('l-trigger') || (element.tagName === 'FORM' ? 'submit' : element.tagName === 'INPUT' ? 'input' : 'click');

    let delayMs = 0;
    const parts = rawTrigger.split(' ');
    const eventName = parts[0];

    for (const part of parts) {
        if (part.startsWith('delay:')) {
            delayMs = parseInt(part.slice(6), 10) || 0;
        }
    }

    let timeoutId: any = null;

    const executeRequest = async (e?: Event) => {
        if (e) e.preventDefault();

        if (confirmMessage && !window.confirm(confirmMessage)) {
            return;
        }

        const indicator = indicatorSelector ? document.querySelector<HTMLElement>(indicatorSelector) : null;
        if (indicator) indicator.style.display = 'block';

        // ROADMAP.v5.md Part F (Server actions - submit state): disable the form's submit controls
        // for the duration of the request, so a slow handler can't be double-submitted by an
        // impatient click/Enter. Captures each control's PRE-EXISTING disabled state (not just
        // `false`) so a control the author already disabled for other reasons doesn't get
        // incorrectly re-enabled when this request finishes.
        const submitScope = element.closest('form') ?? (element as HTMLElement);
        const submitControls = Array.from(
            submitScope.querySelectorAll<HTMLButtonElement | HTMLInputElement>(
                'button[type="submit"], input[type="submit"], button:not([type])'
            )
        );
        const priorDisabled = submitControls.map((c) => c.disabled);
        submitControls.forEach((c) => { c.disabled = true; });

        try {
            // ROADMAP.v5.md Part G/L (Server Actions): marks the form (and the triggering element
            // itself, for non-form triggers) as mid-submission so CSS/other directives can react
            // (spinners, dimming, etc). Cleared in the existing finally block below.
            element.closest('form')?.setAttribute('data-lt-submitting', 'true');
            element.setAttribute('data-lt-submitting', 'true');

            let requestUrl = url;
            let body: any = null;
            const headers: Record<string, string> = {
                'X-LaughTale-Request': 'true'
            };

            if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
                const input = element as HTMLInputElement;
                const paramName = input.name || 'query';
                const separator = requestUrl.includes('?') ? '&' : '?';
                requestUrl = `${requestUrl}${separator}${encodeURIComponent(paramName)}=${encodeURIComponent(input.value)}`;
            } else if (element.tagName === 'FORM') {
                const formData = new FormData(element as HTMLFormElement);
                if (method === 'GET') {
                    const searchParams = new URLSearchParams(formData as any).toString();
                    requestUrl = `${requestUrl}${requestUrl.includes('?') ? '&' : '?'}${searchParams}`;
                } else {
                    body = formData;
                }
            }

            const response = await fetch(requestUrl, { method, body, headers });
            const html = await response.text();

            const target = targetSelector ? document.querySelector<HTMLElement>(targetSelector) : element;
            if (target) {
                switch (swapMode) {
                    case 'outerHTML':
                        target.outerHTML = html;
                        break;
                    case 'beforeend':
                        target.insertAdjacentHTML('beforeend', html);
                        break;
                    case 'afterbegin':
                        target.insertAdjacentHTML('afterbegin', html);
                        break;
                    case 'beforebegin':
                        target.insertAdjacentHTML('beforebegin', html);
                        break;
                    case 'afterend':
                        target.insertAdjacentHTML('afterend', html);
                        break;
                    case 'none':
                        break;
                    case 'innerHTML':
                    default:
                        target.innerHTML = html;
                        break;
                }

                // Re-initialize directives and islands inside the new HTML nodes.
                //
                // BUG THIS FIXES (found via a real live-browser test of a real <island-form> -
                // Server Actions, ROADMAP.v5.md Part G/L): `target.outerHTML = html` REPLACES
                // `target` in the DOM with brand-new nodes, but the `target` JS variable keeps
                // pointing at the OLD, now-detached node - a well-known DOM gotcha; an outerHTML
                // assignment never repoints the reference that set it. The old code called
                // `initDirectives(target)` unconditionally, which for 'outerHTML' scanned the
                // orphaned old subtree - a provably useless no-op - while the actual new
                // form/button living in the document never got `bindServerAction()`
                // (re-)attached. Confirmed the hard way: a second submit silently fell through to
                // an uncaptured native browser form POST (no `?handler=` query string, no
                // antiforgery interception at all).
                //
                // Fix: for 'outerHTML' (target itself was replaced), re-resolve the LIVE
                // replacement via the same `targetSelector` used to find `target` in the first
                // place - the swapped-in markup is expected to preserve the same id/selector
                // (true for every real caller in this codebase today: IslandFormTagHelper always
                // sets `l-target="#id"` and the server always re-renders that same id). Falls
                // back to the stale `target` reference (matching the pre-existing, still-broken
                // behavior) only for the rarer self-targeting case with no explicit `l-target`,
                // since there is no selector to re-resolve against there - fixing that edge case
                // is a separate, pre-existing gap, not something this fix attempts.
                //
                // For 'beforebegin'/'afterend' (new content inserted as a SIBLING of `target`,
                // not a descendant), `target` itself is unaffected but does not scope the
                // newly-inserted content either - re-init from its parent instead so the new
                // sibling actually gets bound. Same class of bug, fixed the same way for
                // consistency (no real caller has hit this specific combination yet).
                //
                // For 'innerHTML'/'beforeend'/'afterbegin', `target` remains live and now
                // contains the new content as a descendant - the original `initDirectives(target)`
                // call was already correct for these modes and is unchanged.
                let reinitScope: ParentNode = target;
                if (swapMode === 'outerHTML') {
                    reinitScope = (targetSelector ? document.querySelector<HTMLElement>(targetSelector) : null) ?? target;
                } else if (swapMode === 'beforebegin' || swapMode === 'afterend') {
                    reinitScope = target.parentNode ?? target;
                }
                initDirectives(reinitScope);
                initIslands(reinitScope);
            }
        } catch (err) {
            console.error('[LaughTale] Server fragment request failed:', err);
        } finally {
            if (indicator) indicator.style.display = 'none';
            element.closest('form')?.removeAttribute('data-lt-submitting');
            element.removeAttribute('data-lt-submitting');
            submitControls.forEach((c, i) => { c.disabled = priorDisabled[i]; });
        }
    };

    element.addEventListener(eventName, (e) => {
        if (delayMs > 0) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => executeRequest(e), delayMs);
        } else {
            executeRequest(e);
        }
    });
}
