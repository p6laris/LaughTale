/**
 * SoftMax.LaughTale: Declarative Directives Subsystem (Zero-JS Architecture)
 */

import { createReactiveScope, bindElementReactivity } from './reactivity';
import { bindElementEvents } from './events';
import { bindServerAction } from './htmx';
import { bindInputMask } from './masking';
import { bindUtilityDirectives } from './utils';

export function initDirectives(root: ParentNode = document): void {
    // 1. Initialize Reactive Scopes: [l-state]
    const stateElements = root.querySelectorAll<HTMLElement>('[l-state]');
    stateElements.forEach((el) => {
        const rawJson = el.getAttribute('l-state');
        try {
            const initialData = rawJson ? JSON.parse(rawJson) : {};
            createReactiveScope(el, initialData);
        } catch (err) {
            console.error('[SoftMax.LaughTale] Invalid JSON in l-state:', rawJson, err);
        }
    });

    // 2. Scan and Bind all children within scopes or root
    const allElements = root.querySelectorAll<HTMLElement>('*');
    allElements.forEach((el) => {
        // A. Reactivity bindings (l-bind, l-model, l-class, l-style)
        for (const attr of Array.from(el.attributes)) {
            if (attr.name === 'l-bind' || attr.name.startsWith('l-bind:') || attr.name === 'l-model' || attr.name === 'l-class' || attr.name === 'l-style') {
                const scope = (el as any).__laughtale_scope || (el.closest('[l-state]') as any);
                // Reactivity will auto-resolve the nearest scope
                import('./reactivity').then(({ getNearestScope }) => {
                    const nearest = getNearestScope(el);
                    if (nearest) bindElementReactivity(el, nearest);
                });
                break;
            }
        }

        // B. Event handlers (l-on:*, l-listen:*, l-emit)
        bindElementEvents(el);

        // C. Server fragment actions (l-get, l-post, l-put, l-delete)
        if (el.hasAttribute('l-get') || el.hasAttribute('l-post') || el.hasAttribute('l-put') || el.hasAttribute('l-delete')) {
            bindServerAction(el);
        }

        // D. Pattern Input Masking (l-mask)
        if (el.hasAttribute('l-mask') && el.tagName === 'INPUT') {
            bindInputMask(el as HTMLInputElement);
        }

        // E. Utilities (l-show, l-hide, l-copy, l-toggle)
        bindUtilityDirectives(el);
    });
}

// Auto-run on DOM ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initDirectives());
    } else {
        initDirectives();
    }
}
