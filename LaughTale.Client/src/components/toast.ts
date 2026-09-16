/**
 * LaughTale: Enterprise Toast Component (LaughTale Aura Design System)
 * High-performance notification overlay engine supporting 7 viewport positions,
 * clean vertical list flow with customizable gap, hover-pause timers, semantic severities,
 * promise/async flows, custom templates, action buttons, and full WAI-ARIA alert accessibility.
 */

import { LucideIcons, getLucideIcon } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';
import { onIslandEvent } from '../runtime/events';
import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'native',
    element: 'button'
};

export interface ToastMessageOptions {
    id?: string;
    severity?: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';
    summary?: string;
    detail?: string;
    life?: number;
    sticky?: boolean;
    group?: string;
    icon?: string;
    spin?: boolean;
    closable?: boolean;
    styleClass?: string;
    contentHtml?: string;
    actionLabel?: string;
    onAction?: () => void;
    pt?: PassthroughRecord;
    signal?: AbortSignal;
}

export interface ToastContainerProps {
    group?: string;
    position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center';
    limit?: number;
    gap?: number;
    autoZIndex?: boolean;
    baseZIndex?: number;
    class?: string;
    style?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const TOAST_CSS = `
/* ==========================================================================
   LaughTale Aura Toast Component Tokens & Positioning
   ========================================================================== */
.p-toast {
    position: fixed;
    z-index: var(--p-toast-z-index, 1100);
    display: flex;
    flex-direction: column;
    gap: var(--p-toast-gap, 0.75rem);
    pointer-events: none;
    width: var(--p-toast-width, 25rem);
    max-width: calc(100vw - 2.5rem);
    box-sizing: border-box;
    font-family: var(--p-font-family, inherit);
}

/* 7 Viewport Positions */
.p-toast-top-right {
    top: 1.25rem;
    right: 1.25rem;
}
.p-toast-top-left {
    top: 1.25rem;
    left: 1.25rem;
}
.p-toast-top-center {
    top: 1.25rem;
    left: 50%;
    transform: translateX(-50%);
}
.p-toast-bottom-right {
    bottom: 1.25rem;
    right: 1.25rem;
    flex-direction: column-reverse;
}
.p-toast-bottom-left {
    bottom: 1.25rem;
    left: 1.25rem;
    flex-direction: column-reverse;
}
.p-toast-bottom-center {
    bottom: 1.25rem;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: column-reverse;
}
.p-toast-center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Toast Message Card */
.p-toast-message {
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    border-radius: var(--p-toast-border-radius, var(--lt-radius));
    border-width: var(--p-toast-border-width, 1px);
    border-style: solid;
    padding: var(--p-toast-content-padding, 0.875rem 1.125rem);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(var(--p-toast-blur, 10px));
    -webkit-backdrop-filter: blur(var(--p-toast-blur, 10px));
    box-sizing: border-box;
    will-change: transform, opacity, max-height, padding, margin;
    overflow: hidden;
    animation: p-toast-enter 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
                transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
                max-height 260ms cubic-bezier(0.16, 1, 0.3, 1),
                padding 260ms cubic-bezier(0.16, 1, 0.3, 1),
                margin 260ms cubic-bezier(0.16, 1, 0.3, 1),
                border-width 260ms ease;
}

.p-toast-message.p-toast-message-leave {
    pointer-events: none;
    opacity: 0 !important;
    transform: translate3d(0, -8px, 0) scale(0.96) !important;
}

@keyframes p-toast-enter {
    from {
        opacity: 0;
        transform: translate3d(0, -12px, 0) scale(0.97);
    }
    to {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
    }
}

.p-toast-message-content {
    display: flex;
    align-items: flex-start;
    gap: var(--p-toast-content-gap, 0.75rem);
    width: 100%;
}

.p-toast-message-icon {
    width: var(--p-toast-icon-size, 1.25rem);
    height: var(--p-toast-icon-size, 1.25rem);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.125rem;
}

.p-toast-message-text {
    display: flex;
    flex-direction: column;
    gap: var(--p-toast-text-gap, 0.25rem);
    flex: 1 1 auto;
}

.p-toast-summary {
    font-weight: var(--p-toast-summary-font-weight, 600);
    font-size: var(--p-toast-summary-font-size, 0.875rem);
    line-height: 1.35;
}

.p-toast-detail {
    font-weight: var(--p-toast-detail-font-weight, 400);
    font-size: var(--p-toast-detail-font-size, 0.8125rem);
    line-height: 1.45;
    opacity: 0.92;
}

.p-toast-detail a,
.p-toast-summary a {
    color: inherit;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
}

.p-toast-close-button {
    background: transparent;
    border: none;
    cursor: pointer;
    width: var(--p-toast-close-button-width, 1.75rem);
    height: var(--p-toast-close-button-height, 1.75rem);
    border-radius: var(--p-toast-close-button-border-radius, var(--lt-radius));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-inline-start: auto;
    flex-shrink: 0;
    padding: 0;
    opacity: 0.7;
    transition: background-color 150ms ease, opacity 150ms ease, transform 120ms ease;
    color: inherit;
    outline: none;
}
.p-toast-close-button:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.08);
}
.p-toast-close-button:focus-visible {
    opacity: 1;
    box-shadow: 0 0 0 2px currentColor;
}
.p-toast-close-button:active {
    transform: scale(0.92);
}

.p-toast-close-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--p-toast-close-icon-size, 0.875rem);
    height: var(--p-toast-close-icon-size, 0.875rem);
}

.p-toast-spin {
    animation: p-toast-spinner-rot 1s linear infinite;
}

@keyframes p-toast-spinner-rot {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* ==========================================================================
   Severity Color Schemes
   ========================================================================== */
/* Info */
.p-toast-message-info {
    background: var(--p-toast-info-background, rgba(239, 246, 255, 0.96));
    border-color: var(--p-toast-info-border-color, var(--lt-info-200));
    color: var(--p-toast-info-color, var(--lt-info-800));
}
.p-toast-message-info .p-toast-message-icon,
.p-toast-message-info .p-toast-close-button {
    color: var(--p-toast-info-color, var(--lt-info-800));
}

/* Success */
.p-toast-message-success {
    background: var(--p-toast-success-background, rgba(236, 253, 245, 0.96));
    border-color: var(--p-toast-success-border-color, var(--lt-primary-200));
    color: var(--p-toast-success-color, var(--lt-primary-800));
}
.p-toast-message-success .p-toast-message-icon,
.p-toast-message-success .p-toast-close-button {
    color: var(--p-toast-success-color, var(--lt-primary-800));
}

/* Warn */
.p-toast-message-warn {
    background: var(--p-toast-warn-background, rgba(255, 251, 235, 0.96));
    border-color: var(--p-toast-warn-border-color, var(--lt-warn-200));
    color: var(--p-toast-warn-color, var(--lt-warn-800));
}
.p-toast-message-warn .p-toast-message-icon,
.p-toast-message-warn .p-toast-close-button {
    color: var(--p-toast-warn-color, var(--lt-warn-800));
}

/* Error */
.p-toast-message-error {
    background: var(--p-toast-error-background, rgba(254, 242, 242, 0.96));
    border-color: var(--p-toast-error-border-color, var(--lt-danger-200));
    color: var(--p-toast-error-color, var(--lt-danger-800));
}
.p-toast-message-error .p-toast-message-icon,
.p-toast-message-error .p-toast-close-button {
    color: var(--p-toast-error-color, var(--lt-danger-800));
}

/* Secondary */
.p-toast-message-secondary {
    background: var(--p-toast-secondary-background, rgba(248, 250, 252, 0.96));
    border-color: var(--p-toast-secondary-border-color, var(--lt-surface-200));
    color: var(--p-toast-secondary-color, var(--lt-surface-600));
}
.p-toast-message-secondary .p-toast-message-icon,
.p-toast-message-secondary .p-toast-close-button {
    color: var(--p-toast-secondary-color, var(--lt-surface-600));
}

/* Contrast */
.p-toast-message-contrast {
    background: var(--p-toast-contrast-background, var(--lt-surface-900));
    border-color: var(--p-toast-contrast-border-color, var(--lt-surface-800));
    color: var(--p-toast-contrast-color, var(--lt-surface-0));
}
.p-toast-message-contrast .p-toast-message-icon,
.p-toast-message-contrast .p-toast-close-button {
    color: var(--p-toast-contrast-color, var(--lt-surface-0));
}
.p-toast-message-contrast .p-toast-close-button:hover {
    background: rgba(255, 255, 255, 0.15);
}

/* Dark Mode Tokens */
html.dark .p-toast-message-info,
[data-theme="dark"] .p-toast-message-info,
.dark .p-toast-message-info {
    background: rgba(37, 99, 235, 0.2);
    border-color: rgba(59, 130, 246, 0.35);
    color: var(--p-info-300);
}
html.dark .p-toast-message-info .p-toast-message-icon,
html.dark .p-toast-message-info .p-toast-close-button,
[data-theme="dark"] .p-toast-message-info .p-toast-message-icon,
[data-theme="dark"] .p-toast-message-info .p-toast-close-button,
.dark .p-toast-message-info .p-toast-message-icon,
.dark .p-toast-message-info .p-toast-close-button {
    color: var(--p-info-300);
}

html.dark .p-toast-message-success,
[data-theme="dark"] .p-toast-message-success,
.dark .p-toast-message-success {
    background: rgba(16, 185, 129, 0.2);
    border-color: rgba(16, 185, 129, 0.35);
    color: var(--p-primary-300);
}
html.dark .p-toast-message-success .p-toast-message-icon,
html.dark .p-toast-message-success .p-toast-close-button,
[data-theme="dark"] .p-toast-message-success .p-toast-message-icon,
[data-theme="dark"] .p-toast-message-success .p-toast-close-button,
.dark .p-toast-message-success .p-toast-message-icon,
.dark .p-toast-message-success .p-toast-close-button {
    color: var(--p-primary-300);
}

html.dark .p-toast-message-warn,
[data-theme="dark"] .p-toast-message-warn,
.dark .p-toast-message-warn {
    background: rgba(245, 158, 11, 0.2);
    border-color: rgba(245, 158, 11, 0.35);
    color: var(--p-warn-300);
}
html.dark .p-toast-message-warn .p-toast-message-icon,
html.dark .p-toast-message-warn .p-toast-close-button,
[data-theme="dark"] .p-toast-message-warn .p-toast-message-icon,
[data-theme="dark"] .p-toast-message-warn .p-toast-close-button,
.dark .p-toast-message-warn .p-toast-message-icon,
.dark .p-toast-message-warn .p-toast-close-button {
    color: var(--p-warn-300);
}

html.dark .p-toast-message-error,
[data-theme="dark"] .p-toast-message-error,
.dark .p-toast-message-error {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.35);
    color: var(--p-danger-300);
}
html.dark .p-toast-message-error .p-toast-message-icon,
html.dark .p-toast-message-error .p-toast-close-button,
[data-theme="dark"] .p-toast-message-error .p-toast-message-icon,
[data-theme="dark"] .p-toast-message-error .p-toast-close-button,
.dark .p-toast-message-error .p-toast-message-icon,
.dark .p-toast-message-error .p-toast-close-button {
    color: var(--p-danger-300);
}

html.dark .p-toast-message-secondary,
[data-theme="dark"] .p-toast-message-secondary,
.dark .p-toast-message-secondary {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    color: var(--p-text-color);
}
html.dark .p-toast-message-secondary .p-toast-message-icon,
html.dark .p-toast-message-secondary .p-toast-close-button,
[data-theme="dark"] .p-toast-message-secondary .p-toast-message-icon,
[data-theme="dark"] .p-toast-message-secondary .p-toast-close-button,
.dark .p-toast-message-secondary .p-toast-message-icon,
.dark .p-toast-message-secondary .p-toast-close-button {
    color: var(--p-text-muted);
}

html.dark .p-toast-message-contrast,
[data-theme="dark"] .p-toast-message-contrast,
.dark .p-toast-message-contrast {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    color: var(--p-text-color);
}
html.dark .p-toast-message-contrast .p-toast-message-icon,
html.dark .p-toast-message-contrast .p-toast-close-button,
[data-theme="dark"] .p-toast-message-contrast .p-toast-message-icon,
[data-theme="dark"] .p-toast-message-contrast .p-toast-close-button,
.dark .p-toast-message-contrast .p-toast-message-icon,
.dark .p-toast-message-contrast .p-toast-close-button {
    color: var(--p-text-color);
}

html.dark .p-toast-close-button:hover,
[data-theme="dark"] .p-toast-close-button:hover,
.dark .p-toast-close-button:hover {
    background: rgba(255, 255, 255, 0.12);
}
`;

const CLOSE_SVG = getLucideIcon('x', 14, 2).replace('"p-icon p-icon-x"', '"p-icon p-icon-x p-toast-close-icon"').replace('<svg ', '<svg data-part="root" ');

export class ToastService {
    private registeredContainers: Map<string, HTMLElement> = new Map();
    private activeMessages: Map<string, { el: HTMLElement; timeoutId?: any; remainingLife: number; startTime: number; signal?: AbortSignal }> = new Map();

