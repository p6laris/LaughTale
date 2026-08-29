/**
 * SoftMax.LaughTale: Enterprise Message Component (PrimeVue 4 Aura Design System)
 * High-performance inline notification messages with severity levels,
 * variants (filled, outlined, simple), sizes (small, normal, large),
 * closable triggers with silky smooth 60fps height collapse slide exit animations,
 * auto-dismiss life timers, and full WAI-ARIA alert accessibility.
 */

import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';

const MESSAGE_CSS = `
/* ==========================================================================
   PrimeVue 4 Aura Message Component Tokens & Styles
   ========================================================================== */
.p-message {
    display: flex;
    align-items: stretch;
    border-radius: var(--p-message-border-radius, var(--p-border-radius, 8px));
    border-width: var(--p-message-border-width, 1px);
    border-style: solid;
    margin: 0;
    position: relative;
    box-sizing: border-box;
    font-family: var(--p-font-family, inherit);
    overflow: hidden;
    will-change: opacity, transform, max-height, padding, margin;
    transition: opacity 240ms cubic-bezier(0.16, 1, 0.3, 1),
                transform 240ms cubic-bezier(0.16, 1, 0.3, 1),
                max-height 280ms cubic-bezier(0.16, 1, 0.3, 1),
                padding 280ms cubic-bezier(0.16, 1, 0.3, 1),
                margin 280ms cubic-bezier(0.16, 1, 0.3, 1),
                border-width 280ms ease;
}

.p-message.p-message-enter {
    animation: p-message-slide-down 260ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-message.p-message-exit {
    opacity: 0 !important;
    max-height: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    border-width: 0 !important;
    transform: translateY(-8px) scale(0.98) !important;
    pointer-events: none !important;
}

@keyframes p-message-slide-down {
    from {
        opacity: 0;
        transform: translateY(-10px) scale(0.97);
        max-height: 0;
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
        max-height: 200px;
    }
}

.p-message-content {
    display: flex;
    align-items: center;
    gap: var(--p-message-content-gap, 0.5rem);
    padding: var(--p-message-content-padding, 0.5rem 0.75rem);
    width: 100%;
    box-sizing: border-box;
    transition: padding 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-message-exit .p-message-content {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}

.p-message-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--p-message-icon-size, 1.125rem);
    height: var(--p-message-icon-size, 1.125rem);
    flex-shrink: 0;
}

.p-message-text {
    flex: 1;
    font-size: var(--p-message-text-font-size, 0.875rem);
    font-weight: var(--p-message-text-font-weight, 500);
    line-height: 1.45;
    word-break: break-word;
}

.p-message-text a {
    color: inherit;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: opacity 0.12s ease;
}

.p-message-text a:hover {
    opacity: 0.85;
}

.p-message-close-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--p-message-close-button-width, 1.75rem);
    height: var(--p-message-close-button-height, 1.75rem);
    border-radius: var(--p-message-close-button-border-radius, var(--p-border-radius, 6px));
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    margin-left: auto;
    flex-shrink: 0;
    opacity: 0.7;
    transition: background-color 150ms ease, opacity 150ms ease, transform 120ms ease;
    outline: none;
}

.p-message-close-button:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.06);
}

.p-message-close-button:focus-visible {
    opacity: 1;
    box-shadow: 0 0 0 2px currentColor;
}

.p-message-close-button:active {
    transform: scale(0.92);
}

.p-message-close-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 0.875rem;
    height: 0.875rem;
}

/* ==========================================================================
   Size Modifiers (Small, Base, Large)
   ========================================================================== */
.p-message-sm .p-message-content {
    padding: 0.35rem 0.55rem;
    gap: 0.375rem;
}
.p-message-sm .p-message-text {
    font-size: 0.775rem;
}
.p-message-sm .p-message-icon {
    width: 0.95rem;
    height: 0.95rem;
}
.p-message-sm .p-message-close-button {
    width: 1.5rem;
    height: 1.5rem;
}
.p-message-sm .p-message-close-icon {
    width: 0.75rem;
    height: 0.75rem;
}

.p-message-lg .p-message-content {
    padding: 0.75rem 1rem;
    gap: 0.65rem;
}
.p-message-lg .p-message-text {
    font-size: 0.95rem;
}
.p-message-lg .p-message-icon {
    width: 1.35rem;
    height: 1.35rem;
}
.p-message-lg .p-message-close-button {
    width: 2rem;
    height: 2rem;
}

/* ==========================================================================
   Filled Severity Variants (Default)
   ========================================================================== */
/* Info */
.p-message-info {
    background: var(--p-message-info-background, #eff6ff);
    border-color: var(--p-message-info-border-color, #bfdbfe);
    color: var(--p-message-info-color, #1e40af);
}
.p-message-info .p-message-icon {
    color: var(--p-message-info-color, #1e40af);
}

/* Success */
.p-message-success {
    background: var(--p-message-success-background, #ecfdf5);
    border-color: var(--p-message-success-border-color, #a7f3d0);
    color: var(--p-message-success-color, #065f46);
}
.p-message-success .p-message-icon {
    color: var(--p-message-success-color, #065f46);
}

/* Warn */
.p-message-warn {
    background: var(--p-message-warn-background, #fffbeb);
    border-color: var(--p-message-warn-border-color, #fde68a);
    color: var(--p-message-warn-color, #92400e);
}
.p-message-warn .p-message-icon {
    color: var(--p-message-warn-color, #92400e);
}

/* Error */
.p-message-error {
    background: var(--p-message-error-background, #fef2f2);
    border-color: var(--p-message-error-border-color, #fecaca);
    color: var(--p-message-error-color, #991b1b);
}
.p-message-error .p-message-icon {
    color: var(--p-message-error-color, #991b1b);
}

/* Secondary */
.p-message-secondary {
    background: var(--p-message-secondary-background, #f8fafc);
    border-color: var(--p-message-secondary-border-color, #e2e8f0);
    color: var(--p-message-secondary-color, #475569);
}
.p-message-secondary .p-message-icon {
    color: var(--p-message-secondary-color, #475569);
}

/* Contrast */
.p-message-contrast {
    background: var(--p-message-contrast-background, #0f172a);
    border-color: var(--p-message-contrast-border-color, #1e293b);
    color: var(--p-message-contrast-color, #ffffff);
}
.p-message-contrast .p-message-icon {
    color: var(--p-message-contrast-color, #ffffff);
}
.p-message-contrast .p-message-close-button:hover {
    background: rgba(255, 255, 255, 0.15);
}

/* ==========================================================================
   Outlined Variant
   ========================================================================== */
.p-message-outlined {
    background: transparent !important;
    border-width: 1px !important;
}

.p-message-outlined.p-message-info {
    border-color: var(--p-message-info-border-color, #3b82f6);
    color: var(--p-message-info-outlined-color, #2563eb);
}
.p-message-outlined.p-message-success {
    border-color: var(--p-message-success-border-color, #10b981);
    color: var(--p-message-success-outlined-color, #059669);
}
.p-message-outlined.p-message-warn {
    border-color: var(--p-message-warn-border-color, #f59e0b);
    color: var(--p-message-warn-outlined-color, #d97706);
}
.p-message-outlined.p-message-error {
    border-color: var(--p-message-error-border-color, #ef4444);
    color: var(--p-message-error-outlined-color, #dc2626);
}
.p-message-outlined.p-message-secondary {
    border-color: var(--p-message-secondary-border-color, #cbd5e1);
    color: var(--p-message-secondary-outlined-color, #475569);
}
.p-message-outlined.p-message-contrast {
    border-color: var(--p-message-contrast-border-color, #0f172a);
    color: var(--p-message-contrast-outlined-color, #0f172a);
}

/* ==========================================================================
   Simple Variant (Clean Inline Text, Ideal for Form Validation)
   ========================================================================== */
.p-message-simple {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
}
.p-message-simple .p-message-content {
    padding: var(--p-message-simple-content-padding, 0.125rem 0);
    gap: 0.35rem;
}

.p-message-simple.p-message-info {
    color: var(--p-message-info-simple-color, #2563eb);
}
.p-message-simple.p-message-success {
    color: var(--p-message-success-simple-color, #059669);
}
.p-message-simple.p-message-warn {
    color: var(--p-message-warn-simple-color, #d97706);
}
.p-message-simple.p-message-error {
    color: var(--p-message-error-simple-color, #dc2626);
}
.p-message-simple.p-message-secondary {
    color: var(--p-message-secondary-simple-color, #64748b);
}
.p-message-simple.p-message-contrast {
    color: var(--p-message-contrast-simple-color, #0f172a);
}

/* ==========================================================================
   Spin Animation Helper for Icons
   ========================================================================== */
.p-message-spin {
    animation: p-message-spinner-rot 1s linear infinite;
}

@keyframes p-message-spinner-rot {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* ==========================================================================
   Dark Mode Tokens
   ========================================================================== */
.dark .p-message-info,
[data-theme="dark"] .p-message-info {
    background: rgba(37, 99, 235, 0.15);
    border-color: rgba(59, 130, 246, 0.3);
    color: #93c5fd;
}
.dark .p-message-info .p-message-icon,
[data-theme="dark"] .p-message-info .p-message-icon {
    color: #93c5fd;
}

.dark .p-message-success,
[data-theme="dark"] .p-message-success {
    background: rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.3);
    color: #6ee7b7;
}
.dark .p-message-success .p-message-icon,
[data-theme="dark"] .p-message-success .p-message-icon {
    color: #6ee7b7;
}

.dark .p-message-warn,
[data-theme="dark"] .p-message-warn {
    background: rgba(245, 158, 11, 0.15);
    border-color: rgba(245, 158, 11, 0.3);
    color: #fcd34d;
}
.dark .p-message-warn .p-message-icon,
[data-theme="dark"] .p-message-warn .p-message-icon {
    color: #fcd34d;
}

.dark .p-message-error,
[data-theme="dark"] .p-message-error {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.3);
    color: #fca5a5;
}
.dark .p-message-error .p-message-icon,
[data-theme="dark"] .p-message-error .p-message-icon {
    color: #fca5a5;
}

.dark .p-message-secondary,
[data-theme="dark"] .p-message-secondary {
    background: rgba(100, 116, 139, 0.15);
    border-color: rgba(148, 163, 184, 0.25);
    color: #cbd5e1;
}
.dark .p-message-secondary .p-message-icon,
[data-theme="dark"] .p-message-secondary .p-message-icon {
    color: #cbd5e1;
}

.dark .p-message-contrast,
[data-theme="dark"] .p-message-contrast {
    background: #ffffff;
    border-color: #e2e8f0;
    color: #0f172a;
}
.dark .p-message-contrast .p-message-icon,
[data-theme="dark"] .p-message-contrast .p-message-icon {
    color: #0f172a;
}

.dark .p-message-outlined.p-message-contrast,
[data-theme="dark"] .p-message-outlined.p-message-contrast {
    border-color: #ffffff;
    color: #ffffff;
}

.dark .p-message-simple.p-message-contrast,
[data-theme="dark"] .p-message-simple.p-message-contrast {
    color: #ffffff;
}

.dark .p-message-close-button:hover,
[data-theme="dark"] .p-message-close-button:hover {
    background: rgba(255, 255, 255, 0.1);
}
`;

