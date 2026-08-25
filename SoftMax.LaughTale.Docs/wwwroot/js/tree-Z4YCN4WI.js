import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/tree.ts
var TREE_CSS = `
.p-tree {
    position: relative;
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    border: 1px solid var(--p-surface-200, #e2e8f0);
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
    color: var(--p-surface-900, #0f172a);
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-surface-300, #cbd5e1);
    border-radius: var(--p-border-radius, 6px);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
}

.p-tree-filter-input:focus {
    border-color: var(--p-primary-500, #10b981);
    box-shadow: 0 0 0 2px var(--p-primary-100, rgba(16, 185, 129, 0.2));
}

.p-tree-filter-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--p-surface-400, #94a3b8);
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
    border-radius: var(--p-border-radius-sm, 6px);
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease, color 0.15s ease;
    gap: 0.375rem;
    outline: none;
}

.p-tree-node-content:hover {
    background-color: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}

.p-tree-node-content.p-tree-node-selected {
    background-color: var(--p-primary-50, #ecfdf5);
    color: var(--p-primary-700, #047857);
    font-weight: 600;
}

.p-tree-node-content:focus-visible {
    box-shadow: inset 0 0 0 2px var(--p-primary-500, #10b981);
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
    color: var(--p-surface-500, #64748b);
    transition: background-color 0.15s ease, transform 0.2s ease;
    flex-shrink: 0;
    padding: 0;
}

.p-tree-node-toggle-button:hover {
    background-color: var(--p-surface-200, #e2e8f0);
    color: var(--p-surface-900, #0f172a);
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
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s, border-color 0.15s;
}

.p-tree-checkbox-box.p-highlight {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}

.p-tree-checkbox-box.p-indeterminate {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}

.p-tree-node-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-500, #64748b);
    flex-shrink: 0;
}

.p-tree-node-content.p-tree-node-selected .p-tree-node-icon {
    color: var(--p-primary-600, #059669);
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
    background-color: var(--p-primary-50, #ecfdf5) !important;
    border: 1px dashed var(--p-primary-500, #10b981) !important;
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
    background: var(--p-surface-200, #e2e8f0);
    animation: pSkeletonGlow 1.5s infinite;
}
.p-tree-skeleton-text {
    height: 0.875rem;
    border-radius: 4px;
    background: var(--p-surface-200, #e2e8f0);
    animation: pSkeletonGlow 1.5s infinite;
}
@keyframes pSkeletonGlow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
}

/* Dark Mode Tokens */
.dark .p-tree,
[data-theme="dark"] .p-tree {
    background: var(--p-surface-900, #0f172a) !important;
    color: var(--p-surface-100, #f8fafc) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-tree-filter-input,
[data-theme="dark"] .p-tree-filter-input {
    background: var(--p-surface-950, #020617) !important;
    color: var(--p-surface-50, #f8fafc) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-tree-node-content:hover,
[data-theme="dark"] .p-tree-node-content:hover {
    background-color: var(--p-surface-800, #1e293b) !important;
    color: var(--p-surface-0, #ffffff) !important;
}
.dark .p-tree-node-content.p-tree-node-selected,
[data-theme="dark"] .p-tree-node-content.p-tree-node-selected {
    background-color: rgba(16, 185, 129, 0.16) !important;
    color: var(--p-primary-300, #6ee7b7) !important;
}
.dark .p-tree-checkbox-box,
[data-theme="dark"] .p-tree-checkbox-box {
    background: var(--p-surface-950, #020617) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-tree-loading-overlay,
[data-theme="dark"] .p-tree-loading-overlay {
    background: rgba(15, 23, 42, 0.7) !important;
}
`;
var SVG_ICONS = {
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
  spinner: '<svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
  plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
  refresh: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>'
};
var globalDraggedNode = null;
function TreeIsland(container, props) {
  injectIslandStyle("tree", TREE_CSS);
  let treeData = JSON.parse(JSON.stringify(props.value || props.nodes || []));
  const selectionMode = props.selectionMode || null;
  const metaKeySelection = props.metaKeySelection ?? true;
  const isLazy = !!props.lazy;
  const isSkeleton = !!props.skeleton;
  const showControls = !!props.showControls;
  const showSelectAll = !!props.showSelectAll;
  const keyboardInfo = !!props.keyboardInfo;
  const toggleIconType = props.toggleIcon || "chevron";
  const isDraggable = !!props.draggableNodes;
  const isDroppable = !!props.droppableNodes;
  const draggableScope = props.draggableScope || "default";
  const droppableScope = Array.isArray(props.droppableScope) ? props.droppableScope : props.droppableScope ? [props.droppableScope] : ["default", "none"];
  let expandedKeys = { ...props.expandedKeys || {} };
  let singleSelectionKey = null;
  let multiSelectionKeys = {};
  let checkboxSelectionKeys = {};
  let filterQuery = "";
  let isLoading = !!props.loading;
  let focusedKey = null;
  if (props.selectionKeys) {
    if (selectionMode === "single" && typeof props.selectionKeys === "string") {
      singleSelectionKey = props.selectionKeys;
    } else if (selectionMode === "multiple" && typeof props.selectionKeys === "object") {
      multiSelectionKeys = { ...props.selectionKeys };
    } else if (selectionMode === "checkbox" && typeof props.selectionKeys === "object") {
      checkboxSelectionKeys = { ...props.selectionKeys };
    }
  }
  let nodeMap = /* @__PURE__ */ new Map();
  let parentMap = /* @__PURE__ */ new Map();
  function buildMaps(nodes, parent = null) {
    nodes.forEach((node) => {
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
  function notifyToast(severity, summary, detail) {
    if (props.events && window.AuraToast) {
      window.AuraToast.add({ severity, summary, detail, life: 3e3 });
    }
  }
  function setCheckboxState(node, checked) {
    const key = String(node.key || node.id);
    checkboxSelectionKeys[key] = { checked, partialChecked: false };
    if (node.children && node.children.length) {
      node.children.forEach((child) => setCheckboxState(child, checked));
    }
  }
  function updateAncestorCheckboxes(node) {
    const parent = parentMap.get(String(node.key || node.id));
    if (!parent) return;
    const parentKey = String(parent.key || parent.id);
    const children = parent.children || [];
    let allChecked = true;
    let anyChecked = false;
    let anyPartial = false;
    children.forEach((child) => {
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
  function toggleNodeExpand(node) {
    const key = String(node.key || node.id);
    if (expandedKeys[key]) {
      delete expandedKeys[key];
      notifyToast("info", "Node Collapsed", node.label);
      render();
    } else {
      expandedKeys[key] = true;
      notifyToast("info", "Node Expanded", node.label);
      if (isLazy && (!node.children || node.children.length === 0)) {
        node.loading = true;
        render();
        setTimeout(() => {
          node.loading = false;
          node.children = [
            { key: `${key}-0`, label: `Lazy ${node.label}-0`, leaf: true },
            { key: `${key}-1`, label: `Lazy ${node.label}-1`, leaf: true },
            { key: `${key}-2`, label: `Lazy ${node.label}-2`, leaf: true }
          ];
          buildMaps(treeData);
          render();
        }, 600);
        return;
      }
      render();
    }
  }
  function selectNode(node, event) {
    const key = String(node.key || node.id);
    if (selectionMode === "single") {
      if (singleSelectionKey === key) {
        singleSelectionKey = null;
        notifyToast("warn", "Node Unselected", node.label);
      } else {
        singleSelectionKey = key;
        notifyToast("success", "Node Selected", node.label);
      }
      render();
    } else if (selectionMode === "multiple") {
      const isMeta = event.metaKey || event.ctrlKey;
      if (metaKeySelection && !isMeta) {
        multiSelectionKeys = { [key]: true };
        notifyToast("success", "Node Selected", node.label);
      } else {
        if (multiSelectionKeys[key]) {
          delete multiSelectionKeys[key];
          notifyToast("warn", "Node Unselected", node.label);
        } else {
          multiSelectionKeys[key] = true;
          notifyToast("success", "Node Selected", node.label);
        }
      }
      render();
    } else if (selectionMode === "checkbox") {
      const currentState = checkboxSelectionKeys[key];
      const isChecked = !currentState?.checked;
      setCheckboxState(node, isChecked);
      updateAncestorCheckboxes(node);
      notifyToast(isChecked ? "success" : "warn", isChecked ? "Node Selected" : "Node Unselected", node.label);
      render();
    }
  }
  function getAllKeys(nodes) {
    const keys = [];
    nodes.forEach((n) => {
      keys.push(String(n.key || n.id));
      if (n.children && n.children.length) {
        keys.push(...getAllKeys(n.children));
      }
    });
    return keys;
  }
  function expandAll() {
    const keys = getAllKeys(treeData);
    keys.forEach((k) => {
      expandedKeys[k] = true;
    });
    render();
  }
  function collapseAll() {
    expandedKeys = {};
    render();
  }
  function toggleSelectAll() {
    const allKeys = getAllKeys(treeData);
    const selectedCount = Object.values(checkboxSelectionKeys).filter((v) => v?.checked).length;
    if (selectedCount === allKeys.length) {
      checkboxSelectionKeys = {};
    } else {
      allKeys.forEach((k) => {
        checkboxSelectionKeys[k] = { checked: true, partialChecked: false };
      });
    }
    render();
  }
  function filterTreeNodes(nodes, query) {
    if (!query.trim()) return nodes;
    const q = query.toLowerCase();
    return nodes.reduce((acc, node) => {
      const matches = (node.label || node.name || "").toLowerCase().includes(q);
      const filteredChildren = node.children ? filterTreeNodes(node.children, query) : [];
      if (matches || filteredChildren.length > 0) {
        const key = String(node.key || node.id);
        expandedKeys[key] = true;
        acc.push({
          ...node,
          children: filteredChildren
        });
      }
      return acc;
    }, []);
  }
  function renderNode(node, level = 0) {
    const key = String(node.key || node.id);
    const hasChildren = node.children && node.children.length > 0 || isLazy && !node.leaf;
    const isExpanded = !!expandedKeys[key];
    const isSelected = selectionMode === "single" ? singleSelectionKey === key : selectionMode === "multiple" ? !!multiSelectionKeys[key] : selectionMode === "checkbox" ? !!checkboxSelectionKeys[key]?.checked : false;
    const isPartial = selectionMode === "checkbox" && !!checkboxSelectionKeys[key]?.partialChecked;
    let toggleSvg = "";
    if (hasChildren) {
      if (node.loading) {
        toggleSvg = SVG_ICONS.spinner;
      } else if (toggleIconType === "plusMinus") {
        toggleSvg = isExpanded ? SVG_ICONS.minusCircle : SVG_ICONS.plusCircle;
      } else {
        toggleSvg = isExpanded ? SVG_ICONS.chevronDown : SVG_ICONS.chevronRight;
      }
    }
    let iconSvg = "";
    if (node.icon) {
      iconSvg = node.icon.startsWith("<svg") ? node.icon : SVG_ICONS[node.icon] || SVG_ICONS.file;
    } else if (hasChildren) {
      iconSvg = isExpanded ? SVG_ICONS.folderOpen : SVG_ICONS.folder;
    } else {
      iconSvg = SVG_ICONS.file;
    }
    let checkboxHtml = "";
    if (selectionMode === "checkbox") {
      checkboxHtml = `
                <div class="p-tree-node-checkbox" role="checkbox" aria-checked="${isSelected ? "true" : isPartial ? "mixed" : "false"}">
                    <div class="p-tree-checkbox-box ${isSelected ? "p-highlight" : isPartial ? "p-indeterminate" : ""}">
                        ${isSelected ? SVG_ICONS.check : isPartial ? SVG_ICONS.minus : ""}
                    </div>
                </div>
            `;
    }
    let childrenHtml = "";
    if (hasChildren && isExpanded && node.children) {
      childrenHtml = `
                <ul class="p-tree-node-children" role="group">
                    ${node.children.map((child) => renderNode(child, level + 1)).join("")}
                </ul>
            `;
    }
    return `
            <li class="p-tree-node" role="treeitem" data-key="${key}" aria-expanded="${isExpanded}" aria-selected="${isSelected}" ${isDraggable ? 'draggable="true"' : ""}>
                <div class="p-tree-node-content ${isSelected ? "p-tree-node-selected" : ""}" data-key="${key}" tabindex="0">
                    <button type="button" class="p-tree-node-toggle-button ${!hasChildren ? "p-tree-node-toggle-placeholder" : ""}" data-toggle-key="${key}" tabindex="-1" aria-label="Toggle">
                        ${toggleSvg}
                    </button>
                    ${checkboxHtml}
                    <span class="p-tree-node-icon">${iconSvg}</span>
                    <span class="p-tree-node-label">${node.label || node.name}</span>
                </div>
                ${childrenHtml}
            </li>
        `;
  }
  function render() {
    const displayNodes = filterTreeNodes(treeData, filterQuery);
    let controlsHtml = "";
    if (showControls) {
      controlsHtml = `
                <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                    <button type="button" class="p-tree-expand-all p-button p-component p-button-outlined" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.75rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); cursor: pointer; color: var(--p-surface-700);">
                        ${SVG_ICONS.plus} Expand All
                    </button>
                    <button type="button" class="p-tree-collapse-all p-button p-component p-button-outlined" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.75rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--p-surface-300); background: var(--p-surface-0); cursor: pointer; color: var(--p-surface-700);">
                        ${SVG_ICONS.minus} Collapse All
                    </button>
                </div>
            `;
    }
    let selectAllHtml = "";
    if (showSelectAll && selectionMode === "checkbox") {
      const allKeys = getAllKeys(treeData);
      const selectedCount = Object.values(checkboxSelectionKeys).filter((v) => v?.checked).length;
      const partialCount = Object.values(checkboxSelectionKeys).filter((v) => v?.partialChecked).length;
      const isAll = allKeys.length > 0 && selectedCount === allKeys.length;
      const isSome = (selectedCount > 0 || partialCount > 0) && !isAll;
      selectAllHtml = `
                <div class="p-tree-select-all-header" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0.5rem 0.75rem 0.5rem; border-bottom: 1px solid var(--p-surface-200); margin-bottom: 0.5rem; cursor: pointer;">
                    <div class="p-tree-checkbox-box ${isAll ? "p-highlight" : isSome ? "p-indeterminate" : ""}">
                        ${isAll ? SVG_ICONS.check : isSome ? SVG_ICONS.minus : ""}
                    </div>
                    <label style="font-weight: 600; font-size: 0.875rem; color: var(--p-surface-800); cursor: pointer;">Select All</label>
                </div>
            `;
    }
    let keyboardBannerHtml = "";
    if (keyboardInfo) {
      const selectedCount = Object.values(multiSelectionKeys).filter(Boolean).length;
      keyboardBannerHtml = `
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.65rem 0.85rem; border-radius: 6px; border: 1px solid var(--p-surface-200); background: var(--p-surface-50); margin-bottom: 0.75rem;">
                    <span style="font-size: 0.8125rem; color: var(--p-surface-600);">
                        <kbd style="padding: 0.15rem 0.4rem; font-size: 0.75rem; border-radius: 4px; background: var(--p-surface-200); font-family: monospace;">\u2191</kbd>
                        <kbd style="padding: 0.15rem 0.4rem; font-size: 0.75rem; border-radius: 4px; background: var(--p-surface-200); font-family: monospace;">\u2193</kbd> navigate,
                        <kbd style="padding: 0.15rem 0.4rem; font-size: 0.75rem; border-radius: 4px; background: var(--p-surface-200); font-family: monospace;">\u2192</kbd> expand,
                        <kbd style="padding: 0.15rem 0.4rem; font-size: 0.75rem; border-radius: 4px; background: var(--p-surface-200); font-family: monospace;">\u2190</kbd> collapse,
                        <kbd style="padding: 0.15rem 0.4rem; font-size: 0.75rem; border-radius: 4px; background: var(--p-surface-200); font-family: monospace;">Space</kbd> select
                    </span>
                    <div style="display: flex; align-items: center; gap: 0.4rem;">
                        <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-700);">Selected</span>
                        <span style="font-size: 0.75rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 9999px; background: ${selectedCount ? "var(--p-primary-500)" : "var(--p-surface-300)"}; color: #ffffff;">${selectedCount}</span>
                    </div>
                </div>
            `;
    }
    let filterHtml = "";
    if (props.filter) {
      filterHtml = `
                <div class="p-tree-filter-container">
                    <span class="p-tree-filter-icon">${SVG_ICONS.search}</span>
                    <input type="text" class="p-tree-filter-input" placeholder="${props.filterPlaceholder || "Search"}" value="${filterQuery}" />
                </div>
            `;
    }
    let loadingOverlayHtml = "";
    if (isLoading && props.loadingMode !== "icon") {
      loadingOverlayHtml = `
                <div class="p-tree-loading-overlay">
                    <span style="color: var(--p-primary-500);">${SVG_ICONS.spinner}</span>
                </div>
            `;
    }
    let treeBodyHtml = "";
    if (isSkeleton && isLoading) {
      treeBodyHtml = `
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${Array.from({ length: 5 }).map((_, i) => `
                        <div class="p-tree-skeleton-row" style="padding-left: ${i > 1 ? "1.5rem" : "0.5rem"};">
                            <div class="p-tree-skeleton-icon"></div>
                            <div class="p-tree-skeleton-text" style="width: ${70 - i * 10}%;"></div>
                        </div>
                    `).join("")}
                </div>
            `;
    } else if (displayNodes.length === 0) {
      if (filterQuery) {
        treeBodyHtml = `<div style="padding: 1rem; text-align: center; color: var(--p-surface-500); font-size: 0.875rem;">No options found.</div>`;
      } else {
        treeBodyHtml = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 2.5rem 1rem; text-align: center;">
                        <div style="width: 3.5rem; height: 3.5rem; border-radius: 9999px; background: var(--p-surface-100); display: flex; align-items: center; justify-content: center; color: var(--p-surface-400);">
                            <span style="transform: scale(1.4);">${SVG_ICONS.folder}</span>
                        </div>
                        <div>
                            <p style="margin: 0; font-weight: 700; color: var(--p-surface-900); font-size: 0.9375rem;">No folders yet</p>
                            <p style="margin: 0.25rem 0 0 0; font-size: 0.8125rem; color: var(--p-surface-500);">Create your first folder to start building a tree.</p>
                        </div>
                        <button type="button" class="p-tree-add-node-btn p-button p-component p-button-sm" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.85rem; font-size: 0.8125rem; font-weight: 600; border-radius: 6px; background: var(--p-primary-500); color: #ffffff; border: none; cursor: pointer;">
                            ${SVG_ICONS.plus} New Folder
                        </button>
                    </div>
                `;
      }
    } else {
      treeBodyHtml = `
                <ul class="p-tree-root-children" role="tree">
                    ${displayNodes.map((node) => renderNode(node, 0)).join("")}
                </ul>
            `;
    }
    container.innerHTML = `
            ${controlsHtml}
            ${keyboardBannerHtml}
            <div class="p-tree p-component" role="tree" tabindex="-1">
                ${filterHtml ? `<div class="p-tree-header">${filterHtml}</div>` : ""}
                ${selectAllHtml}
                ${loadingOverlayHtml}
                <div class="p-tree-wrapper">
                    ${treeBodyHtml}
                </div>
            </div>
        `;
    bindEvents();
  }
  function bindEvents() {
    container.querySelectorAll(".p-tree-node-toggle-button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const key = btn.getAttribute("data-toggle-key");
        if (key && nodeMap.has(key)) {
          toggleNodeExpand(nodeMap.get(key));
        }
      });
    });
    container.querySelectorAll(".p-tree-node-content").forEach((contentEl) => {
      contentEl.addEventListener("click", (e) => {
        const key = contentEl.getAttribute("data-key");
        if (key && nodeMap.has(key)) {
          focusedKey = key;
          selectNode(nodeMap.get(key), e);
        }
      });
    });
    container.querySelectorAll(".p-tree-node-content").forEach((contentEl) => {
      contentEl.addEventListener("keydown", (e) => {
        const key = contentEl.getAttribute("data-key");
        if (!key || !nodeMap.has(key)) return;
        const node = nodeMap.get(key);
        if (e.key === "ArrowRight") {
          e.preventDefault();
          if (!expandedKeys[key] && node.children && node.children.length) {
            toggleNodeExpand(node);
          } else if (node.children && node.children.length) {
            const firstChildKey = String(node.children[0].key || node.children[0].id);
            const nextEl = container.querySelector(`.p-tree-node-content[data-key="${firstChildKey}"]`);
            nextEl?.focus();
          }
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          if (expandedKeys[key]) {
            toggleNodeExpand(node);
          } else {
            const parent = parentMap.get(key);
            if (parent) {
              const parentKey = String(parent.key || parent.id);
              const parentEl = container.querySelector(`.p-tree-node-content[data-key="${parentKey}"]`);
              parentEl?.focus();
            }
          }
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          const allVisible = Array.from(container.querySelectorAll(".p-tree-node-content"));
          const currIdx = allVisible.indexOf(contentEl);
          if (currIdx >= 0 && currIdx < allVisible.length - 1) {
            allVisible[currIdx + 1].focus();
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const allVisible = Array.from(container.querySelectorAll(".p-tree-node-content"));
          const currIdx = allVisible.indexOf(contentEl);
          if (currIdx > 0) {
            allVisible[currIdx - 1].focus();
          }
        } else if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          selectNode(node, e);
        }
      });
    });
    container.querySelector(".p-tree-expand-all")?.addEventListener("click", () => expandAll());
    container.querySelector(".p-tree-collapse-all")?.addEventListener("click", () => collapseAll());
    container.querySelector(".p-tree-select-all-header")?.addEventListener("click", () => toggleSelectAll());
    const filterInput = container.querySelector(".p-tree-filter-input");
    if (filterInput) {
      filterInput.addEventListener("input", (e) => {
        filterQuery = e.target.value;
        render();
        const newInput = container.querySelector(".p-tree-filter-input");
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(filterQuery.length, filterQuery.length);
        }
      });
    }
    container.querySelector(".p-tree-add-node-btn")?.addEventListener("click", () => {
      const newIndex = treeData.length + 1;
      treeData.push({
        key: `root-${Date.now()}`,
        label: `New Folder ${newIndex}`,
        icon: "folder"
      });
      buildMaps(treeData);
      render();
    });
    if (isDraggable || isDroppable) {
      container.querySelectorAll(".p-tree-node").forEach((nodeLi) => {
        const key = nodeLi.getAttribute("data-key");
        if (!key || !nodeMap.has(key)) return;
        const node = nodeMap.get(key);
        if (isDraggable) {
          nodeLi.addEventListener("dragstart", (e) => {
            e.stopPropagation();
            globalDraggedNode = { node, sourceScope: draggableScope };
            nodeLi.classList.add("p-tree-node-dragging");
            if (e.dataTransfer) {
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", key);
            }
          });
          nodeLi.addEventListener("dragend", () => {
            nodeLi.classList.remove("p-tree-node-dragging");
            globalDraggedNode = null;
          });
        }
        if (isDroppable) {
          nodeLi.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (globalDraggedNode && (droppableScope.includes(globalDraggedNode.sourceScope || "") || droppableScope.includes("all"))) {
              nodeLi.classList.add("p-tree-node-dragover");
              if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
            }
          });
          nodeLi.addEventListener("dragleave", (e) => {
            e.stopPropagation();
            nodeLi.classList.remove("p-tree-node-dragover");
          });
          nodeLi.addEventListener("drop", (e) => {
            e.preventDefault();
            e.stopPropagation();
            nodeLi.classList.remove("p-tree-node-dragover");
            if (globalDraggedNode && (droppableScope.includes(globalDraggedNode.sourceScope || "") || droppableScope.includes("all"))) {
              let removeNode2 = function(list) {
                const idx = list.findIndex((n) => n.key === dragged.key);
                if (idx >= 0) {
                  list.splice(idx, 1);
                  return true;
                }
                for (let item of list) {
                  if (item.children && removeNode2(item.children)) return true;
                }
                return false;
              };
              var removeNode = removeNode2;
              const dragged = globalDraggedNode.node;
              if (dragged.key === node.key) return;
              if (!node.children) node.children = [];
              node.children.push(dragged);
              expandedKeys[node.key] = true;
              removeNode2(treeData);
              buildMaps(treeData);
              notifyToast("info", "Node Dropped", `${dragged.label} moved into ${node.label}`);
              render();
            }
          });
        }
      });
    }
  }
  render();
}
export {
  TreeIsland as default
};
//# sourceMappingURL=tree-Z4YCN4WI.js.map
