import {
  getLucideIcon
} from "./chunk-G3Y35IKD.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/toggle-button.ts
var CSS = `
/* ==================== AURA TOGGLEBUTTON ==================== */
.laughtale-togglebutton,
.p-togglebutton {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #cbd5e1);
    border-radius: var(--p-border-radius, 6px);
    color: var(--p-text-color, #0f172a);
    font-family: var(--p-font-family, inherit);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25;
    cursor: pointer;
    user-select: none;
    outline: none;
    box-sizing: border-box;
    vertical-align: middle;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease, box-shadow 150ms ease, transform 120ms ease;
}

.p-togglebutton.p-togglebutton-fluid {
    display: flex;
    width: 100%;
}

.p-togglebutton:hover:not(.p-disabled):not(.p-togglebutton-checked) {
    background: var(--p-surface-100, #f1f5f9);
    border-color: var(--p-surface-400, #94a3b8);
}

.p-togglebutton:focus-visible:not(.p-disabled) {
    border-color: var(--p-primary-500, #10b981) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500, #10b981) !important;
}

/* Checked (On) State */
.p-togglebutton.p-togglebutton-checked,
.p-togglebutton.is-checked {
    background: var(--p-primary-50, #ecfdf5);
    border-color: var(--p-primary-500, #10b981);
    color: var(--p-primary-700, #047857);
    font-weight: 600;
}

.p-togglebutton.p-togglebutton-checked:hover:not(.p-disabled),
.p-togglebutton.is-checked:hover:not(.p-disabled) {
    background: var(--p-primary-100, #d1fae5);
}

/* Sizes */
.p-togglebutton.size-small,
.p-togglebutton.p-togglebutton-sm {
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
    gap: 0.375rem;
}

.p-togglebutton.size-large,
.p-togglebutton.p-togglebutton-lg {
    padding: 0.75rem 1.25rem;
    font-size: 1.0625rem;
    gap: 0.625rem;
}

/* Invalid State */
.p-togglebutton.p-invalid,
.p-togglebutton.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-togglebutton.p-invalid:focus-visible,
.p-togglebutton.is-invalid:focus-visible {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-togglebutton:disabled,
.p-togglebutton.p-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--p-surface-100, #f1f5f9);
    border-color: var(--p-surface-300, #cbd5e1);
    color: var(--p-text-muted, #64748b);
    pointer-events: none;
}

/* Icon & Label */
.p-togglebutton-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.p-togglebutton-label {
    display: inline-block;
    line-height: 1;
}

/* ==================== DARK MODE ==================== */
.dark .p-togglebutton {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-0, #f8fafc);
}
.dark .p-togglebutton:hover:not(.p-disabled):not(.p-togglebutton-checked) {
    background: var(--p-surface-800, #1e293b);
    border-color: var(--p-surface-500, #64748b);
}
.dark .p-togglebutton.p-togglebutton-checked,
.dark .p-togglebutton.is-checked {
    background: rgba(16, 185, 129, 0.16);
    border-color: var(--p-primary-500, #10b981);
    color: var(--p-primary-300, #6ee7b7);
}
.dark .p-togglebutton.p-togglebutton-checked:hover:not(.p-disabled),
.dark .p-togglebutton.is-checked:hover:not(.p-disabled) {
    background: rgba(16, 185, 129, 0.24);
    color: var(--p-primary-200, #a7f3d0);
}
.dark .p-togglebutton:disabled,
.dark .p-togglebutton.p-disabled {
    background: var(--p-surface-850, #141b26);
    border-color: var(--p-surface-700, #334155);
    color: var(--p-surface-500, #64748b);
}
`;
function ToggleButtonIsland(container, props) {
  injectIslandStyle("laughtale-togglebutton", CSS);
  let isChecked = props.checked === true || String(props.checked) === "true" || props.value === true || String(props.value) === "true";
  const isFluid = props.fluid === true || String(props.fluid) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const size = props.size || "normal";
  const onLabel = props.onLabel !== void 0 ? props.onLabel : "On";
  const offLabel = props.offLabel !== void 0 ? props.offLabel : "Off";
  const onIcon = props.onIcon || props.icon;
  const offIcon = props.offIcon || props.icon;
  function render() {
    const rootClasses = [
      "laughtale-togglebutton",
      "p-togglebutton",
      "p-component",
      isChecked ? "p-togglebutton-checked is-checked" : "",
      isFluid ? "p-togglebutton-fluid" : "",
      size !== "normal" ? `size-${size} p-togglebutton-${size === "small" ? "sm" : "lg"}` : "",
      isInvalid ? "p-invalid is-invalid" : "",
      isDisabled ? "p-disabled" : ""
    ].filter(Boolean).join(" ");
    container.className = rootClasses;
    container.setAttribute("role", "button");
    container.setAttribute("aria-pressed", isChecked ? "true" : "false");
    container.setAttribute("tabindex", isDisabled ? "-1" : "0");
    if (props.inputId) container.setAttribute("id", props.inputId);
    if (props.ariaLabel) container.setAttribute("aria-label", props.ariaLabel);
    if (props.ariaLabelledBy) container.setAttribute("aria-labelledby", props.ariaLabelledBy);
    const currentLabel = isChecked ? onLabel : offLabel;
    const currentIconName = isChecked ? onIcon : offIcon;
    const iconSize = size === "small" ? 14 : size === "large" ? 18 : 16;
    const iconHtml = currentIconName ? `<span class="p-togglebutton-icon">${getLucideIcon(currentIconName, iconSize)}</span>` : "";
    const labelHtml = currentLabel ? `<span class="p-togglebutton-label">${currentLabel}</span>` : "";
    container.innerHTML = `
            ${iconHtml}
            ${labelHtml}
            <input type="hidden" name="${props.name || props.targetInputName || "togglebutton_value"}" value="${isChecked ? "true" : "false"}" />
        `;
    bindEvents();
  }
  function toggle() {
    if (isDisabled) return;
    isChecked = !isChecked;
    render();
    syncValue();
  }
  function syncValue() {
    const hiddenInp = container.querySelector('input[type="hidden"]');
    if (hiddenInp) hiddenInp.value = isChecked ? "true" : "false";
    container.dispatchEvent(new CustomEvent("togglebutton:change", {
      bubbles: true,
      detail: { checked: isChecked, value: isChecked }
    }));
    container.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      detail: { checked: isChecked, value: isChecked }
    }));
  }
  function bindEvents() {
    container.onclick = (e) => {
      e.preventDefault();
      toggle();
    };
    container.onkeydown = (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggle();
      }
    };
  }
  render();
}
export {
  ToggleButtonIsland as default
};
//# sourceMappingURL=toggle-button-D4VEEM4L.js.map