export interface MessageProps {
    severity?: 'info' | 'success' | 'warn' | 'error' | 'secondary' | 'contrast';
    variant?: 'outlined' | 'simple' | 'filled';
    size?: 'small' | 'large';
    closable?: boolean;
    life?: number;
    icon?: string;
    closeIcon?: string;
    text?: string;
    content?: string;
    avatar?: string;
    spin?: boolean;
    class?: string;
    style?: string;
    dynamic?: boolean;
    messages?: Array<{ severity: string; content: string; closable?: boolean }>;
}

export default function MessageIsland(container: HTMLElement, props: MessageProps) {
    injectIslandStyle('message', MESSAGE_CSS);

    const isDynamic = props.dynamic === true;
    let dynamicMessages = props.messages || [];

    function getDefaultIcon(severity: string, spin?: boolean): string {
        if (spin) {
            return `<span class="p-message-spin">${LucideIcons.loader2 || '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>'}</span>`;
        }

        switch (severity) {
            case 'success':
                return LucideIcons.check || '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>';
            case 'warn':
                return LucideIcons.receipt || LucideIcons.alertTriangle || '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
            case 'error':
                return LucideIcons.alertTriangle || LucideIcons.xCircle || '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
            case 'secondary':
                return `<span class="p-message-spin">${LucideIcons.loader2 || '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>'}</span>`;
            case 'contrast':
                return LucideIcons.wifi || LucideIcons.sparkles || '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.86a10 10 0 0 1 14 0"/><path d="M8.5 16.43a5 5 0 0 1 7 0"/></svg>';
            case 'info':
            default:
                return LucideIcons.sparkles || LucideIcons.info || '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';
        }
    }

    function getCustomIconSvg(iconName?: string): string {
        if (!iconName) return '';
        if (iconName.startsWith('<svg')) return iconName;
        if ((LucideIcons as any)[iconName]) return (LucideIcons as any)[iconName];
        return '';
    }

    const closeIconSvg = `<svg class="p-message-close-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

    function renderSingleMessage(p: MessageProps, initialHtmlText?: string): string {
        const severity = p.severity || 'info';
        const variant = p.variant ? `p-message-${p.variant}` : '';
        const sizeClass = p.size === 'small' ? 'p-message-sm' : (p.size === 'large' ? 'p-message-lg' : '');
        const closable = p.closable === true;
        const text = p.text || p.content || initialHtmlText || '';

        let iconContent = '';
        if (p.avatar) {
            iconContent = `<img src="${p.avatar}" alt="Avatar" style="width: 1.75rem; height: 1.75rem; border-radius: 9999px; object-fit: cover;" />`;
        } else if (p.icon) {
            iconContent = getCustomIconSvg(p.icon);
        } else {
            iconContent = getDefaultIcon(severity, p.spin);
        }

        const classes = [
            'p-message',
            `p-message-${severity}`,
            variant,
            sizeClass,
            'p-message-enter',
            p.class || ''
        ].filter(Boolean).join(' ');

        return `
            <div class="${classes}" role="alert" aria-live="assertive" aria-atomic="true" ${p.style ? `style="${p.style}"` : ''} data-message-item ${p.life ? `data-life="${p.life}"` : ''}>
                <div class="p-message-content">
                    ${iconContent ? `<span class="p-message-icon">${iconContent}</span>` : ''}
                    <div class="p-message-text">${text}</div>
                    ${closable ? `
                        <button type="button" class="p-message-close-button" aria-label="Close" title="Close message" data-message-close>
                            ${closeIconSvg}
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    if (isDynamic) {
        function renderDynamicContainer(): string {
            const listHtml = dynamicMessages.map(msg => renderSingleMessage({
                severity: msg.severity as any,
                content: msg.content,
                closable: msg.closable !== false
            })).join('');

            return `
                <div class="p-message-dynamic-wrapper" style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%;">
                    <div style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 0.5rem;">
                        <button type="button" class="p-button p-button-primary" data-add-messages>Add Messages</button>
                        <button type="button" class="p-button p-button-secondary" data-clear-messages>Clear Messages</button>
                    </div>
                    <div class="p-message-dynamic-list" style="display: flex; flex-direction: column; gap: 0.75rem;">
                        ${listHtml}
                    </div>
                </div>
            `;
        }

        function wireDynamic() {
            const addBtn = container.querySelector('[data-add-messages]');
            const clearBtn = container.querySelector('[data-clear-messages]');
            const listContainer = container.querySelector<HTMLElement>('.p-message-dynamic-list');

            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    dynamicMessages = [
                        { severity: 'info', content: 'Dynamic Info Message', closable: true },
                        { severity: 'success', content: 'Dynamic Success Message', closable: true },
                        { severity: 'warn', content: 'Dynamic Warn Message', closable: true }
                    ];
                    if (listContainer) {
                        listContainer.innerHTML = dynamicMessages.map(msg => renderSingleMessage(msg as any)).join('');
                        wireMessageClosers(listContainer);
                    }
                });
            }

            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    if (listContainer) {
                        const items = listContainer.querySelectorAll<HTMLElement>('[data-message-item]');
                        items.forEach(el => {
                            const currentHeight = el.getBoundingClientRect().height;
                            el.style.maxHeight = `${currentHeight}px`;
                            void el.offsetHeight;
                            el.classList.add('p-message-exit');
                        });
                        setTimeout(() => {
                            dynamicMessages = [];
                            listContainer.innerHTML = '';
                        }, 280);
                    }
                });
            }

            if (listContainer) {
                wireMessageClosers(listContainer);
            }
        }

        container.innerHTML = renderDynamicContainer();
        wireDynamic();
        return;
    }

    const slotContent = container.innerHTML.trim();
    container.innerHTML = renderSingleMessage(props, slotContent);
    wireMessageClosers(container);

    function wireMessageClosers(root: HTMLElement) {
        root.querySelectorAll<HTMLElement>('[data-message-item]').forEach(msgEl => {
            const closeBtn = msgEl.querySelector('[data-message-close]');
            const lifeStr = msgEl.getAttribute('data-life');

            const dismissMessage = () => {
                const currentHeight = msgEl.getBoundingClientRect().height;
                msgEl.style.maxHeight = `${currentHeight}px`;
                // Force reflow for silky smooth CSS interpolation
                void msgEl.offsetHeight;
                msgEl.classList.add('p-message-exit');
                setTimeout(() => {
                    msgEl.remove();
                }, 280);
            };

            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dismissMessage();
                });

                closeBtn.addEventListener('keydown', (e: KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        dismissMessage();
                    }
                });
            }

            if (lifeStr) {
                const duration = parseInt(lifeStr, 10);
                if (!isNaN(duration) && duration > 0) {
                    setTimeout(() => {
                        dismissMessage();
                    }, duration);
                }
            }
        });
    }
}
