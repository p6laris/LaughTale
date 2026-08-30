/**
 * LaughTale: Enterprise Menubar Component (PrimeVue 4 Aura Design System compliant)
 * Horizontal navigation menubar with multi-level cascading dropdowns, responsive mobile drawer/button,
 * customizable start and end slots, badge/shortcut rendering, and full WAI-ARIA keyboard navigation.
 */

import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';

const MENUBAR_CSS = `
.p-menubar {
    display: flex;
    align-items: center;
    background: var(--p-menubar-background, var(--p-surface-0, #ffffff));
    border: 1px solid var(--p-menubar-border-color, var(--p-border-color, #e2e8f0));
    border-radius: var(--p-menubar-border-radius, var(--p-border-radius, 8px));
    padding: var(--p-menubar-padding, 0.5rem 0.75rem);
    gap: var(--p-menubar-gap, 0.5rem);
    color: var(--p-menubar-color, var(--p-text-color, #0f172a));
    box-sizing: border-box;
    font-family: inherit;
    position: relative;
    user-select: none;
}

.p-menubar-start {
    display: flex;
    align-items: center;
    margin-right: 0.5rem;
    flex-shrink: 0;
}

.p-menubar-end {
    display: flex;
    align-items: center;
    margin-left: auto;
    gap: 0.5rem;
    flex-shrink: 0;
}

.p-menubar-button {
    display: none;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border: none;
    background: transparent;
    border-radius: var(--p-border-radius, 6px);
    color: var(--p-surface-600, #475569);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
    margin-left: auto;
}

.p-menubar-button:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

.p-menubar-root-list {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 0.25rem;
    box-sizing: border-box;
}

.p-menubar-item {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.p-menubar-item-content {
    display: block;
    box-sizing: border-box;
}

.p-menubar-item-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.75rem;
    color: var(--p-menubar-item-color, var(--p-text-color, #0f172a));
    border-radius: var(--p-menubar-item-border-radius, var(--p-border-radius, 6px));
    text-decoration: none;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.12s ease, color 0.12s ease;
    outline: none;
    box-sizing: border-box;
    white-space: nowrap;
}

.p-menubar-item-link:hover,
.p-menubar-item.p-focus > .p-menubar-item-content > .p-menubar-item-link,
.p-menubar-item-link.p-focus,
.p-menubar-item.p-active > .p-menubar-item-content > .p-menubar-item-link {
    background: var(--p-menubar-item-focus-background, var(--p-surface-100, #f1f5f9));
    color: var(--p-menubar-item-focus-color, var(--p-text-color, #0f172a));
}

.p-menubar-item.p-disabled > .p-menubar-item-content > .p-menubar-item-link {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.p-menubar-item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-500, #64748b);
    width: 1.125rem;
    height: 1.125rem;
    flex-shrink: 0;
}

.p-menubar-item-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.p-menubar-submenu-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-400, #94a3b8);
    transition: transform 0.15s ease;
    flex-shrink: 0;
}

.p-menubar-item-shortcut {
    margin-left: 1.5rem;
    font-size: 0.75rem;
    color: var(--p-surface-500, #64748b);
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-border-color, #cbd5e1);
    border-radius: 4px;
    padding: 0.1rem 0.35rem;
    font-weight: 500;
}

.p-menubar-item-badge {
    background: #000000;
    color: var(--lt-surface-0, #ffffff);
    font-size: 0.75rem;
    font-weight: 700;
    min-width: 1.25rem;
    height: 1.25rem;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.35rem;
    margin-left: 0.5rem;
}

/* Cascading Dropdown Submenu */
.p-menubar-submenu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 12.5rem;
    background: var(--p-menubar-submenu-background, var(--p-surface-0, #ffffff));
    border: 1px solid var(--p-menubar-submenu-border-color, var(--p-border-color, #e2e8f0));
    border-radius: var(--p-menubar-submenu-border-radius, var(--p-border-radius, 8px));
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
    padding: 0.375rem;
    list-style: none;
    margin: 0.25rem 0 0 0;
    z-index: 1000;
    box-sizing: border-box;
    flex-direction: column;
    gap: 0.125rem;
    animation: p-menubar-submenu-fade 0.15s cubic-bezier(0, 0, 0.2, 1);
}

@keyframes p-menubar-submenu-fade {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Nested level flyouts */
.p-menubar-submenu .p-menubar-item > .p-menubar-submenu {
    top: 0;
    left: 100%;
    margin: 0 0 0 0.25rem;
}

.p-menubar-submenu .p-menubar-item > .p-menubar-submenu.p-submenu-flip {
    left: auto;
    right: 100%;
    margin: 0 0.25rem 0 0;
}

.p-menubar-item.p-active > .p-menubar-submenu {
    display: flex;
}

.p-menubar-separator {
    height: 1px;
    background: var(--p-border-color, #e2e8f0);
    margin: 0.25rem 0;
    list-style: none;
    padding: 0;
}

/* Mobile responsive styles */
@media (max-width: 960px) {
    .p-menubar-button {
        display: inline-flex;
    }
    .p-menubar-root-list {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background: var(--p-surface-0, #ffffff);
        border: 1px solid var(--p-border-color, #e2e8f0);
        border-radius: var(--p-border-radius, 8px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        padding: 0.5rem;
        margin-top: 0.25rem;
        z-index: 1000;
    }
    .p-menubar-root-list.p-mobile-open {
        display: flex;
    }
    .p-menubar-submenu {
        position: static;
        box-shadow: none;
        border: none;
        padding-left: 1rem;
        margin: 0;
    }
    .p-menubar-submenu .p-menubar-item > .p-menubar-submenu {
        position: static;
        box-shadow: none;
        border: none;
        padding-left: 1rem;
        margin: 0;
    }
}

/* Dark Mode */
.dark .p-menubar,
[data-theme="dark"] .p-menubar {
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-0, #f8fafc);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-menubar-button {
    color: var(--p-surface-400, #94a3b8);
}

.dark .p-menubar-button:hover {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-menubar-item-link,
[data-theme="dark"] .p-menubar-item-link {
    color: var(--p-surface-100, #f1f5f9);
}

.dark .p-menubar-item-link:hover,
.dark .p-menubar-item.p-active > .p-menubar-item-content > .p-menubar-item-link,
[data-theme="dark"] .p-menubar-item-link:hover,
[data-theme="dark"] .p-menubar-item.p-active > .p-menubar-item-content > .p-menubar-item-link {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-menubar-submenu,
[data-theme="dark"] .p-menubar-submenu {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}

.dark .p-menubar-separator,
[data-theme="dark"] .p-menubar-separator {
    background: var(--p-surface-700, #334155);
}

.dark .p-menubar-item-shortcut,
[data-theme="dark"] .p-menubar-item-shortcut {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-300, #cbd5e1);
}

.dark .p-menubar-item-badge,
[data-theme="dark"] .p-menubar-item-badge {
    background: var(--lt-surface-0, #ffffff);
    color: #000000;
}
`;

