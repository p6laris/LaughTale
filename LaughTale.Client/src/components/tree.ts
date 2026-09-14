import { resolvePart, applyPart, type PassthroughRecord } from '../runtime/parts';
import type { IslandContext } from '../runtime/registry';
﻿/**
 * LaughTale: Enterprise Tree Component (Aura Design System compliant)
 * Rich hierarchical tree data visualizer with expand/collapse, custom node icons,
 * single/multiple/checkbox selection modes, cascading tri-state checkboxes,
 * keyboard accessibility, search filter, lazy loading, skeleton loading, empty state,
 * and drag & drop reordering / multi-tree transfer.
 */

import { TreeNode } from '../types/models';
import { injectIslandStyle } from '../runtime/styles';
import { html, setHtml, url as safeUrl, unsafe, attr, type Raw } from '../runtime/html';
import { useVirtualizer, type Virtualizer } from '../composables/useVirtualizer';
import { useLocale } from '../composables/useLocale';
import type { PatternDeclaration } from '../accessibility/patterns';

export const a11y: PatternDeclaration = {
    kind: 'pattern',
    pattern: 'tree'
};

export interface TreeProps {
    value?: TreeNode[];
    nodes?: TreeNode[];
    selectionMode?: 'single' | 'multiple' | 'checkbox' | null;
    selectionKeys?: any;
    expandedKeys?: Record<string, boolean>;
    filter?: boolean;
    filterPlaceholder?: string;
    filterMode?: 'lenient' | 'strict';
    metaKeySelection?: boolean;
    loading?: boolean;
    loadingMode?: 'mask' | 'icon';
    draggableNodes?: boolean;
    droppableNodes?: boolean;
    draggableScope?: string;
    droppableScope?: string | string[];
    toggleIcon?: 'chevron' | 'plusMinus' | 'circle';
    showSelectAll?: boolean;
    showControls?: boolean;
    keyboardInfo?: boolean;
    lazy?: boolean;
    skeleton?: boolean;
    emptyMessage?: string;
    events?: boolean;
    pt?: PassthroughRecord;
    studioOverrides?: Record<string, any>;
}

