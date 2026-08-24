import {
  getLucideIcon
} from "./chunk-F6UHTOX7.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/select-button.ts
var CSS = `
/* ==================== AURA SELECTBUTTON ==================== */
.laughtale-selectbutton,
.p-selectbutton {
    display: inline-flex;
    user-select: none;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    vertical-align: middle;
}

.p-selectbutton.p-selectbutton-fluid {
    display: flex;
    width: 100%;
}

.p-selectbutton.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
}

/* Button Item */
.p-selectbutton-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    color: var(--p-text-color);
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25;
    cursor: pointer;
    outline: none;
    box-sizing: border-box;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease, box-shadow 150ms ease, z-index 150ms ease;
    margin-left: -1px;
}

.p-selectbutton-fluid .p-selectbutton-item {
    flex: 1 1 0;
}

.p-selectbutton-item:first-child {
    margin-left: 0;
    border-top-left-radius: var(--p-border-radius);
    border-bottom-left-radius: var(--p-border-radius);
}

.p-selectbutton-item:last-child {
    border-top-right-radius: var(--p-border-radius);
    border-bottom-right-radius: var(--p-border-radius);
}

.p-selectbutton-item:hover:not(.p-disabled):not(.is-selected) {
    background: var(--p-surface-100);
    border-color: var(--p-surface-400);
    z-index: 2;
}

.p-selectbutton-item:focus-visible:not(.p-disabled) {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
    z-index: 3;
}

/* Selected State */
.p-selectbutton-item.is-selected {
    background: var(--p-primary-50, #ecfdf5);
    border-color: var(--p-primary-500);
    color: var(--p-primary-700, #047857);
    font-weight: 600;
    z-index: 2;
}

.p-selectbutton-item.is-selected:hover:not(.p-disabled) {
    background: var(--p-primary-100, #d1fae5);
}

/* Disabled Option */
.p-selectbutton-item.p-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--p-surface-100);
}

/* Sizes */
.p-selectbutton.size-small .p-selectbutton-item,
.p-selectbutton.p-selectbutton-sm .p-selectbutton-item {
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
}

.p-selectbutton.size-large .p-selectbutton-item,
.p-selectbutton.p-selectbutton-lg .p-selectbutton-item {
    padding: 0.75rem 1.25rem;
    font-size: 1.0625rem;
}

/* Invalid State */
.p-selectbutton.is-invalid .p-selectbutton-item {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-selectbutton.is-invalid .p-selectbutton-item:focus-visible {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Badges */
.p-selectbutton-badge {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    background: var(--p-surface-200);
    color: var(--p-surface-700);
}
.p-selectbutton-item.is-selected .p-selectbutton-badge {
    background: var(--p-primary-200, #a7f3d0);
    color: var(--p-primary-800, #065f46);
}

/* ==================== DARK MODE ==================== */
.dark .p-selectbutton-item {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-100);
}
.dark .p-selectbutton-item:hover:not(.p-disabled):not(.is-selected) {
    background: var(--p-surface-800);
    border-color: var(--p-surface-500);
}
.dark .p-selectbutton-item.is-selected {
    background: rgba(16, 185, 129, 0.16);
    border-color: var(--p-primary-500);
    color: var(--p-primary-300, #6ee7b7);
}
.dark .p-selectbutton-item.is-selected:hover:not(.p-disabled) {
    background: rgba(16, 185, 129, 0.24);
    color: var(--p-primary-200, #a7f3d0);
}
.dark .p-selectbutton-item.p-disabled {
    background: var(--p-surface-850, #141b26);
    border-color: var(--p-surface-700);
    color: var(--p-surface-500);
}
.dark .p-selectbutton-badge {
    background: var(--p-surface-800);
    color: var(--p-surface-200);
}
.dark .p-selectbutton-item.is-selected .p-selectbutton-badge {
    background: var(--p-primary-900);
    color: var(--p-primary-200);
}
`;
function SelectButtonIsland(container, props) {
  injectIslandStyle("laughtale-selectbutton", CSS);
  const isMultiple = props.multiple === true || String(props.multiple) === "true";
  const isUnselectable = props.unselectable !== false && String(props.unselectable) !== "false";
  const isFluid = props.fluid === true || String(props.fluid) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const size = props.size || "normal";
  const rawOptions = props.options || props.items || [];
  const normalizedOptions = rawOptions.map((opt) => {
    if (typeof opt === "string") {
      return { label: opt, value: opt };
    }
    return {
      ...opt,
      label: opt.label || opt.name || opt.justify || String(opt.value),
      disabled: opt.disabled || opt.constant
    };
  });
  let selectedValues = [];
  const initVal = props.value ?? props.selectedValue ?? props.values;
  if (initVal !== void 0 && initVal !== null) {
    if (Array.isArray(initVal)) {
      selectedValues = [...initVal];
    } else if (typeof initVal === "string" && initVal.includes(",") && isMultiple) {
      selectedValues = initVal.split(",").map((s) => s.trim());
    } else {
      selectedValues = [initVal];
    }
  }
  function isSelected(val) {
    return selectedValues.some((v) => String(v) === String(val));
  }
  function render() {
    const rootClasses = [
      "laughtale-selectbutton",
      "p-selectbutton",
      isFluid ? "p-selectbutton-fluid" : "",
      size !== "normal" ? `size-${size}` : "",
      isInvalid ? "is-invalid" : "",
      isDisabled ? "is-disabled" : ""
    ].filter(Boolean).join(" ");
    container.className = rootClasses;
    container.setAttribute("role", isMultiple ? "group" : "radiogroup");
    if (props.inputId) container.setAttribute("id", props.inputId);
    const buttonsHtml = normalizedOptions.map((opt, idx) => {
      const active = isSelected(opt.value);
      const optDis = isDisabled || opt.disabled;
      const btnClasses = [
        "p-selectbutton-item",
        active ? "is-selected" : "",
        optDis ? "p-disabled" : ""
      ].filter(Boolean).join(" ");
      const flagHtml = opt.flag ? `<span style="font-size: 1.125rem; line-height: 1;">${opt.flag}</span>` : "";
      const iconHtml = opt.icon ? `<span style="display: flex;">${getLucideIcon(opt.icon, 16)}</span>` : "";
      const badgeHtml = opt.badge !== void 0 ? `<span class="p-selectbutton-badge">${opt.badge}</span>` : "";
      return `
                <button 
                    type="button" 
                    class="${btnClasses}" 
                    data-value="${opt.value}"
                    ${optDis ? "disabled" : ""}
                    role="${isMultiple ? "checkbox" : "radio"}"
                    aria-checked="${active ? "true" : "false"}"
                    tabindex="${optDis ? "-1" : "0"}"
                >
                    ${flagHtml}
                    ${iconHtml}
                    <span>${opt.label}</span>
                    ${badgeHtml}
                </button>
            `;
    }).join("");
    container.innerHTML = `
            ${buttonsHtml}
            <input type="hidden" name="${props.name || props.targetInputName || "selectbutton_value"}" value="${selectedValues.join(",")}" />
        `;
    bindEvents();
  }
  function bindEvents() {
    const buttons = container.querySelectorAll(".p-selectbutton-item:not(.p-disabled)");
    buttons.forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        const val = btn.getAttribute("data-value");
        if (val === null) return;
        if (isMultiple) {
          if (isSelected(val)) {
            selectedValues = selectedValues.filter((v) => String(v) !== String(val));
          } else {
            selectedValues.push(val);
          }
        } else {
          if (isSelected(val)) {
            if (isUnselectable) {
              selectedValues = [];
            }
          } else {
            selectedValues = [val];
          }
        }
        render();
        syncValue();
      };
    });
  }
  function syncValue() {
    const payload = isMultiple ? selectedValues : selectedValues[0] ?? null;
    const hiddenInp = container.querySelector('input[type="hidden"]');
    if (hiddenInp) hiddenInp.value = selectedValues.join(",");
    container.dispatchEvent(new CustomEvent("selectbutton:change", {
      bubbles: true,
      detail: { value: payload }
    }));
    container.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      detail: { value: payload }
    }));
  }
  render();
}
export {
  SelectButtonIsland as default
};
//# sourceMappingURL=select-button-EO75P3G2.js.map
