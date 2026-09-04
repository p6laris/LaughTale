import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise SelectButton Component (Aura SelectButton)
 * Segmented button group supporting single and multiple selection,
 * sizes, fluid width, custom icon/badge templates, disabled options,
 * validation ring, and ARIA keyboard navigation.
 */

import { injectIslandStyle } from '../runtime/styles';
import { emitComponentEvent } from '../runtime/events';
import { getLucideIcon } from '../icons/lucide';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import { setRovingTabindex, handleRovingKeydown } from '../accessibility/aria';
import { useKeyboardNav } from '../composables/useKeyboardNav';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'native',
    element: 'button'
};

export interface SelectButtonOption {
    label?: string;
    value: any;
    name?: string;
    icon?: string;
    flag?: string;
    badge?: string | number;
    disabled?: boolean;
    constant?: boolean;
    justify?: string;
}

export interface SelectButtonProps {
    options?: (SelectButtonOption | string)[];
    items?: (SelectButtonOption | string)[];
    value?: any;
    selectedValue?: any;
    values?: any[];
    multiple?: boolean;
    unselectable?: boolean;
    size?: 'small' | 'normal' | 'large';
    fluid?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    name?: string;
    targetInputName?: string;
    inputId?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
/* ==================== AURA SELECTBUTTON ==================== */
.laughtale-selectbutton,
.p-selectbutton {
    display: inline-flex;
    user-select: none;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    vertical-align: middle;
}

.p-selectbutton.p-selectbutton-fluid {
    display: flex;
    width: 100%;
}

.p-selectbutton.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
}

/* Button Item */
.p-selectbutton-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    color: var(--lt-text-primary);
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25;
    cursor: pointer;
    outline: none;
    box-sizing: border-box;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease, box-shadow 150ms ease, z-index 150ms ease;
    margin-left: -1px;
}

.p-selectbutton-fluid .p-selectbutton-item {
    flex: 1 1 0;
}

.p-selectbutton-item:first-child {
    margin-left: 0;
    border-top-left-radius: var(--lt-radius);
    border-bottom-left-radius: var(--lt-radius);
}

.p-selectbutton-item:last-child {
    border-top-right-radius: var(--lt-radius);
    border-bottom-right-radius: var(--lt-radius);
}

.p-selectbutton-item:hover:not(.p-disabled):not(.is-selected) {
    background: var(--lt-surface-100);
    border-color: var(--lt-surface-400);
    z-index: 2;
}

.p-selectbutton-item:focus-visible:not(.p-disabled) {
    border-color: var(--lt-primary-500) !important;
    box-shadow: 0 0 0 1px var(--lt-primary-500) !important;
    z-index: 3;
}

/* Selected State */
.p-selectbutton-item.is-selected {
    background: var(--lt-primary-50);
    border-color: var(--lt-primary-500);
    color: var(--lt-primary-700);
    font-weight: 600;
    z-index: 2;
}

.p-selectbutton-item.is-selected:hover:not(.p-disabled) {
    background: var(--lt-primary-100);
}

/* Disabled Option */
.p-selectbutton-item.p-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--lt-surface-100);
}

/* Sizes */
.p-selectbutton.size-small .p-selectbutton-item,
.p-selectbutton.p-selectbutton-sm .p-selectbutton-item {
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
}

.p-selectbutton.size-large .p-selectbutton-item,
.p-selectbutton.p-selectbutton-lg .p-selectbutton-item {
    padding: 0.75rem 1.25rem;
    font-size: 1.0625rem;
}

/* Invalid State */
.p-selectbutton.is-invalid .p-selectbutton-item {
    border-color: var(--p-red-500, var(--lt-danger-500)) !important;
}
.p-selectbutton.is-invalid .p-selectbutton-item:focus-visible {
    box-shadow: 0 0 0 1px var(--p-red-500, var(--lt-danger-500)) !important;
}

