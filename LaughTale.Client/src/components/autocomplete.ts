import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { LucideIcons } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';
import { useDisclosure } from '../composables/useDisclosure';
import { useClickOutside } from '../composables/useClickOutside';
import { useDebounce } from '../composables/useDebounce';
import { html, setHtml, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'combobox'
};

export interface AutoCompleteItem {
    label: string;
    value: string;
    category?: string;
    group?: string;
    icon?: string;
    shortcut?: string;
    avatar?: string;
    status?: string;
    subtitle?: string;
    count?: string | number;
    disabled?: boolean;
}

export interface AutoCompleteProps {
    items?: AutoCompleteItem[];
    suggestions?: AutoCompleteItem[];
    placeholder?: string;
    targetInputName?: string;
    value?: string | string[];
    disabled?: boolean;
    dropdown?: boolean;
    showClear?: boolean;
    forceSelection?: boolean;
    multiple?: boolean;
    size?: 'small' | 'normal' | 'large';
    variant?: 'outlined' | 'filled';
    invalid?: boolean;
    fluid?: boolean;
    loading?: boolean;
    scrollHeight?: string;
    optionGroupLabel?: string;
    optionGroupChildren?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
.laughtale-autocomplete {
    position: relative;
    display: inline-flex;
    align-items: stretch;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}
.laughtale-autocomplete.fluid {
    width: 100%;
}
.laughtale-autocomplete:not(.fluid) {
    width: 100%;
    max-width: 320px;
}

.ac-input-container {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    box-sizing: border-box;
    cursor: text;
    position: relative;
}
.laughtale-autocomplete.has-dropdown .ac-input-container {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.ac-input-container.variant-filled {
    background: var(--lt-surface-50);
}
.ac-input-container.focused {
    border-color: var(--lt-primary-500);
    box-shadow: 0 0 0 1px var(--lt-primary-500);
    z-index: 2;
}
.ac-input-container.invalid {
    border-color: var(--lt-danger-500, var(--lt-danger-500)) !important;
    box-shadow: 0 0 0 1px var(--lt-danger-500, var(--lt-danger-500)) !important;
}
.ac-input-container.disabled {
    background: var(--lt-surface-100);
    opacity: 0.65;
    cursor: not-allowed;
}

/* Sizes */
.ac-input-container.size-small {
    min-height: 2rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
}
.ac-input-container.size-normal {
    min-height: 2.5rem;
    padding: 0 0.75rem;
    font-size: 0.875rem;
}
.ac-input-container.size-large {
    min-height: 3rem;
    padding: 0 1rem;
    font-size: 1rem;
}

.ac-chips-wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
    flex: 1;
    min-width: 0;
    padding: 0.25rem 0;
}
.ac-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: var(--lt-surface-100);
    color: var(--lt-text-primary);
    border-radius: calc(var(--lt-radius) - 2px);
    padding: 0.15rem 0.45rem;
    font-size: 0.75rem;
    font-weight: 500;
}
.ac-chip-remove {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: var(--p-text-muted);
    border: none;
    background: transparent;
    padding: 0;
    font-size: 0.75rem;
}
.ac-chip-remove:hover {
    color: var(--lt-danger-500, var(--lt-danger-500));
}

.ac-input {
    flex: 1;
    min-width: 60px;
    border: none;
    outline: none;
    background: transparent;
    color: var(--lt-text-primary);
    font-family: inherit;
    font-size: inherit;
    padding: 0.35rem 0;
}
.ac-input::placeholder {
    color: var(--p-text-muted);
}
.ac-input:disabled {
    cursor: not-allowed;
}

.ac-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--p-text-muted);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    transition: color 0.15s ease, background 0.15s ease;
    flex-shrink: 0;
    margin-left: 0.25rem;
}
.ac-btn-icon:hover {
    color: var(--lt-text-primary);
    background: var(--lt-surface-100);
}

.ac-dropdown-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--lt-surface-200);
    border-left: none;
    background: var(--lt-surface-100);
    color: var(--p-text-muted);
    border-top-right-radius: var(--lt-radius);
    border-bottom-right-radius: var(--lt-radius);
    cursor: pointer;
    padding: 0 0.85rem;
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    flex-shrink: 0;
    box-sizing: border-box;
}
.ac-dropdown-btn:hover {
    background: var(--lt-surface-200);
    color: var(--lt-text-primary);
}
.ac-dropdown-btn:disabled {
    cursor: not-allowed;
    opacity: 0.65;
}

