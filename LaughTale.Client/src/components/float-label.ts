import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise FloatLabel Component (Aura FloatLabel)
 * Smooth floating label wrapper with 'over', 'in', and 'on' variants,
 * automatic child value/focus/tags detection, MutationObserver tracking,
 * and full Theme Studio & dark mode token support.
 */

import { injectIslandStyle } from '../runtime/styles';

export interface FloatLabelProps {
    label?: string;
    variant?: 'over' | 'in' | 'on';
    for?: string;
    invalid?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
.laughtale-float-label {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    margin-top: 1rem;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.laughtale-float-label > label {
    position: absolute;
    left: 0.75rem;
    color: var(--p-text-muted);
    font-size: 0.875rem;
    font-weight: 500;
    pointer-events: none;
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
    line-height: 1;
    user-select: none;
}

/* Variant: over (Floats completely above the input) */
.laughtale-float-label-over > label {
    top: 50%;
    transform: translateY(-50%);
}
.laughtale-float-label-over.has-value > label,
.laughtale-float-label-over:focus-within > label {
    top: -1.25rem;
    left: 0.15rem;
    transform: translateY(0);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--p-primary-500);
}

/* Variant: on (Floats on the top border line with surface pill masking) */
.laughtale-float-label-on > label {
    top: 50%;
    transform: translateY(-50%);
    background: var(--p-surface-0);
    padding: 0 0.35rem;
    border-radius: 2px;
}
.laughtale-float-label-on.has-value > label,
.laughtale-float-label-on:focus-within > label {
    top: 0;
    transform: translateY(-50%);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--p-primary-500);
    z-index: 15;
}

/* Variant: in (Infield top-aligned label) */
.laughtale-float-label-in > label {
    top: 50%;
    transform: translateY(-50%);
}
.laughtale-float-label-in.has-value > label,
.laughtale-float-label-in:focus-within > label {
    top: 0.35rem;
    transform: translateY(0);
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--p-primary-500);
}
.laughtale-float-label-in input,
.laughtale-float-label-in .p-input,
.laughtale-float-label-in .p-password-container,
.laughtale-float-label-in .p-inputtags,
.laughtale-float-label-in .cs-trigger,
.laughtale-float-label-in .dp-trigger,
.laughtale-float-label-in .ac-input-container,
.laughtale-float-label-in .p-select,
.laughtale-float-label-in .p-treeselect,
.laughtale-float-label-in .p-multiselect {
    padding-top: 1.25rem !important;
    padding-bottom: 0.25rem !important;
}

.laughtale-float-label-in .p-inputtags input,
.laughtale-float-label-in .p-password-container input,
.laughtale-float-label-in .p-inputgroup input {
    padding-top: 0.1875rem !important;
    padding-bottom: 0.1875rem !important;
    min-height: auto !important;
}

