/**
 * SoftMax.LaughTale: Enterprise ConfirmDialog Component (Aura Design System compliant)
 * Modal confirmation overlay backed by a global service, declarative trigger bindings,
 * flexible positioning, customizable templates, headless mode, and ARIA alertdialog support.
 */

import { injectIslandStyle } from '../runtime/styles';

const CONFIRM_DIALOG_CSS = `
.p-confirmdialog-mask {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 1200;
    display: flex;
    box-sizing: border-box;
    padding: 1.5rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.p-confirmdialog-mask.p-confirmdialog-mask-active {
    opacity: 1;
    pointer-events: auto;
}

/* Positioning rules */
.p-confirmdialog-mask.p-confirmdialog-pos-center {
    align-items: center;
    justify-content: center;
}
.p-confirmdialog-mask.p-confirmdialog-pos-top {
    align-items: flex-start;
    justify-content: center;
    padding-top: 3rem;
}
.p-confirmdialog-mask.p-confirmdialog-pos-bottom {
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 3rem;
}
.p-confirmdialog-mask.p-confirmdialog-pos-left {
    align-items: center;
    justify-content: flex-start;
    padding-left: 3rem;
}
.p-confirmdialog-mask.p-confirmdialog-pos-right {
    align-items: center;
    justify-content: flex-end;
    padding-right: 3rem;
}
.p-confirmdialog-mask.p-confirmdialog-pos-topleft {
    align-items: flex-start;
    justify-content: flex-start;
    padding-top: 3rem;
    padding-left: 3rem;
}
.p-confirmdialog-mask.p-confirmdialog-pos-topright {
    align-items: flex-start;
    justify-content: flex-end;
    padding-top: 3rem;
    padding-right: 3rem;
}
.p-confirmdialog-mask.p-confirmdialog-pos-bottomleft {
    align-items: flex-end;
    justify-content: flex-start;
    padding-bottom: 3rem;
    padding-left: 3rem;
}
.p-confirmdialog-mask.p-confirmdialog-pos-bottomright {
    align-items: flex-end;
    justify-content: flex-end;
    padding-bottom: 3rem;
    padding-right: 3rem;
}

/* Dialog Container */
.p-confirmdialog.p-dialog {
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius-xl, 12px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    min-width: 24rem;
    max-width: 32rem;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform: scale(0.94) translateY(6px);
    transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.p-confirmdialog-mask.p-confirmdialog-mask-active .p-confirmdialog.p-dialog {
    transform: scale(1) translateY(0);
}

/* Header */
.p-confirmdialog .p-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem 0.75rem 1.5rem;
    border-bottom: none;
}

.p-confirmdialog .p-dialog-title {
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--p-text-color, #0f172a);
    margin: 0;
}

.p-confirmdialog .p-dialog-header-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    border: none;
    background: transparent;
    color: var(--p-surface-500, #64748b);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
    padding: 0;
}
.p-confirmdialog .p-dialog-header-close:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #0f172a);
}

/* Content */
.p-confirmdialog .p-dialog-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.5rem 1.5rem 1.5rem 1.5rem;
    flex: 1 1 auto;
}

.p-confirmdialog .p-confirmdialog-icon {
    font-size: 1.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 0.125rem;
    color: var(--p-primary-500, #10b981);
}

.p-confirmdialog-icon-danger {
    color: #ef4444 !important;
}
.p-confirmdialog-icon-warning {
    color: #f59e0b !important;
}
.p-confirmdialog-icon-info {
    color: #3b82f6 !important;
}

.p-confirmdialog .p-confirmdialog-message {
    font-size: 0.9375rem;
    color: var(--p-surface-700, #334155);
    line-height: 1.5;
    margin: 0;
}

/* Footer */
.p-confirmdialog .p-dialog-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0 1.5rem 1.25rem 1.5rem;
    border-top: none;
}

/* Headless Variant */
.p-confirmdialog-headless {
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.25rem;
}

.p-confirmdialog-headless-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 9999px;
    background: var(--p-primary-50, #ecfdf5);
    color: var(--p-primary-600, #059669);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--p-primary-200, #a7f3d0);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

/* Dark Mode Tokens */
.dark .p-confirmdialog.p-dialog,
[data-theme="dark"] .p-confirmdialog.p-dialog {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
.dark .p-confirmdialog .p-dialog-title,
[data-theme="dark"] .p-confirmdialog .p-dialog-title {
    color: var(--p-surface-0, #f8fafc);
}
.dark .p-confirmdialog .p-dialog-header-close,
[data-theme="dark"] .p-confirmdialog .p-dialog-header-close {
    color: var(--p-surface-400, #94a3b8);
}
.dark .p-confirmdialog .p-dialog-header-close:hover,
[data-theme="dark"] .p-confirmdialog .p-dialog-header-close:hover {
    background: var(--p-surface-800, #1e293b);
    color: #ffffff;
}
.dark .p-confirmdialog .p-confirmdialog-message,
[data-theme="dark"] .p-confirmdialog .p-confirmdialog-message {
    color: var(--p-surface-300, #cbd5e1);
}
.dark .p-confirmdialog-headless-icon,
[data-theme="dark"] .p-confirmdialog-headless-icon {
    background: rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.35);
    color: #6ee7b7;
}
`;

