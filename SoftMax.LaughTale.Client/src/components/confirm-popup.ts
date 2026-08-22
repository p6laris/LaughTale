/**
 * SoftMax.LaughTale: Enterprise ConfirmPopup Component (Aura ConfirmPopup inspired)
 */

import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';

export interface ConfirmPopupProps {
    targetSelector: string; // CSS selector of trigger button
    message: string;
    acceptText?: string;
    rejectText?: string;
    actionName?: string;
}


const CSS = `
[data-theme="dark"] .laughtale-confirm-popup {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-reject {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-accept {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;

export default function ConfirmPopupIsland(container: HTMLElement, props: ConfirmPopupProps) {
    injectIslandStyle('confirm-popup', CSS);
    let isOpen = false;

    function render() {
        container.innerHTML = `
            <div class="laughtale-confirm-popup" style="display: ${isOpen ? 'block' : 'none'}; position: absolute; z-index: 1000; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); padding: 1rem; width: 260px; animation: scaleIn 0.15s ease;">
                <div style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.75rem;">
                    <span style="color: #f59e0b; display: flex; align-items: center; margin-top: 2px;">${LucideIcons.alertTriangle}</span>
                    <span style="font-size: 0.875rem; font-weight: 500; color: var(--p-surface-900); line-height: 1.4;">${props.message}</span>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
                    <button type="button" class="btn-reject p-button p-button-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;">
                        ${props.rejectText || 'Cancel'}
                    </button>
                    <button type="button" class="btn-accept p-button p-button-primary" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; background: #ef4444; border-color: #ef4444;">
                        ${props.acceptText || 'Confirm'}
                    </button>
                </div>
            </div>
        `;

        container.querySelector('.btn-reject')?.addEventListener('click', () => {
            isOpen = false;
            render();
        });

        container.querySelector('.btn-accept')?.addEventListener('click', () => {
            isOpen = false;
            render();
            container.dispatchEvent(new CustomEvent('confirm:accept', {
                bubbles: true,
                detail: { action: props.actionName }
            }));
        });
    }

    const trigger = document.querySelector(props.targetSelector);
    if (trigger) {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            isOpen = !isOpen;
            render();
            if (isOpen) {
                const rect = trigger.getBoundingClientRect();
                const popup = container.querySelector<HTMLElement>('.laughtale-confirm-popup');
                if (popup) {
                    popup.style.top = `${rect.bottom + window.scrollY + 6}px`;
                    popup.style.left = `${rect.left + window.scrollX}px`;
                }
            }
        });
    }

    render();
}
