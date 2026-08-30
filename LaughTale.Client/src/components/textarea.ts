/**
 * LaughTale: Enterprise Textarea Component (Aura Textarea)
 * Multi-line text input with dynamic auto-resizing, size metrics,
 * filled variant, character telemetry, and seamless FloatLabel/IftaLabel integration.
 */

import { injectIslandStyle } from '../runtime/styles';

export interface TextareaProps {
    value?: string;
    placeholder?: string;
    rows?: number;
    cols?: number;
    maxLength?: number;
    autoResize?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    fluid?: boolean;
    size?: 'small' | 'normal' | 'large';
    variant?: 'outlined' | 'filled';
    targetInputName?: string;
    name?: string;
    inputId?: string;
}

const CSS = `
/* ==================== AURA TEXTAREA ==================== */
.p-textarea {
    font-family: var(--p-font-family, inherit);
    font-size: 0.875rem;
    color: var(--p-text-color, #0f172a);
    background: var(--p-surface-0, #ffffff);
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--p-border-color, #cbd5e1);
    border-radius: var(--p-border-radius, 6px);
    outline: none;
    line-height: 1.5;
    box-sizing: border-box;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
    resize: vertical;
    vertical-align: middle;
}

.p-textarea:hover:not(:disabled):not(.p-disabled):not(.p-invalid) {
    border-color: var(--p-surface-400, #94a3b8);
}

.p-textarea:focus:not(:disabled):not(.p-disabled):not(.p-invalid),
.p-textarea:focus-visible:not(:disabled):not(.p-disabled):not(.p-invalid) {
    border-color: var(--p-primary-500, #10b981) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500, #10b981) !important;
}

/* Fluid */
.p-textarea.p-textarea-fluid,
.p-textarea-fluid {
    width: 100%;
    display: block;
}

/* Sizes */
.p-textarea.size-small,
.p-textarea.p-textarea-sm {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
}

.p-textarea.size-large,
.p-textarea.p-textarea-lg {
    font-size: 1.0625rem;
    padding: 0.75rem 1rem;
}

/* Variant: Filled */
.p-textarea.p-textarea-filled,
.p-textarea.variant-filled {
    background: var(--p-surface-100, #f1f5f9);
}
.p-textarea.p-textarea-filled:focus,
.p-textarea.variant-filled:focus {
    background: var(--p-surface-0, #ffffff);
}

/* Disabled */
.p-textarea:disabled,
.p-textarea.p-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--p-surface-200, #e2e8f0);
    color: var(--p-text-muted, #64748b);
    pointer-events: none;
}

/* Invalid */
.p-textarea.p-invalid,
.p-textarea.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-textarea.p-invalid:focus,
.p-textarea.is-invalid:focus {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Counter */
.p-textarea-counter {
    font-size: 0.75rem;
    color: var(--p-text-muted, #64748b);
    text-align: right;
    margin-top: 0.25rem;
    font-family: var(--p-font-mono, monospace);
}

/* ==================== DARK MODE ==================== */
.dark .p-textarea {
    background: var(--p-surface-950, #090d14);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-0, #f8fafc);
}
.dark .p-textarea:hover:not(:disabled):not(.p-disabled):not(.p-invalid) {
    border-color: var(--p-surface-500, #64748b);
}
.dark .p-textarea:focus:not(:disabled):not(.p-disabled):not(.p-invalid),
.dark .p-textarea:focus-visible:not(:disabled):not(.p-disabled):not(.p-invalid) {
    border-color: var(--p-primary-400, #34d399) !important;
    box-shadow: 0 0 0 1px var(--p-primary-400, #34d399) !important;
}
.dark .p-textarea.p-textarea-filled,
.dark .p-textarea.variant-filled {
    background: var(--p-surface-850, #141b26);
}
.dark .p-textarea.p-textarea-filled:focus,
.dark .p-textarea.variant-filled:focus {
    background: var(--p-surface-950, #090d14);
}
.dark .p-textarea:disabled,
.dark .p-textarea.p-disabled {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-500, #64748b);
}
`;

export default function TextareaIsland(container: HTMLElement, props: TextareaProps) {
    injectIslandStyle('laughtale-textarea', CSS);

    const isAutoResize = props.autoResize === true || String(props.autoResize) === 'true';
    const isFluid = props.fluid === true || String(props.fluid) === 'true';
    const isInvalid = props.invalid === true || String(props.invalid) === 'true';
    const isDisabled = props.disabled === true || String(props.disabled) === 'true';
    const size = props.size || 'normal';
    const variant = props.variant || 'outlined';

    let textareaEl: HTMLTextAreaElement;

    // Check if the container itself is a native <textarea>
    if (container.tagName.toLowerCase() === 'textarea') {
        textareaEl = container as HTMLTextAreaElement;
    } else {
        const existing = container.querySelector<HTMLTextAreaElement>('textarea');
        if (existing) {
            textareaEl = existing;
        } else {
            // Render native textarea
            const classList = [
                'p-textarea',
                isFluid ? 'p-textarea-fluid' : '',
                size !== 'normal' ? `p-textarea-${size === 'small' ? 'sm' : 'lg'}` : '',
                variant === 'filled' ? 'p-textarea-filled' : '',
                isInvalid ? 'p-invalid' : '',
                isDisabled ? 'p-disabled' : ''
            ].filter(Boolean).join(' ');

            container.innerHTML = `
                <textarea 
                    class="${classList}"
                    rows="${props.rows || 5}"
                    cols="${props.cols || 30}"
                    placeholder="${props.placeholder || ''}"
                    ${props.maxLength ? `maxlength="${props.maxLength}"` : ''}
                    ${isDisabled ? 'disabled' : ''}
                    ${props.name || props.targetInputName ? `name="${props.name || props.targetInputName}"` : ''}
                    ${props.inputId ? `id="${props.inputId}"` : ''}
                >${props.value || ''}</textarea>
                ${props.maxLength ? `
                    <div class="p-textarea-counter">
                        <span class="p-textarea-count">${(props.value || '').length}</span> / ${props.maxLength}
                    </div>
                ` : ''}
            `;
            textareaEl = container.querySelector<HTMLTextAreaElement>('textarea')!;
        }
    }

    function adjustHeight() {
        if (!isAutoResize || !textareaEl) return;
        textareaEl.style.height = 'auto';
        textareaEl.style.overflow = 'hidden';
        textareaEl.style.resize = 'none';
        textareaEl.style.height = `${textareaEl.scrollHeight}px`;
    }

    function updateCounter() {
        if (!props.maxLength) return;
        const countEl = container.querySelector<HTMLElement>('.p-textarea-count');
        if (countEl && textareaEl) {
            countEl.textContent = textareaEl.value.length.toString();
        }
    }

    textareaEl.addEventListener('input', () => {
        adjustHeight();
        updateCounter();

        container.dispatchEvent(new CustomEvent('textarea:input', {
            bubbles: true,
            detail: { value: textareaEl.value }
        }));
    });

    textareaEl.addEventListener('change', () => {
        container.dispatchEvent(new CustomEvent('textarea:change', {
            bubbles: true,
            detail: { value: textareaEl.value }
        }));
    });

    if (isAutoResize) {
        window.addEventListener('resize', adjustHeight);
        setTimeout(adjustHeight, 0);
    }
}
