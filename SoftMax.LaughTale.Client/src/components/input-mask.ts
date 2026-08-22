import { injectIslandStyle } from '../runtime/styles';

export interface InputMaskProps {
    mask: string;
    value?: string;
    placeholder?: string;
    slotChar?: string;
    disabled?: boolean;
    targetInputName?: string;
}

const CSS = `
.laughtale-input-mask {
    width: 100%;
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-field-border, var(--p-surface-300));
    border-radius: var(--p-border-radius, 0.5rem);
    color: var(--p-text-color);
    font-size: 0.875rem;
    font-family: inherit;
    transition: all 0.15s ease;
    outline: none;
}
.laughtale-input-mask:hover:not(:disabled) {
    border-color: var(--p-primary-400);
}
.laughtale-input-mask:focus-visible:not(:disabled) {
    box-shadow: 0 0 0 2px var(--p-content-bg), 0 0 0 4px var(--p-primary-500);
    border-color: var(--p-primary-500);
}
.laughtale-input-mask:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--p-surface-100);
}
[data-theme="dark"] .laughtale-input-mask {
    background: var(--p-surface-900);
    color: var(--p-surface-100);
    border-color: var(--p-surface-600);
}
[data-theme="dark"] .laughtale-input-mask:disabled {
    background: var(--p-surface-800);
}
`;

export default function InputMaskIsland(container: HTMLElement, props: InputMaskProps) {
    injectIslandStyle('laughtale-input-mask', CSS);
    
    const mask = props.mask;
    const slotChar = props.slotChar || '_';
    let rawValue = props.value || '';
    
    // Mask characters definitions
    const defs: Record<string, RegExp> = {
        '9': /[0-9]/,
        'a': /[A-Za-z]/,
        '*': /[A-Za-z0-9]/
    };

    function format(val: string) {
        let result = '';
        let valIndex = 0;
        
        for (let i = 0; i < mask.length; i++) {
            const m = mask[i];
            if (defs[m]) {
                if (valIndex < val.length) {
                    if (defs[m].test(val[valIndex])) {
                        result += val[valIndex];
                        valIndex++;
                    } else {
                        // Skip invalid char
                        valIndex++;
                        i--; // Retry this mask char
                    }
                } else {
                    result += slotChar;
                }
            } else {
                result += m;
                if (valIndex < val.length && val[valIndex] === m) {
                    valIndex++;
                }
            }
        }
        return result;
    }

    let currentValue = format(rawValue);
    
    function render() {
        container.innerHTML = `
            <input 
                type="text"
                class="laughtale-input-mask"
                value="${currentValue}"
                placeholder="${props.placeholder || format('')}"
                ${props.disabled ? 'disabled' : ''}
            />
        `;
        
        bindEvents();
        syncValue();
    }
    
    function bindEvents() {
        const input = container.querySelector('input')!;
        
        input.addEventListener('input', (e) => {
            // Strip format characters to get raw text
            // Simple approach: remove any non-alphanumeric depending on mask, or just remove slot chars
            const val = input.value.replace(new RegExp('[\\\\' + slotChar + ']', 'g'), '');
            const unmasked = Array.from(val).join('');
            
            currentValue = format(unmasked);
            if (input.value !== currentValue) {
                input.value = currentValue;
            }
            
            // Advance cursor to first slot char
            const firstSlot = currentValue.indexOf(slotChar);
            const cursorPos = firstSlot !== -1 ? firstSlot : currentValue.length;
            input.setSelectionRange(cursorPos, cursorPos);
            
            syncValue();
        });
        
        input.addEventListener('focus', () => {
            if (input.value === format('')) {
                const firstSlot = input.value.indexOf(slotChar);
                const cursorPos = firstSlot !== -1 ? firstSlot : 0;
                setTimeout(() => input.setSelectionRange(cursorPos, cursorPos), 0);
            }
        });
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
            hidden.value = currentValue.replace(new RegExp('[\\\\' + slotChar + ']', 'g'), '');
        }
    }
    
    render();
}
