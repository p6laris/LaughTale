import {
  getLucideIcon
} from "./chunk-C4P5FSS5.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/toggle-switch.ts
var CSS = `
/* ==================== AURA TOGGLESWITCH ==================== */
.laughtale-toggleswitch,
.p-toggleswitch {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    user-select: none;
    vertical-align: middle;
    cursor: pointer;
}

.p-toggleswitch.p-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
}

.p-toggleswitch-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: 1;
    cursor: pointer;
    border: 0;
    appearance: none;
}

.p-toggleswitch.p-disabled .p-toggleswitch-input {
    cursor: not-allowed;
}

/* Slider Track */
.p-toggleswitch-slider {
    position: relative;
    display: block;
    width: 2.5rem; /* 40px */
    height: 1.5rem; /* 24px */
    background: var(--p-surface-300, #cbd5e1);
    border-radius: 9999px;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    box-sizing: border-box;
}

.p-toggleswitch:hover:not(.p-disabled):not(.p-toggleswitch-checked) .p-toggleswitch-slider {
    background: var(--p-surface-400, #94a3b8);
}

.p-toggleswitch:focus-within:not(.p-disabled) .p-toggleswitch-slider,
.p-toggleswitch-input:focus-visible ~ .p-toggleswitch-slider {
    box-shadow: 0 0 0 1px var(--p-primary-500, #10b981) !important;
}

/* Checked State */
.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
    background: var(--p-primary-500, #10b981);
}

.p-toggleswitch.p-toggleswitch-checked:hover:not(.p-disabled) .p-toggleswitch-slider {
    background: var(--p-primary-600, #059669);
}

/* Handle Thumb */
.p-toggleswitch-handle {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 1.125rem; /* 18px */
    height: 1.125rem; /* 18px */
    background: var(--p-surface-0, #ffffff);
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.06);
    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), background 150ms ease, color 150ms ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    color: var(--p-surface-600, #475569);
}

.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
    transform: translateX(16px);
    color: var(--p-primary-600, #059669);
}

/* Handle Icon */
.p-toggleswitch-handle-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.p-toggleswitch-handle-icon svg {
    width: 10px;
    height: 10px;
}

/* Invalid State */
.p-toggleswitch.p-invalid .p-toggleswitch-slider,
.p-toggleswitch.is-invalid .p-toggleswitch-slider {
    border: 1px solid var(--p-red-500, #ef4444) !important;
}
.p-toggleswitch.p-invalid:focus-within .p-toggleswitch-slider,
.p-toggleswitch.is-invalid:focus-within .p-toggleswitch-slider {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Label */
.p-toggleswitch-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--p-text-color, #0f172a);
    cursor: pointer;
}

/* ==================== DARK MODE ==================== */
.dark .p-toggleswitch-slider {
    background: var(--p-surface-700, #334155);
}
.dark .p-toggleswitch:hover:not(.p-disabled):not(.p-toggleswitch-checked) .p-toggleswitch-slider {
    background: var(--p-surface-600, #475569);
}
.dark .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
    background: var(--p-primary-500, #10b981);
}
.dark .p-toggleswitch.p-toggleswitch-checked:hover:not(.p-disabled) .p-toggleswitch-slider {
    background: var(--p-primary-400, #34d399);
}
.dark .p-toggleswitch-handle {
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-600, #475569);
}
.dark .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
    background: var(--p-surface-0, #ffffff);
    color: var(--p-primary-600, #059669);
}
.dark .p-toggleswitch.p-disabled .p-toggleswitch-slider {
    background: var(--p-surface-800, #1e293b);
}
.dark .p-toggleswitch.p-disabled .p-toggleswitch-handle {
    background: var(--p-surface-500, #64748b);
}
`;
function ToggleSwitchIsland(container, props) {
  injectIslandStyle("laughtale-toggleswitch", CSS);
  let isChecked = props.checked === true || String(props.checked) === "true" || props.value === true || String(props.value) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const checkedIcon = props.checkedIcon || props.icon;
  const uncheckedIcon = props.uncheckedIcon;
  const inputId = props.inputId || "";
  const inputName = props.name || props.targetInputName || "switch_value";
  function render() {
    const rootClasses = [
      "laughtale-toggleswitch",
      "p-toggleswitch",
      "p-component",
      isChecked ? "p-toggleswitch-checked" : "",
      isInvalid ? "p-invalid is-invalid" : "",
      isDisabled ? "p-disabled" : ""
    ].filter(Boolean).join(" ");
    container.className = rootClasses;
    const activeIcon = isChecked ? checkedIcon : uncheckedIcon;
    const iconHtml = activeIcon ? `<span class="p-toggleswitch-handle-icon">${getLucideIcon(activeIcon, 10)}</span>` : "";
    container.innerHTML = `
            <input 
                type="checkbox" 
                role="switch"
                class="p-toggleswitch-input"
                ${inputId ? `id="${inputId}"` : ""}
                name="${inputName}"
                ${isChecked ? "checked" : ""}
                ${isDisabled ? "disabled" : ""}
                aria-checked="${isChecked ? "true" : "false"}"
                ${props.ariaLabel ? `aria-label="${props.ariaLabel}"` : ""}
                ${props.ariaLabelledBy ? `aria-labelledby="${props.ariaLabelledBy}"` : ""}
                tabindex="${isDisabled ? "-1" : "0"}"
            />
            <div class="p-toggleswitch-slider ${props.sliderClass || ""}">
                <div class="p-toggleswitch-handle ${props.handleClass || ""}">
                    ${iconHtml}
                </div>
            </div>
            ${props.label ? `<span class="p-toggleswitch-label">${props.label}</span>` : ""}
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
    container.dispatchEvent(new CustomEvent("switch:change", {
      bubbles: true,
      detail: { checked: isChecked, value: isChecked }
    }));
    container.dispatchEvent(new CustomEvent("toggleswitch:change", {
      bubbles: true,
      detail: { checked: isChecked, value: isChecked }
    }));
    container.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      detail: { checked: isChecked, value: isChecked }
    }));
  }
  function bindEvents() {
    const inp = container.querySelector(".p-toggleswitch-input");
    if (inp) {
      inp.onchange = (e) => {
        e.stopPropagation();
        toggle();
      };
    }
    container.onclick = (e) => {
      if (e.target.closest(".p-toggleswitch-input")) return;
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
  ToggleSwitchIsland as default
};
//# sourceMappingURL=toggle-switch-75O2FLSX.js.map
