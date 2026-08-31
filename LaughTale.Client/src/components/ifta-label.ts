import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise IftaLabel Component (Aura IftaLabel)
 * Infield top-aligned label container with seamless field padding,
 * focus/invalid states, and full Theme Studio & dark mode token adherence.
 */

import { injectIslandStyle } from '../runtime/styles';

export interface IftaLabelProps {
    label?: string;
    for?: string;
    invalid?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
island-ifta-label,
.laughtale-ifta-label {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

island-ifta-label > label,
.laughtale-ifta-label > label {
    position: absolute;
    top: 0.4rem;
    left: 0.75rem;
    color: var(--p-text-muted);
    font-size: 0.6875rem;
    font-weight: 600;
    pointer-events: none;
    transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
    line-height: 1;
    user-select: none;
}

island-ifta-label input,
island-ifta-label textarea,
island-ifta-label select,
island-ifta-label .p-input,
island-ifta-label .p-password-container,
island-ifta-label .p-inputtags,
island-ifta-label .cs-trigger,
island-ifta-label .dp-trigger,
island-ifta-label .ac-input-container,
island-ifta-label .p-select,
island-ifta-label .p-treeselect,
island-ifta-label .p-multiselect,
.laughtale-ifta-label input,
.laughtale-ifta-label textarea,
.laughtale-ifta-label select,
.laughtale-ifta-label .p-input,
.laughtale-ifta-label .p-password-container,
.laughtale-ifta-label .p-inputtags,
.laughtale-ifta-label .cs-trigger,
.laughtale-ifta-label .dp-trigger,
.laughtale-ifta-label .ac-input-container,
.laughtale-ifta-label .p-select,
.laughtale-ifta-label .p-treeselect,
.laughtale-ifta-label .p-multiselect {
    padding-top: 1.35rem !important;
    padding-bottom: 0.35rem !important;
    min-height: 3rem !important;
    font-size: 0.875rem !important;
    box-sizing: border-box;
}

island-ifta-label .p-inputtags input,
island-ifta-label .p-password-container input,
island-ifta-label .p-inputgroup input,
.laughtale-ifta-label .p-inputtags input,
.laughtale-ifta-label .p-password-container input,
.laughtale-ifta-label .p-inputgroup input {
    padding-top: 0.1875rem !important;
    padding-bottom: 0.1875rem !important;
    min-height: auto !important;
}

/* Focus State */
island-ifta-label:focus-within > label,
.laughtale-ifta-label:focus-within > label {
    color: var(--lt-primary-500);
}

/* Invalid State */
island-ifta-label.invalid > label,
island-ifta-label:has(.invalid) > label,
island-ifta-label:has(.is-invalid) > label,
island-ifta-label:has(:invalid) > label,
.laughtale-ifta-label.invalid > label,
.laughtale-ifta-label:has(.invalid) > label,
.laughtale-ifta-label:has(.is-invalid) > label,
.laughtale-ifta-label:has(:invalid) > label {
    color: var(--p-red-500, var(--lt-danger-500)) !important;
}

/* Dark Mode Tokens */
html.dark island-ifta-label > label,
html.dark .laughtale-ifta-label > label,
[data-theme="dark"] island-ifta-label > label,
[data-theme="dark"] .laughtale-ifta-label > label,
.dark island-ifta-label > label,
.dark .laughtale-ifta-label > label {
    color: var(--p-text-muted);
}
html.dark island-ifta-label:focus-within > label,
html.dark .laughtale-ifta-label:focus-within > label,
[data-theme="dark"] island-ifta-label:focus-within > label,
[data-theme="dark"] .laughtale-ifta-label:focus-within > label,
.dark island-ifta-label:focus-within > label,
.dark .laughtale-ifta-label:focus-within > label {
    color: var(--p-primary-400);
}
html.dark island-ifta-label.invalid > label,
html.dark island-ifta-label:has(.invalid) > label,
html.dark island-ifta-label:has(.is-invalid) > label,
html.dark island-ifta-label:has(:invalid) > label,
html.dark .laughtale-ifta-label.invalid > label,
html.dark .laughtale-ifta-label:has(.invalid) > label,
html.dark .laughtale-ifta-label:has(.is-invalid) > label,
html.dark .laughtale-ifta-label:has(:invalid) > label,
[data-theme="dark"] island-ifta-label.invalid > label,
[data-theme="dark"] island-ifta-label:has(.invalid) > label,
[data-theme="dark"] island-ifta-label:has(.is-invalid) > label,
[data-theme="dark"] island-ifta-label:has(:invalid) > label,
[data-theme="dark"] .laughtale-ifta-label.invalid > label,
[data-theme="dark"] .laughtale-ifta-label:has(.invalid) > label,
[data-theme="dark"] .laughtale-ifta-label:has(.is-invalid) > label,
[data-theme="dark"] .laughtale-ifta-label:has(:invalid) > label,
.dark island-ifta-label.invalid > label,
.dark island-ifta-label:has(.invalid) > label,
.dark island-ifta-label:has(.is-invalid) > label,
.dark island-ifta-label:has(:invalid) > label,
.dark .laughtale-ifta-label.invalid > label,
.dark .laughtale-ifta-label:has(.invalid) > label,
.dark .laughtale-ifta-label:has(.is-invalid) > label,
.dark .laughtale-ifta-label:has(:invalid) > label {
    color: var(--p-red-400) !important;
}
`;

export default function IftaLabelIsland(container: HTMLElement, props: IftaLabelProps, ctx?: IslandContext) {
    injectIslandStyle('laughtale-ifta-label', CSS);

    container.classList.add('laughtale-ifta-label');
    if (props.invalid) {
        container.classList.add('invalid');
    }
    container.setAttribute('data-part', 'root');

    // Check if label element already exists in slotted markup
    let labelEl = container.querySelector('label');
    if (!labelEl && props.label) {
        labelEl = document.createElement('label');
        if (props.for) labelEl.setAttribute('for', props.for);
        labelEl.textContent = props.label;
        container.appendChild(labelEl);
    }

    // Label click focus delegation
    labelEl?.addEventListener('click', () => {
        const input = container.querySelector<HTMLElement>('input, textarea, select, .cs-trigger, .dp-trigger, .ac-input, .p-inputtags-input, .p-password-input');
        if (input) {
            input.focus();
            if (typeof (input as any).click === 'function' && !input.matches('input, textarea')) {
                (input as any).click();
            }
        }
    }, { signal: ctx?.signal });
}
