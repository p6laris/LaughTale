/**
 * SoftMax.LaughTale: Enterprise Number & Currency Input Component (Aura InputNumber inspired)
 */

import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';

export interface InputNumberProps {
    targetInputName?: string;
    value?: number;
    mode?: 'decimal' | 'currency' | 'percent';
    currency?: string; // 'USD', 'EUR', 'IQD', etc.
    prefix?: string;
    suffix?: string;
    min?: number;
    max?: number;
    step?: number;
    decimals?: number;
    showButtons?: boolean;
    placeholder?: string;
    disabled?: boolean;
}


const CSS = `
[data-theme="dark"] .laughtale-input-number {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .number-display-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-step-up {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-step-down {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;

export default function InputNumberIsland(container: HTMLElement, props: InputNumberProps) {
    injectIslandStyle('input-number', CSS);
    let rawValue: number | null = props.value !== undefined ? Number(props.value) : null;
    const step = props.step || 1;
    const decimals = props.decimals !== undefined ? props.decimals : props.mode === 'currency' ? 2 : 0;
    const prefix = props.prefix || (props.mode === 'currency' ? (props.currency === 'EUR' ? '€ ' : props.currency === 'IQD' ? 'IQD ' : '$ ') : '');
    const suffix = props.suffix || (props.mode === 'percent' ? ' %' : '');

    function formatNumber(val: number | null): string {
        if (val === null || isNaN(val)) return '';
        const parts = val.toFixed(decimals).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `${prefix}${parts.join('.')}${suffix}`;
    }

    function parseRaw(str: string): number | null {
        let cleaned = str.replace(new RegExp(`[${prefix}${suffix},]`, 'g'), '').trim();
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? null : parsed;
    }

    function render() {
        container.innerHTML = `
            <div class="laughtale-input-number" style="display: inline-flex; align-items: stretch; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); overflow: hidden; transition: border-color 0.2s ease, box-shadow 0.2s ease; width: 100%; max-width: 320px;">
                <input type="text" class="number-display-input" value="${formatNumber(rawValue)}" placeholder="${props.placeholder || ''}" ${props.disabled ? 'disabled' : ''} style="flex: 1; padding: 0.5rem 0.75rem; border: none; outline: none; background: transparent; font-family: var(--p-font-family); font-size: 0.875rem; color: var(--p-text-color); font-variant-numeric: tabular-nums;" />
                
                ${props.showButtons !== false ? `
                    <div style="display: flex; flex-direction: column; border-left: 1px solid var(--p-border-color); width: 2rem;">
                        <button type="button" class="btn-step-up" style="flex: 1; border: none; background: var(--p-surface-50); color: var(--p-surface-600); cursor: pointer; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--p-border-color); transition: background 0.15s ease;">
                            ${LucideIcons.chevronUp}
                        </button>
                        <button type="button" class="btn-step-down" style="flex: 1; border: none; background: var(--p-surface-50); color: var(--p-surface-600); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s ease;">
                            ${LucideIcons.chevronDown}
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        const displayInput = container.querySelector<HTMLInputElement>('.number-display-input')!;

        // Focus ring styling
        displayInput.addEventListener('focus', () => {
            const wrap = container.querySelector<HTMLElement>('.laughtale-input-number');
            if (wrap) {
                wrap.style.borderColor = 'var(--p-primary-600)';
                wrap.style.boxShadow = '0 0 0 1px var(--p-primary-600)';
            }
        });

        displayInput.addEventListener('blur', () => {
            const wrap = container.querySelector<HTMLElement>('.laughtale-input-number');
            if (wrap) {
                wrap.style.borderColor = 'var(--p-border-color)';
                wrap.style.boxShadow = 'none';
            }
            displayInput.value = formatNumber(rawValue);
        });

        displayInput.addEventListener('input', () => {
            rawValue = parseRaw(displayInput.value);
            syncValue();
        });

        // Step buttons
        container.querySelector('.btn-step-up')?.addEventListener('click', () => {
            rawValue = (rawValue ?? 0) + step;
            if (props.max !== undefined && rawValue > props.max) rawValue = props.max;
            displayInput.value = formatNumber(rawValue);
            syncValue();
        });

        container.querySelector('.btn-step-down')?.addEventListener('click', () => {
            rawValue = (rawValue ?? 0) - step;
            if (props.min !== undefined && rawValue < props.min) rawValue = props.min;
            displayInput.value = formatNumber(rawValue);
            syncValue();
        });
    }

    function syncValue() {
        if (props.targetInputName) {
            let hidden = document.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = rawValue !== null ? rawValue.toString() : '';
        }

        container.dispatchEvent(new CustomEvent('number:change', {
            bubbles: true,
            detail: { value: rawValue }
        }));
    }

    render();
    syncValue();
}
