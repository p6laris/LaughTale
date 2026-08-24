import {
  useAutoAnimate
} from "./chunk-YSGXRJIU.js";
import {
  LucideIcons
} from "./chunk-XHF3KYSF.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/picklist.ts
var PICKLIST_CSS = `
.p-picklist {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    width: 100%;
    font-family: var(--p-font-family, inherit);
    color: var(--p-surface-800, #1e293b);
}

.p-picklist-controls {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
    flex-shrink: 0;
}

.p-picklist-control-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border-radius: var(--p-border-radius, 6px);
    border: 1px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    cursor: pointer;
    transition: all 0.15s ease;
    outline: none;
}
.p-picklist-control-btn:hover:not(:disabled) {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-400, #94a3b8);
}
.p-picklist-control-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.p-picklist-list-container {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--p-surface-200, #e2e8f0);
    border-radius: var(--p-border-radius-lg, 8px);
    background: var(--p-surface-0, #ffffff);
    overflow: hidden;
    min-width: 0;
    box-shadow: var(--p-shadow-xs, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
}

.p-picklist-header {
    padding: 0.75rem 1rem;
    background: var(--p-surface-50, #f8fafc);
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--p-surface-800, #1e293b);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.p-picklist-filter-container {
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-50, #f8fafc);
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    position: relative;
    display: flex;
    align-items: center;
}
.p-picklist-filter-input {
    width: 100%;
    padding: 0.4rem 2rem 0.4rem 0.65rem;
    font-size: 0.8125rem;
    border: 1px solid var(--p-surface-300, #cbd5e1);
    border-radius: var(--p-border-radius, 6px);
    background: var(--p-surface-0, #ffffff);
    color: inherit;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.p-picklist-filter-input:focus {
    border-color: var(--p-primary-500, #10b981);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}
.p-picklist-filter-icon {
    position: absolute;
    right: 1.25rem;
    color: var(--p-surface-400, #94a3b8);
    pointer-events: none;
    display: flex;
    align-items: center;
}

.p-picklist-list {
    list-style: none;
    margin: 0;
    padding: 0.25rem 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.p-picklist-item {
    padding: 0.625rem 1rem;
    margin: 0.125rem 0.25rem;
    border-radius: var(--p-border-radius-xs, 5px);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: var(--p-surface-700, #334155);
    user-select: none;
    transition: background-color 0.15s ease, color 0.15s ease;
}
.p-picklist-item:hover:not(.p-highlight) {
    background: var(--p-surface-100, #f1f5f9);
    color: var(--p-surface-900, #0f172a);
}
.p-picklist-item.p-highlight {
    background: rgba(16, 185, 129, 0.1) !important;
    color: var(--p-primary-700, #047857) !important;
    font-weight: 600;
}

/* Custom Checkbox */
.p-checkbox-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: var(--p-border-radius-xs, 4px);
    border: 2px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    cursor: pointer;
    transition: all 0.15s ease;
    flex-shrink: 0;
}
.p-checkbox-box.p-checked {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}
.p-checkbox-box.p-indeterminate {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}

/* Custom Item Content */
.p-picklist-product-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
}
.p-picklist-product-img {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 6px;
    background: var(--p-surface-100, #f1f5f9);
    border: 1px solid var(--p-surface-200, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--p-primary-600, #059669);
    flex-shrink: 0;
}
.p-picklist-product-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
}
.p-picklist-product-name {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--p-surface-900, #0f172a);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.p-picklist-product-category {
    font-size: 0.75rem;
    color: var(--p-surface-500, #64748b);
}
.p-picklist-product-price {
    font-weight: 700;
    font-size: 0.875rem;
    color: var(--p-surface-900, #0f172a);
}

.p-picklist-member-item {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
}
.p-picklist-member-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    background: var(--p-primary-100, #d1fae5);
    color: var(--p-primary-700, #047857);
    font-weight: 700;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

/* Empty State */
.p-picklist-empty {
    padding: 2.5rem 1rem;
    text-align: center;
    color: var(--p-surface-400, #94a3b8);
    font-size: 0.8125rem;
    font-style: italic;
}

/* Striped Rows */
.p-picklist-striped .p-picklist-item:nth-child(even):not(.p-highlight) {
    background: var(--p-surface-50, #f8fafc);
}

/* Dark Mode Tokens */
.dark .p-picklist,
[data-theme="dark"] .p-picklist {
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-picklist-list-container,
[data-theme="dark"] .p-picklist-list-container {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
.dark .p-picklist-header,
.dark .p-picklist-filter-container,
[data-theme="dark"] .p-picklist-header,
[data-theme="dark"] .p-picklist-filter-container {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-picklist-filter-input,
[data-theme="dark"] .p-picklist-filter-input {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-600, #475569) !important;
    color: #ffffff !important;
}
.dark .p-picklist-control-btn,
[data-theme="dark"] .p-picklist-control-btn {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-600, #475569) !important;
    color: var(--p-surface-200, #e2e8f0) !important;
}
.dark .p-picklist-control-btn:hover:not(:disabled),
[data-theme="dark"] .p-picklist-control-btn:hover:not(:disabled) {
    background: var(--p-surface-700, #334155) !important;
    color: #ffffff !important;
}
.dark .p-picklist-item:hover:not(.p-highlight),
[data-theme="dark"] .p-picklist-item:hover:not(.p-highlight) {
    background: var(--p-surface-800, #1e293b) !important;
    color: #ffffff !important;
}
.dark .p-picklist-product-name,
[data-theme="dark"] .p-picklist-product-name,
.dark .p-picklist-product-price,
[data-theme="dark"] .p-picklist-product-price {
    color: var(--p-surface-100, #f1f5f9) !important;
}
.dark .p-picklist-product-img,
[data-theme="dark"] .p-picklist-product-img {
    background: var(--p-surface-800, #1e293b) !important;
    border-color: var(--p-surface-700, #334155) !important;
}
`;
function PickListIsland(container, props) {
  injectIslandStyle("picklist", PICKLIST_CSS);
  const initialSource = props.value ? props.value[0] : props.source || [];
  const initialTarget = props.value ? props.value[1] : props.target || [];
  let sourceList = [...initialSource];
  let targetList = [...initialTarget];
  const dataKey = props.dataKey || "id";
  const isCheckbox = !!props.checkbox;
  const isFilter = !!props.filter;
  const filterBy = props.filterBy || "name";
  const sourceHeader = props.sourceHeader || "Available";
  const targetHeader = props.targetHeader || "Selected";
  const showSourceControls = !!props.showSourceControls;
  const showTargetControls = !!props.showTargetControls;
  const scrollHeight = props.scrollHeight || "18rem";
  const emptyMessageSource = props.emptyMessageSource || "No available options";
  const emptyMessageTarget = props.emptyMessageTarget || "No available options";
  let selectedSource = /* @__PURE__ */ new Set();
  let selectedTarget = /* @__PURE__ */ new Set();
  let sourceFilterQuery = "";
  let targetFilterQuery = "";
  function getItemId(item) {
    return String(item[dataKey] || item.id || item.name);
  }
  function renderCellContent(item, isSelected) {
    const checkboxHtml = isCheckbox ? `
            <div class="p-checkbox-box ${isSelected ? "p-checked" : ""}" role="checkbox" aria-checked="${isSelected}">
                ${isSelected ? LucideIcons.check : ""}
            </div>
        ` : "";
    if (item.price != null || item.category != null || item.image != null) {
      return `
                ${checkboxHtml}
                <div class="p-picklist-product-item">
                    <div class="p-picklist-product-img">
                        ${LucideIcons.package}
                    </div>
                    <div class="p-picklist-product-details">
                        <span class="p-picklist-product-name">${item.name}</span>
                        <span class="p-picklist-product-category">${item.category || ""}</span>
                    </div>
                    ${item.price != null ? `<span class="p-picklist-product-price">$${item.price}</span>` : ""}
                </div>
            `;
    }
    if (item.avatar != null || item.role != null) {
      const initials = item.name.split(" ").map((w) => w[0]).join("").substring(0, 2);
      return `
                ${checkboxHtml}
                <div class="p-picklist-member-item">
                    <div class="p-picklist-member-avatar">${initials}</div>
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: 600; color: var(--p-surface-900);">${item.name}</span>
                        ${item.role ? `<span style="font-size: 0.75rem; color: var(--p-surface-500);">${item.role}</span>` : ""}
                    </div>
                </div>
            `;
    }
    return `
            ${checkboxHtml}
            <span style="flex: 1; font-weight: ${isSelected ? "600" : "normal"};">${item.name}</span>
        `;
  }
  function buildShell() {
    const sourceControlsHtml = showSourceControls ? `
            <div class="p-picklist-controls p-picklist-source-controls">
                <button type="button" class="p-picklist-control-btn btn-source-top" title="Move Top" aria-label="Move Top">${LucideIcons.chevronsUp}</button>
                <button type="button" class="p-picklist-control-btn btn-source-up" title="Move Up" aria-label="Move Up">${LucideIcons.chevronUp}</button>
                <button type="button" class="p-picklist-control-btn btn-source-down" title="Move Down" aria-label="Move Down">${LucideIcons.chevronDown}</button>
                <button type="button" class="p-picklist-control-btn btn-source-bottom" title="Move Bottom" aria-label="Move Bottom">${LucideIcons.chevronsDown}</button>
            </div>
        ` : "";
    const targetControlsHtml = showTargetControls ? `
            <div class="p-picklist-controls p-picklist-target-controls">
                <button type="button" class="p-picklist-control-btn btn-target-top" title="Move Top" aria-label="Move Top">${LucideIcons.chevronsUp}</button>
                <button type="button" class="p-picklist-control-btn btn-target-up" title="Move Up" aria-label="Move Up">${LucideIcons.chevronUp}</button>
                <button type="button" class="p-picklist-control-btn btn-target-down" title="Move Down" aria-label="Move Down">${LucideIcons.chevronDown}</button>
                <button type="button" class="p-picklist-control-btn btn-target-bottom" title="Move Bottom" aria-label="Move Bottom">${LucideIcons.chevronsDown}</button>
            </div>
        ` : "";
    const sourceHeaderCheckboxHtml = isCheckbox ? `
            <div class="p-checkbox-box p-source-select-all" role="checkbox" aria-checked="false"></div>
        ` : "";
    const targetHeaderCheckboxHtml = isCheckbox ? `
            <div class="p-checkbox-box p-target-select-all" role="checkbox" aria-checked="false"></div>
        ` : "";
    const sourceFilterHtml = isFilter ? `
            <div class="p-picklist-filter-container">
                <input type="text" class="p-picklist-filter-input p-source-filter" placeholder="${props.sourceFilterPlaceholder || "Search by name"}" />
                <span class="p-picklist-filter-icon">${LucideIcons.search}</span>
            </div>
        ` : "";
    const targetFilterHtml = isFilter ? `
            <div class="p-picklist-filter-container">
                <input type="text" class="p-picklist-filter-input p-target-filter" placeholder="${props.targetFilterPlaceholder || "Search by name"}" />
                <span class="p-picklist-filter-icon">${LucideIcons.search}</span>
            </div>
        ` : "";
    container.innerHTML = `
            <div class="p-picklist p-component">
                ${sourceControlsHtml}

                <!-- Source List Box -->
                <div class="p-picklist-list-container">
                    <div class="p-picklist-header">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            ${sourceHeaderCheckboxHtml}
                            <span>${sourceHeader}</span>
                        </div>
                        <span class="p-source-count" style="font-size: 0.75rem; font-weight: 600; color: var(--p-surface-500);">0 items</span>
                    </div>
                    ${sourceFilterHtml}
                    <ul class="p-picklist-list picklist-source-list" style="height: ${scrollHeight};" role="listbox" aria-multiselectable="true" tabindex="0">
                    </ul>
                </div>

                <!-- Transfer Buttons (Center) -->
                <div class="p-picklist-controls p-picklist-transfer-controls">
                    <button type="button" class="p-picklist-control-btn btn-move-to-target" title="Move to Target" aria-label="Move to Target" disabled>
                        ${LucideIcons.chevronRight}
                    </button>
                    <button type="button" class="p-picklist-control-btn btn-move-all-to-target" title="Move All to Target" aria-label="Move All to Target">
                        ${LucideIcons.chevronsRight}
                    </button>
                    <button type="button" class="p-picklist-control-btn btn-move-to-source" title="Move to Source" aria-label="Move to Source" disabled>
                        ${LucideIcons.chevronLeft}
                    </button>
                    <button type="button" class="p-picklist-control-btn btn-move-all-to-source" title="Move All to Source" aria-label="Move All to Source">
                        ${LucideIcons.chevronsLeft}
                    </button>
                </div>

                <!-- Target List Box -->
                <div class="p-picklist-list-container">
                    <div class="p-picklist-header">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            ${targetHeaderCheckboxHtml}
                            <span>${targetHeader}</span>
                        </div>
                        <span class="p-target-count" style="font-size: 0.75rem; font-weight: 600; color: var(--p-surface-500);">0 items</span>
                    </div>
                    ${targetFilterHtml}
                    <ul class="p-picklist-list picklist-target-list" style="height: ${scrollHeight};" role="listbox" aria-multiselectable="true" tabindex="0">
                    </ul>
                </div>

                ${targetControlsHtml}
            </div>
        `;
    const srcEl = container.querySelector(".picklist-source-list");
    const tgtEl = container.querySelector(".picklist-target-list");
    if (srcEl) useAutoAnimate(srcEl, { duration: 180 });
    if (tgtEl) useAutoAnimate(tgtEl, { duration: 180 });
    bindPermanentEvents();
    updateSourceList();
    updateTargetList();
    updateTransferButtons();
  }
  function updateSourceSelectionUI() {
    const rootEl = container.firstElementChild;
    if (!rootEl) return;
    const filteredSource = sourceList.filter((item) => {
      if (!isFilter || !sourceFilterQuery.trim()) return true;
      const val = String(item[filterBy] || item.name || "").toLowerCase();
      return val.includes(sourceFilterQuery.toLowerCase());
    });
    const sourceSelectAll = rootEl.querySelector(".p-source-select-all");
    if (sourceSelectAll) {
      const isAll = filteredSource.length > 0 && filteredSource.every((it) => selectedSource.has(getItemId(it)));
      const isIndet = filteredSource.some((it) => selectedSource.has(getItemId(it))) && !isAll;
      sourceSelectAll.className = `p-checkbox-box p-source-select-all ${isAll ? "p-checked" : isIndet ? "p-indeterminate" : ""}`;
      sourceSelectAll.setAttribute("aria-checked", String(isAll));
      sourceSelectAll.innerHTML = isAll ? LucideIcons.check : isIndet ? '<span style="width: 8px; height: 2px; background: white;"></span>' : "";
    }
    const srcUl = rootEl.querySelector(".picklist-source-list");
    if (srcUl) {
      srcUl.querySelectorAll(".source-item").forEach((el) => {
        const id = el.getAttribute("data-id");
        if (!id) return;
        const isSelected = selectedSource.has(id);
        el.classList.toggle("p-highlight", isSelected);
        el.setAttribute("aria-selected", String(isSelected));
        if (isCheckbox) {
          const chk = el.querySelector(".p-checkbox-box");
          if (chk) {
            chk.className = `p-checkbox-box ${isSelected ? "p-checked" : ""}`;
            chk.setAttribute("aria-checked", String(isSelected));
            chk.innerHTML = isSelected ? LucideIcons.check : "";
          }
        }
      });
    }
    updateTransferButtons();
    dispatchSelectionEvent();
  }
  function updateTargetSelectionUI() {
    const rootEl = container.firstElementChild;
    if (!rootEl) return;
    const filteredTarget = targetList.filter((item) => {
      if (!isFilter || !targetFilterQuery.trim()) return true;
      const val = String(item[filterBy] || item.name || "").toLowerCase();
      return val.includes(targetFilterQuery.toLowerCase());
    });
    const targetSelectAll = rootEl.querySelector(".p-target-select-all");
    if (targetSelectAll) {
      const isAll = filteredTarget.length > 0 && filteredTarget.every((it) => selectedTarget.has(getItemId(it)));
      const isIndet = filteredTarget.some((it) => selectedTarget.has(getItemId(it))) && !isAll;
      targetSelectAll.className = `p-checkbox-box p-target-select-all ${isAll ? "p-checked" : isIndet ? "p-indeterminate" : ""}`;
      targetSelectAll.setAttribute("aria-checked", String(isAll));
      targetSelectAll.innerHTML = isAll ? LucideIcons.check : isIndet ? '<span style="width: 8px; height: 2px; background: white;"></span>' : "";
    }
    const tgtUl = rootEl.querySelector(".picklist-target-list");
    if (tgtUl) {
      tgtUl.querySelectorAll(".target-item").forEach((el) => {
        const id = el.getAttribute("data-id");
        if (!id) return;
        const isSelected = selectedTarget.has(id);
        el.classList.toggle("p-highlight", isSelected);
        el.setAttribute("aria-selected", String(isSelected));
        if (isCheckbox) {
          const chk = el.querySelector(".p-checkbox-box");
          if (chk) {
            chk.className = `p-checkbox-box ${isSelected ? "p-checked" : ""}`;
            chk.setAttribute("aria-checked", String(isSelected));
            chk.innerHTML = isSelected ? LucideIcons.check : "";
          }
        }
      });
    }
    updateTransferButtons();
    dispatchSelectionEvent();
  }
  function updateSourceList() {
    const rootEl = container.firstElementChild;
    if (!rootEl) return;
    const filteredSource = sourceList.filter((item) => {
      if (!isFilter || !sourceFilterQuery.trim()) return true;
      const val = String(item[filterBy] || item.name || "").toLowerCase();
      return val.includes(sourceFilterQuery.toLowerCase());
    });
    const countEl = rootEl.querySelector(".p-source-count");
    if (countEl) countEl.textContent = `${filteredSource.length} items`;
    const srcUl = rootEl.querySelector(".picklist-source-list");
    if (srcUl) {
      if (filteredSource.length === 0) {
        srcUl.innerHTML = `<li class="p-picklist-empty">${sourceFilterQuery ? "No results found" : emptyMessageSource}</li>`;
      } else {
        srcUl.innerHTML = filteredSource.map((it) => {
          const id = getItemId(it);
          const isSelected = selectedSource.has(id);
          return `
                        <li class="p-picklist-item source-item ${isSelected ? "p-highlight" : ""}" 
                            data-id="${id}" 
                            role="option" 
                            aria-selected="${isSelected}">
                            ${renderCellContent(it, isSelected)}
                        </li>
                    `;
        }).join("");
        srcUl.querySelectorAll(".source-item").forEach((el) => {
          el.addEventListener("click", (e) => {
            const id = el.getAttribute("data-id");
            if (!id) return;
            const mouseEvent = e;
            if (isCheckbox || mouseEvent.ctrlKey || mouseEvent.metaKey) {
              if (selectedSource.has(id)) selectedSource.delete(id);
              else selectedSource.add(id);
            } else {
              if (selectedSource.has(id) && selectedSource.size === 1) {
                selectedSource.clear();
              } else {
                selectedSource.clear();
                selectedSource.add(id);
              }
            }
            updateSourceSelectionUI();
          });
        });
      }
    }
    updateSourceSelectionUI();
  }
  function updateTargetList() {
    const rootEl = container.firstElementChild;
    if (!rootEl) return;
    const filteredTarget = targetList.filter((item) => {
      if (!isFilter || !targetFilterQuery.trim()) return true;
      const val = String(item[filterBy] || item.name || "").toLowerCase();
      return val.includes(targetFilterQuery.toLowerCase());
    });
    const countEl = rootEl.querySelector(".p-target-count");
    if (countEl) countEl.textContent = `${filteredTarget.length} items`;
    const tgtUl = rootEl.querySelector(".picklist-target-list");
    if (tgtUl) {
      if (filteredTarget.length === 0) {
        tgtUl.innerHTML = `<li class="p-picklist-empty">${targetFilterQuery ? "No results found" : emptyMessageTarget}</li>`;
      } else {
        tgtUl.innerHTML = filteredTarget.map((it) => {
          const id = getItemId(it);
          const isSelected = selectedTarget.has(id);
          return `
                        <li class="p-picklist-item target-item ${isSelected ? "p-highlight" : ""}" 
                            data-id="${id}" 
                            role="option" 
                            aria-selected="${isSelected}">
                            ${renderCellContent(it, isSelected)}
                        </li>
                    `;
        }).join("");
        tgtUl.querySelectorAll(".target-item").forEach((el) => {
          el.addEventListener("click", (e) => {
            const id = el.getAttribute("data-id");
            if (!id) return;
            const mouseEvent = e;
            if (isCheckbox || mouseEvent.ctrlKey || mouseEvent.metaKey) {
              if (selectedTarget.has(id)) selectedTarget.delete(id);
              else selectedTarget.add(id);
            } else {
              if (selectedTarget.has(id) && selectedTarget.size === 1) {
                selectedTarget.clear();
              } else {
                selectedTarget.clear();
                selectedTarget.add(id);
              }
            }
            updateTargetSelectionUI();
          });
        });
      }
    }
    updateTargetSelectionUI();
  }
  function updateTransferButtons() {
    const rootEl = container.firstElementChild;
    if (!rootEl) return;
    const btnMoveTarget = rootEl.querySelector(".btn-move-to-target");
    if (btnMoveTarget) btnMoveTarget.disabled = selectedSource.size === 0;
    const btnMoveAllTarget = rootEl.querySelector(".btn-move-all-to-target");
    if (btnMoveAllTarget) btnMoveAllTarget.disabled = sourceList.length === 0;
    const btnMoveSource = rootEl.querySelector(".btn-move-to-source");
    if (btnMoveSource) btnMoveSource.disabled = selectedTarget.size === 0;
    const btnMoveAllSource = rootEl.querySelector(".btn-move-all-to-source");
    if (btnMoveAllSource) btnMoveAllSource.disabled = targetList.length === 0;
  }
  function bindPermanentEvents() {
    const rootEl = container.firstElementChild;
    if (!rootEl) return;
    const srcFilterInput = rootEl.querySelector(".p-source-filter");
    if (srcFilterInput) {
      srcFilterInput.addEventListener("input", (e) => {
        sourceFilterQuery = e.target.value;
        updateSourceList();
      });
    }
    const tgtFilterInput = rootEl.querySelector(".p-target-filter");
    if (tgtFilterInput) {
      tgtFilterInput.addEventListener("input", (e) => {
        targetFilterQuery = e.target.value;
        updateTargetList();
      });
    }
    const sourceSelectAll = rootEl.querySelector(".p-source-select-all");
    if (sourceSelectAll) {
      sourceSelectAll.addEventListener("click", () => {
        const isAll = sourceSelectAll.classList.contains("p-checked");
        if (isAll) {
          selectedSource.clear();
        } else {
          sourceList.forEach((it) => selectedSource.add(getItemId(it)));
        }
        updateSourceSelectionUI();
      });
    }
    const targetSelectAll = rootEl.querySelector(".p-target-select-all");
    if (targetSelectAll) {
      targetSelectAll.addEventListener("click", () => {
        const isAll = targetSelectAll.classList.contains("p-checked");
        if (isAll) {
          selectedTarget.clear();
        } else {
          targetList.forEach((it) => selectedTarget.add(getItemId(it)));
        }
        updateTargetSelectionUI();
      });
    }
    rootEl.querySelector(".btn-move-to-target")?.addEventListener("click", () => {
      if (selectedSource.size === 0) return;
      const moving = sourceList.filter((it) => selectedSource.has(getItemId(it)));
      targetList = [...targetList, ...moving];
      sourceList = sourceList.filter((it) => !selectedSource.has(getItemId(it)));
      selectedSource.clear();
      updateSourceList();
      updateTargetList();
      syncValues("move-to-target", moving);
    });
    rootEl.querySelector(".btn-move-all-to-target")?.addEventListener("click", () => {
      if (sourceList.length === 0) return;
      const moving = [...sourceList];
      targetList = [...targetList, ...sourceList];
      sourceList = [];
      selectedSource.clear();
      updateSourceList();
      updateTargetList();
      syncValues("move-all-to-target", moving);
    });
    rootEl.querySelector(".btn-move-to-source")?.addEventListener("click", () => {
      if (selectedTarget.size === 0) return;
      const moving = targetList.filter((it) => selectedTarget.has(getItemId(it)));
      sourceList = [...sourceList, ...moving];
      targetList = targetList.filter((it) => !selectedTarget.has(getItemId(it)));
      selectedTarget.clear();
      updateSourceList();
      updateTargetList();
      syncValues("move-to-source", moving);
    });
    rootEl.querySelector(".btn-move-all-to-source")?.addEventListener("click", () => {
      if (targetList.length === 0) return;
      const moving = [...targetList];
      sourceList = [...sourceList, ...targetList];
      targetList = [];
      selectedTarget.clear();
      updateSourceList();
      updateTargetList();
      syncValues("move-all-to-source", moving);
    });
    rootEl.querySelector(".btn-source-top")?.addEventListener("click", () => {
      reorderList(sourceList, selectedSource, "top", "source");
    });
    rootEl.querySelector(".btn-source-up")?.addEventListener("click", () => {
      reorderList(sourceList, selectedSource, "up", "source");
    });
    rootEl.querySelector(".btn-source-down")?.addEventListener("click", () => {
      reorderList(sourceList, selectedSource, "down", "source");
    });
    rootEl.querySelector(".btn-source-bottom")?.addEventListener("click", () => {
      reorderList(sourceList, selectedSource, "bottom", "source");
    });
    rootEl.querySelector(".btn-target-top")?.addEventListener("click", () => {
      reorderList(targetList, selectedTarget, "top", "target");
    });
    rootEl.querySelector(".btn-target-up")?.addEventListener("click", () => {
      reorderList(targetList, selectedTarget, "up", "target");
    });
    rootEl.querySelector(".btn-target-down")?.addEventListener("click", () => {
      reorderList(targetList, selectedTarget, "down", "target");
    });
    rootEl.querySelector(".btn-target-bottom")?.addEventListener("click", () => {
      reorderList(targetList, selectedTarget, "bottom", "target");
    });
  }
  function reorderList(list, selectedSet, direction, whichList) {
    if (selectedSet.size === 0 || list.length < 2) return;
    if (direction === "top") {
      const selected = list.filter((it) => selectedSet.has(getItemId(it)));
      const remaining = list.filter((it) => !selectedSet.has(getItemId(it)));
      list.length = 0;
      list.push(...selected, ...remaining);
    } else if (direction === "bottom") {
      const selected = list.filter((it) => selectedSet.has(getItemId(it)));
      const remaining = list.filter((it) => !selectedSet.has(getItemId(it)));
      list.length = 0;
      list.push(...remaining, ...selected);
    } else if (direction === "up") {
      for (let i = 1; i < list.length; i++) {
        if (selectedSet.has(getItemId(list[i])) && !selectedSet.has(getItemId(list[i - 1]))) {
          const temp = list[i];
          list[i] = list[i - 1];
          list[i - 1] = temp;
        }
      }
    } else if (direction === "down") {
      for (let i = list.length - 2; i >= 0; i--) {
        if (selectedSet.has(getItemId(list[i])) && !selectedSet.has(getItemId(list[i + 1]))) {
          const temp = list[i];
          list[i] = list[i + 1];
          list[i + 1] = temp;
        }
      }
    }
    if (whichList === "source") updateSourceList();
    else updateTargetList();
    syncValues("reorder");
  }
  function dispatchSelectionEvent() {
    container.dispatchEvent(new CustomEvent("picklist:selection-change", {
      bubbles: true,
      detail: {
        sourceSelection: Array.from(selectedSource),
        targetSelection: Array.from(selectedTarget)
      }
    }));
  }
  function syncValues(action = "change", affectedItems = []) {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = JSON.stringify(targetList.map((it) => getItemId(it)));
    }
    container.dispatchEvent(new CustomEvent("picklist:change", {
      bubbles: true,
      detail: { source: sourceList, target: targetList, action, affectedItems }
    }));
  }
  buildShell();
  syncValues();
}
export {
  PickListIsland as default
};
//# sourceMappingURL=picklist-XIWGYR6F.js.map
