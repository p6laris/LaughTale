import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise InputText Component (Aura InputText)
 * Standard and enhanced text input with size scales, filled/outlined variants,
 * leading/trailing icons, zero-flicker clear action, and full Theme Studio & dark mode token support.
 */

import { injectIslandStyle } from '../runtime/styles';
import { LucideIcons } from '../icons/lucide';
import { useControllableState } from '../composables/useControllableState';

export interface InputTextProps {
    value?: string;
    placeholder?: string;
    type?: string;
    variant?: 'outlined' | 'filled';
    size?: 'small' | 'normal' | 'large';
    fluid?: boolean;
    disabled?: boolean;
    readonlyMode?: boolean;
    invalid?: boolean;
    showClear?: boolean;
    clearable?: boolean;
    iconLeft?: string;
    iconRight?: string;
    icon?: string;
    targetInputName?: string;
    name?: string;
    inputId?: string;
    id?: string;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    helpText?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
.laughtale-inputtext-wrap,
.p-inputtext-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: auto;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.p-inputtext-wrap.p-inputtext-fluid,
.laughtale-inputtext-wrap.p-inputtext-fluid {
    display: flex;
    width: 100%;
}

/* Native Aura InputText */
.p-inputtext {
    width: 100%;
    font-family: inherit;
    font-size: 0.875rem;
    color: var(--lt-text-primary);
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    padding: 0.5rem 0.75rem;
    line-height: 1.25;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
    outline: none;
    box-sizing: border-box;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
}

.p-inputtext:hover:not(:disabled):not(.is-invalid):not(.p-invalid) {
    border-color: var(--lt-surface-400);
}

.p-inputtext:focus,
.p-inputtext:focus-visible {
    border-color: var(--lt-primary-500) !important;
    box-shadow: 0 0 0 1px var(--lt-primary-500) !important;
}

/* Variant: Filled */
.p-inputtext.variant-filled,
.p-inputtext.p-variant-filled {
    background: var(--lt-surface-100);
    border-color: transparent;
}
.p-inputtext.variant-filled:hover:not(:disabled) {
    background: var(--lt-surface-200);
}
.p-inputtext.variant-filled:focus {
    background: var(--lt-surface-0);
    border-color: var(--lt-primary-500) !important;
}

/* Sizes */
.p-inputtext.size-small,
.p-inputtext.p-inputtext-sm {
    padding: 0.3125rem 0.625rem;
    font-size: 0.75rem;
    border-radius: calc(var(--lt-radius) - 2px);
}

.p-inputtext.size-large,
.p-inputtext.p-inputtext-lg {
    padding: 0.6875rem 1rem;
    font-size: 1.0625rem;
    border-radius: calc(var(--lt-radius) + 2px);
}

/* Invalid State */
.p-inputtext.is-invalid,
.p-inputtext.p-invalid {
    border-color: var(--p-red-500, var(--lt-danger-500)) !important;
}
.p-inputtext.is-invalid:focus,
.p-inputtext.p-invalid:focus {
    box-shadow: 0 0 0 1px var(--p-red-500, var(--lt-danger-500)) !important;
}

/* Disabled State */
.p-inputtext:disabled,
.p-inputtext.is-disabled {
    background: var(--lt-surface-100);
    color: var(--p-text-muted);
    opacity: 0.75;
    cursor: not-allowed;
}

/* Fluid State */
.p-inputtext.p-inputtext-fluid,
.p-inputtext.p-fluid {
    width: 100%;
}

/* Icons Integration */
.p-inputtext-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: var(--lt-surface-400);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 2;
    transition: color 150ms ease;
}
.p-inputtext-icon svg {
    width: 16px;
    height: 16px;
}
.p-inputtext-icon-left {
    left: 0.75rem;
}
.p-inputtext-icon-right {
    right: 0.75rem;
}