const TREE_CSS = `
.p-tree {
    position: relative;
    background: var(--lt-surface-0);
    color: var(--lt-surface-700);
    border: 1px solid var(--lt-surface-200);
    border-radius: var(--p-border-radius-md, 6px);
    padding: 0.75rem;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    width: 100%;
}

.p-tree-header {
    margin-bottom: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.p-tree-filter-container {
    position: relative;
    width: 100%;
}

.p-tree-filter-input {
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 2.25rem;
    font-size: 0.875rem;
    color: var(--lt-surface-900);
    background: var(--lt-surface-0);
    border: 1px solid var(--lt-surface-300);
    border-radius: var(--lt-radius);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
}

.p-tree-filter-input:focus {
    border-color: var(--lt-primary-500);
    box-shadow: 0 0 0 2px var(--p-primary-100, rgba(16, 185, 129, 0.2));
}

.p-tree-filter-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--lt-surface-400);
    pointer-events: none;
    display: flex;
    align-items: center;
}

.p-tree-root-children,
.p-tree-node-children {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

.p-tree-wrapper {
    overflow-y: auto;
    max-height: 400px;
}
.p-virtual-spacer {
    position: relative;
    width: 100%;
}
.p-virtual-list {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
}
.p-tree-node[data-level="1"] { padding-left: 1.5rem; }
.p-tree-node[data-level="2"] { padding-left: 3rem; }
.p-tree-node[data-level="3"] { padding-left: 4.5rem; }
.p-tree-node[data-level="4"] { padding-left: 6rem; }
.p-tree-node[data-level="5"] { padding-left: 7.5rem; }
.p-tree-node[data-level="6"] { padding-left: 9rem; }
.p-tree-node[data-level="7"] { padding-left: 10.5rem; }
.p-tree-node[data-level="8"] { padding-left: 12rem; }

.p-tree-node-children {
    padding-left: 1.5rem;
}

.p-tree-node {
    padding: 0.125rem 0;
    outline: none;
}

.p-tree-node-content {
    display: flex;
    align-items: center;
    padding: 0.375rem 0.5rem;
    border-radius: var(--lt-radius-sm);
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease, color 0.15s ease;
    gap: 0.375rem;
    outline: none;
}

.p-tree-node-content:hover {
    background-color: var(--lt-surface-100);
    color: var(--lt-surface-900);
}

.p-tree-node-content.p-tree-node-selected {
    background-color: var(--lt-primary-50);
    color: var(--lt-primary-700);
    font-weight: 600;
}

.p-tree-node-content:focus-visible {
    box-shadow: inset 0 0 0 2px var(--lt-primary-500);
}

.p-tree-node-toggle-button {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 9999px;
    border: none;
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--lt-surface-500);
    transition: background-color 0.15s ease, transform 0.2s ease;
    flex-shrink: 0;
    padding: 0;
}

.p-tree-node-toggle-button:hover {
    background-color: var(--lt-surface-200);
    color: var(--lt-surface-900);
}

.p-tree-node-toggle-button.p-tree-node-toggle-placeholder {
    visibility: hidden;
    pointer-events: none;
}

.p-tree-node-checkbox {
    margin-right: 0.25rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.p-tree-checkbox-box {
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 4px;
    border: 1px solid var(--lt-surface-300);
    background: var(--lt-surface-0);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s, border-color 0.15s;
}

.p-tree-checkbox-box.p-highlight {
    background: var(--lt-primary-500);
    border-color: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
}

.p-tree-checkbox-box.p-indeterminate {
    background: var(--lt-primary-500);
    border-color: var(--lt-primary-500);
    color: var(--lt-surface-0, var(--lt-surface-0));
}

.p-tree-node-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--lt-surface-500);
    flex-shrink: 0;
}

.p-tree-node-content.p-tree-node-selected .p-tree-node-icon {
    color: var(--lt-primary-600);
}

.p-tree-node-label {
    font-size: 0.875rem;
    flex-grow: 1;
    line-height: 1.25;
}

/* Drag & Drop Visuals */
.p-tree-node-dragging {
    opacity: 0.4;
}
.p-tree-node-dragover {
    background-color: var(--lt-primary-50) !important;
    border: 1px dashed var(--lt-primary-500) !important;
}

/* Loading Overlay */
.p-tree-loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: var(--p-border-radius-md, 6px);
}

/* Skeleton Placeholder */
.p-tree-skeleton-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
}
.p-tree-skeleton-icon {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: var(--lt-surface-200);
    animation: pSkeletonGlow 1.5s infinite;
}
.p-tree-skeleton-text {
    height: 0.875rem;
    border-radius: 4px;
    background: var(--lt-surface-200);
    animation: pSkeletonGlow 1.5s infinite;
}
@keyframes pSkeletonGlow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
}

/* Dark Mode Tokens */
html.dark .p-tree,
[data-theme="dark"] .p-tree,
.dark .p-tree {
    background: var(--p-surface-0) !important;
    color: var(--p-text-color) !important;
    border-color: var(--p-border-color) !important;
}
html.dark .p-tree-filter-input,
[data-theme="dark"] .p-tree-filter-input,
.dark .p-tree-filter-input {
    background: var(--p-surface-0) !important;
    color: var(--p-text-color) !important;
    border-color: var(--p-border-color) !important;
}
html.dark .p-tree-node-content:hover,
[data-theme="dark"] .p-tree-node-content:hover,
.dark .p-tree-node-content:hover {
    background-color: var(--p-surface-100) !important;
    color: var(--p-text-color) !important;
}
html.dark .p-tree-node-content.p-tree-node-selected,
[data-theme="dark"] .p-tree-node-content.p-tree-node-selected,
.dark .p-tree-node-content.p-tree-node-selected {
    background-color: rgba(16, 185, 129, 0.16) !important;
    color: var(--p-primary-300) !important;
}
html.dark .p-tree-checkbox-box,
[data-theme="dark"] .p-tree-checkbox-box,
.dark .p-tree-checkbox-box {
    background: var(--p-surface-50) !important;
    border-color: var(--p-border-color) !important;
}
html.dark .p-tree-loading-overlay,
[data-theme="dark"] .p-tree-loading-overlay,
.dark .p-tree-loading-overlay {
    background: rgba(9, 13, 22, 0.7) !important;
}

/* Bi-Directional RTL Support */
[dir="rtl"] .p-tree {
    text-align: right;
}
[dir="rtl"] .p-tree-sub {
    padding-right: 1.5rem;
    padding-left: 0;
}
[dir="rtl"] .p-tree-toggler svg {
    transform: scaleX(-1);
}
`;

const SVG_ICONS = {
    chevronRight: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    chevronDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    plusCircle: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>',
    minusCircle: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>',
    folder: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',
    folderOpen: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.5-6h13.5L19 14Z"/><path d="M6 14H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.69.9H19a2 2 0 0 1 2 2v2"/></svg>',
    file: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>',
    check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    minus: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>',
    search: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    spinner: '<svg class="animate-spin" data-part="root" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
    plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
    refresh: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>'
};

// Global Drag Store for multi-tree drag&drop
let globalDraggedNode: { node: any; sourceScope?: string } | null = null;