    constructor() {
    }

    public registerContainer(group: string, containerEl: HTMLElement) {
        this.registeredContainers.set(group || 'default', containerEl);
    }

    public unregisterContainer(group: string) {
        this.registeredContainers.delete(group || 'default');
    }

    private getContainerForGroup(group?: string, position?: string): HTMLElement {
        const targetGroup = group || 'default';
        let container = this.registeredContainers.get(targetGroup);

        if (!container || !document.body.contains(container)) {
            injectIslandStyle('toast', TOAST_CSS);
            const pos = position || (targetGroup.startsWith('top-') || targetGroup.startsWith('bottom-') || targetGroup === 'center' ? targetGroup : 'top-right');
            container = document.createElement('div');
            container.id = `aura-toast-container-${targetGroup}`;
            container.className = `p-toast p-toast-${pos}`;
            document.body.appendChild(container);
            this.registeredContainers.set(targetGroup, container);
        }

        return container;
    }

    public add(msg: ToastMessageOptions): string {
        const id = msg.id || `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const group = msg.group || 'default';
        const container = this.getContainerForGroup(group);

        const severity = msg.severity || 'info';
        const sticky = msg.sticky === true;
        const life = sticky ? 0 : (msg.life !== undefined ? msg.life : 3000);

        let iconSvg = '';
        if (msg.spin) {
            iconSvg = `<span class="p-toast-spin">${LucideIcons.loader2}</span>`;
        } else if (msg.icon && (LucideIcons as any)[msg.icon]) {
            iconSvg = (LucideIcons as any)[msg.icon];
        } else {
            switch (severity) {
                case 'success':
                    iconSvg = LucideIcons.check;
                    break;
                case 'warn':
                    iconSvg = LucideIcons.receipt || LucideIcons.alertTriangle;
                    break;
                case 'error':
                    iconSvg = LucideIcons.alertTriangle || LucideIcons.xCircle;
                    break;
                case 'secondary':
                    iconSvg = `<span class="p-toast-spin">${LucideIcons.loader2}</span>`;
                    break;
                case 'contrast':
                    iconSvg = LucideIcons.wifi || LucideIcons.sparkles;
                    break;
                case 'info':
                default:
                    iconSvg = LucideIcons.sparkles || LucideIcons.info;
                    break;
            }
        }

        const toastEl = document.createElement('div');
        toastEl.className = `p-toast-message p-toast-message-${severity} ${msg.styleClass || ''}`;
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        toastEl.setAttribute('data-toast-id', id);
        toastEl.setAttribute('data-toast-group', group);

        if (msg.contentHtml) {
            setHtml(toastEl, html`
                <div class="p-toast-message-content">
                    <div style="width: 100%;">${unsafe(msg.contentHtml)}</div>
                    ${msg.closable !== false ? html`
                        <button type="button" class="p-toast-close-button" aria-label="Close" title="Close" data-toast-close>
                            ${unsafe(CLOSE_SVG)}
                        </button>
                    ` : ''}
                </div>
            `);
        } else {
            setHtml(toastEl, html`
                <div class="p-toast-message-content">
                    <div class="p-toast-message-icon">${unsafe(iconSvg)}</div>
                    <div class="p-toast-message-text">
                        ${msg.summary ? html`<div class="p-toast-summary">${msg.summary}</div>` : ''}
                        ${msg.detail ? html`<div class="p-toast-detail">${msg.detail}</div>` : ''}
                        ${msg.actionLabel ? html`
                            <button type="button" class="p-button p-button-sm p-button-primary" style="margin-top: 0.5rem; align-self: flex-start; padding: 0.25rem 0.65rem; font-size: 0.775rem;" data-toast-action-btn>
                                ${msg.actionLabel}
                            </button>
                        ` : ''}
                    </div>
                    ${msg.closable !== false ? html`
                        <button type="button" class="p-toast-close-button" aria-label="Close" title="Close" data-toast-close>
                            ${unsafe(CLOSE_SVG)}
                        </button>
                    ` : ''}
                </div>
            `);
        }

        const closeBtn = toastEl.querySelector('[data-toast-close]');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeById(id);
            }, { signal: msg.signal });
            closeBtn.addEventListener('keydown', (e: any) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.removeById(id);
                }
            }, { signal: msg.signal });
        }

        const actionBtn = toastEl.querySelector('[data-toast-action-btn]');
        if (actionBtn && msg.onAction) {
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                msg.onAction!();
            }, { signal: msg.signal });
        }

        // Timer Pause on Hover
        let timerInfo = {
            el: toastEl,
            timeoutId: undefined as any,
            remainingLife: life,
            startTime: Date.now(),
            signal: msg.signal
        };

        const startTimer = (duration: number) => {
            if (duration <= 0) return;
            timerInfo.startTime = Date.now();
            timerInfo.remainingLife = duration;
            timerInfo.timeoutId = setTimeout(() => {
                this.removeById(id);
            }, duration);
        };

        const pauseTimer = () => {
            if (timerInfo.timeoutId) {
                clearTimeout(timerInfo.timeoutId);
                timerInfo.timeoutId = undefined;
                const elapsed = Date.now() - timerInfo.startTime;
                timerInfo.remainingLife = Math.max(0, timerInfo.remainingLife - elapsed);
            }
        };

        const resumeTimer = () => {
            if (timerInfo.remainingLife > 0 && !timerInfo.timeoutId) {
                startTimer(timerInfo.remainingLife);
            }
        };

        toastEl.addEventListener('mouseenter', pauseTimer, { signal: msg.signal });
        toastEl.addEventListener('mouseleave', resumeTimer, { signal: msg.signal });

        if (life > 0) {
            startTimer(life);
        }

        this.activeMessages.set(id, timerInfo);
        container.appendChild(toastEl);

        return id;
    }

    public removeById(id: string) {
        const item = this.activeMessages.get(id);
        if (!item) return;

        if (item.timeoutId) {
            clearTimeout(item.timeoutId);
        }

        const el = item.el;
        if (el.dataset.dismissing === 'true') return;
        el.dataset.dismissing = 'true';

        const height = el.offsetHeight;
        el.style.height = `${height}px`;
        el.style.maxHeight = `${height}px`;
        el.style.boxSizing = 'border-box';
        el.style.overflow = 'hidden';
        el.style.pointerEvents = 'none';
        el.style.willChange = 'height, max-height, opacity, transform, margin, padding';
        el.style.transition = 'height 220ms cubic-bezier(0.16, 1, 0.3, 1), max-height 220ms cubic-bezier(0.16, 1, 0.3, 1), opacity 180ms ease, transform 180ms cubic-bezier(0.16, 1, 0.3, 1), margin 220ms cubic-bezier(0.16, 1, 0.3, 1), padding 220ms cubic-bezier(0.16, 1, 0.3, 1), border-width 220ms ease';

        this.activeMessages.delete(id);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.style.height = '0px';
                el.style.maxHeight = '0px';
                el.style.opacity = '0';
                el.style.transform = 'translate3d(0, -8px, 0) scale(0.96)';
                el.style.marginTop = '0px';
                el.style.marginBottom = '0px';
                el.style.paddingTop = '0px';
                el.style.paddingBottom = '0px';
                el.style.borderTopWidth = '0px';
                el.style.borderBottomWidth = '0px';
            });
        });

        const onEnd = () => {
            el.removeEventListener('transitionend', onEnd);
            el.remove();
        };
        el.addEventListener('transitionend', onEnd, { signal: item.signal });
        const fallback = setTimeout(onEnd, 250);
        item.signal?.addEventListener?.('abort', () => clearTimeout(fallback), { once: true });
    }

    public remove(msg: ToastMessageOptions | string) {
        if (typeof msg === 'string') {
            this.removeById(msg);
        } else if (msg.id) {
            this.removeById(msg.id);
        } else if (msg.group) {
            this.removeGroup(msg.group);
        }
    }

    public removeGroup(group: string) {
        this.activeMessages.forEach((item, id) => {
            if (item.el.getAttribute('data-toast-group') === group) {
                this.removeById(id);
            }
        });
    }

    public removeAllGroups() {
        this.activeMessages.forEach((_, id) => {
            this.removeById(id);
        });
    }
}

export const globalToast = new ToastService();
if (typeof window !== 'undefined') {
    (window as any).$toast = globalToast;
    (window as any).useToast = () => globalToast;
    (window as any).ToastService = ToastService;
}

/**
 * Imperative handle (ROADMAP.v5.md Part C, "imperative handles" — `toast.show()` was the roadmap's
 * own named example). Unlike dialog.ts, no mount-time indirection is needed: `globalToast` is already
 * a persistent singleton keyed by group, registered by `ToastIsland` below, so this can forward
 * directly - `container.island.show(msg)` targets this specific container's group by default, but a
 * caller can still override via `msg.group` for cross-container broadcasts.
 */
export function createHandle(_container: HTMLElement, props: ToastContainerProps) {
    const group = props.group || 'default';
    return {
        show: (msg: ToastMessageOptions) => globalToast.add({ ...msg, group: msg.group || group }),
        clear: () => globalToast.removeGroup(group)
    };
}

export default function ToastIsland(container: HTMLElement, props: ToastContainerProps, ctx?: IslandContext) {
    injectIslandStyle('toast', TOAST_CSS);

    const group = props.group || 'default';
    const position = props.position || 'top-right';

    applyPart(container, 'root', `p-toast p-toast-${position} ${props.class || ''}`, props.pt, props.studioOverrides);
    if (props.gap) {
        container.style.setProperty('--p-toast-gap', `${props.gap}px`);
    }

    globalToast.registerContainer(group, container);

    const unsubToast = onIslandEvent('toast:show', (detail: any) => {
        if (detail) globalToast.add(detail);
    });

    document.addEventListener('toast:clear', (e: Event) => {
        const detail = (e as CustomEvent).detail;
        if (detail?.group) {
            globalToast.removeGroup(detail.group);
        } else {
            globalToast.removeAllGroups();
        }
    }, { signal: ctx?.signal });

    ctx?.onCleanup(() => {
        unsubToast();
        globalToast.unregisterContainer(group);
        globalToast.removeGroup(group);
    });
}