.has-icon-left .p-inputtext {
    padding-left: 2.25rem !important;
}
.has-icon-right .p-inputtext {
    padding-right: 2.25rem !important;
}
.has-clear .p-inputtext {
    padding-right: 2.25rem !important;
}
.has-icon-right.has-clear .p-inputtext {
    padding-right: 3.625rem !important;
}

/* Clear Icon Button (Zero-Flicker) */
.p-inputtext-clear {
    position: absolute;
    right: 0.625rem;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: var(--lt-surface-400);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border-radius: 9999px;
    z-index: 3;
    transition: color 150ms ease, background 150ms ease, opacity 150ms ease;
}
.p-inputtext-clear:hover {
    background: var(--lt-surface-200);
    color: var(--lt-surface-700);
}
.p-inputtext-clear svg {
    width: 14px;
    height: 14px;
}
.has-icon-right.has-clear .p-inputtext-clear {
    right: 2.25rem;
}

/* Help Text */
.p-inputtext-help {
    font-size: 0.75rem;
    color: var(--p-text-muted);
    margin-top: 0.25rem;
    line-height: 1.25;
}

/* ==================== DARK MODE ==================== */
.dark .p-inputtext {
    background: var(--lt-surface-900);
    border-color: var(--lt-surface-700);
    color: var(--lt-surface-0);
}
.dark .p-inputtext:hover:not(:disabled):not(.is-invalid):not(.p-invalid) {
    border-color: var(--lt-surface-500);
}
.dark .p-inputtext.variant-filled,
.dark .p-inputtext.p-variant-filled {
    background: var(--lt-surface-800);
}
.dark .p-inputtext.variant-filled:focus {
    background: var(--lt-surface-900);
}
.dark .p-inputtext:disabled {
    background: var(--lt-surface-800);
    border-color: var(--lt-surface-700);
    color: var(--lt-surface-500);
}
.dark .p-inputtext-clear:hover {
    background: var(--lt-surface-700);
    color: var(--lt-surface-200);
}
`;

const xIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

export default function InputTextIsland(container: HTMLElement, props: InputTextProps, ctx?: IslandContext) {
    injectIslandStyle('laughtale-inputtext', CSS);

    const [getValue, setValue] = useControllableState<string>({
        defaultValue: props.value ?? '',
        onChange: (val) => {
            syncValue(val);
        }
    });

    const isFluid = props.fluid === true || String(props.fluid) === 'true';
    const isFilled = props.variant === 'filled';
    const isDisabled = props.disabled === true || String(props.disabled) === 'true';
    const isReadonly = props.readonlyMode === true || String(props.readonlyMode) === 'true';
    const isInvalid = props.invalid === true || String(props.invalid) === 'true';
    const hasClear = props.showClear === true || props.clearable === true || String(props.showClear) === 'true' || String(props.clearable) === 'true';
    const leftIconName = props.iconLeft || (!props.iconRight ? props.icon : '');
    const rightIconName = props.iconRight;
    const inputId = props.inputId || props.id || '';
    const inputName = props.name || props.targetInputName || '';

    function getIconSvg(name?: string): string {
        if (!name) return '';
        if ((LucideIcons as any)[name]) return (LucideIcons as any)[name];
        if (name.startsWith('<svg')) return name;
        return '';
    }

    const leftIconSvg = getIconSvg(leftIconName);
    const rightIconSvg = getIconSvg(rightIconName);

    function init() {
        const val = getValue();
        const wrapClasses = [
            'laughtale-inputtext-wrap',
            'p-inputtext-wrap',
            isFluid ? 'p-inputtext-fluid' : '',
            leftIconSvg ? 'has-icon-left' : '',
            rightIconSvg ? 'has-icon-right' : '',
            hasClear ? 'has-clear' : ''
        ].filter(Boolean).join(' ');

        const inputClasses = [
            'p-inputtext',
            isFilled ? 'variant-filled' : '',
            props.size ? `size-${props.size}` : '',
            isInvalid ? 'is-invalid' : '',
            isFluid ? 'p-inputtext-fluid' : ''
        ].filter(Boolean).join(' ');

        container.className = wrapClasses;

        const leftIconHtml = leftIconSvg ? `<span class="p-inputtext-icon p-inputtext-icon-left">${leftIconSvg}</span>` : '';
        const rightIconHtml = rightIconSvg ? `<span class="p-inputtext-icon p-inputtext-icon-right">${rightIconSvg}</span>` : '';
        const clearBtnHtml = hasClear ? `
            <button type="button" class="p-inputtext-clear" aria-label="Clear text" tabindex="-1" style="display: ${val ? 'flex' : 'none'};">
                ${xIcon}
            </button>
        ` : '';

        const idAttr = inputId ? `id="${escapeHtml(inputId)}"` : '';
        const nameAttr = inputName ? `name="${escapeHtml(inputName)}"` : '';
        const ariaLabelAttr = props.ariaLabel ? `aria-label="${escapeHtml(props.ariaLabel)}"` : '';
        const ariaLabelledByAttr = props.ariaLabelledBy ? `aria-labelledby="${escapeHtml(props.ariaLabelledBy)}"` : '';
        const ariaDescribedByAttr = props.ariaDescribedBy ? `aria-describedby="${escapeHtml(props.ariaDescribedBy)}"` : '';

        container.innerHTML = `
            ${leftIconHtml}
            <input
                type="${props.type || 'text'}"
                class="${inputClasses}"
                value="${escapeHtml(val)}"
                placeholder="${escapeHtml(props.placeholder || '')}"
                ${idAttr}
                ${nameAttr}
                ${ariaLabelAttr}
                ${ariaLabelledByAttr}
                ${ariaDescribedByAttr}
                ${isDisabled ? 'disabled' : ''}
                ${isReadonly ? 'readonly' : ''}
                ${isInvalid ? 'aria-invalid="true"' : ''}
                autocomplete="off"
            />
            ${clearBtnHtml}
            ${rightIconHtml}
        `;

        if (props.helpText) {
            const helpEl = document.createElement('small');
            helpEl.className = 'p-inputtext-help';
            if (props.ariaDescribedBy) helpEl.id = props.ariaDescribedBy;
            helpEl.textContent = props.helpText;
            container.parentElement?.insertBefore(helpEl, container.nextSibling);
        }

        bindEvents();
    }

    function escapeHtml(str: string): string {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function bindEvents() {
        const input = container.querySelector<HTMLInputElement>('input.p-inputtext');
        const clearBtn = container.querySelector<HTMLButtonElement>('.p-inputtext-clear');
        if (!input) return;

        // Zero-Flicker: update clear button visibility directly in DOM on input without re-rendering container
        input.addEventListener('input', () => {
            const val = input.value;
            setValue(val);
            if (clearBtn) {
                clearBtn.style.display = val ? 'flex' : 'none';
            }

            container.dispatchEvent(new CustomEvent('inputtext:change', {
                bubbles: true,
                detail: { value: val }
            }));
        });

        input.addEventListener('change', () => {
            container.dispatchEvent(new CustomEvent('inputtext:change', {
                bubbles: true,
                detail: { value: input.value }
            }));
        });

        if (clearBtn) {
            clearBtn.addEventListener('mousedown', (e) => e.preventDefault()); // Prevent input blur
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                input.value = '';
                setValue('');
                clearBtn.style.display = 'none';
                input.focus();

                container.dispatchEvent(new CustomEvent('inputtext:change', {
                    bubbles: true,
                    detail: { value: '' }
                }));
                container.dispatchEvent(new CustomEvent('inputtext:clear', {
                    bubbles: true
                }));
                // Dispatch native input event for FloatLabel/IftaLabel detection
                input.dispatchEvent(new Event('input', { bubbles: true }));
            });
        }
    }

    function syncValue(val: string) {
        if (props.targetInputName) {
            let hidden = container.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = val;
        }
    }

    init();
}
