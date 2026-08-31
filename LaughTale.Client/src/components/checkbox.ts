import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise Checkbox Component (Aura Checkbox)
 * Accessible, theme-aware tri-state checkbox with LaughTale Core spring micro-interactions.
 * Integrates with Theme Studio tokens and full dark mode support.
 */

import { injectIslandStyle } from '../runtime/styles';
import { LucideIcons } from '../icons/lucide';

export interface CheckboxProps {
    checked?: boolean;
    indeterminate?: boolean;
    binary?: boolean;
    label?: string;
    value?: string;
    name?: string;
    inputId?: string;
    disabled?: boolean;
    invalid?: boolean;
    size?: 'small' | 'normal' | 'large';
    variant?: 'outlined' | 'filled';
    targetInputName?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
.laughtale-checkbox-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
    font-family: var(--p-font-family, inherit);
    vertical-align: middle;
}
.laughtale-checkbox-wrap.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
}

.laughtale-checkbox-box {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: calc(var(--lt-radius) - 2px);
    transition: background 150ms cubic-bezier(0.4, 0, 0.2, 1), 
                border-color 150ms ease, 
                box-shadow 150ms ease;
    box-sizing: border-box;
    flex-shrink: 0;
    color: var(--lt-surface-0, var(--lt-surface-0));
}

/* Variants */
.laughtale-checkbox-wrap.variant-filled .laughtale-checkbox-box {
    background: var(--lt-surface-50);
}

/* Sizes */
.laughtale-checkbox-wrap.size-small .laughtale-checkbox-box {
    width: 1rem;
    height: 1rem;
    border-radius: calc(var(--lt-radius) - 3px);
}
.laughtale-checkbox-wrap.size-small .laughtale-checkbox-icon {
    width: 10px;
    height: 10px;
}
.laughtale-checkbox-wrap.size-small .laughtale-checkbox-label {
    font-size: 0.8125rem;
}

.laughtale-checkbox-wrap.size-normal .laughtale-checkbox-box {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: calc(var(--lt-radius) - 2px);
}
.laughtale-checkbox-wrap.size-normal .laughtale-checkbox-icon {
    width: 12px;
    height: 12px;
}
.laughtale-checkbox-wrap.size-normal .laughtale-checkbox-label {
    font-size: 0.875rem;
}

.laughtale-checkbox-wrap.size-large .laughtale-checkbox-box {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: calc(var(--lt-radius) - 1px);
}
.laughtale-checkbox-wrap.size-large .laughtale-checkbox-icon {
    width: 15px;
    height: 15px;
}
.laughtale-checkbox-wrap.size-large .laughtale-checkbox-label {
    font-size: 1rem;
}

/* Hover States */
.laughtale-checkbox-wrap:hover:not(.disabled) .laughtale-checkbox-box {
    border-color: var(--lt-primary-500);
}
.laughtale-checkbox-wrap:hover:not(.disabled).checked .laughtale-checkbox-box,
.laughtale-checkbox-wrap:hover:not(.disabled).indeterminate .laughtale-checkbox-box {
    background: var(--lt-primary-600);
    border-color: var(--lt-primary-600);
}

/* Focus States (LaughTale Core Focus Ring) */
.laughtale-checkbox-wrap:focus-within:not(.disabled) .laughtale-checkbox-box {
    box-shadow: 0 0 0 1px var(--lt-surface-0), 0 0 0 3px var(--lt-primary-500);
    border-color: var(--lt-primary-500);
}

/* Checked & Indeterminate States */
.laughtale-checkbox-wrap.checked .laughtale-checkbox-box,
.laughtale-checkbox-wrap.indeterminate .laughtale-checkbox-box {
    background: var(--lt-primary-500);
    border-color: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
}

/* Invalid State */
.laughtale-checkbox-wrap.invalid .laughtale-checkbox-box {
    border-color: var(--lt-danger-500, var(--lt-danger-500)) !important;
}
.laughtale-checkbox-wrap.invalid:focus-within:not(.disabled) .laughtale-checkbox-box {
    box-shadow: 0 0 0 1px var(--lt-surface-0), 0 0 0 3px var(--lt-danger-500, var(--lt-danger-500));
}

/* Icon Micro-Interaction */
.laughtale-checkbox-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(0);
    opacity: 0;
    transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms ease;
}
.laughtale-checkbox-wrap.checked .laughtale-checkbox-icon,
.laughtale-checkbox-wrap.indeterminate .laughtale-checkbox-icon {
    transform: scale(1);
    opacity: 1;
}

.laughtale-checkbox-label {
    color: var(--lt-text-primary);
    font-weight: 500;
    transition: color 150ms ease;
}

.laughtale-checkbox-hidden {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
    pointer-events: none;
}

