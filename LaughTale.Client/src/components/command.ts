import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise CommandMenu Component (PrimeVue 4 Aura Design System compliant)
 * Search-driven command palette with unified selection state, root-level keyboard capture,
 * precise viewport scroll tracking, and modal Dialog integration.
 */

import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';
import { useFocusTrap } from '../composables/useFocusTrap';

const COMMAND_CSS = `
.p-commandmenu {
    display: flex;
    flex-direction: column;
    background: var(--p-commandmenu-background, var(--lt-surface-0));
    border: 1px solid var(--p-commandmenu-border-color, var(--lt-surface-200));
    border-radius: var(--p-commandmenu-border-radius, var(--lt-radius));
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    width: 32rem;
    max-width: 100%;
    box-sizing: border-box;
    font-family: inherit;
    position: relative;
    outline: none;
}

.p-commandmenu-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    height: 3.25rem;
    background: var(--p-commandmenu-header-background, transparent);
    border-bottom: 1px solid var(--p-commandmenu-header-border-color, var(--lt-surface-200));
    box-sizing: border-box;
    flex-shrink: 0;
}

.p-commandmenu-search-icon {
    color: var(--lt-surface-400);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.p-commandmenu-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--p-commandmenu-input-color, var(--lt-text-primary));
    padding: 0.25rem 0;
    font-family: inherit;
    min-width: 0;
}

.p-commandmenu-input::placeholder {
    color: var(--p-commandmenu-input-placeholder-color, var(--lt-surface-400));
}

.p-commandmenu-list {
    padding: 0.5rem;
    height: 19rem;
    max-height: 19rem;
    min-height: 19rem;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    box-sizing: border-box;
    position: relative;
    outline: none;
}

.p-commandmenu-group {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    position: static;
}

.p-commandmenu-group-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--lt-surface-400);
    padding: 0.35rem 0.65rem 0.2rem;
    text-transform: none;
    letter-spacing: normal;
    user-select: none;
}

.p-commandmenu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.65rem;
    border-radius: var(--lt-radius);
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--lt-text-primary);
    transition: background-color 0.1s ease, color 0.1s ease;
    user-select: none;
    outline: none;
    box-sizing: border-box;
    min-height: 2.25rem;
}

.p-commandmenu-item:hover,
.p-commandmenu-item.p-commandmenu-item-focus {
    background: var(--lt-surface-100) !important;
    color: var(--lt-text-primary) !important;
}

.p-commandmenu-item.p-commandmenu-item-focus {
    background: var(--lt-surface-100) !important;
    color: var(--lt-primary-600) !important;
}

.p-commandmenu-item.p-commandmenu-item-active {
    background: rgba(59, 130, 246, 0.15) !important;
}

.p-commandmenu-item-left {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    min-width: 0;
    flex: 1;
}

.p-commandmenu-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--lt-surface-500);
    flex-shrink: 0;
}

.p-commandmenu-item-icon-badge {
    width: 1.35rem;
    height: 1.35rem;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--lt-surface-0, var(--lt-surface-0));
    flex-shrink: 0;
    font-size: 0.75rem;
}

.p-commandmenu-item-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
}

.p-commandmenu-item-category {
    font-size: 0.75rem;
    color: var(--p-text-muted, var(--lt-surface-400));
    margin-left: auto;
    opacity: 0.7;
    flex-shrink: 0;
}

.p-commandmenu-empty-message {
    padding: 2.5rem 1rem;
    text-align: center;
    font-size: 0.875rem;
    color: var(--lt-surface-500);
}

.p-commandmenu-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0.625rem 1rem;
    height: 2.75rem;
    background: var(--p-commandmenu-footer-background, var(--lt-surface-50));
    border-top: 1px solid var(--p-commandmenu-footer-border-color, var(--lt-surface-200));
    flex-shrink: 0;
    box-sizing: border-box;
}

.p-commandmenu-footer-content {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    font-size: 0.75rem;
    color: var(--lt-surface-500);
}

.p-commandmenu-kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--lt-surface-100);
    border: 1px solid var(--lt-surface-200);
    border-radius: 4px;
    padding: 0 0.35rem;
    min-width: 1.25rem;
    height: 1.25rem;
    font-family: inherit;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--lt-surface-700);
}

/* Dialog Overlay */
.p-commandmenu-dialog-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 14vh;
}

.p-commandmenu-dialog-card {
    width: 32rem;
    max-width: 100%;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border-radius: var(--p-border-radius-xl, 10px);
    overflow: hidden;
}

/* Dark Mode Tokens */
html.dark .p-commandmenu,
[data-theme="dark"] .p-commandmenu,
.dark .p-commandmenu {
    background: var(--p-surface-0, #090d16);
    border-color: var(--p-border-color, #334155);
}

html.dark .p-commandmenu-header,
[data-theme="dark"] .p-commandmenu-header,
.dark .p-commandmenu-header {
    border-color: var(--p-border-color, #334155);
}

html.dark .p-commandmenu-input,
[data-theme="dark"] .p-commandmenu-input,
.dark .p-commandmenu-input {
    color: var(--p-text-color, #f8fafc);
}

html.dark .p-commandmenu-item,
[data-theme="dark"] .p-commandmenu-item,
.dark .p-commandmenu-item {
    color: var(--p-text-color, #f8fafc);
}

html.dark .p-commandmenu-item:hover,
html.dark .p-commandmenu-item.p-commandmenu-item-focus,
[data-theme="dark"] .p-commandmenu-item:hover,
[data-theme="dark"] .p-commandmenu-item.p-commandmenu-item-focus,
.dark .p-commandmenu-item:hover,
.dark .p-commandmenu-item.p-commandmenu-item-focus {
    background: var(--p-surface-100, #1e293b) !important;
    color: var(--p-text-color, #f8fafc) !important;
}

html.dark .p-commandmenu-group-label,
[data-theme="dark"] .p-commandmenu-group-label,
.dark .p-commandmenu-group-label {
    color: var(--p-text-muted, #94a3b8);
}

html.dark .p-commandmenu-footer,
[data-theme="dark"] .p-commandmenu-footer,
.dark .p-commandmenu-footer {
    background: var(--p-surface-50, #0f172a);
    border-color: var(--p-border-color, #334155);
}

html.dark .p-commandmenu-kbd,
[data-theme="dark"] .p-commandmenu-kbd,
.dark .p-commandmenu-kbd {
    background: var(--p-surface-100, #1e293b);
    border-color: var(--p-border-color, #334155);
    color: var(--p-text-muted, #94a3b8);
}
`;

