/**
 * SoftMax.LaughTale: Enterprise InputNumber Component (Aura InputNumber)
 * Comprehensive numerical input with currency, locale, min/max fractions,
 * prefixes, suffixes, button layouts (stacked, horizontal, vertical),
 * fluid sizing, clearable trigger, and dark mode awareness.
 */

import { injectIslandStyle } from '../runtime/styles';
import { getLucideIcon } from '../icons/lucide';

export interface InputNumberProps {
    targetInputName?: string;
    inputId?: string;
    value?: number | null;
    mode?: 'decimal' | 'currency';
    currency?: string; // ISO 4217 e.g. 'USD', 'EUR', 'JPY', 'INR'
    currencyDisplay?: 'symbol' | 'code' | 'name';
    locale?: string;
    useGrouping?: boolean;
    minFractionDigits?: number;
    maxFractionDigits?: number;
    prefix?: string;
    suffix?: string;
    min?: number;
    max?: number;
    step?: number;
    showButtons?: boolean | string;
    buttonLayout?: 'stacked' | 'horizontal' | 'vertical';
    variant?: 'outlined' | 'filled';
    size?: 'small' | 'normal' | 'large';
    fluid?: boolean | string;
    invalid?: boolean | string;
    showClear?: boolean | string;
    placeholder?: string;
    disabled?: boolean | string;
    inputClass?: string;
    inputStyle?: Record<string, string> | string;
}

