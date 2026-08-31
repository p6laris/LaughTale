/**
 * LaughTale: Island Error Boundary & Dev-Mode Overlay Engine
 * Provides resilient server-rendered fallback slot activation and dev-mode diagnostic overlays with live retry.
 */

import { retryIsland } from './hydrator';

/**
 * Checks if the current environment is development mode.
 */
export function isDevMode(): boolean {
    if (typeof window === 'undefined') return false;
    return (
        (window as any).__LAUGHTALE_DEV__ === true ||
        window.location?.hostname === 'localhost' ||
        window.location?.hostname === '127.0.0.1'
    );
}

/**
 * Activates fallback content and renders dev diagnostic overlay if hydration fails.
 */
export function renderErrorBoundary(container: HTMLElement, name: string, error: Error): void {
    // 1. Activate server-rendered fallback if available
    const fallbackTemplate = container.querySelector('template[data-slot="fallback"]') as HTMLTemplateElement | null;
    const fallbackSlot = container.querySelector('[data-slot="fallback"]');
    const fallbackAttr = container.getAttribute('data-fallback');

    if (fallbackTemplate) {
        container.innerHTML = fallbackTemplate.innerHTML;
    } else if (fallbackSlot && fallbackSlot.tagName !== 'TEMPLATE') {
        container.innerHTML = fallbackSlot.innerHTML;
    } else if (fallbackAttr) {
        container.innerHTML = `<div class="island-fallback-content">${fallbackAttr}</div>`;
    }

    // 2. In Dev Mode, attach interactive diagnostic overlay
    if (isDevMode()) {
        const existingOverlay = container.querySelector('.laughtale-dev-error-overlay');
        if (existingOverlay) existingOverlay.remove();

        const overlay = document.createElement('div');
        overlay.className = 'laughtale-dev-error-overlay';
        overlay.style.cssText = `
            border: 2px solid #ef4444;
            background: #fef2f2;
            color: #991b1b;
            padding: 12px 16px;
            border-radius: 8px;
            font-family: ui-monospace, monospace;
            font-size: 12px;
            margin: 8px 0;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        `;

        const title = document.createElement('div');
        title.style.cssText = 'font-weight: 700; font-size: 13px; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between;';
        title.innerHTML = `<span>⚠️ [LaughTale] Hydration Error: &lt;${name}&gt;</span>`;

        const retryBtn = document.createElement('button');
        retryBtn.textContent = '🔄 Retry Hydration';
        retryBtn.style.cssText = 'background: #dc2626; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600;';
        retryBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            overlay.remove();
            retryIsland(container);
        });
        title.appendChild(retryBtn);

        const msg = document.createElement('div');
        msg.style.cssText = 'color: #b91c1c; margin-bottom: 4px; font-weight: 600;';
        msg.textContent = error.message || String(error);

        const details = document.createElement('details');
        details.style.cssText = 'margin-top: 6px; cursor: pointer;';
        const summary = document.createElement('summary');
        summary.textContent = 'Show stack trace';
        summary.style.color = '#7f1d1d';
        const pre = document.createElement('pre');
        pre.style.cssText = 'margin-top: 4px; white-space: pre-wrap; font-size: 11px; color: #450a0a; overflow-x: auto; max-height: 150px;';
        pre.textContent = error.stack || 'No stack trace available';

        details.appendChild(summary);
        details.appendChild(pre);

        overlay.appendChild(title);
        overlay.appendChild(msg);
        overlay.appendChild(details);

        container.appendChild(overlay);
    }
}
