import {
  useKeyboardNav
} from "./chunk-EZGX7NJI.js";
import {
  useDebounce
} from "./chunk-5EJRX4PB.js";
import {
  LucideIcons
} from "./chunk-BWRILNJC.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/listbox.ts
var CSS = `
[data-theme="dark"] .laughtale-listbox {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .listbox-filter-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .listbox-items-container {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .listbox-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function ListboxIsland(container, props) {
  injectIslandStyle("listbox", CSS);
  const options = props.options || [];
  let selected = new Set(props.selectedValue !== void 0 ? [props.selectedValue] : []);
  let filterQuery = "";
  container.innerHTML = `
        <div class="laughtale-listbox" tabindex="0" style="width: 100%; max-width: 280px; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); background: var(--p-surface-0); overflow: hidden; font-family: var(--p-font-family, inherit); outline: none;">
            ${props.filter ? `
                <div style="padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--p-border-color); display: flex; align-items: center; gap: 0.5rem; background: var(--p-surface-50);">
                    <span style="color: var(--p-surface-400); display: flex;">${LucideIcons.search}</span>
                    <input type="text" class="listbox-filter-input" placeholder="Filter..." style="flex: 1; border: none; outline: none; background: transparent; font-size: 0.8125rem; color: var(--p-text-color);" />
                </div>
            ` : ""}
            <div class="listbox-items-container" style="max-height: 220px; overflow-y: auto; padding: 0.25rem 0;"></div>
        </div>
    `;
  const root = container.querySelector(".laughtale-listbox");
  const itemsContainer = container.querySelector(".listbox-items-container");
  const filterInput = container.querySelector(".listbox-filter-input");
  function getFiltered() {
    if (!filterQuery.trim()) return options;
    const q = filterQuery.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }
  const keyboardNav = useKeyboardNav({
    itemCount: () => getFiltered().length,
    onHighlight: (idx) => {
      const items = itemsContainer.querySelectorAll(".listbox-item");
      items.forEach((it, i) => {
        it.style.outline = i === idx ? "2px solid var(--p-primary-500)" : "none";
        if (i === idx) it.scrollIntoView({ block: "nearest" });
      });
    },
    onSelect: (idx) => {
      const filtered = getFiltered();
      if (filtered[idx]) {
        handleItemSelect(filtered[idx].value);
      }
    }
  });
  function handleItemSelect(val) {
    if (props.multiple) {
      if (selected.has(val)) selected.delete(val);
      else selected.add(val);
    } else {
      selected.clear();
      selected.add(val);
    }
    renderList();
    syncValue();
  }
  function renderList() {
    const filtered = getFiltered();
    if (filtered.length === 0) {
      itemsContainer.innerHTML = `<div style="padding: 1rem; text-align: center; font-size: 0.75rem; color: var(--p-surface-400);">No options</div>`;
      return;
    }
    itemsContainer.innerHTML = filtered.map((o) => {
      const isSelected = selected.has(o.value);
      return `
                <div class="listbox-item" data-val="${o.value}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.875rem; cursor: pointer; font-size: 0.8125rem; background: ${isSelected ? "var(--p-primary-50)" : "transparent"}; color: ${isSelected ? "var(--p-primary-700)" : "var(--p-text-color)"}; font-weight: ${isSelected ? "600" : "normal"}; transition: background 0.1s ease;">
                    <span>${o.label}</span>
                    ${isSelected ? `<span style="color: var(--p-primary-600); display: flex;">${LucideIcons.check}</span>` : ""}
                </div>
            `;
    }).join("");
    itemsContainer.querySelectorAll(".listbox-item").forEach((el) => {
      el.addEventListener("click", () => {
        const val = el.getAttribute("data-val");
        handleItemSelect(val);
      });
    });
  }
  const debouncedFilter = useDebounce(() => {
    filterQuery = filterInput ? filterInput.value : "";
    renderList();
  }, 150);
  if (filterInput) {
    filterInput.addEventListener("input", () => debouncedFilter());
  }
  root.addEventListener("keydown", (e) => {
    keyboardNav.handleKeyDown(e);
  });
  function syncValue() {
    const valArray = Array.from(selected);
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = props.multiple ? JSON.stringify(valArray) : valArray[0] !== void 0 ? String(valArray[0]) : "";
    }
    container.dispatchEvent(new CustomEvent("listbox:change", {
      bubbles: true,
      detail: { value: props.multiple ? valArray : valArray[0] }
    }));
  }
  renderList();
  syncValue();
}
export {
  ListboxIsland as default
};
//# sourceMappingURL=listbox-T65KQQCV.js.map
