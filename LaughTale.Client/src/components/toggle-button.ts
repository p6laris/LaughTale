import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise ToggleButton Component (Aura ToggleButton)
 * Binary toggle button with dynamic state labels, Lucide icons, size metrics,
 * fluid width, validation ring, and ARIA keyboard support.
 */

import { injectIslandStyle } from '../runtime/styles';
import { getLucideIcon } from '../icons/lucide';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'button'
};

export interface ToggleButtonProps {
    checked?: boolean;
    value?: boolean | string;
    onLabel?: string;
    offLabel?: string;
    onIcon?: string;
    offIcon?: string;
    icon?: string;
    size?: 'small' | 'normal' | 'large';
    fluid?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    name?: string;
    targetInputName?: string;
    inputId?: string;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
/* ==================== AURA TOGGLEBUTTON ==================== */
.laughtale-togglebutton,
.p-togglebutton {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    color: var(--lt-text-primary);
    font-family: var(--p-font-family, inherit);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25;
    cursor: pointer;
    user-select: none;
    outline: none;
    box-sizing: border-box;
    vertical-align: middle;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease, box-shadow 150ms ease, transform 120ms ease;
}

.p-togglebutton.p-togglebutton-fluid {
    display: flex;
    width: 100%;
}

.p-togglebutton:hover:not(.p-disabled):not(.p-togglebutton-checked) {
    background: var(--lt-surface-100);
    border-color: var(--lt-surface-400);
}

.p-togglebutton:focus-visible:not(.p-disabled) {
    border-color: var(--lt-primary-500) !important;
    box-shadow: 0 0 0 1px var(--lt-primary-500) !important;
}

/* Checked (On) State */
.p-togglebutton.p-togglebutton-checked,
.p-togglebutton.is-checked {
    background: var(--lt-primary-50);
    border-color: var(--lt-primary-500);
    color: var(--lt-primary-700);
    font-weight: 600;
}

.p-togglebutton.p-togglebutton-checked:hover:not(.p-disabled),
.p-togglebutton.is-checked:hover:not(.p-disabled) {
    background: var(--lt-primary-100);
}

/* Sizes */
.p-togglebutton.size-small,
.p-togglebutton.p-togglebutton-sm {
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
    gap: 0.375rem;
}

.p-togglebutton.size-large,
.p-togglebutton.p-togglebutton-lg {
    padding: 0.75rem 1.25rem;
    font-size: 1.0625rem;
    gap: 0.625rem;
}

/* Invalid State */
.p-togglebutton.p-invalid,
.p-togglebutton.is-invalid {
    border-color: var(--p-red-500, var(--lt-danger-500)) !important;
}
.p-togglebutton.p-invalid:focus-visible,
.p-togglebutton.is-invalid:focus-visible {
    box-shadow: 0 0 0 1px var(--p-red-500, var(--lt-danger-500)) !important;
}

/* Disabled State */
.p-togglebutton:disabled,
.p-togglebutton.p-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--lt-surface-100);
    border-color: var(--lt-surface-300);
    color: var(--p-text-muted, var(--lt-surface-500));
    pointer-events: none;
}

/* Icon & Label */
.p-togglebutton-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.p-togglebutton-label {
    display: inline-block;
    line-height: 1;
}

