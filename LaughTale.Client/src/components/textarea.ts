import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise Textarea Component (Aura Textarea)
 * Multi-line text input with dynamic auto-resizing, size metrics,
 * filled variant, character telemetry, and seamless FloatLabel/IftaLabel integration.
 */

import { injectIslandStyle } from '../runtime/styles';
import { emitComponentEvent } from '../runtime/events';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'native',
    element: 'textarea'
};

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
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
/* ==================== AURA TEXTAREA ==================== */
.p-textarea {
    font-family: var(--p-font-family, inherit);
    font-size: 0.875rem;
    color: var(--lt-text-primary);
    background: var(--lt-surface-0);
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    outline: none;
    line-height: 1.5;
    box-sizing: border-box;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
    resize: vertical;
    vertical-align: middle;
}

.p-textarea:hover:not(:disabled):not(.p-disabled):not(.p-invalid) {
    border-color: var(--lt-surface-400);
}

.p-textarea:focus:not(:disabled):not(.p-disabled):not(.p-invalid),
.p-textarea:focus-visible:not(:disabled):not(.p-disabled):not(.p-invalid) {
    border-color: var(--lt-primary-500) !important;
    box-shadow: 0 0 0 1px var(--lt-primary-500) !important;
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
    background: var(--lt-surface-100);
}
.p-textarea.p-textarea-filled:focus,
.p-textarea.variant-filled:focus {
    background: var(--lt-surface-0);
}

/* Disabled */
.p-textarea:disabled,
.p-textarea.p-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--lt-surface-200);
    color: var(--p-text-muted, var(--lt-surface-500));
    pointer-events: none;
}

/* Invalid */
.p-textarea.p-invalid,
.p-textarea.is-invalid {
    border-color: var(--p-red-500, var(--lt-danger-500)) !important;
}
.p-textarea.p-invalid:focus,
.p-textarea.is-invalid:focus {
    box-shadow: 0 0 0 1px var(--p-red-500, var(--lt-danger-500)) !important;
}

/* Counter */
.p-textarea-counter {
    font-size: 0.75rem;
    color: var(--p-text-muted, var(--lt-surface-500));
    text-align: right;
    margin-top: 0.25rem;
    font-family: var(--p-font-mono, monospace);
}

/* ==================== DARK MODE ==================== */
html.dark .p-textarea,
[data-theme="dark"] .p-textarea,
.dark .p-textarea {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    color: var(--p-text-color);
}
html.dark .p-textarea:hover:not(:disabled):not(.p-disabled):not(.p-invalid),
[data-theme="dark"] .p-textarea:hover:not(:disabled):not(.p-disabled):not(.p-invalid),
.dark .p-textarea:hover:not(:disabled):not(.p-disabled):not(.p-invalid) {
    border-color: var(--p-surface-400);
}
html.dark .p-textarea:focus:not(:disabled):not(.p-disabled):not(.p-invalid),
html.dark .p-textarea:focus-visible:not(:disabled):not(.p-disabled):not(.p-invalid),
[data-theme="dark"] .p-textarea:focus:not(:disabled):not(.p-disabled):not(.p-invalid),
[data-theme="dark"] .p-textarea:focus-visible:not(:disabled):not(.p-disabled):not(.p-invalid),
.dark .p-textarea:focus:not(:disabled):not(.p-disabled):not(.p-invalid),
.dark .p-textarea:focus-visible:not(:disabled):not(.p-disabled):not(.p-invalid) {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}
html.dark .p-textarea.p-textarea-filled,
html.dark .p-textarea.variant-filled,
[data-theme="dark"] .p-textarea.p-textarea-filled,
[data-theme="dark"] .p-textarea.variant-filled,
.dark .p-textarea.p-textarea-filled,
.dark .p-textarea.variant-filled {
    background: var(--p-surface-100);
}
html.dark .p-textarea.p-textarea-filled:focus,
html.dark .p-textarea.variant-filled:focus,
[data-theme="dark"] .p-textarea.p-textarea-filled:focus,
[data-theme="dark"] .p-textarea.variant-filled:focus,
.dark .p-textarea.p-textarea-filled:focus,
.dark .p-textarea.variant-filled:focus {
    background: var(--p-surface-0);
}
html.dark .p-textarea:disabled,
html.dark .p-textarea.p-disabled,
[data-theme="dark"] .p-textarea:disabled,
[data-theme="dark"] .p-textarea.p-disabled,
.dark .p-textarea:disabled,
.dark .p-textarea.p-disabled {
    background: var(--p-surface-100);
    border-color: var(--p-border-color);
    color: var(--p-text-muted);
}
`;

export default function TextareaIsland(container: HTMLElement, props: TextareaProps, ctx?: IslandContext) {
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

            setHtml(container, html`
                <textarea 
                    class="${classList}" data-part="root"
                    rows="${props.rows || 5}"
                    cols="${props.cols || 30}"
                    placeholder="${props.placeholder || ''}"
                    ${attr('maxlength', props.maxLength)}
                    ${attr('disabled', isDisabled)}
                    ${attr('aria-invalid', isInvalid ? 'true' : null)}
                    ${attr('name', props.name || props.targetInputName)}
                    ${attr('id', props.inputId)}
                >${props.value || ''}</textarea>
                ${props.maxLength ? html`
                    <div class="p-textarea-counter">
                        <span class="p-textarea-count">${(props.value || '').length}</span> / ${props.maxLength}
                    </div>
                ` : ''}
            `);
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

        emitComponentEvent(container, 'textarea', 'input', { value: textareaEl.value });
    }, { signal: ctx?.signal });

    textareaEl.addEventListener('change', () => {
        emitComponentEvent(container, 'textarea', 'change', { value: textareaEl.value });
    }, { signal: ctx?.signal });

    if (isAutoResize) {
        window.addEventListener('resize', adjustHeight, { signal: ctx?.signal });
        const t = setTimeout(adjustHeight, 0);
        ctx?.onCleanup?.(() => clearTimeout(t));
    }
}
