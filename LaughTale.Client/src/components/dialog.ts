import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { injectIslandStyle } from '../runtime/styles';
import { useFocusTrap } from '../composables/useFocusTrap';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'dialog'
};

const DIALOG_CSS = `
island-aura-dialog,
island-dialog,
p-dialog {
    display: contents !important;
}

.p-dialog-mask {
    position: fixed;
    inset: 0;
    z-index: 1100;
    display: flex;
    box-sizing: border-box;
    padding: 1.5rem;
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.p-dialog-mask.p-dialog-mask-modal {
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}

.p-dialog-mask.p-dialog-mask-active {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
}

/* 9-Direction Positioning */
.p-dialog-mask.p-dialog-pos-center {
    align-items: center;
    justify-content: center;
}
.p-dialog-mask.p-dialog-pos-top {
    align-items: flex-start;
    justify-content: center;
    padding-top: 3rem;
}
.p-dialog-mask.p-dialog-pos-bottom {
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 3rem;
}
.p-dialog-mask.p-dialog-pos-left {
    align-items: center;
    justify-content: flex-start;
    padding-inline-start: 3rem;
}
.p-dialog-mask.p-dialog-pos-right {
    align-items: center;
    justify-content: flex-end;
    padding-inline-end: 3rem;
}
.p-dialog-mask.p-dialog-pos-topleft {
    align-items: flex-start;
    justify-content: flex-start;
    padding-top: 3rem;
    padding-inline-start: 3rem;
}
.p-dialog-mask.p-dialog-pos-topright {
    align-items: flex-start;
    justify-content: flex-end;
    padding-top: 3rem;
    padding-inline-end: 3rem;
}
.p-dialog-mask.p-dialog-pos-bottomleft {
    align-items: flex-end;
    justify-content: flex-start;
    padding-bottom: 3rem;
    padding-inline-start: 3rem;
}
.p-dialog-mask.p-dialog-pos-bottomright {
    align-items: flex-end;
    justify-content: flex-end;
    padding-bottom: 3rem;
    padding-inline-end: 3rem;
}

/* Dialog Container */
.p-dialog {
    background: var(--p-dialog-background, var(--p-content-bg, var(--p-surface-0, #ffffff)));
    border: 1px solid var(--p-dialog-border-color, var(--p-border-color, #e2e8f0));
    border-radius: var(--p-dialog-border-radius, var(--p-border-radius-xl, 12px));
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
    min-width: 20rem;
    max-width: 90vw;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    pointer-events: auto;
    will-change: transform, opacity;
    transform: translate3d(0, 8px, 0) scale(0.96);
    transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease, width 0.2s ease, height 0.2s ease;
    color: var(--p-text-color, #1e293b);
}

.p-dialog-mask.p-dialog-mask-active .p-dialog {
    transform: translate3d(0, 0, 0) scale(1);
}

/* Maximized Mode */
.p-dialog.p-dialog-maximized {
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    border-radius: 0 !important;
    border: none !important;
    top: 0 !important;
    left: 0 !important;
    margin: 0 !important;
}

/* Header */
.p-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem 1rem 1.5rem;
    border-bottom: none;
    user-select: none;
}

.p-dialog.p-dialog-draggable .p-dialog-header {
    cursor: move;
}

.p-dialog-title {
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--p-text-color, #1e293b);
    margin: 0;
}

.p-dialog-header-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-inline-start: auto;
}

.p-dialog-header-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    border: none;
    background: transparent;
    color: var(--p-text-muted, #64748b);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
    padding: 0;
}
.p-dialog-header-action:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #1e293b);
}

/* Content */
.p-dialog-content {
    padding: 0 1.5rem 1.5rem 1.5rem;
    flex: 1 1 auto;
    overflow-y: auto;
    box-sizing: border-box;
}

/* Footer */
.p-dialog-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0 1.5rem 1.25rem 1.5rem;
    border-top: none;
}

/* Dark Mode Tokens */
html.dark .p-dialog,
[data-theme="dark"] .p-dialog,
.dark .p-dialog {
    background: var(--p-surface-0, #0f172a);
    border-color: var(--p-border-color, #334155);
    color: var(--p-text-color, #f8fafc);
}
html.dark .p-dialog-title,
[data-theme="dark"] .p-dialog-title,
.dark .p-dialog-title {
    color: var(--p-text-color, #f8fafc);
}
html.dark .p-dialog-content,
[data-theme="dark"] .p-dialog-content,
.dark .p-dialog-content {
    color: var(--p-text-color, #f8fafc);
}
html.dark .p-dialog-header-action,
[data-theme="dark"] .p-dialog-header-action,
.dark .p-dialog-header-action {
    color: var(--p-text-muted, #94a3b8);
}
html.dark .p-dialog-header-action:hover,
[data-theme="dark"] .p-dialog-header-action:hover,
.dark .p-dialog-header-action:hover {
    background: var(--p-surface-100, #1e293b);
    color: var(--p-text-color, #f8fafc);
}
`;

