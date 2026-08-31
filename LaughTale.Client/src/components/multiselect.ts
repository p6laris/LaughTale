import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise MultiSelect Component (Aura MultiSelect inspired)
 * Integrated with useDisclosure, useClickOutside, and useTransition for smooth popover fade transitions.
 */

import { SelectButtonItem } from '../types/models';
import { injectIslandStyle } from '../runtime/styles';
import { LucideIcons } from '../icons/lucide';
import { useDisclosure } from '../composables/useDisclosure';
import { useClickOutside } from '../composables/useClickOutside';
import { useTransition } from '../composables/animation/useTransition';

export interface MultiSelectProps<T = string> {
    options?: SelectButtonItem<T>[];
    selectedValues?: T[];
    placeholder?: string;
    targetInputName?: string;
    filter?: boolean;
    display?: 'comma' | 'chip';
    disabled?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}


const CSS = `
html.dark .multiselect-trigger,
[data-theme="dark"] .multiselect-trigger,
.dark .multiselect-trigger {
    background: var(--p-surface-0) !important;
    color: var(--p-text-color) !important;
    border-color: var(--p-border-color) !important;
}
html.dark .multiselect-overlay,
[data-theme="dark"] .multiselect-overlay,
.dark .multiselect-overlay {
    background: var(--p-surface-0) !important;
    color: var(--p-text-color) !important;
    border-color: var(--p-border-color) !important;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
}
html.dark .multiselect-select-all,
[data-theme="dark"] .multiselect-select-all,
.dark .multiselect-select-all {
    background: var(--p-surface-50) !important;
    border-color: var(--p-border-color) !important;
    color: var(--p-text-color) !important;
}
html.dark .multiselect-filter-input,
[data-theme="dark"] .multiselect-filter-input,
.dark .multiselect-filter-input {
    color: var(--p-text-color) !important;
}
html.dark .multiselect-item:hover,
[data-theme="dark"] .multiselect-item:hover,
.dark .multiselect-item:hover {
    background: var(--p-surface-100) !important;
    color: var(--p-text-color) !important;
}
html.dark .chip-item,
[data-theme="dark"] .chip-item,
.dark .chip-item {
    background: var(--p-surface-100) !important;
    color: var(--p-text-color) !important;
}
`;