/* Invalid State */
.laughtale-float-label.invalid > label,
.laughtale-float-label:has(.invalid) > label,
.laughtale-float-label:has(.is-invalid) > label,
.laughtale-float-label:has(:invalid) > label {
    color: var(--p-red-500, #ef4444) !important;
}

/* Dark Mode Tokens */
.dark .laughtale-float-label > label {
    color: var(--p-surface-400);
}
.dark .laughtale-float-label-on > label {
    background: var(--p-surface-900);
}
.dark .laughtale-float-label.has-value > label,
.dark .laughtale-float-label:focus-within > label {
    color: var(--p-primary-400);
}
.dark .laughtale-float-label.invalid > label,
.dark .laughtale-float-label:has(.invalid) > label,
.dark .laughtale-float-label:has(.is-invalid) > label,
.dark .laughtale-float-label:has(:invalid) > label {
    color: #f87171 !important;
}
`;

export default function FloatLabelIsland(container: HTMLElement, props: FloatLabelProps, ctx?: IslandContext) {
    injectIslandStyle('laughtale-float-label', CSS);
    
    const variant = props.variant || 'over';
    const initialHtml = container.innerHTML;
    const forAttr = props.for ? `for="${props.for}"` : '';

    // Check if label element already exists in slotted content
    const existingLabel = container.querySelector('label');
    const labelText = props.label || (existingLabel ? existingLabel.textContent : 'Label');

    container.innerHTML = `
        <div class="laughtale-float-label laughtale-float-label-${variant} ${props.invalid ? 'invalid' : ''}">
            ${initialHtml}
            ${!existingLabel && labelText ? `<label ${forAttr}>${labelText}</label>` : ''}
        </div>
    `;

    const wrap = container.querySelector<HTMLElement>('.laughtale-float-label')!;
    const labelEl = wrap.querySelector('label');

    // Find interactive child input / textarea / custom island
    const findTarget = (): HTMLElement | null => {
        return wrap.querySelector('input, textarea, select, .cs-trigger, .dp-trigger, .ac-input, .p-inputtags-input, .p-password-input');
    };

    function updateFloatingState() {
        const input = wrap.querySelector<HTMLInputElement | HTMLTextAreaElement>('input:not([type="hidden"]), textarea, select');
        const customText = wrap.querySelector<HTMLElement>('.cs-label:not(.placeholder), .dp-label:not(.placeholder), .ac-input, .p-select-label:not(.p-placeholder), .p-treeselect-label:not(.p-placeholder), .p-multiselect-label:not(.p-placeholder)');
        const tags = wrap.querySelectorAll<HTMLElement>('.p-inputtags-tag, .chip-item, .p-chip, .p-select-chip');
        const hiddenInp = wrap.querySelector<HTMLInputElement>('input[type="hidden"]');

        let hasVal = false;
        if (input && input.value && input.value.trim().length > 0) {
            hasVal = true;
        } else if (customText && customText.textContent && customText.textContent.trim().length > 0 && !customText.classList.contains('placeholder') && !customText.classList.contains('p-placeholder') && customText.textContent.trim() !== ' ') {
            hasVal = true;
        } else if (tags.length > 0) {
            hasVal = true;
        } else if (hiddenInp && hiddenInp.value && hiddenInp.value.trim().length > 0) {
            hasVal = true;
        }

        const currentlyHas = wrap.classList.contains('has-value');
        if (currentlyHas !== hasVal) {
            if (hasVal) {
                wrap.classList.add('has-value');
            } else {
                wrap.classList.remove('has-value');
            }
        }
    }

    // Label click delegation
    labelEl?.addEventListener('click', () => {
        const target = findTarget();
        if (target) {
            target.focus();
            if (typeof (target as any).click === 'function' && !target.matches('input, textarea')) {
                (target as any).click();
            }
        }
    });

    // Event listeners
    wrap.addEventListener('input', updateFloatingState);
    wrap.addEventListener('change', updateFloatingState);
    wrap.addEventListener('focusin', () => {
        wrap.classList.add('is-focused');
        updateFloatingState();
    });
    wrap.addEventListener('focusout', () => {
        wrap.classList.remove('is-focused');
        updateFloatingState();
    });

    // Custom island change events
    wrap.addEventListener('inputtags:change', updateFloatingState);
    wrap.addEventListener('chips:change', updateFloatingState);
    wrap.addEventListener('tags:add', updateFloatingState);
    wrap.addEventListener('tags:remove', updateFloatingState);
    wrap.addEventListener('password:change', updateFloatingState);
    wrap.addEventListener('otp:change', updateFloatingState);
    wrap.addEventListener('cascadeselect:change', updateFloatingState);
    wrap.addEventListener('datepicker:change', updateFloatingState);
    wrap.addEventListener('autocomplete:change', updateFloatingState);
    wrap.addEventListener('select:change', updateFloatingState);

    // MutationObserver to detect child tag additions (childList only, preventing attribute loops)
    const observer = new MutationObserver(() => {
        updateFloatingState();
    });
    observer.observe(wrap, { childList: true, subtree: true });

    // Initial passes
    updateFloatingState();
    setTimeout(updateFloatingState, 50);
    setTimeout(updateFloatingState, 200);
}