export interface CommandMenuItem {
    label: string;
    icon?: string;
    category?: string;
    color?: string;
    keywords?: string[];
    shortcut?: string;
    url?: string;
    action?: string;
    disabled?: boolean;
}

export interface CommandMenuGroup {
    label: string;
    items: CommandMenuItem[];
}

export interface CommandMenuProps {
    model?: any[];
    placeholder?: string;
    search?: string;
    filter?: 'default' | 'fuzzy';
    withDialog?: boolean;
    hotkey?: string;
    customTemplate?: boolean;
    emptyMessage?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

export default function CommandMenuIsland(container: HTMLElement, props: CommandMenuProps, ctx?: IslandContext) {
    injectIslandStyle('commandmenu', COMMAND_CSS);

    const placeholder = props.placeholder || (props as any).Placeholder || 'Search for commands...';
    const filterType = props.filter || (props as any).Filter || 'default';
    const withDialog = props.withDialog || (props as any).WithDialog || false;
    const customTemplate = props.customTemplate || (props as any).CustomTemplate || false;

    // Normalize raw items from PascalCase or camelCase
    function normalizeGroups(rawList: any[]): CommandMenuGroup[] {
        if (!Array.isArray(rawList)) return [];
        return rawList.map(g => {
            const groupLabel = g.label || g.Label || '';
            const rawItems = g.items || g.Items || [];
            const items: CommandMenuItem[] = Array.isArray(rawItems) ? rawItems.map((it: any) => ({
                label: it.label || it.Label || '',
                icon: it.icon || it.Icon,
                category: it.category || it.Category,
                color: it.color || it.Color,
                keywords: it.keywords || it.Keywords || [],
                shortcut: it.shortcut || it.Shortcut,
                url: it.url || it.Url,
                action: it.action || it.Action,
                disabled: it.disabled || it.Disabled || false
            })) : [];

            return {
                label: groupLabel,
                items
            };
        });
    }

    const rawModel = props.model || (props as any).Model || [];
    const groups: CommandMenuGroup[] = normalizeGroups(rawModel);

    let search = props.search || (props as any).Search || '';
    let selectedIndex = 0;
    let isDialogOpen = false;
    let isUsingKeyboard = false;

    function fuzzyScore(value: string, query: string): number {
        if (!query) return 1;
        const v = value.toLowerCase();
        const q = query.toLowerCase();
        let ti = 0;
        let qi = 0;
        let score = 0;

        while (ti < v.length && qi < q.length) {
            if (v[ti] === q[qi]) {
                score += 1;
                qi++;
            }
            ti++;
        }

        return qi === q.length ? score / v.length : 0;
    }

    function getFilteredGroups(): CommandMenuGroup[] {
        const q = search.trim().toLowerCase();
        if (!q) return groups;

        const result: CommandMenuGroup[] = [];

        groups.forEach(g => {
            const matchedItems = g.items.filter(it => {
                const label = (it.label || '').toLowerCase();
                const keywords = (it.keywords || []).map(k => k.toLowerCase()).join(' ');

                if (filterType === 'fuzzy') {
                    return fuzzyScore(label, q) > 0 || (keywords && fuzzyScore(keywords, q) > 0);
                } else {
                    return label.includes(q) || keywords.includes(q);
                }
            });

            if (matchedItems.length > 0) {
                result.push({
                    label: g.label,
                    items: matchedItems
                });
            }
        });

        return result;
    }

    function getIconSvg(iconName?: string): string {
        if (!iconName) return '';
        if (iconName.startsWith('<svg')) return iconName;
        if ((LucideIcons as any)[iconName]) return (LucideIcons as any)[iconName];
        return '';
    }

    function setupCommandMenu(targetEl: HTMLElement) {
        const arrowUpSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
        const arrowDownSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

        targetEl.innerHTML = `
            <div class="p-commandmenu p-component" tabindex="0" ${withDialog ? 'style="border: none; box-shadow: none; width: 100%;"' : ''}>
                <div class="p-commandmenu-header">
                    <span class="p-commandmenu-search-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </span>
                    <input type="text" class="p-commandmenu-input" placeholder="${placeholder}" value="${search}" />
                </div>
                <div class="p-commandmenu-list" tabindex="-1"></div>
                <div class="p-commandmenu-footer">
                    <div class="p-commandmenu-footer-content">
                        <span style="display:inline-flex; align-items:center; gap: 0.35rem;">
                            <kbd class="p-commandmenu-kbd">${arrowUpSvg}</kbd>
                            <kbd class="p-commandmenu-kbd">${arrowDownSvg}</kbd>
                            Navigate
                        </span>
                        <span style="display:inline-flex; align-items:center; gap: 0.35rem;">
                            <kbd class="p-commandmenu-kbd">↵</kbd>
                            Select
                        </span>
                    </div>
                </div>
            </div>
        `;

        const rootEl = targetEl.querySelector<HTMLElement>('.p-commandmenu')!;
        const input = targetEl.querySelector<HTMLInputElement>('.p-commandmenu-input')!;
        const listEl = targetEl.querySelector<HTMLElement>('.p-commandmenu-list')!;

        listEl.addEventListener('mousemove', () => {
            isUsingKeyboard = false;
        });

        function ensureVisible(itemEl: HTMLElement) {
            const containerRect = listEl.getBoundingClientRect();
            const itemRect = itemEl.getBoundingClientRect();

            if (itemRect.top < containerRect.top) {
                listEl.scrollTop -= (containerRect.top - itemRect.top);
            } else if (itemRect.bottom > containerRect.bottom) {
                listEl.scrollTop += (itemRect.bottom - containerRect.bottom);
            }
        }

        function selectItem(index: number, shouldScroll: boolean) {
            const items = listEl.querySelectorAll<HTMLElement>('.p-commandmenu-item');
            if (items.length === 0) return;

            selectedIndex = Math.max(0, Math.min(index, items.length - 1));

            items.forEach((item, i) => {
                const isSelected = i === selectedIndex;
                item.classList.toggle('p-commandmenu-item-focus', isSelected);
                item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
            });

            if (shouldScroll && items[selectedIndex]) {
                ensureVisible(items[selectedIndex]);
            }
        }

        function renderListOnly() {
            const filtered = getFilteredGroups();
            let flatIndex = 0;
            const totalItems = filtered.reduce((acc, g) => acc + g.items.length, 0);

            if (selectedIndex >= totalItems) {
                selectedIndex = Math.max(0, totalItems - 1);
            }

            if (totalItems === 0) {
                const emptyMsg = props.emptyMessage || (props as any).EmptyMessage;
                listEl.innerHTML = `
                    <div class="p-commandmenu-empty-message">
                        ${emptyMsg ? emptyMsg : (search ? `No results found for <strong>"${search}"</strong>` : 'No results found')}
                    </div>
                `;
                return;
            }

            let listHtml = '';
            filtered.forEach(g => {
                let itemsHtml = '';
                g.items.forEach(it => {
                    const isFocused = flatIndex === selectedIndex;
                    const iconSvg = getIconSvg(it.icon);

                    let itemLeftHtml = '';
                    if (customTemplate) {
                        const bgStyle = it.color || 'background: var(--lt-primary-500);';
                        const isGradient = bgStyle.startsWith('bg-[') || bgStyle.includes('linear-gradient');
                        const inlineBg = isGradient 
                            ? (bgStyle.startsWith('bg-[') ? bgStyle.replace('bg-[', 'background: ').replace(']', ';') : `background: ${bgStyle};`)
                            : (bgStyle.startsWith('background') ? bgStyle : `background: ${bgStyle};`);

                        itemLeftHtml = `
                            <div class="p-commandmenu-item-left">
                                <span class="p-commandmenu-item-icon-badge" style="${inlineBg}">
                                    ${iconSvg ? `<span style="display:flex; transform:scale(0.8);">${iconSvg}</span>` : '⚡'}
                                </span>
                                <span class="p-commandmenu-item-label">${it.label}</span>
                                ${it.category ? `<span class="p-commandmenu-item-category">${it.category}</span>` : ''}
                            </div>
                        `;
                    } else {
                        itemLeftHtml = `
                            <div class="p-commandmenu-item-left">
                                ${iconSvg ? `<span class="p-commandmenu-item-icon">${iconSvg}</span>` : ''}
                                <span class="p-commandmenu-item-label">${it.label}</span>
                            </div>
                        `;
                    }

                    itemsHtml += `
                        <div class="p-commandmenu-item ${isFocused ? 'p-commandmenu-item-focus' : ''}" 
                             data-flat-index="${flatIndex}" 
                             data-label="${it.label}"
                             data-url="${it.url || ''}" 
                             data-action="${it.action || ''}">
                            ${itemLeftHtml}
                            ${it.shortcut ? `<kbd class="p-commandmenu-kbd">${it.shortcut}</kbd>` : ''}
                        </div>
                    `;
                    flatIndex++;
                });

                listHtml += `
                    <div class="p-commandmenu-group">
                        <div class="p-commandmenu-group-label">${g.label}</div>
                        ${itemsHtml}
                    </div>
                `;
            });

            listEl.innerHTML = listHtml;

            // Wire hover & click events on items
            listEl.querySelectorAll<HTMLElement>('.p-commandmenu-item').forEach(el => {
                el.addEventListener('mousemove', () => {
                    isUsingKeyboard = false;
                });
                el.addEventListener('mouseenter', () => {
                    if (isUsingKeyboard) return;
                    const idx = Number(el.getAttribute('data-flat-index'));
                    selectItem(idx, false);
                });
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    isUsingKeyboard = false;
                    const idx = Number(el.getAttribute('data-flat-index'));
                    selectItem(idx, false);
                    executeSelectedItem();
                    input.focus({ preventScroll: true });
                });
            });

            selectItem(selectedIndex, false);
        }

