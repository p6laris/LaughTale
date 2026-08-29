/**
 * SoftMax.LaughTale: Enterprise Menu Component (PrimeVue 4 Aura Design System compliant)
 * Navigation and command menu supporting dynamic popup overlay and static inline modes,
 * hierarchical toggleable submenus, interactive checkbox/radio groups, custom templates,
 * controlled expandedKeys, and full WAI-ARIA keyboard navigation.
 */

import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';
import { useFocusTrap } from '../composables/useFocusTrap';

const MENU_CSS = `
.p-menu {
    display: inline-flex;
    flex-direction: column;
    background: var(--p-menu-background, var(--p-surface-0, #ffffff));
    color: var(--p-menu-color, var(--p-text-color, #0f172a));
    border: 1px solid var(--p-menu-border-color, var(--p-border-color, #e2e8f0));
    border-radius: var(--p-menu-border-radius, var(--p-border-radius, 8px));
    box-shadow: var(--p-menu-shadow, 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05));
    min-width: 12.5rem;
    box-sizing: border-box;
    font-family: inherit;
    user-select: none;
    overflow: hidden;
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.p-menu.p-menu-popup {
    position: absolute;
    z-index: 1050;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.12), 0 4px 6px -4px rgba(0, 0, 0, 0.08);
}

.p-menu-start {
    border-bottom: 1px solid var(--p-menu-border-color, var(--p-border-color, #e2e8f0));
    box-sizing: border-box;
}

.p-menu-end {
    border-top: 1px solid var(--p-menu-border-color, var(--p-border-color, #e2e8f0));
    box-sizing: border-box;
}

.p-menu-list,
.p-menu-submenu-list {
    list-style: none;
    margin: 0;
    padding: var(--p-menu-list-padding, 0.375rem);
    display: flex;
    flex-direction: column;
    gap: var(--p-menu-list-gap, 0.125rem);
    box-sizing: border-box;
}

.p-menu-submenu-list {
    padding-left: 1.25rem;
}

.p-menu-submenu-label {
    font-size: var(--p-menu-submenu-label-font-size, 0.75rem);
    font-weight: var(--p-menu-submenu-label-font-weight, 700);
    color: var(--p-menu-submenu-label-color, var(--p-surface-500, #64748b));
    padding: var(--p-menu-submenu-label-padding, 0.5rem 0.65rem 0.25rem);
    background: var(--p-menu-submenu-label-background, transparent);
    text-transform: none;
    letter-spacing: normal;
}

.p-menu-separator {
    height: 1px;
    background: var(--p-menu-separator-border-color, var(--p-border-color, #e2e8f0));
    margin: 0.25rem 0;
    list-style: none;
    padding: 0;
}

.p-menu-item {
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.p-menu-item-content {
    display: block;
    box-sizing: border-box;
}

.p-menu-item-link {
    display: flex;
    align-items: center;
    gap: var(--p-menu-item-gap, 0.5rem);
    padding: var(--p-menu-item-padding, 0.45rem 0.65rem);
    color: var(--p-menu-item-color, var(--p-text-color, #0f172a));
    border-radius: var(--p-menu-item-border-radius, var(--p-border-radius, 6px));
    text-decoration: none;
    cursor: pointer;
    font-size: var(--p-menu-item-label-font-size, 0.875rem);
    font-weight: var(--p-menu-item-label-font-weight, 500);
    transition: background-color 0.12s ease, color 0.12s ease;
    outline: none;
}

.p-menu-item-link:hover,
.p-menu-item.p-focus > .p-menu-item-content > .p-menu-item-link,
.p-menu-item-link.p-focus {
    background: var(--p-menu-item-focus-background, var(--p-surface-100, #f1f5f9));
    color: var(--p-menu-item-focus-color, var(--p-text-color, #0f172a));
}

.p-menu-item.p-disabled > .p-menu-item-content > .p-menu-item-link {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.p-menu-item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-menu-item-icon-color, var(--p-surface-500, #64748b));
    width: var(--p-menu-item-icon-size, 1.125rem);
    height: var(--p-menu-item-icon-size, 1.125rem);
    flex-shrink: 0;
}

.p-menu-item-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.p-menu-item-shortcut {
    margin-left: auto;
    font-size: 0.75rem;
    color: var(--p-surface-500, #64748b);
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-border-color, #cbd5e1);
    border-radius: 4px;
    padding: 0.1rem 0.35rem;
    font-weight: 500;
}

.p-menu-item-badge {
    margin-left: auto;
    background: var(--p-primary-500, #3b82f6);
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: 700;
    min-width: 1.25rem;
    height: 1.25rem;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.35rem;
}

.p-menu-item-submenu-icon {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-400, #94a3b8);
    transition: transform 0.15s ease;
}

.p-menu-item-submenu-icon.p-expanded {
    transform: rotate(180deg);
}

/* Checkbox & Radio Indicators in Menu */
.p-menu-check-icon {
    width: 1rem;
    height: 1rem;
    color: var(--p-primary-500, #3b82f6);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.p-menu-dot-icon {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    background: var(--p-primary-500, #3b82f6);
    display: inline-block;
    margin: 0.25rem;
}

.p-menu-blank-icon {
    width: 1rem;
    height: 1rem;
    display: inline-block;
}

/* Dark Mode Tokens */
.dark .p-menu,
[data-theme="dark"] .p-menu {
    background: var(--p-menu-background, var(--p-surface-900, #0f172a));
    color: var(--p-menu-color, var(--p-surface-0, #f8fafc));
    border-color: var(--p-menu-border-color, var(--p-surface-700, #334155));
}

.dark .p-menu-start,
[data-theme="dark"] .p-menu-start,
.dark .p-menu-end,
[data-theme="dark"] .p-menu-end,
.dark .p-menu-separator,
[data-theme="dark"] .p-menu-separator {
    border-color: var(--p-surface-700, #334155);
}

.dark .p-menu-item-link,
[data-theme="dark"] .p-menu-item-link {
    color: var(--p-surface-100, #f1f5f9);
}

.dark .p-menu-item-link:hover,
.dark .p-menu-item.p-focus > .p-menu-item-content > .p-menu-item-link,
[data-theme="dark"] .p-menu-item-link:hover,
[data-theme="dark"] .p-menu-item.p-focus > .p-menu-item-content > .p-menu-item-link {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #f8fafc);
}

.dark .p-menu-item-shortcut,
[data-theme="dark"] .p-menu-item-shortcut {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-300, #cbd5e1);
}

.dark .p-menu-submenu-label,
[data-theme="dark"] .p-menu-submenu-label {
    color: var(--p-surface-400, #94a3b8);
}
`;