export default function TreeIsland(container: HTMLElement, props: TreeProps, ctx?: IslandContext) {
    injectIslandStyle('tree', TREE_CSS);
    const locale = useLocale(ctx);

    let treeData: any[] = JSON.parse(JSON.stringify(props.value || props.nodes || []));
    const selectionMode = props.selectionMode || null;
    const metaKeySelection = props.metaKeySelection ?? true;
    const isLazy = !!props.lazy;
    const isSkeleton = !!props.skeleton;
    const showControls = !!props.showControls;
    const showSelectAll = !!props.showSelectAll;
    const keyboardInfo = !!props.keyboardInfo;
    const toggleIconType = props.toggleIcon || 'chevron';
    const isDraggable = !!props.draggableNodes;
    const isDroppable = !!props.droppableNodes;
    const draggableScope = props.draggableScope || 'default';
    const droppableScope = Array.isArray(props.droppableScope) ? props.droppableScope : (props.droppableScope ? [props.droppableScope] : ['default', 'none']);

    // State management
    let expandedKeys: Record<string, boolean> = { ...(props.expandedKeys || {}) };
    let singleSelectionKey: string | null = null;
    let multiSelectionKeys: Record<string, boolean> = {};
    let checkboxSelectionKeys: Record<string, { checked?: boolean; partialChecked?: boolean }> = {};
    let filterQuery = '';
    let isLoading = !!props.loading;
    let focusedKey: string | null = null;

    // Initialize selection states
    if (props.selectionKeys) {
        if (selectionMode === 'single' && typeof props.selectionKeys === 'string') {
            singleSelectionKey = props.selectionKeys;
        } else if (selectionMode === 'multiple' && typeof props.selectionKeys === 'object') {
            multiSelectionKeys = { ...props.selectionKeys };
        } else if (selectionMode === 'checkbox' && typeof props.selectionKeys === 'object') {
            checkboxSelectionKeys = { ...props.selectionKeys };
        }
    }

    // Maps for fast lookups
    let nodeMap = new Map<string, any>();
    let parentMap = new Map<string, any>();

    function buildMaps(nodes: any[], parent: any = null) {
        nodes.forEach(node => {
            const key = String(node.key || node.id);
            node.key = key;
            node.label = node.label || node.name;
            nodeMap.set(key, node);
            if (parent) parentMap.set(key, parent);
            if (node.children && node.children.length) {
                buildMaps(node.children, node);
            }
        });
    }

    buildMaps(treeData);

    function notifyToast(severity: string, summary: string, detail: string) {
        if (props.events && (window as any).AuraToast) {
            (window as any).AuraToast.add({ severity, summary, detail, life: 3000 });
        }
    }

    // Checkbox tri-state cascading logic
    function setCheckboxState(node: any, checked: boolean) {
        const key = String(node.key || node.id);
        checkboxSelectionKeys[key] = { checked, partialChecked: false };

        // Cascade down to all descendants
        if (node.children && node.children.length) {
            node.children.forEach((child: any) => setCheckboxState(child, checked));
        }
    }

    function updateAncestorCheckboxes(node: any) {
        const parent = parentMap.get(String(node.key || node.id));
        if (!parent) return;

        const parentKey = String(parent.key || parent.id);
        const children = parent.children || [];
        let allChecked = true;
        let anyChecked = false;
        let anyPartial = false;

        children.forEach((child: any) => {
            const childKey = String(child.key || child.id);
            const state = checkboxSelectionKeys[childKey];
            if (state?.checked) {
                anyChecked = true;
            } else {
                allChecked = false;
            }
            if (state?.partialChecked) {
                anyPartial = true;
            }
        });

        if (allChecked) {
            checkboxSelectionKeys[parentKey] = { checked: true, partialChecked: false };
        } else if (anyChecked || anyPartial) {
            checkboxSelectionKeys[parentKey] = { checked: false, partialChecked: true };
        } else {
            delete checkboxSelectionKeys[parentKey];
        }

        updateAncestorCheckboxes(parent);
    }

    function toggleNodeExpand(node: any) {
        const key = String(node.key || node.id);
        if (expandedKeys[key]) {
            delete expandedKeys[key];
            notifyToast('info', 'Node Collapsed', node.label);
            render();
        } else {
            expandedKeys[key] = true;
            notifyToast('info', 'Node Expanded', node.label);

            // Lazy loading on expand
            if (isLazy && (!node.children || node.children.length === 0)) {
                node.loading = true;
                render();
                const tLazy = setTimeout(() => {
                    node.loading = false;
                    node.children = [
                        { key: `${key}-0`, label: `Lazy ${node.label}-0`, leaf: true },
                        { key: `${key}-1`, label: `Lazy ${node.label}-1`, leaf: true },
                        { key: `${key}-2`, label: `Lazy ${node.label}-2`, leaf: true }
                    ];
                    buildMaps(treeData);
                    render();
                }, 600);
                ctx?.onCleanup?.(() => clearTimeout(tLazy));
                return;
            }
            render();
        }
    }

    function selectNode(node: any, event: MouseEvent | KeyboardEvent) {
        const key = String(node.key || node.id);

        if (selectionMode === 'single') {
            if (singleSelectionKey === key) {
                singleSelectionKey = null;
                notifyToast('warn', 'Node Unselected', node.label);
            } else {
                singleSelectionKey = key;
                notifyToast('success', 'Node Selected', node.label);
            }
            render();
        } else if (selectionMode === 'multiple') {
            const isMeta = event.metaKey || event.ctrlKey;
            if (metaKeySelection && !isMeta) {
                // Single select when metaKey is required but not pressed
                multiSelectionKeys = { [key]: true };
                notifyToast('success', 'Node Selected', node.label);
            } else {
                if (multiSelectionKeys[key]) {
                    delete multiSelectionKeys[key];
                    notifyToast('warn', 'Node Unselected', node.label);
                } else {
                    multiSelectionKeys[key] = true;
                    notifyToast('success', 'Node Selected', node.label);
                }
            }
            render();
        } else if (selectionMode === 'checkbox') {
            const currentState = checkboxSelectionKeys[key];
            const isChecked = !currentState?.checked;
            setCheckboxState(node, isChecked);
            updateAncestorCheckboxes(node);
            notifyToast(isChecked ? 'success' : 'warn', isChecked ? 'Node Selected' : 'Node Unselected', node.label);
            render();
        }
    }

    function getAllKeys(nodes: any[]): string[] {
        const keys: string[] = [];
        nodes.forEach(n => {
            keys.push(String(n.key || n.id));
            if (n.children && n.children.length) {
                keys.push(...getAllKeys(n.children));
            }
        });
        return keys;
    }

    function expandAll() {
        const keys = getAllKeys(treeData);
        keys.forEach(k => { expandedKeys[k] = true; });
        render();
    }

    function collapseAll() {
        expandedKeys = {};
        render();
    }

    function toggleSelectAll() {
        const allKeys = getAllKeys(treeData);
        const selectedCount = Object.values(checkboxSelectionKeys).filter(v => v?.checked).length;
        if (selectedCount === allKeys.length) {
            checkboxSelectionKeys = {};
        } else {
            allKeys.forEach(k => {
                checkboxSelectionKeys[k] = { checked: true, partialChecked: false };
            });
        }
        render();
    }

    function filterTreeNodes(nodes: any[], query: string): any[] {
        if (!query.trim()) return nodes;
        const q = query.toLowerCase();

        return nodes.reduce((acc: any[], node: any) => {
            const matches = (node.label || node.name || '').toLowerCase().includes(q);
            const filteredChildren = node.children ? filterTreeNodes(node.children, query) : [];

            if (matches || filteredChildren.length > 0) {
                const key = String(node.key || node.id);
                expandedKeys[key] = true; // auto-expand matched branches
                acc.push({
                    ...node,
                    children: filteredChildren
                });
            }
            return acc;
        }, []);
    }

    interface FlatTreeNode {
        node: any;
        level: number;
        index: number;
    }

    function flattenVisible(nodesList: any[], level = 0, flatAcc: FlatTreeNode[] = []): FlatTreeNode[] {
        nodesList.forEach(node => {
            const index = flatAcc.length;
            flatAcc.push({ node, level, index });
            const key = String(node.key || node.id);
            if (expandedKeys[key] && node.children && node.children.length > 0) {
                flattenVisible(node.children, level + 1, flatAcc);
            }
        });
        return flatAcc;
    }

    const ITEM_HEIGHT = 32;
    let virtualizer: Virtualizer | null = null;
    let currentStart = -1;
    let currentEnd = -1;
    let currentFlatNodes: FlatTreeNode[] = [];
    let scrollBound = false;

    function renderSingleFlatNode(item: FlatTreeNode, totalCount: number): Raw {
        const { node, level, index } = item;
        const key = String(node.key || node.id);
        const hasChildren = (node.children && node.children.length > 0) || (isLazy && !node.leaf);
        const isExpanded = !!expandedKeys[key];
        const isSelected = selectionMode === 'single' ? singleSelectionKey === key :
                           selectionMode === 'multiple' ? !!multiSelectionKeys[key] :
                           selectionMode === 'checkbox' ? !!checkboxSelectionKeys[key]?.checked : false;
        const isPartial = selectionMode === 'checkbox' && !!checkboxSelectionKeys[key]?.partialChecked;

        // Toggle icon determination
        let toggleSvg: Raw | '' = '';
        if (hasChildren) {
            if (node.loading) {
                toggleSvg = unsafe(SVG_ICONS.spinner);
            } else if (toggleIconType === 'plusMinus') {
                toggleSvg = isExpanded ? unsafe(SVG_ICONS.minusCircle) : unsafe(SVG_ICONS.plusCircle);
            } else {
                toggleSvg = isExpanded ? unsafe(SVG_ICONS.chevronDown) : unsafe(SVG_ICONS.chevronRight);
            }
        }

        // Node content icon
        let iconSvg: Raw | '' = '';
        if (node.icon) {
            iconSvg = unsafe(node.icon.startsWith('<svg') ? node.icon : (SVG_ICONS[node.icon as keyof typeof SVG_ICONS] || SVG_ICONS.file));
        } else if (hasChildren) {
            iconSvg = unsafe(isExpanded ? SVG_ICONS.folderOpen : SVG_ICONS.folder);
        } else {
            iconSvg = unsafe(SVG_ICONS.file);
        }

        // Checkbox box
        let checkboxHtml: Raw | '' = '';
        if (selectionMode === 'checkbox') {
            checkboxHtml = html`
                <div class="p-tree-node-checkbox" role="checkbox" aria-checked="${isSelected ? 'true' : isPartial ? 'mixed' : 'false'}">
                    <div class="p-tree-checkbox-box ${isSelected ? 'p-highlight' : isPartial ? 'p-indeterminate' : ''}">
                        ${isSelected ? unsafe(SVG_ICONS.check) : isPartial ? unsafe(SVG_ICONS.minus) : ''}
                    </div>
                </div>
            `;
        }

        return html`
            <li class="p-tree-node" 
                role="treeitem" 
                data-key="${key}" 
                data-index="${index}"
                data-level="${level}"
                aria-expanded="${isExpanded}" 
                aria-selected="${isSelected}" 
                aria-setsize="${totalCount}"
                aria-posinset="${index + 1}"
                ${isDraggable ? 'draggable="true"' : ''}>
                <div class="p-tree-node-content ${isSelected ? 'p-tree-node-selected' : ''}" data-key="${key}" tabindex="${index === 0 ? '0' : '-1'}">
                    <button type="button" class="p-tree-node-toggle-button ${!hasChildren ? 'p-tree-node-toggle-placeholder' : ''}" data-toggle-key="${key}" tabindex="-1" aria-label="Toggle">
                        ${toggleSvg}
                    </button>
                    ${checkboxHtml}
                    <span class="p-tree-node-icon">${iconSvg}</span>
                    <span class="p-tree-node-label">${node.label || node.name}</span>
                </div>
            </li>
        `;
    }

    function updateVirtualPositions() {
        if (!virtualizer || !virtualizer.isVirtual()) return;
        const wrapperEl = container.querySelector<HTMLElement>('.p-tree-wrapper');
        if (!wrapperEl) return;
        const spacerEl = wrapperEl.querySelector<HTMLElement>('.p-virtual-spacer');
        const vListEl = wrapperEl.querySelector<HTMLElement>('.p-virtual-list');
        const virtualItems = virtualizer.getVirtualItems();
        const startOffset = virtualItems.length > 0 ? virtualItems[0].start : 0;
        if (spacerEl) spacerEl.style.height = `${virtualizer.getTotalSize()}px`;
        if (vListEl) vListEl.style.transform = `translateY(${startOffset}px)`;
    }

    function render() {
        const displayNodes = filterTreeNodes(treeData, filterQuery);
        const flatNodes = flattenVisible(displayNodes);
        currentFlatNodes = flatNodes;
        buildMaps(treeData);

        // 1. Optional Controls Header
        let controlsHtml: Raw | '' = '';
        if (showControls) {
            controlsHtml = html`
                <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                    <button type="button" class="p-tree-expand-all p-button p-component p-button-outlined" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.75rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--lt-surface-300); background: var(--lt-surface-0); cursor: pointer; color: var(--lt-surface-700);">
                        ${unsafe(SVG_ICONS.plus)} Expand All
                    </button>
                    <button type="button" class="p-tree-collapse-all p-button p-component p-button-outlined" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.75rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--lt-surface-300); background: var(--lt-surface-0); cursor: pointer; color: var(--lt-surface-700);">
                        ${unsafe(SVG_ICONS.minus)} Collapse All
                    </button>
                </div>
            `;
        }

        // 2. Select All Checkbox Header
        let selectAllHtml: Raw | '' = '';
        if (showSelectAll && selectionMode === 'checkbox') {
            const allKeys = getAllKeys(treeData);
            const selectedCount = Object.values(checkboxSelectionKeys).filter(v => v?.checked).length;
            const isAllSelected = allKeys.length > 0 && selectedCount === allKeys.length;
            const isSomeSelected = selectedCount > 0 && !isAllSelected;

            selectAllHtml = html`
                <div class="p-tree-select-all-header" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.5rem; margin-bottom: 0.5rem; border-bottom: 1px solid var(--lt-surface-200); cursor: pointer; user-select: none;">
                    <div class="p-tree-checkbox-box ${isAllSelected ? 'p-highlight' : isSomeSelected ? 'p-indeterminate' : ''}">
                        ${isAllSelected ? unsafe(SVG_ICONS.check) : isSomeSelected ? unsafe(SVG_ICONS.minus) : ''}
                    </div>
                    <span style="font-size: 0.875rem; font-weight: 600; color: var(--lt-surface-800);">Select All (${selectedCount}/${allKeys.length})</span>
                </div>
            `;
        }

        // 3. Search Filter Bar
        let filterHtml: Raw | '' = '';
        if (props.filter) {
            filterHtml = html`
                <div class="p-tree-filter-container">
                    <span class="p-tree-filter-icon">${unsafe(SVG_ICONS.search)}</span>
                    <input type="text" class="p-tree-filter-input" placeholder="${props.filterPlaceholder || 'Search'}" value="${filterQuery}" />
                </div>
            `;
        }

        // 4. Keyboard Shortcuts Helper Banner
        let keyboardBannerHtml: Raw | '' = '';
        if (keyboardInfo) {
            keyboardBannerHtml = html`
                <div class="p-tree-keyboard-banner" style="display: flex; align-items: center; justify-content: space-between; background: var(--lt-surface-100); padding: 0.375rem 0.75rem; border-radius: 6px; font-size: 0.75rem; color: var(--lt-surface-600); margin-bottom: 0.75rem;">
                    <span>Navigate with <kbd>↑</kbd> <kbd>↓</kbd>, toggle with <kbd>→</kbd> <kbd>←</kbd>, select with <kbd>Space</kbd></span>
                    <span style="cursor: pointer; font-weight: 700;" onclick="this.parentElement.remove()">✕</span>
                </div>
            `;
        }

        // 5. Loading Overlay
        let loadingOverlayHtml: Raw | '' = '';
        if (isLoading && props.loadingMode !== 'icon') {
            loadingOverlayHtml = html`
                <div class="p-tree-loading-overlay">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                        <span style="display: inline-block; animation: p-spin 1s infinite linear;">${unsafe(SVG_ICONS.spinner)}</span>
                        <span style="font-size: 0.8125rem; font-weight: 600; color: var(--lt-surface-700);">Loading tree...</span>
                    </div>
                </div>
            `;
        }

        // 6. Tree Body: Flat Virtualized or Empty or Skeleton
        let treeBodyHtml: Raw;
        if (isSkeleton && isLoading) {
            treeBodyHtml = html`
                <div style="display: flex; flex-direction: column; gap: 0.625rem; padding: 0.5rem 0;">
                    ${[1, 2, 3, 4, 5].map(() => html`
                        <div class="p-tree-skeleton-row">
                            <div class="p-tree-skeleton-box" style="width: 1.25rem; height: 1.25rem;"></div>
                            <div class="p-tree-skeleton-box" style="width: 1.25rem; height: 1.25rem;"></div>
                            <div class="p-tree-skeleton-box" style="width: 60%; height: 1rem;"></div>
                        </div>
                    `)}
                </div>
            `;
        } else if (flatNodes.length === 0) {
            virtualizer = null;
            if (filterQuery) {
                treeBodyHtml = html`<div style="padding: 1rem; text-align: center; color: var(--lt-surface-500); font-size: 0.875rem;">${locale.t('emptyMessage') || 'No options found.'}</div>`;
            } else {
                treeBodyHtml = html`
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 2.5rem 1rem; text-align: center;">
                        <div style="width: 3.5rem; height: 3.5rem; border-radius: 9999px; background: var(--lt-surface-100); display: flex; align-items: center; justify-content: center; color: var(--lt-surface-400);">
                            <span style="transform: scale(1.4);">${unsafe(SVG_ICONS.folder)}</span>
                        </div>
                        <div>
                            <p style="margin: 0; font-weight: 700; color: var(--lt-surface-900); font-size: 0.9375rem;">No folders yet</p>
                            <p style="margin: 0.25rem 0 0 0; font-size: 0.8125rem; color: var(--lt-surface-500);">Create your first folder to start building a tree.</p>
                        </div>
                        <button type="button" class="p-tree-add-node-btn p-button p-component p-button-sm" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; background: var(--lt-primary-500); color: var(--lt-surface-0, var(--lt-surface-0)); border: none; cursor: pointer;">
                            ${unsafe(SVG_ICONS.plus)} New Folder
                        </button>
                    </div>
                `;
            }
        } else if (flatNodes.length < 100) {
            virtualizer = null;
            const nodes: Raw[] = [];
            for (let i = 0; i < flatNodes.length; i++) {
                nodes.push(renderSingleFlatNode(flatNodes[i], flatNodes.length));
            }
            treeBodyHtml = html`
                <ul class="p-tree-root-children" role="tree">
                    ${nodes}
                </ul>
            `;
        } else {
            virtualizer = useVirtualizer({
                count: flatNodes.length,
                estimateSize: 32,
                getScrollElement: () => container.querySelector<HTMLElement>('.p-tree-wrapper'),
                virtualThreshold: 100
            });
            const virtualItems = virtualizer.getVirtualItems();
            currentStart = virtualItems.length > 0 ? virtualItems[0].index : 0;
            currentEnd = virtualItems.length > 0 ? virtualItems[virtualItems.length - 1].index : 0;

            treeBodyHtml = html`
                <div class="p-virtual-spacer" data-virtual-spacer>
                    <ul class="p-virtual-list p-tree-root-children" role="tree">
                        ${virtualItems.map(vi => renderSingleFlatNode(flatNodes[vi.index], flatNodes.length))}
                    </ul>
                </div>
            `;
        }

        setHtml(container, html`
            ${controlsHtml}
            ${keyboardBannerHtml}
            <div class="p-tree p-component" role="tree" tabindex="-1">
                ${filterHtml ? html`<div class="p-tree-header">${filterHtml}</div>` : ''}
                ${selectAllHtml}
                ${loadingOverlayHtml}
                <div class="p-tree-wrapper">
                    ${treeBodyHtml}
                </div>
            </div>
        `);

        updateVirtualPositions();
        bindEvents();
        bindNodeEvents();
    }

    function focusTreeNodeByIndex(targetIdx: number) {
        if (virtualizer && virtualizer.isVirtual()) {
            if (targetIdx < currentStart || targetIdx > currentEnd) {
                virtualizer.scrollToIndex(targetIdx, 'auto');
                const newVirtualItems = virtualizer.getVirtualItems();
                if (newVirtualItems.length > 0) {
                    currentStart = newVirtualItems[0].index;
                    currentEnd = newVirtualItems[newVirtualItems.length - 1].index;
                    const newStartOffset = newVirtualItems[0].start;
                    const wrapperEl = container.querySelector<HTMLElement>('.p-tree-wrapper');
                    const vList = wrapperEl?.querySelector<HTMLElement>('.p-virtual-list');
                    if (vList) {
                        vList.style.transform = `translateY(${newStartOffset}px)`;
                        const newNodes = newVirtualItems.map(vi => renderSingleFlatNode(currentFlatNodes[vi.index], currentFlatNodes.length));
                        setHtml(vList, html`${newNodes}`);
                        bindNodeEvents();
                    }
                }
            }
        }
        const targetNode = currentFlatNodes[targetIdx];
        if (targetNode) {
            const key = String(targetNode.node.key || targetNode.node.id);
            focusedKey = key;
            const targetEl = container.querySelector<HTMLElement>(`.p-tree-node[data-key="${key}"] .p-tree-node-content`);
            if (targetEl) {
                targetEl.focus();
            }
        }
    }

    function bindNodeEvents() {
        // Toggle Expand/Collapse
        container.querySelectorAll<HTMLButtonElement>('.p-tree-node-toggle-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = btn.getAttribute('data-toggle-key');
                if (key && nodeMap.has(key)) {
                    toggleNodeExpand(nodeMap.get(key));
                }
            }, { signal: ctx?.signal });
        });

        // Node Selection
        container.querySelectorAll<HTMLElement>('.p-tree-node-content').forEach(contentEl => {
            contentEl.addEventListener('click', (e) => {
                const key = contentEl.getAttribute('data-key');
                if (key && nodeMap.has(key)) {
                    focusedKey = key;
                    selectNode(nodeMap.get(key), e);
                }
            }, { signal: ctx?.signal });
        });

        // Keyboard Navigation
        container.querySelectorAll<HTMLElement>('.p-tree-node-content').forEach(contentEl => {
            contentEl.addEventListener('keydown', (e) => {
                const key = contentEl.getAttribute('data-key');
                if (!key || !nodeMap.has(key)) return;
                const node = nodeMap.get(key);

                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    if (!expandedKeys[key] && node.children && node.children.length) {
                        toggleNodeExpand(node);
                    } else if (node.children && node.children.length) {
                        const firstChildKey = String(node.children[0].key || node.children[0].id);
                        const nextEl = container.querySelector<HTMLElement>(`.p-tree-node-content[data-key="${firstChildKey}"]`);
                        nextEl?.focus();
                    }
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    if (expandedKeys[key]) {
                        toggleNodeExpand(node);
                    } else {
                        const parent = parentMap.get(key);
                        if (parent) {
                            const parentKey = String(parent.key || parent.id);
                            const parentEl = container.querySelector<HTMLElement>(`.p-tree-node-content[data-key="${parentKey}"]`);
                            parentEl?.focus();
                        }
                    }
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const liEl = contentEl.closest('.p-tree-node') as HTMLElement;
                    const currIdx = liEl ? parseInt(liEl.getAttribute('data-index') || '0', 10) : 0;
                    if (currIdx < currentFlatNodes.length - 1) {
                        focusTreeNodeByIndex(currIdx + 1);
                    }
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const liEl = contentEl.closest('.p-tree-node') as HTMLElement;
                    const currIdx = liEl ? parseInt(liEl.getAttribute('data-index') || '0', 10) : 0;
                    if (currIdx > 0) {
                        focusTreeNodeByIndex(currIdx - 1);
                    }
                } else if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    selectNode(node, e);
                }
            }, { signal: ctx?.signal });
        });
    }

    function bindEvents() {
        const wrapperEl = container.querySelector<HTMLElement>('.p-tree-wrapper');
        if (wrapperEl && !scrollBound) {
            scrollBound = true;
            wrapperEl.addEventListener('scroll', () => {
                if (!virtualizer || !virtualizer.isVirtual()) return;
                const newVirtualItems = virtualizer.getVirtualItems();
                if (newVirtualItems.length === 0) return;
                const newStart = newVirtualItems[0].index;
                const newEnd = newVirtualItems[newVirtualItems.length - 1].index;
                if (newStart === currentStart && newEnd === currentEnd) return;
                currentStart = newStart;
                currentEnd = newEnd;
                const newStartOffset = newVirtualItems[0].start;
                const vList = wrapperEl.querySelector<HTMLElement>('.p-virtual-list');
                if (vList) {
                    vList.style.transform = `translateY(${newStartOffset}px)`;
                    const newNodes = newVirtualItems.map(vi => renderSingleFlatNode(currentFlatNodes[vi.index], currentFlatNodes.length));
                    setHtml(vList, html`${newNodes}`);
                    bindNodeEvents();
                }
            }, { signal: ctx?.signal, passive: true });
        }

        // Expand All / Collapse All
        container.querySelector('.p-tree-expand-all')?.addEventListener('click', () => expandAll(), { signal: ctx?.signal });
        container.querySelector('.p-tree-collapse-all')?.addEventListener('click', () => collapseAll(), { signal: ctx?.signal });

        // Select All Header
        container.querySelector('.p-tree-select-all-header')?.addEventListener('click', () => toggleSelectAll(), { signal: ctx?.signal });

        // Filter Input
        const filterInput = container.querySelector<HTMLInputElement>('.p-tree-filter-input');
        if (filterInput) {
            filterInput.addEventListener('input', (e) => {
                filterQuery = (e.target as HTMLInputElement).value;
                render();
                const newInput = container.querySelector<HTMLInputElement>('.p-tree-filter-input');
                if (newInput) {
                    newInput.focus();
                    newInput.setSelectionRange(filterQuery.length, filterQuery.length);
                }
            }, { signal: ctx?.signal });
        }

        // Empty State: Add Node
        container.querySelector('.p-tree-add-node-btn')?.addEventListener('click', () => {
            const newIndex = treeData.length + 1;
            treeData.push({
                key: `root-${Date.now()}`,
                label: `New Folder ${newIndex}`,
                icon: 'folder'
            });
            buildMaps(treeData);
            render();
        }, { signal: ctx?.signal });

        // Drag & Drop
        if (isDraggable || isDroppable) {
            container.querySelectorAll<HTMLLIElement>('.p-tree-node').forEach(nodeLi => {
                const key = nodeLi.getAttribute('data-key');
                if (!key || !nodeMap.has(key)) return;
                const node = nodeMap.get(key);

                if (isDraggable) {
                    nodeLi.addEventListener('dragstart', (e) => {
                        e.stopPropagation();
                        globalDraggedNode = { node, sourceScope: draggableScope };
                        nodeLi.classList.add('p-tree-node-dragging');
                        if (e.dataTransfer) {
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', key);
                        }
                    }, { signal: ctx?.signal });

                    nodeLi.addEventListener('dragend', () => {
                        nodeLi.classList.remove('p-tree-node-dragging');
                        globalDraggedNode = null;
                    }, { signal: ctx?.signal });
                }

                if (isDroppable) {
                    nodeLi.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (globalDraggedNode && (droppableScope.includes(globalDraggedNode.sourceScope || '') || droppableScope.includes('all'))) {
                            nodeLi.classList.add('p-tree-node-dragover');
                            if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
                        }
                    }, { signal: ctx?.signal });

                    nodeLi.addEventListener('dragleave', (e) => {
                        e.stopPropagation();
                        nodeLi.classList.remove('p-tree-node-dragover');
                    }, { signal: ctx?.signal });

                    nodeLi.addEventListener('drop', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        nodeLi.classList.remove('p-tree-node-dragover');

                        if (globalDraggedNode && (droppableScope.includes(globalDraggedNode.sourceScope || '') || droppableScope.includes('all'))) {
                            const dragged = globalDraggedNode.node;
                            if (dragged.key === node.key) return; // cannot drop on self

                            // Add as child to dropped target
                            if (!node.children) node.children = [];
                            node.children.push(dragged);
                            expandedKeys[node.key] = true;

                            // If dropped in same tree, remove from old parent
                            function removeNode(list: any[]): boolean {
                                const idx = list.findIndex(n => n.key === dragged.key);
                                if (idx >= 0) {
                                    list.splice(idx, 1);
                                    return true;
                                }
                                for (let item of list) {
                                    if (item.children && removeNode(item.children)) return true;
                                }
                                return false;
                            }
                            removeNode(treeData);

                            buildMaps(treeData);
                            notifyToast('info', 'Node Dropped', `${dragged.label} moved into ${node.label}`);
                            render();
                        }
                    }, { signal: ctx?.signal });
                }
            });
        }
    }

    render();
}
