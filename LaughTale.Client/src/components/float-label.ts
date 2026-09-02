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
island-float-label,
.laughtale-float-label {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    margin-top: 1rem;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

island-float-label > label,
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
island-float-label[variant="over"] > label,
.laughtale-float-label-over > label {
    top: 50%;
    transform: translateY(-50%);
}
island-float-label[variant="over"]:has(textarea) > label,
.laughtale-float-label-over:has(textarea) > label {
    top: 1rem;
    transform: none;
}
island-float-label[variant="over"].has-value > label,
island-float-label[variant="over"]:focus-within > label,
.laughtale-float-label-over.has-value > label,
.laughtale-float-label-over:focus-within > label {
    top: -1.25rem;
    left: 0.15rem;
    transform: translateY(0);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--lt-primary-500);
}

/* Variant: on (Floats on the top border line with surface pill masking) */
island-float-label[variant="on"] > label,
.laughtale-float-label-on > label {
    top: 50%;
    transform: translateY(-50%);
    background: var(--lt-surface-0);
    padding: 0 0.35rem;
    border-radius: 2px;
}
island-float-label[variant="on"]:has(textarea) > label,
.laughtale-float-label-on:has(textarea) > label {
    top: 1rem;
    transform: none;
}
island-float-label[variant="on"].has-value > label,
island-float-label[variant="on"]:focus-within > label,
.laughtale-float-label-on.has-value > label,
.laughtale-float-label-on:focus-within > label {
    top: 0;
    transform: translateY(-50%);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--lt-primary-500);
    z-index: 15;
}

/* Variant: in (Infield top-aligned label) */
island-float-label[variant="in"] > label,
.laughtale-float-label-in > label {
    top: 50%;
    transform: translateY(-50%);
}
island-float-label[variant="in"]:has(textarea) > label,
.laughtale-float-label-in:has(textarea) > label {
    top: 1rem;
    transform: none;
}
island-float-label[variant="in"].has-value > label,
island-float-label[variant="in"]:focus-within > label,
.laughtale-float-label-in.has-value > label,
.laughtale-float-label-in:focus-within > label {
    top: 0.35rem;
    transform: translateY(0);
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--lt-primary-500);
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
    color: var(--p-red-500, var(--lt-danger-500)) !important;
}

