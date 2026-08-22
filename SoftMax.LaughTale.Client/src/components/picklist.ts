/**
 * SoftMax.LaughTale: Enterprise PickList Component (Aura PickList inspired)
 * Dual list transfer component for moving items between Source (Available) and Target (Selected).
 */

import { PickListItem } from '../types/models';
import { LucideIcons } from '../icons/lucide';

export interface PickListProps<T = any> {
    source?: PickListItem<T>[];
    target?: PickListItem<T>[];
    sourceHeader?: string;
    targetHeader?: string;
    targetInputName?: string;
}

export default function PickListIsland<T = any>(container: HTMLElement, props: PickListProps<T>) {
    let sourceList: PickListItem<T>[] = props.source ? [...props.source] : [
        { id: '1', name: 'Identity & Access Manager' },
        { id: '2', name: 'Audit Compliance Engine' },
        { id: '3', name: 'Rate Limiter Gateway' }
    ];

    let targetList: PickListItem<T>[] = props.target ? [...props.target] : [
        { id: '4', name: 'Zero-Trust HSM Validator' }
    ];

    let selectedSource: Set<string> = new Set();
    let selectedTarget: Set<string> = new Set();

    function render() {
        container.innerHTML = `
            <div class="laughtale-picklist" style="display: flex; align-items: center; gap: 1rem; width: 100%; max-width: 680px; font-family: var(--p-font-family, inherit);">
                <!-- Source Box -->
                <div style="flex: 1; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); background: var(--p-surface-0); overflow: hidden; display: flex; flex-direction: column;">
                    <div style="padding: 0.625rem 0.875rem; background: var(--p-surface-50); border-bottom: 1px solid var(--p-border-color); font-size: 0.75rem; font-weight: 700; color: var(--p-surface-600); text-transform: uppercase;">
                        ${props.sourceHeader || 'Available'} (${sourceList.length})
                    </div>
                    <div class="picklist-source-list" style="height: 180px; overflow-y: auto; padding: 0.25rem 0;">
                        ${sourceList.map(it => `
                            <div class="picklist-item source-item ${selectedSource.has(it.id) ? 'active' : ''}" data-id="${it.id}" style="padding: 0.45rem 0.75rem; cursor: pointer; font-size: 0.8125rem; background: ${selectedSource.has(it.id) ? 'var(--p-primary-50)' : 'transparent'}; color: ${selectedSource.has(it.id) ? 'var(--p-primary-700)' : 'var(--p-text-color)'}; font-weight: ${selectedSource.has(it.id) ? '600' : 'normal'};">
                                ${it.name}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Transfer Action Buttons -->
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <button type="button" class="btn-move-to-target p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move to Selected">
                        ${LucideIcons.chevronRight}
                    </button>
                    <button type="button" class="btn-move-all-to-target p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move All to Selected">
                        »
                    </button>
                    <button type="button" class="btn-move-to-source p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move to Available">
                        ${LucideIcons.chevronLeft}
                    </button>
                    <button type="button" class="btn-move-all-to-source p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move All to Available">
                        «
                    </button>
                </div>

                <!-- Target Box -->
                <div style="flex: 1; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); background: var(--p-surface-0); overflow: hidden; display: flex; flex-direction: column;">
                    <div style="padding: 0.625rem 0.875rem; background: var(--p-surface-50); border-bottom: 1px solid var(--p-border-color); font-size: 0.75rem; font-weight: 700; color: var(--p-surface-600); text-transform: uppercase;">
                        ${props.targetHeader || 'Selected'} (${targetList.length})
                    </div>
                    <div class="picklist-target-list" style="height: 180px; overflow-y: auto; padding: 0.25rem 0;">
                        ${targetList.map(it => `
                            <div class="picklist-item target-item ${selectedTarget.has(it.id) ? 'active' : ''}" data-id="${it.id}" style="padding: 0.45rem 0.75rem; cursor: pointer; font-size: 0.8125rem; background: ${selectedTarget.has(it.id) ? 'var(--p-primary-50)' : 'transparent'}; color: ${selectedTarget.has(it.id) ? 'var(--p-primary-700)' : 'var(--p-text-color)'}; font-weight: ${selectedTarget.has(it.id) ? '600' : 'normal'};">
                                ${it.name}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        bindEvents();
    }

    function bindEvents() {
        container.querySelectorAll('.source-item').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.getAttribute('data-id')!;
                if (selectedSource.has(id)) selectedSource.delete(id);
                else selectedSource.add(id);
                render();
            });
        });

        container.querySelectorAll('.target-item').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.getAttribute('data-id')!;
                if (selectedTarget.has(id)) selectedTarget.delete(id);
                else selectedTarget.add(id);
                render();
            });
        });

        // Move to target
        container.querySelector('.btn-move-to-target')?.addEventListener('click', () => {
            const moving = sourceList.filter(it => selectedSource.has(it.id));
            targetList.push(...moving);
            sourceList = sourceList.filter(it => !selectedSource.has(it.id));
            selectedSource.clear();
            render();
            syncValue();
        });

        // Move all to target
        container.querySelector('.btn-move-all-to-target')?.addEventListener('click', () => {
            targetList.push(...sourceList);
            sourceList = [];
            selectedSource.clear();
            render();
            syncValue();
        });

        // Move to source
        container.querySelector('.btn-move-to-source')?.addEventListener('click', () => {
            const moving = targetList.filter(it => selectedTarget.has(it.id));
            sourceList.push(...moving);
            targetList = targetList.filter(it => !selectedTarget.has(it.id));
            selectedTarget.clear();
            render();
            syncValue();
        });

        // Move all to source
        container.querySelector('.btn-move-all-to-source')?.addEventListener('click', () => {
            sourceList.push(...targetList);
            targetList = [];
            selectedTarget.clear();
            render();
            syncValue();
        });
    }

    function syncValue() {
        if (props.targetInputName) {
            let hidden = container.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = JSON.stringify(targetList);
        }

        container.dispatchEvent(new CustomEvent('picklist:change', {
            bubbles: true,
            detail: { source: sourceList, target: targetList }
        }));
    }

    render();
    syncValue();
}
