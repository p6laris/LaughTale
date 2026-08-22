/**
 * SoftMax.LaughTale: Enterprise CascadeSelect Component (Aura CascadeSelect inspired)
 * Hierarchical cascading multi-level dropdown menu for selecting nested categories.
 * Integrated with useDisclosure, useClickOutside, and useTransition.
 */

import { CascadeSelectNode } from '../types/models';
import { LucideIcons } from '../icons/lucide';
import { useDisclosure } from '../composables/useDisclosure';
import { useClickOutside } from '../composables/useClickOutside';
import { useTransition } from '../composables/animation/useTransition';

export interface CascadeSelectProps<T = string> {
    options?: CascadeSelectNode<T>[];
    placeholder?: string;
    targetInputName?: string;
    disabled?: boolean;
}

export default function CascadeSelectIsland<T = string>(container: HTMLElement, props: CascadeSelectProps<T>) {
    const options: CascadeSelectNode<T>[] = props.options || [];
    let selectedText = '';
    let selectedValue: T | null = null;

    container.innerHTML = `
        <div class="laughtale-cascadeselect" style="position: relative; width: 100%; max-width: 280px; font-family: var(--p-font-family, inherit);">
            <!-- Trigger -->
            <div class="cascadeselect-trigger p-input" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; cursor: ${props.disabled ? 'not-allowed' : 'pointer'}; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); user-select: none;">
                <span class="cascadeselect-label" style="font-size: 0.875rem; color: var(--p-text-color);">${props.placeholder || 'Select category...'}</span>
                <span class="cascadeselect-chevron" style="color: var(--p-surface-400); display: flex;">${LucideIcons.chevronDown}</span>
            </div>

            <!-- Cascade Overlay Panes Container -->
            <div class="cascadeselect-overlay" style="display: none; position: absolute; top: calc(100% + 4px); left: 0; z-index: 500; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); min-width: 180px;">
                <div class="cascade-level-0" style="padding: 0.25rem 0; min-width: 180px;"></div>
            </div>
        </div>
    `;

    const trigger = container.querySelector<HTMLElement>('.cascadeselect-trigger')!;
    const label = container.querySelector<HTMLElement>('.cascadeselect-label')!;
    const overlay = container.querySelector<HTMLElement>('.cascadeselect-overlay')!;
    const level0 = container.querySelector<HTMLElement>('.cascade-level-0')!;

    const disclosure = useDisclosure({
        defaultIsOpen: false,
        onOpen: () => {
            renderLevel(options, level0, []);
            useTransition(overlay, { type: 'fade', isMounted: true });
        },
        onClose: () => {
            useTransition(overlay, { type: 'fade', isMounted: false });
        }
    });

    useClickOutside(container, () => disclosure.close());

    function renderLevel(nodes: CascadeSelectNode<T>[], parentContainer: HTMLElement, path: string[] = []) {
        parentContainer.innerHTML = nodes.map(n => {
            const hasChildren = n.children && n.children.length > 0;
            return `
                <div class="cascade-item" data-code="${n.code || n.name}" style="position: relative; display: flex; align-items: center; justify-content: space-between; padding: 0.45rem 0.75rem; cursor: pointer; font-size: 0.8125rem; color: var(--p-text-color); transition: background 0.1s ease;">
                    <span>${n.name}</span>
                    ${hasChildren ? `<span style="color: var(--p-surface-400); display: flex;">${LucideIcons.chevronRight}</span>` : ''}
                    ${hasChildren ? `<div class="sub-pane" style="display: none; position: absolute; top: 0; left: 100%; min-width: 180px; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); padding: 0.25rem 0;"></div>` : ''}
                </div>
            `;
        }).join('');

        parentContainer.querySelectorAll('.cascade-item').forEach((itemEl, idx) => {
            const node = nodes[idx];
            const currentPath = [...path, node.name];

            if (node.children && node.children.length > 0) {
                const subPane = itemEl.querySelector<HTMLElement>('.sub-pane')!;
                itemEl.addEventListener('mouseenter', () => {
                    renderLevel(node.children!, subPane, currentPath);
                    subPane.style.display = 'block';
                });
                itemEl.addEventListener('mouseleave', () => {
                    subPane.style.display = 'none';
                });
            } else {
                itemEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectedText = currentPath.join(' / ');
                    selectedValue = (node.code || node.name) as unknown as T;
                    label.textContent = selectedText;
                    disclosure.close();
                    syncValue();
                });
            }
        });
    }

    trigger.addEventListener('click', () => {
        if (props.disabled) return;
        disclosure.toggle();
    });

    function syncValue() {
        if (props.targetInputName && selectedValue !== null) {
            let hidden = container.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = String(selectedValue);
        }

        container.dispatchEvent(new CustomEvent('cascadeselect:change', {
            bubbles: true,
            detail: { value: selectedValue, text: selectedText }
        }));
    }
}
