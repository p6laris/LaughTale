/**
 * LaughTale: Enterprise ConfirmPopup Component (PrimeVue 4 Aura Design System compliant)
 * Anchored confirmation popup overlay with target alignment, arrow notches, smooth animations,
 * support for Basic, Template, and Headless modes, and seamless Toast notifications.
 */

import { injectIslandStyle } from '../runtime/styles';

const CONFIRM_POPUP_CSS = `
.p-confirmpopup {
    position: absolute;
    z-index: 1100;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius-lg, 10px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    padding: 0.875rem 1rem;
    min-width: 17rem;
    max-width: 24rem;
    box-sizing: border-box;
    display: none;
    opacity: 0;
    transform: scale(0.95) translateY(4px);
    transition: transform 0.16s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.16s ease;
}

.p-confirmpopup.p-confirmpopup-active {
    display: block;
    opacity: 1;
    transform: scale(1) translateY(0);
}

/* Arrow pointer notch */
.p-confirmpopup::before,
.p-confirmpopup::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: solid transparent;
    pointer-events: none;
}

/* Flipped top - popup is below target, arrow points UP */
.p-confirmpopup-flipped-top::before {
    bottom: 100%;
    left: var(--p-popup-arrow-left, 24px);
    border-width: 8px;
    border-bottom-color: var(--p-border-color, #e2e8f0);
}
.p-confirmpopup-flipped-top::after {
    bottom: 100%;
    left: calc(var(--p-popup-arrow-left, 24px) + 1px);
    border-width: 7px;
    border-bottom-color: var(--p-surface-0, #ffffff);
}

/* Flipped bottom - popup is above target, arrow points DOWN */
.p-confirmpopup-flipped-bottom::before {
    top: 100%;
    left: var(--p-popup-arrow-left, 24px);
    border-width: 8px;
    border-top-color: var(--p-border-color, #e2e8f0);
}
.p-confirmpopup-flipped-bottom::after {
    top: 100%;
    left: calc(var(--p-popup-arrow-left, 24px) + 1px);
    border-width: 7px;
    border-top-color: var(--p-surface-0, #ffffff);
}

/* Body Content */
.p-confirmpopup-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-bottom: 0.75rem;
}

.p-confirmpopup-icon {
    font-size: 1.35rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--p-surface-700, #334155);
}

.p-confirmpopup-icon-danger {
    color: #ef4444 !important;
}

.p-confirmpopup-message {
    font-size: 0.875rem;
    color: var(--p-text-color, #0f172a);
    line-height: 1.45;
    margin: 0;
    font-weight: 500;
}

/* Footer Actions */
.p-confirmpopup-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    padding-top: 0.25rem;
}

/* Template Variant */
.p-confirmpopup-template-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.875rem;
    padding: 0.5rem 0.5rem 0.875rem 0.5rem;
    border-bottom: 1px solid var(--p-border-color, #e2e8f0);
    margin-bottom: 0.75rem;
}

.p-confirmpopup-template-icon {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 9999px;
    border: 3px solid var(--p-surface-400, #94a3b8);
    color: var(--p-surface-600, #475569);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
}

/* Headless Variant */
.p-confirmpopup-headless {
    padding: 0.25rem 0.25rem 0.5rem 0.25rem;
}

/* Dark Mode Tokens */
.dark .p-confirmpopup,
[data-theme="dark"] .p-confirmpopup {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
.dark .p-confirmpopup-flipped-top::before,
[data-theme="dark"] .p-confirmpopup-flipped-top::before {
    border-bottom-color: var(--p-surface-700, #334155);
}
.dark .p-confirmpopup-flipped-top::after,
[data-theme="dark"] .p-confirmpopup-flipped-top::after {
    border-bottom-color: var(--p-surface-900, #0f172a);
}
.dark .p-confirmpopup-flipped-bottom::before,
[data-theme="dark"] .p-confirmpopup-flipped-bottom::before {
    border-top-color: var(--p-surface-700, #334155);
}
.dark .p-confirmpopup-flipped-bottom::after,
[data-theme="dark"] .p-confirmpopup-flipped-bottom::after {
    border-top-color: var(--p-surface-900, #0f172a);
}
.dark .p-confirmpopup-message,
[data-theme="dark"] .p-confirmpopup-message {
    color: var(--p-surface-100, #f8fafc);
}
.dark .p-confirmpopup-template-body,
[data-theme="dark"] .p-confirmpopup-template-body {
    border-color: var(--p-surface-700, #334155);
}
.dark .p-confirmpopup-template-icon,
[data-theme="dark"] .p-confirmpopup-template-icon {
    border-color: var(--p-surface-600, #475569);
    color: var(--p-surface-300, #cbd5e1);
}
`;

