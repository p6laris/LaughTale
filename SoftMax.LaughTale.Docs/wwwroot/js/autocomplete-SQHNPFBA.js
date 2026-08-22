import {
  LucideIcons
} from "./chunk-QV6AVE4Z.js";

// ../SoftMax.LaughTale.Client/src/components/autocomplete.ts
function AutoCompleteIsland(container, props) {
  const allItems = props.items || [];
  let selectedValue = props.value || "";
  let searchQuery = "";
  let isOpen = false;
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
  function updateList() {
    const filtered = getFilteredItems();
    overlay.style.display = isOpen ? "block" : "none";
    if (filtered.length === 0) {
      overlay.innerHTML = `<div style="padding: 0.75rem; font-size: 0.8125rem; color: var(--p-surface-400); text-align: center;">No results found</div>`;
      return;
    }
    overlay.innerHTML = filtered.map((item) => `
            <div class="autocomplete-item" data-value="${item.value}" style="padding: 0.5rem 0.75rem; font-size: 0.875rem; color: var(--p-surface-800); cursor: pointer; display: flex; align-items: center; justify-content: space-between; border-radius: var(--p-border-radius); transition: background 0.15s ease;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    ${item.icon ? `<span>${item.icon}</span>` : ""}
                    <span>${item.label}</span>
                </div>
                ${item.value === selectedValue ? `<span style="color: var(--p-primary-600);">${LucideIcons.check}</span>` : ""}
            </div>
        `).join("");
    overlay.querySelectorAll(".autocomplete-item").forEach((itemEl) => {
      itemEl.addEventListener("click", () => {
        selectedValue = itemEl.getAttribute("data-value") || "";
        const item = allItems.find((i) => i.value === selectedValue);
        input.value = item ? item.label : "";
        searchQuery = "";
        isOpen = false;
        clearBtn.style.display = "flex";
        updateList();
        syncValue();
      });
    });
  }
  if (!props.disabled) {
    input.addEventListener("focus", () => {
      isOpen = true;
      updateList();
    });
    input.addEventListener("input", () => {
      searchQuery = input.value;
      isOpen = true;
      clearBtn.style.display = input.value ? "flex" : "none";
      updateList();
    });
    clearBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedValue = "";
      searchQuery = "";
      input.value = "";
      isOpen = false;
      clearBtn.style.display = "none";
      updateList();
      syncValue();
    });
    document.addEventListener("click", (e) => {
      if (!container.contains(e.target)) {
        isOpen = false;
        overlay.style.display = "none";
      }
    });
  }
  function syncValue() {
    if (props.targetInputName) {
      let hidden = document.querySelector(`input[name="${props.targetInputName}"]`);
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
  updateList();
  syncValue();
}
export {
  AutoCompleteIsland as default
};
//# sourceMappingURL=autocomplete-SQHNPFBA.js.map
