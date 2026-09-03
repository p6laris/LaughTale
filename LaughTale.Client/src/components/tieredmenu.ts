import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { useFloatingPosition } from '../composables/useFloatingPosition';
﻿/**
 * LaughTale: Enterprise TieredMenu Component (LaughTale Aura Design System)
 * Hierarchical vertical navigation menu with nested flyout overlay submenus,
 * inline/popup trigger modes, custom item templates (badges & shortcuts), action commands,
 * router links, and complete WAI-ARIA keyboard navigation & accessibility.
 */

import { MenuItem } from '../types/models';
import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';
import { emitIslandEvent } from '../runtime/events';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import { setRovingTabindex, handleRovingKeydown } from '../accessibility/aria';
import { useKeyboardNav } from '../composables/useKeyboardNav';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'menu'
};

const TIEREDMENU_CSS = `
/* ==========================================================================
   LaughTale Aura TieredMenu Component Tokens & Layout
   ========================================================================== */
.p-tieredmenu {
    display: inline-block;
    min-width: 14rem;
    background: var(--p-tieredmenu-background, var(--lt-surface-0));
    border: 1px solid var(--p-tieredmenu-border-color, var(--lt-surface-200));
    border-radius: var(--p-tieredmenu-border-radius, var(--lt-radius));
    color: var(--p-tieredmenu-color, var(--lt-text-primary));
    padding: var(--p-tieredmenu-list-padding, 0.25rem);
    box-shadow: var(--p-tieredmenu-shadow, 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05));
    box-sizing: border-box;
    position: relative;
    font-family: var(--p-font-family, inherit);
    user-select: none;
}

.p-tieredmenu-overlay {
    position: absolute;
    z-index: 1050;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    animation: p-tieredmenu-pop-in 160ms cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: top left;
}

@keyframes p-tieredmenu-pop-in {
    from {
        opacity: 0;
        transform: scale(0.96) translateY(-4px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.p-tieredmenu-root-list,
.p-tieredmenu-submenu {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--p-tieredmenu-list-gap, 2px);
    box-sizing: border-box;
}

.p-tieredmenu-item {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.p-tieredmenu-item-content {
    display: block;
    box-sizing: border-box;
}

.p-tieredmenu-item-link {
    display: flex;
    align-items: center;
    gap: var(--p-tieredmenu-item-gap, 0.5rem);
    padding: var(--p-tieredmenu-item-padding, 0.45rem 0.75rem);
    border-radius: var(--p-tieredmenu-item-border-radius, var(--lt-radius));
    color: var(--p-tieredmenu-item-color, var(--lt-text-primary));
    text-decoration: none;
    cursor: pointer;
    font-size: var(--p-tieredmenu-item-label-font-size, 0.875rem);
    font-weight: var(--p-tieredmenu-item-label-font-weight, 500);
    transition: background-color 120ms ease, color 120ms ease;
    box-sizing: border-box;
    white-space: nowrap;
    outline: none;
    user-select: none;
}

.p-tieredmenu-item-link:hover,
.p-tieredmenu-item-link:focus-visible,
.p-tieredmenu-item.p-active > .p-tieredmenu-item-content > .p-tieredmenu-item-link {
    background: var(--p-tieredmenu-item-focus-background, var(--lt-surface-100));
    color: var(--p-tieredmenu-item-focus-color, var(--lt-text-primary));
}

.p-tieredmenu-item.p-disabled > .p-tieredmenu-item-content > .p-tieredmenu-item-link {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.p-tieredmenu-item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--p-tieredmenu-item-icon-size, 1rem);
    height: var(--p-tieredmenu-item-icon-size, 1rem);
    flex-shrink: 0;
    color: var(--p-tieredmenu-item-icon-color, var(--lt-surface-500));
    transition: color 120ms ease;
}

.p-tieredmenu-item-link:hover .p-tieredmenu-item-icon,
.p-tieredmenu-item.p-active > .p-tieredmenu-item-content > .p-tieredmenu-item-link .p-tieredmenu-item-icon {
    color: var(--p-tieredmenu-item-icon-focus-color, var(--lt-surface-700));
}

.p-tieredmenu-item-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.p-tieredmenu-badge {
    margin-left: auto;
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.1rem 0.4rem;
    border-radius: 9999px;
    background: var(--lt-surface-200);
    color: var(--lt-surface-700);
    flex-shrink: 0;
}

.p-tieredmenu-shortcut {
    margin-left: auto;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.1rem 0.35rem;
    border-radius: var(--lt-radius);
    background: var(--lt-surface-100);
    border: 1px solid var(--lt-surface-200);
    color: var(--p-text-muted, var(--lt-surface-500));
    font-family: inherit;
    flex-shrink: 0;
}

.p-tieredmenu-submenu-icon {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--p-tieredmenu-submenu-icon-size, 0.875rem);
    height: var(--p-tieredmenu-submenu-icon-size, 0.875rem);
    color: var(--p-tieredmenu-submenu-icon-color, var(--lt-surface-400));
    flex-shrink: 0;
    transition: transform 120ms ease;
}

.p-tieredmenu-separator {
    height: 1px;
    background: var(--p-tieredmenu-separator-border-color, var(--lt-surface-200));
    margin: 0.25rem 0;
    list-style: none;
    box-sizing: border-box;
}

/* Submenu Overlay Positioning & Animation */
.p-tieredmenu-submenu {
    position: absolute;
    top: 0;
    left: 100%;
    margin-left: 0.25rem;
    min-width: 14rem;
    background: var(--p-tieredmenu-background, var(--lt-surface-0));
    border: 1px solid var(--p-tieredmenu-border-color, var(--lt-surface-200));
    border-radius: var(--p-tieredmenu-border-radius, var(--lt-radius));
    padding: var(--p-tieredmenu-list-padding, 0.25rem);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08);
    z-index: 1051;
    animation: p-tieredmenu-flyout-enter 160ms cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: top left;
}

.p-tieredmenu-submenu.p-flipped-left {
    left: auto;
    right: 100%;
    margin-left: 0;
    margin-right: 0.25rem;
    transform-origin: top right;
}

@keyframes p-tieredmenu-flyout-enter {
    from {
        opacity: 0;
        transform: scale(0.96) translateX(-4px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateX(0);
    }
}

/* Dark Mode Theme Tokens */
html.dark .p-tieredmenu,
[data-theme="dark"] .p-tieredmenu,
.dark .p-tieredmenu {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    color: var(--p-text-color);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}

html.dark .p-tieredmenu-submenu,
[data-theme="dark"] .p-tieredmenu-submenu,
.dark .p-tieredmenu-submenu {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    color: var(--p-text-color);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}

html.dark .p-tieredmenu-item-link,
[data-theme="dark"] .p-tieredmenu-item-link,
.dark .p-tieredmenu-item-link {
    color: var(--p-text-color);
}

html.dark .p-tieredmenu-item-link:hover,
html.dark .p-tieredmenu-item-link:focus-visible,
html.dark .p-tieredmenu-item.p-active > .p-tieredmenu-item-content > .p-tieredmenu-item-link,
[data-theme="dark"] .p-tieredmenu-item-link:hover,
[data-theme="dark"] .p-tieredmenu-item-link:focus-visible,
[data-theme="dark"] .p-tieredmenu-item.p-active > .p-tieredmenu-item-content > .p-tieredmenu-item-link,
.dark .p-tieredmenu-item-link:hover,
.dark .p-tieredmenu-item-link:focus-visible,
.dark .p-tieredmenu-item.p-active > .p-tieredmenu-item-content > .p-tieredmenu-item-link {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}

html.dark .p-tieredmenu-separator,
[data-theme="dark"] .p-tieredmenu-separator,
.dark .p-tieredmenu-separator {
    background: var(--p-border-color);
}

html.dark .p-tieredmenu-shortcut,
[data-theme="dark"] .p-tieredmenu-shortcut,
.dark .p-tieredmenu-shortcut {
    background: var(--p-surface-100);
    border-color: var(--p-border-color);
    color: var(--p-text-muted);
}

html.dark .p-tieredmenu-badge,
[data-theme="dark"] .p-tieredmenu-badge,
.dark .p-tieredmenu-badge {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}
`;

