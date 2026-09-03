import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { injectIslandStyle } from '../runtime/styles';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'native',
    element: 'button'
};

const SVG_ICONS = {
    chevronDown: html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
    plus: html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>`,
    minus: html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`
};

const FIELDSET_CSS = `
.p-fieldset {
    border: 1px solid var(--p-border-color, var(--lt-surface-200));
    background: var(--p-content-bg, var(--p-surface-0, #ffffff));
    color: var(--p-text-color, var(--lt-text-primary));
    border-radius: var(--p-border-radius-md, var(--lt-radius-md, 6px));
    padding: 0 1.125rem 1.125rem 1.125rem;
    margin: 0;
    box-sizing: border-box;
    transition: border-color 0.2s ease;
    width: 100%;
}

.p-fieldset-legend {
    padding: 0 0.5rem;
    border: none;
    color: var(--p-text-color, var(--lt-text-primary));
    background: transparent;
    border-radius: var(--p-border-radius, 6px);
    font-weight: 600;
    font-size: 0.875rem;
    margin: 0;
    width: auto;
}

.p-fieldset-toggle-button {
    cursor: pointer;
    user-select: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    padding: 0.35rem 0.6rem;
    border: 1px solid transparent;
    background: var(--p-content-bg, var(--p-surface-0, #ffffff));
    color: var(--p-text-color, var(--lt-text-primary));
    border-radius: var(--p-border-radius, 6px);
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    text-decoration: none;
    outline: none;
    font-family: inherit;
}
.p-fieldset-toggle-button:hover {
    background: var(--p-content-hover-bg, var(--p-surface-100, #f1f5f9));
    color: var(--p-text-color, var(--lt-surface-900));
}
.p-fieldset-toggle-button:focus-visible {
    box-shadow: 0 0 0 1px var(--p-surface-0, #ffffff), 0 0 0 3px var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
}

.p-fieldset-toggle-icon {
    color: var(--p-text-muted, var(--lt-surface-500));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1), color 0.15s ease;
}

.p-fieldset-chevron-indicator .p-fieldset-toggle-button[aria-expanded="true"] .p-fieldset-toggle-icon {
    transform: rotate(180deg);
}

.p-fieldset-legend-label {
    font-weight: 600;
    font-size: 0.875rem;
}

/* 60fps CSS Grid Smooth Collapse/Expand Transition */
.p-fieldset-content-container {
    display: grid;
    grid-template-rows: 1fr;
    transition: grid-template-rows 250ms cubic-bezier(0.2, 0, 0, 1);
}
.p-fieldset.p-fieldset-collapsed .p-fieldset-content-container {
    grid-template-rows: 0fr;
}

.p-fieldset-content-wrapper {
    min-height: 0;
    overflow: hidden;
}

.p-fieldset-content {
    padding-top: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--p-text-color, var(--lt-surface-700));
    transition: opacity 200ms ease, transform 200ms ease;
    opacity: 1;
    transform: translateY(0);
}
.p-fieldset.p-fieldset-collapsed .p-fieldset-content {
    opacity: 0;
    transform: translateY(-4px);
}

/* Top control buttons for controlled mode */
.p-fieldset-top-controls {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}
.p-fieldset-ctrl-btn {
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
.p-fieldset-ctrl-btn:hover {
    background: var(--p-surface-100, #f1f5f9);
}
.p-fieldset-ctrl-btn.p-highlight {
    background: var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
    border-color: var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
    color: var(--p-primary-contrast-color, #ffffff) !important;
}

/* Dark Mode Tokens */
html.dark .p-fieldset,
[data-theme="dark"] .p-fieldset,
.dark .p-fieldset {
    background: var(--p-surface-0) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-fieldset-toggle-button,
[data-theme="dark"] .p-fieldset-toggle-button,
.dark .p-fieldset-toggle-button {
    background: var(--p-surface-0) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-fieldset-toggle-button:hover,
[data-theme="dark"] .p-fieldset-toggle-button:hover,
.dark .p-fieldset-toggle-button:hover {
    background: var(--p-surface-100) !important;
}
html.dark .p-fieldset-content,
[data-theme="dark"] .p-fieldset-content,
.dark .p-fieldset-content {
    color: var(--p-text-color) !important;
}
html.dark .p-fieldset-ctrl-btn,
[data-theme="dark"] .p-fieldset-ctrl-btn,
.dark .p-fieldset-ctrl-btn {
    background: var(--p-surface-100) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-fieldset-ctrl-btn.p-highlight,
[data-theme="dark"] .p-fieldset-ctrl-btn.p-highlight,
.dark .p-fieldset-ctrl-btn.p-highlight {
    background: var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
    border-color: var(--p-primary-color, var(--lt-primary-500, #10b981)) !important;
    color: var(--p-primary-contrast-color, #ffffff) !important;
}
`;

