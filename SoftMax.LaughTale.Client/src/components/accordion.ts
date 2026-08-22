/**
 * SoftMax.LaughTale: Enterprise Accordion Component
 * Powered by useDisclosure and useTransition composables.
 */

import { LucideIcons } from '../icons/lucide';
import { AccordionProps } from '../types/models';
import { useDisclosure } from '../composables/useDisclosure';
import { useTransition } from '../composables/animation/useTransition';

export default function AccordionIsland(container: HTMLElement, props: AccordionProps) {
    const tabs = props.tabs || [];
    let activeIndices: Set<number> = new Set();

    if (Array.isArray(props.activeIndex)) {
        props.activeIndex.forEach(i => activeIndices.add(i));
    } else if (typeof props.activeIndex === 'number') {
        activeIndices.add(props.activeIndex);
    } else {
        activeIndices.add(0);
    }

    const disclosures: Record<number, ReturnType<typeof useDisclosure>> = {};

    tabs.forEach((_, idx) => {
        disclosures[idx] = useDisclosure({
            defaultIsOpen: activeIndices.has(idx)
        });
    });

    function render() {
        const tabHtml = tabs.map((tab, idx) => {
            const isOpen = disclosures[idx]?.isOpen ?? false;
            return `
                <div class="accordion-tab ${isOpen ? 'tab-open' : ''}" data-idx="${idx}" style="border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); margin-bottom: 0.5rem; background: var(--p-surface-0); overflow: hidden;">
                    <button type="button" 
                            class="accordion-header-btn" 
                            data-idx="${idx}" 
                            ${tab.disabled ? 'disabled' : ''} 
                            style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 1.25rem; border: none; background: ${isOpen ? 'var(--p-surface-50)' : 'var(--p-surface-0)'}; color: var(--p-surface-900); font-weight: 600; font-size: 0.875rem; cursor: ${tab.disabled ? 'not-allowed' : 'pointer'}; text-align: left; transition: background 0.15s ease;">
                        <span style="display: flex; align-items: center; gap: 0.5rem;">
                            ${tab.icon ? `<span>${tab.icon}</span>` : ''}
                            <span>${tab.header}</span>
                        </span>
                        <span class="chevron-icon" style="color: var(--p-surface-500); display: flex; align-items: center; transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1); transform: rotate(${isOpen ? '180deg' : '0deg'});">
                            ${LucideIcons.chevronDown}
                        </span>
                    </button>
                    <div class="accordion-content" style="display: ${isOpen ? 'block' : 'none'}; padding: 1.25rem; border-top: 1px solid var(--p-border-color); font-size: 0.875rem; color: var(--p-surface-600); line-height: 1.6;">
                        <div class="tab-slot" data-slot-index="${idx}">${tab.content || ''}</div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="laughtale-accordion" style="width: 100%;">
                ${tabHtml}
            </div>
        `;

        bindEvents();
    }

    function toggleTab(idx: number) {
        if (!props.multiple) {
            tabs.forEach((_, otherIdx) => {
                if (otherIdx !== idx) disclosures[otherIdx]?.close();
            });
        }
        disclosures[idx]?.toggle();
        updateDOM();
    }

    function updateDOM() {
        container.querySelectorAll<HTMLElement>('.accordion-tab').forEach((tabEl) => {
            const idx = Number(tabEl.getAttribute('data-idx'));
            const isOpen = disclosures[idx]?.isOpen ?? false;
            const contentEl = tabEl.querySelector<HTMLElement>('.accordion-content')!;
            const chevronEl = tabEl.querySelector<HTMLElement>('.chevron-icon')!;
            const headerBtn = tabEl.querySelector<HTMLElement>('.accordion-header-btn')!;

            tabEl.classList.toggle('tab-open', isOpen);
            headerBtn.style.background = isOpen ? 'var(--p-surface-50)' : 'var(--p-surface-0)';
            chevronEl.style.transform = `rotate(${isOpen ? '180deg' : '0deg'})`;

            const transition = useTransition(contentEl, { preset: 'collapse' });
            if (isOpen) {
                transition.enter();
            } else {
                contentEl.style.display = 'none';
                transition.exit();
            }
        });

        const activeList = tabs.map((_, idx) => idx).filter(idx => disclosures[idx]?.isOpen);
        container.dispatchEvent(new CustomEvent('accordion:change', {
            bubbles: true,
            detail: { activeIndex: activeList }
        }));
    }

    function bindEvents() {
        container.querySelectorAll<HTMLButtonElement>('.accordion-header-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = Number(btn.getAttribute('data-idx'));
                toggleTab(idx);
            });
        });
    }

    render();
}
