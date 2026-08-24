import {
  useClickOutside
} from "./chunk-T4EPW24S.js";
import {
  useDisclosure
} from "./chunk-KEONGXN5.js";
import {
  getLucideIcon
} from "./chunk-G3Y35IKD.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/tree-select.ts
var CSS = `
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
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    color: var(--p-text-color);
    cursor: pointer;
    font-size: 0.875rem;
    line-height: 1.25;
    outline: none;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
    box-sizing: border-box;
}

.p-treeselect-label-container:hover:not(.is-disabled) {
    border-color: var(--p-surface-400);
}

.p-treeselect.is-focused .p-treeselect-label-container,
.p-treeselect-label-container:focus-visible {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

/* Filled Variant */
.p-treeselect.variant-filled .p-treeselect-label-container {
    background-color: var(--p-surface-100);
    border-color: transparent;
}
.p-treeselect.variant-filled .p-treeselect-label-container:hover:not(.is-disabled) {
    background-color: var(--p-surface-200);
}
.p-treeselect.variant-filled.is-focused .p-treeselect-label-container {
    background-color: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
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
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-treeselect.is-invalid.is-focused .p-treeselect-label-container {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-treeselect.is-disabled {
    opacity: 0.65;
    cursor: not-allowed;
}
.p-treeselect.is-disabled .p-treeselect-label-container {
    background-color: var(--p-surface-100);
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
    color: var(--p-text-color);
}
.p-treeselect-label.p-placeholder {
    color: var(--p-text-muted);
}

.p-treeselect-token {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.5rem;
    background: var(--p-surface-100);
    color: var(--p-surface-800);
    border: 1px solid var(--p-border-color);
    border-radius: calc(var(--p-border-radius) - 2px);
    font-size: 0.75rem;
    font-weight: 500;
}
.p-treeselect-token-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--p-surface-500);
    border: none;
    background: transparent;
    padding: 0;
    margin-left: 0.125rem;
    border-radius: 9999px;
}
.p-treeselect-token-remove:hover {
    color: var(--p-surface-900);
}

/* Actions (Clear & Chevron) */
.p-treeselect-actions {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-left: 0.5rem;
}
.p-treeselect-clear-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--p-surface-400);
    cursor: pointer;
    padding: 0.125rem;
    border-radius: 9999px;
    transition: color 150ms ease;
}
.p-treeselect-clear-icon:hover {
    color: var(--p-surface-700);
}
.p-treeselect-dropdown-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-surface-500);
    transition: transform 200ms ease;
}
.p-treeselect.is-open .p-treeselect-dropdown-icon {
    transform: rotate(180deg);
}

/* Dropdown Overlay */
.p-treeselect-overlay {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    min-width: 100%;
    z-index: 1000;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
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
    background: var(--p-surface-50);
    border-bottom: 1px solid var(--p-border-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.p-treeselect-filter-input {
    width: 100%;
    font-family: inherit;
    font-size: 0.8125rem;
    padding: 0.375rem 0.625rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: calc(var(--p-border-radius) - 2px);
    color: var(--p-text-color);
    outline: none;
    box-sizing: border-box;
}
.p-treeselect-filter-input:focus {
    border-color: var(--p-primary-500);
}

/* Header & Footer Templates */
.p-treeselect-header {
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-50);
    border-bottom: 1px solid var(--p-border-color);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--p-text-color);
}
.p-treeselect-footer {
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-50);
    border-top: 1px solid var(--p-border-color);
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
    padding-left: 1.25rem;
    margin: 0;
    list-style: none;
}

.p-treenode-content {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.5rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    cursor: pointer;
    color: var(--p-text-color);
    font-size: 0.8125rem;
    transition: background 150ms ease, color 150ms ease;
    outline: none;
}
.p-treenode-content:hover:not(.p-disabled) {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}
.p-treenode-content.p-highlight {
    background: var(--p-primary-50, #ecfdf5);
    color: var(--p-primary-700, #047857);
    font-weight: 600;
}
.p-treenode-content.p-highlight:hover:not(.p-disabled) {
    background: var(--p-primary-100, #d1fae5);
    color: var(--p-primary-800, #065f46);
}
.p-treenode-content.p-highlight .p-tree-toggler {
    color: var(--p-primary-700, #047857);
}
.p-treenode-content.p-highlight .p-treenode-icon {
    color: var(--p-primary-600, #059669);
}

.p-tree-toggler {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
    color: var(--p-surface-500);
    border-radius: 9999px;
    transition: transform 150ms ease, color 150ms ease;
    border: none;
    background: transparent;
    padding: 0;
}
.p-tree-toggler:hover {
    color: var(--p-surface-900);
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
    color: var(--p-primary-600);
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
    border: 1px solid var(--p-border-color);
    border-radius: 4px;
    background: var(--p-surface-0);
    cursor: pointer;
    transition: all 150ms ease;
}
.p-tree-checkbox:hover {
    border-color: var(--p-primary-500);
}
.p-tree-checkbox.p-checked {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
    color: #ffffff;
}
.p-tree-checkbox.p-indeterminate {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
    color: #ffffff;
}
.p-tree-checkbox svg {
    width: 12px;
    height: 12px;
}

/* ==================== DARK MODE ==================== */
.dark .p-treeselect-label-container {
    background-color: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-treeselect-label-container:hover:not(.is-disabled) {
    border-color: var(--p-surface-500);
}
.dark .p-treeselect.variant-filled .p-treeselect-label-container {
    background-color: var(--p-surface-800);
}
.dark .p-treeselect.variant-filled .p-treeselect-label-container:hover:not(.is-disabled) {
    background-color: var(--p-surface-700);
}
.dark .p-treeselect.variant-filled.is-focused .p-treeselect-label-container {
    background-color: var(--p-surface-900);
}
.dark .p-treeselect-token {
    background: var(--p-surface-800);
    color: var(--p-surface-100);
    border-color: var(--p-surface-700);
}
.dark .p-treeselect-overlay {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);
}
.dark .p-treeselect-filter-container,
.dark .p-treeselect-header,
.dark .p-treeselect-footer {
    background: var(--p-surface-850, #141b26);
    border-color: var(--p-surface-700);
}
.dark .p-treeselect-filter-input {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-treenode-content:hover:not(.p-disabled) {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
.dark .p-treenode-content.p-highlight {
    background: rgba(16, 185, 129, 0.16);
    color: var(--p-primary-300, #6ee7b7);
    font-weight: 600;
}
.dark .p-treenode-content.p-highlight:hover:not(.p-disabled) {
    background: rgba(16, 185, 129, 0.24);
    color: var(--p-primary-200, #a7f3d0);
}
.dark .p-treenode-content.p-highlight .p-tree-toggler {
    color: var(--p-primary-300);
}
.dark .p-treenode-content.p-highlight .p-treenode-icon {
    color: var(--p-primary-400);
}
.dark .p-tree-toggler {
    color: var(--p-surface-400);
}
.dark .p-tree-toggler:hover {
    color: var(--p-surface-100);
}
.dark .p-tree-checkbox {
    background: var(--p-surface-900);
    border-color: var(--p-surface-600);
}
`;
var checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
var minusSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
var chevronRightSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
var chevronDownSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
var searchSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
var xSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
function TreeSelectIsland(container, props) {
  injectIslandStyle("laughtale-treeselect", CSS);
  const rawNodes = props.nodes || props.options || props.departments || [];
  const selectionMode = props.selectionMode || "single";
  const displayMode = props.display || "comma";
  const isFilter = props.filter === true || String(props.filter) === "true";
  const isShowClear = props.showClear === true || props.clearable === true || String(props.showClear) === "true";
  const isFluid = props.fluid === true || String(props.fluid) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const isFilled = props.variant === "filled";
  const size = props.size || "normal";
  const placeholder = props.placeholder || "Select Item";
  function normalizeNodes(nodes) {
    return nodes.map((n) => ({
      ...n,
      key: n.key || n.id || String(n.label || n.name),
      label: n.label || n.name || n.key || n.id || "",
      children: n.children ? normalizeNodes(n.children) : void 0
    }));
  }
  const treeData = normalizeNodes(rawNodes);
  const nodeMap = /* @__PURE__ */ new Map();
  const parentMap = /* @__PURE__ */ new Map();
  function buildMaps(nodes, parentKey = null) {
    for (const n of nodes) {
      nodeMap.set(n.key, n);
      parentMap.set(n.key, parentKey);
      if (n.children && n.children.length > 0) {
        buildMaps(n.children, n.key);
      }
    }
  }
  buildMaps(treeData);
  const selectedKeys = /* @__PURE__ */ new Set();
  const initialVal = props.value ?? props.selectedValue;
  if (initialVal) {
    if (typeof initialVal === "string") {
      try {
        const parsed = JSON.parse(initialVal);
        if (Array.isArray(parsed)) parsed.forEach((k) => selectedKeys.add(String(k)));
        else if (typeof parsed === "object" && parsed !== null) {
          Object.entries(parsed).forEach(([k, v]) => {
            if (v) selectedKeys.add(k);
          });
        } else selectedKeys.add(initialVal);
      } catch {
        selectedKeys.add(initialVal);
      }
    } else if (Array.isArray(initialVal)) {
      initialVal.forEach((k) => selectedKeys.add(String(k)));
    } else if (typeof initialVal === "object") {
      Object.entries(initialVal).forEach(([k, v]) => {
        if (v) selectedKeys.add(k);
      });
    }
  }
  const expandedKeys = /* @__PURE__ */ new Set();
  treeData.forEach((n) => {
    if (n.children && n.children.length > 0) {
      expandedKeys.add(n.key);
    }
  });
  let searchQuery = "";
  const disclosure = useDisclosure({
    defaultIsOpen: false,
    onOpen: () => {
      container.classList.add("is-open", "is-focused");
      const overlay = container.querySelector(".p-treeselect-overlay");
      if (overlay) overlay.classList.add("is-open");
      if (isFilter) {
        const filterInp = container.querySelector(".p-treeselect-filter-input");
        setTimeout(() => filterInp?.focus(), 50);
      }
    },
    onClose: () => {
      container.classList.remove("is-open", "is-focused");
      const overlay = container.querySelector(".p-treeselect-overlay");
      if (overlay) overlay.classList.remove("is-open");
    }
  });
  useClickOutside(container, () => disclosure.close());
  function init() {
    const rootClasses = [
      "laughtale-treeselect",
      "p-treeselect",
      isFluid ? "p-treeselect-fluid" : "",
      isFilled ? "variant-filled" : "",
      size !== "normal" ? `size-${size}` : "",
      isInvalid ? "is-invalid" : "",
      isDisabled ? "is-disabled" : ""
    ].filter(Boolean).join(" ");
    container.className = rootClasses;
    container.innerHTML = `
            <div class="p-treeselect-label-container" tabindex="${isDisabled ? "-1" : "0"}" role="combobox" aria-haspopup="tree" aria-expanded="false" aria-controls="${props.inputId || "treeselect"}_overlay">
                <div class="p-treeselect-label"></div>
                <div class="p-treeselect-actions">
                    <button type="button" class="p-treeselect-clear-icon" aria-label="Clear selection" tabindex="-1" style="display: none;">
                        ${xSvg}
                    </button>
                    <span class="p-treeselect-dropdown-icon">
                        ${chevronDownSvg}
                    </span>
                </div>
            </div>

            <div class="p-treeselect-overlay" id="${props.inputId || "treeselect"}_overlay" role="dialog">
                ${props.header ? `<div class="p-treeselect-header">${props.header}</div>` : ""}
                ${isFilter ? `
                    <div class="p-treeselect-filter-container">
                        <span style="color: var(--p-surface-400); display: flex;">${searchSvg}</span>
                        <input type="text" class="p-treeselect-filter-input" placeholder="${props.filterPlaceholder || "Search tree..."}" />
                    </div>
                ` : ""}
                <ul class="p-treeselect-tree" role="tree"></ul>
                ${props.footer ? `<div class="p-treeselect-footer">${props.footer}</div>` : ""}
            </div>

            <input type="hidden" name="${props.name || props.targetInputName || "tree_value"}" value="" />
        `;
    updateTriggerDisplay();
    renderTreeList();
    bindEvents();
  }
  function getSelectedLabels() {
    const result = [];
    selectedKeys.forEach((k) => {
      const node = nodeMap.get(k);
      if (node) result.push({ key: node.key, label: node.label });
    });
    return result;
  }
  function updateTriggerDisplay() {
    const labelEl = container.querySelector(".p-treeselect-label");
    const clearBtn = container.querySelector(".p-treeselect-clear-icon");
    const hiddenInp = container.querySelector(`input[name="${props.name || props.targetInputName || "tree_value"}"]`);
    const selected = getSelectedLabels();
    if (selected.length === 0) {
      labelEl.className = "p-treeselect-label p-placeholder";
      labelEl.textContent = placeholder;
      clearBtn.style.display = "none";
      hiddenInp.value = "";
    } else {
      labelEl.className = "p-treeselect-label";
      if (isShowClear && !isDisabled) clearBtn.style.display = "inline-flex";
      else clearBtn.style.display = "none";
      if (displayMode === "chip") {
        labelEl.innerHTML = selected.map((s) => `
                    <span class="p-treeselect-token">
                        <span>${s.label}</span>
                        ${!isDisabled ? `<button type="button" class="p-treeselect-token-remove" data-key="${s.key}" aria-label="Remove ${s.label}">${xSvg}</button>` : ""}
                    </span>
                `).join("");
        labelEl.querySelectorAll(".p-treeselect-token-remove").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const key = btn.getAttribute("data-key");
            toggleNodeSelection(key, false);
          });
        });
      } else {
        labelEl.textContent = selected.map((s) => s.label).join(", ");
      }
      if (selectionMode === "single") {
        hiddenInp.value = selected[0]?.key || "";
      } else {
        hiddenInp.value = JSON.stringify(Array.from(selectedKeys));
      }
    }
  }
  function filterTree(nodes, query) {
    if (!query) return nodes;
    return nodes.reduce((acc, node) => {
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
  function getCheckboxState(node) {
    if (!node.children || node.children.length === 0) {
      return selectedKeys.has(node.key) ? "checked" : "unchecked";
    }
    let allChecked = true;
    let noneChecked = true;
    function checkChildren(children) {
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
    if (allChecked) return "checked";
    if (noneChecked && !selectedKeys.has(node.key)) return "unchecked";
    return "indeterminate";
  }
  function renderTreeList() {
    const treeList = container.querySelector(".p-treeselect-tree");
    const visibleNodes = filterTree(treeData, searchQuery.toLowerCase().trim());
    if (visibleNodes.length === 0) {
      treeList.innerHTML = `<li class="p-treenode" style="padding: 1rem; text-align: center; color: var(--p-text-muted); font-size: 0.8125rem;">No results found</li>`;
      return;
    }
    function renderNodesHtml(nodes) {
      return nodes.map((node) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedKeys.has(node.key);
        const isSelected = selectedKeys.has(node.key);
        const iconSvg = node.icon ? getLucideIcon(node.icon, 16) : hasChildren ? isExpanded ? getLucideIcon("folderOpen", 16) : getLucideIcon("folder", 16) : getLucideIcon("fileText", 16);
        let checkboxHtml = "";
        if (selectionMode === "checkbox") {
          const cbState = getCheckboxState(node);
          const cbClass = cbState === "checked" ? "p-checked" : cbState === "indeterminate" ? "p-indeterminate" : "";
          const cbIcon = cbState === "checked" ? checkSvg : cbState === "indeterminate" ? minusSvg : "";
          checkboxHtml = `
                        <span class="p-tree-checkbox ${cbClass}" data-key="${node.key}" role="checkbox" aria-checked="${cbState === "checked" ? "true" : cbState === "indeterminate" ? "mixed" : "false"}">
                            ${cbIcon}
                        </span>
                    `;
        }
        return `
                    <li class="p-treenode" role="treeitem" aria-expanded="${hasChildren ? isExpanded : "false"}" aria-selected="${isSelected}" data-key="${node.key}">
                        <div class="p-treenode-content ${isSelected && selectionMode !== "checkbox" ? "p-highlight" : ""}" data-key="${node.key}" tabindex="0">
                            ${hasChildren ? `
                                <button type="button" class="p-tree-toggler ${isExpanded ? "p-expanded" : ""}" data-toggle="${node.key}" aria-label="Toggle node" tabindex="-1">
                                    ${chevronRightSvg}
                                </button>
                            ` : `<span class="p-tree-toggler-empty"></span>`}
                            ${checkboxHtml}
                            <span class="p-treenode-icon">${iconSvg}</span>
                            <span class="p-treenode-label">${node.label}</span>
                        </div>
                        ${hasChildren && isExpanded ? `
                            <ul class="p-treenode-children" role="group">
                                ${renderNodesHtml(node.children)}
                            </ul>
                        ` : ""}
                    </li>
                `;
      }).join("");
    }
    treeList.innerHTML = renderNodesHtml(visibleNodes);
    bindNodeEvents();
  }
  function bindNodeEvents() {
    const treeList = container.querySelector(".p-treeselect-tree");
    treeList.querySelectorAll(".p-tree-toggler").forEach((toggler) => {
      toggler.addEventListener("click", (e) => {
        e.stopPropagation();
        const key = toggler.getAttribute("data-toggle");
        if (expandedKeys.has(key)) expandedKeys.delete(key);
        else expandedKeys.add(key);
        renderTreeList();
      });
    });
    treeList.querySelectorAll(".p-treenode-content").forEach((content) => {
      content.addEventListener("click", (e) => {
        const target = e.target;
        if (target.closest(".p-tree-toggler")) return;
        const key = content.getAttribute("data-key");
        const node = nodeMap.get(key);
        if (!node || node.disabled) return;
        if (selectionMode === "single") {
          selectedKeys.clear();
          selectedKeys.add(key);
          updateTriggerDisplay();
          renderTreeList();
          disclosure.close();
          syncValue();
        } else if (selectionMode === "multiple") {
          if (selectedKeys.has(key)) selectedKeys.delete(key);
          else selectedKeys.add(key);
          updateTriggerDisplay();
          renderTreeList();
          syncValue();
        } else if (selectionMode === "checkbox") {
          const currentState = getCheckboxState(node);
          const shouldCheck = currentState !== "checked";
          toggleNodeSelection(key, shouldCheck);
        }
      });
    });
  }
  function toggleNodeSelection(key, select) {
    const node = nodeMap.get(key);
    if (!node) return;
    function setDescendants(n, sel) {
      if (sel) selectedKeys.add(n.key);
      else selectedKeys.delete(n.key);
      if (n.children) {
        n.children.forEach((c) => setDescendants(c, sel));
      }
    }
    setDescendants(node, select);
    updateTriggerDisplay();
    renderTreeList();
    syncValue();
  }
  function bindEvents() {
    const trigger = container.querySelector(".p-treeselect-label-container");
    const clearBtn = container.querySelector(".p-treeselect-clear-icon");
    const filterInput = container.querySelector(".p-treeselect-filter-input");
    trigger.addEventListener("click", (e) => {
      if (e.target.closest(".p-treeselect-clear-icon") || e.target.closest(".p-treeselect-token-remove")) return;
      if (isDisabled) return;
      disclosure.toggle();
    });
    trigger.addEventListener("keydown", (e) => {
      if (isDisabled) return;
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        disclosure.open();
      } else if (e.key === "Escape") {
        disclosure.close();
      }
    });
    clearBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedKeys.clear();
      updateTriggerDisplay();
      renderTreeList();
      syncValue();
    });
    if (filterInput) {
      filterInput.addEventListener("input", () => {
        searchQuery = filterInput.value;
        renderTreeList();
      });
      filterInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") disclosure.close();
      });
    }
  }
  function syncValue() {
    const selected = getSelectedLabels();
    const payload = selectionMode === "single" ? selected[0]?.key || null : Array.from(selectedKeys);
    container.dispatchEvent(new CustomEvent("treeselect:change", {
      bubbles: true,
      detail: { value: payload, selectedNodes: selected }
    }));
    container.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      detail: { value: payload }
    }));
  }
  init();
}
export {
  TreeSelectIsland as default
};
//# sourceMappingURL=tree-select-JBGQ75LI.js.map