export interface TieredMenuProps {
    model?: MenuItem[];
    items?: MenuItem[];
    popup?: boolean;
    triggerId?: string;
    triggerText?: string;
    triggerIcon?: string;
    triggerVariant?: string;
    triggerSeverity?: string;
    customTemplate?: boolean;
    autoZIndex?: boolean;
    baseZIndex?: number;
    breakpoint?: string;
    class?: string;
    style?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

export default function TieredMenuIsland(container: HTMLElement, props: TieredMenuProps, ctx?: IslandContext) {
    injectIslandStyle('tieredmenu', TIEREDMENU_CSS);

    const model: MenuItem[] = props.model || props.items || [];
    const isPopup = props.popup === true;
    let isOpen = !isPopup;

    function getIconSvg(iconName?: string): string {
        if (!iconName) return '';
        if (iconName.startsWith('<svg')) return iconName;
        // Map common Icons names to Lucide icons
        const iconMap: Record<string, string> = {
            'pi-file': 'file',
            'pi-file-edit': 'fileEdit',
            'pi-folder-open': 'folderOpen',
            'pi-image': 'image',
            'pi-plus': 'plus',
            'pi-print': 'print',
            'pi-search': 'search',
            'pi-share-alt': 'share2',
            'pi-slack': 'slack',
            'pi-times': 'trash2',
            'pi-video': 'video',
            'pi-whatsapp': 'phone',
            'pi-copy': 'copy',
            'pi-cloud': 'cloud',
            'pi-cloud-download': 'cloudDownload',
            'pi-cloud-upload': 'cloudUpload',
            'pi-palette': 'palette',
            'pi-link': 'link',
            'pi-home': 'home'
        };

        const mapped = iconMap[iconName] || iconName;
        if ((LucideIcons as any)[mapped]) return (LucideIcons as any)[mapped];
        return '';
    }

    const chevronRightSvg = `<svg class="p-tieredmenu-submenu-icon" data-part="root" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;

    function renderMenuItems(itemsList: MenuItem[], level: number = 0): Raw[] {
        return itemsList.map((item, idx) => {
            if (item.Separator || (item as any).separator) {
                return html`<li class="p-tieredmenu-separator" role="separator"></li>`;
            }

            const label = item.Label || item.label || '';
            const iconName = item.Icon || item.icon || '';
            const iconSvg = getIconSvg(iconName);
            const disabled = item.Disabled || item.disabled || false;
            const subItems = item.Items || item.items || [];
            const hasSubmenu = Array.isArray(subItems) && subItems.length > 0;
            const shortcut = item.Shortcut || item.shortcut || '';
            const badge = item.Badge || item.badge || '';
            const url = item.Url || item.url || item.Route || item.route || '';
            const command = item.Command || item.command || '';

            const subTreeHtml = hasSubmenu 
                ? html`<ul class="p-tieredmenu-submenu" role="menu" style="display: none;">${renderMenuItems(subItems, level + 1)}</ul>` 
                : '';

            const badgeHtml = badge ? html`<span class="p-tieredmenu-badge aura-tag tag-emerald">${badge}</span>` : '';
            const shortcutHtml = shortcut ? html`<span class="p-tieredmenu-shortcut">${shortcut}</span>` : '';
            const submenuArrow = hasSubmenu ? unsafe(chevronRightSvg) : '';
            const href = url ? safeUrl(url) : 'javascript:void(0)';

            return html`
                <li class="p-tieredmenu-item ${disabled ? 'p-disabled' : ''}" role="none" data-level="${level}">
                    <div class="p-tieredmenu-item-content">
                        <a class="p-tieredmenu-item-link"
                           role="menuitem"
                           tabindex="${disabled ? -1 : 0}"
                           ${hasSubmenu ? 'aria-haspopup="true" aria-expanded="false"' : ''}
                           href="${href}"
                           ${attr('data-command', command)}
                           data-item-label="${label}"
                           ${attr('target', item.Target || item.target)}>
                            ${iconSvg ? html`<span class="p-tieredmenu-item-icon">${unsafe(iconSvg)}</span>` : ''}
                            <span class="p-tieredmenu-item-label">${label}</span>
                            ${badgeHtml}
                            ${shortcutHtml}
                            ${submenuArrow}
                        </a>
                    </div>
                    ${subTreeHtml}
                </li>
            `;
        });
    }

    function renderComponent(): Raw {
        const rootClasses = [
            'p-tieredmenu',
            isPopup ? 'p-tieredmenu-overlay' : '',
            props.class || ''
        ].filter(Boolean).join(' ');

        const menuHtml = html`
            <div class="${rootClasses}" ${isPopup ? 'style="display: none;"' : ''} data-tieredmenu-root role="menu">
                <ul class="p-tieredmenu-root-list" role="none">
                    ${renderMenuItems(model)}
                </ul>
            </div>
        `;

        if (isPopup && props.triggerText) {
            const triggerVariant = props.triggerVariant || 'outlined';
            const triggerSeverity = props.triggerSeverity || 'primary';
            const iconSvg = props.triggerIcon ? getIconSvg(props.triggerIcon) : '';

            return html`
                <div class="p-tieredmenu-wrapper" style="position: relative; display: inline-block;">
                    <button type="button" class="p-button p-button-${triggerSeverity} ${triggerVariant === 'outlined' ? 'p-button-outlined' : ''}" data-tieredmenu-trigger aria-haspopup="true" aria-expanded="false">
                        ${iconSvg ? html`<span class="p-button-icon">${unsafe(iconSvg)}</span>` : ''}
                        <span class="p-button-label">${props.triggerText}</span>
                    </button>
                    ${menuHtml}
                </div>
            `;
        }

        return menuHtml;
    }

    function wireEvents() {
        const rootEl = container.querySelector<HTMLElement>('[data-tieredmenu-root]');
        if (!rootEl) return;

        // Position & Toggle Popup Mode
        let popupFloatingCtrl: { update(): void; destroy(): void } | null = null;
        if (isPopup) {
            const triggerEl = container.querySelector<HTMLElement>('[data-tieredmenu-trigger]') 
                || (props.triggerId ? document.getElementById(props.triggerId) : null);

            const togglePopup = (targetEl: HTMLElement) => {
                isOpen = !isOpen;
                if (isOpen) {
                    rootEl.style.display = 'block';
                    triggerEl?.setAttribute('aria-expanded', 'true');

                    popupFloatingCtrl?.destroy();
                    const effectiveSignal = ctx?.signal || new AbortController().signal;
                    popupFloatingCtrl = useFloatingPosition(targetEl, rootEl, {
                        placement: 'bottom-start',
                        offset: 4,
                        strategy: 'absolute',
                        boundary: (rootEl.offsetParent as HTMLElement) || undefined,
                        reposition: 'follow',
                        signal: effectiveSignal
                    });
                    popupFloatingCtrl.update();
                } else {
                    if (popupFloatingCtrl) {
                        popupFloatingCtrl.destroy();
                        popupFloatingCtrl = null;
                    }
                    rootEl.style.display = 'none';
                    triggerEl?.setAttribute('aria-expanded', 'false');
                    closeAllSubmenus(rootEl);
                }
            };

            if (triggerEl) {
                triggerEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    togglePopup(triggerEl);
                }, { signal: ctx?.signal });
            }

            // Expose .toggle API on DOM element
            (container as any).toggle = (e?: Event) => {
                const target = (e?.currentTarget as HTMLElement) || triggerEl || container;
                togglePopup(target);
            };

            // Global click outside dismiss
            document.addEventListener('click', (e) => {
                if (isOpen && !rootEl.contains(e.target as Node) && (!triggerEl || !triggerEl.contains(e.target as Node))) {
                    isOpen = false;
                    if (popupFloatingCtrl) {
                        popupFloatingCtrl.destroy();
                        popupFloatingCtrl = null;
                    }
                    rootEl.style.display = 'none';
                    triggerEl?.setAttribute('aria-expanded', 'false');
                    closeAllSubmenus(rootEl);
                }
            }, { signal: ctx?.signal });
        }

        // Flyout Cascading Submenus Behavior
        const openSubmenuTimers = new Map<HTMLElement, number>();

        function closeAllSubmenus(parent: HTMLElement) {
            parent.querySelectorAll<HTMLElement>('.p-tieredmenu-submenu').forEach(sub => {
                sub.style.display = 'none';
                sub.classList.remove('p-flipped-left');
                const link = sub.parentElement?.querySelector('.p-tieredmenu-item-link');
                link?.setAttribute('aria-expanded', 'false');
            });
            parent.querySelectorAll<HTMLElement>('.p-tieredmenu-item.p-active').forEach(it => {
                it.classList.remove('p-active');
            });
        }

        function openSubmenu(li: HTMLElement) {
            const sub = li.querySelector<HTMLElement>(':scope > .p-tieredmenu-submenu');
            if (!sub) return;

            // Close sibling submenus
            const siblingUl = li.parentElement;
            if (siblingUl) {
                siblingUl.querySelectorAll<HTMLElement>(':scope > .p-tieredmenu-item').forEach(sib => {
                    if (sib !== li) {
                        sib.classList.remove('p-active');
                        const sibSub = sib.querySelector<HTMLElement>(':scope > .p-tieredmenu-submenu');
                        if (sibSub) {
                            sibSub.style.display = 'none';
                            sibSub.classList.remove('p-flipped-left');
                            sib.querySelector('.p-tieredmenu-item-link')?.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
            }

            li.classList.add('p-active');
            sub.style.display = 'block';
            li.querySelector('.p-tieredmenu-item-link')?.setAttribute('aria-expanded', 'true');

            // Submenu collision detection: flip left when right edge overflows
            const subFloatingCtrl = useFloatingPosition(li, sub, {
                placement: 'right-start',
                offset: 4,
                strategy: 'absolute',
                boundary: (rootEl?.offsetParent as HTMLElement) || undefined,
                axis: 'x',
                reposition: 'none'
            });
            const coords = subFloatingCtrl.computePosition();
            if (coords.actualPlacement.startsWith('left')) {
                sub.classList.add('p-flipped-left');
            } else {
                sub.classList.remove('p-flipped-left');
            }
            sub.style.left = '';
        }

        function scheduleCloseSubmenu(li: HTMLElement) {
            const timer = window.setTimeout(() => {
                li.classList.remove('p-active');
                const sub = li.querySelector<HTMLElement>(':scope > .p-tieredmenu-submenu');
                if (sub) {
                    sub.style.display = 'none';
                    sub.classList.remove('p-flipped-left');
                    li.querySelector('.p-tieredmenu-item-link')?.setAttribute('aria-expanded', 'false');
                }
            }, 120);
            openSubmenuTimers.set(li, timer);
        }

        container.querySelectorAll<HTMLElement>('.p-tieredmenu-item').forEach(li => {
            const hasSub = li.querySelector(':scope > .p-tieredmenu-submenu') !== null;

            li.addEventListener('mouseenter', () => {
                if (openSubmenuTimers.has(li)) {
                    clearTimeout(openSubmenuTimers.get(li));
                    openSubmenuTimers.delete(li);
                }
                if (hasSub) {
                    openSubmenu(li);
                } else {
                    // Close sibling submenus when hovering leaf item
                    const siblingUl = li.parentElement;
                    if (siblingUl) {
                        siblingUl.querySelectorAll<HTMLElement>(':scope > .p-tieredmenu-item').forEach(sib => {
                            if (sib !== li) {
                                sib.classList.remove('p-active');
                                const sibSub = sib.querySelector<HTMLElement>(':scope > .p-tieredmenu-submenu');
                                if (sibSub) {
                                    sibSub.style.display = 'none';
                                    sibSub.classList.remove('p-flipped-left');
                                }
                            }
                        });
                    }
                }
            }, { signal: ctx?.signal });

            li.addEventListener('mouseleave', () => {
                if (hasSub) {
                    scheduleCloseSubmenu(li);
                }
            }, { signal: ctx?.signal });
        });

        // Command & Item Click Handling
        container.querySelectorAll<HTMLElement>('.p-tieredmenu-item-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const li = link.closest('.p-tieredmenu-item') as HTMLElement;
                const hasSub = li?.querySelector(':scope > .p-tieredmenu-submenu') !== null;

                if (hasSub) {
                    e.preventDefault();
                    openSubmenu(li);
                    return;
                }

                const command = link.getAttribute('data-command');
                const label = link.getAttribute('data-item-label');
                const href = link.getAttribute('href');

                // Trigger Toast or Custom Command Event
                if (command) {
                    executeCommand(command, label || '');
                }

                // Dispatch global event
                container.dispatchEvent(new CustomEvent('tieredmenu:select', {
                    bubbles: true,
                    detail: { label, command, href }
                }));

                // Close all if in popup mode
                if (isPopup) {
                    isOpen = false;
                    rootEl.style.display = 'none';
                    closeAllSubmenus(rootEl);
                } else {
                    closeAllSubmenus(rootEl);
                }
            }, { signal: ctx?.signal });
        });

        const links = Array.from(rootEl.querySelectorAll<HTMLElement>('.p-tieredmenu-item-link'));
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
            }
        });

        // WAI-ARIA Keyboard Navigation
        rootEl.addEventListener('keydown', (e: KeyboardEvent) => {
            if (nav.handleKeyDown(e)) return;
            const idx = Math.max(0, links.indexOf(document.activeElement as HTMLElement));
            handleRovingKeydown(e, links, idx, 'vertical');
            const activeEl = document.activeElement as HTMLElement;
            if (!activeEl || !rootEl.contains(activeEl)) return;

            const currentLi = activeEl.closest('.p-tieredmenu-item') as HTMLElement;
            if (!currentLi) return;

            const currentUl = currentLi.parentElement as HTMLElement;
            const items = Array.from(currentUl.querySelectorAll<HTMLElement>(':scope > .p-tieredmenu-item:not(.p-disabled)'));
            const currentIndex = items.indexOf(currentLi);

            switch (e.key) {
                case 'ArrowDown': {
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % items.length;
                    items[nextIndex]?.querySelector<HTMLElement>('.p-tieredmenu-item-link')?.focus();
                    break;
                }
                case 'ArrowUp': {
                    e.preventDefault();
                    const prevIndex = (currentIndex - 1 + items.length) % items.length;
                    items[prevIndex]?.querySelector<HTMLElement>('.p-tieredmenu-item-link')?.focus();
                    break;
                }
                case 'ArrowRight': {
                    const sub = currentLi.querySelector<HTMLElement>(':scope > .p-tieredmenu-submenu');
                    if (sub) {
                        e.preventDefault();
                        openSubmenu(currentLi);
                        sub.querySelector<HTMLElement>('.p-tieredmenu-item:not(.p-disabled) .p-tieredmenu-item-link')?.focus();
                    }
                    break;
                }
                case 'ArrowLeft': {
                    const parentSub = currentLi.closest('.p-tieredmenu-submenu') as HTMLElement;
                    if (parentSub) {
                        e.preventDefault();
                        const parentLi = parentSub.closest('.p-tieredmenu-item') as HTMLElement;
                        parentSub.style.display = 'none';
                        parentLi?.querySelector<HTMLElement>('.p-tieredmenu-item-link')?.focus();
                    }
                    break;
                }
                case 'Enter':
                case ' ': {
                    e.preventDefault();
                    activeEl.click();
                    break;
                }
                case 'Escape': {
                    e.preventDefault();
                    if (isPopup) {
                        isOpen = false;
                        rootEl.style.display = 'none';
                    }
                    closeAllSubmenus(rootEl);
                    break;
                }
                case 'Home': {
                    e.preventDefault();
                    items[0]?.querySelector<HTMLElement>('.p-tieredmenu-item-link')?.focus();
                    break;
                }
                case 'End': {
                    e.preventDefault();
                    items[items.length - 1]?.querySelector<HTMLElement>('.p-tieredmenu-item-link')?.focus();
                    break;
                }
            }
        }, { signal: ctx?.signal });
    }

    function executeCommand(commandStr: string, label: string) {
        // Dispatch toast notification event matching LaughTale toast
        let severity = 'info';
        let summary = label;
        let detail = `Action triggered for ${label}`;

        if (commandStr.includes('file_created') || commandStr.includes('success') || label === 'New') {
            severity = 'success';
            summary = 'Success';
            detail = 'File created';
        } else if (commandStr.includes('printer') || commandStr.includes('error') || label === 'Print') {
            severity = 'error';
            summary = 'Error';
            detail = 'No printer connected';
        } else if (commandStr.includes('search') || commandStr.includes('warn') || label === 'Search') {
            severity = 'warn';
            summary = 'Search Results';
            detail = 'No results found';
        } else if (commandStr.includes('download') || label === 'Import') {
            severity = 'info';
            summary = 'Downloads';
            detail = 'Downloaded from cloud';
        } else if (commandStr.includes('upload') || label === 'Export') {
            severity = 'info';
            summary = 'Shared';
            detail = 'Exported to cloud';
        }

        emitIslandEvent('toast:show', { severity, summary, detail, life: 3000 });
    }

    setHtml(container, renderComponent());
    wireEvents();
}