/* Dark Mode Tokens */
html.dark .laughtale-checkbox-box,
[data-theme="dark"] .laughtale-checkbox-box,
.dark .laughtale-checkbox-box {
    background: var(--p-surface-0, #090d16);
    border-color: var(--p-border-color, #334155);
}
html.dark .laughtale-checkbox-wrap.variant-filled .laughtale-checkbox-box,
[data-theme="dark"] .laughtale-checkbox-wrap.variant-filled .laughtale-checkbox-box,
.dark .laughtale-checkbox-wrap.variant-filled .laughtale-checkbox-box {
    background: var(--p-surface-100, #1e293b);
}
html.dark .laughtale-checkbox-wrap:hover:not(.disabled) .laughtale-checkbox-box,
[data-theme="dark"] .laughtale-checkbox-wrap:hover:not(.disabled) .laughtale-checkbox-box,
.dark .laughtale-checkbox-wrap:hover:not(.disabled) .laughtale-checkbox-box {
    border-color: var(--p-primary-400, #34d399);
}
html.dark .laughtale-checkbox-wrap.checked .laughtale-checkbox-box,
html.dark .laughtale-checkbox-wrap.indeterminate .laughtale-checkbox-box,
[data-theme="dark"] .laughtale-checkbox-wrap.checked .laughtale-checkbox-box,
[data-theme="dark"] .laughtale-checkbox-wrap.indeterminate .laughtale-checkbox-box,
.dark .laughtale-checkbox-wrap.checked .laughtale-checkbox-box,
.dark .laughtale-checkbox-wrap.indeterminate .laughtale-checkbox-box {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}
html.dark .laughtale-checkbox-wrap:hover:not(.disabled).checked .laughtale-checkbox-box,
html.dark .laughtale-checkbox-wrap:hover:not(.disabled).indeterminate .laughtale-checkbox-box,
[data-theme="dark"] .laughtale-checkbox-wrap:hover:not(.disabled).checked .laughtale-checkbox-box,
[data-theme="dark"] .laughtale-checkbox-wrap:hover:not(.disabled).indeterminate .laughtale-checkbox-box,
.dark .laughtale-checkbox-wrap:hover:not(.disabled).checked .laughtale-checkbox-box,
.dark .laughtale-checkbox-wrap:hover:not(.disabled).indeterminate .laughtale-checkbox-box {
    background: var(--p-primary-400, #34d399);
    border-color: var(--p-primary-400, #34d399);
}
html.dark .laughtale-checkbox-wrap:focus-within:not(.disabled) .laughtale-checkbox-box,
[data-theme="dark"] .laughtale-checkbox-wrap:focus-within:not(.disabled) .laughtale-checkbox-box,
.dark .laughtale-checkbox-wrap:focus-within:not(.disabled) .laughtale-checkbox-box {
    box-shadow: 0 0 0 1px var(--p-surface-0, #090d16), 0 0 0 3px var(--p-primary-500);
}
html.dark .laughtale-checkbox-label,
[data-theme="dark"] .laughtale-checkbox-label,
.dark .laughtale-checkbox-label {
    color: var(--p-text-color, #f8fafc);
}
`;

export default function CheckboxIsland(container: HTMLElement, props: CheckboxProps, ctx?: IslandContext) {
    injectIslandStyle('laughtale-checkbox', CSS);
    
    let isChecked = Boolean(props.checked);
    let isIndeterminate = Boolean(props.indeterminate);
    const size = props.size || 'normal';
    const variant = props.variant || 'outlined';
    const inputId = props.inputId || `chk_${Math.random().toString(36).substring(2, 9)}`;

    function render() {
        const stateClass = isIndeterminate ? 'indeterminate' : (isChecked ? 'checked' : '');
        const iconSvg = isIndeterminate ? LucideIcons.minus : LucideIcons.check;

        container.innerHTML = `
            <label class="laughtale-checkbox-wrap size-${size} variant-${variant} ${stateClass} ${props.disabled ? 'disabled' : ''} ${props.invalid ? 'invalid' : ''}" 
                   for="${inputId}">
                <input type="checkbox" 
                       id="${inputId}" 
                       class="laughtale-checkbox-hidden" 
                       ${isChecked ? 'checked' : ''} 
                       ${props.disabled ? 'disabled' : ''} 
                       aria-checked="${isIndeterminate ? 'mixed' : (isChecked ? 'true' : 'false')}" 
                       role="checkbox" />
                <div class="laughtale-checkbox-box" tabindex="${props.disabled ? -1 : 0}">
                    <span class="laughtale-checkbox-icon">
                        ${iconSvg}
                    </span>
                </div>
                ${props.label ? `<span class="laughtale-checkbox-label">${props.label}</span>` : ''}
            </label>
        `;

        bindEvents();
        syncValue();
    }

    function bindEvents() {
        const input = container.querySelector<HTMLInputElement>(`#${inputId}`);
        const box = container.querySelector<HTMLElement>('.laughtale-checkbox-box');
        if (!input || props.disabled) return;

        input.addEventListener('change', () => {
            isChecked = input.checked;
            isIndeterminate = false;
            render();
            dispatchChangeEvent();
        });

        box?.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                input.click();
            }
        });
    }

    function dispatchChangeEvent() {
        container.dispatchEvent(new CustomEvent('checkbox:change', {
            bubbles: true,
            detail: {
                checked: isChecked,
                indeterminate: isIndeterminate,
                value: props.value || isChecked
            }
        }));
    }

    function syncValue() {
        const targetName = props.targetInputName || props.name;
        if (targetName) {
            let hidden = container.querySelector<HTMLInputElement>(`input[type="hidden"][name="${targetName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = targetName;
                container.appendChild(hidden);
            }
            hidden.value = isChecked ? (props.value || 'true') : 'false';
        }
    }

    render();
}
