import {
  useDebounce
} from "./chunk-5EJRX4PB.js";
import {
  useClickOutside
} from "./chunk-T4EPW24S.js";
import {
  useDisclosure
} from "./chunk-KEONGXN5.js";
import {
  LucideIcons
} from "./chunk-XHF3KYSF.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/autocomplete.ts
var CSS = `
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
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
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
    background: var(--p-surface-50);
}
.ac-input-container.focused {
    border-color: var(--p-primary-500);
    box-shadow: 0 0 0 1px var(--p-primary-500);
    z-index: 2;
}
.ac-input-container.invalid {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 1px #ef4444 !important;
}
.ac-input-container.disabled {
    background: var(--p-surface-100);
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
    background: var(--p-surface-100);
    color: var(--p-text-color);
    border-radius: calc(var(--p-border-radius) - 2px);
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
    color: #ef4444;
}

.ac-input {
    flex: 1;
    min-width: 60px;
    border: none;
    outline: none;
    background: transparent;
    color: var(--p-text-color);
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
    color: var(--p-text-color);
    background: var(--p-surface-100);
}

.ac-dropdown-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--p-border-color);
    border-left: none;
    background: var(--p-surface-100);
    color: var(--p-text-muted);
    border-top-right-radius: var(--p-border-radius);
    border-bottom-right-radius: var(--p-border-radius);
    cursor: pointer;
    padding: 0 0.85rem;
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    flex-shrink: 0;
    box-sizing: border-box;
}
.ac-dropdown-btn:hover {
    background: var(--p-surface-200);
    color: var(--p-text-color);
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
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
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
    border-radius: calc(var(--p-border-radius) - 2px);
    color: var(--p-text-color);
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
    font-size: 0.875rem;
    user-select: none;
    gap: 0.5rem;
}
.ac-item:hover, .ac-item.highlighted {
    background: var(--p-surface-100);
}
.ac-item.selected {
    background: var(--p-primary-50);
    color: var(--p-primary-700);
    font-weight: 600;
}
.ac-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Dark Mode Aware Tokens */
.dark .ac-input-container {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .ac-input-container.variant-filled {
    background: var(--p-surface-800);
}
.dark .ac-chip {
    background: var(--p-surface-800);
    color: var(--p-surface-100);
}
.dark .ac-dropdown-btn {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
    color: var(--p-surface-300);
}
.dark .ac-dropdown-btn:hover {
    background: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .ac-overlay {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}
.dark .ac-item:hover, .dark .ac-item.highlighted {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
.dark .ac-item.selected {
    background: rgba(16, 185, 129, 0.15);
    color: #6ee7b7;
}
`;
function AutoCompleteIsland(container, props) {
  injectIslandStyle("autocomplete", CSS);
  const allItems = props.suggestions || props.items || [];
  const multiple = props.multiple === true;
  const showClear = props.showClear !== false;
  const hasDropdown = props.dropdown === true;
  const forceSelection = props.forceSelection === true;
  const size = props.size || "normal";
  const variant = props.variant || "outlined";
  const scrollHeight = props.scrollHeight || "14rem";
  let selectedValues = multiple ? Array.isArray(props.value) ? props.value : props.value ? [props.value] : [] : props.value ? [props.value] : [];
  let searchQuery = "";
  let highlightedIndex = -1;
  function getFilteredItems() {
    if (!searchQuery) return allItems;
    const q = searchQuery.toLowerCase();
    return allItems.filter(
      (item) => item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q) || item.subtitle && item.subtitle.toLowerCase().includes(q) || item.group && item.group.toLowerCase().includes(q) || item.category && item.category.toLowerCase().includes(q)
    );
  }
  container.innerHTML = `
        <div class="laughtale-autocomplete ${props.fluid ? "fluid" : ""} ${hasDropdown ? "has-dropdown" : ""}">
            <div class="ac-input-container size-${size} variant-${variant} ${props.invalid ? "invalid" : ""} ${props.disabled ? "disabled" : ""}">
                <div class="ac-chips-wrapper">
                    <input type="text" 
                           class="ac-input" 
                           role="combobox"
                           aria-autocomplete="list"
                           aria-expanded="false"
                           placeholder="${selectedValues.length === 0 ? props.placeholder || "Search..." : ""}" 
                           ${props.disabled ? "disabled" : ""} />
                </div>
                
                ${props.loading ? `
                    <span class="ac-btn-icon" style="animation: spin 1s linear infinite;">
                        ${LucideIcons.loader2 || "\u23F3"}
                    </span>
                ` : ""}

                ${showClear ? `
                    <button type="button" class="ac-btn-icon ac-btn-clear" style="display: none;" title="Clear value">
                        ${LucideIcons.x}
                    </button>
                ` : ""}
            </div>

            ${hasDropdown ? `
                <button type="button" class="ac-dropdown-btn size-${size}" ${props.disabled ? "disabled" : ""} title="Show all suggestions">
                    <span style="display: flex; width: 16px; height: 16px;">${LucideIcons.chevronDown}</span>
                </button>
            ` : ""}

            <!-- Suggestions Overlay -->
            <div class="ac-overlay" style="max-height: ${scrollHeight};"></div>
        </div>
    `;
  const inputWrap = container.querySelector(".ac-input-container");
  const chipsWrap = container.querySelector(".ac-chips-wrapper");
  const input = container.querySelector(".ac-input");
  const clearBtn = container.querySelector(".ac-btn-clear");
  const dropdownBtn = container.querySelector(".ac-dropdown-btn");
  const overlay = container.querySelector(".ac-overlay");
  const disclosure = useDisclosure({
    defaultIsOpen: false,
    onOpen: () => {
      overlay.style.display = "block";
      input.setAttribute("aria-expanded", "true");
      renderDropdown();
    },
    onClose: () => {
      overlay.style.display = "none";
      input.setAttribute("aria-expanded", "false");
      highlightedIndex = -1;
      if (forceSelection && !multiple && searchQuery) {
        const exact = allItems.find((i) => i.label.toLowerCase() === searchQuery.toLowerCase());
        if (!exact) {
          input.value = selectedValues[0] ? allItems.find((i) => i.value === selectedValues[0])?.label || "" : "";
          searchQuery = "";
        }
      }
    }
  });
  useClickOutside(container, () => {
    disclosure.close();
    inputWrap.classList.remove("focused");
  });
  function renderChips() {
    if (!multiple) {
      if (selectedValues[0]) {
        const found = allItems.find((i) => i.value === selectedValues[0]);
        input.value = found ? found.label : selectedValues[0];
      } else {
        input.value = "";
      }
      updateClearButton();
      return;
    }
    chipsWrap.querySelectorAll(".ac-chip").forEach((el) => el.remove());
    selectedValues.forEach((val) => {
      const item = allItems.find((i) => i.value === val) || { label: val, value: val };
      const chip = document.createElement("span");
      chip.className = "ac-chip";
      chip.innerHTML = `
                <span>${item.label}</span>
                <button type="button" class="ac-chip-remove" data-remove="${item.value}">&times;</button>
            `;
      chip.querySelector(".ac-chip-remove")?.addEventListener("click", (e) => {
        e.stopPropagation();
        removeValue(item.value);
      });
      chipsWrap.insertBefore(chip, input);
    });
    input.placeholder = selectedValues.length === 0 ? props.placeholder || "Search..." : "";
    updateClearButton();
  }
  function updateClearButton() {
    if (!clearBtn) return;
    const hasContent = multiple ? selectedValues.length > 0 : selectedValues.length > 0 || input.value.length > 0;
    clearBtn.style.display = hasContent && !props.disabled ? "flex" : "none";
  }
  function renderDropdown() {
    const filtered = getFilteredItems();
    if (filtered.length === 0) {
      overlay.innerHTML = `<div style="padding: 0.75rem; text-align: center; color: var(--p-text-muted); font-size: 0.8125rem;">No results found</div>`;
      return;
    }
    const groups = {};
    let isGrouped = false;
    filtered.forEach((item) => {
      const grp = item.group || item.category || "";
      if (grp) isGrouped = true;
      if (!groups[grp]) groups[grp] = [];
      groups[grp].push(item);
    });
    let html = "";
    let itemIndex = 0;
    if (isGrouped) {
      Object.entries(groups).forEach(([grpName, groupItems]) => {
        if (grpName) {
          html += `<div class="ac-group-header">${grpName}</div>`;
        }
        groupItems.forEach((item) => {
          html += renderOptionHtml(item, itemIndex++);
        });
      });
    } else {
      filtered.forEach((item) => {
        html += renderOptionHtml(item, itemIndex++);
      });
    }
    overlay.innerHTML = html;
    overlay.querySelectorAll(".ac-item").forEach((itemEl) => {
      itemEl.addEventListener("click", () => {
        const val = itemEl.getAttribute("data-value");
        const matched = allItems.find((i) => i.value === val);
        if (matched && !matched.disabled) {
          selectItem(matched);
        }
      });
      itemEl.addEventListener("mouseenter", () => {
        const idx = Number(itemEl.getAttribute("data-idx"));
        highlightItem(idx);
      });
    });
  }
  function renderOptionHtml(item, idx) {
    const isSelected = selectedValues.includes(item.value);
    const isHighlighted = idx === highlightedIndex;
    let leadingHtml = "";
    if (item.avatar) {
      leadingHtml = `<span style="width: 26px; height: 26px; border-radius: 50%; background: var(--p-primary-600); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0;">${item.avatar}</span>`;
    } else if (item.icon && LucideIcons[item.icon]) {
      leadingHtml = `<span style="display: flex; width: 16px; height: 16px; color: var(--p-primary-600); flex-shrink: 0;">${LucideIcons[item.icon]}</span>`;
    }
    let statusHtml = "";
    if (item.status) {
      const statusColor = item.status === "online" ? "#10b981" : item.status === "away" ? "#f59e0b" : "#94a3b8";
      statusHtml = `<span style="width: 8px; height: 8px; border-radius: 50%; background: ${statusColor}; margin-right: 0.35rem; display: inline-block;"></span>`;
    }
    let trailingHtml = "";
    if (item.shortcut) {
      trailingHtml = `<span style="font-size: 0.725rem; background: var(--p-surface-200); padding: 0.1rem 0.35rem; border-radius: 4px; color: var(--p-text-muted); font-family: monospace;">${item.shortcut}</span>`;
    } else if (item.count !== void 0) {
      trailingHtml = `<span class="aura-tag tag-slate" style="font-size: 0.6875rem;">${item.count}</span>`;
    }
    return `
            <div class="ac-item ${isSelected ? "selected" : ""} ${isHighlighted ? "highlighted" : ""} ${item.disabled ? "disabled" : ""}" 
                 data-value="${item.value}" 
                 data-idx="${idx}" 
                 role="option" 
                 aria-selected="${isSelected}">
                <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden;">
                    ${leadingHtml}
                    <div style="display: flex; flex-direction: column; overflow: hidden;">
                        <span style="font-weight: ${isSelected ? "700" : "500"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${statusHtml}${item.label}
                        </span>
                        ${item.subtitle ? `<span style="font-size: 0.75rem; color: var(--p-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.subtitle}</span>` : ""}
                    </div>
                </div>
                ${trailingHtml}
            </div>
        `;
  }
  function highlightItem(idx) {
    highlightedIndex = idx;
    const items = overlay.querySelectorAll(".ac-item");
    items.forEach((it, i) => {
      if (i === idx) {
        it.classList.add("highlighted");
        it.scrollIntoView({ block: "nearest" });
      } else {
        it.classList.remove("highlighted");
      }
    });
  }
  function selectItem(item) {
    if (multiple) {
      if (!selectedValues.includes(item.value)) {
        selectedValues.push(item.value);
      }
      searchQuery = "";
      input.value = "";
      renderChips();
      disclosure.close();
      syncValue();
      input.focus();
    } else {
      selectedValues = [item.value];
      searchQuery = "";
      input.value = item.label;
      disclosure.close();
      renderChips();
      syncValue();
    }
  }
  function removeValue(val) {
    selectedValues = selectedValues.filter((v) => v !== val);
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
  input.addEventListener("input", () => {
    debouncedFilter();
  });
  input.addEventListener("focus", () => {
    inputWrap.classList.add("focused");
  });
  input.addEventListener("blur", () => {
    inputWrap.classList.remove("focused");
  });
  input.addEventListener("keydown", (e) => {
    const filtered = getFilteredItems();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!disclosure.isOpen) {
        disclosure.open();
      } else {
        const nextIdx = highlightedIndex < filtered.length - 1 ? highlightedIndex + 1 : 0;
        highlightItem(nextIdx);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (disclosure.isOpen) {
        const prevIdx = highlightedIndex > 0 ? highlightedIndex - 1 : filtered.length - 1;
        highlightItem(prevIdx);
      }
    } else if (e.key === "Enter") {
      if (disclosure.isOpen && highlightedIndex >= 0 && filtered[highlightedIndex]) {
        e.preventDefault();
        selectItem(filtered[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      disclosure.close();
    } else if (e.key === "Backspace" && multiple && input.value === "" && selectedValues.length > 0) {
      removeValue(selectedValues[selectedValues.length - 1]);
    } else if (e.key === "Home" && disclosure.isOpen) {
      e.preventDefault();
      highlightItem(0);
    } else if (e.key === "End" && disclosure.isOpen) {
      e.preventDefault();
      highlightItem(filtered.length - 1);
    }
  });
  clearBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedValues = [];
    searchQuery = "";
    input.value = "";
    renderChips();
    syncValue();
    disclosure.close();
    input.focus();
  });
  dropdownBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (disclosure.isOpen) {
      disclosure.close();
    } else {
      searchQuery = "";
      disclosure.open();
      input.focus();
    }
  });
  inputWrap.addEventListener("click", () => {
    input.focus();
  });
  function syncValue() {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = multiple ? JSON.stringify(selectedValues) : selectedValues[0] || "";
    }
    container.dispatchEvent(new CustomEvent("autocomplete:change", {
      bubbles: true,
      detail: { value: multiple ? selectedValues : selectedValues[0] || "" }
    }));
  }
  renderChips();
}
export {
  AutoCompleteIsland as default
};
//# sourceMappingURL=autocomplete-RVYP54K4.js.map