export interface MenuItemData {
    label?: string;
    icon?: string;
    separator?: boolean;
    disabled?: boolean;
    url?: string;
    action?: string;
    items?: MenuItemData[];
    key?: string;
    shortcut?: string;
    badge?: string | number;
    route?: string;
    target?: string;
    toggleable?: boolean;
    linkClass?: string;
    command?: string;
    checked?: boolean;
    radioGroup?: string;
    radioSelected?: boolean;
}

export interface MenuProps {
    model?: MenuItemData[];
    items?: MenuItemData[];
    popup?: boolean;
    triggerId?: string;
    triggerText?: string;
    triggerIcon?: string;
    triggerVariant?: string;
    triggerSeverity?: string;
    triggerClass?: string;
    triggerIconOnly?: boolean;
    expandedKeys?: Record<string, boolean>;
    customTemplate?: boolean;
    startTemplate?: string;
    endTemplate?: string;
    class?: string;
    style?: string;
}

export default function MenuIsland(container: HTMLElement, props: MenuProps) {
    injectIslandStyle('menu', MENU_CSS);

    const isPopup = props.popup || (props as any).Popup || false;
    let expandedKeys: Record<string, boolean> = { ...(props.expandedKeys || (props as any).ExpandedKeys || {}) };
    const customTemplate = props.customTemplate || (props as any).CustomTemplate || false;

    // Normalize raw items
    function normalizeItems(rawList: any[]): MenuItemData[] {
        if (!Array.isArray(rawList)) return [];
        return rawList.map(it => {
            const rawSub = it.items || it.Items;
            return {
                label: it.label || it.Label || '',
                icon: it.icon || it.Icon,
                separator: it.separator || it.Separator || false,
                disabled: it.disabled || it.Disabled || false,
                url: it.url || it.Url,
                action: it.action || it.Action,
                items: Array.isArray(rawSub) ? normalizeItems(rawSub) : undefined,
                key: it.key || it.Key,
                shortcut: it.shortcut || it.Shortcut,
                badge: it.badge || it.Badge,
                route: it.route || it.Route,
                target: it.target || it.Target,
                toggleable: it.toggleable !== undefined ? it.toggleable : (it.Toggleable !== undefined ? it.Toggleable : undefined),
                linkClass: it.linkClass || it.LinkClass,
                command: it.command || it.Command,
                checked: it.checked !== undefined ? it.checked : it.Checked,
                radioGroup: it.radioGroup || it.RadioGroup,
                radioSelected: it.radioSelected !== undefined ? it.radioSelected : it.RadioSelected
            };
        });
    }

    const rawData = props.model || props.items || (props as any).Model || (props as any).Items || [];
    let itemsState: MenuItemData[] = normalizeItems(rawData);

    let isOpen = !isPopup;
    let focusedIndex = 0;

    function getIconSvg(iconName?: string): string {
        if (!iconName) return '';
        if (iconName.startsWith('<svg')) return iconName;
        if ((LucideIcons as any)[iconName]) return (LucideIcons as any)[iconName];
        return '';
    }

    function renderItemContent(item: MenuItemData, path: string): string {
        if (item.separator) {
            return `<li class="p-menu-separator" role="separator"></li>`;
        }

        const isGroup = Array.isArray(item.items) && item.items.length > 0;
        const isToggleable = item.toggleable !== false && isGroup;
        const isExpanded = isToggleable ? (item.key ? !!expandedKeys[item.key] : expandedKeys[path] !== false) : true;

        if (isGroup && !isToggleable) {
            // Group header style
            const subItemsHtml = item.items!.map((sub, i) => renderItemContent(sub, `${path}.${i}`)).join('');
            return `
                <li class="p-menu-item" role="none">
                    <div class="p-menu-submenu-label">${item.label}</div>
                    <ul class="p-menu-list" role="group">
                        ${subItemsHtml}
                    </ul>
                </li>
            `;
        }

        // Standard item or toggleable group
        let iconHtml = '';
        if (item.checked !== undefined) {
            // Checkbox indicator
            iconHtml = item.checked 
                ? `<span class="p-menu-item-icon p-menu-check-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>`
                : `<span class="p-menu-item-icon p-menu-blank-icon"></span>`;
        } else if (item.radioSelected !== undefined) {
            // Radio indicator
            iconHtml = item.radioSelected
                ? `<span class="p-menu-item-icon"><span class="p-menu-dot-icon"></span></span>`
                : `<span class="p-menu-item-icon p-menu-blank-icon"></span>`;
        } else if (item.icon) {
            const svg = getIconSvg(item.icon);
            if (svg) iconHtml = `<span class="p-menu-item-icon">${svg}</span>`;
        }

        const chevronSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

        let subHtml = '';
        if (isGroup && isExpanded) {
            const subItemsHtml = item.items!.map((sub, i) => renderItemContent(sub, `${path}.${i}`)).join('');
            subHtml = `<ul class="p-menu-submenu-list" role="group">${subItemsHtml}</ul>`;
        }

        const extraClass = item.linkClass || '';

        return `
            <li class="p-menu-item ${item.disabled ? 'p-disabled' : ''}" role="none" data-path="${path}" data-key="${item.key || ''}">
                <div class="p-menu-item-content">
                    <a class="p-menu-item-link ${extraClass}" role="menuitem" tabindex="-1" href="${item.url || item.route || '#'}" ${item.target ? `target="${item.target}"` : ''}>
                        ${iconHtml}
                        <span class="p-menu-item-label">${item.label}</span>
                        ${item.badge !== undefined ? `<span class="p-menu-item-badge">${item.badge}</span>` : ''}
                        ${item.shortcut ? `<span class="p-menu-item-shortcut">${item.shortcut}</span>` : ''}
                        ${isGroup ? `<span class="p-menu-item-submenu-icon ${isExpanded ? 'p-expanded' : ''}">${chevronSvg}</span>` : ''}
                    </a>
                </div>
                ${subHtml}
            </li>
        `;
    }

    function renderMenuHtml(): string {
        const itemsHtml = itemsState.map((it, i) => renderItemContent(it, `${i}`)).join('');

        let startHtml = '';
        if (customTemplate) {
            startHtml = `
                <div class="p-menu-start" style="padding: 0.65rem 0.85rem; display: flex; align-items: center; gap: 0.65rem;">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 1.75rem; height: 1.75rem; background: var(--p-primary-500, #3b82f6); border-radius: 6px; color: #fff;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
                    </span>
                    <span style="font-weight: 700; font-size: 0.9375rem; letter-spacing: -0.01em;">PRIME<span style="color: var(--p-primary-500, #3b82f6);">APP</span></span>
                </div>
            `;
        }

        let endHtml = '';
        if (customTemplate) {
            endHtml = `
                <div class="p-menu-end" style="padding: 0.5rem 0.75rem;">
                    <button type="button" class="p-menu-item-link" style="width: 100%; border: none; background: transparent; padding: 0.4rem 0.5rem; display: flex; align-items: center; gap: 0.65rem; border-radius: 6px; cursor: pointer;">
                        <span style="width: 2rem; height: 2rem; border-radius: 9999px; background: linear-gradient(135deg, #f59e0b, #ef4444); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">AE</span>
                        <span style="display: flex; flex-direction: column; align-items: flex-start; line-height: 1.2;">
                            <span style="font-size: 0.8125rem; font-weight: 700; color: var(--p-text-color);">Amy Elsner</span>
                            <span style="font-size: 0.7rem; color: var(--p-surface-500);">Admin</span>
                        </span>
                    </button>
                </div>
            `;
        }

        const customClass = props.class || (props as any).Class || '';
        const customStyle = props.style || (props as any).Style || '';

        return `
            <div class="p-menu p-component ${isPopup ? 'p-menu-popup' : ''} ${customClass}" style="${customStyle}" role="menu" tabindex="0">
                ${startHtml}
                <ul class="p-menu-list" role="menubar">
                    ${itemsHtml}
                </ul>
                ${endHtml}
            </div>
        `;
    }

    function wireEvents(menuEl: HTMLElement) {
        menuEl.querySelectorAll<HTMLElement>('.p-menu-item').forEach(li => {
            const link = li.querySelector<HTMLElement>('.p-menu-item-link');
            if (!link) return;

            link.addEventListener('click', (e) => {
                const path = li.getAttribute('data-path') || '';
                const key = li.getAttribute('data-key');
                const item = findItemByPath(itemsState, path);

                if (!item || item.disabled) return;

                const isGroup = Array.isArray(item.items) && item.items.length > 0;
                const isToggleable = item.toggleable !== false && isGroup;

                if (isToggleable) {
                    e.preventDefault();
                    if (key) {
                        expandedKeys[key] = !expandedKeys[key];
                    } else {
                        expandedKeys[path] = expandedKeys[path] === false ? true : false;
                    }
                    render();
                    return;
                }

                // Checkbox toggle
                if (item.checked !== undefined) {
                    e.preventDefault();
                    item.checked = !item.checked;
                    render();
                    return;
                }

                // Radio selection
                if (item.radioGroup && item.radioSelected !== undefined) {
                    e.preventDefault();
                    setRadioSelection(itemsState, item.radioGroup, item);
                    render();
                    return;
                }

                // Command callback / action
                if (item.command || item.action) {
                    e.preventDefault();
                    if (item.command === 'new-file') {
                        showFeedback('File created', 'success');
                    } else if (item.command === 'search') {
                        showFeedback('No results found', 'warn');
                    }
                }

                if (isPopup) {
                    isOpen = false;
                    render();
                }
            });
        });

        // Keyboard navigation
        menuEl.addEventListener('keydown', (e) => {
            const links = menuEl.querySelectorAll<HTMLElement>('.p-menu-item-link');
            if (links.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                focusedIndex = (focusedIndex + 1) % links.length;
                links[focusedIndex]?.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                focusedIndex = (focusedIndex - 1 + links.length) % links.length;
                links[focusedIndex]?.focus();
            } else if (e.key === 'Home') {
                e.preventDefault();
                focusedIndex = 0;
                links[0]?.focus();
            } else if (e.key === 'End') {
                e.preventDefault();
                focusedIndex = links.length - 1;
                links[focusedIndex]?.focus();
            } else if (e.key === 'Escape' && isPopup) {
                e.preventDefault();
                isOpen = false;
                render();
            }
        });
    }

    function setRadioSelection(list: MenuItemData[], group: string, selectedItem: MenuItemData) {
        list.forEach(it => {
            if (it.radioGroup === group && it.radioSelected !== undefined) {
                it.radioSelected = it === selectedItem;
            }
            if (it.items) {
                setRadioSelection(it.items, group, selectedItem);
            }
        });
    }

    function findItemByPath(list: MenuItemData[], path: string): MenuItemData | null {
        const parts = path.split('.').map(Number);
        let curr: any = { items: list };
        for (const p of parts) {
            if (!curr.items || !curr.items[p]) return null;
            curr = curr.items[p];
        }
        return curr;
    }

    function showFeedback(msg: string, severity: 'success' | 'warn') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: ${severity === 'success' ? '#10b981' : '#f59e0b'};
            color: #ffffff;
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

    function render() {
        if (!isOpen && isPopup) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = renderMenuHtml();
        const menuEl = container.querySelector<HTMLElement>('.p-menu')!;
        wireEvents(menuEl);

        if (isPopup) {
            const trigger = document.getElementById(props.triggerId || '') || container.previousElementSibling as HTMLElement;
            if (trigger) {
                const rect = trigger.getBoundingClientRect();
                menuEl.style.top = `${rect.bottom + window.scrollY + 6}px`;
                menuEl.style.left = `${rect.left + window.scrollX}px`;

                const closeHandler = (e: MouseEvent) => {
                    if (!container.contains(e.target as Node) && !trigger.contains(e.target as Node)) {
                        isOpen = false;
                        render();
                        document.removeEventListener('click', closeHandler);
                    }
                };
                setTimeout(() => document.addEventListener('click', closeHandler), 0);
            }
        }
    }

    // Bind trigger for popup mode
    if (isPopup) {
        const trigger = document.getElementById(props.triggerId || '');
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                isOpen = !isOpen;
                render();
            });
        }
    }

    // Expose programmatic controls for Controlled demo
    (container as any).__expandAll = () => {
        const keys: Record<string, boolean> = {};
        function collect(list: MenuItemData[]) {
            list.forEach(it => {
                if (it.key) keys[it.key] = true;
                if (it.items) collect(it.items);
            });
        }
        collect(itemsState);
        expandedKeys = keys;
        render();
    };

    (container as any).__collapseAll = () => {
        expandedKeys = {};
        render();
    };

    render();
}
