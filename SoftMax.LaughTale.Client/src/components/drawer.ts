/**
 * SoftMax.LaughTale: Enterprise Slide-out Drawer / Sidebar Component (Aura Drawer inspired)
 */

import { getSolarIcon } from '../icons/solar';

export interface DrawerProps {
    position?: 'left' | 'right' | 'top' | 'bottom';
    title?: string;
    triggerText?: string;
    width?: string;
}

export default function DrawerIsland(container: HTMLElement, props: DrawerProps) {
    const position = props.position || 'right';
    const width = props.width || '380px';
    let isOpen = false;

    function render() {
        container.innerHTML = `
            <div class="laughtale-drawer-wrapper">
                ${props.triggerText ? `
                    <button type="button" class="p-button p-button-secondary drawer-open-btn">
                        ${props.triggerText}
                    </button>
                ` : ''}

                <!-- Backdrop -->
                <div class="drawer-backdrop" style="display: ${isOpen ? 'block' : 'none'}; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px); z-index: 1000; animation: fadeIn 0.2s ease;"></div>

                <!-- Drawer Panel -->
                <div class="drawer-panel" style="display: ${isOpen ? 'flex' : 'none'}; flex-direction: column; position: fixed; ${position}: 0; top: 0; bottom: 0; width: ${width}; max-width: 90vw; background: var(--p-surface-0); border-${position === 'right' ? 'left' : 'right'}: 1px solid var(--p-border-color); box-shadow: var(--p-shadow-lg); z-index: 1001; animation: slideInDrawer 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
                    
                    <!-- Header -->
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem; border-bottom: 1px solid var(--p-border-color);">
                        <div style="font-size: 1.125rem; font-weight: 700; color: var(--p-surface-900);">
                            ${props.title || 'Panel'}
                        </div>
                        <button type="button" class="drawer-close-btn" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; display: flex; align-items: center; padding: 0.25rem;">
                            ${getSolarIcon('close')}
                        </button>
                    </div>

                    <!-- Projected Body Slot -->
                    <div class="drawer-body" style="flex: 1; overflow-y: auto; padding: 1.25rem;">
                        <div class="drawer-slot-container"></div>
                    </div>
                </div>
            </div>
        `;

        // Slot projection
        const slotEl = container.querySelector('[data-slot="default"]') || container.querySelector('.island-slot');
        const slotContainer = container.querySelector('.drawer-slot-container');
        if (slotEl && slotContainer) slotContainer.appendChild(slotEl);

        container.querySelector('.drawer-open-btn')?.addEventListener('click', () => {
            isOpen = true;
            render();
        });

        container.querySelector('.drawer-close-btn')?.addEventListener('click', () => {
            isOpen = false;
            render();
        });

        container.querySelector('.drawer-backdrop')?.addEventListener('click', () => {
            isOpen = false;
            render();
        });
    }

    render();
}
