import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise Panel Component (Aura Design System compliant)
 * Container component with optional collapsible content, smooth 60fps CSS Grid animations,
 * controlled states, custom indicators, header/footer templates, and W3C APG keyboard accessibility.
 */

import { injectIslandStyle } from '../runtime/styles';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';

const SVG_ICONS = {
    chevronDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
    minus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>'
};

const PANEL_CSS = `
.p-panel {
    border: 1px solid var(--p-border-color, var(--lt-surface-200));
    background: var(--p-content-bg, var(--p-surface-0, #ffffff));
    color: var(--p-text-color, var(--lt-text-primary));
    border-radius: var(--p-border-radius-md, var(--lt-radius-md, 6px));
    overflow: hidden;
    box-sizing: border-box;
    transition: border-color 0.2s ease;
    width: 100%;
}

.p-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.125rem;
    background: var(--p-content-bg, var(--p-surface-0, #ffffff));
    color: var(--p-text-color, var(--lt-text-primary));
    border-bottom: 1px solid var(--p-border-color, var(--lt-surface-200));
    box-sizing: border-box;
    transition: border-color 0.2s ease;
}
.p-panel.p-panel-collapsed .p-panel-header {
    border-bottom-color: transparent;
}

.p-panel-title {
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25;
    color: var(--p-text-color, var(--lt-text-primary));
}

.p-panel-icons {
    display: flex;
    align-items: center;
    gap: 0.35rem;
}

.p-panel-toggle-button {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    border: 1px solid var(--p-border-color, var(--lt-surface-200));
    background: var(--p-content-bg, var(--p-surface-0, #ffffff));
    color: var(--p-text-muted, var(--lt-surface-600));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    outline: none;
    padding: 0;
    box-sizing: border-box;
}
.p-panel-toggle-button:hover {
    background: var(--p-content-hover-bg, var(--p-surface-100, #f1f5f9));
    color: var(--p-text-color, var(--lt-surface-900));
    border-color: var(--p-border-color, var(--lt-surface-300));
}
.p-panel-toggle-button:focus-visible {
    box-shadow: 0 0 0 1px var(--p-surface-0, #ffffff), 0 0 0 3px var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
}

.p-panel-toggle-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1), color 0.15s ease;
}

.p-panel-chevron-indicator .p-panel-toggle-button[aria-expanded="true"] .p-panel-toggle-icon {
    transform: rotate(180deg);
}

/* 60fps CSS Grid Smooth Collapse/Expand Transition */
.p-panel-content-container {
    display: grid;
    grid-template-rows: 1fr;
    transition: grid-template-rows 250ms cubic-bezier(0.2, 0, 0, 1);
}
.p-panel.p-panel-collapsed .p-panel-content-container {
    grid-template-rows: 0fr;
}

.p-panel-content-wrapper {
    min-height: 0;
    overflow: hidden;
}

.p-panel-content {
    padding: 1.125rem;
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--p-text-color, var(--lt-surface-700));
    transition: opacity 200ms ease, transform 200ms ease;
    opacity: 1;
    transform: translateY(0);
}
.p-panel.p-panel-collapsed .p-panel-content {
    opacity: 0;
    transform: translateY(-4px);
}

.p-panel-footer {
    padding: 0.75rem 1.125rem;
    border-top: 1px solid var(--p-border-color, var(--lt-surface-200));
    background: var(--p-content-bg, var(--p-surface-0, #ffffff));
    color: var(--p-text-muted, var(--lt-surface-500));
    font-size: 0.8125rem;
}

/* Top control buttons for controlled mode */
.p-panel-top-controls {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}
.p-panel-ctrl-btn {
    padding: 0.45rem 1.1rem;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid var(--p-border-color, var(--lt-surface-300));
    background: var(--p-surface-0, #ffffff);
    color: var(--p-text-color, var(--lt-surface-700));
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
}
.p-panel-ctrl-btn:hover {
    background: var(--p-surface-100, #f1f5f9);
}
.p-panel-ctrl-btn.p-highlight {
    background: var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
    border-color: var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
    color: var(--p-primary-contrast-color, #ffffff) !important;
}

/* Dark Mode Tokens */
html.dark .p-panel,
[data-theme="dark"] .p-panel,
.dark .p-panel {
    background: var(--p-surface-0) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-panel-header,
[data-theme="dark"] .p-panel-header,
.dark .p-panel-header {
    background: var(--p-surface-0) !important;
    border-color: var(--p-border-color) !important;
}
html.dark .p-panel-title,
[data-theme="dark"] .p-panel-title,
.dark .p-panel-title {
    color: var(--p-text-color) !important;
}
html.dark .p-panel-toggle-button,
[data-theme="dark"] .p-panel-toggle-button,
.dark .p-panel-toggle-button {
    background: var(--p-surface-0) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-muted) !important;
}
html.dark .p-panel-toggle-button:hover,
[data-theme="dark"] .p-panel-toggle-button:hover,
.dark .p-panel-toggle-button:hover {
    background: var(--p-surface-100) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-panel-content,
[data-theme="dark"] .p-panel-content,
.dark .p-panel-content {
    color: var(--p-text-color) !important;
}
html.dark .p-panel-footer,
[data-theme="dark"] .p-panel-footer,
.dark .p-panel-footer {
    background: var(--p-surface-0) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-muted) !important;
}
html.dark .p-panel-ctrl-btn,
[data-theme="dark"] .p-panel-ctrl-btn,
.dark .p-panel-ctrl-btn {
    background: var(--p-surface-100) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-panel-ctrl-btn.p-highlight,
[data-theme="dark"] .p-panel-ctrl-btn.p-highlight,
.dark .p-panel-ctrl-btn.p-highlight {
    background: var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
    border-color: var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
    color: var(--p-primary-contrast-color, #ffffff) !important;
}
`;