/* Dark Mode Tokens */
html.dark .laughtale-float-label > label,
[data-theme="dark"] .laughtale-float-label > label,
.dark .laughtale-float-label > label {
    color: var(--p-text-muted);
}
html.dark .laughtale-float-label-on > label,
[data-theme="dark"] .laughtale-float-label-on > label,
.dark .laughtale-float-label-on > label {
    background: var(--p-surface-0);
}
html.dark .laughtale-float-label.has-value > label,
html.dark .laughtale-float-label:focus-within > label,
[data-theme="dark"] .laughtale-float-label.has-value > label,
[data-theme="dark"] .laughtale-float-label:focus-within > label,
.dark .laughtale-float-label.has-value > label,
.dark .laughtale-float-label:focus-within > label {
    color: var(--p-primary-400);
}
html.dark .laughtale-float-label.invalid > label,
html.dark .laughtale-float-label:has(.invalid) > label,
html.dark .laughtale-float-label:has(.is-invalid) > label,
html.dark .laughtale-float-label:has(:invalid) > label,
[data-theme="dark"] .laughtale-float-label.invalid > label,
[data-theme="dark"] .laughtale-float-label:has(.invalid) > label,
[data-theme="dark"] .laughtale-float-label:has(.is-invalid) > label,
[data-theme="dark"] .laughtale-float-label:has(:invalid) > label,
.dark .laughtale-float-label.invalid > label,
.dark .laughtale-float-label:has(.invalid) > label,
.dark .laughtale-float-label:has(.is-invalid) > label,
.dark .laughtale-float-label:has(:invalid) > label {
    color: var(--p-red-400) !important;
}
`;

export default function FloatLabelIsland(container: HTMLElement, props: FloatLabelProps, ctx?: IslandContext) {
    injectIslandStyle('laughtale-float-label', CSS);
    
    const variant = props.variant || 'over';
    container.classList.add('laughtale-float-label', `laughtale-float-label-${variant}`);
    if (props.invalid) {
        container.classList.add('invalid');
    }
    container.setAttribute('data-part', 'root');

    // Check if label element already exists in slotted content
    let labelEl = container.querySelector('label');
    if (!labelEl && props.label) {
        labelEl = document.createElement('label');
        if (props.for) labelEl.setAttribute('for', props.for);
        labelEl.textContent = props.label;
        container.appendChild(labelEl);
    }

    // Find interactive child input / textarea / custom island
    const findTarget = (): HTMLElement | null => {
        return container.querySelector('input, textarea, select, .cs-trigger, .dp-trigger, .ac-input, .p-inputtags-input, .p-password-input');
    };

    function updateFloatingState() {
        const input = container.querySelector<HTMLInputElement | HTMLTextAreaElement>('input:not([type="hidden"]), textarea, select');
        const customText = container.querySelector<HTMLElement>('.cs-label:not(.placeholder), .dp-label:not(.placeholder), .ac-input, .p-select-label:not(.p-placeholder), .p-treeselect-label:not(.p-placeholder), .p-multiselect-label:not(.p-placeholder)');
        const tags = container.querySelectorAll<HTMLElement>('.p-inputtags-tag, .chip-item, .p-chip, .p-select-chip');
        const hiddenInp = container.querySelector<HTMLInputElement>('input[type="hidden"]');

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

        const currentlyHas = container.classList.contains('has-value');
        if (currentlyHas !== hasVal) {
            if (hasVal) {
                container.classList.add('has-value');
            } else {
                container.classList.remove('has-value');
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
    }, { signal: ctx?.signal });

    // Event listeners
    container.addEventListener('input', updateFloatingState, { signal: ctx?.signal });
    container.addEventListener('change', updateFloatingState, { signal: ctx?.signal });
    container.addEventListener('focusin', () => {
        container.classList.add('is-focused');
        updateFloatingState();
    }, { signal: ctx?.signal });
    container.addEventListener('focusout', () => {
        container.classList.remove('is-focused');
        updateFloatingState();
    }, { signal: ctx?.signal });

    // Custom island change events
    container.addEventListener('inputtags:change', updateFloatingState, { signal: ctx?.signal });
    container.addEventListener('chips:change', updateFloatingState, { signal: ctx?.signal });
    container.addEventListener('tags:add', updateFloatingState, { signal: ctx?.signal });
    container.addEventListener('tags:remove', updateFloatingState, { signal: ctx?.signal });
    container.addEventListener('password:change', updateFloatingState, { signal: ctx?.signal });
    container.addEventListener('otp:change', updateFloatingState, { signal: ctx?.signal });
    container.addEventListener('cascadeselect:change', updateFloatingState, { signal: ctx?.signal });
    container.addEventListener('datepicker:change', updateFloatingState, { signal: ctx?.signal });
    container.addEventListener('autocomplete:change', updateFloatingState, { signal: ctx?.signal });
    container.addEventListener('select:change', updateFloatingState, { signal: ctx?.signal });

    // MutationObserver to detect child tag additions (childList only, preventing attribute loops)
    const observer = new MutationObserver(() => {
        updateFloatingState();
    });
    observer.observe(container, { childList: true, subtree: true });
    ctx?.onCleanup?.(() => observer.disconnect());

    // Initial passes
    updateFloatingState();
    const t1 = setTimeout(updateFloatingState, 50);
    ctx?.onCleanup?.(() => clearTimeout(t1));
    const t2 = setTimeout(updateFloatingState, 200);
    ctx?.onCleanup?.(() => clearTimeout(t2));
}
