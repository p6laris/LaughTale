import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
import { injectIslandStyle } from '../runtime/styles';
import { useControllableState } from '../composables/useControllableState';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'native',
    element: 'input'
};

export interface InputTagsProps {
    values?: string[] | string;
    value?: string[] | string;
    placeholder?: string;
    separator?: string;
    delimiter?: string;
    addOnPaste?: boolean;
    allowDuplicate?: boolean;
    max?: number;
    typeahead?: boolean;
    suggestions?: string[] | string;
    variant?: 'outlined' | 'filled';
    size?: 'small' | 'normal' | 'large';
    fluid?: boolean;
    disabled?: boolean;
    readonlyMode?: boolean;
    invalid?: boolean;
    targetInputName?: string;
    inputId?: string;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
.laughtale-inputtags,
.p-inputtags {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    position: relative;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    width: auto;
    min-height: 2.5rem;
    padding: 0.25rem 0.5rem;
    gap: 0.375rem;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
    cursor: text;
}

.p-inputtags.p-inputtags-fluid {
    display: flex;
    width: 100%;
}

.p-inputtags:hover:not(.is-disabled) {
    border-color: var(--lt-surface-400);
}

.p-inputtags:focus-within:not(.is-disabled) {
    border-color: var(--lt-primary-500) !important;
    box-shadow: 0 0 0 1px var(--lt-primary-500) !important;
}

/* Variant: Filled */
.p-inputtags.variant-filled {
    background: var(--lt-surface-100);
    border-color: transparent;
}
.p-inputtags.variant-filled:focus-within {
    background: var(--lt-surface-0);
    border-color: var(--lt-primary-500) !important;
}

/* Invalid State */
.p-inputtags.is-invalid {
    border-color: var(--p-red-500, var(--lt-danger-500)) !important;
}
.p-inputtags.is-invalid:focus-within {
    box-shadow: 0 0 0 1px var(--p-red-500, var(--lt-danger-500)) !important;
}

/* Disabled State */
.p-inputtags.is-disabled {
    background: var(--lt-surface-100);
    opacity: 0.75;
    cursor: not-allowed;
}

/* Sizes */
.p-inputtags.size-small {
    min-height: 2rem;
    padding: 0.125rem 0.375rem;
    gap: 0.25rem;
}
.p-inputtags.size-small .p-inputtags-tag {
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
}
.p-inputtags.size-small .p-inputtags-input {
    font-size: 0.75rem;
}

.p-inputtags.size-large {
    min-height: 3rem;
    padding: 0.375rem 0.75rem;
    gap: 0.5rem;
}
.p-inputtags.size-large .p-inputtags-tag {
    font-size: 0.9375rem;
    padding: 0.25rem 0.625rem;
}
.p-inputtags.size-large .p-inputtags-input {
    font-size: 1rem;
}

/* Tags / Chips */
.p-inputtags-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: var(--lt-surface-100);
    color: var(--lt-surface-800);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    padding: 0.1875rem 0.5rem;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.2;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
    user-select: none;
}

.p-inputtags-tag:focus,
.p-inputtags-tag.is-focused {
    outline: none;
    border-color: var(--lt-primary-500);
    background: var(--lt-primary-50);
    color: var(--lt-primary-700);
}

.p-inputtags-tag-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--lt-surface-400);
    cursor: pointer;
    padding: 0;
    margin: 0;
    border-radius: 9999px;
    transition: color 150ms ease, background 150ms ease;
}
.p-inputtags-tag-remove:hover {
    color: var(--lt-surface-700);
}
.p-inputtags-tag-remove svg {
    width: 14px;
    height: 14px;
}

/* Native Input Field */
.p-inputtags-input {
    flex: 1 1 60px;
    min-width: 60px;
    border: none !important;
    outline: none !important;
    background: transparent !important;
    font-family: inherit;
    font-size: 0.875rem;
    color: var(--lt-text-primary);
    padding: 0.1875rem 0.25rem !important;
    margin: 0 !important;
    box-sizing: border-box;
    line-height: 1.2;
    box-shadow: none !important;
}
.p-inputtags-input:disabled {
    cursor: not-allowed;
    color: var(--p-text-muted);
}

/* ==================== TYPEAHEAD SUGGESTIONS DROPDOWN ==================== */
.p-inputtags-panel {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    min-width: 180px;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
    z-index: 1000;
    max-height: 220px;
    overflow-y: auto;
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    animation: pInputTagsFadeIn 150ms ease;
}
@keyframes pInputTagsFadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
}

