/**
 * SoftMax.LaughTale: Enterprise Tabs & TabView Component (Aura Tabs inspired)
 * Integrated with useMorphLayout for fluid active indicator pill animations.
 */

import { TabItem } from '../types/models';
import { injectIslandStyle } from '../runtime/styles';
import { useMorphLayout } from '../composables/animation/useMorphLayout';

export interface TabsProps {
    tabs?: TabItem[];
    activeIndex?: number;
    targetInputName?: string;
}


const CSS = `
[data-theme="dark"] .tab-header-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-tabs {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .tabs-header-bar {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .tab-panel-body {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .tab-slot-content {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;

export default function TabsIsland(container: HTMLElement, props: TabsProps) {
    injectIslandStyle('tabs', CSS);
    const tabs = props.tabs || [];
    let activeIndex = props.activeIndex || 0;

    function render() {
        const headerButtons = tabs.map((tab, idx) => {
            const isActive = idx === activeIndex;
            const headerText = (tab as any).header || (tab as any).Header || (tab as any).title || (tab as any).Title || (tab as any).label || (tab as any).Label || `Tab ${idx + 1}`;
            const iconText = (tab as any).icon || (tab as any).Icon || '';
            return `
                <button type="button" 
                        class="tab-header-btn ${isActive ? 'tab-active' : ''}" 
                        data-idx="${idx}" 
                        ${tab.disabled ? 'disabled' : ''} 
                        style="position: relative; padding: 0.75rem 1.25rem; border: none; background: transparent; color: ${isActive ? 'var(--p-primary-600)' : 'var(--p-text-muted)'}; font-weight: ${isActive ? '700' : '500'}; font-size: 0.875rem; cursor: ${tab.disabled ? 'not-allowed' : 'pointer'}; transition: color 0.15s ease; display: inline-flex; align-items: center; gap: 0.5rem; border-bottom: 2px solid ${isActive ? 'var(--p-primary-600)' : 'transparent'};">
                    ${iconText ? `<span>${iconText}</span>` : ''}
                    <span>${headerText}</span>
                </button>
            `;
        }).join('');

        const activeContent = (tabs[activeIndex] as any)?.content || (tabs[activeIndex] as any)?.Content || '';

        container.innerHTML = `
            <div class="laughtale-tabs" style="width: 100%;">
                <!-- Tab Headers Bar -->
                <div class="tabs-header-bar" style="display: flex; border-bottom: 1px solid var(--p-border-color); gap: 0.25rem; overflow-x: auto; position: relative;">
                    ${headerButtons}
                </div>

                <!-- Active Tab Content Panel -->
                <div class="tab-panel-body" style="padding: 1.25rem 0; font-size: 0.875rem; color: var(--p-text-color); line-height: 1.6; transition: opacity 0.2s ease;">
                    <div class="tab-slot-content">${activeContent}</div>
                </div>
            </div>
        `;

        // Slot projection support for Razor slot templates
        const externalSlot = container.querySelector(`[data-slot="tab-${activeIndex}"]`);
        const targetContainer = container.querySelector('.tab-slot-content');
        if (externalSlot && targetContainer) {
            targetContainer.innerHTML = '';
            targetContainer.appendChild(externalSlot);
        }

        container.querySelectorAll('.tab-header-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const idx = Number(btn.getAttribute('data-idx'));
                activeIndex = idx;
                render();

                if (props.targetInputName) {
                    let hidden = container.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
                    if (!hidden) {
                        hidden = document.createElement('input');
                        hidden.type = 'hidden';
                        hidden.name = props.targetInputName;
                        container.appendChild(hidden);
                    }
                    hidden.value = String(activeIndex);
                }

                container.dispatchEvent(new CustomEvent('tabs:change', {
                    bubbles: true,
                    detail: { activeIndex }
                }));
            });
        });
    }

    render();
}