/* Badges */
.p-selectbutton-badge {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    background: var(--lt-surface-200);
    color: var(--lt-surface-700);
}
.p-selectbutton-item.is-selected .p-selectbutton-badge {
    background: var(--lt-primary-200);
    color: var(--lt-primary-800);
}

/* ==================== DARK MODE ==================== */
html.dark .p-selectbutton-item,
[data-theme="dark"] .p-selectbutton-item,
.dark .p-selectbutton-item {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    color: var(--p-text-color);
}
html.dark .p-selectbutton-item:hover:not(.p-disabled):not(.is-selected),
[data-theme="dark"] .p-selectbutton-item:hover:not(.p-disabled):not(.is-selected),
.dark .p-selectbutton-item:hover:not(.p-disabled):not(.is-selected) {
    background: var(--p-surface-100);
    border-color: var(--p-surface-400);
}
html.dark .p-selectbutton-item.is-selected,
[data-theme="dark"] .p-selectbutton-item.is-selected,
.dark .p-selectbutton-item.is-selected {
    background: rgba(16, 185, 129, 0.16);
    border-color: var(--p-primary-500);
    color: var(--p-primary-300);
}
html.dark .p-selectbutton-item.is-selected:hover:not(.p-disabled),
[data-theme="dark"] .p-selectbutton-item.is-selected:hover:not(.p-disabled),
.dark .p-selectbutton-item.is-selected:hover:not(.p-disabled) {
    background: rgba(16, 185, 129, 0.24);
    color: var(--p-primary-200);
}
html.dark .p-selectbutton-item.p-disabled,
[data-theme="dark"] .p-selectbutton-item.p-disabled,
.dark .p-selectbutton-item.p-disabled {
    background: var(--p-surface-100);
    border-color: var(--p-border-color);
    color: var(--p-text-muted);
}
html.dark .p-selectbutton-badge,
[data-theme="dark"] .p-selectbutton-badge,
.dark .p-selectbutton-badge {
    background: var(--p-surface-100);
    color: var(--p-text-muted);
}
html.dark .p-selectbutton-item.is-selected .p-selectbutton-badge,
[data-theme="dark"] .p-selectbutton-item.is-selected .p-selectbutton-badge,
.dark .p-selectbutton-item.is-selected .p-selectbutton-badge {
    background: rgba(16, 185, 129, 0.25);
    color: var(--p-primary-200);
}
`;

export default function SelectButtonIsland(container: HTMLElement, props: SelectButtonProps, ctx?: IslandContext) {
    injectIslandStyle('laughtale-selectbutton', CSS);

    const isMultiple = props.multiple === true || String(props.multiple) === 'true';
    const isUnselectable = props.unselectable !== false && String(props.unselectable) !== 'false';
    const isFluid = props.fluid === true || String(props.fluid) === 'true';
    const isInvalid = props.invalid === true || String(props.invalid) === 'true';
    const isDisabled = props.disabled === true || String(props.disabled) === 'true';
    const size = props.size || 'normal';

    const rawOptions = props.options || props.items || [];
    const normalizedOptions: SelectButtonOption[] = rawOptions.map(opt => {
        if (typeof opt === 'string') {
            return { label: opt, value: opt };
        }
        return {
            ...opt,
            label: opt.label || opt.name || opt.justify || String(opt.value),
            disabled: opt.disabled || opt.constant
        };
    });

    let selectedValues: any[] = [];
    const initVal = props.value ?? props.selectedValue ?? props.values;
    if (initVal !== undefined && initVal !== null) {
        if (Array.isArray(initVal)) {
            selectedValues = [...initVal];
        } else if (typeof initVal === 'string' && initVal.includes(',') && isMultiple) {
            selectedValues = initVal.split(',').map(s => s.trim());
        } else {
            selectedValues = [initVal];
        }
    }

    function isSelected(val: any): boolean {
        return selectedValues.some(v => String(v) === String(val));
    }

    function render() {
        const rootClasses = [
            'laughtale-selectbutton',
            'p-selectbutton',
            isFluid ? 'p-selectbutton-fluid' : '',
            size !== 'normal' ? `size-${size}` : '',
            isInvalid ? 'is-invalid' : '',
            isDisabled ? 'is-disabled' : ''
        ].filter(Boolean).join(' ');

        container.className = rootClasses;
        container.setAttribute('role', isMultiple ? 'group' : 'radiogroup');
        if (props.inputId) container.setAttribute('id', props.inputId);

        const buttonsHtml = normalizedOptions.map((opt, idx) => {
            const active = isSelected(opt.value);
            const optDis = isDisabled || opt.disabled;
            const btnClasses = [
                'p-selectbutton-item',
                active ? 'is-selected' : '',
                optDis ? 'p-disabled' : ''
            ].filter(Boolean).join(' ');

            const flagHtml = opt.flag ? html`<span style="font-size: 1.125rem; line-height: 1;">${opt.flag}</span>` : '';
            const iconHtml = opt.icon ? html`<span style="display: flex;">${unsafe(getLucideIcon(opt.icon, 16))}</span>` : '';
            const badgeHtml = opt.badge !== undefined ? html`<span class="p-selectbutton-badge" data-part="root">${opt.badge}</span>` : '';

            return html`
                <button 
                    type="button" 
                    class="${btnClasses}" 
                    data-value="${opt.value}"
                    ${attr('disabled', optDis)}
                    role="${isMultiple ? 'checkbox' : 'radio'}"
                    aria-checked="${active ? 'true' : 'false'}"
                    tabindex="${optDis ? '-1' : '0'}"
                >
                    ${flagHtml}
                    ${iconHtml}
                    <span>${opt.label}</span>
                    ${badgeHtml}
                </button>
            `;
        });

        setHtml(container, html`
            ${buttonsHtml}
            <input type="hidden"${attr('name', props.name || props.targetInputName)} value="${selectedValues.join(',')}" />
        `);

        bindEvents();
    }

    function bindEvents() {
        const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>('.p-selectbutton-item:not(.p-disabled)'));
        if (buttons.length > 0) {
            const activeIdx = Math.max(0, buttons.findIndex(b => b.classList.contains('is-selected')));
            setRovingTabindex(buttons, activeIdx);

            const nav = useKeyboardNav({
                itemCount: () => buttons.length,
                initialIndex: activeIdx,
                orientation: 'horizontal',
                onHighlight: (index) => {
                    setRovingTabindex(buttons, index);
                    buttons[index]?.focus();
                },
                onSelect: (index) => {
                    buttons[index]?.click();
                }
            });

            container.onkeydown = (e) => {
                if (nav.handleKeyDown(e)) return;
                const idx = Math.max(0, buttons.indexOf(document.activeElement as HTMLButtonElement));
                handleRovingKeydown(e, buttons, idx, 'horizontal');
            };
        }

        buttons.forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                const val = btn.getAttribute('data-value');
                if (val === null) return;

                if (isMultiple) {
                    if (isSelected(val)) {
                        selectedValues = selectedValues.filter(v => String(v) !== String(val));
                    } else {
                        selectedValues.push(val);
                    }
                } else {
                    if (isSelected(val)) {
                        if (isUnselectable) {
                            selectedValues = [];
                        }
                    } else {
                        selectedValues = [val];
                    }
                }

                render();
                syncValue();
            };
        });
    }

    function syncValue() {
        const payload = isMultiple ? selectedValues : (selectedValues[0] ?? null);
        const hiddenInp = container.querySelector<HTMLInputElement>('input[type="hidden"]');
        if (hiddenInp) hiddenInp.value = selectedValues.join(',');

        emitComponentEvent(container, 'select-button', 'change', { value: payload });
    }

    render();
}
