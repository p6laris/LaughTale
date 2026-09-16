import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { injectIslandStyle } from '../runtime/styles';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import { getLucideIcon } from '../icons/lucide';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'status'
};

/**
 * LaughTale: Enterprise Status Tag & Badge Component (Aura Design System compliant)
 * Severity tokens (success, info, warn, danger, secondary, contrast), rounded pill options,
 * embedded status icons, and theme studio dark mode awareness.
 */

export interface TagProps {
    value?: string;
    severity?: 'success' | 'info' | 'warn' | 'warning' | 'danger' | 'secondary' | 'contrast' | string;
    rounded?: boolean;
    icon?: string;
    class?: string;
    style?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const TAG_CSS = `
island-tag,
p-tag {
    display: contents !important;
}

.p-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--p-tag-primary-background, var(--p-primary-50, #eff6ff));
    color: var(--p-tag-primary-color, var(--p-primary-700, #1d4ed8));
    font-size: var(--p-tag-font-size, 0.75rem);
    font-weight: var(--p-tag-font-weight, 700);
    padding: var(--p-tag-padding, 0.25rem 0.6rem);
    border-radius: var(--p-tag-border-radius, var(--p-border-radius, 6px));
    gap: var(--p-tag-gap, 0.35rem);
    line-height: 1;
    white-space: nowrap;
    user-select: none;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    transition: background-color 150ms ease, color 150ms ease;
}

.p-tag.p-tag-rounded {
    border-radius: 9999px !important;
}

.p-tag-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 0.875rem;
    height: 0.875rem;
    flex-shrink: 0;
}

.p-tag-icon svg {
    width: 0.875rem;
    height: 0.875rem;
}

.p-tag-label {
    display: inline-block;
}

/* Severity Variants */
.p-tag.p-tag-info {
    background: var(--p-tag-info-background, var(--p-info-50, #eff6ff));
    color: var(--p-tag-info-color, var(--p-info-700, #1d4ed8));
}

.p-tag.p-tag-success {
    background: var(--p-tag-success-background, color-mix(in srgb, var(--p-primary-color, #10b981) 14%, transparent));
    color: var(--p-tag-success-color, var(--p-primary-700, #047857));
}

.p-tag.p-tag-warn,
.p-tag.p-tag-warning {
    background: var(--p-tag-warn-background, var(--p-warn-50, #fffbeb));
    color: var(--p-tag-warn-color, var(--p-warn-700, #b45309));
}

.p-tag.p-tag-danger {
    background: var(--p-tag-danger-background, var(--p-danger-50, #fef2f2));
    color: var(--p-tag-danger-color, var(--p-danger-700, #b91c1c));
}

.p-tag.p-tag-secondary {
    background: var(--p-tag-secondary-background, var(--p-surface-100, #f1f5f9));
    color: var(--p-tag-secondary-color, var(--p-surface-700, #334155));
}

.p-tag.p-tag-contrast {
    background: var(--p-tag-contrast-background, var(--p-surface-900, #0f172a));
    color: var(--p-tag-contrast-color, var(--p-surface-0, #ffffff));
}

/* Dark Mode Tokens */
html.dark .p-tag.p-tag-info,
[data-theme="dark"] .p-tag.p-tag-info,
.dark .p-tag.p-tag-info {
    background: rgba(59, 130, 246, 0.16);
    color: var(--p-info-300, #93c5fd);
}

html.dark .p-tag.p-tag-success,
[data-theme="dark"] .p-tag.p-tag-success,
.dark .p-tag.p-tag-success {
    background: color-mix(in srgb, var(--p-primary-color, #10b981) 18%, transparent);
    color: var(--p-primary-300, #6ee7b7);
}

html.dark .p-tag.p-tag-warn,
html.dark .p-tag.p-tag-warning,
[data-theme="dark"] .p-tag.p-tag-warn,
[data-theme="dark"] .p-tag.p-tag-warning,
.dark .p-tag.p-tag-warn,
.dark .p-tag.p-tag-warning {
    background: rgba(245, 158, 11, 0.16);
    color: var(--p-warn-300, #fcd34d);
}

html.dark .p-tag.p-tag-danger,
[data-theme="dark"] .p-tag.p-tag-danger,
.dark .p-tag.p-tag-danger {
    background: rgba(239, 68, 68, 0.16);
    color: var(--p-danger-300, #fca5a5);
}

html.dark .p-tag.p-tag-secondary,
[data-theme="dark"] .p-tag.p-tag-secondary,
.dark .p-tag.p-tag-secondary {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-300, #cbd5e1);
}

html.dark .p-tag.p-tag-contrast,
[data-theme="dark"] .p-tag.p-tag-contrast,
.dark .p-tag.p-tag-contrast {
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-950, #020617);
}
`;

function getIconSvg(iconName: string): string {
    const name = iconName.toLowerCase();
    if (name.includes('check'))
        return getLucideIcon('check', 14, 2.5);
    if (name.includes('warn') || name.includes('triangle') || name.includes('alert'))
        return getLucideIcon('triangle-alert', 14, 2);
    if (name.includes('danger') || name.includes('x') || name.includes('circle') || name.includes('cross'))
        return getLucideIcon('circle-x', 14, 2);
    if (name.includes('info'))
        return getLucideIcon('info', 14, 2);
    if (name.includes('clock') || name.includes('time') || name.includes('standby'))
        return getLucideIcon('clock', 14, 2);

    return getLucideIcon('info', 14, 2);
}

export default function TagIsland(container: HTMLElement, props: TagProps, ctx?: IslandContext) {
    injectIslandStyle('tag', TAG_CSS);

    const rawSeverity = (props.severity || 'info').toLowerCase();
    const severity = rawSeverity === 'warn' ? 'warning' : rawSeverity;
    const isRounded = props.rounded || false;
    const value = props.value ?? container.textContent?.trim() ?? '';

    const rootEl = document.createElement('span');
    rootEl.className = `p-tag p-component p-tag-${severity} ${isRounded ? 'p-tag-rounded' : ''} ${props.class || ''}`.trim();
    rootEl.setAttribute('role', 'status');
    rootEl.setAttribute('aria-live', 'polite');
    if (props.style) rootEl.style.cssText += props.style;

    const iconHtml = props.icon ? html`<span class="p-tag-icon">${unsafe(getIconSvg(props.icon))}</span>` : '';

    setHtml(rootEl, html`${iconHtml}<span class="p-tag-label">${value}</span>`);

    setHtml(container, html``);
    container.appendChild(rootEl);

    container.setAttribute('data-part', 'root');
    applyPart(container, 'root', props.class || '', props.pt, props.studioOverrides);
}
