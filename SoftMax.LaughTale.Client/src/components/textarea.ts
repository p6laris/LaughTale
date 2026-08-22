import { injectIslandStyle } from '../runtime/styles';

export interface TextareaProps {
    value?: string;
    placeholder?: string;
    rows?: number;
    maxLength?: number;
    autoResize?: boolean;
    disabled?: boolean;
    targetInputName?: string;
}

const CSS = `
.laughtale-textarea-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
}
.laughtale-textarea {
    width: 100%;
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-field-border, var(--p-surface-300));
    border-radius: var(--p-border-radius, 0.5rem);
    color: var(--p-text-color);
    font-size: 0.875rem;
    font-family: inherit;
    resize: vertical;
    transition: all 0.15s ease;
    outline: none;
    line-height: 1.5;
}
.laughtale-textarea:hover:not(:disabled) {
    border-color: var(--p-primary-400);
}
.laughtale-textarea:focus-visible:not(:disabled) {
    box-shadow: 0 0 0 2px var(--p-content-bg), 0 0 0 4px var(--p-primary-500);
    border-color: var(--p-primary-500);
}
.laughtale-textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--p-surface-100);
}
.laughtale-textarea-counter {
    font-size: 0.75rem;
    color: var(--p-surface-500);
    text-align: right;
}
[data-theme="dark"] .laughtale-textarea {
    background: var(--p-surface-900);
    color: var(--p-surface-100);
    border-color: var(--p-surface-600);
}
[data-theme="dark"] .laughtale-textarea:disabled {
    background: var(--p-surface-800);
}
`;

export default function TextareaIsland(container: HTMLElement, props: TextareaProps) {
    injectIslandStyle('laughtale-textarea', CSS);
    
    let currentValue = props.value || '';
    
    function render() {
        container.innerHTML = `
            <div class="laughtale-textarea-wrap">
                <textarea 
                    class="laughtale-textarea"
                    rows="${props.rows || 3}"
                    ${props.maxLength ? 'maxlength="' + props.maxLength + '"' : ''}
                    placeholder="${props.placeholder || ''}"
                    ${props.disabled ? 'disabled' : ''}
                    ${props.autoResize ? 'style="overflow:hidden; resize:none;"' : ''}
                >${currentValue}</textarea>
                ${props.maxLength ? `
                    <div class="laughtale-textarea-counter">
                        <span class="laughtale-char-count">${currentValue.length}</span> / ${props.maxLength}
                    </div>
                ` : ''}
            </div>
        `;
        
        bindEvents();
        syncValue();
        if (props.autoResize) autoResize();
    }
    
    function bindEvents() {
        const textarea = container.querySelector('.laughtale-textarea') as HTMLTextAreaElement;
        const counter = container.querySelector('.laughtale-char-count');
        
        textarea.addEventListener('input', () => {
            currentValue = textarea.value;
            if (counter) counter.textContent = currentValue.length.toString();
            if (props.autoResize) autoResize();
            syncValue();
        });
    }
    
    function autoResize() {
        const textarea = container.querySelector('.laughtale-textarea') as HTMLTextAreaElement;
        if (textarea && props.autoResize) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
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