export interface PanelProps {
    header?: string;
    toggleable?: boolean;
    collapsed?: boolean;
    controlled?: boolean;
    toggleIcon?: 'plusMinus' | 'chevron';
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

export default function PanelIsland(container: HTMLElement, props: PanelProps, ctx?: IslandContext) {
    injectIslandStyle('panel', PANEL_CSS);
    container.setAttribute('data-part', 'root');

    const headerText = props.header || container.getAttribute('header') || container.getAttribute('data-header') || '';
    const isToggleable = props.toggleable !== undefined ? !!props.toggleable : (container.getAttribute('toggleable') === 'true' || container.hasAttribute('toggleable'));
    const isControlled = props.controlled !== undefined ? !!props.controlled : (container.getAttribute('controlled') === 'true' || container.hasAttribute('controlled'));
    const toggleIconType = props.toggleIcon || container.getAttribute('toggle-icon') || container.getAttribute('data-toggle-icon') || 'chevron';
    let isCollapsed = props.collapsed !== undefined ? !!props.collapsed : (container.getAttribute('collapsed') === 'true' || container.hasAttribute('collapsed'));

    // Check if DOM already has .p-panel-header (e.g. custom template)
    let headerEl = container.querySelector<HTMLElement>(':scope > .p-panel-header') || container.querySelector<HTMLElement>('.p-panel-header');
    
    if (!headerEl && (headerText || isToggleable)) {
        // Collect existing child content (slot or children)
        const slotEl = container.querySelector<HTMLElement>(':scope > .island-slot');
        const fragment = document.createDocumentFragment();
        const sourceNodes = slotEl ? Array.from(slotEl.childNodes) : Array.from(container.childNodes);
        
        sourceNodes.forEach(node => fragment.appendChild(node));
        if (slotEl) slotEl.remove();

        setHtml(container, html``);

        // Add top controls if controlled mode
        if (isControlled && container.parentElement && !container.parentElement.querySelector('.p-panel-top-controls')) {
            const topControls = document.createElement('div');
            topControls.className = 'p-panel-top-controls';
            setHtml(topControls, html`
                <button type="button" class="p-panel-ctrl-btn ${!isCollapsed ? 'p-highlight' : ''}" data-action="open">Open</button>
                <button type="button" class="p-panel-ctrl-btn ${isCollapsed ? 'p-highlight' : ''}" data-action="close">Close</button>
            `);
            container.parentElement.insertBefore(topControls, container);
        }

        // Build header
        headerEl = document.createElement('div');
        headerEl.className = 'p-panel-header';
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'p-panel-title';
        titleSpan.textContent = headerText;
        headerEl.appendChild(titleSpan);

        if (isToggleable) {
            const iconsDiv = document.createElement('div');
            iconsDiv.className = 'p-panel-icons';

            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'p-panel-toggle-button';
            toggleBtn.setAttribute('aria-label', 'Toggle Panel');
            toggleBtn.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');

            const iconSpan = document.createElement('span');
            iconSpan.className = 'p-panel-toggle-icon';
            if (toggleIconType === 'plusMinus') {
                setHtml(iconSpan, isCollapsed ? unsafe(SVG_ICONS.plus) : unsafe(SVG_ICONS.minus));
            } else {
                setHtml(iconSpan, unsafe(SVG_ICONS.chevronDown));
            }
            toggleBtn.appendChild(iconSpan);
            iconsDiv.appendChild(toggleBtn);
            headerEl.appendChild(iconsDiv);
        }

        container.appendChild(headerEl);

        // Build content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'p-panel-content-container';

        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'p-panel-content-wrapper';

        const content = document.createElement('div');
        content.className = 'p-panel-content';
        content.appendChild(fragment);

        contentWrapper.appendChild(content);
        contentContainer.appendChild(contentWrapper);
        container.appendChild(contentContainer);
    } else if (!container.querySelector('.p-panel-content-container')) {
        const slotEl = container.querySelector<HTMLElement>(':scope > .island-slot');
        if (slotEl) {
            while (slotEl.firstChild) {
                container.appendChild(slotEl.firstChild);
            }
            slotEl.remove();
        }
    }

    container.classList.add('p-panel', 'p-component');
    if (toggleIconType === 'chevron') {
        container.classList.add('p-panel-chevron-indicator');
    }
    if (isCollapsed) {
        container.classList.add('p-panel-collapsed');
    }

    const toggleBtn = container.querySelector<HTMLButtonElement>('.p-panel-toggle-button');
    const iconSpan = container.querySelector<HTMLElement>('.p-panel-toggle-icon');

    function updateState(collapsed: boolean) {
        isCollapsed = collapsed;
        container.classList.toggle('p-panel-collapsed', isCollapsed);

        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
        }

        if (iconSpan) {
            if (toggleIconType === 'plusMinus') {
                setHtml(iconSpan, isCollapsed ? unsafe(SVG_ICONS.plus) : unsafe(SVG_ICONS.minus));
            }
        }

        // Sync controlled buttons
        const ctrlButtons = container.parentElement?.querySelectorAll<HTMLButtonElement>('.p-panel-ctrl-btn') 
            || container.querySelectorAll<HTMLButtonElement>('.p-panel-ctrl-btn');
        ctrlButtons.forEach(btn => {
            const action = btn.getAttribute('data-action');
            if (action === 'open') {
                btn.classList.toggle('p-highlight', !isCollapsed);
            } else if (action === 'close') {
                btn.classList.toggle('p-highlight', isCollapsed);
            }
        });

        container.dispatchEvent(new CustomEvent('panel:toggle', {
            bubbles: true,
            detail: { collapsed: isCollapsed }
        }));
    }

    if (isToggleable && toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateState(!isCollapsed);
        }, { signal: ctx?.signal });

        toggleBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                updateState(!isCollapsed);
            }
        }, { signal: ctx?.signal });
    }

    if (isControlled) {
        const ctrlButtons = container.parentElement?.querySelectorAll<HTMLButtonElement>('.p-panel-ctrl-btn') 
            || container.querySelectorAll<HTMLButtonElement>('.p-panel-ctrl-btn');
        ctrlButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                if (action === 'open') {
                    updateState(false);
                } else if (action === 'close') {
                    updateState(true);
                }
            }, { signal: ctx?.signal });
        });
    }
}