// Vector SVG Icons
const CLOSE_ICON_SVG = html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>`;
const MAXIMIZE_ICON_SVG = html`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>`;
const RESTORE_ICON_SVG = html`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="10" x2="3" y1="14" y2="21"/></svg>`;

export interface DialogProps {
    header?: string;
    visible?: boolean;
    modal?: boolean;
    dismissableMask?: boolean;
    draggable?: boolean;
    maximizable?: boolean;
    position?: string;
    closable?: boolean;
    closeOnEscape?: boolean;
    style?: string;
    class?: string;
    width?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

// Global Delegation Initializer
let globalDelegationBound = false;

function initGlobalDialogDelegation(signal?: AbortSignal) {
    if (globalDelegationBound || typeof document === 'undefined') return;
    globalDelegationBound = true;

    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const trigger = target.closest<HTMLElement>('[data-dialog-target], [data-dialog-open]');
        
        if (trigger) {
            e.preventDefault();
            const dialogId = trigger.getAttribute('data-dialog-target') || trigger.getAttribute('data-dialog-open');
            const pos = trigger.getAttribute('data-dialog-position');
            if (dialogId) {
                const dialogContainer = document.getElementById(dialogId);
                const maskEl = dialogContainer?.querySelector<HTMLElement>('.p-dialog-mask');
                if (maskEl) {
                    if (pos) {
                        const cleanPos = pos.toLowerCase().replace(/[^a-z]/g, '');
                        maskEl.className = maskEl.className.replace(/p-dialog-pos-[a-z]+/g, '');
                        maskEl.classList.add(`p-dialog-pos-${cleanPos}`);
                    }
                    maskEl.style.display = 'flex';
                    // Force reflow for smooth scale/opacity animation
                    void maskEl.offsetWidth;
                    maskEl.classList.add('p-dialog-mask-active');
                    if (maskEl.classList.contains('p-dialog-mask-modal')) {
                        document.body.style.overflow = 'hidden';
                    }
                }
            }
            return;
        }

        // Close triggers
        const closeBtn = target.closest<HTMLElement>('.p-dialog-close-button, [data-dialog-close]');
        if (closeBtn) {
            e.preventDefault();
            const maskEl = closeBtn.closest<HTMLElement>('.p-dialog-mask');
            if (maskEl) {
                maskEl.classList.remove('p-dialog-mask-active');
                const tClose = setTimeout(() => {
                    if (!maskEl.classList.contains('p-dialog-mask-active')) {
                        maskEl.style.display = 'none';
                    }
                }, 200);
                signal?.addEventListener('abort', () => clearTimeout(tClose), { signal });
                document.body.style.overflow = '';
            }
            return;
        }

        // Dismissable mask backdrop click
        if (target.classList.contains('p-dialog-mask')) {
            const container = target.closest<HTMLElement>('[data-island="dialog"]');
            let dismissable = true;
            if (container) {
                try {
                    const props = JSON.parse(container.getAttribute('data-props') || '{}');
                    if (props.dismissableMask === false && props.modal === true) {
                        dismissable = false;
                    }
                } catch {}
            }
            if (dismissable) {
                target.classList.remove('p-dialog-mask-active');
                const tMask = setTimeout(() => {
                    if (!target.classList.contains('p-dialog-mask-active')) {
                        target.style.display = 'none';
                    }
                }, 200);
                signal?.addEventListener('abort', () => clearTimeout(tMask), { signal });
                document.body.style.overflow = '';
            }
        }
    }, { signal });
}

export default function DialogIsland(container: HTMLElement, props: DialogProps, ctx?: IslandContext) {
    injectIslandStyle('dialog', DIALOG_CSS);
    initGlobalDialogDelegation(ctx?.signal);

    let maskEl = container.querySelector<HTMLElement>('.p-dialog-mask');
    let dialogEl = container.querySelector<HTMLElement>('.p-dialog');

    if (!maskEl || !dialogEl) {
        maskEl = document.createElement('div');
        const modal = props.modal !== false && (props as any).Modal !== false;
        const pos = (props.position || (props as any).Position || 'center').toLowerCase().replace(/[^a-z]/g, '');
        maskEl.className = `p-dialog-mask ${modal ? 'p-dialog-mask-modal' : ''} p-dialog-pos-${pos}`;
        maskEl.style.display = 'none';

        dialogEl = document.createElement('div');
        dialogEl.className = `p-dialog p-component ${props.draggable ? 'p-dialog-draggable' : ''} ${props.class || ''}`;
        if (props.width) dialogEl.style.width = props.width;
        if (props.style) dialogEl.style.cssText += props.style;

        const hasHeader = container.querySelector('.p-dialog-header');
        if (props.header && !hasHeader) {
            const headerEl = document.createElement('div');
            headerEl.className = 'p-dialog-header';
            setHtml(headerEl, html`
                <span class="p-dialog-title">${props.header}</span>
                <div class="p-dialog-header-actions">
                    ${props.maximizable ? html`<button type="button" class="p-dialog-header-action p-dialog-maximize-button" aria-label="Maximize">${MAXIMIZE_ICON_SVG}</button>` : ''}
                    ${props.closable !== false ? html`<button type="button" class="p-dialog-header-action p-dialog-close-button" aria-label="Close" data-dialog-close>${CLOSE_ICON_SVG}</button>` : ''}
                </div>
            `);
            dialogEl.appendChild(headerEl);
        }

        while (container.firstChild) {
            dialogEl.appendChild(container.firstChild);
        }

        maskEl.appendChild(dialogEl);
        container.appendChild(maskEl);
    }

    container.setAttribute('data-part', 'root');
    dialogEl.setAttribute('data-part', 'dialog');
    dialogEl.setAttribute('role', 'dialog');
    dialogEl.setAttribute('aria-modal', 'true');
    dialogEl.setAttribute('aria-labelledby', (props as any).ariaLabelledby || 'Dialog');
    maskEl.setAttribute('data-part', 'mask');

    const trap = useFocusTrap(dialogEl, {
        autoFocus: true,
        restoreFocus: true,
        signal: ctx?.signal
    });

    if (props.visible || (props as any).Visible) {
        maskEl.style.display = 'flex';
        maskEl.classList.add('p-dialog-mask-active');
        trap.activate();
    }

    const closeBtn = dialogEl.querySelector('.p-dialog-close-button');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            trap.deactivate();
        }, { signal: ctx?.signal });
    }

    // Per-island Escape Key Handler
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && maskEl.classList.contains('p-dialog-mask-active')) {
            trap.deactivate();
            maskEl.classList.remove('p-dialog-mask-active');
            const tEsc = setTimeout(() => {
                if (!maskEl.classList.contains('p-dialog-mask-active')) {
                    maskEl.style.display = 'none';
                }
            }, 200);
            ctx?.onCleanup?.(() => clearTimeout(tEsc));
            document.body.style.overflow = '';
        }
    }, { signal: ctx?.signal });

    let isMaximized = false;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    // Maximize Button
    const maxBtn = dialogEl.querySelector('.p-dialog-maximize-button');
    if (maxBtn) {
        maxBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isMaximized = !isMaximized;
            dialogEl.classList.toggle('p-dialog-maximized', isMaximized);
            setHtml(maxBtn, isMaximized ? RESTORE_ICON_SVG : MAXIMIZE_ICON_SVG);
            maxBtn.setAttribute('aria-label', isMaximized ? 'Minimize' : 'Maximize');
        }, { signal: ctx?.signal });
    }

    // Draggable Implementation
    if (props.draggable) {
        dialogEl.classList.add('p-dialog-draggable');
        const header = dialogEl.querySelector<HTMLElement>('.p-dialog-header');
        if (header) {
            header.addEventListener('mousedown', (e: MouseEvent) => {
                if ((e.target as HTMLElement).closest('.p-dialog-header-action')) return;
                if (isMaximized) return;

                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;

                const rect = dialogEl.getBoundingClientRect();
                initialLeft = rect.left;
                initialTop = rect.top;

                dialogEl.style.position = 'fixed';
                dialogEl.style.margin = '0';
                dialogEl.style.left = `${initialLeft}px`;
                dialogEl.style.top = `${initialTop}px`;

                const onMouseMove = (moveEvent: MouseEvent) => {
                    if (!isDragging) return;
                    const dx = moveEvent.clientX - startX;
                    const dy = moveEvent.clientY - startY;
                    dialogEl.style.left = `${initialLeft + dx}px`;
                    dialogEl.style.top = `${initialTop + dy}px`;
                };

                const onMouseUp = () => {
                    isDragging = false;
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                };

                document.addEventListener('mousemove', onMouseMove, { signal: ctx?.signal });
                document.addEventListener('mouseup', onMouseUp, { signal: ctx?.signal });
            }, { signal: ctx?.signal });
        }
    }
}
