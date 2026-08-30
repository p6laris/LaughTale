/**
 * LaughTale: Enterprise ContextMenu Component (PrimeVue 4 Aura Design System)
 * Native right-click context menu overlay with multi-level recursive submenus,
 * smart viewport collision bounding, keyboard accessibility (WAI-ARIA menubar),
 * custom templates with shortcuts & badges, command callbacks, and toast integrations.
 */

import { MenuItem } from '../types/models';
import { LucideIcons, getLucideIcon } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';

export interface ContextMenuItem extends MenuItem {
    shortcut?: string;
    badge?: string | number;
    badgeSeverity?: string;
    class?: string;
    route?: string;
    command?: (event?: any) => void;
    items?: ContextMenuItem[];
}

export interface ContextMenuProps {
    model?: ContextMenuItem[];
    items?: ContextMenuItem[];
    targetSelector?: string;
    target?: string;
    global?: boolean;
    breakpoint?: string;
    autoZIndex?: boolean;
    baseZIndex?: number;
    demoType?: 'basic' | 'submenus' | 'global' | 'template' | 'command' | 'router';
    class?: string;
    style?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
}

const CONTEXTMENU_CSS = `
/* ==========================================================================
   PrimeVue 4 Aura ContextMenu Component Tokens & Styles
   ========================================================================== */
.p-contextmenu {
    position: fixed;
    z-index: var(--p-contextmenu-z-index, 1200);
    min-width: 14rem;
    background: var(--p-contextmenu-background, var(--p-surface-0, #ffffff));
    color: var(--p-contextmenu-color, var(--p-surface-700, #334155));
    border: 1px solid var(--p-contextmenu-border-color, var(--p-surface-200, #e2e8f0));
    border-radius: var(--p-contextmenu-border-radius, var(--p-border-radius, 8px));
    box-shadow: var(--p-contextmenu-shadow, 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1));
    padding: var(--p-contextmenu-list-padding, 0.25rem);
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    display: none;
    opacity: 0;
    transform: scale(0.96);
    transform-origin: top left;
    transition: opacity 120ms cubic-bezier(0, 0, 0.2, 1), transform 120ms cubic-bezier(0, 0, 0.2, 1);
}

.p-contextmenu.p-contextmenu-active {
    display: block;
    opacity: 1;
    transform: scale(1);
}

.p-contextmenu-root-list,
.p-contextmenu-submenu {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--p-contextmenu-list-gap, 2px);
}

.p-contextmenu-item {
    position: relative;
    box-sizing: border-box;
}

.p-contextmenu-item-content {
    display: flex;
    align-items: center;
    gap: var(--p-contextmenu-item-gap, 0.5rem);
    padding: var(--p-contextmenu-item-padding, 0.5rem 0.75rem);
    color: var(--p-contextmenu-item-color, var(--p-surface-700, #334155));
    border-radius: var(--p-contextmenu-item-border-radius, 6px);
    text-decoration: none;
    cursor: pointer;
    user-select: none;
    font-size: var(--p-contextmenu-item-label-font-size, 0.875rem);
    font-weight: var(--p-contextmenu-item-label-font-weight, 500);
    transition: background-color 140ms ease, color 140ms ease;
    outline: none;
}

.p-contextmenu-item-content:hover,
.p-contextmenu-item-content:focus-visible,
.p-contextmenu-item.p-contextmenu-item-active > .p-contextmenu-item-content {
    background: var(--p-contextmenu-item-focus-background, var(--p-surface-100, #f1f5f9));
    color: var(--p-contextmenu-item-focus-color, var(--p-surface-900, #0f172a));
}

.p-contextmenu-item.p-disabled > .p-contextmenu-item-content {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.p-contextmenu-item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-contextmenu-item-icon-color, var(--p-surface-500, #64748b));
    flex-shrink: 0;
}

.p-contextmenu-item-content:hover .p-contextmenu-item-icon,
.p-contextmenu-item.p-contextmenu-item-active > .p-contextmenu-item-content .p-contextmenu-item-icon {
    color: var(--p-contextmenu-item-icon-focus-color, var(--p-surface-900, #0f172a));
}

.p-contextmenu-item-label {
    flex: 1;
    white-space: nowrap;
}

.p-contextmenu-shortcut {
    margin-left: auto;
    font-size: 0.75rem;
    color: var(--p-text-muted, #94a3b8);
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: 4px;
    padding: 0.1rem 0.35rem;
}

.p-contextmenu-badge {
    margin-left: auto;
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: 9999px;
    padding: 0.1rem 0.45rem;
    background: var(--p-primary-color, #10b981);
    color: var(--lt-surface-0, #ffffff);
}

.p-contextmenu-submenu-icon {
    margin-left: auto;
    color: var(--p-contextmenu-submenu-icon-color, var(--p-surface-400, #94a3b8));
    display: inline-flex;
    align-items: center;
}

.p-contextmenu-separator {
    height: 1px;
    background: var(--p-contextmenu-separator-border-color, var(--p-surface-200, #e2e8f0));
    margin: 0.25rem 0;
}

/* Submenu Flyout Overlay */
.p-contextmenu-sublist-wrapper {
    position: absolute;
    top: 0;
    left: 100%;
    min-width: 13rem;
    background: var(--p-contextmenu-background, var(--p-surface-0, #ffffff));
    border: 1px solid var(--p-contextmenu-border-color, var(--p-surface-200, #e2e8f0));
    border-radius: var(--p-contextmenu-border-radius, var(--p-border-radius, 8px));
    box-shadow: var(--p-contextmenu-shadow, 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1));
    padding: var(--p-contextmenu-list-padding, 0.25rem);
    display: none;
    z-index: 1201;
    margin-left: 2px;
}

.p-contextmenu-item:hover > .p-contextmenu-sublist-wrapper,
.p-contextmenu-item.p-contextmenu-item-active > .p-contextmenu-sublist-wrapper {
    display: block;
}

.p-contextmenu-sublist-wrapper.p-sublist-left {
    left: auto;
    right: 100%;
    margin-left: 0;
    margin-right: 2px;
}

/* Target Area Cards */
.p-contextmenu-target-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 28rem;
    margin: 0 auto;
    height: 10rem;
    border-radius: var(--p-border-radius, 8px);
    border: 2px dashed var(--p-border-color, #cbd5e1);
    color: var(--p-text-muted, #64748b);
    font-size: 0.875rem;
    font-weight: 500;
    user-select: none;
    transition: border-color 200ms ease, background-color 200ms ease;
    cursor: context-menu;
}

.p-contextmenu-target-box:hover {
    border-color: var(--p-primary-color, #10b981);
    background: var(--p-surface-50, #f8fafc);
}

/* Dark Mode Tokens */
.dark .p-contextmenu,
.dark .p-contextmenu-sublist-wrapper,
[data-theme="dark"] .p-contextmenu,
[data-theme="dark"] .p-contextmenu-sublist-wrapper {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-800, #1e293b);
    color: var(--p-surface-200, #e2e8f0);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
}

.dark .p-contextmenu-item-content:hover,
.dark .p-contextmenu-item.p-contextmenu-item-active > .p-contextmenu-item-content,
[data-theme="dark"] .p-contextmenu-item-content:hover,
[data-theme="dark"] .p-contextmenu-item.p-contextmenu-item-active > .p-contextmenu-item-content {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #ffffff);
}

.dark .p-contextmenu-separator,
[data-theme="dark"] .p-contextmenu-separator {
    background: var(--p-surface-800, #1e293b);
}

.dark .p-contextmenu-shortcut,
[data-theme="dark"] .p-contextmenu-shortcut {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-400, #94a3b8);
}

.dark .p-contextmenu-target-box,
[data-theme="dark"] .p-contextmenu-target-box {
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-400, #94a3b8);
}
.dark .p-contextmenu-target-box:hover,
[data-theme="dark"] .p-contextmenu-target-box:hover {
    border-color: var(--p-primary-color, #10b981);
    background: var(--p-surface-900, #0f172a);
}
`;