        function executeSelectedItem() {
            const activeEl = listEl.querySelector<HTMLElement>(`.p-commandmenu-item[data-flat-index="${selectedIndex}"]`);
            if (!activeEl) return;

            const url = activeEl.getAttribute('data-url');
            const action = activeEl.getAttribute('data-action');

            activeEl.classList.add('p-commandmenu-item-active');
            setTimeout(() => activeEl.classList.remove('p-commandmenu-item-active'), 150);

            if (withDialog) {
                setTimeout(() => closeDialog(), 150);
            }

            if (url) {
                window.location.href = url;
            } else if (action === 'toggle-dark') {
                document.documentElement.classList.toggle('dark');
                localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
            }
        }

        // Live input typing
        input.addEventListener('input', () => {
            search = input.value;
            selectedIndex = 0;
            renderListOnly();
        });

        // Universal keyboard handler on the entire command palette container
        function handleKeyDown(e: KeyboardEvent) {
            const items = listEl.querySelectorAll<HTMLElement>('.p-commandmenu-item');
            const count = items.length;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                e.stopPropagation();
                isUsingKeyboard = true;
                if (count > 0) {
                    const nextIdx = (selectedIndex + 1) % count;
                    selectItem(nextIdx, true);
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                e.stopPropagation();
                isUsingKeyboard = true;
                if (count > 0) {
                    const prevIdx = (selectedIndex - 1 + count) % count;
                    selectItem(prevIdx, true);
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                executeSelectedItem();
            } else if (e.key === 'Home') {
                e.preventDefault();
                e.stopPropagation();
                isUsingKeyboard = true;
                if (count > 0) {
                    selectItem(0, true);
                }
            } else if (e.key === 'End') {
                e.preventDefault();
                e.stopPropagation();
                isUsingKeyboard = true;
                if (count > 0) {
                    selectItem(count - 1, true);
                }
            } else if (e.key === 'Escape') {
                if (withDialog) {
                    e.preventDefault();
                    closeDialog();
                } else if (search) {
                    e.preventDefault();
                    input.value = '';
                    search = '';
                    selectedIndex = 0;
                    renderListOnly();
                }
            }
        }

        rootEl.addEventListener('keydown', handleKeyDown);

        renderListOnly();
    }