const CSS = `
.laughtale-inputnumber,
.p-inputnumber {
    display: inline-flex;
    position: relative;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    vertical-align: middle;
    width: auto;
}

.p-inputnumber.p-inputnumber-fluid {
    display: flex;
    width: 100%;
}

/* Base Input Element */
.p-inputnumber-input {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    font-family: inherit;
    font-size: 0.875rem;
    color: var(--p-text-color);
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    padding: 0.5rem 0.75rem;
    transition: background 150ms ease, color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    appearance: none;
    outline: none;
    box-sizing: border-box;
    font-variant-numeric: tabular-nums;
    min-height: 2.5rem;
}

.p-inputnumber-input:hover:not(:disabled) {
    border-color: var(--p-surface-400);
}

.p-inputnumber-input:focus {
    border-color: var(--p-primary-500);
    box-shadow: 0 0 0 1px var(--p-primary-500);
}

.p-inputnumber-input:disabled {
    background: var(--p-surface-100);
    color: var(--p-text-muted);
    cursor: not-allowed;
    opacity: 0.75;
}

/* Variant: Filled */
.p-inputnumber.variant-filled .p-inputnumber-input {
    background: var(--p-surface-100);
    border-color: transparent;
}
.p-inputnumber.variant-filled .p-inputnumber-input:focus {
    background: var(--p-surface-0);
    border-color: var(--p-primary-500);
}

/* Sizes */
.p-inputnumber.size-small .p-inputnumber-input {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    min-height: 2rem;
}
.p-inputnumber.size-large .p-inputnumber-input {
    font-size: 1rem;
    padding: 0.75rem 1rem;
    min-height: 3rem;
}

/* Invalid state */
.p-inputnumber.is-invalid .p-inputnumber-input {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-inputnumber.is-invalid .p-inputnumber-input:focus {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Clear icon */
.p-inputnumber-clear-icon {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--p-text-muted);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    padding: 0;
    border: none;
    background: transparent;
    transition: color 150ms ease;
    z-index: 2;
}
.p-inputnumber-clear-icon:hover {
    color: var(--p-text-color);
}
.p-inputnumber:has(.p-inputnumber-clear-icon) .p-inputnumber-input {
    padding-right: 2.25rem;
}

/* ==================== BUTTON LAYOUTS ==================== */

/* Shared Button Styles */
.p-inputnumber-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--p-surface-100);
    color: var(--p-surface-600);
    border: 1px solid var(--p-border-color);
    cursor: pointer;
    user-select: none;
    transition: background 150ms ease, color 150ms ease, border-color 150ms ease;
    box-sizing: border-box;
    padding: 0;
}
.p-inputnumber-button:hover:not(:disabled) {
    background: var(--p-surface-200);
    color: var(--p-surface-900);
}
.p-inputnumber-button:active:not(:disabled) {
    background: var(--p-surface-300);
}
.p-inputnumber-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.p-inputnumber-button svg {
    width: 12px;
    height: 12px;
    display: block;
}

/* Layout 1: Stacked (Default) */
.p-inputnumber-stacked {
    display: inline-flex;
    align-items: stretch;
}
.p-inputnumber-stacked.p-inputnumber-fluid {
    display: flex;
    width: 100%;
}
.p-inputnumber-stacked .p-inputnumber-input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding-right: 0.5rem;
}
.p-inputnumber-button-group {
    display: flex;
    flex-direction: column;
    width: 2.25rem;
    margin-left: -1px;
    flex-shrink: 0;
}
.p-inputnumber-stacked .p-inputnumber-button-up {
    flex: 1;
    border-top-right-radius: var(--p-border-radius);
    border-bottom-right-radius: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-bottom: 1px solid var(--p-border-color);
}
.p-inputnumber-stacked .p-inputnumber-button-down {
    flex: 1;
    border-bottom-right-radius: var(--p-border-radius);
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top: none;
}

/* Layout 2: Horizontal */
.p-inputnumber-horizontal {
    display: inline-flex;
    align-items: stretch;
}
.p-inputnumber-horizontal.p-inputnumber-fluid {
    display: flex;
    width: 100%;
}
.p-inputnumber-horizontal .p-inputnumber-button-down {
    width: 2.5rem;
    border-top-left-radius: var(--p-border-radius);
    border-bottom-left-radius: var(--p-border-radius);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    flex-shrink: 0;
}
.p-inputnumber-horizontal .p-inputnumber-input {
    border-radius: 0;
    margin-left: -1px;
    margin-right: -1px;
    text-align: center;
}
.p-inputnumber-horizontal .p-inputnumber-button-up {
    width: 2.5rem;
    border-top-right-radius: var(--p-border-radius);
    border-bottom-right-radius: var(--p-border-radius);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    flex-shrink: 0;
}

/* Layout 3: Vertical */
.p-inputnumber-vertical {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    width: auto;
}
.p-inputnumber-vertical .p-inputnumber-button-up {
    width: 100%;
    height: 2rem;
    border-top-left-radius: var(--p-border-radius);
    border-top-right-radius: var(--p-border-radius);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}
.p-inputnumber-vertical .p-inputnumber-input {
    border-radius: 0;
    margin-top: -1px;
    margin-bottom: -1px;
    text-align: center;
    width: 3.5rem;
}
.p-inputnumber-vertical .p-inputnumber-button-down {
    width: 100%;
    height: 2rem;
    border-bottom-left-radius: var(--p-border-radius);
    border-bottom-right-radius: var(--p-border-radius);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

/* Focus elevations on buttons & inputs */
.p-inputnumber > *:focus,
.p-inputnumber-input:focus {
    z-index: 1;
}

/* ==================== DARK MODE ==================== */
.dark .p-inputnumber-input {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-inputnumber-input:hover:not(:disabled) {
    border-color: var(--p-surface-600);
}
.dark .p-inputnumber-input:focus {
    border-color: var(--p-primary-500);
    box-shadow: 0 0 0 1px var(--p-primary-500);
}
.dark .p-inputnumber.variant-filled .p-inputnumber-input {
    background: var(--p-surface-800);
}
.dark .p-inputnumber.variant-filled .p-inputnumber-input:focus {
    background: var(--p-surface-900);
}
.dark .p-inputnumber-button {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
    color: var(--p-surface-400);
}
.dark .p-inputnumber-button:hover:not(:disabled) {
    background: var(--p-surface-700);
    color: var(--p-surface-100);
}
.dark .p-inputnumber-button:active:not(:disabled) {
    background: var(--p-surface-600);
}
`;

