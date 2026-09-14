import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise ToggleSwitch Component (Aura ToggleSwitch)
 * Pixel-perfect boolean toggle switch with handle icon templating, custom styling,
 * validation ring, and ARIA keyboard support.
 */

import { injectIslandStyle } from '../runtime/styles';
import { emitComponentEvent } from '../runtime/events';
import { getLucideIcon } from '../icons/lucide';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import { useFormField } from '../composables/useFormField';
import { useLocale } from '../composables/useLocale';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'native',
    element: 'input'
};

/**
 * Pure calculation for the toggle switch handle's slide transform. The handle's resting
 * (unchecked) position uses the logical `inset-inline-start` CSS property, which the
 * browser already mirrors correctly under `dir="rtl"`. But the "checked" slide is a
 * `translateX`, which is a physical transform that CSS never auto-mirrors - so the sign
 * must be flipped in JS: in RTL the handle slides toward the physical left instead of
 * right. Exported so this mirroring can be unit-tested directly.
 */
export function getToggleHandleTransform(isChecked: boolean, isRtl: boolean): string {
    if (!isChecked) return '';
    return isRtl ? 'translateX(-16px)' : 'translateX(16px)';
}

export interface ToggleSwitchProps {
    checked?: boolean;
    value?: boolean | string;
    label?: string;
    disabled?: boolean;
    invalid?: boolean;
    checkedIcon?: string;
    uncheckedIcon?: string;
    icon?: string;
    inputId?: string;
    name?: string;
    targetInputName?: string;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    sliderClass?: string;
    handleClass?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
/* ==================== AURA TOGGLESWITCH ==================== */
.laughtale-toggleswitch,
.p-toggleswitch {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    user-select: none;
    vertical-align: middle;
    cursor: pointer;
}

.p-toggleswitch.p-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
}

.p-toggleswitch-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: 1;
    cursor: pointer;
    border: 0;
    appearance: none;
}

.p-toggleswitch.p-disabled .p-toggleswitch-input {
    cursor: not-allowed;
}

/* Slider Track */
.p-toggleswitch-slider {
    position: relative;
    display: block;
    width: 2.5rem; /* 40px */
    height: 1.5rem; /* 24px */
    background: var(--lt-surface-300);
    border-radius: 9999px;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    box-sizing: border-box;
}

.p-toggleswitch:hover:not(.p-disabled):not(.p-toggleswitch-checked) .p-toggleswitch-slider {
    background: var(--lt-surface-400);
}

.p-toggleswitch:focus-within:not(.p-disabled) .p-toggleswitch-slider,
.p-toggleswitch-input:focus-visible ~ .p-toggleswitch-slider {
    box-shadow: 0 0 0 1px var(--lt-primary-500) !important;
}

/* Checked State */
.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
    background: var(--lt-primary-500);
}

.p-toggleswitch.p-toggleswitch-checked:hover:not(.p-disabled) .p-toggleswitch-slider {
    background: var(--lt-primary-600);
}

/* Handle Thumb */
.p-toggleswitch-handle {
    position: absolute;
    top: 3px;
    inset-inline-start: 3px;
    width: 1.125rem; /* 18px */
    height: 1.125rem; /* 18px */
    background: var(--lt-surface-0);
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.06);
    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), background 150ms ease, color 150ms ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    color: var(--lt-surface-600);
}

.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
    /* transform is applied inline per-instance (see getToggleHandleTransform) so the
       slide direction can be mirrored correctly under dir="rtl". */
    color: var(--lt-primary-600);
}

/* Handle Icon */
.p-toggleswitch-handle-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.p-toggleswitch-handle-icon svg {
    width: 10px;
    height: 10px;
}

/* Invalid State */
.p-toggleswitch.p-invalid .p-toggleswitch-slider,
.p-toggleswitch.is-invalid .p-toggleswitch-slider {
    border: 1px solid var(--p-red-500, var(--lt-danger-500)) !important;
}
.p-toggleswitch.p-invalid:focus-within .p-toggleswitch-slider,
.p-toggleswitch.is-invalid:focus-within .p-toggleswitch-slider {
    box-shadow: 0 0 0 1px var(--p-red-500, var(--lt-danger-500)) !important;
}

/* Label */
.p-toggleswitch-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--lt-text-primary);
    cursor: pointer;
}

