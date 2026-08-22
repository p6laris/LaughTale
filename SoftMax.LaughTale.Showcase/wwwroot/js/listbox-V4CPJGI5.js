import {
  LucideIcons
} from "./chunk-QV6AVE4Z.js";

// ../SoftMax.LaughTale.Client/src/components/listbox.ts
function ListboxIsland(container, props) {
  const options = props.options || [];
  let selected = new Set(props.selectedValue !== void 0 ? [props.selectedValue] : []);
  let filterQuery = "";
  container.innerHTML = `
        <div class="laughtale-listbox" style="width: 100%; max-width: 280px; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); background: var(--p-surface-0); overflow: hidden; font-family: var(--p-font-family, inherit);">
            ${props.filter ? `
                <div style="padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--p-border-color); display: flex; align-items: center; gap: 0.5rem; background: var(--p-surface-50);">
                    <span style="color: var(--p-surface-400); display: flex;">${LucideIcons.search(14)}</span>
                    <input type="text" class="listbox-filter-input" placeholder="Filter..." style="flex: 1; border: none; outline: none; background: transparent; font-size: 0.8125rem; color: var(--p-text-color);" />
                </div>
            ` : ""}
            <div class="listbox-items-container" style="max-height: 220px; overflow-y: auto; padding: 0.25rem 0;"></div>
        </div>
    `;
  const itemsContainer = container.querySelector(".listbox-items-container");
  const filterInput = container.querySelector(".listbox-filter-input");
  function getFiltered() {
    if (!filterQuery.trim()) return options;
    const q = filterQuery.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
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
        if (props.disabled) return;
        const val = el.getAttribute("data-val");
        if (props.multiple) {
          if (selected.has(val)) selected.delete(val);
          else selected.add(val);
        } else {
          selected.clear();
          selected.add(val);
        }
        renderList();
        syncValue();
      });
    });
  }
  filterInput?.addEventListener("input", () => {
    filterQuery = filterInput.value;
    renderList();
  });
  function syncValue() {
    const arr = Array.from(selected);
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = props.multiple ? JSON.stringify(arr) : arr[0] ? String(arr[0]) : "";
    }
    container.dispatchEvent(new CustomEvent("listbox:change", {
      bubbles: true,
      detail: { value: props.multiple ? arr : arr[0] }
    }));
  }
  renderList();
  syncValue();
}
export {
  ListboxIsland as default
};
//# sourceMappingURL=listbox-V4CPJGI5.js.map