const CHEVRON_RIGHT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;

export default function ContextMenuIsland(container: HTMLElement, props: ContextMenuProps) {
    injectIslandStyle('contextmenu', CONTEXTMENU_CSS);

    const demoType = props.demoType || 'basic';
    const isGlobal = props.global === true || demoType === 'global';

    let menuItems: ContextMenuItem[] = props.model || props.items || [];

    if (menuItems.length === 0) {
        if (demoType === 'basic') {
            menuItems = [
                { label: 'Cut', icon: 'scissors' },
                { label: 'Copy', icon: 'copy' },
                { label: 'Paste', icon: 'clipboard' },
                { label: 'Rename', icon: 'pencil' },
                { separator: true },
                { label: 'Delete', icon: 'trash-2', class: 'text-red-500 font-semibold' }
            ];
        } else if (demoType === 'submenus') {
            menuItems = [
                { label: 'Copy', icon: 'copy' },
                {
                    label: 'Share',
                    icon: 'share-2',
                    items: [
                        { label: 'Send via email', icon: 'mail' },
                        { label: 'Copy link', icon: 'link' },
                        { label: 'Open in new tab', icon: 'external-link' }
                    ]
                },
                {
                    label: 'Save as',
                    icon: 'download',
                    items: [
                        { label: 'PDF', icon: 'file' },
                        {
                            label: 'Image',
                            icon: 'file-image',
                            items: [
                                { label: 'PNG' },
                                { label: 'JPG' },
                                { label: 'WebP' },
                                { label: 'SVG' }
                            ]
                        },
                        { label: 'ZIP archive', icon: 'folder' }
                    ]
                },
                { separator: true },
                { label: 'Delete', icon: 'trash-2', class: 'text-red-500 font-semibold' }
            ];
        } else if (demoType === 'global') {
            menuItems = [
                { label: 'Back', icon: 'home' },
                { label: 'Reload', icon: 'refresh-cw' },
                { separator: true },
                { label: 'Copy', icon: 'copy' },
                { label: 'Paste', icon: 'clipboard' },
                { separator: true },
                {
                    label: 'View',
                    icon: 'folder',
                    items: [
                        { label: 'Zoom In', icon: 'zoom-in' },
                        { label: 'Zoom Out', icon: 'zoom-out' },
                        { label: 'Page Source', icon: 'code' }
                    ]
                },
                { separator: true },
                { label: 'Open Link', icon: 'external-link' },
                { label: 'Print', icon: 'printer' },
                { label: 'Inspect', icon: 'help-circle' }
            ];
        } else if (demoType === 'template') {
            menuItems = [
                { label: 'Favorite', icon: 'star', shortcut: '⌘+D' },
                { label: 'Add', icon: 'shopping-cart', shortcut: '⌘+A' },
                { separator: true },
                {
                    label: 'Share',
                    icon: 'share-2',
                    items: [
                        { label: 'Whatsapp', icon: 'message-circle', badge: '2' },
                        { label: 'Instagram', icon: 'instagram', badge: '3' }
                    ]
                }
            ];
        } else if (demoType === 'command') {
            menuItems = [
                {
                    label: 'Roles',
                    icon: 'users',
                    items: [
                        { label: 'Admin', roleValue: 'Admin' },
                        { label: 'Member', roleValue: 'Member' },
                        { label: 'Guest', roleValue: 'Guest' }
                    ] as any
                },
                {
                    label: 'Invite',
                    icon: 'user-plus'
                }
            ];
        } else if (demoType === 'router') {
            menuItems = [
                { label: 'Router Link', icon: 'palette', route: '/enterprise#sec-contextmenu' },
                { label: 'Programmatic', icon: 'link' },
                { label: 'External', icon: 'home', url: 'https://github.com/laughtale/LaughTale' }
            ];
        }
    }

    // Render Host Demo View
    function renderHostDemo() {
        if (demoType === 'template') {
            const products = [
                { id: '1000', name: 'Bamboo Watch', category: 'Accessories', price: 65, image: 'bamboo-watch.jpg' },
                { id: '1001', name: 'Black Watch', category: 'Accessories', price: 72, image: 'black-watch.jpg' },
                { id: '1002', name: 'Blue Band', category: 'Fitness', price: 79, image: 'blue-band.jpg' },
                { id: '1003', name: 'Blue T-Shirt', category: 'Clothing', price: 29, image: 'blue-t-shirt.jpg' },
                { id: '1004', name: 'Bracelet', category: 'Accessories', price: 15, image: 'bracelet.jpg' }
            ];

            return `
                <div class="flex justify-center" style="width: 100%;">
                    <ul class="p-contextmenu-product-list" style="margin: 0 auto; list-style: none; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 32rem; background: var(--p-surface-0);">
                        ${products.map(p => `
                            <li class="p-contextmenu-product-item" data-product-id="${p.id}" style="padding: 0.5rem; border-radius: var(--p-border-radius); border: 2px solid transparent; transition: all 180ms ease; cursor: context-menu;">
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <div style="width: 4rem; height: 3rem; border-radius: 6px; background: var(--p-surface-100); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.25rem;">
                                        ${getLucideIcon('package', 24)}
                                    </div>
                                    <div style="flex: 1; display: flex; flex-direction: column; gap: 0.25rem;">
                                        <span style="font-weight: 700; font-size: 0.875rem; color: var(--p-text-color);">${p.name}</span>
                                        <div style="display: flex; align-items: center; gap: 0.35rem; color: var(--p-text-muted); font-size: 0.75rem;">
                                            <span>${getLucideIcon('tag', 12)}</span>
                                            <span>${p.category}</span>
                                        </div>
                                    </div>
                                    <span style="font-weight: 700; font-size: 0.875rem; color: var(--p-text-color); margin-left: 1rem;">$${p.price}</span>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }

        if (demoType === 'command') {
            const users = [
                { id: 0, name: 'Amy Elsner', role: 'Admin', badge: 'emerald' },
                { id: 1, name: 'Anna Fali', role: 'Member', badge: 'info' },
                { id: 2, name: 'Asiya Javayant', role: 'Member', badge: 'info' },
                { id: 3, name: 'Bernardo Dominic', role: 'Guest', badge: 'warn' },
                { id: 4, name: 'Elwin Sharvill', role: 'Member', badge: 'info' }
            ];

            return `
                <div class="flex justify-center" style="width: 100%;">
                    <ul class="p-contextmenu-user-list" style="margin: 0 auto; list-style: none; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 26rem; background: var(--p-surface-0);">
                        ${users.map(u => `
                            <li class="p-contextmenu-user-item" data-user-id="${u.id}" style="padding: 0.6rem 0.75rem; border-radius: var(--p-border-radius); border: 2px solid transparent; transition: all 180ms ease; display: flex; align-items: center; justify-content: space-between; cursor: context-menu;">
                                <div style="display: flex; align-items: center; gap: 0.75rem;">
                                    <div style="width: 2rem; height: 2rem; border-radius: 9999px; background: var(--p-primary-100); color: var(--p-primary-700); font-weight: 700; font-size: 0.75rem; display: flex; align-items: center; justify-content: center;">
                                        ${u.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span style="font-weight: 600; font-size: 0.875rem; color: var(--p-text-color);">${u.name}</span>
                                </div>
                                <span class="aura-tag p-user-role-badge tag-${u.badge}">${u.role}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }

        if (demoType === 'router') {
            return `
                <div style="display: flex; justify-content: center; width: 100%;">
                    <div class="p-contextmenu-target-box p-contextmenu-router-target" style="width: 5rem; height: 5rem; border-radius: var(--p-border-radius); border: 2px solid var(--p-primary-color); display: flex; align-items: center; justify-content: center; cursor: context-menu;">
                        <span style="color: var(--p-primary-color);">${getLucideIcon('shield', 36)}</span>
                    </div>
                </div>
            `;
        }

        if (demoType === 'global') {
            return `
                <div style="text-align: center; padding: 2rem 1rem; width: 100%;">
                    <p style="font-size: 0.875rem; color: var(--p-text-muted); margin: 0;">Right-click anywhere on this card to view the global ContextMenu.</p>
                </div>
            `;
        }

        return `
            <div class="p-contextmenu-target-box" data-context-target>
                Right-click here
            </div>
        `;
    }

    // Recursive Submenu HTML Builder
    function renderItemsHtml(items: ContextMenuItem[]): string {
        return `
            <ul class="p-contextmenu-root-list" role="menubar" aria-orientation="vertical">
                ${items.map((item, idx) => {
                    if (item.separator) {
                        return `<li class="p-contextmenu-separator" role="separator"></li>`;
                    }

                    const hasSub = item.items && item.items.length > 0;
                    const iconSvg = item.icon ? getLucideIcon(item.icon, 16) : '';
                    const customClass = item.class || '';

                    return `
                        <li class="p-contextmenu-item ${item.disabled ? 'p-disabled' : ''} ${customClass}" role="none" data-menu-index="${idx}">
                            <a class="p-contextmenu-item-content" role="menuitem" tabindex="0" ${hasSub ? 'aria-haspopup="true" aria-expanded="false"' : ''} ${item.url ? `href="${item.url}"` : ''} ${item.target ? `target="${item.target}"` : ''} data-item-label="${item.label || ''}">
                                ${iconSvg ? `<span class="p-contextmenu-item-icon">${iconSvg}</span>` : ''}
                                <span class="p-contextmenu-item-label">${item.label || ''}</span>
                                ${item.shortcut ? `<span class="p-contextmenu-shortcut">${item.shortcut}</span>` : ''}
                                ${item.badge ? `<span class="p-contextmenu-badge">${item.badge}</span>` : ''}
                                ${hasSub ? `<span class="p-contextmenu-submenu-icon">${CHEVRON_RIGHT_SVG}</span>` : ''}
                            </a>
                            ${hasSub ? `
                                <div class="p-contextmenu-sublist-wrapper" role="menu">
                                    <ul class="p-contextmenu-submenu">
                                        ${renderSubmenuItems(item.items!)}
                                    </ul>
                                </div>
                            ` : ''}
                        </li>
                    `;
                }).join('')}
            </ul>
        `;
    }

    function renderSubmenuItems(items: ContextMenuItem[]): string {
        return items.map((item, idx) => {
            if (item.separator) return `<li class="p-contextmenu-separator" role="separator"></li>`;
            const hasSub = item.items && item.items.length > 0;
            const iconSvg = item.icon ? getLucideIcon(item.icon, 16) : '';

            return `
                <li class="p-contextmenu-item ${item.disabled ? 'p-disabled' : ''} ${item.class || ''}" role="none" data-submenu-index="${idx}">
                    <a class="p-contextmenu-item-content" role="menuitem" tabindex="0" ${hasSub ? 'aria-haspopup="true" aria-expanded="false"' : ''} data-item-label="${item.label || ''}">
                        ${iconSvg ? `<span class="p-contextmenu-item-icon">${iconSvg}</span>` : ''}
                        <span class="p-contextmenu-item-label">${item.label || ''}</span>
                        ${item.shortcut ? `<span class="p-contextmenu-shortcut">${item.shortcut}</span>` : ''}
                        ${item.badge ? `<span class="p-contextmenu-badge">${item.badge}</span>` : ''}
                        ${hasSub ? `<span class="p-contextmenu-submenu-icon">${CHEVRON_RIGHT_SVG}</span>` : ''}
                    </a>
                    ${hasSub ? `
                        <div class="p-contextmenu-sublist-wrapper" role="menu">
                            <ul class="p-contextmenu-submenu">
                                ${renderSubmenuItems(item.items!)}
                            </ul>
                        </div>
                    ` : ''}
                </li>
            `;
        }).join('');
    }

    container.innerHTML = `
        <div class="p-contextmenu-container" style="position: relative; width: 100%;">
            ${renderHostDemo()}
            <div class="p-contextmenu ${props.class || ''}" role="region" aria-label="${props.ariaLabel || 'Context Menu'}" data-contextmenu-root>
                ${renderItemsHtml(menuItems)}
            </div>
        </div>
    `;

    const menuEl = container.querySelector<HTMLElement>('[data-contextmenu-root]')!;
    let isMenuOpen = false;
    let selectedTargetEl: HTMLElement | null = null;

    function showMenu(clientX: number, clientY: number) {
        menuEl.style.display = 'block';
        menuEl.style.visibility = 'hidden';

        // Calculate geometry bounds
        const menuRect = menuEl.getBoundingClientRect();
        const menuWidth = menuRect.width || 220;
        const menuHeight = menuRect.height || 200;

        let left = clientX;
        let top = clientY;

        if (left + menuWidth > window.innerWidth - 10) {
            left = Math.max(10, window.innerWidth - menuWidth - 10);
        }
        if (top + menuHeight > window.innerHeight - 10) {
            top = Math.max(10, window.innerHeight - menuHeight - 10);
        }

        menuEl.style.left = `${left}px`;
        menuEl.style.top = `${top}px`;
        menuEl.style.visibility = 'visible';

        requestAnimationFrame(() => {
            menuEl.classList.add('p-contextmenu-active');
            isMenuOpen = true;
        });

        // Adjust submenus collision
        menuEl.querySelectorAll<HTMLElement>('.p-contextmenu-sublist-wrapper').forEach(sub => {
            const rect = sub.getBoundingClientRect();
            if (rect.right > window.innerWidth - 10) {
                sub.classList.add('p-sublist-left');
            } else {
                sub.classList.remove('p-sublist-left');
            }
        });
    }

    function hideMenu() {
        if (!isMenuOpen) return;
        menuEl.classList.remove('p-contextmenu-active');
        setTimeout(() => {
            if (!menuEl.classList.contains('p-contextmenu-active')) {
                menuEl.style.display = 'none';
            }
        }, 120);
        isMenuOpen = false;

        if (selectedTargetEl) {
            selectedTargetEl.style.borderColor = 'transparent';
            selectedTargetEl = null;
        }
    }

    // Attach ContextMenu Handlers
    if (isGlobal) {
        container.addEventListener('contextmenu', (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            showMenu(e.clientX, e.clientY);
        });
    } else if (demoType === 'template') {
        container.querySelectorAll<HTMLElement>('.p-contextmenu-product-item').forEach(item => {
            item.addEventListener('contextmenu', (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();

                container.querySelectorAll<HTMLElement>('.p-contextmenu-product-item').forEach(p => p.style.borderColor = 'transparent');
                item.style.borderColor = 'var(--p-primary-color, #10b981)';
                selectedTargetEl = item;

                showMenu(e.clientX, e.clientY);
            });
        });
    } else if (demoType === 'command') {
        container.querySelectorAll<HTMLElement>('.p-contextmenu-user-item').forEach(item => {
            item.addEventListener('contextmenu', (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();

                container.querySelectorAll<HTMLElement>('.p-contextmenu-user-item').forEach(u => u.style.borderColor = 'transparent');
                item.style.borderColor = 'var(--p-primary-color, #10b981)';
                selectedTargetEl = item;

                showMenu(e.clientX, e.clientY);
            });
        });
    } else {
        const targetBox = container.querySelector<HTMLElement>('[data-context-target]') || container.querySelector<HTMLElement>('.p-contextmenu-router-target');
        if (targetBox) {
            targetBox.addEventListener('contextmenu', (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                showMenu(e.clientX, e.clientY);
            });
        }
    }

    // Item Command / Action Handlers
    menuEl.querySelectorAll<HTMLElement>('[data-item-label]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const label = btn.getAttribute('data-item-label');
            const hasSub = btn.closest('.p-contextmenu-item')?.querySelector('.p-contextmenu-sublist-wrapper');
            if (hasSub) return; // Do not close if expanding submenu

            if (demoType === 'command' && selectedTargetEl) {
                if (label === 'Admin' || label === 'Member' || label === 'Guest') {
                    const badge = selectedTargetEl.querySelector('.p-user-role-badge');
                    if (badge) {
                        badge.textContent = label;
                        badge.className = `aura-tag p-user-role-badge tag-${label === 'Admin' ? 'emerald' : label === 'Member' ? 'info' : 'warn'}`;
                    }
                } else if (label === 'Invite') {
                    const toastMsg = (window as any).$toast || (window as any).LaughTaleToast;
                    if (toastMsg) {
                        toastMsg.add({ severity: 'success', summary: 'Success', detail: 'Invitation sent!', life: 3000 });
                    }
                }
            }

            container.dispatchEvent(new CustomEvent('contextmenu:select', {
                bubbles: true,
                detail: { label }
            }));

            hideMenu();
        });
    });

    // Outside Click & Keyboard Close Handlers
    document.addEventListener('click', (e) => {
        if (!menuEl.contains(e.target as Node)) {
            hideMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Tab') {
            hideMenu();
        }
    });

    window.addEventListener('scroll', hideMenu, true);
    window.addEventListener('resize', hideMenu);
}
