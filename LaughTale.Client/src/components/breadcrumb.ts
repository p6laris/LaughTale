import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise Breadcrumb Component (LaughTale Aura Design System)
 * Semantic breadcrumb navigation with list hierarchy, custom separators, collapsible ellipsis,
 * custom item templates (icons, badges), route integration, and full WCAG / WAI-ARIA compliance.
 */

import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';

const BREADCRUMB_CSS = `
.p-breadcrumb-transparent {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
}
.p-breadcrumb,
p-breadcrumb,
island-breadcrumb {
    background: var(--p-breadcrumb-background, var(--p-content-bg, var(--p-surface-0, #ffffff)));
    border: 1px solid var(--p-breadcrumb-border-color, var(--p-border-color, #e2e8f0));
    border-radius: var(--p-breadcrumb-border-radius, var(--p-border-radius-md, 6px));
    padding: 0.75rem 1.25rem;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
}

.p-breadcrumb-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin: 0;
    padding: 0;
    list-style: none;
}

.p-breadcrumb-item {
    display: inline-flex;
    align-items: center;
}

.p-breadcrumb-item-link {
    color: var(--p-breadcrumb-item-color, var(--p-text-muted, #64748b));
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.25rem 0.4rem;
    border-radius: var(--p-border-radius, 4px);
    transition: color 0.15s ease, background-color 0.15s ease;
    cursor: pointer;
}

.p-breadcrumb-item-link:hover {
    color: var(--p-text-color, #1e293b);
    background: var(--p-surface-100, #f1f5f9);
}

.p-breadcrumb-item-current {
    color: var(--p-text-color, #1e293b);
    font-weight: 600;
    cursor: default;
}

.p-breadcrumb-item-current:hover {
    background: transparent;
}

.p-breadcrumb-separator {
    color: var(--p-text-muted, #94a3b8);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8125rem;
    user-select: none;
    padding: 0 0.15rem;
}

.p-breadcrumb-ellipsis {
    color: var(--p-text-muted, #64748b);
    font-weight: 700;
    letter-spacing: 1px;
    padding: 0.15rem 0.35rem;
    border-radius: 4px;
    cursor: pointer;
}

.p-breadcrumb-ellipsis:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #1e293b);
}

.p-breadcrumb-badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.15rem 0.45rem;
    border-radius: 9999px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
}

.p-breadcrumb-badge-primary {
    background: rgba(16, 185, 129, 0.12);
    color: var(--p-primary-color, #10b981);
}

.p-breadcrumb-badge-info {
    background: rgba(14, 165, 233, 0.12);
    color: var(--p-info-500, #0ea5e9);
}

.p-breadcrumb-badge-success {
    background: rgba(34, 197, 94, 0.12);
    color: var(--p-success-500, #22c55e);
}

/* Dark Mode Tokens */
html.dark .p-breadcrumb-transparent,
[data-theme="dark"] .p-breadcrumb-transparent,
.dark .p-breadcrumb-transparent {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
}

html.dark .p-breadcrumb,
[data-theme="dark"] .p-breadcrumb,
.dark .p-breadcrumb {
    background: var(--p-surface-0, #0f172a);
    border-color: var(--p-border-color, #334155);
}

html.dark .p-breadcrumb-item-link,
[data-theme="dark"] .p-breadcrumb-item-link,
.dark .p-breadcrumb-item-link {
    color: var(--p-text-muted, #94a3b8);
}

html.dark .p-breadcrumb-item-link:hover,
[data-theme="dark"] .p-breadcrumb-item-link:hover,
.dark .p-breadcrumb-item-link:hover {
    color: var(--p-text-color, #f8fafc);
    background: var(--p-surface-100, #1e293b);
}

html.dark .p-breadcrumb-item-current,
[data-theme="dark"] .p-breadcrumb-item-current,
.dark .p-breadcrumb-item-current {
    color: var(--p-text-color, #f8fafc);
}

html.dark .p-breadcrumb-separator,
[data-theme="dark"] .p-breadcrumb-separator,
.dark .p-breadcrumb-separator {
    color: var(--p-text-muted, #64748b);
}

html.dark .p-breadcrumb-ellipsis,
[data-theme="dark"] .p-breadcrumb-ellipsis,
.dark .p-breadcrumb-ellipsis {
    color: var(--p-text-muted, #94a3b8);
}

html.dark .p-breadcrumb-ellipsis:hover,
[data-theme="dark"] .p-breadcrumb-ellipsis:hover,
.dark .p-breadcrumb-ellipsis:hover {
    background: var(--p-surface-100, #1e293b);
    color: var(--p-text-color, #f8fafc);
}
`;

export interface BreadcrumbItem {
    label?: string;
    url?: string;
    icon?: string;
    isCurrent?: boolean;
    badge?: string;
    badgeSeverity?: 'primary' | 'info' | 'success';
    isEllipsis?: boolean;
    disabled?: boolean;
}