.p-inputtags-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--lt-radius) - 2px);
    font-size: 0.875rem;
    color: var(--lt-text-primary);
    cursor: pointer;
    transition: background 120ms ease;
    user-select: none;
}
.p-inputtags-item:hover,
.p-inputtags-item.is-highlighted {
    background: var(--lt-surface-100);
    color: var(--lt-surface-900);
}

/* ==================== DARK MODE ==================== */
html.dark .laughtale-inputtags,
html.dark .p-inputtags,
[data-theme="dark"] .laughtale-inputtags,
[data-theme="dark"] .p-inputtags,
.dark .laughtale-inputtags,
.dark .p-inputtags {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
}
html.dark .p-inputtags:hover:not(.is-disabled),
[data-theme="dark"] .p-inputtags:hover:not(.is-disabled),
.dark .p-inputtags:hover:not(.is-disabled) {
    border-color: var(--p-surface-400);
}
html.dark .p-inputtags.variant-filled,
[data-theme="dark"] .p-inputtags.variant-filled,
.dark .p-inputtags.variant-filled {
    background: var(--p-surface-100);
}
html.dark .p-inputtags.variant-filled:focus-within,
[data-theme="dark"] .p-inputtags.variant-filled:focus-within,
.dark .p-inputtags.variant-filled:focus-within {
    background: var(--p-surface-0);
}
html.dark .p-inputtags-tag,
[data-theme="dark"] .p-inputtags-tag,
.dark .p-inputtags-tag {
    background: var(--p-surface-100);
    color: var(--p-text-color);
    border-color: var(--p-border-color);
}
html.dark .p-inputtags-tag:focus,
html.dark .p-inputtags-tag.is-focused,
[data-theme="dark"] .p-inputtags-tag:focus,
[data-theme="dark"] .p-inputtags-tag.is-focused,
.dark .p-inputtags-tag:focus,
.dark .p-inputtags-tag.is-focused {
    background: var(--p-surface-200);
    border-color: var(--p-primary-500);
    color: var(--p-primary-300);
}
html.dark .p-inputtags-tag-remove,
[data-theme="dark"] .p-inputtags-tag-remove,
.dark .p-inputtags-tag-remove {
    color: var(--p-text-muted);
}
html.dark .p-inputtags-tag-remove:hover,
[data-theme="dark"] .p-inputtags-tag-remove:hover,
.dark .p-inputtags-tag-remove:hover {
    color: var(--p-text-color);
}
html.dark .p-inputtags-input,
[data-theme="dark"] .p-inputtags-input,
.dark .p-inputtags-input {
    color: var(--p-text-color);
}
html.dark .p-inputtags-panel,
[data-theme="dark"] .p-inputtags-panel,
.dark .p-inputtags-panel {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
}
html.dark .p-inputtags-item:hover,
html.dark .p-inputtags-item.is-highlighted,
[data-theme="dark"] .p-inputtags-item:hover,
[data-theme="dark"] .p-inputtags-item.is-highlighted,
.dark .p-inputtags-item:hover,
.dark .p-inputtags-item.is-highlighted {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}
`;

const xCircleIcon = html`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`;

export default function InputTagsIsland(container: HTMLElement, props: InputTagsProps, ctx?: IslandContext) {
    injectIslandStyle('laughtale-inputtags', CSS);

    // Initial value parsing
    let initialValues: string[] = [];
    const rawVal = props.values ?? props.value;
    if (Array.isArray(rawVal)) {
        initialValues = rawVal.map(String);
    } else if (typeof rawVal === 'string' && rawVal.trim().length > 0) {
        try {
            const parsed = JSON.parse(rawVal);
            if (Array.isArray(parsed)) initialValues = parsed.map(String);
            else initialValues = rawVal.split(',').map(s => s.trim()).filter(Boolean);
        } catch {
            initialValues = rawVal.split(',').map(s => s.trim()).filter(Boolean);
        }
    }

    const [getTags, setTags] = useControllableState<string[]>({
        defaultValue: initialValues,
        onChange: (tags) => {
            syncTargetInput(tags);
        }
    });

    const isFluid = props.fluid === true || String(props.fluid) === 'true';
    const isFilled = props.variant === 'filled';
    const isDisabled = props.disabled === true || String(props.disabled) === 'true';
    const isReadonly = props.readonlyMode === true || String(props.readonlyMode) === 'true';
    const isInvalid = props.invalid === true || String(props.invalid) === 'true';
    const allowDuplicate = props.allowDuplicate === true || String(props.allowDuplicate) === 'true';
    const addOnPaste = props.addOnPaste !== false && String(props.addOnPaste) !== 'false';
    const maxItems = props.max ? Number(props.max) : null;
    const delimiter = props.delimiter || props.separator || ',';
    const hasTypeahead = props.typeahead === true || String(props.typeahead) === 'true';

    // Parse suggestions list
    let suggestionsList: string[] = [];
    if (props.suggestions) {
        if (Array.isArray(props.suggestions)) suggestionsList = props.suggestions;
        else if (typeof props.suggestions === 'string') {
            try {
                const parsed = JSON.parse(props.suggestions);
                if (Array.isArray(parsed)) suggestionsList = parsed;
            } catch {
                suggestionsList = props.suggestions.split(',').map(s => s.trim()).filter(Boolean);
            }
        }
    }

    let activeSuggestionIndex = -1;
    let filteredSuggestions: string[] = [];

    function createTagElement(tag: string, index: number): HTMLElement {
        const el = document.createElement('span');
        el.className = 'p-inputtags-tag'; container.setAttribute('data-part', 'root');
        el.setAttribute('data-index', String(index));
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'option');
        el.setAttribute('aria-selected', 'true');

        setHtml(el, html`
            <span class="p-inputtags-tag-label" data-part="root">${tag}</span>
            ${!isDisabled && !isReadonly ? html`
                <button type="button" class="p-inputtags-tag-remove" data-index="${index}" aria-label="Remove ${tag}" tabindex="-1">
                    ${xCircleIcon}
                </button>
            ` : ''}
        `);

        bindTagEvents(el);
        return el;
    }

    function bindTagEvents(tagEl: HTMLElement) {
        const removeBtn = tagEl.querySelector<HTMLButtonElement>('.p-inputtags-tag-remove');
        if (removeBtn) {
            removeBtn.addEventListener('mousedown', (e) => e.preventDefault(), { signal: ctx?.signal });
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = Number(tagEl.getAttribute('data-index'));
                removeTag(idx);
            }, { signal: ctx?.signal });
        }

        tagEl.addEventListener('keydown', (e) => {
            const idx = Number(tagEl.getAttribute('data-index'));
            if (e.key === 'Backspace' || e.key === 'Delete') {
                e.preventDefault();
                removeTag(idx);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevTag = tagEl.previousElementSibling as HTMLElement;
                if (prevTag && prevTag.classList.contains('p-inputtags-tag')) {
                    prevTag.focus();
                }
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextTag = tagEl.nextElementSibling as HTMLElement;
                if (nextTag && nextTag.classList.contains('p-inputtags-tag')) {
                    nextTag.focus();
                } else {
                    const input = container.querySelector<HTMLInputElement>('.p-inputtags-input');
                    input?.focus();
                }
            }
        }, { signal: ctx?.signal });
    }

    function updateTagIndices() {
        const allTags = container.querySelectorAll<HTMLElement>('.p-inputtags-tag');
        allTags.forEach((el, i) => {
            el.setAttribute('data-index', String(i));
            const btn = el.querySelector<HTMLButtonElement>('.p-inputtags-tag-remove');
            if (btn) btn.setAttribute('data-index', String(i));
        });

        const input = container.querySelector<HTMLInputElement>('.p-inputtags-input');
        if (input) {
            const current = getTags();
            if (current.length === 0) {
                input.placeholder = props.placeholder || '';
            } else {
                input.placeholder = '';
            }

            if (maxItems !== null && current.length >= maxItems) {
                input.style.display = 'none';
            } else {
                input.style.display = '';
            }
        }
    }

    function addTag(val: string) {
        val = val.trim();
        if (!val) return;

        const current = getTags();
        if (maxItems !== null && current.length >= maxItems) return;

        if (!allowDuplicate && current.includes(val)) {
            // Flash existing tag without re-render
            const existingEl = container.querySelector<HTMLElement>(`.p-inputtags-tag[data-index="${current.indexOf(val)}"]`);
            if (existingEl) {
                existingEl.classList.add('is-focused');
                const t = setTimeout(() => existingEl.classList.remove('is-focused'), 300);
                ctx?.onCleanup?.(() => clearTimeout(t));
            }
            return;
        }

        const newTags = [...current, val];
        setTags(newTags);

        // Incremental DOM update: Insert tag before input WITHOUT rebuilding container
        const input = container.querySelector<HTMLInputElement>('.p-inputtags-input');
        const tagEl = createTagElement(val, current.length);
        if (input) {
            container.insertBefore(tagEl, input);
            input.value = '';
        } else {
            container.appendChild(tagEl);
        }

        updateTagIndices();

        container.dispatchEvent(new CustomEvent('tags:add', {
            bubbles: true,
            detail: { value: val, values: newTags }
        }));
    }

    function removeTag(index: number) {
        const current = getTags();
        if (index < 0 || index >= current.length) return;
        const removedVal = current[index];
        const newTags = current.filter((_, i) => i !== index);
        setTags(newTags);

        // Incremental DOM update: remove target tag element
        const tagEl = container.querySelector<HTMLElement>(`.p-inputtags-tag[data-index="${index}"]`);
        if (tagEl) {
            tagEl.remove();
        }

        updateTagIndices();

        const input = container.querySelector<HTMLInputElement>('.p-inputtags-input');
        input?.focus();

        container.dispatchEvent(new CustomEvent('tags:remove', {
            bubbles: true,
            detail: { value: removedVal, index, values: newTags }
        }));
    }

    function init() {
        const tags = getTags();
        const inputIdAttr = props.inputId ? `id="${props.inputId}"` : '';
        const isMaxReached = maxItems !== null && tags.length >= maxItems;

        container.className = 'laughtale-inputtags p-inputtags';
        container.setAttribute('role', 'listbox');
        container.setAttribute('aria-orientation', 'horizontal');
        if (isFluid) container.classList.add('p-inputtags-fluid');
        if (isFilled) container.classList.add('variant-filled');
        if (props.size) container.classList.add(`size-${props.size}`);
        if (isInvalid) container.classList.add('is-invalid');
        if (isDisabled) container.classList.add('is-disabled');

        const tagsHtml = tags.map((tag, idx) => html`
            <span class="p-inputtags-tag" data-index="${idx}" tabindex="0" role="option" aria-selected="true">
                <span class="p-inputtags-tag-label">${tag}</span>
                ${!isDisabled && !isReadonly ? html`
                    <button type="button" class="p-inputtags-tag-remove" data-index="${idx}" aria-label="Remove ${tag}" tabindex="-1">
                        ${xCircleIcon}
                    </button>
                ` : ''}
            </span>
        `);

        const inputHtml = html`
            <input type="text"
                   class="p-inputtags-input"
                   ${attr('id', props.inputId)}
                   ${attr('placeholder', tags.length === 0 ? (props.placeholder || '') : '')}
                   ${attr('disabled', isDisabled)}
                   ${attr('readonly', isReadonly)}
                   autocomplete="off"
                   spellcheck="false"
                   ${isMaxReached ? 'style="display: none;"' : ''}
                   ${hasTypeahead ? 'role="combobox" aria-autocomplete="list" aria-expanded="false"' : ''} />
        `;

        setHtml(container, html`
            ${tagsHtml}
            ${inputHtml}
            ${hasTypeahead ? html`<div class="p-inputtags-panel" style="display: none;"></div>` : ''}
        `);

        // Bind initial tag events
        container.querySelectorAll<HTMLElement>('.p-inputtags-tag').forEach(bindTagEvents);

        // Container click focuses input
        container.addEventListener('click', (e) => {
            if (e.target === container || (e.target as HTMLElement).classList.contains('p-inputtags')) {
                const input = container.querySelector<HTMLInputElement>('.p-inputtags-input');
                input?.focus();
            }
        }, { signal: ctx?.signal });

        bindInputEvents();
    }

    function bindInputEvents() {
        if (isDisabled || isReadonly) return;

        const input = container.querySelector<HTMLInputElement>('.p-inputtags-input');
        const panel = container.querySelector<HTMLElement>('.p-inputtags-panel');
        if (!input) return;

        // Keyboard commands on input
        input.addEventListener('keydown', (e) => {
            const val = input.value;
            const current = getTags();

            // Delimiter check (e.g. comma or custom)
            if (delimiter && e.key === delimiter) {
                e.preventDefault();
                if (val.trim()) {
                    addTag(val);
                }
                closeTypeahead();
                return;
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                if (hasTypeahead && activeSuggestionIndex >= 0 && filteredSuggestions[activeSuggestionIndex]) {
                    addTag(filteredSuggestions[activeSuggestionIndex]);
                    closeTypeahead();
                } else if (val.trim()) {
                    addTag(val);
                    closeTypeahead();
                }
            } else if (e.key === 'Backspace' && !val && current.length > 0) {
                // Delete last tag
                removeTag(current.length - 1);
            } else if (e.key === 'ArrowLeft' && !val && current.length > 0) {
                // Focus previous tag
                const allTags = container.querySelectorAll<HTMLElement>('.p-inputtags-tag');
                if (allTags.length > 0) {
                    allTags[allTags.length - 1].focus();
                }
            } else if (hasTypeahead && panel) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (filteredSuggestions.length > 0) {
                        activeSuggestionIndex = (activeSuggestionIndex + 1) % filteredSuggestions.length;
                        updateSuggestionHighlight();
                    }
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (filteredSuggestions.length > 0) {
                        activeSuggestionIndex = (activeSuggestionIndex - 1 + filteredSuggestions.length) % filteredSuggestions.length;
                        updateSuggestionHighlight();
                    }
                } else if (e.key === 'Escape') {
                    closeTypeahead();
                } else if (e.key === 'Tab' && activeSuggestionIndex >= 0 && filteredSuggestions[activeSuggestionIndex]) {
                    addTag(filteredSuggestions[activeSuggestionIndex]);
                    closeTypeahead();
                }
            }
        }, { signal: ctx?.signal });

        // Add on paste support
        input.addEventListener('paste', (e) => {
            if (!addOnPaste) return;
            const pasteData = e.clipboardData?.getData('text');
            if (pasteData && (pasteData.includes(',') || (delimiter && pasteData.includes(delimiter)))) {
                e.preventDefault();
                const splitRegex = new RegExp(`[\\s,${delimiter}]+`);
                const items = pasteData.split(splitRegex).map(s => s.trim()).filter(Boolean);
                items.forEach(item => addTag(item));
            }
        }, { signal: ctx?.signal });

        // Typeahead suggestions filtering
        if (hasTypeahead && panel) {
            input.addEventListener('input', () => {
                const query = input.value.trim().toLowerCase();
                if (!query) {
                    closeTypeahead();
                    return;
                }

                const current = getTags();
                filteredSuggestions = suggestionsList.filter(s => {
                    const match = s.toLowerCase().includes(query);
                    return allowDuplicate ? match : (match && !current.includes(s));
                });

                if (filteredSuggestions.length > 0) {
                    activeSuggestionIndex = 0;
                    renderTypeaheadPanel();
                } else {
                    closeTypeahead();
                }
            }, { signal: ctx?.signal });

            document.addEventListener('click', (e) => {
                if (!container.contains(e.target as Node)) {
                    closeTypeahead();
                }
            }, { signal: ctx?.signal });
        }
    }

    function renderTypeaheadPanel() {
        const panel = container.querySelector<HTMLElement>('.p-inputtags-panel');
        const input = container.querySelector<HTMLInputElement>('.p-inputtags-input');
        if (!panel) return;

        panel.style.display = 'flex';
        input?.setAttribute('aria-expanded', 'true');

        setHtml(panel, html`
            ${filteredSuggestions.map((item, idx) => html`
                <div class="p-inputtags-item ${idx === activeSuggestionIndex ? 'is-highlighted' : ''}" data-index="${idx}">
                    <span>${item}</span>
                </div>
            `)}
        `);

        panel.querySelectorAll<HTMLElement>('.p-inputtags-item').forEach(itemEl => {
            itemEl.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = Number(itemEl.getAttribute('data-index'));
                if (filteredSuggestions[idx]) {
                    addTag(filteredSuggestions[idx]);
                    closeTypeahead();
                }
            }, { signal: ctx?.signal });
        });
    }

    function updateSuggestionHighlight() {
        const panel = container.querySelector<HTMLElement>('.p-inputtags-panel');
        if (!panel) return;
        panel.querySelectorAll<HTMLElement>('.p-inputtags-item').forEach((el, idx) => {
            el.classList.toggle('is-highlighted', idx === activeSuggestionIndex);
            if (idx === activeSuggestionIndex) {
                el.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    function closeTypeahead() {
        const panel = container.querySelector<HTMLElement>('.p-inputtags-panel');
        const input = container.querySelector<HTMLInputElement>('.p-inputtags-input');
        if (panel) panel.style.display = 'none';
        input?.setAttribute('aria-expanded', 'false');
        activeSuggestionIndex = -1;
        filteredSuggestions = [];
    }

    function syncTargetInput(tags: string[]) {
        if (props.targetInputName) {
            let hidden = container.querySelector<HTMLInputElement>(`input[name="${props.targetInputName}"]`);
            if (!hidden) {
                hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = props.targetInputName;
                container.appendChild(hidden);
            }
            hidden.value = JSON.stringify(tags);
        }

        container.dispatchEvent(new CustomEvent('inputtags:change', {
            bubbles: true,
            detail: { values: tags }
        }));
        container.dispatchEvent(new CustomEvent('chips:change', {
            bubbles: true,
            detail: { values: tags }
        }));
    }

    init();
}