export interface FieldsetProps {
    legend?: string;
    toggleable?: boolean;
    collapsed?: boolean;
    controlled?: boolean;
    toggleIcon?: 'plusMinus' | 'chevron';
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

export default function FieldsetIsland(container: HTMLElement, props: FieldsetProps, ctx?: IslandContext) {
    injectIslandStyle('fieldset', FIELDSET_CSS);
    container.setAttribute('data-part', 'root');

    const legendText = props.legend || container.getAttribute('legend') || container.getAttribute('data-legend') || '';
    const isToggleable = props.toggleable !== undefined ? !!props.toggleable : (container.getAttribute('toggleable') === 'true' || container.hasAttribute('toggleable'));
    const isControlled = props.controlled !== undefined ? !!props.controlled : (container.getAttribute('controlled') === 'true' || container.hasAttribute('controlled'));
    const toggleIconType = props.toggleIcon || container.getAttribute('toggle-icon') || container.getAttribute('data-toggle-icon') || 'plusMinus';
    let isCollapsed = props.collapsed !== undefined ? !!props.collapsed : (container.getAttribute('collapsed') === 'true' || container.hasAttribute('collapsed'));

    // Check if DOM already has .p-fieldset-legend
    let legendEl = container.querySelector<HTMLElement>(':scope > .p-fieldset-legend') || container.querySelector<HTMLElement>('.p-fieldset-legend');

    if (!legendEl && (legendText || isToggleable)) {
        // Collect existing child content (slot or children)
        const slotEl = container.querySelector<HTMLElement>(':scope > .island-slot');
        const fragment = document.createDocumentFragment();
        const sourceNodes = slotEl ? Array.from(slotEl.childNodes) : Array.from(container.childNodes);

        sourceNodes.forEach(node => fragment.appendChild(node));
        if (slotEl) slotEl.remove();

        setHtml(container, html``);

        // Add top controls if controlled mode
        if (isControlled && container.parentElement && !container.parentElement.querySelector('.p-fieldset-top-controls')) {
            const topControls = document.createElement('div');
            topControls.className = 'p-fieldset-top-controls';
            setHtml(topControls, html`
                <button type="button" class="p-fieldset-ctrl-btn ${!isCollapsed ? 'p-highlight' : ''}" data-action="open">Open</button>
                <button type="button" class="p-fieldset-ctrl-btn ${isCollapsed ? 'p-highlight' : ''}" data-action="close">Close</button>
            `);
            container.parentElement.insertBefore(topControls, container);
        }

        // Build legend
        legendEl = document.createElement('legend');
        legendEl.className = 'p-fieldset-legend';

        if (isToggleable) {
            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'p-fieldset-toggle-button';
            toggleBtn.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');

            const iconSpan = document.createElement('span');
            iconSpan.className = 'p-fieldset-toggle-icon';
            if (toggleIconType === 'plusMinus') {
                setHtml(iconSpan, isCollapsed ? SVG_ICONS.plus : SVG_ICONS.minus);
            } else {
                setHtml(iconSpan, SVG_ICONS.chevronDown);
            }
            toggleBtn.appendChild(iconSpan);

            const labelSpan = document.createElement('span');
            labelSpan.className = 'p-fieldset-legend-label';
            labelSpan.textContent = legendText;
            toggleBtn.appendChild(labelSpan);

            legendEl.appendChild(toggleBtn);
        } else {
            const labelSpan = document.createElement('span');
            labelSpan.className = 'p-fieldset-legend-label';
            labelSpan.textContent = legendText;
            legendEl.appendChild(labelSpan);
        }

        container.appendChild(legendEl);

        // Build content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'p-fieldset-content-container';

        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'p-fieldset-content-wrapper';

        const content = document.createElement('div');
        content.className = 'p-fieldset-content';
        content.appendChild(fragment);

        contentWrapper.appendChild(content);
        contentContainer.appendChild(contentWrapper);
        container.appendChild(contentContainer);
    } else if (!container.querySelector('.p-fieldset-content-container')) {
        const slotEl = container.querySelector<HTMLElement>(':scope > .island-slot');
        if (slotEl) {
            while (slotEl.firstChild) {
                container.appendChild(slotEl.firstChild);
            }
            slotEl.remove();
        }
    }

    container.classList.add('p-fieldset', 'p-component');
    if (toggleIconType === 'chevron') {
        container.classList.add('p-fieldset-chevron-indicator');
    }
    if (isCollapsed) {
        container.classList.add('p-fieldset-collapsed');
    }

    const toggleBtn = container.querySelector<HTMLButtonElement>('.p-fieldset-toggle-button');
    const iconSpan = container.querySelector<HTMLElement>('.p-fieldset-toggle-icon');

    function updateState(collapsed: boolean) {
        isCollapsed = collapsed;
        container.classList.toggle('p-fieldset-collapsed', isCollapsed);

        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
        }

        if (iconSpan) {
            if (toggleIconType === 'plusMinus') {
                setHtml(iconSpan, isCollapsed ? SVG_ICONS.plus : SVG_ICONS.minus);
            }
        }

        const ctrlButtons = container.parentElement?.querySelectorAll<HTMLButtonElement>('.p-fieldset-ctrl-btn')
            || container.querySelectorAll<HTMLButtonElement>('.p-fieldset-ctrl-btn');
        ctrlButtons.forEach(btn => {
            const action = btn.getAttribute('data-action');
            if (action === 'open') {
                btn.classList.toggle('p-highlight', !isCollapsed);
            } else if (action === 'close') {
                btn.classList.toggle('p-highlight', isCollapsed);
            }
        });

        container.dispatchEvent(new CustomEvent('fieldset:toggle', {
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
        const ctrlButtons = container.parentElement?.querySelectorAll<HTMLButtonElement>('.p-fieldset-ctrl-btn')
            || container.querySelectorAll<HTMLButtonElement>('.p-fieldset-ctrl-btn');
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
