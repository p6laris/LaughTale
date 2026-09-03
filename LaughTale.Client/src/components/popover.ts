import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { useFloatingPosition } from '../composables/useFloatingPosition';
﻿/**
 * LaughTale: Enterprise Popover Component (LaughTale Aura Design System)
 * High-performance anchored overlay popup with dynamic viewport edge flipping,
 * pointing arrow notch, pure GPU CSS scale transitions, external trigger anchor support,
 * zero-flash SSR, and global click / Escape delegation.
 */

import { injectIslandStyle } from '../runtime/styles';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'presentational'
};

const POPOVER_CSS = `
island-popover,
.laughtale-popover,
.p-popover {
    position: fixed;
    z-index: 1200;
    box-sizing: border-box;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    padding: 1.25rem;
    color: var(--lt-text-primary);
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    transform: scale(0.95) translateY(4px);
    transform-origin: center top;
    will-change: transform, opacity;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.2s;
}

island-popover.p-popover-active,
.laughtale-popover.p-popover-active,
.p-popover.p-popover-active {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
    transform: scale(1) translateY(0);
}

/* Arrow Notch */
.p-popover-arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    transform: rotate(45deg);
    pointer-events: none;
    z-index: 1;
}

.p-popover-arrow-top {
    top: -6px;
    border-bottom: none;
    border-right: none;
}

.p-popover-arrow-bottom {
    bottom: -6px;
    border-top: none;
    border-left: none;
}

/* Dark Mode Tokens */
html.dark .p-popover,
[data-theme="dark"] .p-popover,
.dark .p-popover {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    color: var(--p-text-color);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
}

html.dark .p-popover-arrow,
[data-theme="dark"] .p-popover-arrow,
.dark .p-popover-arrow {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
}
`;

