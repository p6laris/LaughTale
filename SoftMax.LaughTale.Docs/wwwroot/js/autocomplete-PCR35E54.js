import {
  useKeyboardNav
} from "./chunk-EZGX7NJI.js";
import {
  useClickOutside
} from "./chunk-T4EPW24S.js";
import {
  useDebounce
} from "./chunk-5EJRX4PB.js";
import {
  useTransition
} from "./chunk-IOCYPXM4.js";
import {
  useDisclosure
} from "./chunk-KEONGXN5.js";
import {
  LucideIcons
} from "./chunk-BWRILNJC.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/autocomplete.ts
var CSS = `
[data-theme="dark"] .laughtale-autocomplete {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .autocomplete-input-wrap {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .autocomplete-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .btn-clear-autocomplete {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .autocomplete-overlay {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .autocomplete-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function AutoCompleteIsland(container, props) {
  injectIslandStyle("autocomplete", CSS);
  const allItems = props.items || [];
  let selectedValue = props.value || "";
  let searchQuery = "";
  function getFilteredItems() {
    if (!searchQuery) return allItems;
    const q = searchQuery.toLowerCase();
    return allItems.filter((item) => item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q));
  }
  container.innerHTML = `
        <div class="laughtale-autocomplete" style="position: relative; width: 100%; max-width: 320px;">
            <div class="autocomplete-input-wrap" style="display: flex; align-items: center; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); padding: 0 0.5rem; transition: border-color 0.2s ease;">
                <span style="color: var(--p-surface-400); display: flex; align-items: center; margin-right: 0.25rem;">
                    ${LucideIcons.search}
                </span>
                <input type="text" 
                       class="autocomplete-input" 
                       value="${selectedValue ? allItems.find((i) => i.value === selectedValue)?.label || "" : ""}" 
                       placeholder="${props.placeholder || "Search or select..."}" 
                       ${props.disabled ? "disabled" : ""} 
                       style="flex: 1; padding: 0.5rem 0.25rem; border: none; outline: none; background: transparent; font-size: 0.875rem; color: var(--p-text-color);" />
                <button type="button" class="btn-clear-autocomplete" style="display: ${selectedValue ? "flex" : "none"}; border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; padding: 0.25rem; align-items: center;">
                    ${LucideIcons.x}
                </button>
            </div>

            <!-- Dropdown Popup -->
            <div class="autocomplete-overlay" style="display: none; position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 500; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); box-shadow: var(--p-shadow-lg); max-height: 220px; overflow-y: auto; padding: 0.25rem;">
            </div>
        </div>
    `;
  const input = container.querySelector(".autocomplete-input");
  const clearBtn = container.querySelector(".btn-clear-autocomplete");
  const overlay = container.querySelector(".autocomplete-overlay");
  const disclosure = useDisclosure({
    defaultIsOpen: false,
    onOpen: () => {
      renderDropdown();
      useTransition(overlay, { type: "fade", isMounted: true });
    },
    onClose: () => {
      useTransition(overlay, { type: "fade", isMounted: false });
    }
  });
  useClickOutside(container, () => disclosure.close());
  const keyboardNav = useKeyboardNav({
    itemCount: () => getFilteredItems().length,
    onHighlight: (idx) => {
      const items = overlay.querySelectorAll(".autocomplete-item");
      items.forEach((it, i) => {
        it.style.background = i === idx ? "var(--p-surface-100)" : "transparent";
        if (i === idx) it.scrollIntoView({ block: "nearest" });
      });
    },
    onSelect: (idx) => {
      const filtered = getFilteredItems();
      if (filtered[idx]) selectItem(filtered[idx]);
    },
    onEscape: () => disclosure.close()
  });
  function selectItem(item) {
    selectedValue = item.value;
    searchQuery = "";
    input.value = item.label;
    clearBtn.style.display = "flex";
    disclosure.close();
    syncValue();
  }
  function renderDropdown() {
    const filtered = getFilteredItems();
    if (filtered.length === 0) {
      overlay.innerHTML = `<div style="padding: 0.75rem; text-align: center; color: var(--p-surface-400); font-size: 0.8125rem;">No results found</div>`;
      return;
    }
    overlay.innerHTML = filtered.map((item, idx) => `
            <div class="autocomplete-item" data-value="${item.value}" data-idx="${idx}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border-radius: var(--p-border-radius); cursor: pointer; font-size: 0.8125rem; color: var(--p-text-color); transition: background 0.15s ease;">
                <span style="display: flex; align-items: center; gap: 0.5rem;">
                    ${item.icon ? `<span>${item.icon}</span>` : ""}
                    <span>${item.label}</span>
                </span>
                ${item.category ? `<span class="aura-tag tag-slate" style="font-size: 0.6875rem;">${item.category}</span>` : ""}
            </div>
        `).join("");
    overlay.querySelectorAll(".autocomplete-item").forEach((itemEl) => {
      itemEl.addEventListener("click", () => {
        const val = itemEl.getAttribute("data-value");
        const matched = allItems.find((i) => i.value === val);
        if (matched) selectItem(matched);
      });
    });
  }
  const debouncedFilter = useDebounce(() => {
    searchQuery = input.value;
    renderDropdown();
  }, 150);
  input.addEventListener("input", () => {
    if (!disclosure.isOpen) disclosure.open();
    debouncedFilter();
  });
  input.addEventListener("focus", () => {
    if (!disclosure.isOpen) disclosure.open();
  });
  input.addEventListener("keydown", (e) => {
    if (disclosure.isOpen) {
      keyboardNav.handleKeyDown(e);
    }
  });
  clearBtn.addEventListener("click", () => {
    selectedValue = "";
    searchQuery = "";
    input.value = "";
    clearBtn.style.display = "none";
    syncValue();
    disclosure.close();
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
      hidden.value = selectedValue;
    }
    container.dispatchEvent(new CustomEvent("autocomplete:change", {
      bubbles: true,
      detail: { value: selectedValue }
    }));
  }
}
export {
  AutoCompleteIsland as default
};
//# sourceMappingURL=autocomplete-PCR35E54.js.map
