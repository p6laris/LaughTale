import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { injectIslandStyle } from '../runtime/styles';
import { useFocusTrap, type UseFocusTrapReturn } from '../composables/useFocusTrap';
import { useFloatingPosition } from '../composables/useFloatingPosition';
import { useDisclosure } from '../composables/useDisclosure';
import { html, setHtml, unsafe, type Raw } from '../runtime/html';
import { getLucideIcon } from '../icons/lucide';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'alertdialog'
};

const CONFIRM_POPUP_CSS = `
.p-confirmpopup {
    position: absolute;
    z-index: 1100;
    background: var(--p-overlay-bg, var(--p-surface-0, #ffffff));
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius-lg, 0.75rem);
    box-shadow: var(--p-shadow-lg, 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05));
    padding: 0.875rem 1rem;
    min-width: 17rem;
    max-width: 24rem;
    box-sizing: border-box;
    display: none;
    opacity: 0;
    transform: scale(0.95) translateY(4px);
    transition: transform 0.16s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.16s ease;
    color: var(--p-text-color, #1e293b);
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
    color: var(--p-text-color, #334155);
}

.p-confirmpopup-icon-danger {
    color: var(--p-red-500, #ef4444) !important;
}

.p-confirmpopup-message {
    font-size: 0.875rem;
    color: var(--p-text-color, #1e293b);
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
    border: 3px solid var(--p-border-color, #cbd5e1);
    color: var(--p-text-muted, #64748b);
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
html.dark .p-confirmpopup,
[data-theme="dark"] .p-confirmpopup,
.dark .p-confirmpopup {
    background: var(--p-surface-0, #0f172a);
    border-color: var(--p-border-color, #334155);
    color: var(--p-text-color, #f8fafc);
}
html.dark .p-confirmpopup-flipped-top::before,
[data-theme="dark"] .p-confirmpopup-flipped-top::before,
.dark .p-confirmpopup-flipped-top::before {
    border-bottom-color: var(--p-border-color, #334155);
}
html.dark .p-confirmpopup-flipped-top::after,
[data-theme="dark"] .p-confirmpopup-flipped-top::after,
.dark .p-confirmpopup-flipped-top::after {
    border-bottom-color: var(--p-surface-0, #0f172a);
}
html.dark .p-confirmpopup-flipped-bottom::before,
[data-theme="dark"] .p-confirmpopup-flipped-bottom::before,
.dark .p-confirmpopup-flipped-bottom::before {
    border-top-color: var(--p-border-color, #334155);
}
html.dark .p-confirmpopup-flipped-bottom::after,
[data-theme="dark"] .p-confirmpopup-flipped-bottom::after,
.dark .p-confirmpopup-flipped-bottom::after {
    border-top-color: var(--p-surface-0, #0f172a);
}
html.dark .p-confirmpopup-message,
[data-theme="dark"] .p-confirmpopup-message,
.dark .p-confirmpopup-message {
    color: var(--p-text-color, #f8fafc);
}
html.dark .p-confirmpopup-template-body,
[data-theme="dark"] .p-confirmpopup-template-body,
.dark .p-confirmpopup-template-body {
    border-color: var(--p-border-color, #334155);
}
html.dark .p-confirmpopup-template-icon,
[data-theme="dark"] .p-confirmpopup-template-icon,
.dark .p-confirmpopup-template-icon {
    border-color: var(--p-border-color, #334155);
    color: var(--p-text-muted, #94a3b8);
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
    signal?: AbortSignal;
}

export interface ConfirmPopupProps {
    group?: string;
    targetSelector?: string;
    message?: string;
    acceptText?: string;
    rejectText?: string;
    actionName?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
    signal?: AbortSignal;
}

// Vector SVGs
const ALERT_TRIANGLE_SVG = unsafe(getLucideIcon('triangle-alert', 20, 2));
const INFO_CIRCLE_SVG = unsafe(getLucideIcon('info', 20, 2));
const EXCLAMATION_LARGE_SVG = unsafe(getLucideIcon('circle-alert', 34, 2.2));
const CHECK_SVG = unsafe(getLucideIcon('check', 14, 2.2));
const CLOSE_SVG = unsafe(getLucideIcon('x', 14, 2.2));

class ConfirmPopupManager {
    public popupEl: HTMLElement | null = null;
    private currentOptions: ConfirmPopupOptions | null = null;
    private outsideClickListener: ((e: MouseEvent) => void) | null = null;
    private trap: UseFocusTrapReturn | null = null;
    public floatingCtrl: { update(): void; computePosition(): any; destroy(): void } | null = null;

    // ROADMAP.v5.md Part M "Adopt - State machine": same singleton-disclosure retrofit as
    // confirm-dialog.ts. `require()` already handled the "clicking the SAME open target again closes
    // it" toggle, but never handled requesting a confirmation for a DIFFERENT target while one was
    // already open - `currentOptions` was silently overwritten, dropping the outgoing confirmation's
    // `accept`/`reject` callback forever (the exact bug found and fixed in confirm-dialog.ts).
    private disclosure = useDisclosure({
        onOpen: () => {
            this.popupEl?.classList.add('p-confirmpopup-active');
        },
        onClose: () => {
            this.trap?.deactivate();
            this.trap = null;
            if (this.floatingCtrl) {
                this.floatingCtrl.destroy();
                this.floatingCtrl = null;
            }
            this.popupEl?.classList.remove('p-confirmpopup-active');
            if (this.outsideClickListener) {
                document.removeEventListener('click', this.outsideClickListener);
                this.outsideClickListener = null;
            }
        }
    });

    constructor() {
        if (typeof document !== 'undefined') {
            this.initDOM();
        }
    }

    private initDOM(signal?: AbortSignal) {
        if (this.popupEl) return;
        injectIslandStyle('confirm-popup', CONFIRM_POPUP_CSS);

        this.popupEl = document.createElement('div');
        this.popupEl.className = 'p-confirmpopup p-component';
        this.popupEl.setAttribute('data-part', 'root');
        this.popupEl.setAttribute('role', 'alertdialog');
        this.popupEl.setAttribute('aria-modal', 'true');
        this.popupEl.setAttribute('aria-labelledby', 'confirmpopup-title');
        this.popupEl.setAttribute('aria-describedby', 'confirmpopup-message');

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.disclosure.isOpen) {
                this.close(false);
            }
        }, { signal });

        document.body.appendChild(this.popupEl);
    }

    public require(options: ConfirmPopupOptions) {
        this.initDOM();
        if (!this.popupEl || !options.target) return;

        if (this.disclosure.isOpen) {
            // Clicking the SAME target that's already open toggles it closed.
            if (this.currentOptions?.target === options.target) {
                this.close(false);
                return;
            }
            // A DIFFERENT target's confirmation is already open - reject it before replacing it, so
            // its caller isn't left waiting on a callback that would otherwise never fire.
            this.close(false);
        }

        this.currentOptions = options;
        this.renderContent(options);
        this.alignToTarget(options.target, options.signal);

        this.trap = useFocusTrap(this.popupEl, {
            autoFocus: true,
            restoreFocus: true,
            signal: options.signal
        });
        this.trap.activate();

        this.disclosure.open();

        // Bind outside click
        const t = setTimeout(() => {
            if (this.outsideClickListener) {
                document.removeEventListener('click', this.outsideClickListener);
            }
            this.outsideClickListener = (e: MouseEvent) => {
                if (this.popupEl && !this.popupEl.contains(e.target as Node) && !options.target.contains(e.target as Node)) {
                    this.close(false);
                }
            };
            document.addEventListener('click', this.outsideClickListener, { signal: options.signal });
        }, 10);
        options.signal?.addEventListener('abort', () => clearTimeout(t), { signal: options.signal });
    }

    public close(accepted: boolean = false) {
        if (!this.disclosure.isOpen) return;
        const opts = this.currentOptions;
        this.currentOptions = null;
        this.disclosure.close();

        if (opts) {
            if (accepted && opts.accept) {
                opts.accept();
            } else if (!accepted && opts.reject) {
                opts.reject();
            }
        }
    }

    private alignToTarget(target: HTMLElement, signal?: AbortSignal) {
        if (!this.popupEl) return;

        this.floatingCtrl?.destroy();
        this.popupEl.style.position = 'absolute';
        const effectiveSignal = signal || new AbortController().signal;

        this.floatingCtrl = useFloatingPosition(target, this.popupEl, {
            placement: 'bottom',
            offset: 10,
            strategy: 'absolute',
            reposition: 'follow',
            signal: effectiveSignal,
            arrow: this.popupEl
        });

        const updatePosition = () => {
            if (!this.floatingCtrl || !this.popupEl) return;
            const coords = this.floatingCtrl.computePosition();
            this.popupEl.style.position = 'absolute';
            this.popupEl.style.top = `${Math.round(coords.y)}px`;
            this.popupEl.style.left = `${Math.round(coords.x)}px`;

            if (coords.actualPlacement.startsWith('top')) {
                this.popupEl.classList.remove('p-confirmpopup-flipped-top');
                this.popupEl.classList.add('p-confirmpopup-flipped-bottom');
            } else {
                this.popupEl.classList.remove('p-confirmpopup-flipped-bottom');
                this.popupEl.classList.add('p-confirmpopup-flipped-top');
            }

            if (coords.arrowOffset != null) {
                this.popupEl.style.setProperty('--p-popup-arrow-left', `${Math.round(coords.arrowOffset)}px`);
            }
        };

        updatePosition();

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', updatePosition, { capture: true, passive: true, signal: effectiveSignal });
            window.addEventListener('resize', updatePosition, { passive: true, signal: effectiveSignal });
        }
    }

    private renderContent(opt: ConfirmPopupOptions) {
        if (!this.popupEl) return;

        if (opt.headless) {
            setHtml(this.popupEl, html`
                <div class="p-confirmpopup-headless" data-part="root">
                    <span class="p-confirmpopup-message" style="display: block; font-size: 0.875rem;">${opt.message || 'Save your current process?'}</span>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.875rem;">
                        <button type="button" class="btn-accept p-button p-button-primary p-button-sm" style="padding: 0.35rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: var(--p-border-radius, 6px); background: var(--p-primary-color); border: 1px solid var(--p-primary-color); color: var(--p-primary-contrast-color, #ffffff); cursor: pointer;">
                            ${opt.acceptLabel || 'Save'}
                        </button>
                        <button type="button" class="btn-reject p-button p-button-text p-button-secondary p-button-sm" style="padding: 0.35rem 0.75rem; font-size: 0.8125rem; font-weight: 500; border: none; background: transparent; color: var(--p-text-muted, #64748b); cursor: pointer;">
                            ${opt.rejectLabel || 'Cancel'}
                        </button>
                    </div>
                </div>
            `);
        } else if (opt.template) {
            setHtml(this.popupEl, html`
                <div class="p-confirmpopup-template-body">
                    <div class="p-confirmpopup-template-icon">
                        ${EXCLAMATION_LARGE_SVG}
                    </div>
                    <p class="p-confirmpopup-message" style="font-size: 0.875rem; color: var(--p-text-color, #1e293b);">${opt.message || 'Please confirm to proceed moving forward.'}</p>
                </div>
                <div class="p-confirmpopup-footer">
                    <button type="button" class="btn-reject p-button p-button-outlined p-button-secondary p-button-sm" style="display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.4rem 0.75rem; font-size: 0.8125rem; font-weight: 600; border-radius: var(--p-border-radius, 6px); border: 1px solid var(--p-border-color, #cbd5e1); background: transparent; color: var(--p-text-color, #1e293b); cursor: pointer;">
                        ${CLOSE_SVG}
                        <span>${opt.rejectLabel || 'Cancel'}</span>
                    </button>
                    <button type="button" class="btn-accept p-button p-button-primary p-button-sm" style="display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.4rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: var(--p-border-radius, 6px); background: var(--p-primary-color); border: 1px solid var(--p-primary-color); color: var(--p-primary-contrast-color, #ffffff); cursor: pointer;">
                        ${CHECK_SVG}
                        <span>${opt.acceptLabel || 'Confirm'}</span>
                    </button>
                </div>
            `);
        } else {
            const isDanger = opt.acceptSeverity === 'danger' || (opt.acceptProps && opt.acceptProps.severity === 'danger');
            const iconSvg = isDanger ? INFO_CIRCLE_SVG : ALERT_TRIANGLE_SVG;
            const acceptLabel = opt.acceptLabel || (opt.acceptProps?.label) || (isDanger ? 'Delete' : 'Save');
            const rejectLabel = opt.rejectLabel || (opt.rejectProps?.label) || 'Cancel';
            const acceptStyle = isDanger ? 'background: var(--p-red-500, #ef4444); border: 1px solid var(--p-red-500, #ef4444); color: #ffffff;' : 'background: var(--p-primary-color); border: 1px solid var(--p-primary-color); color: var(--p-primary-contrast-color, #ffffff);';

            setHtml(this.popupEl, html`
                <div class="p-confirmpopup-content">
                    <span class="p-confirmpopup-icon ${isDanger ? 'p-confirmpopup-icon-danger' : ''}">
                        ${iconSvg}
                    </span>
                    <span class="p-confirmpopup-message">${opt.message || 'Are you sure you want to proceed?'}</span>
                </div>
                <div class="p-confirmpopup-footer">
                    <button type="button" class="btn-reject p-button p-button-outlined p-button-secondary p-button-sm" style="padding: 0.35rem 0.75rem; font-size: 0.8125rem; font-weight: 600; border-radius: var(--p-border-radius, 6px); border: 1px solid var(--p-border-color, #cbd5e1); background: transparent; color: var(--p-text-color, #1e293b); cursor: pointer;">
                        ${rejectLabel}
                    </button>
                    <button type="button" class="btn-accept p-button p-button-primary p-button-sm" style="padding: 0.35rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: var(--p-border-radius, 6px); ${acceptStyle} cursor: pointer;">
                        ${acceptLabel}
                    </button>
                </div>
            `);
        }

        this.popupEl.querySelector('.btn-reject')?.addEventListener('click', () => this.close(false), { signal: opt.signal });
        this.popupEl.querySelector('.btn-accept')?.addEventListener('click', () => this.close(true), { signal: opt.signal });
    }
}

const globalConfirmPopup = new ConfirmPopupManager();
(window as any).$confirmPopup = globalConfirmPopup;

export default function ConfirmPopupIsland(container: HTMLElement, props: ConfirmPopupProps, ctx?: IslandContext) {
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
        }, { signal: ctx?.signal });
    });

    if (triggers.length === 0 && (props.message || (props as any).Message)) {
        globalConfirmPopup.require({
            target: container,
            message: props.message || (props as any).Message,
            signal: ctx?.signal
        });
    }
}
