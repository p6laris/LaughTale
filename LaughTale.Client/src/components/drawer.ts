/**
 * LaughTale: Enterprise Drawer Component (LaughTale Aura Design System)
 * High-performance edge overlay panel with 5 positions (left, right, top, bottom, full),
 * zero-flash SSR, silky-smooth 60 FPS GPU slide-in & slide-out transitions, global click delegation,
 * responsive widths, custom template slots, and interactive headless sidebar menus.
 */

import { injectIslandStyle } from '../runtime/styles';

const DRAWER_CSS = `
.p-drawer-mask {
    position: fixed;
    inset: 0;
    z-index: 1100;
    display: flex;
    box-sizing: border-box;
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    transition: opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.p-drawer-mask.p-drawer-mask-active {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
}

/* Positioning & Layout */
.p-drawer-mask.p-drawer-left {
    justify-content: flex-start;
    align-items: stretch;
}
.p-drawer-mask.p-drawer-right {
    justify-content: flex-end;
    align-items: stretch;
}
.p-drawer-mask.p-drawer-top {
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
}
.p-drawer-mask.p-drawer-bottom {
    flex-direction: column;
    justify-content: flex-end;
    align-items: stretch;
}
.p-drawer-mask.p-drawer-full {
    align-items: stretch;
    justify-content: stretch;
}

/* Drawer Container */
.p-drawer {
    background: var(--lt-surface-0);
    border: none;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    pointer-events: auto;
    will-change: transform, opacity;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
}

/* Position Transforms */
.p-drawer-left .p-drawer {
    width: 22rem;
    max-width: 100vw;
    height: 100%;
    border-right: 1px solid var(--lt-surface-200);
    transform: translate3d(-100%, 0, 0);
}
.p-drawer-mask-active.p-drawer-left .p-drawer {
    transform: translate3d(0, 0, 0);
}

.p-drawer-right .p-drawer {
    width: 22rem;
    max-width: 100vw;
    height: 100%;
    border-left: 1px solid var(--lt-surface-200);
    transform: translate3d(100%, 0, 0);
}
.p-drawer-mask-active.p-drawer-right .p-drawer {
    transform: translate3d(0, 0, 0);
}

.p-drawer-top .p-drawer {
    width: 100%;
    height: auto;
    max-height: 80vh;
    border-bottom: 1px solid var(--lt-surface-200);
    transform: translate3d(0, -100%, 0);
}
.p-drawer-mask-active.p-drawer-top .p-drawer {
    transform: translate3d(0, 0, 0);
}

.p-drawer-bottom .p-drawer {
    width: 100%;
    height: auto;
    max-height: 80vh;
    border-top: 1px solid var(--lt-surface-200);
    transform: translate3d(0, 100%, 0);
}
.p-drawer-mask-active.p-drawer-bottom .p-drawer {
    transform: translate3d(0, 0, 0);
}

.p-drawer-full .p-drawer {
    width: 100vw;
    height: 100vh;
    transform: scale(0.95);
    opacity: 0;
}
.p-drawer-mask-active.p-drawer-full .p-drawer {
    transform: scale(1);
    opacity: 1;
}

/* Header */
.p-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem 1rem 1.5rem;
    border-bottom: none;
    user-select: none;
    flex-shrink: 0;
}

.p-drawer-title {
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--lt-text-primary);
    margin: 0;
}

.p-drawer-header-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-left: auto;
}

.p-drawer-close-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    border: none;
    background: transparent;
    color: var(--lt-surface-500);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
    padding: 0;
}
.p-drawer-close-button:hover {
    background: var(--lt-surface-100);
    color: var(--lt-text-primary);
}

/* Content */
.p-drawer-content {
    padding: 0 1.5rem 1.5rem 1.5rem;
    flex: 1 1 auto;
    overflow-y: auto;
    box-sizing: border-box;
}

/* Footer */
.p-drawer-footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--lt-surface-200);
    flex-shrink: 0;
}

/* Headless Navigation Elements */
.p-drawer-nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.85rem;
    border-radius: var(--lt-radius);
    color: var(--lt-surface-700);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
}
.p-drawer-nav-item:hover {
    background: var(--lt-surface-100);
    color: var(--lt-text-primary);
}

.p-drawer-nav-section-title {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--lt-surface-500);
    padding: 0.75rem 0.85rem 0.35rem 0.85rem;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}

/* Dark Mode Tokens */
html.dark .p-drawer,
[data-theme="dark"] .p-drawer,
.dark .p-drawer {
    background: var(--p-surface-0, #090d16);
    border-color: var(--p-border-color, #334155);
}
html.dark .p-drawer-title,
[data-theme="dark"] .p-drawer-title,
.dark .p-drawer-title {
    color: var(--p-text-color, #f8fafc);
}
html.dark .p-drawer-close-button,
[data-theme="dark"] .p-drawer-close-button,
.dark .p-drawer-close-button {
    color: var(--p-text-muted, #94a3b8);
}
html.dark .p-drawer-close-button:hover,
[data-theme="dark"] .p-drawer-close-button:hover,
.dark .p-drawer-close-button:hover {
    background: var(--p-surface-100, #1e293b);
    color: var(--p-text-color, #f8fafc);
}
html.dark .p-drawer-footer,
[data-theme="dark"] .p-drawer-footer,
.dark .p-drawer-footer {
    border-color: var(--p-border-color, #334155);
}
html.dark .p-drawer-nav-item,
[data-theme="dark"] .p-drawer-nav-item,
.dark .p-drawer-nav-item {
    color: var(--p-text-color, #f8fafc);
}
html.dark .p-drawer-nav-item:hover,
[data-theme="dark"] .p-drawer-nav-item:hover,
.dark .p-drawer-nav-item:hover {
    background: var(--p-surface-100, #1e293b);
    color: var(--p-text-color, #f8fafc);
}
html.dark .p-drawer-nav-section-title,
[data-theme="dark"] .p-drawer-nav-section-title,
.dark .p-drawer-nav-section-title {
    color: var(--p-text-muted, #94a3b8);
}

/* Bi-Directional RTL Support */
[dir="rtl"] .p-drawer-header {
    flex-direction: row-reverse;
}
[dir="rtl"] .p-drawer-header-actions {
    margin-left: 0;
    margin-right: auto;
}
[dir="rtl"] .p-drawer-content {
    text-align: right;
}
`;