export interface ConfirmDialogOptions {
    message?: string;
    header?: string;
    icon?: string;
    position?: string;
    group?: string;
    acceptLabel?: string;
    rejectLabel?: string;
    acceptIcon?: string;
    rejectIcon?: string;
    acceptSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger';
    rejectSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger';
    acceptClass?: string;
    rejectClass?: string;
    accept?: () => void;
    reject?: () => void;
    template?: string;
    headless?: boolean;
}

export interface ConfirmDialogProps {
    group?: string;
    position?: string;
    ariaLabel?: string;
    dismissableMask?: boolean;
    closeOnEscape?: boolean;
}

// Vector SVG Icons
const CLOSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>`;
const INFO_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>`;
const DANGER_ALERT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`;
const QUESTION_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`;
const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const CHECK_LARGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
const LOCK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

// Global Confirmation Controller Instance
class ConfirmDialogManager {
    private maskEl: HTMLElement | null = null;
    private dialogEl: HTMLElement | null = null;
    private currentOptions: ConfirmDialogOptions | null = null;

    constructor() {
        if (typeof document !== 'undefined') {
            this.initDOM();
        }
    }

    private initDOM() {
        if (this.maskEl) return;
        injectIslandStyle('confirm-dialog', CONFIRM_DIALOG_CSS);

        this.maskEl = document.createElement('div');
        this.maskEl.className = 'p-confirmdialog-mask p-confirmdialog-pos-center';
        this.maskEl.setAttribute('role', 'dialog');
        this.maskEl.setAttribute('aria-modal', 'true');

        this.maskEl.addEventListener('click', (e) => {
            if (e.target === this.maskEl) {
                this.close(false);
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.maskEl?.classList.contains('p-confirmdialog-mask-active')) {
                this.close(false);
            }
        });

        document.body.appendChild(this.maskEl);
    }

    public require(options: ConfirmDialogOptions) {
        this.initDOM();
        this.currentOptions = options;
        const pos = (options.position || 'center').toLowerCase().replace(/[^a-z]/g, '');
        
        if (this.maskEl) {
            this.maskEl.className = `p-confirmdialog-mask p-confirmdialog-pos-${pos}`;
            this.renderDialog(options);
            setTimeout(() => {
                this.maskEl?.classList.add('p-confirmdialog-mask-active');
            }, 10);
        }
    }

    public close(accepted: boolean = false) {
        if (!this.maskEl) return;
        this.maskEl.classList.remove('p-confirmdialog-mask-active');

        if (this.currentOptions) {
            if (accepted && this.currentOptions.accept) {
                this.currentOptions.accept();
            } else if (!accepted && this.currentOptions.reject) {
                this.currentOptions.reject();
            }
        }
        this.currentOptions = null;
    }

    private getIconSVG(iconName?: string): string {
        if (!iconName) return INFO_ICON_SVG;
        const n = iconName.toLowerCase();
        if (n.includes('danger') || n.includes('trash') || n.includes('alert') || n.includes('triangle')) {
            return `<span class="p-confirmdialog-icon p-confirmdialog-icon-danger">${DANGER_ALERT_SVG}</span>`;
        }
        if (n.includes('warning') || n.includes('exclamation')) {
            return `<span class="p-confirmdialog-icon p-confirmdialog-icon-warning">${DANGER_ALERT_SVG}</span>`;
        }
        if (n.includes('question') || n.includes('help')) {
            return `<span class="p-confirmdialog-icon p-confirmdialog-icon-info">${QUESTION_SVG}</span>`;
        }
        if (n.includes('check')) {
            return `<span class="p-confirmdialog-icon">${CHECK_LARGE_SVG}</span>`;
        }
        return `<span class="p-confirmdialog-icon">${INFO_ICON_SVG}</span>`;
    }