    function openDialog() {
        if (isDialogOpen) return;
        isDialogOpen = true;

        const backdrop = document.createElement('div');
        backdrop.className = 'p-commandmenu-dialog-backdrop';
        backdrop.innerHTML = `
            <div class="p-commandmenu-dialog-card"></div>
        `;

        document.body.appendChild(backdrop);

        const card = backdrop.querySelector<HTMLElement>('.p-commandmenu-dialog-card')!;
        setupCommandMenu(card);

        const input = card.querySelector<HTMLInputElement>('.p-commandmenu-input');
        input?.focus();

        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeDialog();
            }
        });

        useFocusTrap(card, { initialFocusElement: input || undefined });
    }

    function closeDialog() {
        isDialogOpen = false;
        const backdrop = document.querySelector('.p-commandmenu-dialog-backdrop');
        if (backdrop) backdrop.remove();
    }

    if (withDialog) {
        container.innerHTML = `
            <div class="p-commandmenu-dialog-trigger-wrapper" style="display: flex; align-items: center; justify-content: center; padding: 2rem 0;">
                <span class="p-commandmenu-dialog-trigger" style="cursor: pointer; font-size: 0.9375rem; color: var(--lt-text-primary); display: inline-flex; align-items: center;">
                    Press <kbd class="p-commandmenu-kbd" style="margin-left: 0.5rem; padding: 0.25rem 0.6rem; height: auto; font-size: 0.8125rem; font-weight: 600; background: var(--lt-surface-100); border: 1px solid var(--lt-surface-200); border-radius: 6px;">CTRL/⌘ + L</kbd>
                </span>
            </div>
        `;

        container.querySelector('.p-commandmenu-dialog-trigger')?.addEventListener('click', () => {
            openDialog();
        });

        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                if (isDialogOpen) {
                    closeDialog();
                } else {
                    openDialog();
                }
            }
        });
    } else {
        setupCommandMenu(container);
    }
}
