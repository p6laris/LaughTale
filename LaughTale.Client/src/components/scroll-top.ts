import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise ScrollTop Component (Aura ScrollTop inspired)
 */

import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'native',
    element: 'button'
};

export interface ScrollTopProps {
    threshold?: number; // scroll threshold in px, default 200
    behavior?: 'smooth' | 'auto';
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}


const CSS = `
.laughtale-scroll-top-btn {
    background: var(--p-primary-500) !important;
    color: var(--p-surface-0) !important;
}
.laughtale-scroll-top-btn:hover {
    background: var(--p-primary-400) !important;
}

html.dark .laughtale-scroll-top-btn,
[data-theme="dark"] .laughtale-scroll-top-btn,
.dark .laughtale-scroll-top-btn {
    background: var(--p-primary-500) !important;
    color: var(--p-surface-0) !important;
}
`;

export default function ScrollTopIsland(container: HTMLElement, props: ScrollTopProps, ctx?: IslandContext) {
    injectIslandStyle('scroll-top', CSS);
    const threshold = props.threshold || 200;
    let isVisible = false;

    function render() {
        setHtml(container, html`
            <button type="button" 
                    class="laughtale-scroll-top-btn" data-part="root" 
                    style="display: ${isVisible ? 'flex' : 'none'}; position: fixed; bottom: 2rem; right: 2rem; z-index: 999; width: 2.75rem; height: 2.75rem; border-radius: 50%; border: none; background: var(--lt-primary-600); color: var(--lt-surface-0, var(--lt-surface-0)); box-shadow: var(--p-shadow-lg); cursor: pointer; align-items: center; justify-content: center; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); animation: fadeIn 0.2s ease;" 
                    title="Scroll to Top"
                    aria-label="Scroll to top">
                ${unsafe(LucideIcons.arrowUp)}
            </button>
        `);

        container.querySelector('.laughtale-scroll-top-btn')?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: props.behavior || 'smooth' });
        }, { signal: ctx?.signal });
    }

    const checkScroll = () => {
        const scrolled = window.scrollY > threshold;
        if (scrolled !== isVisible) {
            isVisible = scrolled;
            render();
        }
    };

    window.addEventListener('scroll', checkScroll, { passive: true, signal: ctx?.signal });
    render();
}