export interface ConfirmPopupOptions {
    target: HTMLElement;
    message?: string;
    icon?: string;
    group?: string;
    acceptLabel?: string;
    rejectLabel?: string;
    acceptIcon?: string;
    rejectIcon?: string;
    acceptSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger';
    rejectSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger';
    acceptProps?: Record<string, any>;
    rejectProps?: Record<string, any>;
    accept?: () => void;
    reject?: () => void;
    template?: boolean;
    headless?: boolean;
}

export interface ConfirmPopupProps {
    group?: string;
    targetSelector?: string;
    message?: string;
    acceptText?: string;
    rejectText?: string;
    actionName?: string;
}

// Vector SVGs
const ALERT_TRIANGLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9"ツール height="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`;
const INFO_CIRCLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>`;
const EXCLAMATION_LARGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`;
const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const CLOSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>`;

class ConfirmPopupManager {
    private popupEl: HTMLElement | null = null;
    private currentOptions: ConfirmPopupOptions | null = null;
    private outsideClickListener: ((e: MouseEvent) => void) | null = null;

    constructor() {
        if (typeof document !== 'undefined') {
            this.initDOM();
        }
    }

    private initDOM() {
        if (this.popupEl) return;
        injectIslandStyle('confirm-popup', CONFIRM_POPUP_CSS);

        this.popupEl = document.createElement('div');
        this.popupEl.className = 'p-confirmpopup p-component';
        this.popupEl.setAttribute('role', 'alertdialog');
        this.popupEl.setAttribute('aria-modal', 'true');

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.popupEl?.classList.contains('p-confirmpopup-active')) {
                this.close(false);
            }
        });

        document.body.appendChild(this.popupEl);
    }

    public require(options: ConfirmPopupOptions) {
        this.initDOM();
        if (!this.popupEl || !options.target) return;

        // If clicking same target that is already open, toggle close
        if (this.currentOptions && this.currentOptions.target === options.target && this.popupEl.classList.contains('p-confirmpopup-active')) {
            this.close(false);
            return;
        }

        this.currentOptions = options;
        this.renderContent(options);
        this.alignToTarget(options.target);

        this.popupEl.classList.add('p-confirmpopup-active');

        // Bind outside click
        setTimeout(() => {
            if (this.outsideClickListener) {
                document.removeEventListener('click', this.outsideClickListener);
            }
            this.outsideClickListener = (e: MouseEvent) => {
                if (this.popupEl && !this.popupEl.contains(e.target as Node) && !options.target.contains(e.target as Node)) {
                    this.close(false);
                }
            };
            document.addEventListener('click', this.outsideClickListener);
        }, 10);
    }

    public close(accepted: boolean = false) {
        if (!this.popupEl) return;
        this.popupEl.classList.remove('p-confirmpopup-active');

        if (this.outsideClickListener) {
            document.removeEventListener('click', this.outsideClickListener);
            this.outsideClickListener = null;
        }

        if (this.currentOptions) {
            if (accepted && this.currentOptions.accept) {
                this.currentOptions.accept();
            } else if (!accepted && this.currentOptions.reject) {
                this.currentOptions.reject();
            }
        }
        this.currentOptions = null;
    }

    private alignToTarget(target: HTMLElement) {
        if (!this.popupEl) return;

        const targetRect = target.getBoundingClientRect();
        const popupWidth = this.popupEl.offsetWidth || 280;
        const popupHeight = this.popupEl.offsetHeight || 140;

        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - targetRect.bottom;
        const spaceAbove = targetRect.top;

        const placeAbove = spaceBelow < popupHeight + 16 && spaceAbove > popupHeight + 16;

        let top = 0;
        if (placeAbove) {
            top = targetRect.top + window.scrollY - popupHeight - 10;
            this.popupEl.classList.remove('p-confirmpopup-flipped-top');
            this.popupEl.classList.add('p-confirmpopup-flipped-bottom');
        } else {
            top = targetRect.bottom + window.scrollY + 10;
            this.popupEl.classList.remove('p-confirmpopup-flipped-bottom');
            this.popupEl.classList.add('p-confirmpopup-flipped-top');
        }

        // Horizontal alignment (align popup left with target left, with offset constraint)
        let left = targetRect.left + window.scrollX;
        const maxLeft = window.innerWidth - popupWidth - 16;
        if (left > maxLeft) left = maxLeft;
        if (left < 16) left = 16;

        // Arrow notch offset pointing at target center
        const targetCenter = targetRect.left + window.scrollX + (targetRect.width / 2);
        const arrowLeft = Math.max(16, Math.min(popupWidth - 24, targetCenter - left - 8));

        this.popupEl.style.top = `${top}px`;
        this.popupEl.style.left = `${left}px`;
        this.popupEl.style.setProperty('--p-popup-arrow-left', `${arrowLeft}px`);
    }

    private renderContent(opt: ConfirmPopupOptions) {
        if (!this.popupEl) return;

        if (opt.headless) {
            this.popupEl.innerHTML = `
                <div class="p-confirmpopup-headless">
                    <span class="p-confirmpopup-message" style="display: block; font-size: 0.875rem;">${opt.message || 'Save your current process?'}</span>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.875rem;">
                        <button type="button" class="btn-accept p-button p-button-primary p-button-sm" style="padding: 0.35rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: var(--p-border-radius); background: var(--p-surface-900); border: 1px solid var(--p-surface-900); color: #ffffff; cursor: pointer;">
                            ${opt.acceptLabel || 'Save'}
                        </button>
                        <button type="button" class="btn-reject p-button p-button-text p-button-secondary p-button-sm" style="padding: 0.35rem 0.75rem; font-size: 0.8125rem; font-weight: 500; border: none; background: transparent; color: var(--p-surface-700); cursor: pointer;">
                            ${opt.rejectLabel || 'Cancel'}
                        </button>
                    </div>
                </div>
            `;
        } else if (opt.template) {
            this.popupEl.innerHTML = `
                <div class="p-confirmpopup-template-body">
                    <div class="p-confirmpopup-template-icon">
                        ${EXCLAMATION_LARGE_SVG}
                    </div>
                    <p class="p-confirmpopup-message" style="font-size: 0.875rem; color: var(--p-text-color);">${opt.message || 'Please confirm to proceed moving forward.'}</p>
                </div>
                <div class="p-confirmpopup-footer">
                    <button type="button" class="btn-reject p-button p-button-outlined p-button-secondary p-button-sm" style="display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.4rem 0.75rem; font-size: 0.8125rem; font-weight: 600; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: transparent; color: var(--p-text-color); cursor: pointer;">
                        ${CLOSE_SVG}
                        <span>${opt.rejectLabel || 'Cancel'}</span>
                    </button>
                    <button type="button" class="btn-accept p-button p-button-primary p-button-sm" style="display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.4rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: var(--p-border-radius); background: var(--p-surface-900); border: 1px solid var(--p-surface-900); color: #ffffff; cursor: pointer;">
                        ${CHECK_SVG}
                        <span>${opt.acceptLabel || 'Confirm'}</span>
                    </button>
                </div>
            `;
        } else {
            const isDanger = opt.acceptSeverity === 'danger' || (opt.acceptProps && opt.acceptProps.severity === 'danger');
            const iconSvg = isDanger ? INFO_CIRCLE_SVG : ALERT_TRIANGLE_SVG;
            const acceptLabel = opt.acceptLabel || (opt.acceptProps?.label) || (isDanger ? 'Delete' : 'Save');
            const rejectLabel = opt.rejectLabel || (opt.rejectProps?.label) || 'Cancel';
            const acceptStyle = isDanger ? 'background: #ef4444; border: 1px solid #ef4444; color: #ffffff;' : 'background: var(--p-surface-900); border: 1px solid var(--p-surface-900); color: #ffffff;';

            this.popupEl.innerHTML = `
                <div class="p-confirmpopup-content">
                    <span class="p-confirmpopup-icon ${isDanger ? 'p-confirmpopup-icon-danger' : ''}">
                        ${iconSvg}
                    </span>
                    <span class="p-confirmpopup-message">${opt.message || 'Are you sure you want to proceed?'}</span>
                </div>
                <div class="p-confirmpopup-footer">
                    <button type="button" class="btn-reject p-button p-button-outlined p-button-secondary p-button-sm" style="padding: 0.35rem 0.75rem; font-size: 0.8125rem; font-weight: 600; border-radius: var(--p-border-radius); border: 1px solid var(--p-border-color); background: transparent; color: var(--p-text-color); cursor: pointer;">
                        ${rejectLabel}
                    </button>
                    <button type="button" class="btn-accept p-button p-button-primary p-button-sm" style="padding: 0.35rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: var(--p-border-radius); ${acceptStyle} cursor: pointer;">
                        ${acceptLabel}
                    </button>
                </div>
            `;
        }

        this.popupEl.querySelector('.btn-reject')?.addEventListener('click', () => this.close(false));
        this.popupEl.querySelector('.btn-accept')?.addEventListener('click', () => this.close(true));
    }
}

