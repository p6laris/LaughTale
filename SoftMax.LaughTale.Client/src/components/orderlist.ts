/**
 * SoftMax.LaughTale: Enterprise OrderList Component (Aura OrderList inspired)
 * Reorderable list component with Move Up, Move Down, Move Top, Move Bottom controls.
 */

import { OrderListItem } from '../types/models';
import { LucideIcons } from '../icons/lucide';

export interface OrderListProps<T = any> {
    items?: OrderListItem<T>[];
    header?: string;
    targetInputName?: string;
}

export default function OrderListIsland<T = any>(container: HTMLElement, props: OrderListProps<T>) {
    let items: OrderListItem<T>[] = props.items ? [...props.items] : [
        { id: '1', name: 'Phase 1: Zero-Trust Gateway Init', order: 0 },
        { id: '2', name: 'Phase 2: Hydrate Islands Engine', order: 1 },
        { id: '3', name: 'Phase 3: Verify Cryptographic Signatures', order: 2 },
        { id: '4', name: 'Phase 4: Telemetry Stream Pipeline', order: 3 }
    ];

    let selectedIndex: number | null = 0;

    function render() {
        container.innerHTML = `
            <div class="laughtale-orderlist" style="display: flex; align-items: center; gap: 1rem; width: 100%; max-width: 480px; font-family: var(--p-font-family, inherit);">
                <!-- Reorder Controls -->
                <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                    <button type="button" class="btn-order-top p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move to Top">⇈</button>
                    <button type="button" class="btn-order-up p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move Up">↑</button>
                    <button type="button" class="btn-order-down p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move Down">↓</button>
                    <button type="button" class="btn-order-bottom p-button p-button-secondary" style="padding: 0.45rem; justify-content: center;" title="Move to Bottom">⇊</button>
                </div>

                <!-- Items List Box -->
                <div style="flex: 1; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); background: var(--p-surface-0); overflow: hidden; display: flex; flex-direction: column;">
                    ${props.header ? `<div style="padding: 0.625rem 0.875rem; background: var(--p-surface-50); border-bottom: 1px solid var(--p-border-color); font-size: 0.75rem; font-weight: 700; color: var(--p-surface-600); text-transform: uppercase;">${props.header}</div>` : ''}
                    <div class="orderlist-items-container" style="max-height: 220px; overflow-y: auto; padding: 0.25rem 0;">
                        ${items.map((it, idx) => `
                            <div class="orderlist-item ${selectedIndex === idx ? 'active' : ''}" data-index="${idx}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.875rem; cursor: pointer; font-size: 0.8125rem; background: ${selectedIndex === idx ? 'var(--p-primary-50)' : 'transparent'}; color: ${selectedIndex === idx ? 'var(--p-primary-700)' : 'var(--p-text-color)'}; font-weight: ${selectedIndex === idx ? '600' : 'normal'};">
                                <span>${it.name}</span>
                                <span style="font-family: monospace; font-size: 0.6875rem; color: var(--p-surface-400);">#${idx + 1}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        bindEvents();
    }

    function bindEvents() {
        container.querySelectorAll('.orderlist-item').forEach(el => {
            el.addEventListener('click', () => {
                selectedIndex = Number(el.getAttribute('data-index'));
                render();
            });
        });

        // Move Top
        container.querySelector('.btn-order-top')?.addEventListener('click', () => {
            if (selectedIndex === null || selectedIndex <= 0) return;
            const item = items.splice(selectedIndex, 1)[0];
            items.unshift(item);
            selectedIndex = 0;
            render();
            syncValue();
        });

        // Move Up
        container.querySelector('.btn-order-up')?.addEventListener('click', () => {
            if (selectedIndex === null || selectedIndex <= 0) return;
            const temp = items[selectedIndex];
            items[selectedIndex] = items[selectedIndex - 1];
            items[selectedIndex - 1] = temp;
            selectedIndex--;
            render();
            syncValue();
        });

        // Move Down
        container.querySelector('.btn-order-down')?.addEventListener('click', () => {
            if (selectedIndex === null || selectedIndex >= items.length - 1) return;
            const temp = items[selectedIndex];
            items[selectedIndex] = items[selectedIndex + 1];
            items[selectedIndex + 1] = temp;
            selectedIndex++;
            render();
            syncValue();
        });

        // Move Bottom
        container.querySelector('.btn-order-bottom')?.addEventListener('click', () => {
            if (selectedIndex === null || selectedIndex >= items.length - 1) return;
            const item = items.splice(selectedIndex, 1)[0];
            items.push(item);
            selectedIndex = items.length - 1;
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
            hidden.value = JSON.stringify(items);
        }

        container.dispatchEvent(new CustomEvent('orderlist:change', {
            bubbles: true,
            detail: { items }
        }));
    }

    render();
    syncValue();
}
