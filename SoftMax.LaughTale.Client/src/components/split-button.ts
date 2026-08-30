/**
 * SoftMax.LaughTale: Enterprise SplitButton Component (Aura Design System compliant)
 * Main action button paired with a dropdown trigger menu with nested submenu support.
 */

import { SplitButtonItem, ButtonSeverity } from '../types/models';
import { injectIslandStyle } from '../runtime/styles';
import { LucideIcons } from '../icons/lucide';
import { executeCommand } from '../runtime/commands';
import { sanitizeUrl } from '../directives/security';

export interface SplitButtonProps {
    label?: string;
    icon?: string;
    dropdownIcon?: string;
    model?: SplitButtonItem[];
    severity?: ButtonSeverity;
    raised?: boolean;
    rounded?: boolean;
    text?: boolean;
    outlined?: boolean;
    size?: 'small' | 'normal' | 'large';
    disabled?: boolean;
    fluid?: boolean;
    buttonProps?: Record<string, any>;
    menuButtonProps?: Record<string, any>;
    appendTo?: string;
    action?: string;
}

// Global active coordinator: guarantees only ONE SplitButton menu is open at any time
let activeSplitButtonClose: (() => void) | null = null;

const SPLITBUTTON_CSS = `
.p-splitbutton {
    display: inline-flex;
    position: relative;
    vertical-align: middle;
    border-radius: var(--p-border-radius, 6px);
    font-family: var(--p-font-family, inherit);
}

.p-splitbutton-fluid {
    width: 100%;
    display: flex;
}

.p-splitbutton .p-splitbutton-button {
    flex: 1 1 auto;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}

.p-splitbutton .p-splitbutton-dropdown {
    flex: 0 0 auto;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
}

/* Button Base & Severities */
.p-splitbutton .p-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1;
    padding: 0.5rem 1rem;
    border: 1px solid transparent;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, color 0.15s ease;
    outline: none;
    text-decoration: none;
}

.p-splitbutton-sm .p-button {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
}

.p-splitbutton-lg .p-button {
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
}

.p-splitbutton-rounded {
    border-radius: 9999px !important;
}
.p-splitbutton-rounded .p-splitbutton-button {
    border-top-left-radius: 9999px !important;
    border-bottom-left-radius: 9999px !important;
}
.p-splitbutton-rounded .p-splitbutton-dropdown {
    border-top-right-radius: 9999px !important;
    border-bottom-right-radius: 9999px !important;
}

.p-splitbutton-raised {
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
}

/* Solid Severities */
.p-splitbutton .p-button-primary {
    background: var(--p-primary-500, #10b981);
    color: #ffffff;
    border-color: var(--p-primary-500, #10b981);
}
.p-splitbutton .p-button-primary:hover:not(:disabled) {
    background: var(--p-primary-600, #059669);
    border-color: var(--p-primary-600, #059669);
}

.p-splitbutton .p-button-secondary {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-700, #334155);
    border-color: var(--p-surface-200, #e2e8f0);
}
.p-splitbutton .p-button-secondary:hover:not(:disabled) {
    background: var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-800, #1e293b);
}

.p-splitbutton .p-button-success {
    background: #22c55e;
    color: #ffffff;
    border-color: #22c55e;
}
.p-splitbutton .p-button-success:hover:not(:disabled) {
    background: #16a34a;
    border-color: #16a34a;
}

.p-splitbutton .p-button-info {
    background: #0ea5e9;
    color: #ffffff;
    border-color: #0ea5e9;
}
.p-splitbutton .p-button-info:hover:not(:disabled) {
    background: #0284c7;
    border-color: #0284c7;
}

.p-splitbutton .p-button-warn {
    background: #f59e0b;
    color: #ffffff;
    border-color: #f59e0b;
}
.p-splitbutton .p-button-warn:hover:not(:disabled) {
    background: #d97706;
    border-color: #d97706;
}

.p-splitbutton .p-button-help {
    background: #a855f7;
    color: #ffffff;
    border-color: #a855f7;
}
.p-splitbutton .p-button-help:hover:not(:disabled) {
    background: #9333ea;
    border-color: #9333ea;
}

.p-splitbutton .p-button-danger {
    background: #ef4444;
    color: #ffffff;
    border-color: #ef4444;
}
.p-splitbutton .p-button-danger:hover:not(:disabled) {
    background: #dc2626;
    border-color: #dc2626;
}

.p-splitbutton .p-button-contrast {
    background: #0f172a;
    color: #ffffff;
    border-color: #0f172a;
}
.p-splitbutton .p-button-contrast:hover:not(:disabled) {
    background: #1e293b;
    border-color: #1e293b;
}

/* Outlined Variant */
.p-splitbutton-outlined .p-button-primary { background: transparent; color: var(--p-primary-500, #10b981); border-color: var(--p-primary-500, #10b981); }
.p-splitbutton-outlined .p-button-primary:hover:not(:disabled) { background: rgba(16, 185, 129, 0.08); }
.p-splitbutton-outlined .p-button-secondary { background: transparent; color: var(--p-surface-700, #334155); border-color: var(--p-surface-300, #cbd5e1); }
.p-splitbutton-outlined .p-button-secondary:hover:not(:disabled) { background: var(--p-surface-100, #f1f5f9); }
.p-splitbutton-outlined .p-button-success { background: transparent; color: #22c55e; border-color: #22c55e; }
.p-splitbutton-outlined .p-button-success:hover:not(:disabled) { background: rgba(34, 197, 94, 0.08); }
.p-splitbutton-outlined .p-button-info { background: transparent; color: #0ea5e9; border-color: #0ea5e9; }
.p-splitbutton-outlined .p-button-info:hover:not(:disabled) { background: rgba(14, 165, 233, 0.08); }
.p-splitbutton-outlined .p-button-warn { background: transparent; color: #f59e0b; border-color: #f59e0b; }
.p-splitbutton-outlined .p-button-warn:hover:not(:disabled) { background: rgba(245, 158, 11, 0.08); }
.p-splitbutton-outlined .p-button-help { background: transparent; color: #a855f7; border-color: #a855f7; }
.p-splitbutton-outlined .p-button-help:hover:not(:disabled) { background: rgba(168, 85, 247, 0.08); }
.p-splitbutton-outlined .p-button-danger { background: transparent; color: #ef4444; border-color: #ef4444; }
.p-splitbutton-outlined .p-button-danger:hover:not(:disabled) { background: rgba(239, 68, 68, 0.08); }
.p-splitbutton-outlined .p-button-contrast { background: transparent; color: #0f172a; border-color: #0f172a; }
.p-splitbutton-outlined .p-button-contrast:hover:not(:disabled) { background: rgba(15, 23, 42, 0.08); }

.p-splitbutton-outlined .p-splitbutton-button {
    border-right: none !important;
}

/* Text Variant */
.p-splitbutton-text .p-button { 
    background: transparent !important; 
    border-color: transparent !important; 
    box-shadow: none !important;
}
.p-splitbutton-text .p-button-primary { color: var(--p-primary-500, #10b981) !important; }
.p-splitbutton-text .p-button-primary:hover:not(:disabled),
.p-splitbutton-text .p-button-primary[aria-expanded="true"] { background: rgba(16, 185, 129, 0.1) !important; }

.p-splitbutton-text .p-button-secondary { color: var(--p-surface-700, #334155) !important; }
.p-splitbutton-text .p-button-secondary:hover:not(:disabled),
.p-splitbutton-text .p-button-secondary[aria-expanded="true"] { background: var(--p-surface-200, #e2e8f0) !important; }

.p-splitbutton-text .p-button-success { color: #22c55e !important; }
.p-splitbutton-text .p-button-success:hover:not(:disabled),
.p-splitbutton-text .p-button-success[aria-expanded="true"] { background: rgba(34, 197, 94, 0.1) !important; }

.p-splitbutton-text .p-button-info { color: #0ea5e9 !important; }
.p-splitbutton-text .p-button-info:hover:not(:disabled),
.p-splitbutton-text .p-button-info[aria-expanded="true"] { background: rgba(14, 165, 233, 0.1) !important; }

.p-splitbutton-text .p-button-warn { color: #f59e0b !important; }
.p-splitbutton-text .p-button-warn:hover:not(:disabled),
.p-splitbutton-text .p-button-warn[aria-expanded="true"] { background: rgba(245, 158, 11, 0.1) !important; }

.p-splitbutton-text .p-button-help { color: #a855f7 !important; }
.p-splitbutton-text .p-button-help:hover:not(:disabled),
.p-splitbutton-text .p-button-help[aria-expanded="true"] { background: rgba(168, 85, 247, 0.1) !important; }

.p-splitbutton-text .p-button-danger { color: #ef4444 !important; }
.p-splitbutton-text .p-button-danger:hover:not(:disabled),
.p-splitbutton-text .p-button-danger[aria-expanded="true"] { background: rgba(239, 68, 68, 0.1) !important; }

.p-splitbutton-text .p-button-contrast { color: #0f172a !important; }
.p-splitbutton-text .p-button-contrast:hover:not(:disabled),
.p-splitbutton-text .p-button-contrast[aria-expanded="true"] { background: rgba(15, 23, 42, 0.1) !important; }

/* Divider separator in solid buttons */
.p-splitbutton:not(.p-splitbutton-outlined):not(.p-splitbutton-text) .p-splitbutton-dropdown {
    border-left: 1px solid rgba(255, 255, 255, 0.25) !important;
}
.p-splitbutton:not(.p-splitbutton-outlined):not(.p-splitbutton-text) .p-button-secondary.p-splitbutton-dropdown {
    border-left: 1px solid var(--p-surface-300, #cbd5e1) !important;
}

/* Disabled */
.p-splitbutton-disabled,
.p-splitbutton .p-button:disabled {
    opacity: 0.6 !important;
    cursor: not-allowed !important;
    pointer-events: none !important;
}

/* Menu Overlay */
.p-splitbutton-menu {
    position: absolute;
    right: 0 !important;
    left: auto !important;
    z-index: 1050;
    min-width: 100%;
    width: max-content;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    padding: 0.35rem;
    outline: none;
    transform-origin: top right;
    transition: opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.p-splitbutton-menu.p-menu-flipped {
    transform-origin: bottom right;
}

.p-splitbutton-menu .p-menu-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}

.p-splitbutton-menu .p-menu-item {
    position: relative;
    border-radius: calc(var(--p-border-radius, 6px) - 2px);
}

.p-splitbutton-menu .p-menu-item-link {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.5rem 0.75rem;
    color: var(--p-surface-700, #334155);
    border-radius: inherit;
    text-decoration: none;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    user-select: none;
    transition: background-color 0.15s ease, color 0.15s ease;
    outline: none;
}

.p-splitbutton-menu .p-menu-item-link:hover,
.p-splitbutton-menu .p-menu-item.p-menu-active > .p-menu-item-link,
.p-splitbutton-menu .p-menu-item.p-focus > .p-menu-item-link {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}

.p-splitbutton-menu .p-menu-item-link[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.p-splitbutton-menu .p-menu-item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-500, #64748b);
}

.p-splitbutton-menu .p-menu-item-link:hover .p-menu-item-icon,
.p-splitbutton-menu .p-menu-item.p-menu-active > .p-menu-item-link .p-menu-item-icon {
    color: var(--p-surface-700, #334155);
}

.p-splitbutton-menu .p-submenu-icon {
    margin-left: auto;
    display: inline-flex;
    color: var(--p-surface-400, #94a3b8);
}

.p-splitbutton-menu .p-menu-separator {
    height: 1px;
    background: var(--p-surface-200, #e2e8f0);
    margin: 0.25rem 0;
}

/* Submenu Flyout Overlay */
.p-splitbutton-submenu-overlay {
    position: absolute;
    top: 0;
    left: calc(100% + 2px);
    z-index: 1060;
    min-width: 11.5rem;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius, 8px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    padding: 0.35rem;
    list-style: none;
    margin: 0;
    display: none;
    flex-direction: column;
    gap: 0.15rem;
}

.p-splitbutton-submenu-overlay.p-submenu-flipped {
    left: auto;
    right: calc(100% + 2px);
}

.p-menu-item.p-submenu-open > .p-splitbutton-submenu-overlay {
    display: flex !important;
}

/* Dark Mode Overrides */
.dark .p-splitbutton-menu,
.dark .p-splitbutton-submenu-overlay,
[data-theme="dark"] .p-splitbutton-menu,
[data-theme="dark"] .p-splitbutton-submenu-overlay {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4) !important;
}

.dark .p-splitbutton-menu .p-menu-item-link,
[data-theme="dark"] .p-splitbutton-menu .p-menu-item-link {
    color: var(--p-surface-200, #e2e8f0) !important;
}

.dark .p-splitbutton-menu .p-menu-item-link:hover,
.dark .p-splitbutton-menu .p-menu-item.p-menu-active > .p-menu-item-link,
.dark .p-splitbutton-menu .p-menu-item.p-focus > .p-menu-item-link,
[data-theme="dark"] .p-splitbutton-menu .p-menu-item-link:hover,
[data-theme="dark"] .p-splitbutton-menu .p-menu-item.p-menu-active > .p-menu-item-link,
[data-theme="dark"] .p-splitbutton-menu .p-menu-item.p-focus > .p-menu-item-link {
    background: var(--p-surface-800, #1e293b) !important;
    color: #ffffff !important;
}

.dark .p-splitbutton-menu .p-menu-separator,
[data-theme="dark"] .p-splitbutton-menu .p-menu-separator {
    background: var(--p-surface-700, #334155) !important;
}

.dark .p-splitbutton-text .p-button-contrast,
[data-theme="dark"] .p-splitbutton-text .p-button-contrast {
    color: var(--p-surface-0, #ffffff) !important;
}
.dark .p-splitbutton-text .p-button-contrast:hover:not(:disabled),
.dark .p-splitbutton-text .p-button-contrast[aria-expanded="true"],
[data-theme="dark"] .p-splitbutton-text .p-button-contrast:hover:not(:disabled),
[data-theme="dark"] .p-splitbutton-text .p-button-contrast[aria-expanded="true"] {
    background: rgba(255, 255, 255, 0.1) !important;
}
`;