const globalConfirmPopup = new ConfirmPopupManager();
(window as any).$confirmPopup = globalConfirmPopup;

export default function ConfirmPopupIsland(container: HTMLElement, props: ConfirmPopupProps) {
    injectIslandStyle('confirm-popup', CONFIRM_POPUP_CSS);

    const triggers = container.querySelectorAll<HTMLButtonElement>('[data-confirmpopup-trigger]');
    triggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const action = btn.getAttribute('data-confirmpopup-trigger') || 'basic';
            const message = btn.getAttribute('data-confirmpopup-message');

            if (action === 'delete') {
                globalConfirmPopup.require({
                    target: btn,
                    message: message || 'Do you want to delete this record?',
                    acceptSeverity: 'danger',
                    acceptLabel: 'Delete',
                    rejectLabel: 'Cancel',
                    accept: () => (window as any).$toast?.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 }),
                    reject: () => (window as any).$toast?.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
                });
            } else if (action === 'template') {
                globalConfirmPopup.require({
                    target: btn,
                    message: message || 'Please confirm to proceed moving forward.',
                    template: true,
                    acceptLabel: 'Confirm',
                    rejectLabel: 'Cancel',
                    accept: () => (window as any).$toast?.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 }),
                    reject: () => (window as any).$toast?.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
                });
            } else if (action === 'headless') {
                globalConfirmPopup.require({
                    target: btn,
                    message: message || 'Save your current process?',
                    headless: true,
                    acceptLabel: 'Save',
                    rejectLabel: 'Cancel',
                    accept: () => (window as any).$toast?.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 }),
                    reject: () => (window as any).$toast?.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
                });
            } else {
                // Default Save
                globalConfirmPopup.require({
                    target: btn,
                    message: message || 'Are you sure you want to proceed?',
                    acceptLabel: 'Save',
                    rejectLabel: 'Cancel',
                    accept: () => (window as any).$toast?.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 }),
                    reject: () => (window as any).$toast?.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
                });
            }
        });
    });
}
