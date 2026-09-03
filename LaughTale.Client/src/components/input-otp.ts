import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { injectIslandStyle } from '../runtime/styles';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'native',
    element: 'input'
};

export interface InputOtpProps {
    targetInputName?: string;
    inputId?: string;
    value?: string;
    length?: number | string;
    mask?: boolean | string;
    integerOnly?: boolean | string;
    grouped?: boolean | string;
    separator?: string;
    variant?: 'outlined' | 'filled';
    size?: 'small' | 'normal' | 'large';
    disabled?: boolean | string;
    readonlyMode?: boolean | string;
    invalid?: boolean | string;
    autofocus?: boolean | string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
.laughtale-input-otp,
.p-inputotp {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.p-inputotp.p-inputotp-grouped {
    gap: 0;
}

/* Individual Digit Cell */
.p-inputotp-input {
    width: 2.75rem;
    height: 3.25rem;
    font-family: inherit;
    font-size: 1.25rem;
    font-weight: 700;
    text-align: center;
    color: var(--lt-text-primary);
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    outline: none;
    transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
    box-sizing: border-box;
    font-variant-numeric: tabular-nums;
    padding: 0;
}

.p-inputotp-input:hover:not(:disabled) {
    border-color: var(--lt-surface-400);
}

.p-inputotp-input:focus {
    border-color: var(--lt-primary-500) !important;
    box-shadow: 0 0 0 1px var(--lt-primary-500) !important;
    z-index: 2;
    position: relative;
}

.p-inputotp-input:disabled {
    background: var(--lt-surface-100);
    color: var(--p-text-muted);
    cursor: not-allowed;
    opacity: 0.75;
}

/* Variant: Filled */
.p-inputotp.variant-filled .p-inputotp-input {
    background: var(--lt-surface-100);
    border-color: transparent;
}
.p-inputotp.variant-filled .p-inputotp-input:focus {
    background: var(--lt-surface-0);
    border-color: var(--lt-primary-500) !important;
}

/* Sizes */
.p-inputotp.size-small .p-inputotp-input {
    width: 2rem;
    height: 2.5rem;
    font-size: 1rem;
    font-weight: 600;
}
.p-inputotp.size-large .p-inputotp-input {
    width: 3.25rem;
    height: 3.75rem;
    font-size: 1.5rem;
    font-weight: 700;
}

/* Invalid State */
.p-inputotp.is-invalid .p-inputotp-input {
    border-color: var(--p-red-500, var(--lt-danger-500)) !important;
}
.p-inputotp.is-invalid .p-inputotp-input:focus {
    box-shadow: 0 0 0 1px var(--p-red-500, var(--lt-danger-500)) !important;
}

/* Grouped Layout with Joined Borders */
.p-inputotp-group {
    display: inline-flex;
    align-items: center;
}
.p-inputotp-group .p-inputotp-input:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.p-inputotp-group .p-inputotp-input:not(:first-child):not(:last-child) {
    border-radius: 0;
    margin-left: -1px;
}
.p-inputotp-group .p-inputotp-input:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: -1px;
}

/* Separator between Groups */
.p-inputotp-separator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.75rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--p-text-muted);
    user-select: none;
}