export default function InputNumberIsland(container: HTMLElement, props: InputNumberProps) {
    injectIslandStyle('laughtale-inputnumber', CSS);

    let rawValue: number | null = props.value !== undefined && props.value !== null ? Number(props.value) : null;
    const step = props.step !== undefined ? Number(props.step) : 1;
    const min = props.min !== undefined ? Number(props.min) : undefined;
    const max = props.max !== undefined ? Number(props.max) : undefined;
    const isCurrency = props.mode === 'currency';
    const currency = props.currency || 'USD';
    const currencyDisplay = props.currencyDisplay || 'symbol';
    const locale = props.locale || undefined;
    const useGrouping = props.useGrouping !== false && String(props.useGrouping) !== 'false';
    const buttonLayout = props.buttonLayout || 'stacked';
    const showButtons = props.showButtons === true || String(props.showButtons) === 'true';
    const isFluid = props.fluid === true || String(props.fluid) === 'true';
    const isInvalid = props.invalid === true || String(props.invalid) === 'true';
    const isFilled = props.variant === 'filled';
    const isDisabled = props.disabled === true || String(props.disabled) === 'true';
    const showClear = props.showClear === true || String(props.showClear) === 'true';

    // Determine default min/max fraction digits
    let minFractionDigits = props.minFractionDigits !== undefined ? Number(props.minFractionDigits) : undefined;
    let maxFractionDigits = props.maxFractionDigits !== undefined ? Number(props.maxFractionDigits) : undefined;
    if (minFractionDigits === undefined && maxFractionDigits === undefined) {
        if (isCurrency) {
            minFractionDigits = currency === 'JPY' ? 0 : 2;
            maxFractionDigits = currency === 'JPY' ? 0 : 2;
        } else {
            minFractionDigits = 0;
            maxFractionDigits = 20;
        }
    }

    function formatNumber(val: number | null): string {
        if (val === null || isNaN(val)) return '';

        let formatted = '';
        try {
            if (isCurrency) {
                const formatter = new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: currency,
                    currencyDisplay: currencyDisplay,
                    useGrouping: useGrouping,
                    minimumFractionDigits: minFractionDigits,
                    maximumFractionDigits: maxFractionDigits
                });
                formatted = formatter.format(val);
            } else {
                const formatter = new Intl.NumberFormat(locale, {
                    style: 'decimal',
                    useGrouping: useGrouping,
                    minimumFractionDigits: minFractionDigits,
                    maximumFractionDigits: maxFractionDigits
                });
                formatted = formatter.format(val);
            }
        } catch {
            formatted = val.toString();
        }

        // Apply custom prefix / suffix if provided (when not overriding standard currency)
        if (props.prefix && !formatted.startsWith(props.prefix)) {
            formatted = `${props.prefix}${formatted}`;
        }
        if (props.suffix && !formatted.endsWith(props.suffix)) {
            formatted = `${formatted}${props.suffix}`;
        }

        return formatted;
    }

    function parseRaw(str: string): number | null {
        if (!str || !str.trim()) return null;
        let clean = str;

        if (props.prefix) {
            clean = clean.replace(props.prefix, '');
        }
        if (props.suffix) {
            clean = clean.replace(props.suffix, '');
        }

        // Strip non-numeric characters except digits, minus, and period/comma
        clean = clean.replace(/[^\d.,-]/g, '').trim();

        // If string contains comma as decimal separator (e.g. de-DE: 1.500,00 or 1500,00)
        if (clean.indexOf(',') > -1 && clean.indexOf('.') === -1) {
            clean = clean.replace(',', '.');
        } else if (clean.indexOf(',') > -1 && clean.indexOf('.') > -1) {
            if (clean.lastIndexOf(',') > clean.lastIndexOf('.')) {
                // Comma is decimal separator (European style: 1.234,56)
                clean = clean.replace(/\./g, '').replace(',', '.');
            } else {
                // Period is decimal separator (US style: 1,234.56)
                clean = clean.replace(/,/g, '');
            }
        }

        const parsed = parseFloat(clean);
        return isNaN(parsed) ? null : parsed;
    }

    function render() {
        container.innerHTML = '';
        container.className = 'laughtale-inputnumber p-inputnumber';

        if (isFluid) container.classList.add('p-inputnumber-fluid');
        if (isFilled) container.classList.add('variant-filled');
        if (props.size) container.classList.add(`size-${props.size}`);
        if (isInvalid) container.classList.add('is-invalid');
        if (showButtons) container.classList.add(`p-inputnumber-${buttonLayout}`);

        const inputIdAttr = props.inputId ? `id="${props.inputId}"` : '';
        const placeholderAttr = props.placeholder ? `placeholder="${props.placeholder}"` : '';
        const disabledAttr = isDisabled ? 'disabled' : '';
        const formattedVal = formatNumber(rawValue);

        const upIcon = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`;
        const downIcon = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
        const plusIcon = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`;
        const minusIcon = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`;
        const clearIcon = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

        let html = '';

        if (showButtons && buttonLayout === 'horizontal') {
            html += `
                <button type="button" class="p-inputnumber-button p-inputnumber-button-down" tabindex="-1" ${disabledAttr} aria-label="Decrement">
                    ${minusIcon}
                </button>
            `;
        } else if (showButtons && buttonLayout === 'vertical') {
            html += `
                <button type="button" class="p-inputnumber-button p-inputnumber-button-up" tabindex="-1" ${disabledAttr} aria-label="Increment">
                    ${plusIcon}
                </button>
            `;
        }

        html += `
            <input type="text"
                class="p-inputnumber-input ${props.inputClass || ''}"
                ${inputIdAttr}
                ${placeholderAttr}
                ${disabledAttr}
                value="${formattedVal}"
                role="spinbutton"
                aria-valuenow="${rawValue ?? ''}"
                ${min !== undefined ? `aria-valuemin="${min}"` : ''}
                ${max !== undefined ? `aria-valuemax="${max}"` : ''}
                ${isInvalid ? 'aria-invalid="true"' : ''}
                autocomplete="off"
            />
        `;

        if (showClear && rawValue !== null && !isDisabled) {
            html += `
                <button type="button" class="p-inputnumber-clear-icon" aria-label="Clear value" tabindex="-1">
                    ${clearIcon}
                </button>
            `;
        }

        if (showButtons) {
            if (buttonLayout === 'stacked') {
                html += `
                    <div class="p-inputnumber-button-group">
                        <button type="button" class="p-inputnumber-button p-inputnumber-button-up" tabindex="-1" ${disabledAttr} aria-label="Increment">
                            ${upIcon}
                        </button>
                        <button type="button" class="p-inputnumber-button p-inputnumber-button-down" tabindex="-1" ${disabledAttr} aria-label="Decrement">
                            ${downIcon}
                        </button>
                    </div>
                `;
            } else if (buttonLayout === 'horizontal') {
                html += `
                    <button type="button" class="p-inputnumber-button p-inputnumber-button-up" tabindex="-1" ${disabledAttr} aria-label="Increment">
                        ${plusIcon}
                    </button>
                `;
            } else if (buttonLayout === 'vertical') {
                html += `
                    <button type="button" class="p-inputnumber-button p-inputnumber-button-down" tabindex="-1" ${disabledAttr} aria-label="Decrement">
                        ${minusIcon}
                    </button>
                `;
            }
        }

        container.innerHTML = html;
        bindEvents();
    }

    function bindEvents() {
        const inputEl = container.querySelector<HTMLInputElement>('.p-inputnumber-input')!;
        const clearBtn = container.querySelector<HTMLButtonElement>('.p-inputnumber-clear-icon');
        const upBtn = container.querySelector<HTMLButtonElement>('.p-inputnumber-button-up');
        const downBtn = container.querySelector<HTMLButtonElement>('.p-inputnumber-button-down');

        // Focus & Blur
        inputEl.addEventListener('focus', () => {
            inputEl.select();
        });

        inputEl.addEventListener('blur', () => {
            const parsed = parseRaw(inputEl.value);
            setValue(parsed);
            inputEl.value = formatNumber(rawValue);
        });

        // Input change
        inputEl.addEventListener('input', () => {
            const parsed = parseRaw(inputEl.value);
            rawValue = parsed;
            syncTargetInput();
        });

        // Keyboard navigation
        inputEl.addEventListener('keydown', (e) => {
            if (isDisabled) return;

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                stepUp();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                stepDown();
            } else if (e.key === 'Home' && min !== undefined) {
                e.preventDefault();
                setValue(min);
                inputEl.value = formatNumber(rawValue);
            } else if (e.key === 'End' && max !== undefined) {
                e.preventDefault();
                setValue(max);
                inputEl.value = formatNumber(rawValue);
            } else if (e.key === 'Enter') {
                const parsed = parseRaw(inputEl.value);
                setValue(parsed);
                inputEl.value = formatNumber(rawValue);
            }
        });

        // Step Buttons
        upBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            stepUp();
            inputEl.focus();
        });

        downBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            stepDown();
            inputEl.focus();
        });

        // Clear button
        clearBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            setValue(null);
            inputEl.value = '';
            inputEl.focus();
        });
    }

    function stepUp() {
        let current = rawValue ?? 0;
        let next = current + step;
        if (max !== undefined && next > max) next = max;
        setValue(next);
        const inputEl = container.querySelector<HTMLInputElement>('.p-inputnumber-input');
        if (inputEl) inputEl.value = formatNumber(rawValue);
    }

    function stepDown() {
        let current = rawValue ?? 0;
        let next = current - step;
        if (min !== undefined && next < min) next = min;
        setValue(next);
        const inputEl = container.querySelector<HTMLInputElement>('.p-inputnumber-input');
        if (inputEl) inputEl.value = formatNumber(rawValue);
    }

    function setValue(val: number | null) {
        if (val !== null) {
            if (min !== undefined && val < min) val = min;
            if (max !== undefined && val > max) val = max;
        }
        rawValue = val;
        syncTargetInput();
        container.dispatchEvent(new CustomEvent('inputnumber:change', {
            bubbles: true,
            detail: { value: rawValue }
        }));
    }

    function syncTargetInput() {
        if (props.targetInputName) {
            let hidden = container.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = rawValue !== null ? rawValue.toString() : '';
        }
    }

    render();
    syncTargetInput();
}