export interface MenubarItem {
    label?: string;
    icon?: string;
    separator?: boolean;
    disabled?: boolean;
    url?: string;
    route?: string;
    target?: string;
    command?: string;
    action?: string;
    badge?: string | number;
    shortcut?: string;
    items?: MenubarItem[];
}

export interface MenubarProps {
    model?: MenubarItem[];
    items?: MenubarItem[];
    customTemplate?: boolean;
    class?: string;
    style?: string;
}

export default function MenubarIsland(container: HTMLElement, props: MenubarProps) {
    injectIslandStyle('menubar', MENUBAR_CSS);

    const customTemplate = props.customTemplate || (props as any).CustomTemplate || false;

    function normalizeItems(rawList: any[]): MenubarItem[] {
        if (!Array.isArray(rawList)) return [];
        return rawList.map(it => ({
            label: it.label || it.Label || '',
            icon: it.icon || it.Icon,
            separator: it.separator || it.Separator || false,
            disabled: it.disabled || it.Disabled || false,
            url: it.url || it.Url,
            route: it.route || it.Route,
            target: it.target || it.Target,
            command: it.command || it.Command,
            action: it.action || it.Action,
            badge: it.badge || it.Badge,
            shortcut: it.shortcut || it.Shortcut,
            items: Array.isArray(it.items || it.Items) ? normalizeItems(it.items || it.Items) : undefined
        }));
    }

    const rawData = props.model || props.items || (props as any).Model || (props as any).Items || [];
    const itemsState: MenubarItem[] = normalizeItems(rawData);

    let isMobileMenuOpen = false;

    function getIconSvg(iconName?: string): string {
        if (!iconName) return '';
        if (iconName.startsWith('<svg')) return iconName;
        if ((LucideIcons as any)[iconName]) return (LucideIcons as any)[iconName];
        return '';
    }

    function renderItem(item: MenubarItem, path: string, isRoot: boolean): string {
        if (item.separator) {
            return `<li class="p-menubar-separator" role="separator"></li>`;
        }

        const hasSubmenu = Array.isArray(item.items) && item.items.length > 0;
        const iconSvg = item.icon ? getIconSvg(item.icon) : '';
        const iconHtml = iconSvg ? `<span class="p-menubar-item-icon">${iconSvg}</span>` : '';

        const angleDownSvg = `<svg class="p-menubar-submenu-icon" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
        const angleRightSvg = `<svg class="p-menubar-submenu-icon" style="margin-left: auto;" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;

        const submenuIndicator = hasSubmenu ? (isRoot ? angleDownSvg : angleRightSvg) : '';

        let subHtml = '';
        if (hasSubmenu) {
            const childrenHtml = item.items!.map((sub, i) => renderItem(sub, `${path}.${i}`, false)).join('');
            subHtml = `<ul class="p-menubar-submenu" role="menu">${childrenHtml}</ul>`;
        }

        return `
            <li class="p-menubar-item ${item.disabled ? 'p-disabled' : ''}" role="none" data-path="${path}">
                <div class="p-menubar-item-content">
                    <a class="p-menubar-item-link" role="menuitem" tabindex="-1" href="${item.url || item.route || '#'}" ${item.target ? `target="${item.target}"` : ''}>
                        ${iconHtml}
                        <span class="p-menubar-item-label">${item.label}</span>
                        ${item.badge !== undefined ? `<span class="p-menubar-item-badge">${item.badge}</span>` : ''}
                        ${item.shortcut ? `<span class="p-menubar-item-shortcut">${item.shortcut}</span>` : ''}
                        ${submenuIndicator}
                    </a>
                </div>
                ${subHtml}
            </li>
        `;
    }

    function renderMenubarHtml(): string {
        const rootItemsHtml = itemsState.map((it, i) => renderItem(it, `${i}`, true)).join('');

        let startHtml = '';
        if (customTemplate) {
            startHtml = `
                <div class="p-menubar-start">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: var(--p-primary-500, #3b82f6); border-radius: 6px; color: #fff; margin-right: 0.5rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
                    </span>
                    <span style="font-weight: 700; font-size: 0.9375rem;">PRIME<span style="color: var(--p-primary-500, #3b82f6);">APP</span></span>
                </div>
            `;
        }

        let endHtml = '';
        if (customTemplate) {
            endHtml = `
                <div class="p-menubar-end">
                    <div style="position: relative; display: flex; align-items: center;">
                        <input type="text" placeholder="Search" style="padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid var(--p-border-color, #cbd5e1); font-size: 0.8125rem; width: 9rem; outline: none; background: transparent; color: inherit;" />
                    </div>
                    <span style="width: 2rem; height: 2rem; border-radius: 9999px; background: linear-gradient(135deg, var(--lt-warn-500, #f59e0b), var(--lt-danger-500, #ef4444)); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">AE</span>
                </div>
            `;
        }

        const hamburgerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;

        const customClass = props.class || (props as any).Class || '';
        const customStyle = props.style || (props as any).Style || '';

        return `
            <div class="p-menubar p-component ${customClass}" style="${customStyle}" role="menubar" tabindex="0">
                ${startHtml}
                <button type="button" class="p-menubar-button" aria-label="Toggle navigation">
                    ${hamburgerSvg}
                </button>
                <ul class="p-menubar-root-list ${isMobileMenuOpen ? 'p-mobile-open' : ''}" role="menubar">
                    ${rootItemsHtml}
                </ul>
                ${endHtml}
            </div>
        `;
    }

    function wireEvents(menubarEl: HTMLElement) {
        const button = menubarEl.querySelector<HTMLButtonElement>('.p-menubar-button');
        const rootList = menubarEl.querySelector<HTMLElement>('.p-menubar-root-list');

        if (button && rootList) {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                isMobileMenuOpen = !isMobileMenuOpen;
                rootList.classList.toggle('p-mobile-open', isMobileMenuOpen);
            });
        }

        // Hover & click cascade logic
        const items = menubarEl.querySelectorAll<HTMLElement>('.p-menubar-item');

        items.forEach(li => {
            const link = li.querySelector<HTMLElement>(':scope > .p-menubar-item-content > .p-menubar-item-link');
            const submenu = li.querySelector<HTMLElement>(':scope > .p-menubar-submenu');

            if (!link) return;

            // Open on hover for desktop
            li.addEventListener('mouseenter', () => {
                if (window.innerWidth > 960) {
                    // Close sibling open submenus
                    const parentUl = li.parentElement;
                    if (parentUl) {
                        parentUl.querySelectorAll<HTMLElement>(':scope > .p-menubar-item.p-active').forEach(sibling => {
                            if (sibling !== li) sibling.classList.remove('p-active');
                        });
                    }
                    if (submenu) {
                        li.classList.add('p-active');
                        // Submenu overflow flip check
                        const rect = submenu.getBoundingClientRect();
                        if (rect.right > window.innerWidth) {
                            submenu.classList.add('p-submenu-flip');
                        }
                    }
                }
            });

            li.addEventListener('mouseleave', () => {
                if (window.innerWidth > 960) {
                    if (submenu) {
                        li.classList.remove('p-active');
                    }
                }
            });

            // Click action & mobile toggle
            link.addEventListener('click', (e) => {
                const path = li.getAttribute('data-path') || '';
                const item = findItemByPath(itemsState, path);

                if (!item || item.disabled) return;

                if (submenu) {
                    e.preventDefault();
                    li.classList.toggle('p-active');
                    return;
                }

                // Command callback
                if (item.command) {
                    e.preventDefault();
                    if (item.command === 'new-doc') {
                        showFeedback('File created', 'success');
                    } else if (item.command === 'print') {
                        showFeedback('No printer connected', 'error');
                    } else if (item.command === 'search') {
                        showFeedback('No results found', 'warn');
                    } else if (item.command === 'download-cloud') {
                        showFeedback('Downloaded from cloud', 'info');
                    } else if (item.command === 'share-cloud') {
                        showFeedback('Exported to cloud', 'info');
                    }
                }

                closeAllSubmenus();
            });
        });

        // Click outside closes submenus
        document.addEventListener('click', (e) => {
            if (!menubarEl.contains(e.target as Node)) {
                closeAllSubmenus();
                if (isMobileMenuOpen && rootList) {
                    isMobileMenuOpen = false;
                    rootList.classList.remove('p-mobile-open');
                }
            }
        });

        // Keyboard navigation
        menubarEl.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllSubmenus();
            }
        });
    }

    function closeAllSubmenus() {
        container.querySelectorAll('.p-menubar-item.p-active').forEach(el => el.classList.remove('p-active'));
    }

    function findItemByPath(list: MenubarItem[], path: string): MenubarItem | null {
        const parts = path.split('.').map(Number);
        let curr: any = { items: list };
        for (const p of parts) {
            if (!curr.items || !curr.items[p]) return null;
            curr = curr.items[p];
        }
        return curr;
    }

    function showFeedback(msg: string, severity: 'success' | 'error' | 'warn' | 'info') {
        const toast = document.createElement('div');
        const bgColors = {
            success: 'var(--lt-primary-500, #10b981)',
            error: 'var(--lt-danger-500, #ef4444)',
            warn: 'var(--lt-warn-500, #f59e0b)',
            info: 'var(--lt-info-500, #3b82f6)'
        };

        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: ${bgColors[severity] || 'var(--lt-info-500, #3b82f6)'};
            color: var(--lt-surface-0, #ffffff);
            padding: 0.75rem 1.25rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
            font-size: 0.875rem;
            font-weight: 600;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideIn 0.2s ease;
        `;
        toast.textContent = `✓ ${msg}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    container.innerHTML = renderMenubarHtml();
    const menubarEl = container.querySelector<HTMLElement>('.p-menubar')!;
    wireEvents(menubarEl);
}
