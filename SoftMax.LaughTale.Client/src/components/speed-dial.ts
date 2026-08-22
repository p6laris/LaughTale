/**
 * SoftMax.LaughTale: Enterprise SpeedDial FAB Component (Aura SpeedDial inspired)
 */

import { LucideIcons } from '../icons/lucide';

export interface SpeedDialAction {
    label: string;
    icon?: string;
    action?: string;
}

export interface SpeedDialProps {
    actions: SpeedDialAction[];
    direction?: 'up' | 'down' | 'left' | 'right';
    icon?: string;
}

export default function SpeedDialIsland(container: HTMLElement, props: SpeedDialProps) {
    let isOpen = false;

    function render() {
        const actionItems = props.actions.map((act) => `
            <button type="button" 
                    class="speed-dial-action-btn" 
                    title="${act.label}" 
                    data-action="${act.action || ''}" 
                    style="width: 2.5rem; height: 2.5rem; border-radius: 50%; border: 1px solid var(--p-border-color); background: var(--p-surface-0); color: var(--p-surface-800); box-shadow: var(--p-shadow-md); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);">
                ${act.icon || LucideIcons.zap}
            </button>
        `).join('');

        container.innerHTML = `
            <div class="laughtale-speed-dial" style="position: relative; display: inline-flex; flex-direction: column-reverse; align-items: center; gap: 0.75rem;">
                <!-- Main FAB Button -->
                <button type="button" class="speed-dial-main-btn" style="width: 3.25rem; height: 3.25rem; border-radius: 50%; border: none; background: var(--p-primary-600); color: #ffffff; box-shadow: var(--p-shadow-lg); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1); transform: rotate(${isOpen ? '45deg' : '0deg'});">
                    ${LucideIcons.plus}
                </button>

                <!-- Action Items -->
                <div class="speed-dial-list" style="display: ${isOpen ? 'flex' : 'none'}; flex-direction: column-reverse; gap: 0.5rem; animation: fadeInUp 0.2s ease;">
                    ${actionItems}
                </div>
            </div>
        `;

        container.querySelector('.speed-dial-main-btn')?.addEventListener('click', () => {
            isOpen = !isOpen;
            render();
        });

        container.querySelectorAll('.speed-dial-action-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const act = btn.getAttribute('data-action');
                container.dispatchEvent(new CustomEvent('speeddial:action', {
                    bubbles: true,
                    detail: { action: act }
                }));
                isOpen = false;
                render();
            });
        });
    }

    render();
}