export default function SplitButtonIsland(container: HTMLElement, props: SplitButtonProps) {
    injectIslandStyle('split-button', SPLITBUTTON_CSS);

    const label = props.label || '';
    const icon = props.icon || '';
    const dropdownIcon = props.dropdownIcon || 'chevronDown';
    const items: SplitButtonItem[] = props.model || [];
    const severity = (props.severity || 'primary').toLowerCase();
    const raised = !!props.raised;
    const rounded = !!props.rounded;
    const text = !!props.text;
    const outlined = !!props.outlined;
    const size = props.size || 'normal';
    const disabled = !!props.disabled;
    const fluid = !!props.fluid;

    let isOpen = false;
    const menuId = `sb_menu_${Math.random().toString(36).substring(2, 9)}`;

    // Build Modifier Classes
    const rootClasses = ['p-splitbutton', 'p-component'];
    if (rounded) rootClasses.push('p-splitbutton-rounded');
    if (raised) rootClasses.push('p-splitbutton-raised');
    if (text) rootClasses.push('p-splitbutton-text');
    if (outlined) rootClasses.push('p-splitbutton-outlined');
    if (size === 'small') rootClasses.push('p-splitbutton-sm');
    if (size === 'large') rootClasses.push('p-splitbutton-lg');
    if (fluid) rootClasses.push('p-splitbutton-fluid');
    if (disabled) rootClasses.push('p-splitbutton-disabled');

    const btnSevClass = `p-button-${severity}`;

    // Preserve custom inner template if passed from Razor
    const initialSlotContent = container.innerHTML.trim();
    const hasCustomSlot = initialSlotContent && !initialSlotContent.startsWith('<div class="p-splitbutton');

    function renderSubmenuTree(subItems: SplitButtonItem[]): string {
        return `
            <ul class="p-splitbutton-submenu-overlay p-menu-list" role="menu">
                ${subItems.map((item, idx) => renderMenuItem(item, idx, true)).join('')}
            </ul>
        `;
    }

    function renderMenuItem(item: SplitButtonItem, index: number, isSub: boolean = false): string {
        if (item.separator) {
            return `<li class="p-menu-separator" role="separator"></li>`;
        }

        const hasSub = Array.isArray(item.items) && item.items.length > 0;
        const iconSvg = item.icon ? `<span class="p-menu-item-icon">${LucideIcons[item.icon]}</span>` : '';
        const subChevron = hasSub ? `<span class="p-submenu-icon">${LucideIcons.chevronRight}</span>` : '';
        const itemLabel = item.label || '';
        const itemDisabled = item.disabled ? 'aria-disabled="true"' : '';
        const itemUrl = item.url || (item.route ? item.route : '');

        return `
            <li class="p-menu-item ${hasSub ? 'p-menu-item-has-submenu' : ''}" role="none" data-index="${index}">
                <a class="p-menu-item-link" 
                   role="menuitem" 
                   tabindex="${item.disabled ? '-1' : '0'}" 
                   ${itemDisabled}
                   ${itemUrl ? `href="${itemUrl}"` : ''}
                   ${item.target ? `target="${item.target}"` : ''}>
                    ${iconSvg}
                    <span class="p-menu-item-label">${itemLabel}</span>
                    ${subChevron}
                </a>
                ${hasSub ? renderSubmenuTree(item.items!) : ''}
            </li>
        `;
    }

    // Main markup
    const mainButtonContent = hasCustomSlot 
        ? initialSlotContent 
        : `${icon ? `<span class="p-button-icon">${LucideIcons[icon]}</span>` : ''}${label ? `<span class="p-button-label">${label}</span>` : ''}`;

    container.innerHTML = `
        <div class="${rootClasses.join(' ')}">
            <!-- Main Default Action Button -->
            <button type="button" 
                    class="p-splitbutton-button p-button ${btnSevClass}" 
                    ${disabled ? 'disabled' : ''} 
                    aria-label="${label || 'SplitButton Action'}">
                ${mainButtonContent}
            </button>

            <!-- Dropdown Menu Trigger Button -->
            <button type="button" 
                    class="p-splitbutton-dropdown p-button p-button-icon-only ${btnSevClass}" 
                    ${disabled ? 'disabled' : ''} 
                    aria-haspopup="menu" 
                    aria-expanded="false" 
                    aria-controls="${menuId}" 
                    aria-label="More Options">
                <span class="p-button-icon">${LucideIcons[dropdownIcon]}</span>
            </button>

            <!-- Dropdown Menu Overlay -->
            <div id="${menuId}" class="p-splitbutton-menu p-menu p-component" role="menu" style="display: none; opacity: 0; transform: scaleY(0.8);">
                <ul class="p-menu-list" role="menu">
                    ${items.map((it, idx) => renderMenuItem(it, idx)).join('')}
                </ul>
            </div>
        </div>
    `;

    const rootEl = container.firstElementChild as HTMLElement;
    const mainBtn = rootEl.querySelector<HTMLButtonElement>('.p-splitbutton-button')!;
    const dropdownBtn = rootEl.querySelector<HTMLButtonElement>('.p-splitbutton-dropdown')!;
    const menuEl = rootEl.querySelector<HTMLElement>('.p-splitbutton-menu')!;

    function closeAllSubmenus(scopeList?: HTMLElement) {
        const target = scopeList || menuEl;
        target.querySelectorAll('.p-menu-item.p-submenu-open').forEach((openLi) => {
            openLi.classList.remove('p-submenu-open', 'p-menu-active');
        });
    }

    function closeMenu() {
        if (!isOpen) return;
        isOpen = false;
        if (activeSplitButtonClose === closeMenu) {
            activeSplitButtonClose = null;
        }
        dropdownBtn.setAttribute('aria-expanded', 'false');
        menuEl.style.opacity = '0';
        menuEl.style.transform = 'scaleY(0.8)';
        closeAllSubmenus();
        setTimeout(() => {
            if (!isOpen) {
                menuEl.style.display = 'none';
            }
        }, 150);
    }

    function openMenu() {
        if (disabled || items.length === 0 || isOpen) return;

        // Close any other open SplitButton menu across the entire page!
        if (activeSplitButtonClose && activeSplitButtonClose !== closeMenu) {
            activeSplitButtonClose();
        }
        activeSplitButtonClose = closeMenu;

        isOpen = true;
        dropdownBtn.setAttribute('aria-expanded', 'true');
        menuEl.style.display = 'block';

        // Dynamic Collision & Viewport Positioning
        const rect = rootEl.getBoundingClientRect();
        const menuHeight = menuEl.offsetHeight || 200;
        const fitsBelow = (rect.bottom + menuHeight + 10) <= window.innerHeight;

        if (fitsBelow) {
            menuEl.classList.remove('p-menu-flipped');
            menuEl.style.top = 'calc(100% + 4px)';
            menuEl.style.bottom = 'auto';
            menuEl.style.right = '0';
        } else {
            menuEl.classList.add('p-menu-flipped');
            menuEl.style.top = 'auto';
            menuEl.style.bottom = 'calc(100% + 4px)';
            menuEl.style.right = '0';
        }

        requestAnimationFrame(() => {
            menuEl.style.opacity = '1';
            menuEl.style.transform = 'scaleY(1)';
        });

        // Focus first active menu item
        const firstLink = menuEl.querySelector<HTMLAnchorElement>('.p-menu-item-link:not([aria-disabled="true"])');
        firstLink?.focus();
    }

    function toggleMenu() {
        if (isOpen) closeMenu();
        else openMenu();
    }

    // Main Button Click
    mainBtn.addEventListener('click', () => {
        if (disabled) return;
        container.dispatchEvent(new CustomEvent('splitbutton:click', {
            bubbles: true,
            detail: { action: props.action || 'main', label }
        }));
    });

    // Dropdown Trigger Click
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Global Click Outside
    document.addEventListener('click', (e) => {
        if (isOpen && !rootEl.contains(e.target as Node)) {
            closeMenu();
        }
    });

    // Item Selection & Execution Handler
    function handleItemClick(itemData: SplitButtonItem, e: MouseEvent | KeyboardEvent) {
        if (itemData.disabled) return;

        if (itemData.command) {
            executeCommand(itemData.command, itemData);
        }

        if (itemData.url) {
            const safeUrl = sanitizeUrl(itemData.url);
            if (safeUrl && safeUrl !== 'about:blank') {
                if (itemData.target === '_blank') {
                    window.open(safeUrl, '_blank', 'noopener,noreferrer');
                } else {
                    window.location.href = safeUrl;
                }
            }
        }

        container.dispatchEvent(new CustomEvent('splitbutton:action', {
            bubbles: true,
            detail: { item: itemData, action: itemData.action || itemData.label }
        }));

        closeMenu();
        dropdownBtn.focus();
    }

    // Tiered Hover & Click Engine for Nested Submenus
    function setupSubmenuHover(parentUl: HTMLElement, itemsList: SplitButtonItem[]) {
        const directLis = Array.from(parentUl.children).filter(el => el.classList.contains('p-menu-item')) as HTMLElement[];

        directLis.forEach((li, idx) => {
            const itemData = itemsList[idx];
            if (!itemData || itemData.separator) return;

            const hasSub = Array.isArray(itemData.items) && itemData.items.length > 0;
            const link = li.querySelector(':scope > .p-menu-item-link') as HTMLAnchorElement;
            const subOverlay = li.querySelector(':scope > .p-splitbutton-submenu-overlay') as HTMLElement;

            // When mouse enters this item:
            li.addEventListener('mouseenter', () => {
                // Close all sibling submenus in this same UL
                directLis.forEach(sibling => {
                    if (sibling !== li) {
                        sibling.classList.remove('p-submenu-open', 'p-menu-active');
                    }
                });

                if (hasSub && subOverlay) {
                    li.classList.add('p-submenu-open', 'p-menu-active');

                    // Check horizontal viewport collision for flyout
                    const liRect = li.getBoundingClientRect();
                    const subWidth = subOverlay.offsetWidth || 180;
                    if (liRect.right + subWidth > window.innerWidth) {
                        subOverlay.classList.add('p-submenu-flipped');
                    } else {
                        subOverlay.classList.remove('p-submenu-flipped');
                    }
                } else {
                    li.classList.add('p-menu-active');
                }
            });

            // When click on link
            link?.addEventListener('click', (e) => {
                if (hasSub) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                handleItemClick(itemData, e);
            });

            // If it has a submenu, recursively set up the child UL
            if (hasSub && subOverlay) {
                setupSubmenuHover(subOverlay, itemData.items!);
            }
        });
    }

    const rootList = menuEl.querySelector(':scope > .p-menu-list') as HTMLElement;
    if (rootList) {
        setupSubmenuHover(rootList, items);
    }

    // Keyboard Navigation
    dropdownBtn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            openMenu();
        }
    });

    menuEl.addEventListener('keydown', (e) => {
        const activeEl = document.activeElement as HTMLElement;
        const currentLink = activeEl?.closest('.p-menu-item-link') as HTMLAnchorElement;
        const currentLi = currentLink?.closest('.p-menu-item') as HTMLElement;
        const activeList = currentLi?.closest('ul') as HTMLUListElement;

        if (e.key === 'Escape') {
            e.preventDefault();
            const parentSubmenu = currentLi?.closest('.p-splitbutton-submenu-overlay');
            if (parentSubmenu) {
                const parentLi = parentSubmenu.closest('.p-menu-item') as HTMLElement;
                parentLi?.classList.remove('p-submenu-open');
                parentLi?.querySelector<HTMLAnchorElement>(':scope > .p-menu-item-link')?.focus();
            } else {
                closeMenu();
                dropdownBtn.focus();
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const links = Array.from(activeList?.querySelectorAll<HTMLAnchorElement>(':scope > .p-menu-item > .p-menu-item-link:not([aria-disabled="true"])') || []);
            const currentIndex = links.indexOf(currentLink);
            const nextIndex = (currentIndex + 1) % links.length;
            links[nextIndex]?.focus();
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const links = Array.from(activeList?.querySelectorAll<HTMLAnchorElement>(':scope > .p-menu-item > .p-menu-item-link:not([aria-disabled="true"])') || []);
            const currentIndex = links.indexOf(currentLink);
            const prevIndex = (currentIndex - 1 + links.length) % links.length;
            links[prevIndex]?.focus();
            return;
        }

        if (e.key === 'ArrowRight') {
            if (currentLi?.classList.contains('p-menu-item-has-submenu')) {
                e.preventDefault();
                currentLi.classList.add('p-submenu-open');
                const firstSubLink = currentLi.querySelector<HTMLAnchorElement>('.p-splitbutton-submenu-overlay .p-menu-item-link:not([aria-disabled="true"])');
                firstSubLink?.focus();
            }
            return;
        }

        if (e.key === 'ArrowLeft') {
            const parentSubmenu = currentLi?.closest('.p-splitbutton-submenu-overlay');
            if (parentSubmenu) {
                e.preventDefault();
                const parentLi = parentSubmenu.closest('.p-menu-item') as HTMLElement;
                parentLi?.classList.remove('p-submenu-open');
                parentLi?.querySelector<HTMLAnchorElement>(':scope > .p-menu-item-link')?.focus();
            }
            return;
        }

        if (e.key === 'Home') {
            e.preventDefault();
            const links = Array.from(activeList?.querySelectorAll<HTMLAnchorElement>(':scope > .p-menu-item > .p-menu-item-link:not([aria-disabled="true"])') || []);
            links[0]?.focus();
            return;
        }

        if (e.key === 'End') {
            e.preventDefault();
            const links = Array.from(activeList?.querySelectorAll<HTMLAnchorElement>(':scope > .p-menu-item > .p-menu-item-link:not([aria-disabled="true"])') || []);
            links[links.length - 1]?.focus();
            return;
        }
    });
}
