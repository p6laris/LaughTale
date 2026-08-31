import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise Inplace / Click-to-Edit Component (Aura Inplace inspired)
 */

import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';

export interface InplaceProps {
    value?: string;
    targetInputName?: string;
    placeholder?: string;
    disabled?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}


const CSS = `
html.dark .laughtale-inplace-display,
[data-theme="dark"] .laughtale-inplace-display,
.dark .laughtale-inplace-display {
    background: var(--p-surface-100) !important;
    color: var(--p-text-color) !important;
    border-color: var(--p-border-color) !important;
}
html.dark .laughtale-inplace-editor,
[data-theme="dark"] .laughtale-inplace-editor,
.dark .laughtale-inplace-editor {
    background: transparent !important;
    color: var(--p-text-color) !important;
}
html.dark .inplace-input,
[data-theme="dark"] .inplace-input,
.dark .inplace-input {
    background: var(--p-surface-0) !important;
    color: var(--p-text-color) !important;
    border-color: var(--p-primary-500) !important;
}
`;

export default function InplaceIsland(container: HTMLElement, props: InplaceProps, ctx?: IslandContext) {
    injectIslandStyle('inplace', CSS);
    let isEditing = false;
    let currentValue = props.value || '';

    function render() {
        if (!isEditing) {
            container.innerHTML = `
                <div class="laughtale-inplace-display" data-part="root" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.6rem; border-radius: var(--lt-radius); border: 1px dashed var(--lt-surface-200); background: var(--lt-surface-50); cursor: ${props.disabled ? 'default' : 'pointer'}; transition: background 0.15s ease;">
                    <span style="font-size: 0.875rem; color: ${currentValue ? 'var(--lt-surface-900)' : 'var(--lt-surface-400)'}; font-weight: 500;">
                        ${currentValue || props.placeholder || 'Click to edit...'}
                    </span>
                    ${!props.disabled ? `<span style="color: var(--lt-surface-400); display: flex; align-items: center;">${LucideIcons.edit}</span>` : ''}
                </div>
            `;

            if (!props.disabled) {
                container.querySelector('.laughtale-inplace-display')?.addEventListener('click', () => {
                    isEditing = true;
                    render();
                }, { signal: ctx?.signal });
            }
        } else {
            container.innerHTML = `
                <div class="laughtale-inplace-editor" style="display: inline-flex; align-items: center; gap: 0.35rem;">
                    <input type="text" 
                           class="inplace-input" 
                           value="${currentValue}" 
                           placeholder="${props.placeholder || ''}" 
                           style="padding: 0.35rem 0.6rem; border: 1px solid var(--lt-primary-600); border-radius: var(--lt-radius); font-size: 0.875rem; outline: none;" />
                    <button type="button" class="btn-inplace-save p-button p-button-primary" style="padding: 0.35rem 0.5rem; display: flex; align-items: center;">
                        ${LucideIcons.check}
                    </button>
                    <button type="button" class="btn-inplace-cancel p-button p-button-secondary" style="padding: 0.35rem 0.5rem; display: flex; align-items: center;">
                        ${LucideIcons.x}
                    </button>
                </div>
            `;

            const input = container.querySelector<HTMLInputElement>('.inplace-input')!;
            input.focus();
            input.setSelectionRange(currentValue.length, currentValue.length);

            container.querySelector('.btn-inplace-save')?.addEventListener('click', () => {
                currentValue = input.value.trim();
                isEditing = false;
                render();
                syncValue();
            }, { signal: ctx?.signal });

            container.querySelector('.btn-inplace-cancel')?.addEventListener('click', () => {
                isEditing = false;
                render();
            }, { signal: ctx?.signal });

            input.addEventListener('keydown', (e) => {
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
}
