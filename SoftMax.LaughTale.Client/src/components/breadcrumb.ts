/**
 * SoftMax.LaughTale: Enterprise Breadcrumb Component (Aura Breadcrumb inspired)
 */

import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';

export interface BreadcrumbItem {
    label: string;
    url?: string;
    icon?: string;
}

export interface BreadcrumbProps {
    items: BreadcrumbItem[];
    homeUrl?: string;
}


const CSS = `
[data-theme="dark"] .laughtale-breadcrumb {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;

export default function BreadcrumbIsland(container: HTMLElement, props: BreadcrumbProps) {
    injectIslandStyle('breadcrumb', CSS);
    const items = props.items || [];
    const homeUrl = props.homeUrl || '/';

    const itemsHtml = items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return `
            <li style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: var(--p-surface-400); display: flex; align-items: center;">${LucideIcons.chevronRight}</span>
                ${item.url && !isLast ? `
                    <a href="${item.url}" style="color: var(--p-surface-600); text-decoration: none; font-size: 0.8125rem; font-weight: 500; display: flex; align-items: center; gap: 0.35rem; transition: color 0.15s ease;">
                        ${item.icon ? `<span>${item.icon}</span>` : ''}
                        <span>${item.label}</span>
                    </a>
                ` : `
                    <span style="color: var(--p-surface-900); font-size: 0.8125rem; font-weight: 600; display: flex; align-items: center; gap: 0.35rem;">
                        ${item.icon ? `<span>${item.icon}</span>` : ''}
                        <span>${item.label}</span>
                    </span>
                `}
            </li>
        `;
    }).join('');

    container.innerHTML = `
        <nav class="laughtale-breadcrumb" style="display: block;">
            <ul style="list-style: none; display: flex; align-items: center; gap: 0.5rem; padding: 0; margin: 0;">
                <li>
                    <a href="${homeUrl}" style="color: var(--p-surface-600); display: flex; align-items: center; transition: color 0.15s ease;" title="Home">
                        ${LucideIcons.home}
                    </a>
                </li>
                ${itemsHtml}
            </ul>
        </nav>
    `;
}