export interface BreadcrumbProps {
    items?: BreadcrumbItem[];
    model?: BreadcrumbItem[];
    home?: {
        icon?: string;
        url?: string;
        label?: string;
        pt?: PassthroughRecord;
        studioOverrides?: Record<string, any>;
    };
    homeUrl?: string;
    homeIcon?: string;
    homeLabel?: string;
    separator?: 'chevron' | 'slash' | 'arrow' | string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

export default function BreadcrumbIsland(container: HTMLElement, props: BreadcrumbProps, ctx?: IslandContext) {
    injectIslandStyle('breadcrumb', BREADCRUMB_CSS);
    container.setAttribute('data-part', 'root');

    const rawList = props.items || props.model || (props as any).Items || (props as any).Model || [];
    const items = Array.isArray(rawList) ? rawList : [];

    const homeUrl = props.home?.url || props.homeUrl || (props as any).HomeUrl || (props as any).home_url || container.getAttribute('home-url') || '/';
    const homeIcon = props.home?.icon || props.homeIcon || (props as any).HomeIcon || (props as any).home_icon || container.getAttribute('home-icon') || 'home';
    const homeLabel = props.home?.label || props.homeLabel || (props as any).HomeLabel || (props as any).home_label || container.getAttribute('home-label') || '';
    const separatorType = props.separator || (props as any).Separator || container.getAttribute('separator') || 'chevron';

    function getSeparatorHtml(): string {
        if (separatorType === 'slash') {
            return '<span class="p-breadcrumb-separator" data-part="root" aria-hidden="true">/</span>';
        }
        if (separatorType === 'arrow') {
            return '<span class="p-breadcrumb-separator" aria-hidden="true">&gt;</span>';
        }
        return `
            <span class="p-breadcrumb-separator" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </span>
        `;
    }

    function renderItemContent(item: BreadcrumbItem): string {
        let iconHtml = '';
        if (item.icon) {
            if (item.icon.startsWith('<svg')) {
                iconHtml = item.icon;
            } else if ((LucideIcons as any)[item.icon]) {
                iconHtml = (LucideIcons as any)[item.icon];
            } else {
                iconHtml = `<span class="${item.icon}"></span>`;
            }
        }

        const badgeHtml = item.badge 
            ? `<span class="p-breadcrumb-badge p-breadcrumb-badge-${item.badgeSeverity || 'primary'}">${item.badge}</span>` 
            : '';

        if (item.isEllipsis) {
            return `<span class="p-breadcrumb-ellipsis" title="Show hidden path">...</span>`;
        }

        return `
            ${iconHtml ? `<span style="display:inline-flex; align-items:center;">${iconHtml}</span>` : ''}
            ${item.label ? `<span>${item.label}</span>` : ''}
            ${badgeHtml}
        `;
    }

    const separatorHtml = getSeparatorHtml();

    const itemsHtml = items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const isCurrent = item.isCurrent || (item as any).IsCurrent || isLast;
        const label = (item as any).label || (item as any).Label || '';
        const url = (item as any).url || (item as any).Url;
        const icon = (item as any).icon || (item as any).Icon;
        const isEllipsis = (item as any).isEllipsis || (item as any).IsEllipsis;
        const badge = (item as any).badge || (item as any).Badge;
        const badgeSeverity = (item as any).badgeSeverity || (item as any).BadgeSeverity;

        const normalizedItem: BreadcrumbItem = {
            label,
            url,
            icon,
            isCurrent,
            isEllipsis,
            badge,
            badgeSeverity
        };

        const content = renderItemContent(normalizedItem);

        let inner = '';
        if (isCurrent && !isEllipsis) {
            inner = `<span class="p-breadcrumb-item-link p-breadcrumb-item-current" aria-current="page">${content}</span>`;
        } else if (url && !isEllipsis) {
            inner = `<a href="${url}" class="p-breadcrumb-item-link">${content}</a>`;
        } else {
            inner = `<span class="p-breadcrumb-item-link">${content}</span>`;
        }

        return `
            <li class="p-breadcrumb-separator-wrapper" style="display: inline-flex; align-items: center;">
                ${separatorHtml}
            </li>
            <li class="p-breadcrumb-item">
                ${inner}
            </li>
        `;
    }).join('');

    const homeSvg = LucideIcons[homeIcon] || LucideIcons.home || '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';

    container.innerHTML = `
        <nav class="p-breadcrumb p-component" aria-label="Breadcrumb">
            <ol class="p-breadcrumb-list">
                <li class="p-breadcrumb-item">
                    <a href="${homeUrl}" class="p-breadcrumb-item-link" title="Home" aria-label="Home">
                        ${homeSvg}
                        ${homeLabel ? `<span>${homeLabel}</span>` : ''}
                    </a>
                </li>
                ${itemsHtml}
            </ol>
        </nav>
    `;
}
