/**
 * SoftMax.LaughTale: Server Fragment Action Engine (HTMX Style)
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

        try {
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

                // Re-initialize directives and islands inside new HTML nodes
                initDirectives(target);
                initIslands(target);
            }
        } catch (err) {
            console.error('[SoftMax.LaughTale] Server fragment request failed:', err);
        } finally {
            if (indicator) indicator.style.display = 'none';
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
