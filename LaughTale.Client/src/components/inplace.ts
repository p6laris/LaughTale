import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'native',
    element: 'input'
};

/**
 * LaughTale: Enterprise Inplace / Click-to-Edit Component (Aura Design System compliant)
 * Seamless inline text-to-input morphing, auto-focus, keyboard accessibility (Enter/Escape),
 * save/cancel actions, and theme studio design tokens.
 */

export interface InplaceProps {
    value?: string;
    targetInputName?: string;
    placeholder?: string;
    disabled?: boolean;
    closable?: boolean;
    active?: boolean | string;
    class?: string;
    style?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const INPLACE_CSS = `
island-inplace,
p-inplace {
    display: inline-flex !important;
}

.p-inplace {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    font-family: var(--p-font-family, inherit);
}

.p-inplace-display {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: var(--p-inplace-display-padding, 0.375rem 0.75rem);
    border-radius: var(--p-inplace-display-border-radius, var(--p-border-radius, 6px));
    border: 1px dashed var(--p-border-color, #cbd5e1);
    background: var(--p-surface-50, #f8fafc);
    color: var(--p-text-color, #1e293b);
    cursor: pointer;
    user-select: none;
    transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.p-inplace-display:hover:not(.p-disabled) {
    background: var(--p-surface-100, #f1f5f9);
    border-color: var(--p-primary-500, #10b981);
}

.p-inplace-display:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--p-surface-0, #ffffff), 0 0 0 4px var(--p-primary-500, #10b981);
}

.p-inplace-display.p-disabled {
    cursor: default;
    opacity: 0.6;
    border-style: solid;
}

.p-inplace-display-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-text-muted, #94a3b8);
    width: 0.875rem;
    height: 0.875rem;
}

.p-inplace-content {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
}

.p-inplace-input {
    padding: 0.375rem 0.625rem;
    border: 1px solid var(--p-primary-500, #10b981);
    border-radius: var(--p-border-radius, 6px);
    font-size: 0.875rem;
    font-family: inherit;
    background: var(--p-surface-0, #ffffff);
    color: var(--p-text-color, #1e293b);
    outline: none;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--p-primary-color, #10b981) 20%, transparent);
    box-sizing: border-box;
}

.p-inplace-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.375rem;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid transparent;
    cursor: pointer;
    transition: background-color 150ms ease, border-color 150ms ease;
    line-height: 1;
}

.p-inplace-save-btn {
    background: var(--p-primary-color, #10b981);
    color: var(--p-primary-contrast-color, #ffffff);
    border-color: var(--p-primary-color, #10b981);
}

.p-inplace-save-btn:hover {
    background: var(--p-primary-hover-color, #059669);
}

.p-inplace-cancel-btn {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-text-muted, #64748b);
    border-color: var(--p-border-color, #cbd5e1);
}

.p-inplace-cancel-btn:hover {
    background: var(--p-surface-200, #e2e8f0);
    color: var(--p-text-color, #1e293b);
}

/* Dark Mode Tokens */
html.dark .p-inplace-display,
[data-theme="dark"] .p-inplace-display,
.dark .p-inplace-display {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-100, #f1f5f9);
}

html.dark .p-inplace-display:hover:not(.p-disabled),
[data-theme="dark"] .p-inplace-display:hover:not(.p-disabled),
.dark .p-inplace-display:hover:not(.p-disabled) {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-primary-500, #10b981);
}

html.dark .p-inplace-input,
[data-theme="dark"] .p-inplace-input,
.dark .p-inplace-input {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-primary-500, #10b981);
    color: var(--p-surface-100, #f1f5f9);
}

html.dark .p-inplace-cancel-btn,
[data-theme="dark"] .p-inplace-cancel-btn,
.dark .p-inplace-cancel-btn {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-300, #cbd5e1);
    border-color: var(--p-surface-700, #334155);
}

html.dark .p-inplace-cancel-btn:hover,
[data-theme="dark"] .p-inplace-cancel-btn:hover,
.dark .p-inplace-cancel-btn:hover {
    background: var(--p-surface-700, #334155);
    color: var(--p-surface-100, #f1f5f9);
}
`;

export default function InplaceIsland(container: HTMLElement, props: InplaceProps, ctx?: IslandContext) {
    injectIslandStyle('inplace', INPLACE_CSS);

    const initialActive = props.active === true || props.active === 'true';
    let isEditing = initialActive;
    let currentValue = props.value ?? container.textContent?.trim() ?? '';
    const placeholder = props.placeholder || 'Click to edit...';
    const isDisabled = props.disabled || false;
    const isClosable = props.closable !== false;

    function render() {
        if (!isEditing) {
            setHtml(container, html`
                <div class="p-inplace p-component ${props.class || ''}" style="${props.style || ''}">
                    <div class="p-inplace-display ${isDisabled ? 'p-disabled' : ''}" tabindex="${isDisabled ? '-1' : '0'}" role="button" aria-label="${currentValue || placeholder}">
                        <span>${currentValue || html`<span style="color: var(--p-text-muted); font-style: italic;">${placeholder}</span>`}</span>
                        ${!isDisabled ? html`<span class="p-inplace-display-icon">${unsafe(LucideIcons.edit)}</span>` : ''}
                    </div>
                </div>
            `);

            if (!isDisabled) {
                const displayEl = container.querySelector('.p-inplace-display');
                displayEl?.addEventListener('click', () => {
                    isEditing = true;
                    render();
                }, { signal: ctx?.signal });

                displayEl?.addEventListener('keydown', (e: Event) => {
                    const ke = e as KeyboardEvent;
                    if (ke.key === 'Enter' || ke.key === ' ') {
                        ke.preventDefault();
                        isEditing = true;
                        render();
                    }
                }, { signal: ctx?.signal });
            }
        } else {
            setHtml(container, html`
                <div class="p-inplace p-component ${props.class || ''}" style="${props.style || ''}">
                    <div class="p-inplace-content">
                        <input type="text" 
                               class="p-inplace-input" 
                               value="${currentValue}" 
                               placeholder="${placeholder}" />
                        <button type="button" class="p-inplace-action-btn p-inplace-save-btn" title="Save">
                            ${unsafe(LucideIcons.check)}
                        </button>
                        ${isClosable ? html`
                            <button type="button" class="p-inplace-action-btn p-inplace-cancel-btn" title="Cancel">
                                ${unsafe(LucideIcons.x)}
                            </button>
                        ` : ''}
                    </div>
                </div>
            `);

            const input = container.querySelector<HTMLInputElement>('.p-inplace-input')!;
            if (input) {
                input.focus();
                input.setSelectionRange(currentValue.length, currentValue.length);
            }

            container.querySelector('.p-inplace-save-btn')?.addEventListener('click', () => {
                currentValue = input?.value.trim() ?? '';
                isEditing = false;
                render();
                syncValue();
            }, { signal: ctx?.signal });

            container.querySelector('.p-inplace-cancel-btn')?.addEventListener('click', () => {
                isEditing = false;
                render();
            }, { signal: ctx?.signal });

            input?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    currentValue = input.value.trim();
                    isEditing = false;
                    render();
                    syncValue();
                } else if (e.key === 'Escape') {
                    isEditing = false;
                    render();
                }
            }, { signal: ctx?.signal });
        }
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
            hidden.value = currentValue;
        }

        container.dispatchEvent(new CustomEvent('inplace:change', {
            bubbles: true,
            detail: { value: currentValue }
        }));
    }

    render();
    syncValue();

    container.setAttribute('data-part', 'root');
    applyPart(container, 'root', props.class || '', props.pt, props.studioOverrides);
}
