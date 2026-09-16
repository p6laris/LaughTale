import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise MultiSelect Component (Aura MultiSelect inspired)
 * Integrated with useDisclosure, useClickOutside, and useTransition for smooth popover fade transitions.
 */

import { SelectButtonItem } from '../types/models';
import { injectIslandStyle } from '../runtime/styles';
import { emitComponentEvent } from '../runtime/events';
import { signal, effect } from '../runtime/signals';
import { patchList } from '../runtime/list-patch';
import { LucideIcons } from '../icons/lucide';
import { useDisclosure } from '../composables/useDisclosure';
import { useClickOutside } from '../composables/useClickOutside';
import { useFloatingPosition } from '../composables/useFloatingPosition';
import { useTransition } from '../composables/animation/useTransition';
import { useKeyboardNav } from '../composables/useKeyboardNav';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import { useFormField } from '../composables/useFormField';
import { useLocale } from '../composables/useLocale';
import { announce } from '../accessibility/announcer';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'listbox'
};

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
    const locale = useLocale(ctx);
    const formField = useFormField(container, ctx, {
        cardinality: 'Multiple',
        name: (props as any).name || props.targetInputName
    });

    const options: SelectButtonItem<T>[] = props.options || [];
    const initValues = props.selectedValues ?? formField.getValue();
    const selected = signal<Set<T>>(new Set(Array.isArray(initValues) ? initValues : (initValues ? [initValues] : [])));
    const filterQuery = signal('');

    formField.detach();
    setHtml(container, html`
        <div class="laughtale-multiselect" data-part="root" style="position: relative; width: 100%; max-width: 320px; font-family: var(--p-font-family, inherit);">
            <!-- Trigger Button Container -->
            <div class="multiselect-trigger p-input" tabindex="${props.disabled ? '-1' : '0'}" style="display: flex; align-items: center; justify-content: space-between; min-height: 2.5rem; padding: 0.35rem 0.75rem; cursor: ${props.disabled ? 'not-allowed' : 'pointer'}; background: var(--lt-surface-0); border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius); user-select: none;">
                <div class="multiselect-label-container" style="display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap; flex: 1; min-width: 0;"></div>
                <div style="display: flex; align-items: center; gap: 0.35rem; color: var(--lt-surface-400);">
                    <span class="multiselect-clear-btn" style="display: none; cursor: pointer; padding: 2px;">${unsafe(LucideIcons.x)}</span>
                    <span class="multiselect-chevron" style="display: flex; transition: transform 0.2s ease;">${unsafe(LucideIcons.chevronDown)}</span>
                </div>
            </div>

            <!-- Popover Overlay -->
            <div class="multiselect-overlay" style="display: none; z-index: 500; background: var(--lt-surface-0); border: 1px solid var(--lt-surface-200); border-radius: var(--lt-radius-lg); box-shadow: var(--p-shadow-lg); overflow: hidden;">
                <!-- Filter Search Box -->
                <div style="padding: 0.5rem; border-bottom: 1px solid var(--lt-surface-200); display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: var(--lt-surface-400); display: flex;">${unsafe(LucideIcons.search)}</span>
                    <input type="text" class="multiselect-filter-input" placeholder="Search..." style="flex: 1; border: none; outline: none; background: transparent; font-size: 0.8125rem; color: var(--lt-text-primary);" />
                </div>

                <!-- Select All Bar -->
                <div class="multiselect-select-all" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--lt-surface-100); background: var(--lt-surface-50); cursor: pointer; font-size: 0.75rem; font-weight: 600; color: var(--lt-surface-600);">
                    <input type="checkbox" class="select-all-chk" style="accent-color: var(--lt-primary-600); cursor: pointer;" />
                    <span>Select All</span>
                </div>

                <!-- Items List -->
                <div class="multiselect-items-list" role="listbox" aria-multiselectable="true" aria-label="Options" style="max-height: 200px; overflow-y: auto; padding: 0.25rem 0;"></div>
            </div>
        </div>
    `);
    formField.reattach();

    const trigger = container.querySelector<HTMLElement>('.multiselect-trigger')!;
    const labelContainer = container.querySelector<HTMLElement>('.multiselect-label-container')!;
    const overlay = container.querySelector<HTMLElement>('.multiselect-overlay')!;
    const filterInput = container.querySelector<HTMLInputElement>('.multiselect-filter-input')!;
    const selectAllChk = container.querySelector<HTMLInputElement>('.select-all-chk')!;
    const itemsList = container.querySelector<HTMLElement>('.multiselect-items-list')!;
    const clearBtn = container.querySelector<HTMLElement>('.multiselect-clear-btn')!;
    const chevron = container.querySelector<HTMLElement>('.multiselect-chevron')!;

    const overlayTransition = useTransition(overlay, { preset: 'fade' });
    let floatingHandle: { update: () => void } | null = null;

    const disclosure = useDisclosure({
        defaultIsOpen: false,
        onOpen: () => {
            chevron.style.transform = 'rotate(180deg)';
            filterInput.value = '';
            filterQuery.set(''); // renderList's effect re-runs automatically on this write
            overlay.style.width = `${trigger.offsetWidth}px`;
            floatingHandle = useFloatingPosition(trigger, overlay, {
                placement: 'bottom-start',
                reposition: 'follow',
                signal: ctx?.signal,
                offset: 4,
                isRtl: locale.isRtl
            });
            overlayTransition.enter();
            filterInput.focus();
        },
        onClose: () => {
            chevron.style.transform = 'none';
            overlayTransition.exit();
            floatingHandle = null;
        }
    });

    useClickOutside(container, () => disclosure.close(), { signal: ctx?.signal });

    function getFilteredOptions() {
        const q = filterQuery();
        if (!q.trim()) return options;
        const lower = q.toLowerCase();
        return options.filter(o => o.label.toLowerCase().includes(lower));
    }

    const nav = useKeyboardNav({
        itemCount: () => getFilteredOptions().length,
        initialIndex: 0,
        orientation: 'vertical',
        onSelect: (index) => {
            const filtered = getFilteredOptions();
            const opt = filtered[index];
            if (opt) {
                const next = new Set(selected());
                if (next.has(opt.value)) next.delete(opt.value);
                else next.add(opt.value);
                selected.set(next);
                syncValue();
            }
        },
        onHighlight: (index) => {
            const items = itemsList.querySelectorAll<HTMLElement>('.multiselect-item');
            items.forEach((item, i) => {
                if (i === index) {
                    item.style.outline = '2px solid var(--lt-primary-500)';
                    item.scrollIntoView({ block: 'nearest' });
                } else {
                    item.style.outline = 'none';
                }
            });
        },
        onEscape: () => {
            disclosure.close();
            trigger.focus();
        }
    });

    function renderDisplay() {
        const current = selected();
        if (current.size === 0) {
            setHtml(labelContainer, html`<span style="color: var(--lt-surface-400); font-size: 0.875rem;">${props.placeholder || 'Select items...'}</span>`);
            clearBtn.style.display = 'none';
            return;
        }

        clearBtn.style.display = 'flex';

        if (props.display === 'comma') {
            const labels = options.filter(o => current.has(o.value)).map(o => o.label).join(', ');
            setHtml(labelContainer, html`<span style="font-size: 0.875rem; color: var(--lt-text-primary);">${labels}</span>`);
        } else {
            // Chips display
            const chipsHtml = options.filter(o => current.has(o.value)).map(o => html`
                <span class="aura-tag tag-emerald" style="padding: 0.15rem 0.45rem; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.25rem;">
                    ${o.label}
                    <span class="chip-remove-btn" data-val="${String(o.value)}" style="cursor: pointer; display: flex; opacity: 0.7;">${unsafe(LucideIcons.x)}</span>
                </span>
            `);
            setHtml(labelContainer, html`${chipsHtml}`);

            labelContainer.querySelectorAll('.chip-remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const valStr = btn.getAttribute('data-val');
                    const match = options.find(o => String(o.value) === valStr);
                    if (match) {
                        const next = new Set(selected());
                        next.delete(match.value);
                        selected.set(next);
                    }
                    syncValue();
                }, { signal: ctx?.signal });
            });
        }
    }

    function renderList() {
        const filtered = getFilteredOptions();
        const current = selected();

        selectAllChk.checked = filtered.length > 0 && filtered.every(o => current.has(o.value));

        if (filtered.length === 0) {
            setHtml(itemsList, html`<div style="padding: 1rem; text-align: center; font-size: 0.75rem; color: var(--lt-surface-400);">${locale.t('emptyMessage') || 'No options found'}</div>`);
            return;
        }

        // patchList's own wrapper div (keyed by `data-key`) is what click
        // delegation below matches on; the `.multiselect-item` div nested inside
        // is the per-item markup patchList only rewrites when it actually changes,
        // which keeps onHighlight's `.multiselect-item` query and hover CSS working
        // unmodified while still getting keyed node reuse across re-renders.
        patchList(itemsList, filtered, (o) => String(o.value), (o) => {
            const isChecked = current.has(o.value);
            return html`
                <div class="multiselect-item" role="option" aria-selected="${isChecked ? 'true' : 'false'}" style="display: flex; align-items: center; gap: 0.625rem; padding: 0.45rem 0.75rem; cursor: pointer; font-size: 0.8125rem; background: ${isChecked ? 'var(--lt-surface-50)' : 'transparent'}; color: var(--lt-text-primary);">
                    <input type="checkbox" ${attr('checked', isChecked)} style="accent-color: var(--lt-primary-600); pointer-events: none;" />
                    <span style="flex: 1;">${o.label}</span>
                </div>
            `.value;
        });
    }

    trigger.addEventListener('click', () => {
        if (props.disabled) return;
        disclosure.toggle();
    }, { signal: ctx?.signal });

    trigger.addEventListener('keydown', (e: KeyboardEvent) => {
        if (props.disabled) return;
        const isClosed = overlay.style.display === 'none' || overlay.style.display === '';
        if (isClosed) {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                disclosure.open();
                return;
            }
        } else {
            if (!nav.handleKeyDown(e)) {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    disclosure.close();
                    trigger.focus();
                }
                return;
            }
        }
    }, { signal: ctx?.signal });

    // Delegated item click handling, attached once here (instead of a per-row
    // listener rebound on every renderList()) - looks up which option was
    // clicked via patchList's own `data-key` wrapper.
    itemsList.addEventListener('click', (event) => {
        const key = (event.target as HTMLElement).closest('[data-key]')?.getAttribute('data-key');
        if (key === null || key === undefined) return;
        const match = options.find(o => String(o.value) === key);
        if (match) {
            const next = new Set(selected());
            if (next.has(match.value)) next.delete(match.value);
            else next.add(match.value);
            selected.set(next);
        }
        syncValue();
    }, { signal: ctx?.signal });

    clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selected.set(new Set());
        syncValue();
    }, { signal: ctx?.signal });

    selectAllChk.parentElement?.addEventListener('click', () => {
        const filtered = getFilteredOptions();
        const current = selected();
        const allChecked = filtered.every(o => current.has(o.value));
        const next = new Set(current);
        if (allChecked) {
            filtered.forEach(o => next.delete(o.value));
        } else {
            filtered.forEach(o => next.add(o.value));
        }
        selected.set(next);
        syncValue();
    }, { signal: ctx?.signal });

    filterInput.addEventListener('input', () => {
        filterQuery.set(filterInput.value);
    }, { signal: ctx?.signal });

    filterInput.addEventListener('keydown', (e: KeyboardEvent) => {
        if (!nav.handleKeyDown(e)) {
            if (e.key === 'Escape') {
                e.preventDefault();
                disclosure.close();
                trigger.focus();
            }
            return;
        }
    }, { signal: ctx?.signal });

    function syncValue() {
        const current = selected();
        formField.setValue(Array.from(current));

        emitComponentEvent(container, 'multiselect', 'change', {
            value: Array.from(current)
        });
        announce(`${current.size} items selected`, 'polite');
    }

    // Reactive rendering: these effects replace every manual renderDisplay()/
    // renderList() call that used to follow a `selected`/`filterQuery` mutation -
    // each now re-runs automatically whenever the signal(s) it reads change.
    // `syncValue()` stays an explicit one-shot call at each mutation site (it
    // emits a change event / writes the hidden form field - a side effect, not a
    // render), so it is intentionally NOT wrapped here.
    effect(renderDisplay);
    effect(renderList);
    syncValue();
}
