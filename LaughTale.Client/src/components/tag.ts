import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿import { injectIslandStyle } from '../runtime/styles';
/**
 * LaughTale: Enterprise Status Tag & Badge Component (Aura Tag inspired)
 */

export interface TagProps {
    value: string;
    severity?: 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast';
    rounded?: boolean;
    icon?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}


const CSS = `
html.dark .laughtale-tag.tag-info,
[data-theme="dark"] .laughtale-tag.tag-info,
.dark .laughtale-tag.tag-info {
    background: rgba(59, 130, 246, 0.16) !important;
    color: #93c5fd !important;
    border-color: rgba(59, 130, 246, 0.3) !important;
}
html.dark .laughtale-tag.tag-success,
[data-theme="dark"] .laughtale-tag.tag-success,
.dark .laughtale-tag.tag-success {
    background: rgba(16, 185, 129, 0.16) !important;
    color: #6ee7b7 !important;
    border-color: rgba(16, 185, 129, 0.3) !important;
}
html.dark .laughtale-tag.tag-warning,
[data-theme="dark"] .laughtale-tag.tag-warning,
.dark .laughtale-tag.tag-warning {
    background: rgba(245, 158, 11, 0.16) !important;
    color: #fcd34d !important;
    border-color: rgba(245, 158, 11, 0.3) !important;
}
html.dark .laughtale-tag.tag-danger,
[data-theme="dark"] .laughtale-tag.tag-danger,
.dark .laughtale-tag.tag-danger {
    background: rgba(239, 68, 68, 0.16) !important;
    color: #fca5a5 !important;
    border-color: rgba(239, 68, 68, 0.3) !important;
}
html.dark .laughtale-tag.tag-secondary,
[data-theme="dark"] .laughtale-tag.tag-secondary,
.dark .laughtale-tag.tag-secondary {
    background: var(--p-surface-100, #1e293b) !important;
    color: var(--p-text-color, #f8fafc) !important;
    border-color: var(--p-border-color, #334155) !important;
}
html.dark .laughtale-tag.tag-contrast,
[data-theme="dark"] .laughtale-tag.tag-contrast,
.dark .laughtale-tag.tag-contrast {
    background: var(--p-surface-0, #090d16) !important;
    color: var(--p-text-color, #f8fafc) !important;
    border-color: var(--p-border-color, #334155) !important;
}
`;

export default function TagIsland(container: HTMLElement, props: TagProps, ctx?: IslandContext) {
    injectIslandStyle('tag', CSS);
    const severity = props.severity || 'info';
    const isRounded = props.rounded || false;

    let bg = 'var(--p-blue-50, var(--lt-info-50))';
    let color = 'var(--p-blue-700, var(--lt-info-700))';
    let border = 'var(--p-blue-200, var(--lt-info-200))';

    if (severity === 'success') {
        bg = 'var(--p-emerald-50, var(--lt-primary-50))';
        color = 'var(--p-emerald-700, var(--lt-primary-700))';
        border = 'var(--p-emerald-200, var(--lt-primary-200))';
    } else if (severity === 'warning') {
        bg = 'var(--p-amber-50, var(--lt-warn-50))';
        color = 'var(--p-amber-700, var(--lt-warn-700))';
        border = 'var(--p-amber-200, var(--lt-warn-200))';
    } else if (severity === 'danger') {
        bg = 'var(--p-red-50, var(--lt-danger-50))';
        color = 'var(--p-red-700, var(--lt-danger-700))';
        border = 'var(--p-red-200, var(--lt-danger-200))';
    } else if (severity === 'secondary') {
        bg = 'var(--lt-surface-100)';
        color = 'var(--lt-surface-700)';
        border = 'var(--lt-surface-200)';
    } else if (severity === 'contrast') {
        bg = 'var(--lt-surface-900)';
        color = 'var(--lt-surface-0)';
        border = 'var(--lt-surface-950)';
    }

    container.innerHTML = `
        <span class="laughtale-tag tag-${severity}" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.6rem; font-size: 0.75rem; font-weight: 700; background: ${bg}; color: ${color}; border: 1px solid ${border}; border-radius: ${isRounded ? '9999px' : 'var(--lt-radius)'};">
            ${props.icon ? `<span>${props.icon}</span>` : ''}
            <span>${props.value}</span>
        </span>
    `;
}