export interface PopoverProps {
    id?: string;
    triggerId?: string;
    placement?: 'bottom' | 'top' | 'left' | 'right';
    showArrow?: boolean;
    dismissable?: boolean;
    closeOnEscape?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

let globalPopoverDelegationBound = false;
let activePopoverCtrl: { update(): void; computePosition(): any; destroy(): void } | null = null;

function positionPopover(popoverEl: HTMLElement, targetEl: HTMLElement, preferredPlacement: string = 'bottom', signal?: AbortSignal) {
    if (activePopoverCtrl) {
        activePopoverCtrl.destroy();
        activePopoverCtrl = null;
    }
    const arrowEl = popoverEl.querySelector<HTMLElement>('.p-popover-arrow');
    const placement = (preferredPlacement as any) || 'bottom';
    const effectiveSignal = signal || new AbortController().signal;

    activePopoverCtrl = useFloatingPosition(targetEl, popoverEl, {
        placement,
        offset: 10,
        strategy: 'fixed',
        reposition: 'follow',
        signal: effectiveSignal,
        arrow: arrowEl || undefined
    });

    const updatePositionAndArrow = () => {
        if (!activePopoverCtrl) return;
        const coords = activePopoverCtrl.computePosition();
        popoverEl.style.position = 'fixed';
        popoverEl.style.left = `${Math.round(coords.x)}px`;
        popoverEl.style.top = `${Math.round(coords.y)}px`;

        if (arrowEl) {
            if (coords.actualPlacement.startsWith('bottom')) {
                arrowEl.className = 'p-popover-arrow p-popover-arrow-top';
            } else if (coords.actualPlacement.startsWith('top')) {
                arrowEl.className = 'p-popover-arrow p-popover-arrow-bottom';
            }
            if (coords.arrowOffset != null) {
                arrowEl.style.left = `${Math.round(coords.arrowOffset)}px`;
            }
        }
    };

    updatePositionAndArrow();

    if (typeof window !== 'undefined') {
        window.addEventListener('scroll', updatePositionAndArrow, { capture: true, passive: true, signal: effectiveSignal });
        window.addEventListener('resize', updatePositionAndArrow, { passive: true, signal: effectiveSignal });
    }
}

function initGlobalPopoverDelegation(signal?: AbortSignal) {
    if (globalPopoverDelegationBound || typeof document === 'undefined') return;
    globalPopoverDelegationBound = true;

    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const trigger = target.closest<HTMLElement>('[data-popover-target], [data-popover-open], [data-popover-toggle]');

        if (trigger) {
            e.preventDefault();
            e.stopPropagation();
            const popoverId = trigger.getAttribute('data-popover-target') || trigger.getAttribute('data-popover-open') || trigger.getAttribute('data-popover-toggle');
            const anchorId = trigger.getAttribute('data-popover-anchor');
            const targetAnchor = anchorId ? document.getElementById(anchorId) : trigger;

            if (popoverId && targetAnchor) {
                const popoverContainer = document.getElementById(popoverId);
                const popoverEl = popoverContainer?.querySelector<HTMLElement>('.p-popover') || popoverContainer;
                
                if (popoverEl) {
                    const isActive = popoverEl.classList.contains('p-popover-active');
                    
                    // Close any other open popovers
                    document.querySelectorAll<HTMLElement>('.p-popover.p-popover-active').forEach(p => {
                        if (p !== popoverEl) p.classList.remove('p-popover-active');
                    });

                    if (!isActive) {
                        positionPopover(popoverEl, targetAnchor, 'bottom', signal);
                        popoverEl.classList.add('p-popover-active');
                    } else {
                        if (activePopoverCtrl) {
                            activePopoverCtrl.destroy();
                            activePopoverCtrl = null;
                        }
                        popoverEl.classList.remove('p-popover-active');
                    }
                }
            }
            return;
        }

        // Close triggers inside popover
        const closeBtn = target.closest<HTMLElement>('[data-popover-close], [data-popover-hide]');
        if (closeBtn) {
            e.preventDefault();
            const popoverEl = closeBtn.closest<HTMLElement>('.p-popover');
            if (popoverEl) {
                if (activePopoverCtrl) {
                    activePopoverCtrl.destroy();
                    activePopoverCtrl = null;
                }
                popoverEl.classList.remove('p-popover-active');
            }
            return;
        }

        // Outside click dismiss
        if (!target.closest('.p-popover')) {
            document.querySelectorAll<HTMLElement>('.p-popover.p-popover-active').forEach(p => {
                p.classList.remove('p-popover-active');
            });
            if (activePopoverCtrl) {
                activePopoverCtrl.destroy();
                activePopoverCtrl = null;
            }
        }
    }, { signal });

    // Escape Key Handler
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll<HTMLElement>('.p-popover.p-popover-active').forEach(p => {
                p.classList.remove('p-popover-active');
            });
            if (activePopoverCtrl) {
                activePopoverCtrl.destroy();
                activePopoverCtrl = null;
            }
        }
    }, { signal });
}

export default function PopoverIsland(container: HTMLElement, props: PopoverProps, ctx?: IslandContext) {
    injectIslandStyle('popover', POPOVER_CSS);
    container.classList.add('laughtale-popover', 'p-popover', 'p-component');
    container.setAttribute('data-part', 'root');
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', (props as any).ariaLabel || 'Popover');

    // Add arrow notch if not already present
    if (props.showArrow !== false && !container.querySelector('.p-popover-arrow')) {
        const arrow = document.createElement('div');
        arrow.className = 'p-popover-arrow p-popover-arrow-top';
        container.appendChild(arrow);
    }

    const targetEl = props.target
        ? (typeof props.target === 'string' ? document.getElementById(props.target) : props.target)
        : (props.triggerId ? document.getElementById(props.triggerId) : null);

    if (targetEl) {
        targetEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isActive = container.classList.contains('p-popover-active');
            if (!isActive) {
                positionPopover(container, targetEl, (props.placement as any) || 'bottom', ctx?.signal);
                container.classList.add('p-popover-active');
            } else {
                if (activePopoverCtrl) {
                    activePopoverCtrl.destroy();
                    activePopoverCtrl = null;
                }
                container.classList.remove('p-popover-active');
            }
        }, { signal: ctx?.signal });
    }

    initGlobalPopoverDelegation(ctx?.signal);
}
