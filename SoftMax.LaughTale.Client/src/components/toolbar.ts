/**
 * SoftMax.LaughTale: Enterprise Toolbar Component (Aura Design System compliant)
 * Grouping component for buttons and controls with start, center, and end slot sections.
 */

import { injectIslandStyle } from '../runtime/styles';

const TOOLBAR_CSS = `
.p-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0.75rem 1rem;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 6px);
    gap: 0.5rem;
    box-sizing: border-box;
    width: 100%;
}

.p-toolbar-start,
.p-toolbar-center,
.p-toolbar-end,
.p-toolbar-group-start,
.p-toolbar-group-center,
.p-toolbar-group-end {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.p-toolbar-center,
.p-toolbar-group-center {
    justify-content: center;
    flex: 1 1 auto;
}

.p-toolbar-end,
.p-toolbar-group-end {
    margin-left: auto;
}

/* Dark Mode Tokens */
.dark .p-toolbar,
[data-theme="dark"] .p-toolbar {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
`;

export interface ToolbarProps {
    ariaLabel?: string;
}

export default function ToolbarIsland(container: HTMLElement, props: ToolbarProps) {
    injectIslandStyle('toolbar', TOOLBAR_CSS);

    const rootEl = container.querySelector<HTMLElement>('.p-toolbar') || container;
    rootEl.classList.add('p-toolbar', 'p-component');
    rootEl.setAttribute('role', 'toolbar');
    rootEl.setAttribute('aria-orientation', 'horizontal');
    if (props.ariaLabel) {
        rootEl.setAttribute('aria-label', props.ariaLabel);
    }
}
