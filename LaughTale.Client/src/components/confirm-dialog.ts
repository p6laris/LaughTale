import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { injectIslandStyle } from '../runtime/styles';
import { useFocusTrap, type UseFocusTrapReturn } from '../composables/useFocusTrap';
import { html, setHtml, unsafe, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'alertdialog'
};

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
    background: var(--p-overlay-bg, var(--p-surface-0, #ffffff));
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius-xl, 12px);
    box-shadow: var(--p-shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1));
    min-width: 24rem;
    max-width: 32rem;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform: scale(0.94) translateY(6px);
    transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    color: var(--p-text-color, #1e293b);
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
    color: var(--p-text-color, #1e293b);
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
    color: var(--p-text-muted, #64748b);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
    padding: 0;
}
.p-confirmdialog .p-dialog-header-close:hover {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-color, #1e293b);
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
    color: var(--p-primary-color, #10b981);
}

.p-confirmdialog-icon-danger {
    color: var(--p-red-500, #ef4444) !important;
}
.p-confirmdialog-icon-warning {
    color: var(--p-amber-500, #f59e0b) !important;
}
.p-confirmdialog-icon-info {
    color: var(--p-sky-500, #0ea5e9) !important;
}

.p-confirmdialog .p-confirmdialog-message {
    font-size: 0.9375rem;
    color: var(--p-text-color, #334155);
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
    background: color-mix(in srgb, var(--p-primary-color, #10b981) 12%, transparent);
    color: var(--p-primary-color, #10b981);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid color-mix(in srgb, var(--p-primary-color, #10b981) 30%, transparent);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--p-primary-color, #10b981) 20%, transparent);
}

/* Dark Mode Tokens */
html.dark .p-confirmdialog.p-dialog,
[data-theme="dark"] .p-confirmdialog.p-dialog,
.dark .p-confirmdialog.p-dialog {
    background: var(--p-surface-0, #0f172a);
    border-color: var(--p-border-color, #334155);
    color: var(--p-text-color, #f8fafc);
}
html.dark .p-confirmdialog .p-dialog-title,
[data-theme="dark"] .p-confirmdialog .p-dialog-title,
.dark .p-confirmdialog .p-dialog-title {
    color: var(--p-text-color, #f8fafc);
}
html.dark .p-confirmdialog .p-dialog-header-close,
[data-theme="dark"] .p-confirmdialog .p-dialog-header-close,
.dark .p-confirmdialog .p-dialog-header-close {
    color: var(--p-text-muted, #94a3b8);
}
html.dark .p-confirmdialog .p-dialog-header-close:hover,
[data-theme="dark"] .p-confirmdialog .p-dialog-header-close:hover,
.dark .p-confirmdialog .p-dialog-header-close:hover {
    background: var(--p-surface-100, #1e293b);
    color: var(--p-text-color, #f8fafc);
}
html.dark .p-confirmdialog .p-confirmdialog-message,
[data-theme="dark"] .p-confirmdialog .p-confirmdialog-message,
.dark .p-confirmdialog .p-confirmdialog-message {
    color: var(--p-text-color, #f8fafc);
}
html.dark .p-confirmdialog-headless-icon,
[data-theme="dark"] .p-confirmdialog-headless-icon,
.dark .p-confirmdialog-headless-icon {
    background: color-mix(in srgb, var(--p-primary-color, #10b981) 18%, transparent);
    border-color: color-mix(in srgb, var(--p-primary-color, #10b981) 40%, transparent);
    color: var(--p-primary-color, #10b981);
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
    signal?: AbortSignal;
}

export interface ConfirmDialogProps {
    group?: string;
    position?: string;
    ariaLabel?: string;
    dismissableMask?: boolean;
    closeOnEscape?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
    signal?: AbortSignal;
}

// Vector SVG Icons
const CLOSE_SVG = html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>`;
const INFO_ICON_SVG = html`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>`;
const DANGER_ALERT_SVG = html`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`;
const QUESTION_SVG = html`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`;
const CHECK_SVG = html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const CHECK_LARGE_SVG = html`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
const LOCK_SVG = html`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

// Global Confirmation Controller Instance
class ConfirmDialogManager {
    private maskEl: HTMLElement | null = null;
    private dialogEl: HTMLElement | null = null;
    private currentOptions: ConfirmDialogOptions | null = null;
    private trap: UseFocusTrapReturn | null = null;

    constructor() {
        if (typeof document !== 'undefined') {
            this.initDOM();
        }
    }

    private initDOM(signal?: AbortSignal) {
        if (this.maskEl) return;
        injectIslandStyle('confirm-dialog', CONFIRM_DIALOG_CSS);

        this.maskEl = document.createElement('div');
        this.maskEl.className = 'p-confirmdialog-mask p-confirmdialog-pos-center';
        this.maskEl.setAttribute('data-part', 'root');
        this.maskEl.setAttribute('role', 'dialog');
        this.maskEl.setAttribute('aria-modal', 'true');

        this.maskEl.addEventListener('click', (e) => {
            if (e.target === this.maskEl) {
                this.close(false);
            }
        }, { signal });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.maskEl?.classList.contains('p-confirmdialog-mask-active')) {
                this.close(false);
            }
        }, { signal });

        document.body.appendChild(this.maskEl);
    }

    public require(options: ConfirmDialogOptions) {
        this.initDOM(options.signal);
        this.currentOptions = options;
        const pos = (options.position || 'center').toLowerCase().replace(/[^a-z]/g, '');
        
        if (this.maskEl) {
            this.maskEl.className = `p-confirmdialog-mask p-confirmdialog-pos-${pos} p-confirmdialog-mask-active`;
            this.renderDialog(options);
            const dialogEl = this.maskEl.querySelector<HTMLElement>('.p-confirmdialog');
            if (dialogEl) {
                this.trap?.deactivate();
                this.trap = useFocusTrap(dialogEl, {
                    autoFocus: true,
                    restoreFocus: true,
                    signal: options.signal
                });
                this.trap.activate();
            }
        }
    }

    public close(accepted: boolean = false) {
        if (!this.maskEl) return;
        this.trap?.deactivate();
        this.trap = null;
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

    private getIconSVG(iconName?: string): Raw {
        if (!iconName) return html`<span class="p-confirmdialog-icon">${INFO_ICON_SVG}</span>`;
        const n = iconName.toLowerCase();
        if (n.includes('danger') || n.includes('trash') || n.includes('alert') || n.includes('triangle')) {
            return html`<span class="p-confirmdialog-icon p-confirmdialog-icon-danger" data-part="root">${DANGER_ALERT_SVG}</span>`;
        }
        if (n.includes('warning') || n.includes('exclamation')) {
            return html`<span class="p-confirmdialog-icon p-confirmdialog-icon-warning">${DANGER_ALERT_SVG}</span>`;
        }
        if (n.includes('question') || n.includes('help')) {
            return html`<span class="p-confirmdialog-icon p-confirmdialog-icon-info">${QUESTION_SVG}</span>`;
        }
        if (n.includes('check')) {
            return html`<span class="p-confirmdialog-icon">${CHECK_LARGE_SVG}</span>`;
        }
        return html`<span class="p-confirmdialog-icon">${INFO_ICON_SVG}</span>`;
    }

    private renderDialog(opt: ConfirmDialogOptions) {
        if (!this.maskEl) return;

        if (opt.headless) {
            setHtml(this.maskEl, html`
                <div class="p-confirmdialog p-dialog p-component" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-desc">
                    <div class="p-confirmdialog-headless">
                        <div class="p-confirmdialog-headless-icon">
                            ${LOCK_SVG}
                        </div>
                        <div>
                            <h3 id="confirm-dialog-title" style="font-size: 1.25rem; font-weight: 700; color: var(--p-text-color, #1e293b); margin: 0 0 0.5rem 0;">${opt.header || 'Save Changes?'}</h3>
                            <p id="confirm-dialog-desc" style="font-size: 0.875rem; color: var(--p-text-muted, #64748b); margin: 0; line-height: 1.5;">${opt.message || 'Are you sure you want to proceed with saving your profile changes?'}</p>
                        </div>
                        <div style="display: flex; gap: 0.75rem; width: 100%; margin-top: 0.5rem;">
                            <button type="button" class="btn-reject p-button p-button-outlined p-button-secondary" style="flex: 1; padding: 0.5rem 1rem; border-radius: var(--p-border-radius, 6px); border: 1px solid var(--p-border-color, #cbd5e1); background: transparent; color: var(--p-text-color, #1e293b); font-weight: 600; font-size: 0.875rem; cursor: pointer;">
                                ${opt.rejectLabel || 'Cancel'}
                            </button>
                            <button type="button" class="btn-accept p-button p-button-primary" style="flex: 1; padding: 0.5rem 1rem; border-radius: var(--p-border-radius, 6px); background: var(--p-primary-color); border: 1px solid var(--p-primary-color); color: var(--p-primary-contrast-color, #ffffff); font-weight: 600; font-size: 0.875rem; cursor: pointer;">
                                ${opt.acceptLabel || 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            `);
        } else if (opt.template) {
            setHtml(this.maskEl, unsafe(opt.template) /* custom dialog template */);
        } else {
            const isDanger = opt.acceptSeverity === 'danger' || (opt.icon && (opt.icon.includes('trash') || opt.icon.includes('danger')));
            const acceptBtnClass = isDanger ? 'p-button p-button-danger p-button-sm' : 'p-button p-button-primary p-button-sm';
            const acceptStyle = isDanger ? 'background: var(--p-red-500, #ef4444); border: 1px solid var(--p-red-500, #ef4444); color: #ffffff;' : 'background: var(--p-primary-color); border: 1px solid var(--p-primary-color); color: var(--p-primary-contrast-color, #ffffff);';

            setHtml(this.maskEl, html`
                <div class="p-confirmdialog p-dialog p-component" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-desc">
                    <div class="p-dialog-header">
                        <h3 class="p-dialog-title" id="confirm-dialog-title">${opt.header || 'Confirmation'}</h3>
                        <button type="button" class="p-dialog-header-close" aria-label="Close dialog">
                            ${CLOSE_SVG}
                        </button>
                    </div>
                    <div class="p-dialog-content">
                        ${this.getIconSVG(opt.icon)}
                        <p class="p-confirmdialog-message" id="confirm-dialog-desc">${opt.message || 'Are you sure you want to proceed?'}</p>
                    </div>
                    <div class="p-dialog-footer">
                        <button type="button" class="btn-reject p-button p-button-outlined p-button-secondary p-button-sm" style="padding: 0.45rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius, 6px); border: 1px solid var(--p-border-color, #cbd5e1); background: transparent; color: var(--p-text-color, #1e293b); cursor: pointer;">
                            ${opt.rejectLabel || 'Cancel'}
                        </button>
                        <button type="button" class="btn-accept ${acceptBtnClass}" style="padding: 0.45rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--p-border-radius, 6px); ${acceptStyle} cursor: pointer;">
                            ${opt.acceptLabel || (isDanger ? 'Delete' : 'Save')}
                        </button>
                    </div>
                </div>
            `);
        }

        // Attach events
        this.maskEl.querySelector('.p-dialog-header-close')?.addEventListener('click', () => this.close(false), { signal: opt.signal });
        this.maskEl.querySelector('.btn-reject')?.addEventListener('click', () => this.close(false), { signal: opt.signal });
        this.maskEl.querySelector('.btn-accept')?.addEventListener('click', () => this.close(true), { signal: opt.signal });
    }
}

// Attach global instance to window
const globalConfirm = new ConfirmDialogManager();
(window as any).$confirm = globalConfirm;

export function showToastFeedback(summary: string, detail: string, severity: 'success' | 'info' | 'warn' | 'error' = 'info', signal?: AbortSignal) {
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
    const borderColor = isError ? 'var(--lt-danger-500, var(--lt-danger-500))' : 'var(--lt-primary-500)';
    const bgColor = isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)';
    const textColor = isError ? 'var(--lt-danger-500, var(--lt-danger-500))' : 'var(--lt-primary-600)';

    toastItem.style.cssText = `background: var(--lt-surface-0); border-left: 4px solid ${borderColor}; border-radius: var(--lt-radius); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); padding: 0.75rem 1rem; width: 18rem; pointer-events: auto; display: flex; align-items: flex-start; gap: 0.5rem; animation: slideInRight 0.2s ease;`;
    setHtml(toastItem, html`
        <span style="color: ${textColor}; display: flex; align-items: center; margin-top: 2px;">${isError ? DANGER_ALERT_SVG : CHECK_SVG}</span>
        <div>
            <div style="font-weight: 700; font-size: 0.875rem; color: var(--lt-text-primary);">${summary}</div>
            <div style="font-size: 0.8125rem; color: var(--p-text-muted, var(--lt-surface-500));">${detail}</div>
        </div>
    `);

    toastContainer.appendChild(toastItem);
    let tInner: any = null;
    const tOuter = setTimeout(() => {
        toastItem.style.opacity = '0';
        toastItem.style.transition = 'opacity 0.3s ease';
        tInner = setTimeout(() => toastItem.remove(), 300);
    }, 3000);
    signal?.addEventListener('abort', () => {
        clearTimeout(tOuter);
        if (tInner) clearTimeout(tInner);
    }, { signal });
}

export default function ConfirmDialogIsland(container: HTMLElement, props: ConfirmDialogProps, ctx?: IslandContext) {
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
        }, { signal: ctx?.signal });
    });

    const p = props as any;
    if (triggers.length === 0 && (p.message || p.Message || p.header || p.Header)) {
        globalConfirm.require({
            header: p.header || p.Header,
            message: p.message || p.Message,
            position: p.position || p.Position,
            signal: ctx?.signal
        });
    }
}
