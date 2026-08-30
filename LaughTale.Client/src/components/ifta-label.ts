/**
 * LaughTale: Enterprise IftaLabel Component (Aura IftaLabel)
 * Infield top-aligned label container with seamless field padding,
 * focus/invalid states, and full Theme Studio & dark mode token adherence.
 */

import { injectIslandStyle } from '../runtime/styles';

export interface IftaLabelProps {
    label?: string;
    for?: string;
    invalid?: boolean;
}

const CSS = `
.laughtale-ifta-label {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

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

.laughtale-ifta-label .p-inputtags input,
.laughtale-ifta-label .p-password-container input,
.laughtale-ifta-label .p-inputgroup input {
    padding-top: 0.1875rem !important;
    padding-bottom: 0.1875rem !important;
    min-height: auto !important;
}

/* Focus State */
.laughtale-ifta-label:focus-within > label {
    color: var(--p-primary-500);
}

/* Invalid State */
.laughtale-ifta-label.invalid > label,
.laughtale-ifta-label:has(.invalid) > label,
.laughtale-ifta-label:has(.is-invalid) > label,
.laughtale-ifta-label:has(:invalid) > label {
    color: var(--p-red-500, #ef4444) !important;
}

/* Dark Mode Tokens */
.dark .laughtale-ifta-label > label {
    color: var(--p-surface-400);
}
.dark .laughtale-ifta-label:focus-within > label {
    color: var(--p-primary-400);
}
.dark .laughtale-ifta-label.invalid > label,
.dark .laughtale-ifta-label:has(.invalid) > label,
.dark .laughtale-ifta-label:has(.is-invalid) > label,
.dark .laughtale-ifta-label:has(:invalid) > label {
    color: #f87171 !important;
}
`;

export default function IftaLabelIsland(container: HTMLElement, props: IftaLabelProps) {
    injectIslandStyle('laughtale-ifta-label', CSS);

    const initialHtml = container.innerHTML;
    const forAttr = props.for ? `for="${props.for}"` : '';

    // Check if label element already exists in slotted markup
    const existingLabel = container.querySelector('label');
    const labelText = props.label || (existingLabel ? existingLabel.textContent : 'Label');

    container.innerHTML = `
        <div class="laughtale-ifta-label ${props.invalid ? 'invalid' : ''}">
            ${initialHtml}
            ${!existingLabel && labelText ? `<label ${forAttr}>${labelText}</label>` : ''}
        </div>
    `;

    const wrap = container.querySelector<HTMLElement>('.laughtale-ifta-label')!;
    const labelEl = wrap.querySelector('label');

    // Label click focus delegation
    labelEl?.addEventListener('click', () => {
        const input = wrap.querySelector<HTMLElement>('input, textarea, select, .cs-trigger, .dp-trigger, .ac-input, .p-inputtags-input, .p-password-input');
        if (input) {
            input.focus();
            if (typeof (input as any).click === 'function' && !input.matches('input, textarea')) {
                (input as any).click();
            }
        }
    });
}