/* ==================== DARK MODE ==================== */
html.dark .p-inputotp-input,
[data-theme="dark"] .p-inputotp-input,
.dark .p-inputotp-input {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    color: var(--p-text-color);
}
html.dark .p-inputotp-input:hover:not(:disabled),
[data-theme="dark"] .p-inputotp-input:hover:not(:disabled),
.dark .p-inputotp-input:hover:not(:disabled) {
    border-color: var(--p-surface-400);
}
html.dark .p-inputotp.variant-filled .p-inputotp-input,
[data-theme="dark"] .p-inputotp.variant-filled .p-inputotp-input,
.dark .p-inputotp.variant-filled .p-inputotp-input {
    background: var(--p-surface-100);
}
html.dark .p-inputotp.variant-filled .p-inputotp-input:focus,
[data-theme="dark"] .p-inputotp.variant-filled .p-inputotp-input:focus,
.dark .p-inputotp.variant-filled .p-inputotp-input:focus {
    background: var(--p-surface-0);
}
html.dark .p-inputotp-input:disabled,
[data-theme="dark"] .p-inputotp-input:disabled,
.dark .p-inputotp-input:disabled {
    background: var(--p-surface-100);
    border-color: var(--p-border-color);
    color: var(--p-text-muted);
}
html.dark .p-inputotp-separator,
[data-theme="dark"] .p-inputotp-separator,
.dark .p-inputotp-separator {
    color: var(--p-text-muted);
}
`;

export default function InputOtpIsland(container: HTMLElement, props: InputOtpProps, ctx?: IslandContext) {
    injectIslandStyle('laughtale-inputotp', CSS);

    const length = Number(props.length) || 4;
    const isMask = props.mask === true || String(props.mask) === 'true';
    const isIntegerOnly = props.integerOnly !== false && String(props.integerOnly) !== 'false';
    const isGrouped = props.grouped === true || String(props.grouped) === 'true';
    const isFilled = props.variant === 'filled';
    const isDisabled = props.disabled === true || String(props.disabled) === 'true';
    const isReadonly = props.readonlyMode === true || String(props.readonlyMode) === 'true';
    const isInvalid = props.invalid === true || String(props.invalid) === 'true';
    const separator = props.separator || '-';

    // Initial state
    const initialVal = props.value || '';
    let values: string[] = Array.from({ length }, (_, i) => initialVal[i] || '');

    function render() {
        container.className = 'laughtale-input-otp p-inputotp'; container.setAttribute('data-part', 'root');
        if (isFilled) container.classList.add('variant-filled');
        if (props.size) container.classList.add(`size-${props.size}`);
        if (isInvalid) container.classList.add('is-invalid');
        if (isDisabled) container.classList.add('is-disabled');
        if (isGrouped) container.classList.add('p-inputotp-grouped');

        const inputType = isMask ? 'password' : 'text';
        const inputMode = isIntegerOnly ? 'numeric' : 'text';
        const patternAttr = isIntegerOnly ? 'pattern="[0-9]*"' : '';
        const disabledAttr = isDisabled ? 'disabled' : '';
        const renderInputCell = (i: number) => html`
            <input type="${inputType}"
                   class="p-inputotp-input"
                   data-index="${i}"
                   maxlength="1"
                   inputmode="${inputMode}"
                   ${attr('pattern', isIntegerOnly ? '[0-9]*' : null)}
                   ${attr('disabled', isDisabled)}
                   ${attr('readonly', isReadonly)}
                   value="${values[i] || ''}"
                   autocomplete="off"
                   aria-label="Character ${i + 1}" />
        `;

        let contentHtml: Raw;

        if (isGrouped && length % 2 === 0) {
            const mid = length / 2;
            const firstGroup = Array.from({ length: mid }, (_, i) => renderInputCell(i));
            const secondGroup = Array.from({ length: length - mid }, (_, i) => renderInputCell(mid + i));

            contentHtml = html`
                <div class="p-inputotp-group" data-part="root">
                    ${firstGroup}
                </div>
                <span class="p-inputotp-separator">${separator}</span>
                <div class="p-inputotp-group">
                    ${secondGroup}
                </div>
            `;
        } else {
            const allInputs = Array.from({ length }, (_, i) => renderInputCell(i));
            contentHtml = html`${allInputs}`;
        }

        setHtml(container, contentHtml);
        bindEvents();
    }

    function bindEvents() {
        const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('.p-inputotp-input'));

        inputs.forEach((input, idx) => {
            // Select on focus for instant replacement
            input.addEventListener('focus', () => {
                input.select();
            }, { signal: ctx?.signal });

            // Input handling with auto-advance
            input.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                let val = target.value;

                if (isIntegerOnly) {
                    val = val.replace(/\D/g, '');
                }

                if (val.length > 0) {
                    const char = val[val.length - 1]; // Pick latest typed char
                    values[idx] = char;
                    target.value = char;

                    // Auto advance to next box
                    if (idx < length - 1) {
                        inputs[idx + 1].focus();
                        inputs[idx + 1].select();
                    }
                } else {
                    values[idx] = '';
                    target.value = '';
                }

                syncOtp();
            }, { signal: ctx?.signal });

            // Keyboard navigation
            input.addEventListener('keydown', (e) => {
                if (isDisabled || isReadonly) return;

                if (e.key === 'Backspace') {
                    if (input.value) {
                        values[idx] = '';
                        input.value = '';
                        syncOtp();
                    } else if (idx > 0) {
                        inputs[idx - 1].focus();
                        inputs[idx - 1].value = '';
                        values[idx - 1] = '';
                        syncOtp();
                    }
                    e.preventDefault();
                } else if (e.key === 'Delete') {
                    values[idx] = '';
                    input.value = '';
                    syncOtp();
                    e.preventDefault();
                } else if (e.key === 'ArrowLeft' && idx > 0) {
                    inputs[idx - 1].focus();
                    inputs[idx - 1].select();
                    e.preventDefault();
                } else if (e.key === 'ArrowRight' && idx < length - 1) {
                    inputs[idx + 1].focus();
                    inputs[idx + 1].select();
                    e.preventDefault();
                } else if (e.key === 'Home') {
                    inputs[0].focus();
                    inputs[0].select();
                    e.preventDefault();
                } else if (e.key === 'End') {
                    inputs[length - 1].focus();
                    inputs[length - 1].select();
                    e.preventDefault();
                }
            }, { signal: ctx?.signal });

            // Paste parsing (e.g. user pastes "482910")
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasteData = (e.clipboardData || (window as any).clipboardData)?.getData('text') || '';
                let clean = isIntegerOnly ? pasteData.replace(/\D/g, '') : pasteData.trim();
                clean = clean.slice(0, length - idx);

                if (!clean) return;

                clean.split('').forEach((char: string, i: number) => {
                    const targetIdx = idx + i;
                    if (targetIdx < length) {
                        values[targetIdx] = char;
                        if (inputs[targetIdx]) inputs[targetIdx].value = char;
                    }
                });

                syncOtp();

                const nextFocus = Math.min(idx + clean.length, length - 1);
                if (inputs[nextFocus]) {
                    inputs[nextFocus].focus();
                    inputs[nextFocus].select();
                }
            }, { signal: ctx?.signal });
        });
    }

    function syncOtp() {
        const fullCode = values.join('');
        if (props.targetInputName) {
            let hidden = container.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = fullCode;
        }

        container.dispatchEvent(new CustomEvent('otp:change', {
            bubbles: true,
            detail: {
                value: fullCode,
                isComplete: fullCode.length === length && !values.includes('')
            }
        }));
    }

    render();
    syncOtp();

    if (props.autofocus === true || String(props.autofocus) === 'true') {
        const first = container.querySelector<HTMLInputElement>('.p-inputotp-input');
        first?.focus();
    }
}
