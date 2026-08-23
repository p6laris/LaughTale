import {
  LucideIcons
} from "./chunk-PRHJLIKH.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/select.ts
var CSS = `
.laughtale-select {
    position: relative;
    display: inline-flex;
    width: 100%;
    font-family: inherit;
    user-select: none;
}
.laughtale-select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-field-border, var(--p-surface-300));
    border-radius: var(--p-border-radius, 0.5rem);
    color: var(--p-text-color);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s ease;
    outline: none;
    gap: 0.5rem;
}
.laughtale-select-trigger:hover:not(:disabled) {
    border-color: var(--p-primary-400);
}
.laughtale-select-trigger:focus-visible:not(:disabled) {
    box-shadow: 0 0 0 2px var(--p-content-bg), 0 0 0 4px var(--p-primary-500);
    border-color: var(--p-primary-500);
}
.laughtale-select-trigger:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--p-surface-100);
}
.laughtale-select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    margin-top: 0.25rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-surface-200);
    border-radius: var(--p-border-radius, 0.5rem);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    max-height: 20rem;
    opacity: 0;
    transform: translateY(-5px);
    pointer-events: none;
    transition: opacity 0.15s ease, transform 0.15s ease;
}
.laughtale-select.is-open .laughtale-select-dropdown {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}
.laughtale-select-list {
    list-style: none;
    padding: 0.25rem;
    margin: 0;
    overflow-y: auto;
    flex: 1;
}
.laughtale-select-item {
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--p-border-radius, 0.5rem) - 0.25rem);
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--p-text-color);
    transition: background 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.laughtale-select-item:hover {
    background: var(--p-surface-100);
}
.laughtale-select-item.is-selected {
    background: var(--p-primary-50);
    color: var(--p-primary-700);
    font-weight: 500;
}
.laughtale-select-item.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}
.laughtale-select-filter {
    padding: 0.5rem;
    border-bottom: 1px solid var(--p-surface-200);
}
.laughtale-select-filter input {
    width: 100%;
    padding: 0.375rem 0.5rem;
    border: 1px solid var(--p-surface-300);
    border-radius: calc(var(--p-border-radius, 0.5rem) - 0.25rem);
    font-size: 0.875rem;
    outline: none;
    background: transparent;
    color: var(--p-text-color);
}
.laughtale-select-filter input:focus {
    border-color: var(--p-primary-400);
}
.laughtale-select-clear {
    color: var(--p-surface-400);
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0.125rem;
    border-radius: 50%;
}
.laughtale-select-clear:hover {
    color: var(--p-surface-600);
    background: var(--p-surface-100);
}
[data-theme="dark"] .laughtale-select-item.is-selected {
    background: var(--p-primary-900);
    color: var(--p-primary-100);
}
[data-theme="dark"] .laughtale-select-dropdown {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
[data-theme="dark"] .laughtale-select-trigger {
    background: var(--p-surface-900);
}
[data-theme="dark"] .laughtale-select-item:hover {
    background: var(--p-surface-800);
}
`;
function SelectIsland(container, props) {
  injectIslandStyle("laughtale-select", CSS);
  let isOpen = false;
  let selectedValue = props.selectedValue || "";
  let searchTerm = "";
  function render() {
    const selectedOption = props.options.find((o) => o.value === selectedValue);
    const displayLabel = selectedOption ? selectedOption.label : props.placeholder || "Select...";
    let filteredOptions = props.options;
    if (props.filter && searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filteredOptions = props.options.filter((o) => o.label.toLowerCase().includes(lowerTerm));
    }
    const optionsHtml = filteredOptions.map((opt) => `
            <li class="laughtale-select-item ${opt.value === selectedValue ? "is-selected" : ""} ${opt.disabled ? "is-disabled" : ""}" data-value="${opt.value}">
                <span>${opt.label}</span>
                ${opt.value === selectedValue ? LucideIcons.check : ""}
            </li>
        `).join("");
    container.innerHTML = `
            <div class="laughtale-select ${isOpen ? "is-open" : ""}" aria-expanded="${isOpen}">
                <button type="button" class="laughtale-select-trigger" ${props.disabled ? "disabled" : ""}>
                    <span style="flex:1; text-align:left; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                        ${displayLabel}
                    </span>
                    <div style="display:flex; align-items:center; gap:0.25rem;">
                        ${props.showClear && selectedValue ? '<span class="laughtale-select-clear">' + LucideIcons.x + "</span>" : ""}
                        <span style="color: var(--p-surface-500); display:flex;">${LucideIcons.chevronDown}</span>
                    </div>
                </button>
                <div class="laughtale-select-dropdown">
                    ${props.filter ? `
                    <div class="laughtale-select-filter">
                        <input type="text" placeholder="Search..." value="${searchTerm}" />
                    </div>
                    ` : ""}
                    <ul class="laughtale-select-list">
                        ${optionsHtml.length ? optionsHtml : '<li class="laughtale-select-item is-disabled">No results found</li>'}
                    </ul>
                </div>
            </div>
        `;
    bindEvents();
    syncValue();
  }
  function bindEvents() {
    const selectEl = container.querySelector(".laughtale-select");
    const trigger = container.querySelector(".laughtale-select-trigger");
    const clearBtn = container.querySelector(".laughtale-select-clear");
    const listItems = container.querySelectorAll(".laughtale-select-item:not(.is-disabled)");
    const filterInput = container.querySelector(".laughtale-select-filter input");
    trigger.addEventListener("click", (e) => {
      if (e.target === clearBtn || clearBtn?.contains(e.target)) return;
      isOpen = !isOpen;
      render();
      if (isOpen && filterInput) filterInput.focus();
    });
    if (clearBtn) {
      clearBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        selectedValue = "";
        render();
      });
    }
    listItems.forEach((item) => {
      item.addEventListener("click", () => {
        selectedValue = item.dataset.value;
        isOpen = false;
        searchTerm = "";
        render();
      });
    });
    if (filterInput) {
      filterInput.addEventListener("input", (e) => {
        searchTerm = e.target.value;
        render();
        const newInput = container.querySelector(".laughtale-select-filter input");
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(searchTerm.length, searchTerm.length);
        }
      });
    }
    const outsideClickListener = (e) => {
      if (isOpen && !container.contains(e.target)) {
        isOpen = false;
        render();
      }
    };
    document.addEventListener("click", outsideClickListener);
  }
  function syncValue() {
    if (props.targetInputName) {
      let hidden = container.querySelector('input[name="' + props.targetInputName + '"]');
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = selectedValue;
    }
    container.dispatchEvent(new CustomEvent("select:change", {
      bubbles: true,
      detail: { value: selectedValue }
    }));
  }
  render();
}
export {
  SelectIsland as default
};
//# sourceMappingURL=select-IVSJBTP2.js.map
