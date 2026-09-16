import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise TreeSelect Component (Aura TreeSelect)
 * Hierarchical selection with single, multiple, and tri-state checkbox modes,
 * chip tags, instant tree filtering, header/footer templates, and full ARIA keyboard navigation.
 */

import { LucideIcons, getLucideIcon } from '../icons/lucide';
import { injectIslandStyle } from '../runtime/styles';
import { emitComponentEvent } from '../runtime/events';
import { useDisclosure } from '../composables/useDisclosure';
import { useClickOutside } from '../composables/useClickOutside';
import { useFloatingPosition } from '../composables/useFloatingPosition';
import { useControllableState } from '../composables/useControllableState';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import { useFormField } from '../composables/useFormField';
import { useLocale } from '../composables/useLocale';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'combobox'
};

export interface TreeNodeItem {
    key: string;
    id?: string;
    label: string;
    name?: string;
    data?: any;
    icon?: string;
    children?: TreeNodeItem[];
    leaf?: boolean;
    expanded?: boolean;
    selectable?: boolean;
    disabled?: boolean;
}

export interface TreeSelectProps {
    nodes?: TreeNodeItem[];
    options?: TreeNodeItem[];
    departments?: TreeNodeItem[];
    value?: string | string[] | Record<string, boolean>;
    selectedValue?: string | string[] | Record<string, boolean>;
    selectionMode?: 'single' | 'multiple' | 'checkbox';
    display?: 'comma' | 'chip';
    placeholder?: string;
    filter?: boolean;
    filterBy?: string;
    filterMode?: 'lenient' | 'strict';
    filterPlaceholder?: string;
    filterInputAutoFocus?: boolean;
    showClear?: boolean;
    clearable?: boolean;
    variant?: 'outlined' | 'filled';
    size?: 'small' | 'normal' | 'large';
    fluid?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    inputId?: string;
    name?: string;
    targetInputName?: string;
    header?: string;
    footer?: string;
    metaKeySelection?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const CSS = `
/* ==================== AURA TREESELECT ==================== */
.laughtale-treeselect,
.p-treeselect {
    display: inline-flex;
    position: relative;
    user-select: none;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    width: auto;
}

.p-treeselect.p-treeselect-fluid {
    display: flex;
    width: 100%;
}

/* Trigger Box */
.p-treeselect-label-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 2.5rem;
    padding: 0.375rem 0.75rem;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    color: var(--lt-text-primary);
    cursor: pointer;
    font-size: 0.875rem;
    line-height: 1.25;
    outline: none;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
    box-sizing: border-box;
}

.p-treeselect-label-container:hover:not(.is-disabled) {
    border-color: var(--lt-surface-400);
}

.p-treeselect.is-focused .p-treeselect-label-container,
.p-treeselect-label-container:focus-visible {
    border-color: var(--lt-primary-500) !important;
    box-shadow: 0 0 0 1px var(--lt-primary-500) !important;
}

/* Filled Variant */
.p-treeselect.variant-filled .p-treeselect-label-container {
    background-color: var(--lt-surface-100);
    border-color: transparent;
}
.p-treeselect.variant-filled .p-treeselect-label-container:hover:not(.is-disabled) {
    background-color: var(--lt-surface-200);
}
.p-treeselect.variant-filled.is-focused .p-treeselect-label-container {
    background-color: var(--lt-surface-0);
    border-color: var(--lt-primary-500) !important;
}

/* Sizes */
.p-treeselect.size-small .p-treeselect-label-container,
.p-treeselect.p-treeselect-sm .p-treeselect-label-container {
    min-height: 2rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}
.p-treeselect.size-large .p-treeselect-label-container,
.p-treeselect.p-treeselect-lg .p-treeselect-label-container {
    min-height: 3rem;
    padding: 0.5rem 1rem;
    font-size: 1.0625rem;
}

/* Invalid State */
.p-treeselect.is-invalid .p-treeselect-label-container {
    border-color: var(--p-red-500, var(--lt-danger-500)) !important;
}
.p-treeselect.is-invalid.is-focused .p-treeselect-label-container {
    box-shadow: 0 0 0 1px var(--p-red-500, var(--lt-danger-500)) !important;
}

/* Disabled State */
.p-treeselect.is-disabled {
    opacity: 0.65;
    cursor: not-allowed;
}
.p-treeselect.is-disabled .p-treeselect-label-container {
    background-color: var(--lt-surface-100);
    cursor: not-allowed;
    pointer-events: none;
}

/* Label & Chips */
.p-treeselect-label {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--lt-text-primary);
}
.p-treeselect-label.p-placeholder {
    color: var(--p-text-muted);
}

.p-treeselect-token {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.5rem;
    background: var(--lt-surface-100);
    color: var(--lt-surface-800);
    border: 1px solid var(--lt-surface-200);
    border-radius: calc(var(--lt-radius) - 2px);
    font-size: 0.75rem;
    font-weight: 500;
}
.p-treeselect-token-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--lt-surface-500);
    border: none;
    background: transparent;
    padding: 0;
    margin-inline-start: 0.125rem;
    border-radius: 9999px;
}
.p-treeselect-token-remove:hover {
    color: var(--lt-surface-900);
}

/* Actions (Clear & Chevron) */
.p-treeselect-actions {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-inline-start: 0.5rem;
}
.p-treeselect-clear-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--lt-surface-400);
    cursor: pointer;
    padding: 0.125rem;
    border-radius: 9999px;
    transition: color 150ms ease;
}
.p-treeselect-clear-icon:hover {
    color: var(--lt-surface-700);
}
.p-treeselect-dropdown-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--lt-surface-500);
    transition: transform 200ms ease;
}
.p-treeselect.is-open .p-treeselect-dropdown-icon {
    transform: rotate(180deg);
}

/* Dropdown Overlay */
.p-treeselect-overlay {
    min-width: 100%;
    z-index: 1000;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--lt-radius);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
    overflow: hidden;
    display: none;
}
.p-treeselect-overlay.is-open {
    display: block;
}

/* Filter / Search */
.p-treeselect-filter-container {
    padding: 0.5rem;
    background: var(--lt-surface-50);
    border-bottom: 1px solid var(--lt-surface-200);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.p-treeselect-filter-input {
    width: 100%;
    font-family: inherit;
    font-size: 0.8125rem;
    padding: 0.375rem 0.625rem;
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-200);
    border-radius: calc(var(--lt-radius) - 2px);
    color: var(--lt-text-primary);
    outline: none;
    box-sizing: border-box;
}
.p-treeselect-filter-input:focus {
    border-color: var(--lt-primary-500);
}

/* Header & Footer Templates */
.p-treeselect-header {
    padding: 0.5rem 0.75rem;
    background: var(--lt-surface-50);
    border-bottom: 1px solid var(--lt-surface-200);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--lt-text-primary);
}
.p-treeselect-footer {
    padding: 0.5rem 0.75rem;
    background: var(--lt-surface-50);
    border-top: 1px solid var(--lt-surface-200);
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* Tree Nodes List */
.p-treeselect-tree {
    max-height: 280px;
    overflow-y: auto;
    padding: 0.375rem;
    margin: 0;
    list-style: none;
}

.p-treenode {
    list-style: none;
    margin: 0;
    padding: 0;
}

.p-treenode-children {
    padding-inline-start: 1.25rem;
    margin: 0;
    list-style: none;
}

.p-treenode-content {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.5rem;
    border-radius: calc(var(--lt-radius) - 2px);
    cursor: pointer;
    color: var(--lt-text-primary);
    font-size: 0.8125rem;
    transition: background 150ms ease, color 150ms ease;
    outline: none;
}
.p-treenode-content:hover:not(.p-disabled) {
    background: var(--lt-surface-100);
    color: var(--lt-text-primary);
}
.p-treenode-content.p-highlight {
    background: var(--lt-primary-50);
    color: var(--lt-primary-700);
    font-weight: 600;
}
.p-treenode-content.p-highlight:hover:not(.p-disabled) {
    background: var(--lt-primary-100);
    color: var(--lt-primary-800);
}
.p-treenode-content.p-highlight .p-tree-toggler {
    color: var(--lt-primary-700);
}
.p-treenode-content.p-highlight .p-treenode-icon {
    color: var(--lt-primary-600);
}

.p-tree-toggler {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
    color: var(--lt-surface-500);
    border-radius: 9999px;
    transition: transform 150ms ease, color 150ms ease;
    border: none;
    background: transparent;
    padding: 0;
}
.p-tree-toggler:hover {
    color: var(--lt-surface-900);
}
.p-tree-toggler.p-expanded {
    transform: rotate(90deg);
}
.p-tree-toggler-empty {
    width: 1.25rem;
    height: 1.25rem;
    display: inline-block;
}

.p-treenode-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--lt-primary-600);
    width: 16px;
    height: 16px;
}

.p-treenode-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Checkbox inside tree node */
.p-tree-checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border: 1px solid var(--lt-surface-200);
    border-radius: 4px;
    background: var(--lt-surface-0);
    cursor: pointer;
    transition: all 150ms ease;
}
.p-tree-checkbox:hover {
    border-color: var(--lt-primary-500);
}
.p-tree-checkbox.p-checked {
    background: var(--lt-primary-500);
    border-color: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
}
.p-tree-checkbox.p-indeterminate {
    background: var(--lt-primary-500);
    border-color: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
.p-tree-checkbox svg {
    width: 12px;
    height: 12px;
}

/* ==================== DARK MODE ==================== */
html.dark .p-treeselect-label-container,
[data-theme="dark"] .p-treeselect-label-container,
.dark .p-treeselect-label-container {
    background-color: var(--p-surface-0);
    border-color: var(--p-border-color);
    color: var(--p-text-color);
}
html.dark .p-treeselect-label-container:hover:not(.is-disabled),
[data-theme="dark"] .p-treeselect-label-container:hover:not(.is-disabled),
.dark .p-treeselect-label-container:hover:not(.is-disabled) {
    border-color: var(--p-surface-400);
}
html.dark .p-treeselect.variant-filled .p-treeselect-label-container,
[data-theme="dark"] .p-treeselect.variant-filled .p-treeselect-label-container,
.dark .p-treeselect.variant-filled .p-treeselect-label-container {
    background-color: var(--p-surface-100);
}
html.dark .p-treeselect.variant-filled .p-treeselect-label-container:hover:not(.is-disabled),
[data-theme="dark"] .p-treeselect.variant-filled .p-treeselect-label-container:hover:not(.is-disabled),
.dark .p-treeselect.variant-filled .p-treeselect-label-container:hover:not(.is-disabled) {
    background-color: var(--p-surface-200);
}
html.dark .p-treeselect.variant-filled.is-focused .p-treeselect-label-container,
[data-theme="dark"] .p-treeselect.variant-filled.is-focused .p-treeselect-label-container,
.dark .p-treeselect.variant-filled.is-focused .p-treeselect-label-container {
    background-color: var(--p-surface-0);
}
html.dark .p-treeselect-token,
[data-theme="dark"] .p-treeselect-token,
.dark .p-treeselect-token {
    background: var(--p-surface-100);
    color: var(--p-text-color);
    border-color: var(--p-border-color);
}
html.dark .p-treeselect-overlay,
[data-theme="dark"] .p-treeselect-overlay,
.dark .p-treeselect-overlay {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);
}
html.dark .p-treeselect-filter-container,
html.dark .p-treeselect-header,
html.dark .p-treeselect-footer,
[data-theme="dark"] .p-treeselect-filter-container,
[data-theme="dark"] .p-treeselect-header,
[data-theme="dark"] .p-treeselect-footer,
.dark .p-treeselect-filter-container,
.dark .p-treeselect-header,
.dark .p-treeselect-footer {
    background: var(--p-surface-50);
    border-color: var(--p-border-color);
}
html.dark .p-treeselect-filter-input,
[data-theme="dark"] .p-treeselect-filter-input,
.dark .p-treeselect-filter-input {
    background: var(--p-surface-0);
    border-color: var(--p-border-color);
    color: var(--p-text-color);
}
html.dark .p-treenode-content:hover:not(.p-disabled),
[data-theme="dark"] .p-treenode-content:hover:not(.p-disabled),
.dark .p-treenode-content:hover:not(.p-disabled) {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}
html.dark .p-treenode-content.p-highlight,
[data-theme="dark"] .p-treenode-content.p-highlight,
.dark .p-treenode-content.p-highlight {
    background: rgba(16, 185, 129, 0.16);
    color: var(--p-primary-300);
    font-weight: 600;
}
html.dark .p-treenode-content.p-highlight:hover:not(.p-disabled),
[data-theme="dark"] .p-treenode-content.p-highlight:hover:not(.p-disabled),
.dark .p-treenode-content.p-highlight:hover:not(.p-disabled) {
    background: rgba(16, 185, 129, 0.24);
    color: var(--p-primary-200);
}
html.dark .p-treenode-content.p-highlight .p-tree-toggler,
[data-theme="dark"] .p-treenode-content.p-highlight .p-tree-toggler,
.dark .p-treenode-content.p-highlight .p-tree-toggler {
    color: var(--p-primary-300);
}
html.dark .p-treenode-content.p-highlight .p-treenode-icon,
[data-theme="dark"] .p-treenode-content.p-highlight .p-treenode-icon,
.dark .p-treenode-content.p-highlight .p-treenode-icon {
    color: var(--p-primary-400);
}
html.dark .p-tree-toggler,
[data-theme="dark"] .p-tree-toggler,
.dark .p-tree-toggler {
    color: var(--p-text-muted);
}
html.dark .p-tree-toggler:hover,
[data-theme="dark"] .p-tree-toggler:hover,
.dark .p-tree-toggler:hover {
    color: var(--p-text-color);
}
html.dark .p-tree-checkbox,
[data-theme="dark"] .p-tree-checkbox,
.dark .p-tree-checkbox {
    background: var(--p-surface-50);
    border-color: var(--p-border-color);
}

/* Bi-Directional RTL Support */
[dir="rtl"] .p-tree-toggler svg {
    transform: scaleX(-1);
}
`;

const checkSvg = getLucideIcon('check', 14, 3);
const minusSvg = getLucideIcon('minus', 14, 3);
const chevronRightSvg = getLucideIcon('chevron-right', 14, 2);
const chevronDownSvg = getLucideIcon('chevron-down', 14, 2);
const searchSvg = getLucideIcon('search', 14, 2);
const xSvg = getLucideIcon('x', 14, 2);

export default function TreeSelectIsland(container: HTMLElement, props: TreeSelectProps, ctx?: IslandContext) {
    injectIslandStyle('laughtale-treeselect', CSS);
    const locale = useLocale(ctx);

    const formField = useFormField(container, ctx, {
        cardinality: 'Multiple',
        name: props.name || props.targetInputName
    });

    const rawNodes: TreeNodeItem[] = props.nodes || props.options || props.departments || [];
    const selectionMode = props.selectionMode || 'single';
    const displayMode = props.display || 'comma';
    const isFilter = props.filter === true || String(props.filter) === 'true';
    const isShowClear = props.showClear === true || props.clearable === true || String(props.showClear) === 'true';
    const isFluid = props.fluid === true || String(props.fluid) === 'true';
    const isInvalid = props.invalid === true || String(props.invalid) === 'true';
    const isDisabled = props.disabled === true || String(props.disabled) === 'true';
    const isFilled = props.variant === 'filled';
    const size = props.size || 'normal';
    const placeholder = props.placeholder || 'Select Item';

    // Normalize tree nodes (ensure key & label exist)
    function normalizeNodes(nodes: TreeNodeItem[]): TreeNodeItem[] {
        return nodes.map(n => ({
            ...n,
            key: n.key || n.id || String(n.label || n.name),
            label: n.label || n.name || n.key || n.id || '',
            children: n.children ? normalizeNodes(n.children) : undefined
        }));
    }

    const treeData = normalizeNodes(rawNodes);

    // Flatten helper to lookup node by key
    const nodeMap = new Map<string, TreeNodeItem>();
    const parentMap = new Map<string, string | null>();

    function buildMaps(nodes: TreeNodeItem[], parentKey: string | null = null) {
        for (const n of nodes) {
            nodeMap.set(n.key, n);
            parentMap.set(n.key, parentKey);
            if (n.children && n.children.length > 0) {
                buildMaps(n.children, n.key);
            }
        }
    }
    buildMaps(treeData);

    // Initial selected keys set
    const selectedKeys = new Set<string>();
    const initialVal = props.value ?? props.selectedValue ?? formField.getValue();

    if (initialVal) {
        if (typeof initialVal === 'string') {
            try {
                const parsed = JSON.parse(initialVal);
                if (Array.isArray(parsed)) parsed.forEach(k => selectedKeys.add(String(k)));
                else if (typeof parsed === 'object' && parsed !== null) {
                    Object.entries(parsed).forEach(([k, v]) => { if (v) selectedKeys.add(k); });
                } else if (initialVal !== '') selectedKeys.add(initialVal);
            } catch {
                if (initialVal !== '') selectedKeys.add(initialVal);
            }
        } else if (Array.isArray(initialVal)) {
            initialVal.forEach(k => selectedKeys.add(String(k)));
        } else if (typeof initialVal === 'object') {
            Object.entries(initialVal).forEach(([k, v]) => { if (v) selectedKeys.add(k); });
        }
    }

    const expandedKeys = new Set<string>();
    // Auto-expand first level or nodes that have selected children
    treeData.forEach(n => {
        if (n.children && n.children.length > 0) {
            expandedKeys.add(n.key);
        }
    });

    let searchQuery = '';

    let floatingHandle: { update: () => void } | null = null;

    const disclosure = useDisclosure({
        defaultIsOpen: false,
        onOpen: () => {
            container.classList.add('is-open', 'is-focused');
            const overlay = container.querySelector<HTMLElement>('.p-treeselect-overlay');
            if (overlay) {
                overlay.classList.add('is-open');
                overlay.style.minWidth = `${container.offsetWidth || 200}px`;
                floatingHandle = useFloatingPosition(container, overlay, {
                    placement: 'bottom-start',
                    reposition: 'follow',
                    signal: ctx?.signal,
                    offset: 4,
                    isRtl: locale.isRtl
                });
            }
            if (isFilter) {
                const filterInp = container.querySelector<HTMLInputElement>('.p-treeselect-filter-input');
                const tFocus = setTimeout(() => filterInp?.focus(), 50);
                ctx?.onCleanup?.(() => clearTimeout(tFocus));
            }
        },
        onClose: () => {
            container.classList.remove('is-open', 'is-focused');
            const overlay = container.querySelector<HTMLElement>('.p-treeselect-overlay');
            if (overlay) overlay.classList.remove('is-open');
            floatingHandle = null;
        }
    });

    useClickOutside(container, () => disclosure.close(), { signal: ctx?.signal });

    function init() {
        const rootClasses = [
            'laughtale-treeselect',
            'p-treeselect',
            isFluid ? 'p-treeselect-fluid' : '',
            isFilled ? 'variant-filled' : '',
            size !== 'normal' ? `size-${size}` : '',
            isInvalid ? 'is-invalid' : '',
            isDisabled ? 'is-disabled' : ''
        ].filter(Boolean).join(' ');

        container.className = rootClasses;
        formField.detach();
        setHtml(container, html`
            <div class="p-treeselect-label-container" data-part="root" tabindex="${isDisabled ? '-1' : '0'}" role="combobox" aria-haspopup="tree" aria-expanded="false" aria-controls="${props.inputId || 'treeselect'}_overlay">
                <div class="p-treeselect-label"></div>
                <div class="p-treeselect-actions">
                    <button type="button" class="p-treeselect-clear-icon" aria-label="Clear selection" tabindex="-1" style="display: none;">
                        ${unsafe(xSvg)}
                    </button>
                    <span class="p-treeselect-dropdown-icon">
                        ${unsafe(chevronDownSvg)}
                    </span>
                </div>
            </div>

            <div class="p-treeselect-overlay" id="${props.inputId || 'treeselect'}_overlay" role="dialog">
                ${props.header ? html`<div class="p-treeselect-header">${props.header}</div>` : ''}
                ${isFilter ? html`
                    <div class="p-treeselect-filter-container">
                        <span style="color: var(--lt-surface-400); display: flex;">${unsafe(searchSvg)}</span>
                        <input type="text" class="p-treeselect-filter-input" placeholder="${props.filterPlaceholder || 'Search tree...'}" />
                    </div>
                ` : ''}
                <ul class="p-treeselect-tree" role="tree"></ul>
                ${props.footer ? html`<div class="p-treeselect-footer">${props.footer}</div>` : ''}
            </div>
        `);
        formField.reattach();

        updateTriggerDisplay();
        renderTreeList();
        bindEvents();
        formField.setValue(Array.from(selectedKeys));
    }

    function getSelectedLabels(): { key: string; label: string }[] {
        const result: { key: string; label: string }[] = [];
        selectedKeys.forEach(k => {
            const node = nodeMap.get(k);
            if (node) result.push({ key: node.key, label: node.label });
        });
        return result;
    }

    function updateTriggerDisplay() {
        const labelEl = container.querySelector<HTMLElement>('.p-treeselect-label')!;
        const clearBtn = container.querySelector<HTMLElement>('.p-treeselect-clear-icon')!;

        const selected = getSelectedLabels();

        if (selected.length === 0) {
            labelEl.className = 'p-treeselect-label p-placeholder'; container.setAttribute('data-part', 'root');
            labelEl.textContent = placeholder;
            clearBtn.style.display = 'none';
        } else {
            labelEl.className = 'p-treeselect-label';
            if (isShowClear && !isDisabled) clearBtn.style.display = 'inline-flex';
            else clearBtn.style.display = 'none';

            if (displayMode === 'chip') {
                setHtml(labelEl, html`${selected.map(s => html`
                    <span class="p-treeselect-token">
                        <span>${s.label}</span>
                        ${!isDisabled ? html`<button type="button" class="p-treeselect-token-remove" data-key="${s.key}" aria-label="Remove ${s.label}">${unsafe(xSvg)}</button>` : ''}
                    </span>
                `)}`);

                labelEl.querySelectorAll<HTMLButtonElement>('.p-treeselect-token-remove').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const key = btn.getAttribute('data-key')!;
                        toggleNodeSelection(key, false);
                    }, { signal: ctx?.signal });
                });
            } else {
                labelEl.textContent = selected.map(s => s.label).join(', ');
            }
        }
    }

    function filterTree(nodes: TreeNodeItem[], query: string): TreeNodeItem[] {
        if (!query) return nodes;
        return nodes.reduce<TreeNodeItem[]>((acc, node) => {
            const matches = node.label.toLowerCase().includes(query) || node.key.toLowerCase().includes(query);
            const filteredChildren = node.children ? filterTree(node.children, query) : [];
            if (matches || filteredChildren.length > 0) {
                acc.push({
                    ...node,
                    children: filteredChildren.length > 0 ? filteredChildren : node.children
                });
            }
            return acc;
        }, []);
    }

    function getCheckboxState(node: TreeNodeItem): 'checked' | 'unchecked' | 'indeterminate' {
        if (!node.children || node.children.length === 0) {
            return selectedKeys.has(node.key) ? 'checked' : 'unchecked';
        }

        let allChecked = true;
        let noneChecked = true;

        function checkChildren(children: TreeNodeItem[]) {
            for (const child of children) {
                if (selectedKeys.has(child.key)) {
                    noneChecked = false;
                } else {
                    allChecked = false;
                }
                if (child.children) checkChildren(child.children);
            }
        }

        checkChildren(node.children);

        if (allChecked) return 'checked';
        if (noneChecked && !selectedKeys.has(node.key)) return 'unchecked';
        return 'indeterminate';
    }

    function renderTreeList() {
        const treeList = container.querySelector<HTMLElement>('.p-treeselect-tree')!;
        const visibleNodes = filterTree(treeData, searchQuery.toLowerCase().trim());

        if (visibleNodes.length === 0) {
            setHtml(treeList, html`<li class="p-treenode" style="padding: 1rem; text-align: center; color: var(--p-text-muted); font-size: 0.8125rem;">${locale.t('emptyFilterMessage') || 'No results found'}</li>`);
            return;
        }

        function renderNodesHtml(nodes: TreeNodeItem[]): Raw[] {
            return nodes.map(node => {
                const hasChildren = node.children && node.children.length > 0;
                const isExpanded = expandedKeys.has(node.key);
                const isSelected = selectedKeys.has(node.key);
                const iconSvg = node.icon ? getLucideIcon(node.icon, 16) : (hasChildren ? (isExpanded ? getLucideIcon('folderOpen', 16) : getLucideIcon('folder', 16)) : getLucideIcon('fileText', 16));

                let checkboxHtml: Raw | '' = '';
                if (selectionMode === 'checkbox') {
                    const cbState = getCheckboxState(node);
                    const cbClass = cbState === 'checked' ? 'p-checked' : (cbState === 'indeterminate' ? 'p-indeterminate' : '');
                    const cbIcon = cbState === 'checked' ? unsafe(checkSvg) : (cbState === 'indeterminate' ? unsafe(minusSvg) : '');
                    checkboxHtml = html`
                        <span class="p-tree-checkbox ${cbClass}" data-key="${node.key}" role="checkbox" aria-checked="${cbState === 'checked' ? 'true' : (cbState === 'indeterminate' ? 'mixed' : 'false')}">
                            ${cbIcon}
                        </span>
                    `;
                }

                return html`
                    <li class="p-treenode" role="treeitem" aria-expanded="${hasChildren ? (isExpanded ? 'true' : 'false') : 'false'}" aria-selected="${isSelected ? 'true' : 'false'}" data-key="${node.key}">
                        <div class="p-treenode-content ${isSelected && selectionMode !== 'checkbox' ? 'p-highlight' : ''}" data-key="${node.key}" tabindex="0">
                            ${hasChildren ? html`
                                <button type="button" class="p-tree-toggler ${isExpanded ? 'p-expanded' : ''}" data-toggle="${node.key}" aria-label="Toggle node" tabindex="-1">
                                    ${unsafe(chevronRightSvg)}
                                </button>
                            ` : html`<span class="p-tree-toggler-empty"></span>`}
                            ${checkboxHtml}
                            <span class="p-treenode-icon">${unsafe(iconSvg)}</span>
                            <span class="p-treenode-label">${node.label}</span>
                        </div>
                        ${hasChildren && isExpanded ? html`
                            <ul class="p-treenode-children" role="group">
                                ${renderNodesHtml(node.children!)}
                            </ul>
                        ` : ''}
                    </li>
                `;
            });
        }

        setHtml(treeList, html`${renderNodesHtml(visibleNodes)}`);
        bindNodeEvents();
    }

    function bindNodeEvents() {
        const treeList = container.querySelector<HTMLElement>('.p-treeselect-tree')!;

        // Toggle Expand / Collapse
        treeList.querySelectorAll<HTMLButtonElement>('.p-tree-toggler').forEach(toggler => {
            toggler.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = toggler.getAttribute('data-toggle')!;
                if (expandedKeys.has(key)) expandedKeys.delete(key);
                else expandedKeys.add(key);
                renderTreeList();
            }, { signal: ctx?.signal });
        });

        // Select Node / Checkbox
        treeList.querySelectorAll<HTMLElement>('.p-treenode-content').forEach(content => {
            content.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                if (target.closest('.p-tree-toggler')) return;

                const key = content.getAttribute('data-key')!;
                const node = nodeMap.get(key);
                if (!node || node.disabled) return;

                if (selectionMode === 'single') {
                    selectedKeys.clear();
                    selectedKeys.add(key);
                    updateTriggerDisplay();
                    renderTreeList();
                    disclosure.close();
                    syncValue();
                } else if (selectionMode === 'multiple') {
                    if (selectedKeys.has(key)) selectedKeys.delete(key);
                    else selectedKeys.add(key);
                    updateTriggerDisplay();
                    renderTreeList();
                    syncValue();
                } else if (selectionMode === 'checkbox') {
                    const currentState = getCheckboxState(node);
                    const shouldCheck = currentState !== 'checked';
                    toggleNodeSelection(key, shouldCheck);
                }
            }, { signal: ctx?.signal });
        });
    }

    function toggleNodeSelection(key: string, select: boolean) {
        const node = nodeMap.get(key);
        if (!node) return;

        function setDescendants(n: TreeNodeItem, sel: boolean) {
            if (sel) selectedKeys.add(n.key);
            else selectedKeys.delete(n.key);
            if (n.children) {
                n.children.forEach(c => setDescendants(c, sel));
            }
        }

        setDescendants(node, select);
        updateTriggerDisplay();
        renderTreeList();
        syncValue();
    }

    function bindEvents() {
        const trigger = container.querySelector<HTMLElement>('.p-treeselect-label-container')!;
        const clearBtn = container.querySelector<HTMLElement>('.p-treeselect-clear-icon')!;
        const filterInput = container.querySelector<HTMLInputElement>('.p-treeselect-filter-input');

        trigger.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).closest('.p-treeselect-clear-icon') || (e.target as HTMLElement).closest('.p-treeselect-token-remove')) return;
            if (isDisabled) return;
            disclosure.toggle();
        }, { signal: ctx?.signal });

        trigger.addEventListener('keydown', (e) => {
            if (isDisabled) return;
            if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown') {
                e.preventDefault();
                disclosure.open();
            } else if (e.key === 'Escape') {
                disclosure.close();
            }
        }, { signal: ctx?.signal });

        clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedKeys.clear();
            updateTriggerDisplay();
            renderTreeList();
            syncValue();
        }, { signal: ctx?.signal });

        if (filterInput) {
            filterInput.addEventListener('input', () => {
                searchQuery = filterInput.value;
                renderTreeList();
            }, { signal: ctx?.signal });
            filterInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') disclosure.close();
            }, { signal: ctx?.signal });
        }
    }

    function syncValue() {
        const selected = getSelectedLabels();
        const payload = selectionMode === 'single' ? (selected[0]?.key || null) : Array.from(selectedKeys);

        formField.setValue(Array.from(selectedKeys));

        emitComponentEvent(container, 'tree-select', 'change', {
            value: payload,
            selectedNodes: selected
        });
    }

    init();
}