export default function MultiSelectIsland<T = string>(container: HTMLElement, props: MultiSelectProps<T>, ctx?: IslandContext) {
    injectIslandStyle('multiselect', CSS);
    const options: SelectButtonItem<T>[] = props.options || [];
    let selected: Set<T> = new Set(props.selectedValues || []);
    let filterQuery = '';

    container.innerHTML = `
        <div class="laughtale-multiselect" data-part="root" style="position: relative; width: 100%; max-width: 320px; font-family: var(--p-font-family, inherit);">
            <!-- Trigger Button Container -->
            <div class="multiselect-trigger p-input" style="display: flex; align-items: center; justify-content: space-between; min-height: 2.5rem; padding: 0.35rem 0.75rem; cursor: ${props.disabled ? 'not-allowed' : 'pointer'}; background: var(--lt-surface-0); border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); user-select: none;">
                <div class="multiselect-label-container" style="display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap; flex: 1; min-width: 0;"></div>
                <div style="display: flex; align-items: center; gap: 0.35rem; color: var(--lt-surface-400);">
                    <span class="multiselect-clear-btn" style="display: none; cursor: pointer; padding: 2px;">${LucideIcons.x}</span>
                    <span class="multiselect-chevron" style="display: flex; transition: transform 0.2s ease;">${LucideIcons.chevronDown}</span>
                </div>
            </div>

            <!-- Popover Overlay -->
            <div class="multiselect-overlay" style="display: none; position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 500; background: var(--lt-surface-0); border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius-lg); box-shadow: var(--p-shadow-lg); overflow: hidden;">
                <!-- Filter Search Box -->
                <div style="padding: 0.5rem; border-bottom: 1px solid var(--lt-surface-200); display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: var(--lt-surface-400); display: flex;">${LucideIcons.search}</span>
                    <input type="text" class="multiselect-filter-input" placeholder="Search..." style="flex: 1; border: none; outline: none; background: transparent; font-size: 0.8125rem; color: var(--lt-text-primary);" />
                </div>

                <!-- Select All Bar -->
                <div class="multiselect-select-all" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--lt-surface-100); background: var(--lt-surface-50); cursor: pointer; font-size: 0.75rem; font-weight: 600; color: var(--lt-surface-600);">
                    <input type="checkbox" class="select-all-chk" style="accent-color: var(--lt-primary-600); cursor: pointer;" />
                    <span>Select All</span>
                </div>

                <!-- Items List -->
                <div class="multiselect-items-list" style="max-height: 200px; overflow-y: auto; padding: 0.25rem 0;"></div>
            </div>
        </div>
    `;

    const trigger = container.querySelector<HTMLElement>('.multiselect-trigger')!;
    const labelContainer = container.querySelector<HTMLElement>('.multiselect-label-container')!;
    const overlay = container.querySelector<HTMLElement>('.multiselect-overlay')!;
    const filterInput = container.querySelector<HTMLInputElement>('.multiselect-filter-input')!;
    const selectAllChk = container.querySelector<HTMLInputElement>('.select-all-chk')!;
    const itemsList = container.querySelector<HTMLElement>('.multiselect-items-list')!;
    const clearBtn = container.querySelector<HTMLElement>('.multiselect-clear-btn')!;
    const chevron = container.querySelector<HTMLElement>('.multiselect-chevron')!;

    const overlayTransition = useTransition(overlay, { preset: 'fade' });

    const disclosure = useDisclosure({
        defaultIsOpen: false,
        onOpen: () => {
            chevron.style.transform = 'rotate(180deg)';
            filterInput.value = '';
            filterQuery = '';
            renderList();
            overlayTransition.enter();
            filterInput.focus();
        },
        onClose: () => {
            chevron.style.transform = 'none';
            overlayTransition.exit();
        }
    });

    useClickOutside(container, () => disclosure.close());

    function getFilteredOptions() {
        if (!filterQuery.trim()) return options;
        const q = filterQuery.toLowerCase();
        return options.filter(o => o.label.toLowerCase().includes(q));
    }

    function renderDisplay() {
        if (selected.size === 0) {
            labelContainer.innerHTML = `<span style="color: var(--lt-surface-400); font-size: 0.875rem;">${props.placeholder || 'Select items...'}</span>`;
            clearBtn.style.display = 'none';
            return;
        }

        clearBtn.style.display = 'flex';

        if (props.display === 'comma') {
            const labels = options.filter(o => selected.has(o.value)).map(o => o.label).join(', ');
            labelContainer.innerHTML = `<span style="font-size: 0.875rem; color: var(--lt-text-primary);">${labels}</span>`;
        } else {
            // Chips display
            const chipsHtml = options.filter(o => selected.has(o.value)).map(o => `
                <span class="aura-tag tag-emerald" style="padding: 0.15rem 0.45rem; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.25rem;">
                    ${o.label}
                    <span class="chip-remove-btn" data-val="${o.value}" style="cursor: pointer; display: flex; opacity: 0.7;">${LucideIcons.x}</span>
                </span>
            `).join('');
            labelContainer.innerHTML = chipsHtml;

            labelContainer.querySelectorAll('.chip-remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const val = btn.getAttribute('data-val') as unknown as T;
                    selected.delete(val);
                    renderDisplay();
                    renderList();
                    syncValue();
                }, { signal: ctx?.signal });
            });
        }
    }

    function renderList() {
        const filtered = getFilteredOptions();

        selectAllChk.checked = filtered.length > 0 && filtered.every(o => selected.has(o.value));

        if (filtered.length === 0) {
            itemsList.innerHTML = `<div style="padding: 1rem; text-align: center; font-size: 0.75rem; color: var(--lt-surface-400);">No options found</div>`;
            return;
        }

        itemsList.innerHTML = filtered.map(o => {
            const isChecked = selected.has(o.value);
            return `
                <div class="multiselect-item" data-val="${o.value}" style="display: flex; align-items: center; gap: 0.625rem; padding: 0.45rem 0.75rem; cursor: pointer; font-size: 0.8125rem; background: ${isChecked ? 'var(--lt-surface-50)' : 'transparent'}; color: var(--lt-text-primary);">
                    <input type="checkbox" ${isChecked ? 'checked' : ''} style="accent-color: var(--lt-primary-600); pointer-events: none;" />
                    <span style="flex: 1;">${o.label}</span>
                </div>
            `;
        }).join('');

        itemsList.querySelectorAll('.multiselect-item').forEach(el => {
            el.addEventListener('click', () => {
                const val = el.getAttribute('data-val') as unknown as T;
                if (selected.has(val)) selected.delete(val);
                else selected.add(val);
                renderDisplay();
                renderList();
                syncValue();
            }, { signal: ctx?.signal });
        });
    }

    trigger.addEventListener('click', () => {
        if (props.disabled) return;
        disclosure.toggle();
    }, { signal: ctx?.signal });

    clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selected.clear();
        renderDisplay();
        renderList();
        syncValue();
    }, { signal: ctx?.signal });

    selectAllChk.parentElement?.addEventListener('click', () => {
        const filtered = getFilteredOptions();
        const allChecked = filtered.every(o => selected.has(o.value));
        if (allChecked) {
            filtered.forEach(o => selected.delete(o.value));
        } else {
            filtered.forEach(o => selected.add(o.value));
        }
        renderDisplay();
        renderList();
        syncValue();
    }, { signal: ctx?.signal });

    filterInput.addEventListener('input', () => {
        filterQuery = filterInput.value;
        renderList();
    }, { signal: ctx?.signal });

    function syncValue() {
        if (props.targetInputName) {
            let hidden = container.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = JSON.stringify(Array.from(selected));
        }

        container.dispatchEvent(new CustomEvent('multiselect:change', {
            bubbles: true,
            detail: { value: Array.from(selected) }
        }));
    }

    renderDisplay();
    syncValue();
}