/* Sizes for dropdown button */
.size-small + .ac-dropdown-btn,
.laughtale-autocomplete .ac-dropdown-btn.size-small {
    padding: 0 0.6rem;
}
.size-large + .ac-dropdown-btn,
.laughtale-autocomplete .ac-dropdown-btn.size-large {
    padding: 0 1.1rem;
}

/* Floating Overlay Panel */
.ac-overlay {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    z-index: 1000;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    box-shadow: var(--p-shadow-lg);
    overflow-y: auto;
    padding: 0.35rem;
    display: none;
    box-sizing: border-box;
}
.ac-group-header {
    font-size: 0.725rem;
    font-weight: 700;
    color: var(--p-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.5rem 0.65rem 0.25rem;
    user-select: none;
}
.ac-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--lt-radius) - 2px);
    color: var(--lt-text-primary);
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
    font-size: 0.875rem;
    user-select: none;
    gap: 0.5rem;
}
.ac-item:hover, .ac-item.highlighted {
    background: var(--lt-surface-100);
}
.ac-item.selected {
    background: var(--lt-primary-50);
    color: var(--lt-primary-700);
    font-weight: 600;
}
.ac-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Dark Mode Aware Tokens */
html.dark .ac-input-container,
[data-theme="dark"] .ac-input-container,
.dark .ac-input-container {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    color: var(--p-text-color);
}
html.dark .ac-input-container:hover:not(.disabled),
[data-theme="dark"] .ac-input-container:hover:not(.disabled),
.dark .ac-input-container:hover:not(.disabled) {
    border-color: var(--p-surface-400);
}
html.dark .ac-input-container.variant-filled,
[data-theme="dark"] .ac-input-container.variant-filled,
.dark .ac-input-container.variant-filled {
    background: var(--p-surface-100);
}
html.dark .ac-input-container.variant-filled:focus-within,
[data-theme="dark"] .ac-input-container.variant-filled:focus-within,
.dark .ac-input-container.variant-filled:focus-within {
    background: var(--p-surface-0);
}
html.dark .ac-chip,
[data-theme="dark"] .ac-chip,
.dark .ac-chip {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}
html.dark .ac-dropdown-btn,
[data-theme="dark"] .ac-dropdown-btn,
.dark .ac-dropdown-btn {
    background: var(--p-surface-100);
    border-color: var(--p-border-color);
    color: var(--p-text-muted);
}
html.dark .ac-dropdown-btn:hover,
[data-theme="dark"] .ac-dropdown-btn:hover,
.dark .ac-dropdown-btn:hover {
    background: var(--p-surface-200);
    color: var(--p-text-color);
}
html.dark .ac-overlay,
[data-theme="dark"] .ac-overlay,
.dark .ac-overlay {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}
html.dark .ac-item:hover,
html.dark .ac-item.highlighted,
[data-theme="dark"] .ac-item:hover,
[data-theme="dark"] .ac-item.highlighted,
.dark .ac-item:hover,
.dark .ac-item.highlighted {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}
html.dark .ac-item.selected,
[data-theme="dark"] .ac-item.selected,
.dark .ac-item.selected {
    background: rgba(16, 185, 129, 0.15);
    color: var(--p-primary-300);
}
`;

export default function AutoCompleteIsland(container: HTMLElement, props: AutoCompleteProps, ctx?: IslandContext) {
    injectIslandStyle('autocomplete', CSS);
    
    const allItems: AutoCompleteItem[] = props.suggestions || props.items || [];
    const multiple = props.multiple === true;
    const showClear = props.showClear !== false;
    const hasDropdown = props.dropdown === true;
    const forceSelection = props.forceSelection === true;
    const size = props.size || 'normal';
    const variant = props.variant || 'outlined';
    const scrollHeight = props.scrollHeight || '14rem';
    
    let selectedValues: string[] = multiple 
        ? (Array.isArray(props.value) ? props.value : (props.value ? [props.value as string] : []))
        : (props.value ? [props.value as string] : []);
    
    let searchQuery = '';
    let highlightedIndex = -1;

    function getFilteredItems(): AutoCompleteItem[] {
        if (!searchQuery) return allItems;
        const q = searchQuery.toLowerCase();
        return allItems.filter(item => 
            item.label.toLowerCase().includes(q) || 
            item.value.toLowerCase().includes(q) ||
            (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
            (item.group && item.group.toLowerCase().includes(q)) ||
            (item.category && item.category.toLowerCase().includes(q))
        );
    }

    setHtml(container, html`
        <div class="laughtale-autocomplete ${props.fluid ? 'fluid' : ''} ${hasDropdown ? 'has-dropdown' : ''}" data-part="root">
            <div class="ac-input-container size-${size} variant-${variant} ${props.invalid ? 'invalid' : ''} ${props.disabled ? 'disabled' : ''}">
                <div class="ac-chips-wrapper">
                    <input type="text" 
                           class="ac-input" 
                           role="combobox"
                           aria-autocomplete="list"
                           aria-expanded="false"
                           aria-haspopup="listbox"
                           aria-controls="ac-overlay"
                           placeholder="${selectedValues.length === 0 ? (props.placeholder || 'Search...') : ''}" 
                           ${attr('disabled', props.disabled)} />
                </div>
                
                ${props.loading ? html`
                    <span class="ac-btn-icon" style="animation: spin 1s linear infinite;">
                        ${unsafe(LucideIcons.loader2 || '⏳') /* static spinner icon */}
                    </span>
                ` : ''}

                ${showClear ? html`
                    <button type="button" class="ac-btn-icon ac-btn-clear" style="display: none;" title="Clear value">
                        ${unsafe(LucideIcons.x) /* static close icon */}
                    </button>
                ` : ''}
            </div>

            ${hasDropdown ? html`
                <button type="button" class="ac-dropdown-btn size-${size}" ${attr('disabled', props.disabled)} title="Show all suggestions">
                    <span style="display: flex; width: 16px; height: 16px;">${unsafe(LucideIcons.chevronDown) /* static dropdown icon */}</span>
                </button>
            ` : ''}

            <!-- Suggestions Overlay -->
            <div class="ac-overlay" id="ac-overlay" role="listbox" style="max-height: ${scrollHeight};"></div>
        </div>
    `);

    const inputWrap = container.querySelector<HTMLElement>('.ac-input-container')!;
    const chipsWrap = container.querySelector<HTMLElement>('.ac-chips-wrapper')!;
    const input = container.querySelector<HTMLInputElement>('.ac-input')!;
    const clearBtn = container.querySelector<HTMLButtonElement>('.ac-btn-clear');
    const dropdownBtn = container.querySelector<HTMLButtonElement>('.ac-dropdown-btn');
    const overlay = container.querySelector<HTMLElement>('.ac-overlay')!;

    const disclosure = useDisclosure({
        defaultIsOpen: false,
        onOpen: () => {
            overlay.style.display = 'block';
            input.setAttribute('aria-expanded', 'true');
            renderDropdown();
        },
        onClose: () => {
            overlay.style.display = 'none';
            input.setAttribute('aria-expanded', 'false');
            highlightedIndex = -1;
            if (forceSelection && !multiple && searchQuery) {
                const exact = allItems.find(i => i.label.toLowerCase() === searchQuery.toLowerCase());
                if (!exact) {
                    input.value = selectedValues[0] ? (allItems.find(i => i.value === selectedValues[0])?.label || '') : '';
                    searchQuery = '';
                }
            }
        }
    });

    useClickOutside(container, () => {
        disclosure.close();
        inputWrap.classList.remove('focused');
    });

    function renderChips() {
        if (!multiple) {
            if (selectedValues[0]) {
                const found = allItems.find(i => i.value === selectedValues[0]);
                input.value = found ? found.label : selectedValues[0];
            } else {
                input.value = '';
            }
            updateClearButton();
            return;
        }

        chipsWrap.querySelectorAll('.ac-chip').forEach(el => el.remove());

        selectedValues.forEach(val => {
            const item = allItems.find(i => i.value === val) || { label: val, value: val };
            const chip = document.createElement('span');
            chip.className = 'ac-chip'; container.setAttribute('data-part', 'root');
            setHtml(chip, html`
                <span>${item.label}</span>
                <button type="button" class="ac-chip-remove" data-remove="${item.value}">&times;</button>
            `);
            chip.querySelector('.ac-chip-remove')?.addEventListener('click', (e) => {
                e.stopPropagation();
                removeValue(item.value);
            }, { signal: ctx?.signal });
            chipsWrap.insertBefore(chip, input);
        });

        input.placeholder = selectedValues.length === 0 ? (props.placeholder || 'Search...') : '';
        updateClearButton();
    }

    function updateClearButton() {
        if (!clearBtn) return;
        const hasContent = multiple ? selectedValues.length > 0 : (selectedValues.length > 0 || input.value.length > 0);
        clearBtn.style.display = hasContent && !props.disabled ? 'flex' : 'none';
    }

    function renderDropdown() {
        const filtered = getFilteredItems();

        if (filtered.length === 0) {
            setHtml(overlay, html`<div style="padding: 0.75rem; text-align: center; color: var(--p-text-muted); font-size: 0.8125rem;">No results found</div>`);
            return;
        }

        // Check for grouped items
        const groups: Record<string, AutoCompleteItem[]> = {};
        let isGrouped = false;

        filtered.forEach(item => {
            const grp = item.group || item.category || '';
            if (grp) isGrouped = true;
            if (!groups[grp]) groups[grp] = [];
            groups[grp].push(item);
        });

        const itemsFragments: Raw[] = [];
        let itemIndex = 0;

        if (isGrouped) {
            Object.entries(groups).forEach(([grpName, groupItems]) => {
                if (grpName) {
                    itemsFragments.push(html`<div class="ac-group-header">${grpName}</div>`);
                }
                groupItems.forEach(item => {
                    itemsFragments.push(renderOptionHtml(item, itemIndex++));
                });
            });
        } else {
            filtered.forEach(item => {
                itemsFragments.push(renderOptionHtml(item, itemIndex++));
            });
        }

        setHtml(overlay, html`${itemsFragments}`);

        overlay.querySelectorAll<HTMLElement>('.ac-item').forEach(itemEl => {
            itemEl.addEventListener('click', () => {
                const val = itemEl.getAttribute('data-value');
                const matched = allItems.find(i => i.value === val);
                if (matched && !matched.disabled) {
                    selectItem(matched);
                }
            }, { signal: ctx?.signal });
            itemEl.addEventListener('mouseenter', () => {
                const idx = Number(itemEl.getAttribute('data-idx'));
                highlightItem(idx);
            }, { signal: ctx?.signal });
        });
    }

    function renderOptionHtml(item: AutoCompleteItem, idx: number): Raw {
        const isSelected = selectedValues.includes(item.value);
        const isHighlighted = idx === highlightedIndex;
        
        let leadingHtml: Raw | string = '';
        if (item.avatar) {
            leadingHtml = html`<span style="width: 26px; height: 26px; border-radius: 50%; background: var(--lt-primary-600); color: var(--lt-surface-0, var(--lt-surface-0)); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0;">${item.avatar}</span>`;
        } else if (item.icon && LucideIcons[item.icon]) {
            leadingHtml = html`<span style="display: flex; width: 16px; height: 16px; color: var(--lt-primary-600); flex-shrink: 0;">${unsafe(LucideIcons[item.icon]) /* static icon from LucideIcons */}</span>`;
        }

        let statusHtml: Raw | string = '';
        if (item.status) {
            const statusColor = item.status === 'online' ? 'var(--lt-primary-500, var(--lt-primary-500))' : (item.status === 'away' ? 'var(--lt-warn-500, var(--lt-warn-500))' : 'var(--lt-surface-400, var(--lt-surface-400))');
            statusHtml = html`<span style="width: 8px; height: 8px; border-radius: 50%; background: ${statusColor}; margin-right: 0.35rem; display: inline-block;"></span>`;
        }

        let trailingHtml: Raw | string = '';
        if (item.shortcut) {
            trailingHtml = html`<span style="font-size: 0.725rem; background: var(--lt-surface-200); padding: 0.1rem 0.35rem; border-radius: 4px; color: var(--p-text-muted); font-family: monospace;">${item.shortcut}</span>`;
        } else if (item.count !== undefined) {
            trailingHtml = html`<span class="aura-tag tag-slate" style="font-size: 0.6875rem;">${item.count}</span>`;
        }

        return html`
            <div class="ac-item ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''} ${item.disabled ? 'disabled' : ''}" 
                 data-value="${item.value}" 
                 data-idx="${idx}" 
                 role="option" 
                 aria-selected="${isSelected ? 'true' : 'false'}">
                <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden;">
                    ${leadingHtml}
                    <div style="display: flex; flex-direction: column; overflow: hidden;">
                        <span style="font-weight: ${isSelected ? '700' : '500'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${statusHtml}${item.label}
                        </span>
                        ${item.subtitle ? html`<span style="font-size: 0.75rem; color: var(--p-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.subtitle}</span>` : ''}
                    </div>
                </div>
                ${trailingHtml}
            </div>
        `;
    }

    function highlightItem(idx: number) {
        highlightedIndex = idx;
        const items = overlay.querySelectorAll<HTMLElement>('.ac-item');
        items.forEach((it, i) => {
            if (i === idx) {
                it.classList.add('highlighted');
                it.scrollIntoView({ block: 'nearest' });
            } else {
                it.classList.remove('highlighted');
            }
        });
    }

    function selectItem(item: AutoCompleteItem) {
        if (multiple) {
            if (!selectedValues.includes(item.value)) {
                selectedValues.push(item.value);
            }
            searchQuery = '';
            input.value = '';
            renderChips();
            disclosure.close();
            syncValue();
            input.focus();
        } else {
            selectedValues = [item.value];
            searchQuery = '';
            input.value = item.label;
            disclosure.close();
            renderChips();
            syncValue();
        }
    }

    function removeValue(val: string) {
        selectedValues = selectedValues.filter(v => v !== val);
        renderChips();
        syncValue();
    }

    const debouncedFilter = useDebounce(() => {
        searchQuery = input.value;
        if (searchQuery.trim().length > 0) {
            if (!disclosure.isOpen) disclosure.open();
            else renderDropdown();
        } else {
            if (disclosure.isOpen) disclosure.close();
        }
        updateClearButton();
    }, 150);

    input.addEventListener('input', () => {
        debouncedFilter();
    }, { signal: ctx?.signal });

    input.addEventListener('focus', () => {
        inputWrap.classList.add('focused');
        // Do not open dropdown immediately on focus - only when user types or clicks dropdown button
    }, { signal: ctx?.signal });

    input.addEventListener('blur', () => {
        inputWrap.classList.remove('focused');
    }, { signal: ctx?.signal });

    input.addEventListener('keydown', (e) => {
        const filtered = getFilteredItems();
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!disclosure.isOpen) {
                disclosure.open();
            } else {
                const nextIdx = highlightedIndex < filtered.length - 1 ? highlightedIndex + 1 : 0;
                highlightItem(nextIdx);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (disclosure.isOpen) {
                const prevIdx = highlightedIndex > 0 ? highlightedIndex - 1 : filtered.length - 1;
                highlightItem(prevIdx);
            }
        } else if (e.key === 'Enter') {
            if (disclosure.isOpen && highlightedIndex >= 0 && filtered[highlightedIndex]) {
                e.preventDefault();
                selectItem(filtered[highlightedIndex]);
            }
        } else if (e.key === 'Escape') {
            disclosure.close();
        } else if (e.key === 'Backspace' && multiple && input.value === '' && selectedValues.length > 0) {
            removeValue(selectedValues[selectedValues.length - 1]);
        } else if (e.key === 'Home' && disclosure.isOpen) {
            e.preventDefault();
            highlightItem(0);
        } else if (e.key === 'End' && disclosure.isOpen) {
            e.preventDefault();
            highlightItem(filtered.length - 1);
        }
    }, { signal: ctx?.signal });

    clearBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedValues = [];
        searchQuery = '';
        input.value = '';
        renderChips();
        syncValue();
        disclosure.close();
        input.focus();
    }, { signal: ctx?.signal });

    dropdownBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (disclosure.isOpen) {
            disclosure.close();
        } else {
            searchQuery = '';
            disclosure.open();
            input.focus();
        }
    }, { signal: ctx?.signal });

    inputWrap.addEventListener('click', () => {
        input.focus();
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
            hidden.value = multiple ? JSON.stringify(selectedValues) : (selectedValues[0] || '');
        }

        container.dispatchEvent(new CustomEvent('autocomplete:change', {
            bubbles: true,
            detail: { value: multiple ? selectedValues : (selectedValues[0] || '') }
        }));
    }

    renderChips();
}
