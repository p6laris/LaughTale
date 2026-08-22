import { injectIslandStyle } from '../runtime/styles';
import { LucideIcons } from '../icons/lucide';

export interface InputTextProps {
    value?: string;
    placeholder?: string;
    type?: string;
    iconLeft?: string;
    iconRight?: string;
    showClear?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    targetInputName?: string;
}

const CSS = `
.laughtale-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
}
.laughtale-input {
    width: 100%;
    background: var(--p-surface-0);
    border: 1px solid var(--p-field-border, var(--p-surface-300));
    border-radius: var(--p-border-radius, 0.5rem);
    color: var(--p-text-color);
    font-family: inherit;
    transition: all 0.15s ease;
    outline: none;
}
.laughtale-input-sm { padding: 0.375rem 0.5rem; font-size: 0.75rem; }
.laughtale-input-md { padding: 0.5rem 0.75rem; font-size: 0.875rem; }
.laughtale-input-lg { padding: 0.75rem 1rem; font-size: 1rem; }

.laughtale-input:hover:not(:disabled):not(.is-invalid) {
    border-color: var(--p-primary-400);
}
.laughtale-input:focus-visible:not(:disabled):not(.is-invalid) {
    box-shadow: 0 0 0 2px var(--p-content-bg), 0 0 0 4px var(--p-primary-500);
    border-color: var(--p-primary-500);
}
.laughtale-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--p-surface-100);
}
.laughtale-input.is-invalid {
    border-color: #ef4444;
}
.laughtale-input.is-invalid:focus-visible {
    box-shadow: 0 0 0 2px var(--p-content-bg), 0 0 0 4px rgba(239, 68, 68, 0.5);
}
.laughtale-input-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: var(--p-surface-400);
    display: flex;
    pointer-events: none;
}
.laughtale-input-icon-left { left: 0.75rem; }
.laughtale-input-icon-right { right: 0.75rem; }

.has-icon-left .laughtale-input { padding-left: 2.25rem; }
.has-icon-right .laughtale-input { padding-right: 2.25rem; }

.laughtale-input-clear {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: var(--p-surface-400);
    cursor: pointer;
    display: flex;
    padding: 0.125rem;
    border-radius: 50%;
}
.laughtale-input-clear:hover {
    background: var(--p-surface-100);
    color: var(--p-surface-600);
}
.has-clear .laughtale-input { padding-right: 2.25rem; }
.has-icon-right.has-clear .laughtale-input { padding-right: 3.5rem; }
.has-icon-right.has-clear .laughtale-input-clear { right: 2.25rem; }
`;

export default function InputTextIsland(container: HTMLElement, props: InputTextProps) {
    injectIslandStyle('laughtale-input-text', CSS);
    
    let currentValue = props.value || '';
    
    function render() {
        const sizeClass = 'laughtale-input-' + props.size || 'md';
        const wrapClasses = [
            'laughtale-input-wrap',
            props.iconLeft ? 'has-icon-left' : '',
            props.iconRight ? 'has-icon-right' : '',
            (props.showClear && currentValue) ? 'has-clear' : ''
        ].filter(Boolean).join(' ');

        container.innerHTML = `
            <div class="${wrapClasses}">
                ${props.iconLeft ? '<span class="laughtale-input-icon laughtale-input-icon-left">' + (LucideIcons as any)[props.iconLeft] || '' + '</span>' : ''}
                <input 
                    type="${props.type || 'text'}"
                    class="laughtale-input ${sizeClass} ${props.invalid ? 'is-invalid' : ''}"
                    value="${currentValue}"
                    placeholder="${props.placeholder || ''}"
                    ${props.disabled ? 'disabled' : ''}
                />
                ${(props.showClear && currentValue) ? '<button type="button" class="laughtale-input-clear">' + LucideIcons.x + '</button>' : ''}
                ${props.iconRight ? '<span class="laughtale-input-icon laughtale-input-icon-right">' + (LucideIcons as any)[props.iconRight] || '' + '</span>' : ''}
            </div>
        `;
        
        bindEvents();
        syncValue();
    }
    
    function bindEvents() {
        const input = container.querySelector('input')!;
        const clearBtn = container.querySelector('.laughtale-input-clear');
        
        input.addEventListener('input', () => {
            const oldHasValue = !!currentValue;
            currentValue = input.value;
            const newHasValue = !!currentValue;
            syncValue();
            
            if (props.showClear && (oldHasValue !== newHasValue)) {
                render();
                const newInput = container.querySelector('input')!;
                newInput.focus();
                newInput.setSelectionRange(currentValue.length, currentValue.length);
            }
        });
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                currentValue = '';
                render();
                container.querySelector('input')?.focus();
            });
        }
    }
    
    function syncValue() {
        if (props.targetInputName) {
            let hidden = container.querySelector<HTMLInputElement>('input[name="' + props.targetInputName + '"]');
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = currentValue;
        }
    }
    
    render();
}
