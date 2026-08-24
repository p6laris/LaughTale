import {
  useDebounce
} from "./chunk-5EJRX4PB.js";
import {
  getLucideIcon
} from "./chunk-C4P5FSS5.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/listbox.ts
var CSS = `
/* ==================== AURA LISTBOX ==================== */
.laughtale-listbox,
.p-listbox {
    display: inline-flex;
    flex-direction: column;
    background: var(--p-surface-0);
    color: var(--p-text-color);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    overflow: hidden;
    outline: none;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
    width: 100%;
    max-width: 280px;
}

.p-listbox.p-listbox-fluid {
    width: 100%;
    max-width: 100%;
}

.p-listbox.is-focused,
.p-listbox:focus-within {
    border-color: var(--p-primary-500) !important;
}

/* Filled Variant */
.p-listbox.variant-filled {
    background-color: var(--p-surface-100);
    border-color: transparent;
}
.p-listbox.variant-filled.is-focused {
    background-color: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Sizes */
.p-listbox.size-small,
.p-listbox.p-listbox-sm {
    font-size: 0.75rem;
}
.p-listbox.size-small .p-listbox-option {
    padding: 0.3125rem 0.5rem;
}
.p-listbox.size-large,
.p-listbox.p-listbox-lg {
    font-size: 1rem;
}
.p-listbox.size-large .p-listbox-option {
    padding: 0.625rem 1rem;
}

/* Invalid State */
.p-listbox.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-listbox.is-disabled {
    opacity: 0.65;
    cursor: not-allowed;
    background-color: var(--p-surface-100);
}
.p-listbox.is-disabled .p-listbox-option {
    cursor: not-allowed;
    pointer-events: none;
}

/* Header & Footer */
.p-listbox-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.875rem;
    background: var(--p-surface-50);
    border-bottom: 1px solid var(--p-border-color);
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--p-text-color);
}
.p-listbox-header-count {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--p-text-muted);
}
.p-listbox-footer {
    padding: 0.5rem 0.875rem;
    background: var(--p-surface-50);
    border-top: 1px solid var(--p-border-color);
    font-size: 0.75rem;
    color: var(--p-text-muted);
}

/* Filter */
.p-listbox-filter-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-50);
    border-bottom: 1px solid var(--p-border-color);
}
.p-listbox-filter-input {
    flex: 1;
    width: 100%;
    font-family: inherit;
    font-size: 0.8125rem;
    padding: 0.3125rem 0.5rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: calc(var(--p-border-radius) - 2px);
    color: var(--p-text-color);
    outline: none;
    box-sizing: border-box;
}
.p-listbox-filter-input:focus {
    border-color: var(--p-primary-500);
}

/* Options List Container */
.p-listbox-list-wrapper {
    overflow-y: auto;
    outline: none;
}
.p-listbox-list {
    margin: 0;
    padding: 0.25rem 0;
    list-style: none;
}

/* Option Groups */
.p-listbox-option-group {
    list-style: none;
    margin: 0;
    padding: 0;
}
.p-listbox-option-group-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.875rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-text-muted);
    background: var(--p-surface-50);
}

/* Option Items */
.p-listbox-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.875rem;
    cursor: pointer;
    font-size: 0.8125rem;
    color: var(--p-text-color);
    background: transparent;
    transition: background 150ms ease, color 150ms ease;
    user-select: none;
    outline: none;
}

.p-listbox-option:hover:not(.p-disabled) {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}

.p-listbox-option.p-highlight {
    background: var(--p-primary-50, #ecfdf5);
    color: var(--p-primary-700, #047857);
    font-weight: 600;
}
.p-listbox-option.p-highlight:hover:not(.p-disabled) {
    background: var(--p-primary-100, #d1fae5);
    color: var(--p-primary-800, #065f46);
}

.p-listbox-option.p-highlight-none {
    background: transparent !important;
    color: var(--p-text-color) !important;
    font-weight: normal !important;
}
.p-listbox-option.p-highlight-none:hover:not(.p-disabled) {
    background: var(--p-surface-100) !important;
}

.p-listbox-option.p-focus {
    box-shadow: inset 0 0 0 1px var(--p-primary-500);
}

.p-listbox-option.p-disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Striped Listbox */
.p-listbox-striped .p-listbox-option:nth-child(even):not(.p-highlight) {
    background: var(--p-surface-50);
}

/* Option Content */
.p-listbox-option-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.p-listbox-option-badge {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    background: var(--p-surface-100);
    color: var(--p-surface-700);
}
.p-listbox-option.p-highlight .p-listbox-option-badge {
    background: var(--p-primary-100);
    color: var(--p-primary-800);
}

/* Option Checkbox */
.p-listbox-option-checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    border: 1px solid var(--p-border-color);
    border-radius: 4px;
    background: var(--p-surface-0);
    margin-right: 0.5rem;
    transition: all 150ms ease;
    flex-shrink: 0;
}
.p-listbox-option.p-highlight .p-listbox-option-checkbox {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
    color: #ffffff;
}

/* Option Checkmark Icon */
.p-listbox-option-checkmark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--p-primary-600);
    margin-left: 0.5rem;
    flex-shrink: 0;
}

/* ==================== DARK MODE ==================== */
.dark .p-listbox {
    background: var(--p-surface-900);
    color: var(--p-surface-0);
    border-color: var(--p-surface-700);
}
.dark .p-listbox.variant-filled {
    background-color: var(--p-surface-800);
}
.dark .p-listbox.variant-filled.is-focused {
    background-color: var(--p-surface-900);
}
.dark .p-listbox-header,
.dark .p-listbox-footer,
.dark .p-listbox-filter-container,
.dark .p-listbox-option-group-label {
    background: var(--p-surface-850, #141b26);
    border-color: var(--p-surface-700);
}
.dark .p-listbox-filter-input {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-listbox-option {
    color: var(--p-surface-100);
}
.dark .p-listbox-option:hover:not(.p-disabled) {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
.dark .p-listbox-option.p-highlight {
    background: rgba(16, 185, 129, 0.16);
    color: var(--p-primary-300, #6ee7b7);
}
.dark .p-listbox-option.p-highlight:hover:not(.p-disabled) {
    background: rgba(16, 185, 129, 0.24);
    color: var(--p-primary-200, #a7f3d0);
}
.dark .p-listbox-option-badge {
    background: var(--p-surface-800);
    color: var(--p-surface-200);
}
.dark .p-listbox-option.p-highlight .p-listbox-option-badge {
    background: rgba(16, 185, 129, 0.25);
    color: var(--p-primary-200);
}
.dark .p-listbox-option-checkbox {
    background: var(--p-surface-900);
    border-color: var(--p-surface-600);
}
.dark .p-listbox-option-checkmark {
    color: var(--p-primary-400);
}
.dark .p-listbox-striped .p-listbox-option:nth-child(even):not(.p-highlight) {
    background: var(--p-surface-850, #141b26);
}
`;
var checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
var searchSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
function ListboxIsland(container, props) {
  injectIslandStyle("laughtale-listbox", CSS);
  const isMultiple = props.multiple === true || String(props.multiple) === "true";
  const isMetaKey = props.metaKeySelection !== false && String(props.metaKeySelection) !== "false";
  const isCheckbox = props.checkbox === true || String(props.checkbox) === "true";
  const isCheckmark = props.checkmark === true || String(props.checkmark) === "true";
  const isHighlightOnSelect = props.highlightOnSelect !== false && String(props.highlightOnSelect) !== "false";
  const isFilter = props.filter === true || String(props.filter) === "true";
  const isFluid = props.fluid === true || String(props.fluid) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const isStriped = props.striped === true || String(props.striped) === "true";
  const isFilled = props.variant === "filled";
  const size = props.size || "normal";
  const scrollHeight = props.scrollHeight || "220px";
  function normalizeOptions(opts) {
    return (opts || []).map((opt) => {
      if (typeof opt === "string") {
        return { label: opt, value: opt };
      }
      return {
        label: opt.label || opt.name || String(opt.value || ""),
        value: opt.value !== void 0 ? opt.value : opt.code || opt.name || opt.label,
        code: opt.code,
        name: opt.name,
        icon: opt.icon,
        flag: opt.flag,
        badge: opt.badge,
        description: opt.description,
        disabled: opt.disabled,
        items: opt.items ? normalizeOptions(opt.items) : void 0
      };
    });
  }
  const rawOptions = normalizeOptions(props.options || []);
  const selectedValues = /* @__PURE__ */ new Set();
  const initialVal = props.value ?? props.selectedValue;
  if (initialVal !== void 0 && initialVal !== null) {
    if (Array.isArray(initialVal)) {
      initialVal.forEach((v) => selectedValues.add(typeof v === "object" && v !== null ? String(v.value || v.code || v.name) : String(v)));
    } else if (typeof initialVal === "string") {
      try {
        const parsed = JSON.parse(initialVal);
        if (Array.isArray(parsed)) parsed.forEach((v) => selectedValues.add(String(v)));
        else selectedValues.add(initialVal);
      } catch {
        selectedValues.add(initialVal);
      }
    } else {
      selectedValues.add(String(initialVal));
    }
  }
  let searchQuery = "";
  let focusedIndex = -1;
  function getFlatVisibleOptions() {
    const flat = [];
    const q = searchQuery.toLowerCase().trim();
    function matches(item) {
      if (!q) return true;
      if (props.filterMatchMode === "startsWith") {
        return item.label.toLowerCase().startsWith(q) || item.code && item.code.toLowerCase().startsWith(q);
      }
      return item.label.toLowerCase().includes(q) || item.code && item.code.toLowerCase().includes(q);
    }
    for (const opt of rawOptions) {
      if (opt.items && opt.items.length > 0) {
        const filteredChildren = opt.items.filter(matches);
        if (filteredChildren.length > 0) {
          flat.push(...filteredChildren);
        }
      } else if (matches(opt)) {
        flat.push(opt);
      }
    }
    return flat;
  }
  function init() {
    const rootClasses = [
      "laughtale-listbox",
      "p-listbox",
      isFluid ? "p-listbox-fluid" : "",
      isFilled ? "variant-filled" : "",
      isStriped ? "p-listbox-striped" : "",
      size !== "normal" ? `size-${size}` : "",
      isInvalid ? "is-invalid" : "",
      isDisabled ? "is-disabled" : ""
    ].filter(Boolean).join(" ");
    container.className = rootClasses;
    container.setAttribute("tabindex", isDisabled ? "-1" : "0");
    container.setAttribute("role", "listbox");
    container.setAttribute("aria-multiselectable", isMultiple ? "true" : "false");
    if (props.inputId) container.id = props.inputId;
    container.innerHTML = `
            ${props.header ? `
                <div class="p-listbox-header">
                    <span>${props.header}</span>
                    ${props.headerCount ? `<span class="p-listbox-header-count">${props.headerCount}</span>` : ""}
                </div>
            ` : ""}
            ${isFilter ? `
                <div class="p-listbox-filter-container">
                    <span style="color: var(--p-surface-400); display: flex;">${searchSvg}</span>
                    <input type="text" class="p-listbox-filter-input" placeholder="${props.filterPlaceholder || "Filter..."}" ${isDisabled ? "disabled" : ""} />
                </div>
            ` : ""}
            <div class="p-listbox-list-wrapper" style="max-height: ${scrollHeight};">
                <ul class="p-listbox-list" role="presentation"></ul>
            </div>
            ${props.footer ? `
                <div class="p-listbox-footer">${props.footer}</div>
            ` : ""}
            <input type="hidden" name="${props.name || props.targetInputName || "listbox_value"}" value="" />
        `;
    renderOptions();
    bindEvents();
    syncValue();
  }
  function renderOptions() {
    const listEl = container.querySelector(".p-listbox-list");
    const q = searchQuery.toLowerCase().trim();
    function matches(item) {
      if (!q) return true;
      if (props.filterMatchMode === "startsWith") {
        return item.label.toLowerCase().startsWith(q) || item.code && item.code.toLowerCase().startsWith(q);
      }
      return item.label.toLowerCase().includes(q) || item.code && item.code.toLowerCase().includes(q);
    }
    const isGrouped = rawOptions.some((o) => o.items && o.items.length > 0);
    if (isGrouped) {
      let html = "";
      let totalRendered = 0;
      for (const group of rawOptions) {
        const groupItems = group.items ? group.items.filter(matches) : [];
        if (groupItems.length === 0 && !matches(group)) continue;
        html += `
                    <li class="p-listbox-option-group" role="group">
                        <div class="p-listbox-option-group-label">
                            ${group.flag ? `<span style="font-size: 1.1rem; line-height: 1;">${group.flag}</span>` : ""}
                            ${group.icon ? `<span style="display: flex;">${getLucideIcon(group.icon, 14)}</span>` : ""}
                            <span>${group.label}</span>
                        </div>
                        <ul style="margin: 0; padding: 0; list-style: none;">
                            ${groupItems.map((item) => renderSingleOptionHtml(item)).join("")}
                        </ul>
                    </li>
                `;
        totalRendered += groupItems.length;
      }
      if (totalRendered === 0) {
        listEl.innerHTML = `<li style="padding: 1rem; text-align: center; color: var(--p-text-muted); font-size: 0.8125rem;">No results found</li>`;
      } else {
        listEl.innerHTML = html;
      }
    } else {
      const visible = rawOptions.filter(matches);
      if (visible.length === 0) {
        listEl.innerHTML = `<li style="padding: 1rem; text-align: center; color: var(--p-text-muted); font-size: 0.8125rem;">No results found</li>`;
      } else {
        listEl.innerHTML = visible.map((item) => renderSingleOptionHtml(item)).join("");
      }
    }
    bindItemEvents();
  }
  function renderSingleOptionHtml(item) {
    const valStr = String(item.value);
    const isSelected = selectedValues.has(valStr);
    const highlightClass = isSelected ? isHighlightOnSelect ? "p-highlight" : "p-highlight-none" : "";
    const disabledClass = item.disabled ? "p-disabled" : "";
    let checkboxHtml = "";
    if (isCheckbox && isMultiple) {
      checkboxHtml = `
                <span class="p-listbox-option-checkbox" aria-hidden="true">
                    ${isSelected ? checkSvg : ""}
                </span>
            `;
    }
    let checkmarkHtml = "";
    if (isCheckmark && isSelected) {
      checkmarkHtml = `
                <span class="p-listbox-option-checkmark" aria-hidden="true">
                    ${checkSvg}
                </span>
            `;
    }
    let leadingHtml = "";
    if (item.flag) {
      leadingHtml = `<span style="font-size: 1.1rem; line-height: 1; flex-shrink: 0;">${item.flag}</span>`;
    } else if (item.icon) {
      leadingHtml = `<span style="display: flex; flex-shrink: 0; color: var(--p-primary-600);">${getLucideIcon(item.icon, 16)}</span>`;
    }
    let trailingHtml = "";
    if (item.code) {
      trailingHtml = `<span class="p-listbox-option-badge">${item.code}</span>`;
    } else if (item.badge) {
      trailingHtml = `<span class="p-listbox-option-badge">${item.badge}</span>`;
    }
    return `
            <li class="p-listbox-option ${highlightClass} ${disabledClass}" role="option" aria-selected="${isSelected}" aria-disabled="${item.disabled ? "true" : "false"}" data-val="${valStr}" tabindex="-1">
                <div class="p-listbox-option-content">
                    ${checkboxHtml}
                    ${leadingHtml}
                    <span>${item.label}</span>
                </div>
                ${trailingHtml}
                ${checkmarkHtml}
            </li>
        `;
  }
  function bindItemEvents() {
    const items = container.querySelectorAll(".p-listbox-option");
    items.forEach((itemEl, idx) => {
      itemEl.addEventListener("click", (e) => {
        if (isDisabled || itemEl.classList.contains("p-disabled")) return;
        const val = itemEl.getAttribute("data-val");
        handleSelect(val, e);
      });
      if (props.focusOnHover) {
        itemEl.addEventListener("mouseenter", () => {
          if (!isDisabled && !itemEl.classList.contains("p-disabled")) {
            updateFocus(idx);
          }
        });
      }
    });
  }
  function handleSelect(valStr, e) {
    const isCtrlOrCmd = e && (e.ctrlKey || e.metaKey);
    if (isMultiple) {
      if (isMetaKey && !isCtrlOrCmd && !isCheckbox) {
        selectedValues.clear();
        selectedValues.add(valStr);
      } else {
        if (selectedValues.has(valStr)) selectedValues.delete(valStr);
        else selectedValues.add(valStr);
      }
    } else {
      selectedValues.clear();
      selectedValues.add(valStr);
    }
    renderOptions();
    syncValue();
  }
  function updateFocus(idx) {
    const visible = container.querySelectorAll(".p-listbox-option");
    visible.forEach((el, i) => {
      if (i === idx) el.classList.add("p-focus");
      else el.classList.remove("p-focus");
    });
    focusedIndex = idx;
  }
  function bindEvents() {
    const filterInp = container.querySelector(".p-listbox-filter-input");
    if (filterInp) {
      const debouncedSearch = useDebounce(() => {
        searchQuery = filterInp.value;
        renderOptions();
      }, 150);
      filterInp.addEventListener("input", () => debouncedSearch());
    }
    container.addEventListener("focus", () => {
      container.classList.add("is-focused");
      if (props.autoOptionFocus !== false && focusedIndex === -1) {
        updateFocus(0);
      }
    });
    container.addEventListener("blur", (e) => {
      if (!container.contains(e.relatedTarget)) {
        container.classList.remove("is-focused");
        const visible = container.querySelectorAll(".p-listbox-option");
        visible.forEach((el) => el.classList.remove("p-focus"));
      }
    });
    container.addEventListener("keydown", (e) => {
      if (isDisabled) return;
      const visible = container.querySelectorAll(".p-listbox-option");
      if (visible.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.min(focusedIndex + 1, visible.length - 1);
        updateFocus(next);
        visible[next]?.scrollIntoView({ block: "nearest" });
        if (props.selectOnFocus && !isMultiple) {
          const val = visible[next]?.getAttribute("data-val");
          handleSelect(val, e);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = Math.max(focusedIndex - 1, 0);
        updateFocus(prev);
        visible[prev]?.scrollIntoView({ block: "nearest" });
        if (props.selectOnFocus && !isMultiple) {
          const val = visible[prev]?.getAttribute("data-val");
          handleSelect(val, e);
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        updateFocus(0);
        visible[0]?.scrollIntoView({ block: "nearest" });
      } else if (e.key === "End") {
        e.preventDefault();
        updateFocus(visible.length - 1);
        visible[visible.length - 1]?.scrollIntoView({ block: "nearest" });
      } else if (e.key === " " || e.key === "Enter") {
        if (focusedIndex >= 0 && focusedIndex < visible.length) {
          e.preventDefault();
          const val = visible[focusedIndex]?.getAttribute("data-val");
          handleSelect(val, e);
        }
      } else if (e.key === "a" && (e.ctrlKey || e.metaKey) && isMultiple) {
        e.preventDefault();
        visible.forEach((el) => {
          const v = el.getAttribute("data-val");
          selectedValues.add(v);
        });
        renderOptions();
        syncValue();
      }
    });
  }
  function syncValue() {
    const hiddenInp = container.querySelector(`input[name="${props.name || props.targetInputName || "listbox_value"}"]`);
    const valArray = Array.from(selectedValues);
    const payload = isMultiple ? valArray : valArray[0] || null;
    if (hiddenInp) {
      hiddenInp.value = isMultiple ? JSON.stringify(valArray) : valArray[0] || "";
    }
    container.dispatchEvent(new CustomEvent("listbox:change", {
      bubbles: true,
      detail: { value: payload, selectedValues: valArray }
    }));
    container.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      detail: { value: payload }
    }));
  }
  init();
}
export {
  ListboxIsland as default
};
//# sourceMappingURL=listbox-YIM5KRNQ.js.map