import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';

export interface DrawerProps {
    id?: string;
    header?: string;
    title?: string;
    position?: 'left' | 'right' | 'top' | 'bottom' | 'full';
    visible?: boolean;
    modal?: boolean;
    dismissableMask?: boolean;
    closable?: boolean;
    closeOnEscape?: boolean;
    width?: string;
    height?: string;
    style?: string;
    class?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

let globalDrawerDelegationBound = false;

function initGlobalDrawerDelegation(signal?: AbortSignal) {
    if (globalDrawerDelegationBound || typeof document === 'undefined') return;
    globalDrawerDelegationBound = true;

    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const trigger = target.closest<HTMLElement>('[data-drawer-target], [data-drawer-open]');
        
        if (trigger) {
            e.preventDefault();
            const drawerId = trigger.getAttribute('data-drawer-target') || trigger.getAttribute('data-drawer-open');
            const pos = trigger.getAttribute('data-drawer-position');
            if (drawerId) {
                const drawerContainer = document.getElementById(drawerId);
                const maskEl = drawerContainer?.querySelector<HTMLElement>('.p-drawer-mask');
                if (maskEl) {
                    if (pos) {
                        const cleanPos = pos.toLowerCase().replace(/[^a-z]/g, '');
                        maskEl.className = maskEl.className.replace(/p-drawer-(left|right|top|bottom|full)/g, '');
                        maskEl.classList.add(`p-drawer-${cleanPos}`);
                    }
                    maskEl.classList.add('p-drawer-mask-active');
                    if (maskEl.classList.contains('p-drawer-mask-modal')) {
                        document.body.style.overflow = 'hidden';
                    }
                }
            }
            return;
        }

        // Close triggers
        const closeBtn = target.closest<HTMLElement>('.p-drawer-close-button, [data-drawer-close]');
        if (closeBtn) {
            e.preventDefault();
            const maskEl = closeBtn.closest<HTMLElement>('.p-drawer-mask');
            if (maskEl) {
                maskEl.classList.remove('p-drawer-mask-active');
                document.body.style.overflow = '';
            }
            return;
        }

        // Dismissable mask backdrop click
        if (target.classList.contains('p-drawer-mask')) {
            const container = target.closest<HTMLElement>('[data-island="drawer"]');
            let dismissable = true;
            if (container) {
                try {
                    const props = JSON.parse(container.getAttribute('data-props') || '{}');
                    if (props.dismissableMask === false) {
                        dismissable = false;
                    }
                } catch {}
            }
            if (dismissable) {
                target.classList.remove('p-drawer-mask-active');
                document.body.style.overflow = '';
            }
        }

        // Accordion toggles inside headless drawer
        const accordionTrigger = target.closest<HTMLElement>('[data-drawer-toggle]');
        if (accordionTrigger) {
            e.preventDefault();
            const targetSubmenu = accordionTrigger.nextElementSibling as HTMLElement;
            if (targetSubmenu) {
                const isHidden = targetSubmenu.style.display === 'none' || targetSubmenu.classList.contains('hidden');
                targetSubmenu.style.display = isHidden ? 'block' : 'none';
                targetSubmenu.classList.toggle('hidden', !isHidden);
                const chevron = accordionTrigger.querySelector<HTMLElement>('.p-drawer-chevron');
                if (chevron) {
                    chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            }
        }
    }, { signal });

    // Escape Key Handler
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeMask = document.querySelector<HTMLElement>('.p-drawer-mask.p-drawer-mask-active');
            if (activeMask) {
                activeMask.classList.remove('p-drawer-mask-active');
                document.body.style.overflow = '';
            }
        }
    }, { signal });
}

export default function DrawerIsland(container: HTMLElement, props: DrawerProps, ctx?: IslandContext) {
    injectIslandStyle('drawer', DRAWER_CSS);
    applyPart(container, 'root', props.class || '', props.pt, props.studioOverrides);
    initGlobalDrawerDelegation(ctx?.signal);
}