/* ==================== DARK MODE ==================== */
html.dark .p-toggleswitch-slider,
[data-theme="dark"] .p-toggleswitch-slider,
.dark .p-toggleswitch-slider {
    background: var(--p-surface-200);
}
html.dark .p-toggleswitch:hover:not(.p-disabled):not(.p-toggleswitch-checked) .p-toggleswitch-slider,
[data-theme="dark"] .p-toggleswitch:hover:not(.p-disabled):not(.p-toggleswitch-checked) .p-toggleswitch-slider,
.dark .p-toggleswitch:hover:not(.p-disabled):not(.p-toggleswitch-checked) .p-toggleswitch-slider {
    background: var(--p-surface-300);
}
html.dark .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider,
[data-theme="dark"] .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider,
.dark .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
    background: var(--p-primary-500);
}
html.dark .p-toggleswitch.p-toggleswitch-checked:hover:not(.p-disabled) .p-toggleswitch-slider,
[data-theme="dark"] .p-toggleswitch.p-toggleswitch-checked:hover:not(.p-disabled) .p-toggleswitch-slider,
.dark .p-toggleswitch.p-toggleswitch-checked:hover:not(.p-disabled) .p-toggleswitch-slider {
    background: var(--p-primary-400);
}
html.dark .p-toggleswitch-handle,
[data-theme="dark"] .p-toggleswitch-handle,
.dark .p-toggleswitch-handle {
    background: var(--p-surface-0);
    color: var(--p-text-muted);
}
html.dark .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle,
[data-theme="dark"] .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle,
.dark .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
    background: var(--p-surface-0);
    color: var(--p-primary-400);
}
html.dark .p-toggleswitch.p-disabled .p-toggleswitch-slider,
[data-theme="dark"] .p-toggleswitch.p-disabled .p-toggleswitch-slider,
.dark .p-toggleswitch.p-disabled .p-toggleswitch-slider {
    background: var(--p-surface-100);
}
html.dark .p-toggleswitch.p-disabled .p-toggleswitch-handle,
[data-theme="dark"] .p-toggleswitch.p-disabled .p-toggleswitch-handle,
.dark .p-toggleswitch.p-disabled .p-toggleswitch-handle {
    background: var(--p-surface-200);
}
html.dark .p-toggleswitch-label,
[data-theme="dark"] .p-toggleswitch-label,
.dark .p-toggleswitch-label {
    color: var(--p-text-color);
}
`;

export default function ToggleSwitchIsland(container: HTMLElement, props: ToggleSwitchProps, ctx?: IslandContext) {
    injectIslandStyle('laughtale-toggleswitch', CSS);
    const locale = useLocale(ctx);

    const formField = useFormField(container, ctx, {
        cardinality: 'Boolean',
        fieldKind: 'Native',
        name: props.name || props.targetInputName
    });

    if (formField.field instanceof HTMLInputElement) {
        formField.field.type = 'hidden';
    }

    let isChecked = props.checked !== undefined || props.value !== undefined
        ? (props.checked === true || String(props.checked) === 'true' || props.value === true || String(props.value) === 'true')
        : Boolean(formField.getValue());
    const isInvalid = props.invalid === true || String(props.invalid) === 'true';
    const isDisabled = props.disabled === true || String(props.disabled) === 'true';
    const checkedIcon = props.checkedIcon || props.icon;
    const uncheckedIcon = props.uncheckedIcon;
    const inputId = props.inputId || '';

    function render() {
        const rootClasses = [
            'laughtale-toggleswitch',
            'p-toggleswitch',
            'p-component',
            isChecked ? 'p-toggleswitch-checked' : '',
            isInvalid ? 'p-invalid is-invalid' : '',
            isDisabled ? 'p-disabled' : ''
        ].filter(Boolean).join(' ');

        container.className = rootClasses;

        const activeIcon = isChecked ? checkedIcon : uncheckedIcon;
        const iconHtml = activeIcon ? html`<span class="p-toggleswitch-handle-icon" data-part="root">${unsafe(getLucideIcon(activeIcon, 10))}</span>` : '';
        const ariaLabelVal = props.ariaLabel || props.label || props.name || 'Toggle switch';
        const handleTransform = getToggleHandleTransform(isChecked, locale.isRtl);

        formField.detach();
        setHtml(container, html`
            <input 
                type="checkbox" 
                role="switch"
                class="p-toggleswitch-input"
                ${attr('id', inputId)}
                ${attr('checked', isChecked)}
                ${attr('disabled', isDisabled)}
                aria-checked="${isChecked ? 'true' : 'false'}"
                aria-label="${ariaLabelVal}"
                ${attr('aria-labelledby', props.ariaLabelledBy)}
                tabindex="${isDisabled ? '-1' : '0'}"
            />
            <div class="p-toggleswitch-slider ${props.sliderClass || ''}">
                <div class="p-toggleswitch-handle ${props.handleClass || ''}" style="${handleTransform ? `transform: ${handleTransform};` : ''}">
                    ${iconHtml}
                </div>
            </div>
            ${props.label ? html`<span class="p-toggleswitch-label">${props.label}</span>` : ''}
        `);
        if (formField.field instanceof HTMLInputElement) {
            formField.field.type = 'hidden';
        }
        formField.reattach();

        bindEvents();
    }

    function toggle() {
        if (isDisabled) return;
        isChecked = !isChecked;
        render();
        syncValue();
    }

    function syncValue() {
        formField.setValue(isChecked);
        emitComponentEvent(container, 'toggle-switch', 'change', {
            checked: isChecked,
            value: isChecked
        });
    }

    function bindEvents() {
        const inp = container.querySelector<HTMLInputElement>('.p-toggleswitch-input');
        if (inp) {
            inp.onchange = (e) => {
                e.stopPropagation();
                toggle();
            };
        }

        container.onclick = (e) => {
            if ((e.target as HTMLElement).closest('.p-toggleswitch-input')) return;
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
    formField.setValue(isChecked);
}