    private renderDialog(opt: ConfirmDialogOptions) {
        if (!this.maskEl) return;

        if (opt.headless) {
            this.maskEl.innerHTML = `
                <div class="p-confirmdialog p-dialog p-component" role="alertdialog">
                    <div class="p-confirmdialog-headless">
                        <div class="p-confirmdialog-headless-icon">
                            ${LOCK_SVG}
                        </div>
                        <div>
                            <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--p-text-color); margin: 0 0 0.5rem 0;">${opt.header || 'Save Changes?'}</h3>
                            <p style="font-size: 0.875rem; color: var(--p-text-muted); margin: 0; line-height: 1.5;">${opt.message || 'Are you sure you want to proceed with saving your profile changes?'}</p>
                        </div>
                        <div style="display: flex; gap: 0.75rem; width: 100%; margin-top: 0.5rem;">
                            <button type="button" class="btn-reject p-button p-button-outlined p-button-secondary" style="flex: 1; padding: 0.5rem 1rem; border-radius: var(--p-border-radius); font-weight: 600; font-size: 0.875rem;">
                                ${opt.rejectLabel || 'Cancel'}
                            </button>
                            <button type="button" class="btn-accept p-button p-button-primary" style="flex: 1; padding: 0.5rem 1rem; border-radius: var(--p-border-radius); font-weight: 600; font-size: 0.875rem;">
                                ${opt.acceptLabel || 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else if (opt.template) {
            this.maskEl.innerHTML = opt.template;
        } else {
            const isDanger = opt.acceptSeverity === 'danger' || (opt.icon && (opt.icon.includes('trash') || opt.icon.includes('danger')));
            const acceptBtnClass = isDanger ? 'p-button p-button-danger p-button-sm' : 'p-button p-button-primary p-button-sm';
            const acceptStyle = isDanger ? 'background: #ef4444; border: 1px solid #ef4444; color: #ffffff;' : 'background: var(--p-primary-500); border: 1px solid var(--p-primary-500); color: #ffffff;';

            this.maskEl.innerHTML = `
                <div class="p-confirmdialog p-dialog p-component" role="alertdialog">
                    <div class="p-dialog-header">
                        <h3 class="p-dialog-title">${opt.header || 'Confirmation'}</h3>
                        <button type="button" class="p-dialog-header-close" aria-label="Close dialog">
                            ${CLOSE_SVG}
                        </button>
                    </div>
                    <div class="p-dialog-content">
                        ${this.getIconSVG(opt.icon)}
                        <p class="p-confirmdialog-message">${opt.message || 'Are you sure you want to proceed?'}</p>
                    </div>
                    <div class="p-dialog-footer">
                        <button type="button" class="btn-reject p-button p-button-outlined p-button-secondary p-button-sm" style="padding: 0.45rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: transparent; color: var(--p-text-color);">
                            ${opt.rejectLabel || 'Cancel'}
                        </button>
                        <button type="button" class="btn-accept ${acceptBtnClass}" style="padding: 0.45rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius); ${acceptStyle}">
                            ${opt.acceptLabel || (isDanger ? 'Delete' : 'Save')}
                        </button>
                    </div>
                </div>
            `;
        }

        // Attach events
        this.maskEl.querySelector('.p-dialog-header-close')?.addEventListener('click', () => this.close(false));
        this.maskEl.querySelector('.btn-reject')?.addEventListener('click', () => this.close(false));
        this.maskEl.querySelector('.btn-accept')?.addEventListener('click', () => this.close(true));
    }
}

// Attach global instance to window
const globalConfirm = new ConfirmDialogManager();
(window as any).$confirm = globalConfirm;

export function showToastFeedback(summary: string, detail: string, severity: 'success' | 'info' | 'warn' | 'error' = 'info') {
    // If global toast island exists, trigger it
    if ((window as any).$toast?.add) {
        (window as any).$toast.add({ severity, summary, detail, life: 3000 });
        return;
    }
    
    // Custom lightweight alert toast fallback
    let toastContainer = document.getElementById('aura-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'aura-toast-container';
        toastContainer.style.cssText = 'position: fixed; top: 1.5rem; right: 1.5rem; z-index: 2000; display: flex; flex-direction: column; gap: 0.5rem; pointer-events: none;';
        document.body.appendChild(toastContainer);
    }

    const toastItem = document.createElement('div');
    const isError = severity === 'error' || severity === 'warn';
    const borderColor = isError ? '#ef4444' : 'var(--p-primary-500, #10b981)';
    const bgColor = isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)';
    const textColor = isError ? '#ef4444' : 'var(--p-primary-600, #059669)';

    toastItem.style.cssText = `background: var(--p-surface-0, #ffffff); border-left: 4px solid ${borderColor}; border-radius: var(--p-border-radius, 6px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); padding: 0.75rem 1rem; width: 18rem; pointer-events: auto; display: flex; align-items: flex-start; gap: 0.5rem; animation: slideInRight 0.2s ease;`;
    toastItem.innerHTML = `
        <span style="color: ${textColor}; display: flex; align-items: center; margin-top: 2px;">${isError ? DANGER_ALERT_SVG : CHECK_SVG}</span>
        <div>
            <div style="font-weight: 700; font-size: 0.875rem; color: var(--p-text-color, #0f172a);">${summary}</div>
            <div style="font-size: 0.8125rem; color: var(--p-text-muted, #64748b);">${detail}</div>
        </div>
    `;

    toastContainer.appendChild(toastItem);
    setTimeout(() => {
        toastItem.style.opacity = '0';
        toastItem.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toastItem.remove(), 300);
    }, 3000);
}

export default function ConfirmDialogIsland(container: HTMLElement, props: ConfirmDialogProps) {
    injectIslandStyle('confirm-dialog', CONFIRM_DIALOG_CSS);

    // Bind all declarative triggers inside container or document
    const triggers = container.querySelectorAll<HTMLButtonElement>('[data-confirm-trigger]');
    triggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const action = btn.getAttribute('data-confirm-trigger') || 'basic';
            const position = btn.getAttribute('data-confirm-position') || props.position || 'center';
            const header = btn.getAttribute('data-confirm-header');
            const message = btn.getAttribute('data-confirm-message');
            const icon = btn.getAttribute('data-confirm-icon');
            const acceptSeverity = (btn.getAttribute('data-confirm-severity') as any) || 'primary';

            if (action === 'delete') {
                globalConfirm.require({
                    header: header || 'Delete Confirmation',
                    message: message || 'Do you want to delete this record?',
                    icon: 'danger',
                    acceptSeverity: 'danger',
                    acceptLabel: 'Delete',
                    rejectLabel: 'Cancel',
                    position,
                    accept: () => showToastFeedback('Confirmed', 'Record deleted', 'info'),
                    reject: () => showToastFeedback('Rejected', 'You have rejected', 'error')
                });
            } else if (action === 'headless') {
                globalConfirm.require({
                    header: header || 'Save Changes?',
                    message: message || 'Are you sure you want to proceed with saving your profile changes?',
                    headless: true,
                    position,
                    accept: () => showToastFeedback('Confirmed', 'Changes saved successfully.', 'success'),
                    reject: () => showToastFeedback('Rejected', 'You have cancelled the action.', 'info')
                });
            } else if (action === 'template') {
                globalConfirm.require({
                    header: header || 'Confirmation',
                    message: message || 'Please confirm to continue with processing your order.',
                    icon: 'question',
                    position,
                    acceptLabel: 'Yes',
                    rejectLabel: 'No',
                    accept: () => showToastFeedback('Confirmed', 'Order processed successfully.', 'success'),
                    reject: () => showToastFeedback('Rejected', 'Order process cancelled.', 'warn')
                });
            } else {
                // Default Basic Confirm
                globalConfirm.require({
                    header: header || 'Confirmation',
                    message: message || 'Are you sure you want to proceed?',
                    icon: icon || 'info',
                    acceptSeverity,
                    position,
                    accept: () => showToastFeedback('Confirmed', 'You have accepted', 'info'),
                    reject: () => showToastFeedback('Rejected', 'You have rejected', 'error')
                });
            }
        });
    });
}
