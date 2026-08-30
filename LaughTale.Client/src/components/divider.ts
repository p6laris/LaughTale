/**
 * LaughTale: Enterprise Divider Component (Aura Design System compliant)
 * Separates content horizontally or vertically with solid, dotted, or dashed borders,
 * custom alignment (left, center, right, top, bottom), and embedded content labels.
 */

import { injectIslandStyle } from '../runtime/styles';

const DIVIDER_CSS = `
.p-divider {
    box-sizing: border-box;
}

.p-divider-horizontal {
    display: flex;
    width: 100%;
    position: relative;
    align-items: center;
    margin: 1.25rem 0;
    padding: 0;
}
.p-divider-horizontal:before {
    position: absolute;
    display: block;
    top: 50%;
    left: 0;
    width: 100%;
    content: "";
    border-top: 1px solid var(--p-surface-200, #e2e8f0);
}
.p-divider-horizontal.p-divider-solid:before {
    border-top-style: solid;
}
.p-divider-horizontal.p-divider-dotted:before {
    border-top-style: dotted;
}
.p-divider-horizontal.p-divider-dashed:before {
    border-top-style: dashed;
}
.p-divider-horizontal .p-divider-content {
    padding: 0 0.75rem;
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    z-index: 1;
}
.p-divider-horizontal.p-divider-left {
    justify-content: flex-start;
}
.p-divider-horizontal.p-divider-center {
    justify-content: center;
}
.p-divider-horizontal.p-divider-right {
    justify-content: flex-end;
}

.p-divider-vertical {
    min-height: 100%;
    margin: 0 1.25rem;
    display: flex;
    position: relative;
    justify-content: center;
    padding: 0;
}
.p-divider-vertical:before {
    position: absolute;
    display: block;
    top: 0;
    left: 50%;
    height: 100%;
    content: "";
    border-left: 1px solid var(--p-surface-200, #e2e8f0);
}
.p-divider-vertical.p-divider-solid:before {
    border-left-style: solid;
}
.p-divider-vertical.p-divider-dotted:before {
    border-left-style: dotted;
}
.p-divider-vertical.p-divider-dashed:before {
    border-left-style: dashed;
}
.p-divider-vertical .p-divider-content {
    padding: 0.5rem 0;
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    z-index: 1;
}
.p-divider-vertical.p-divider-top {
    align-items: flex-start;
}
.p-divider-vertical.p-divider-center {
    align-items: center;
}
.p-divider-vertical.p-divider-bottom {
    align-items: flex-end;
}

/* Dark Mode Tokens */
.dark .p-divider:before,
[data-theme="dark"] .p-divider:before {
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-divider .p-divider-content,
[data-theme="dark"] .p-divider .p-divider-content {
    background: var(--p-surface-900, #0f172a) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
`;

export interface DividerProps {
    layout?: 'horizontal' | 'vertical';
    type?: 'solid' | 'dotted' | 'dashed';
    align?: 'left' | 'center' | 'right' | 'top' | 'bottom';
}

export default function DividerIsland(container: HTMLElement, props: DividerProps) {
    injectIslandStyle('divider', DIVIDER_CSS);

    const isVertical = props.layout === 'vertical';
    container.classList.add('p-divider', 'p-component');
    container.classList.add(isVertical ? 'p-divider-vertical' : 'p-divider-horizontal');
    container.classList.add(`p-divider-${props.type || 'solid'}`);
    container.classList.add(`p-divider-${props.align || (isVertical ? 'center' : 'left')}`);
    container.setAttribute('role', 'separator');
    container.setAttribute('aria-orientation', isVertical ? 'vertical' : 'horizontal');
}
