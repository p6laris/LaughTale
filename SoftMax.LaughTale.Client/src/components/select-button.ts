import { injectIslandStyle } from '../runtime/styles';
/**
 * SoftMax.LaughTale: Enterprise SelectButton Component (Aura SelectButton inspired)
 */

export interface SelectButtonItem {
    label: string;
    value: string;
    icon?: string;
}

export interface SelectButtonProps {
    targetInputName?: string;
    items: SelectButtonItem[];
    value?: string;
    multiple?: boolean;
    disabled?: boolean;
}


const CSS = `
[data-theme="dark"] .select-btn-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-select-button {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;

export default function SelectButtonIsland(container: HTMLElement, props: SelectButtonProps) {
    injectIslandStyle('select-button', CSS);
    let selectedValue = props.value || props.items[0]?.value || '';

    function render() {
        const buttons = props.items.map((item) => {
            const isSelected = selectedValue === item.value;
            return `
                <button type="button" 
                        class="select-btn-item" 
                        data-value="${item.value}" 
                        ${props.disabled ? 'disabled' : ''} 
                        style="padding: 0.45rem 1rem; border: none; background: ${isSelected ? 'var(--p-surface-950)' : 'transparent'}; color: ${isSelected ? '#ffffff' : 'var(--p-surface-700)'}; font-size: 0.8125rem; font-weight: ${isSelected ? '600' : '500'}; border-radius: var(--p-border-radius); cursor: ${props.disabled ? 'not-allowed' : 'pointer'}; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 0.35rem;">
                    ${item.icon ? `<span>${item.icon}</span>` : ''}
                    <span>${item.label}</span>
                </button>
            `;
        }).join('');

        container.innerHTML = `
            <div class="laughtale-select-button" style="display: inline-flex; background: var(--p-surface-100); padding: 0.25rem; border-radius: var(--p-border-radius-lg); border: 1px solid var(--p-border-color); gap: 0.25rem;">
                ${buttons}
            </div>
        `;

        if (props.disabled) return;

        container.querySelectorAll('.select-btn-item').forEach((btn) => {
            btn.addEventListener('click', () => {
                selectedValue = btn.getAttribute('data-value')!;
                render();
                syncValue();
            });
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
            hidden.value = selectedValue;
        }

        container.dispatchEvent(new CustomEvent('selectbutton:change', {
            bubbles: true,
            detail: { value: selectedValue }
        }));
    }

    render();
}