/* ==================== DARK MODE ==================== */
html.dark .laughtale-togglebutton,
html.dark .p-togglebutton,
[data-theme="dark"] .laughtale-togglebutton,
[data-theme="dark"] .p-togglebutton,
.dark .laughtale-togglebutton,
.dark .p-togglebutton {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    color: var(--p-text-color);
}
html.dark .p-togglebutton:hover:not(.p-disabled):not(.p-togglebutton-checked),
[data-theme="dark"] .p-togglebutton:hover:not(.p-disabled):not(.p-togglebutton-checked),
.dark .p-togglebutton:hover:not(.p-disabled):not(.p-togglebutton-checked) {
    background: var(--p-surface-100);
    border-color: var(--p-surface-400);
}
html.dark .p-togglebutton.p-togglebutton-checked,
html.dark .p-togglebutton.is-checked,
[data-theme="dark"] .p-togglebutton.p-togglebutton-checked,
[data-theme="dark"] .p-togglebutton.is-checked,
.dark .p-togglebutton.p-togglebutton-checked,
.dark .p-togglebutton.is-checked {
    background: rgba(16, 185, 129, 0.16);
    border-color: var(--p-primary-500);
    color: var(--p-primary-300);
}
html.dark .p-togglebutton.p-togglebutton-checked:hover:not(.p-disabled),
html.dark .p-togglebutton.is-checked:hover:not(.p-disabled),
[data-theme="dark"] .p-togglebutton.p-togglebutton-checked:hover:not(.p-disabled),
[data-theme="dark"] .p-togglebutton.is-checked:hover:not(.p-disabled),
.dark .p-togglebutton.p-togglebutton-checked:hover:not(.p-disabled),
.dark .p-togglebutton.is-checked:hover:not(.p-disabled) {
    background: rgba(16, 185, 129, 0.24);
    color: var(--p-primary-200);
}
html.dark .p-togglebutton:disabled,
html.dark .p-togglebutton.p-disabled,
[data-theme="dark"] .p-togglebutton:disabled,
[data-theme="dark"] .p-togglebutton.p-disabled,
.dark .p-togglebutton:disabled,
.dark .p-togglebutton.p-disabled {
    background: var(--p-surface-100);
    border-color: var(--p-border-color);
    color: var(--p-text-muted);
}
`;

export default function ToggleButtonIsland(container: HTMLElement, props: ToggleButtonProps, ctx?: IslandContext) {
    injectIslandStyle('laughtale-togglebutton', CSS);

    let isChecked = props.checked === true || String(props.checked) === 'true' || props.value === true || String(props.value) === 'true';
    const isFluid = props.fluid === true || String(props.fluid) === 'true';
    const isInvalid = props.invalid === true || String(props.invalid) === 'true';
    const isDisabled = props.disabled === true || String(props.disabled) === 'true';
    const size = props.size || 'normal';

    const onLabel = props.onLabel !== undefined ? props.onLabel : 'On';
    const offLabel = props.offLabel !== undefined ? props.offLabel : 'Off';
    const onIcon = props.onIcon || props.icon;
    const offIcon = props.offIcon || props.icon;

    function render() {
        const rootClasses = [
            'laughtale-togglebutton',
            'p-togglebutton',
            'p-component',
            isChecked ? 'p-togglebutton-checked is-checked' : '',
            isFluid ? 'p-togglebutton-fluid' : '',
            size !== 'normal' ? `size-${size} p-togglebutton-${size === 'small' ? 'sm' : 'lg'}` : '',
            isInvalid ? 'p-invalid is-invalid' : '',
            isDisabled ? 'p-disabled' : ''
        ].filter(Boolean).join(' ');

        container.className = rootClasses;
        container.setAttribute('role', 'button');
        container.setAttribute('aria-pressed', isChecked ? 'true' : 'false');
        container.setAttribute('tabindex', isDisabled ? '-1' : '0');
        if (props.inputId) container.setAttribute('id', props.inputId);
        if (props.ariaLabel) container.setAttribute('aria-label', props.ariaLabel);
        if (props.ariaLabelledBy) container.setAttribute('aria-labelledby', props.ariaLabelledBy);

        const currentLabel = isChecked ? onLabel : offLabel;
        const currentIconName = isChecked ? onIcon : offIcon;
        const iconSize = size === 'small' ? 14 : (size === 'large' ? 18 : 16);
        const iconHtml = currentIconName ? html`<span class="p-togglebutton-icon" data-part="root">${unsafe(getLucideIcon(currentIconName, iconSize))}</span>` : '';
        const labelHtml = currentLabel ? html`<span class="p-togglebutton-label">${currentLabel}</span>` : '';

        setHtml(container, html`
            ${iconHtml}
            ${labelHtml}
            <input type="hidden" name="${props.name || props.targetInputName || 'togglebutton_value'}" value="${isChecked ? 'true' : 'false'}" />
        `);

        bindEvents();
    }

    function toggle() {
        if (isDisabled) return;
        isChecked = !isChecked;
        render();
        syncValue();
    }

    function syncValue() {
        const hiddenInp = container.querySelector<HTMLInputElement>('input[type="hidden"]');
        if (hiddenInp) hiddenInp.value = isChecked ? 'true' : 'false';

        container.dispatchEvent(new CustomEvent('togglebutton:change', {
            bubbles: true,
            detail: { checked: isChecked, value: isChecked }
        }));
        container.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            detail: { checked: isChecked, value: isChecked }
        }));
    }

    function bindEvents() {
        container.onclick = (e) => {
            e.preventDefault();
            toggle();
        };

        container.onkeydown = (e: KeyboardEvent) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                toggle();
            }
        };
    }

    render();
}
