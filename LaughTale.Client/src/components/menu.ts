import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { useFloatingPosition } from '../composables/useFloatingPosition';
﻿/**
 * LaughTale: Enterprise Menu Component (LaughTale Aura Design System)
 * Navigation and command menu supporting dynamic popup overlay (fixed body-anchored),
 * static inline mode, static group headers, butter-smooth grid collapse/expand animations,
 * interactive checkbox/radio groups, custom templates, and WAI-ARIA keyboard navigation.
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
    pattern: 'menu'
};

const MENU_CSS = `
.p-menu,
p-menu,
island-menu {
    display: inline-flex;
    flex-direction: column;
    background: var(--p-menu-background, var(--p-content-bg, var(--p-surface-0, #ffffff)));
    color: var(--p-menu-color, var(--p-text-color, #1e293b));
    border: 1px solid var(--p-menu-border-color, var(--p-border-color, #e2e8f0));
    border-radius: var(--p-menu-border-radius, var(--p-border-radius-md, 6px));
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    min-width: 12.5rem;
    box-sizing: border-box;
    font-family: inherit;
    user-select: none;
    overflow: hidden;
}

.p-menu-popup-overlay {
    position: fixed;
    z-index: 1050;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.12), 0 4px 6px -4px rgba(0, 0, 0, 0.08);
    animation: p-menu-fade-in 0.15s cubic-bezier(0, 0, 0.2, 1);
}

@keyframes p-menu-fade-in {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.p-menu-start {
    border-bottom: 1px solid var(--p-menu-border-color, var(--p-border-color, #e2e8f0));
    box-sizing: border-box;
}

.p-menu-end {
    border-top: 1px solid var(--p-menu-border-color, var(--p-border-color, #e2e8f0));
    box-sizing: border-box;
}

.p-menu-list {
    list-style: none;
    margin: 0;
    padding: 0.375rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    box-sizing: border-box;
}

.p-menu-submenu-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 220ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms ease, visibility 220ms ease;
    opacity: 0;
    visibility: hidden;
}

.p-menu-submenu-wrapper.p-expanded {
    grid-template-rows: 1fr;
    opacity: 1;
    visibility: visible;
}

.p-menu-submenu-inner {
    overflow: hidden;
    min-height: 0;
}

.p-menu-submenu-list {
    list-style: none;
    margin: 0;
    padding: 0.125rem 0 0.125rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    box-sizing: border-box;
}

.p-menu-submenu-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--p-text-muted, #94a3b8);
    padding: 0.5rem 0.75rem 0.25rem;
    text-transform: none;
    letter-spacing: normal;
    user-select: none;
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
    gap: 0.5rem;
    padding: 0.45rem 0.65rem;
    color: var(--p-menu-item-color, var(--p-text-color, #1e293b));
    border-radius: var(--p-border-radius, 6px);
    text-decoration: none;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.12s ease, color 0.12s ease;
    outline: none;
    box-sizing: border-box;
}

.p-menu-item-link:hover,
.p-menu-item-link.p-focus {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #1e293b);
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
    color: var(--p-text-muted, #64748b);
    width: 1.125rem;
    height: 1.125rem;
    flex-shrink: 0;
}

.p-menu-item-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.p-menu-item-shortcut {
    margin-inline-start: auto;
    font-size: 0.75rem;
    color: var(--p-text-muted, #64748b);
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: 4px;
    padding: 0.1rem 0.35rem;
    font-weight: 500;
}

.p-menu-item-badge {
    margin-inline-start: auto;
    background: var(--p-primary-500, #10b981);
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
    margin-inline-start: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-text-muted, #94a3b8);
    transition: transform 220ms cubic-bezier(0.4, 0, 0.2, 1);
}

.p-menu-item-submenu-icon.p-expanded {
    transform: rotate(180deg);
}

/* Indicators */
.p-menu-check-icon {
    width: 1rem;
    height: 1rem;
    color: var(--p-primary-color, #10b981);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.p-menu-dot-icon {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 9999px;
    background: var(--p-primary-color, #10b981);
    display: inline-block;
    margin: 0.3125rem;
}

.p-menu-blank-icon {
    width: 1rem;
    height: 1rem;
    display: inline-block;
}

/* Dark Mode */
html.dark .p-menu,
[data-theme="dark"] .p-menu,
.dark .p-menu {
    background: var(--p-surface-0, #0f172a);
    color: var(--p-text-color, #f8fafc);
    border-color: var(--p-border-color, #334155);
}

html.dark .p-menu-start,
html.dark .p-menu-end,
html.dark .p-menu-separator,
[data-theme="dark"] .p-menu-start,
[data-theme="dark"] .p-menu-end,
[data-theme="dark"] .p-menu-separator,
.dark .p-menu-start,
.dark .p-menu-end,
.dark .p-menu-separator {
    border-color: var(--p-border-color, #334155);
}

html.dark .p-menu-item-link,
[data-theme="dark"] .p-menu-item-link,
.dark .p-menu-item-link {
    color: var(--p-text-color, #f8fafc);
}

html.dark .p-menu-item-link:hover,
[data-theme="dark"] .p-menu-item-link:hover,
.dark .p-menu-item-link:hover {
    background: var(--p-surface-100, #1e293b);
    color: var(--p-text-color, #f8fafc);
}

html.dark .p-menu-item-shortcut,
[data-theme="dark"] .p-menu-item-shortcut,
.dark .p-menu-item-shortcut {
    background: var(--p-surface-100, #1e293b);
    border-color: var(--p-border-color, #334155);
    color: var(--p-text-muted, #94a3b8);
}

html.dark .p-menu-item-badge,
[data-theme="dark"] .p-menu-item-badge,
.dark .p-menu-item-badge {
    background: var(--p-primary-500, #10b981);
    color: #ffffff;
}

html.dark .p-menu-submenu-label,
[data-theme="dark"] .p-menu-submenu-label,
.dark .p-menu-submenu-label {
    color: var(--p-text-muted, #94a3b8);
}

html.dark .p-menu-dot-icon,
[data-theme="dark"] .p-menu-dot-icon,
.dark .p-menu-dot-icon {
    background: var(--p-primary-500, #10b981);
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
    expandedKeys?: Record<string, boolean>;
    customTemplate?: boolean;
    class?: string;
    style?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

export default function MenuIsland(container: HTMLElement, props: MenuProps, ctx?: IslandContext) {
    injectIslandStyle('menu', MENU_CSS);
    const locale = useLocale(ctx);
    container.setAttribute('data-part', 'root');

    const isPopup = props.popup === true || String(props.popup) === 'true' || (props as any).Popup === true || String((props as any).Popup) === 'true' || container.getAttribute('popup') === 'true' || container.hasAttribute('popup');
    let expandedKeys: Record<string, boolean> = { ...(props.expandedKeys || (props as any).ExpandedKeys || {}) };
    const customTemplate = props.customTemplate === true || String(props.customTemplate) === 'true' || (props as any).CustomTemplate === true || String((props as any).CustomTemplate) === 'true' || container.getAttribute('custom-template') === 'true' || container.hasAttribute('custom-template');

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
                toggleable: it.toggleable !== undefined ? (it.toggleable === true || String(it.toggleable) === 'true') : (it.Toggleable !== undefined ? (it.Toggleable === true || String(it.Toggleable) === 'true') : undefined),
                linkClass: it.linkClass || it.LinkClass,
                command: it.command || it.Command,
                checked: it.checked !== undefined ? (it.checked === true || String(it.checked) === 'true') : (it.Checked !== undefined ? (it.Checked === true || String(it.Checked) === 'true') : undefined),
                radioGroup: it.radioGroup || it.RadioGroup,
                radioSelected: it.radioSelected !== undefined ? (it.radioSelected === true || String(it.radioSelected) === 'true') : (it.RadioSelected !== undefined ? (it.RadioSelected === true || String(it.RadioSelected) === 'true') : undefined)
            };
        });
    }

    const rawData = props.model || props.items || (props as any).Model || (props as any).Items || [];
    let itemsState: MenuItemData[] = normalizeItems(rawData);

    let popupEl: HTMLElement | null = null;
    let floatingCtrl: { update(): void; destroy(): void } | null = null;
    let clickOutsideHandler: ((e: MouseEvent) => void) | null = null;
    let outsideClickTimeoutId: ReturnType<typeof setTimeout> | null = null;

    // ROADMAP.v5.md Part M "Adopt - State machine": `isOpen` was a raw boolean, and the popup's
    // teardown (destroy the floating-position controller, remove the popup element, unbind the
    // outside-click listener) only ever ran inside the outside-click handler ITSELF. Every other way
    // the popup could close - selecting a menu item, pressing Escape - called `closePopup()` but that
    // function did nothing beyond flipping the boolean, so the stale `clickOutsideHandler` stayed bound
    // to `document` forever. Reopening the popup then bound a SECOND listener on top of it, and so on -
    // a real, accumulating listener leak on every open/close cycle that didn't go through an actual
    // outside click. Centralizing teardown into one guarded `onClose` fixes it for every path at once.
    const menuDisclosure = useDisclosure({
        onClose: () => {
            if (outsideClickTimeoutId) {
                clearTimeout(outsideClickTimeoutId);
                outsideClickTimeoutId = null;
            }
            if (clickOutsideHandler) {
                document.removeEventListener('click', clickOutsideHandler);
                clickOutsideHandler = null;
            }
            if (floatingCtrl) {
                floatingCtrl.destroy();
                floatingCtrl = null;
            }
            if (popupEl) {
                popupEl.remove();
                popupEl = null;
            }
        }
    });

    function getIconSvg(iconName?: string): string {
        if (!iconName) return '';
        if (iconName.startsWith('<svg')) return iconName;
        if ((LucideIcons as any)[iconName]) return (LucideIcons as any)[iconName];
        return '';
    }

    function renderItemContent(item: MenuItemData, path: string, depth: number = 0): Raw {
        if (item.separator) {
            return html`<li class="p-menu-separator" data-part="root" role="separator"></li>`;
        }

        const isGroup = Array.isArray(item.items) && item.items.length > 0;
        const isToggleableSubmenu = isGroup && (item.toggleable === true || (depth > 0 && item.toggleable !== false));
        const isStaticGroupHeader = isGroup && !isToggleableSubmenu;

        if (isStaticGroupHeader) {
            const subItemsHtml = item.items!.map((sub, i) => renderItemContent(sub, `${path}.${i}`, depth + 1));
            const headerLabelClass = customTemplate ? 'text-primary font-bold text-sm' : 'p-menu-submenu-label';
            const headerLabelStyle = customTemplate ? 'color: var(--p-primary-color, #10b981); font-weight: 700; font-size: 0.8125rem; padding: 0.5rem 0.75rem 0.25rem;' : '';
            return html`
                <li class="p-menu-item" role="none">
                    <div class="${headerLabelClass}" style="${headerLabelStyle}">${item.label}</div>
                    <ul class="p-menu-list" role="group">
                        ${subItemsHtml}
                    </ul>
                </li>
            `;
        }

        const isExpanded = isToggleableSubmenu ? (item.key ? !!expandedKeys[item.key] : !!expandedKeys[path]) : false;

        let iconHtml: Raw | '' = '';
        if (item.checked !== undefined) {
            iconHtml = item.checked
                ? html`<span class="p-menu-item-icon p-menu-check-icon">${unsafe(getLucideIcon('check', 15, 2.5))}</span>`
                : html`<span class="p-menu-item-icon p-menu-blank-icon"></span>`;
        } else if (item.radioSelected !== undefined) {
            iconHtml = item.radioSelected
                ? html`<span class="p-menu-item-icon"><span class="p-menu-dot-icon"></span></span>`
                : html`<span class="p-menu-item-icon p-menu-blank-icon"></span>`;
        } else if (item.icon) {
            const svg = getIconSvg(item.icon);
            if (svg) iconHtml = html`<span class="p-menu-item-icon">${unsafe(svg)}</span>`;
        }

        const chevronSvg = unsafe(getLucideIcon('chevron-down', 13, 2.2));

        let subHtml: Raw | '' = '';
        if (isGroup) {
            const subItemsHtml = item.items!.map((sub, i) => renderItemContent(sub, `${path}.${i}`, depth + 1));
            subHtml = html`
                <div class="p-menu-submenu-wrapper ${isExpanded ? 'p-expanded' : ''}">
                    <div class="p-menu-submenu-inner">
                        <ul class="p-menu-submenu-list" role="group">${subItemsHtml}</ul>
                    </div>
                </div>
            `;
        }

        let customInlineStyle = '';
        if (item.linkClass && item.linkClass.includes('text-red')) {
            customInlineStyle = 'color: var(--p-danger-500, #ef4444) !important;';
        }

        return html`
            <li class="p-menu-item ${item.disabled ? 'p-disabled' : ''}" role="none" data-path="${path}" data-key="${item.key || ''}">
                <div class="p-menu-item-content">
                    <a class="p-menu-item-link" style="${customInlineStyle}" role="menuitem" ${isToggleableSubmenu ? html`aria-haspopup="true" aria-expanded="${isExpanded}"` : ''} tabindex="-1" href="${safeUrl(item.url || item.route || '#')}" ${attr('target', item.target)}>
                        ${iconHtml}
                        <span class="p-menu-item-label">${item.label}</span>
                        ${item.badge !== undefined ? html`<span class="p-menu-item-badge">${item.badge}</span>` : ''}
                        ${item.shortcut ? html`<span class="p-menu-item-shortcut">${item.shortcut}</span>` : ''}
                        ${isToggleableSubmenu ? html`<span class="p-menu-item-submenu-icon ${isExpanded ? 'p-expanded' : ''}">${chevronSvg}</span>` : ''}
                    </a>
                </div>
                ${subHtml}
            </li>
        `;
    }

    function renderMenuHtml(): Raw {
        const itemsHtml = itemsState.map((it, i) => renderItemContent(it, `${i}`, 0));

        let startHtml: Raw | '' = '';
        if (customTemplate) {
            startHtml = html`
                <div class="p-menu-start" style="padding: 0.65rem 0.85rem; display: flex; align-items: center; gap: 0.65rem;">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 1.75rem; height: 1.75rem; background: var(--p-primary-500, #10b981); border-radius: 6px; color: #ffffff;">
                        ${unsafe(getLucideIcon('layers', 16, 2.5))}
                    </span>
                    <span style="font-weight: 700; font-size: 0.9375rem; letter-spacing: -0.01em; color: var(--p-text-color);">PRIME<span style="color: var(--p-primary-color, #10b981);">APP</span></span>
                </div>
            `;
        }

        let endHtml: Raw | '' = '';
        if (customTemplate) {
            endHtml = html`
                <div class="p-menu-end" style="padding: 0.5rem 0.75rem;">
                    <button type="button" class="p-menu-item-link" style="width: 100%; border: none; background: transparent; padding: 0.4rem 0.5rem; display: flex; align-items: center; gap: 0.65rem; border-radius: 6px; cursor: pointer;">
                        <span style="width: 2rem; height: 2rem; border-radius: 9999px; background: linear-gradient(135deg, var(--p-warn-500, #f59e0b), var(--p-danger-500, #ef4444)); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">AE</span>
                        <span style="display: flex; flex-direction: column; align-items: flex-start; line-height: 1.2;">
                            <span style="font-size: 0.8125rem; font-weight: 700; color: var(--p-text-color);">Amy Elsner</span>
                            <span style="font-size: 0.7rem; color: var(--p-text-muted);">Admin</span>
                        </span>
                    </button>
                </div>
            `;
        }

        const customClass = props.class || (props as any).Class || '';
        const customStyle = props.style || (props as any).Style || '';

        return html`
            <div class="p-menu p-component ${isPopup ? 'p-menu-popup-overlay' : ''} ${customClass}" style="${customStyle}" role="menu" tabindex="0">
                ${startHtml}
                <ul class="p-menu-list" role="none">
                    ${itemsHtml}
                </ul>
                ${endHtml}
            </div>
        `;
    }

    function wireEvents(menuEl: HTMLElement) {
        menuEl.querySelectorAll<HTMLElement>('.p-menu-item').forEach(li => {
            const link = li.querySelector<HTMLElement>(':scope > .p-menu-item-content > .p-menu-item-link');
            if (!link) return;

            link.addEventListener('click', (e) => {
                const path = li.getAttribute('data-path') || '';
                const key = li.getAttribute('data-key');
                const item = findItemByPath(itemsState, path);

                if (!item || item.disabled) return;

                const isGroup = Array.isArray(item.items) && item.items.length > 0;
                const isToggleableSubmenu = isGroup && (item.toggleable === true || (path.includes('.') && item.toggleable !== false));

                if (isToggleableSubmenu) {
                    e.preventDefault();
                    const isNowExpanded = key ? !expandedKeys[key] : !expandedKeys[path];
                    if (key) {
                        expandedKeys[key] = isNowExpanded;
                    } else {
                        expandedKeys[path] = isNowExpanded;
                    }

                    const wrapper = li.querySelector<HTMLElement>(':scope > .p-menu-submenu-wrapper');
                    const chevron = li.querySelector<HTMLElement>(':scope > .p-menu-item-content .p-menu-item-submenu-icon');

                    if (wrapper) {
                        wrapper.classList.toggle('p-expanded', isNowExpanded);
                    }
                    if (chevron) {
                        chevron.classList.toggle('p-expanded', isNowExpanded);
                    }
                    return;
                }

                // Checkbox toggle
                if (item.checked !== undefined) {
                    e.preventDefault();
                    item.checked = !item.checked;
                    updateContent();
                    return;
                }

                // Radio selection
                if (item.radioGroup && item.radioSelected !== undefined) {
                    e.preventDefault();
                    setRadioSelection(itemsState, item.radioGroup, item);
                    updateContent();
                    return;
                }

                // Command callback / action
                if (item.command || item.action) {
                    e.preventDefault();
                    if (item.command === 'new-file') {
                        showFeedback('File created', 'success');
                    } else if (item.command === 'search') {
                        showFeedback(locale.t('emptyFilterMessage') || 'No results found', 'warn');
                    }
                }

                if (isPopup) {
                    closePopup();
                }
            }, { signal: ctx?.signal });
        });

        // Keyboard navigation
        const links = Array.from(menuEl.querySelectorAll<HTMLElement>('.p-menu-item-link'));
        if (links.length > 0) {
            setRovingTabindex(links, 0);
        }

        const nav = useKeyboardNav({
            itemCount: () => links.length,
            initialIndex: 0,
            orientation: 'vertical',
            onHighlight: (index) => {
                setRovingTabindex(links, index);
                links[index]?.focus();
            },
            onEscape: () => {
                if (isPopup) closePopup();
            }
        });

        menuEl.addEventListener('keydown', (e) => {
            if (nav.handleKeyDown(e)) return;
            const idx = Math.max(0, links.indexOf(document.activeElement as HTMLElement));
            handleRovingKeydown(e, links, idx, 'vertical');
        }, { signal: ctx?.signal });
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
            background: ${severity === 'success' ? 'var(--p-primary-color, #10b981)' : 'var(--p-warn-500, #f59e0b)'};
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
        `;
        toast.textContent = `✓ ${msg}`;
        document.body.appendChild(toast);
        const tToast = setTimeout(() => toast.remove(), 2500);
        ctx?.onCleanup?.(() => clearTimeout(tToast));
    }

    function updateContent() {
        if (isPopup) {
            if (popupEl) {
                setHtml(popupEl, renderMenuHtml());
                const menuEl = popupEl.querySelector<HTMLElement>('.p-menu')!;
                if (menuEl) wireEvents(menuEl);
            }
        } else {
            setHtml(container, renderMenuHtml());
            const menuEl = container.querySelector<HTMLElement>('.p-menu')!;
            if (menuEl) {
                wireEvents(menuEl);
            }
        }
    }

    function openPopup(trigger: HTMLElement) {
        if (menuDisclosure.isOpen) {
            closePopup();
            return;
        }

        popupEl = document.createElement('div');
        popupEl.className = 'p-menu-popup-wrapper';
        setHtml(popupEl, renderMenuHtml());
        document.body.appendChild(popupEl);

        const menuEl = popupEl.querySelector<HTMLElement>('.p-menu')!;
        wireEvents(menuEl);

        menuEl.style.zIndex = '9999';
        floatingCtrl = useFloatingPosition(trigger, menuEl, {
            placement: 'bottom-start',
            offset: 4,
            strategy: 'fixed',
            reposition: 'follow',
            signal: ctx?.signal,
            isRtl: locale.isRtl
        });
        floatingCtrl.update();

        clickOutsideHandler = (e: MouseEvent) => {
            if (popupEl && !popupEl.contains(e.target as Node) && !trigger.contains(e.target as Node)) {
                closePopup();
            }
        };
        outsideClickTimeoutId = setTimeout(() => {
            outsideClickTimeoutId = null;
            if (clickOutsideHandler) {
                document.addEventListener('click', clickOutsideHandler, { signal: ctx?.signal });
            }
        }, 0);

        menuDisclosure.open();
    }

    function closePopup() {
        menuDisclosure.close();
    }

    if (isPopup) {
        container.style.display = 'none';
        const triggerId = props.triggerId || (props as any).TriggerId || container.getAttribute('trigger-id') || container.getAttribute('data-trigger-id');
        if (triggerId) {
            const trigger = document.getElementById(triggerId) || container.parentElement?.querySelector(`#${triggerId}`) || container.parentElement?.querySelector(`button`);
            if (trigger) {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openPopup(trigger);
                }, { signal: ctx?.signal });
            }
        }
    } else {
        updateContent();
    }

    // Programmatic controls for Controlled demo
    (container as any).__expandAll = () => {
        const root = isPopup ? popupEl : container;
        if (!root) return;
        root.querySelectorAll<HTMLElement>('.p-menu-submenu-wrapper').forEach(w => w.classList.add('p-expanded'));
        root.querySelectorAll<HTMLElement>('.p-menu-item-submenu-icon').forEach(c => c.classList.add('p-expanded'));
    };

    (container as any).__collapseAll = () => {
        const root = isPopup ? popupEl : container;
        if (!root) return;
        root.querySelectorAll<HTMLElement>('.p-menu-submenu-wrapper').forEach(w => w.classList.remove('p-expanded'));
        root.querySelectorAll<HTMLElement>('.p-menu-item-submenu-icon').forEach(c => c.classList.remove('p-expanded'));
    };
}
