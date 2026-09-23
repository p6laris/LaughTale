import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { useFloatingPosition } from '../composables/useFloatingPosition';
﻿/**
 * LaughTale: Enterprise Menubar Component (LaughTale Aura Design System)
 * Horizontal navigation menubar with multi-level cascading dropdowns, responsive mobile drawer/button,
 * customizable start and end slots, badge/shortcut rendering, and full WAI-ARIA keyboard navigation.
 */

import { LucideIcons, getLucideIcon } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import { setRovingTabindex, handleRovingKeydown } from '../accessibility/aria';
import { useKeyboardNav } from '../composables/useKeyboardNav';
import { useLocale } from '../composables/useLocale';
import { useDisclosure } from '../composables/useDisclosure';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'menubar'
};

const MENUBAR_CSS = `
.p-menubar {
    display: flex;
    align-items: center;
    background: var(--p-menubar-background, var(--lt-surface-0));
    border: 1px solid var(--p-menubar-border-color, var(--lt-surface-200));
    border-radius: var(--p-menubar-border-radius, var(--lt-radius));
    padding: var(--p-menubar-padding, 0.5rem 0.75rem);
    gap: var(--p-menubar-gap, 0.5rem);
    color: var(--p-menubar-color, var(--lt-text-primary));
    box-sizing: border-box;
    font-family: inherit;
    position: relative;
    user-select: none;
}

.p-menubar-start {
    display: flex;
    align-items: center;
    margin-inline-end: 0.5rem;
    flex-shrink: 0;
}

.p-menubar-end {
    display: flex;
    align-items: center;
    margin-inline-start: auto;
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
    border-radius: var(--lt-radius);
    color: var(--lt-surface-600);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
    margin-inline-start: auto;
}

.p-menubar-button:hover {
    background: var(--lt-surface-100);
    color: var(--lt-text-primary);
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
    color: var(--p-menubar-item-color, var(--lt-text-primary));
    border-radius: var(--p-menubar-item-border-radius, var(--lt-radius));
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
    background: var(--p-menubar-item-focus-background, var(--lt-surface-100));
    color: var(--p-menubar-item-focus-color, var(--lt-text-primary));
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
    color: var(--lt-surface-500);
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
    color: var(--lt-surface-400);
    transition: transform 0.15s ease;
    flex-shrink: 0;
}

.p-menubar-item-shortcut {
    margin-inline-start: 1.5rem;
    font-size: 0.75rem;
    color: var(--lt-surface-500);
    background: var(--lt-surface-100);
    border: 1px solid var(--lt-surface-200);
    border-radius: 4px;
    padding: 0.1rem 0.35rem;
    font-weight: 500;
}

.p-menubar-item-badge {
    background: var(--lt-surface-950, var(--lt-surface-950));
    color: var(--lt-surface-0, var(--lt-surface-0));
    font-size: 0.75rem;
    font-weight: 700;
    min-width: 1.25rem;
    height: 1.25rem;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.35rem;
    margin-inline-start: 0.5rem;
}

/* Cascading Dropdown Submenu */
.p-menubar-submenu {
    display: none;
    position: absolute;
    top: 100%;
    inset-inline-start: 0;
    min-width: 12.5rem;
    background: var(--p-menubar-submenu-background, var(--lt-surface-0));
    border: 1px solid var(--p-menubar-submenu-border-color, var(--lt-surface-200));
    border-radius: var(--p-menubar-submenu-border-radius, var(--lt-radius));
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
    background: var(--lt-surface-200);
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
        background: var(--lt-surface-0);
        border: 1px solid var(--lt-surface-200);
        border-radius: var(--lt-radius);
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
        padding-inline-start: 1rem;
        margin: 0;
    }
    .p-menubar-submenu .p-menubar-item > .p-menubar-submenu {
        position: static;
        box-shadow: none;
        border: none;
        padding-inline-start: 1rem;
        margin: 0;
    }
}

/* Dark Mode */
html.dark .p-menubar,
[data-theme="dark"] .p-menubar,
.dark .p-menubar {
    background: var(--p-surface-0);
    color: var(--p-text-color);
    border-color: var(--p-border-color);
}

html.dark .p-menubar-button,
.dark .p-menubar-button {
    color: var(--p-text-muted);
}

html.dark .p-menubar-button:hover,
.dark .p-menubar-button:hover {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}

html.dark .p-menubar-item-link,
[data-theme="dark"] .p-menubar-item-link,
.dark .p-menubar-item-link {
    color: var(--p-text-color);
}

html.dark .p-menubar-item-link:hover,
html.dark .p-menubar-item.p-active > .p-menubar-item-content > .p-menubar-item-link,
[data-theme="dark"] .p-menubar-item-link:hover,
[data-theme="dark"] .p-menubar-item.p-active > .p-menubar-item-content > .p-menubar-item-link,
.dark .p-menubar-item-link:hover,
.dark .p-menubar-item.p-active > .p-menubar-item-content > .p-menubar-item-link {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}

html.dark .p-menubar-submenu,
[data-theme="dark"] .p-menubar-submenu,
.dark .p-menubar-submenu {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
}

html.dark .p-menubar-separator,
[data-theme="dark"] .p-menubar-separator,
.dark .p-menubar-separator {
    background: var(--p-border-color);
}

html.dark .p-menubar-item-shortcut,
[data-theme="dark"] .p-menubar-item-shortcut,
.dark .p-menubar-item-shortcut {
    background: var(--p-surface-100);
    border-color: var(--p-border-color);
    color: var(--p-text-muted);
}

html.dark .p-menubar-item-badge,
[data-theme="dark"] .p-menubar-item-badge,
.dark .p-menubar-item-badge {
    background: var(--p-surface-100);
    color: var(--p-text-color);
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
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

export default function MenubarIsland(container: HTMLElement, props: MenubarProps, ctx?: IslandContext) {
    injectIslandStyle('menubar', MENUBAR_CSS);
    const locale = useLocale(ctx);

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

    // ROADMAP.v5.md Part M "Adopt - State machine": the mobile hamburger drawer's `isMobileMenuOpen`
    // was a raw boolean, written at 2 separate sites (the toggle button, the outside-click handler) -
    // and the Escape handler, a THIRD site that closes cascading submenus, never touched it at all. A
    // real, findable gap: pressing Escape with the mobile drawer open closed any open submenu inside
    // it but left the drawer itself open. Centralizing behind `useDisclosure` fixes that - see the
    // Escape branch in `wireEvents` below.
    let rootListEl: HTMLElement | null = null;
    const mobileMenuDisclosure = useDisclosure({
        onOpen: () => rootListEl?.classList.add('p-mobile-open'),
        onClose: () => rootListEl?.classList.remove('p-mobile-open')
    });

    function getIconSvg(iconName?: string): string {
        if (!iconName) return '';
        if (iconName.startsWith('<svg')) return iconName;
        if ((LucideIcons as any)[iconName]) return (LucideIcons as any)[iconName];
        return '';
    }

    function renderItem(item: MenubarItem, path: string, isRoot: boolean): Raw {
        if (item.separator) {
            return html`<li class="p-menubar-separator" data-part="root" role="separator"></li>`;
        }

        const hasSubmenu = Array.isArray(item.items) && item.items.length > 0;
        const iconSvg = item.icon ? getIconSvg(item.icon) : '';
        const iconHtml = iconSvg ? html`<span class="p-menubar-item-icon">${unsafe(iconSvg)}</span>` : '';

        const angleDownSvg = unsafe(getLucideIcon('chevron-down', 13, 2.2).replace('"p-icon p-icon-chevron-down"', '"p-icon p-icon-chevron-down p-menubar-submenu-icon"'));
        const angleRightSvg = unsafe(getLucideIcon('chevron-right', 13, 2.2).replace('"p-icon p-icon-chevron-right"', '"p-icon p-icon-chevron-right p-menubar-submenu-icon" style="margin-inline-start: auto;"'));

        const submenuIndicator = hasSubmenu ? (isRoot ? angleDownSvg : angleRightSvg) : '';

        let subHtml: Raw | '' = '';
        if (hasSubmenu) {
            const childrenHtml = item.items!.map((sub, i) => renderItem(sub, `${path}.${i}`, false));
            subHtml = html`<ul class="p-menubar-submenu" role="menu">${childrenHtml}</ul>`;
        }

        return html`
            <li class="p-menubar-item ${item.disabled ? 'p-disabled' : ''}" role="none" data-path="${path}">
                <div class="p-menubar-item-content">
                    <a class="p-menubar-item-link" role="menuitem" tabindex="-1" href="${safeUrl(item.url || item.route || '#')}" ${attr('target', item.target)}>
                        ${iconHtml}
                        <span class="p-menubar-item-label">${item.label}</span>
                        ${item.badge !== undefined ? html`<span class="p-menubar-item-badge">${item.badge}</span>` : ''}
                        ${item.shortcut ? html`<span class="p-menubar-item-shortcut">${item.shortcut}</span>` : ''}
                        ${submenuIndicator}
                    </a>
                </div>
                ${subHtml}
            </li>
        `;
    }

    function renderMenubarHtml(): Raw {
        const rootItemsHtml = itemsState.map((it, i) => renderItem(it, `${i}`, true));

        let startHtml: Raw | '' = '';
        if (customTemplate) {
            startHtml = html`
                <div class="p-menubar-start">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: var(--lt-primary-500); border-radius: 6px; color: var(--lt-surface-0, var(--lt-surface-0)); margin-inline-end: 0.5rem;">
                        ${unsafe(getLucideIcon('layers', 16, 2.5))}
                    </span>
                    <span style="font-weight: 700; font-size: 0.9375rem;">PRIME<span style="color: var(--lt-primary-500);">APP</span></span>
                </div>
            `;
        }

        let endHtml: Raw | '' = '';
        if (customTemplate) {
            endHtml = html`
                <div class="p-menubar-end">
                    <div style="position: relative; display: flex; align-items: center;">
                        <input type="text" placeholder="Search" style="padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid var(--lt-surface-200); font-size: 0.8125rem; width: 9rem; outline: none; background: transparent; color: inherit;" />
                    </div>
                    <span style="width: 2rem; height: 2rem; border-radius: 9999px; background: linear-gradient(135deg, var(--lt-warn-500, var(--lt-warn-500)), var(--lt-danger-500, var(--lt-danger-500))); color: var(--lt-surface-0, var(--lt-surface-0)); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">AE</span>
                </div>
            `;
        }

        const hamburgerSvg = unsafe(getLucideIcon('menu', 18, 2));

        const customClass = props.class || (props as any).Class || '';
        const customStyle = props.style || (props as any).Style || '';

        return html`
            <div class="p-menubar p-component ${customClass}" style="${customStyle}" role="menubar" tabindex="0">
                ${startHtml}
                <button type="button" class="p-menubar-button" aria-label="Toggle navigation">
                    ${hamburgerSvg}
                </button>
                <ul class="p-menubar-root-list" role="menubar">
                    ${rootItemsHtml}
                </ul>
                ${endHtml}
            </div>
        `;
    }

    function wireEvents(menubarEl: HTMLElement) {
        const button = menubarEl.querySelector<HTMLButtonElement>('.p-menubar-button');
        const rootList = menubarEl.querySelector<HTMLElement>('.p-menubar-root-list');
        rootListEl = rootList;

        if (button && rootList) {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileMenuDisclosure.toggle();
            }, { signal: ctx?.signal });
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
                        const subFloatingCtrl = useFloatingPosition(li, submenu, {
                            placement: 'right-start',
                            offset: 0,
                            strategy: 'absolute',
                            boundary: (container.offsetParent as HTMLElement) || undefined,
                            axis: 'x',
                            reposition: 'none',
                            isRtl: locale.isRtl
                        });
                        const coords = subFloatingCtrl.computePosition();
                        if (coords.actualPlacement.startsWith('left')) {
                            submenu.classList.add('p-submenu-flip');
                        } else {
                            submenu.classList.remove('p-submenu-flip');
                        }
                        submenu.style.left = '';
                    }
                }
            }, { signal: ctx?.signal });

            li.addEventListener('mouseleave', () => {
                if (window.innerWidth > 960) {
                    if (submenu) {
                        li.classList.remove('p-active');
                        submenu.classList.remove('p-submenu-flip');
                    }
                }
            }, { signal: ctx?.signal });

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
                        showFeedback(locale.t('emptyFilterMessage') || 'No results found', 'warn');
                    } else if (item.command === 'download-cloud') {
                        showFeedback('Downloaded from cloud', 'info');
                    } else if (item.command === 'share-cloud') {
                        showFeedback('Exported to cloud', 'info');
                    }
                }

                closeAllSubmenus();
            }, { signal: ctx?.signal });
        });

        // Click outside closes submenus
        document.addEventListener('click', (e) => {
            if (!menubarEl.contains(e.target as Node)) {
                closeAllSubmenus();
                mobileMenuDisclosure.close();
            }
        }, { signal: ctx?.signal });

        const topLinks = Array.from(rootList?.querySelectorAll<HTMLElement>(':scope > .p-menubar-item > .p-menubar-item-link') || []);
        if (topLinks.length > 0) {
            setRovingTabindex(topLinks, 0);
        }

        const nav = useKeyboardNav({
            itemCount: () => topLinks.length,
            initialIndex: 0,
            orientation: 'horizontal',
            onHighlight: (index) => {
                setRovingTabindex(topLinks, index);
                topLinks[index]?.focus();
            },
            onEscape: closeAllSubmenus
        });

        // Keyboard navigation
        menubarEl.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllSubmenus();
                mobileMenuDisclosure.close();
                return;
            }
            if (nav.handleKeyDown(e)) return;
            const idx = Math.max(0, topLinks.indexOf(document.activeElement as HTMLElement));
            handleRovingKeydown(e, topLinks, idx, 'horizontal');
        }, { signal: ctx?.signal });
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
            success: 'var(--lt-primary-500, var(--lt-primary-500))',
            error: 'var(--lt-danger-500, var(--lt-danger-500))',
            warn: 'var(--lt-warn-500, var(--lt-warn-500))',
            info: 'var(--lt-info-500, var(--lt-info-500))'
        };

        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: ${bgColors[severity] || 'var(--lt-info-500, var(--lt-info-500))'};
            color: var(--lt-surface-0, var(--lt-surface-0));
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
        const tToast = setTimeout(() => toast.remove(), 2500);
        ctx?.onCleanup?.(() => clearTimeout(tToast));
    }

    setHtml(container, renderMenubarHtml());
    const menubarEl = container.querySelector<HTMLElement>('.p-menubar')!;
    wireEvents(menubarEl);
}
