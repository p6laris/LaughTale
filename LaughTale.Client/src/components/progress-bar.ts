import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { injectIslandStyle } from '../runtime/styles';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';

/**
 * LaughTale: Enterprise ProgressBar Component (Aura Design System compliant)
 * Determinate & indeterminate modes, dynamic theme tokens, smooth GPU transitions,
 * percentage & custom label slots, slim buffer sizes, and WAI-ARIA progressbar accessibility.
 */

export interface ProgressBarProps {
    value?: number; // 0 - 100
    mode?: 'determinate' | 'indeterminate';
    showValue?: boolean;
    height?: string;
    color?: string;
    unit?: string;
    class?: string;
    style?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const PROGRESS_BAR_CSS = `
island-progress-bar,
p-progressbar {
    display: contents !important;
}

.p-progressbar {
    position: relative;
    overflow: hidden;
    height: 1.25rem;
    background: var(--p-progressbar-background, var(--p-surface-200, #e2e8f0));
    border-radius: var(--p-progressbar-border-radius, var(--p-border-radius, 6px));
    width: 100%;
    box-sizing: border-box;
    display: block;
}

.p-progressbar-value {
    background: var(--p-progressbar-value-background, var(--p-primary-color, #10b981));
    height: 100%;
    width: 0%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: inherit;
    transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.p-progressbar-label {
    color: var(--p-progressbar-label-color, var(--p-primary-contrast-color, #ffffff));
    font-size: var(--p-progressbar-label-font-size, 0.75rem);
    font-weight: var(--p-progressbar-label-font-weight, 700);
    line-height: 1;
    white-space: nowrap;
    user-select: none;
    font-family: var(--p-font-family, inherit);
    padding: 0 0.5rem;
}

/* Indeterminate Animation */
.p-progressbar-indeterminate .p-progressbar-indeterminate-container {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: var(--p-progressbar-background, var(--p-surface-200, #e2e8f0));
}

.p-progressbar-indeterminate .p-progressbar-value {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background: var(--p-progressbar-value-background, var(--p-primary-color, #10b981));
    animation: p-progressbar-indeterminate-anim 1.8s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    will-change: left, right;
}

@keyframes p-progressbar-indeterminate-anim {
    0% {
        left: -35%;
        right: 100%;
    }
    60% {
        left: 100%;
        right: -90%;
    }
    100% {
        left: 100%;
        right: -90%;
    }
}

/* Dark Mode Tokens */
html.dark .p-progressbar,
[data-theme="dark"] .p-progressbar,
.dark .p-progressbar {
    background: var(--p-surface-800, #1e293b);
}

html.dark .p-progressbar-indeterminate .p-progressbar-indeterminate-container,
[data-theme="dark"] .p-progressbar-indeterminate .p-progressbar-indeterminate-container,
.dark .p-progressbar-indeterminate .p-progressbar-indeterminate-container {
    background: var(--p-surface-800, #1e293b);
}
`;

export default function ProgressBarIsland(container: HTMLElement, props: ProgressBarProps, ctx?: IslandContext) {
    injectIslandStyle('progress-bar', PROGRESS_BAR_CSS);

    const isIndeterminate = props.mode === 'indeterminate' || (props.value === undefined && props.mode !== 'determinate');
    const value = Math.max(0, Math.min(100, props.value ?? 0));
    const showValue = props.showValue !== false && !isIndeterminate;
    const unit = props.unit || '%';
    const height = props.height || (showValue ? '1.25rem' : '0.5rem');
    const color = props.color;

    let rootEl = container.querySelector<HTMLElement>('.p-progressbar');
    let valueEl = rootEl?.querySelector<HTMLElement>('.p-progressbar-value');
    let labelEl = valueEl?.querySelector<HTMLElement>('.p-progressbar-label');

    if (!rootEl || !valueEl) {
        rootEl = document.createElement('div');
        rootEl.className = `p-progressbar p-component ${isIndeterminate ? 'p-progressbar-indeterminate' : ''} ${props.class || ''}`;
        rootEl.setAttribute('role', 'progressbar');
        rootEl.setAttribute('aria-valuemin', '0');
        rootEl.setAttribute('aria-valuemax', '100');
        rootEl.style.height = height;
        if (props.style) rootEl.style.cssText += props.style;

        if (isIndeterminate) {
            const containerEl = document.createElement('div');
            containerEl.className = 'p-progressbar-indeterminate-container';
            valueEl = document.createElement('div');
            valueEl.className = 'p-progressbar-value p-progressbar-value-animate';
            if (color) valueEl.style.background = color;
            containerEl.appendChild(valueEl);
            rootEl.appendChild(containerEl);
        } else {
            rootEl.setAttribute('aria-valuenow', String(value));
            valueEl = document.createElement('div');
            valueEl.className = 'p-progressbar-value p-progressbar-value-animate';
            valueEl.style.width = `${value}%`;
            if (color) valueEl.style.background = color;

            if (showValue) {
                labelEl = document.createElement('div');
                labelEl.className = 'p-progressbar-label';
                labelEl.textContent = `${value}${unit}`;
                valueEl.appendChild(labelEl);
            }
            rootEl.appendChild(valueEl);
        }

        setHtml(container, html``);
        container.appendChild(rootEl);
    } else {
        // SSR Hydration update
        rootEl.style.height = height;
        if (!isIndeterminate) {
            rootEl.setAttribute('aria-valuenow', String(value));
            valueEl.style.width = `${value}%`;
            if (color) valueEl.style.background = color;
            if (labelEl && showValue) {
                labelEl.textContent = `${value}${unit}`;
            }
        }
    }

    container.setAttribute('data-part', 'root');
    rootEl.setAttribute('data-part', 'container');
    valueEl.setAttribute('data-part', 'value');
    applyPart(container, 'root', props.class || '', props.pt, props.studioOverrides);
}
