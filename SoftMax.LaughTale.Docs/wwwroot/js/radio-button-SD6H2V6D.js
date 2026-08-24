import {
  getLucideIcon
} from "./chunk-C4P5FSS5.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/radio-button.ts
var CSS = `
/* ==================== AURA RADIOBUTTON ==================== */
.laughtale-radio-root,
.p-radiobutton-root {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.p-radiobutton {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
}

.p-radiobutton-input {
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
}

.p-radiobutton-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border: 1px solid var(--p-border-color);
    border-radius: 50%;
    background: var(--p-surface-0);
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
}

.p-radiobutton-root:hover:not(.is-disabled) .p-radiobutton-box {
    border-color: var(--p-surface-400);
}

.p-radiobutton-root.is-focused .p-radiobutton-box,
.p-radiobutton-input:focus-visible + .p-radiobutton-box {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

/* Checked State */
.p-radiobutton-root.is-checked .p-radiobutton-box,
.p-radiobutton.p-radiobutton-checked .p-radiobutton-box {
    border-color: var(--p-primary-500);
    background: var(--p-surface-0);
}

.p-radiobutton-icon {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background: var(--p-primary-500);
    transform: scale(0);
    transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.p-radiobutton-root.is-checked .p-radiobutton-icon,
.p-radiobutton.p-radiobutton-checked .p-radiobutton-icon {
    transform: scale(1);
}

/* Filled Variant */
.p-radiobutton-root.variant-filled .p-radiobutton-box {
    background-color: var(--p-surface-100);
    border-color: transparent;
}
.p-radiobutton-root.variant-filled:hover:not(.is-disabled) .p-radiobutton-box {
    background-color: var(--p-surface-200);
}
.p-radiobutton-root.variant-filled.is-checked .p-radiobutton-box {
    background-color: var(--p-surface-0);
    border-color: var(--p-primary-500);
}

/* Sizes */
.p-radiobutton-root.size-small .p-radiobutton,
.p-radiobutton-root.size-small .p-radiobutton-box,
.p-radiobutton-sm .p-radiobutton-box {
    width: 1rem;
    height: 1rem;
}
.p-radiobutton-root.size-small .p-radiobutton-icon,
.p-radiobutton-sm .p-radiobutton-icon {
    width: 0.5rem;
    height: 0.5rem;
}
.p-radiobutton-root.size-small .p-radiobutton-label {
    font-size: 0.75rem;
}

.p-radiobutton-root.size-large .p-radiobutton,
.p-radiobutton-root.size-large .p-radiobutton-box,
.p-radiobutton-lg .p-radiobutton-box {
    width: 1.5rem;
    height: 1.5rem;
}
.p-radiobutton-root.size-large .p-radiobutton-icon,
.p-radiobutton-lg .p-radiobutton-icon {
    width: 0.75rem;
    height: 0.75rem;
}
.p-radiobutton-root.size-large .p-radiobutton-label {
    font-size: 1rem;
}

/* Invalid State */
.p-radiobutton-root.is-invalid .p-radiobutton-box {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-radiobutton-root.is-invalid.is-focused .p-radiobutton-box {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-radiobutton-root.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.p-radiobutton-root.is-disabled .p-radiobutton-input,
.p-radiobutton-root.is-disabled .p-radiobutton-box {
    cursor: not-allowed;
    background-color: var(--p-surface-100);
}

/* Label */
.p-radiobutton-label {
    font-size: 0.875rem;
    color: var(--p-text-color);
    line-height: 1.25;
}

/* Card Mode */
.p-radiobutton-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.125rem;
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    background: var(--p-surface-0);
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    box-sizing: border-box;
    width: 100%;
}
.p-radiobutton-card:hover:not(.is-disabled) {
    background: var(--p-surface-50);
    border-color: var(--p-surface-400);
}
.p-radiobutton-card.is-checked {
    border-color: var(--p-surface-900);
    background: var(--p-surface-0);
    box-shadow: 0 0 0 1px var(--p-surface-900);
}
.p-radiobutton-card.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--p-surface-100);
}

.p-radiobutton-card-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
}

.p-radiobutton-card-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--p-text-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.p-radiobutton-card-desc {
    font-size: 0.75rem;
    color: var(--p-text-muted);
    margin-top: 0.125rem;
}
.p-radiobutton-card-badge {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    background: var(--p-surface-100);
    color: var(--p-surface-700);
}
.p-radiobutton-card-price {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--p-text-color);
    margin-right: 0.75rem;
}

/* Radio Group */
.p-radiogroup {
    display: flex;
    gap: 1rem;
}
.p-radiogroup.p-radiogroup-vertical {
    flex-direction: column;
}
.p-radiogroup.p-radiogroup-horizontal {
    flex-direction: row;
    flex-wrap: wrap;
}

/* ==================== DARK MODE ==================== */
.dark .p-radiobutton-box {
    background-color: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-radiobutton-root:hover:not(.is-disabled) .p-radiobutton-box {
    border-color: var(--p-surface-500);
}
.dark .p-radiobutton-root.is-checked .p-radiobutton-box {
    border-color: var(--p-primary-400);
}
.dark .p-radiobutton-icon {
    background: var(--p-primary-400);
}
.dark .p-radiobutton-root.variant-filled .p-radiobutton-box {
    background-color: var(--p-surface-800);
}
.dark .p-radiobutton-root.variant-filled:hover:not(.is-disabled) .p-radiobutton-box {
    background-color: var(--p-surface-700);
}
.dark .p-radiobutton-root.variant-filled.is-checked .p-radiobutton-box {
    background-color: var(--p-surface-900);
    border-color: var(--p-primary-400);
}
.dark .p-radiobutton-label {
    color: var(--p-surface-100);
}
.dark .p-radiobutton-card {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-radiobutton-card:hover:not(.is-disabled) {
    background: var(--p-surface-850, #141b26);
    border-color: var(--p-surface-600);
}
.dark .p-radiobutton-card.is-checked {
    border-color: var(--p-surface-0);
    box-shadow: 0 0 0 1px var(--p-surface-0);
}
.dark .p-radiobutton-card-badge {
    background: var(--p-surface-800);
    color: var(--p-surface-200);
}
.dark .p-radiobutton-card-price {
    color: var(--p-surface-0);
}
`;
function RadioButtonIsland(container, props) {
  injectIslandStyle("laughtale-radio", CSS);
  const isCard = props.card === true || String(props.card) === "true";
  const isFilled = props.variant === "filled";
  const size = props.size || "normal";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const isReadonly = props.readonly === true || String(props.readonly) === "true";
  if (props.options && props.options.length > 0) {
    renderGroup();
    return;
  }
  let isChecked = Boolean(props.checked) || props.selectedValue !== void 0 && String(props.selectedValue) === String(props.value);
  function renderSingle() {
    const rootClasses = [
      "laughtale-radio-root",
      "p-radiobutton-root",
      isCard ? "p-radiobutton-card" : "",
      isChecked ? "is-checked" : "",
      isFilled ? "variant-filled" : "",
      size !== "normal" ? `size-${size}` : "",
      isInvalid ? "is-invalid" : "",
      isDisabled ? "is-disabled" : ""
    ].filter(Boolean).join(" ");
    if (isCard) {
      container.innerHTML = `
                <label class="${rootClasses}">
                    <div class="p-radiobutton-card-content">
                        ${props.flag ? `<span style="font-size: 1.25rem; line-height: 1;">${props.flag}</span>` : ""}
                        ${props.icon ? `<span style="color: var(--p-primary-600); display: flex;">${getLucideIcon(props.icon, 18)}</span>` : ""}
                        <div>
                            <div class="p-radiobutton-card-title">
                                <span>${props.label || props.value}</span>
                                ${props.badge ? `<span class="p-radiobutton-card-badge">${props.badge}</span>` : ""}
                            </div>
                            ${props.description ? `<div class="p-radiobutton-card-desc">${props.description}</div>` : ""}
                        </div>
                    </div>
                    <div style="display: flex; align-items: center;">
                        ${props.price ? `<span class="p-radiobutton-card-price">${props.price}</span>` : ""}
                        <div class="p-radiobutton ${isChecked ? "p-radiobutton-checked" : ""}">
                            <input 
                                type="radio" 
                                class="p-radiobutton-input"
                                name="${props.name}"
                                value="${props.value}"
                                ${isChecked ? "checked" : ""}
                                ${isDisabled ? "disabled" : ""}
                                ${isReadonly ? "readonly" : ""}
                                ${props.inputId ? `id="${props.inputId}"` : ""}
                            />
                            <div class="p-radiobutton-box">
                                <div class="p-radiobutton-icon"></div>
                            </div>
                        </div>
                    </div>
                </label>
                <input type="hidden" name="${props.targetInputName || ""}" value="${isChecked ? props.value : ""}" />
            `;
    } else {
      container.innerHTML = `
                <label class="${rootClasses}">
                    <div class="p-radiobutton ${isChecked ? "p-radiobutton-checked" : ""}">
                        <input 
                            type="radio" 
                            class="p-radiobutton-input"
                            name="${props.name}"
                            value="${props.value}"
                            ${isChecked ? "checked" : ""}
                            ${isDisabled ? "disabled" : ""}
                            ${isReadonly ? "readonly" : ""}
                            ${props.inputId ? `id="${props.inputId}"` : ""}
                        />
                        <div class="p-radiobutton-box">
                            <div class="p-radiobutton-icon"></div>
                        </div>
                    </div>
                    ${props.label ? `<span class="p-radiobutton-label">${props.label}</span>` : ""}
                </label>
                <input type="hidden" name="${props.targetInputName || ""}" value="${isChecked ? props.value : ""}" />
            `;
    }
    bindSingleEvents();
  }
  function updateVisuals(checked) {
    isChecked = checked;
    const labelWrap = container.querySelector(".p-radiobutton-root");
    const rbBox = container.querySelector(".p-radiobutton");
    const hiddenInp = container.querySelector('input[type="hidden"]');
    if (labelWrap) {
      if (isChecked) labelWrap.classList.add("is-checked");
      else labelWrap.classList.remove("is-checked");
    }
    if (rbBox) {
      if (isChecked) rbBox.classList.add("p-radiobutton-checked");
      else rbBox.classList.remove("p-radiobutton-checked");
    }
    if (hiddenInp && props.targetInputName) {
      hiddenInp.value = isChecked ? props.value : "";
    }
  }
  function bindSingleEvents() {
    const input = container.querySelector(".p-radiobutton-input");
    if (!input) return;
    input.addEventListener("change", () => {
      if (isDisabled || isReadonly) return;
      updateVisuals(input.checked);
      syncOthers();
      syncValue();
    });
    input.addEventListener("focus", () => {
      container.querySelector(".p-radiobutton-root")?.classList.add("is-focused");
    });
    input.addEventListener("blur", () => {
      container.querySelector(".p-radiobutton-root")?.classList.remove("is-focused");
    });
  }
  function syncOthers() {
    document.querySelectorAll(`input[type="radio"][name="${props.name}"]`).forEach((other) => {
      if (other !== container.querySelector(".p-radiobutton-input")) {
        const parentRoot = other.closest(".p-radiobutton-root");
        const parentBox = other.closest(".p-radiobutton");
        if (parentRoot) {
          if (other.checked) parentRoot.classList.add("is-checked");
          else parentRoot.classList.remove("is-checked");
        }
        if (parentBox) {
          if (other.checked) parentBox.classList.add("p-radiobutton-checked");
          else parentBox.classList.remove("p-radiobutton-checked");
        }
      }
    });
  }
  function syncValue() {
    if (!isChecked) return;
    container.dispatchEvent(new CustomEvent("radio:change", {
      bubbles: true,
      detail: { value: props.value, checked: isChecked }
    }));
  }
  function renderGroup() {
    const isHorizontal = props.layout === "horizontal";
    const groupClasses = ["p-radiogroup", isHorizontal ? "p-radiogroup-horizontal" : "p-radiogroup-vertical"].join(" ");
    let currentSelected = props.selectedValue ?? props.value ?? "";
    const rawOpts = (props.options || []).map((opt) => {
      if (typeof opt === "string") return { label: opt, value: opt };
      return opt;
    });
    container.className = groupClasses;
    container.innerHTML = rawOpts.map((opt, idx) => {
      const checked = String(opt.value) === String(currentSelected);
      const itemId = `${props.name}_${idx}`;
      const optDisabled = isDisabled || opt.disabled;
      if (isCard) {
        return `
                    <label class="p-radiobutton-root p-radiobutton-card ${checked ? "is-checked" : ""} ${optDisabled ? "is-disabled" : ""}">
                        <div class="p-radiobutton-card-content">
                            ${opt.flag ? `<span style="font-size: 1.25rem; line-height: 1;">${opt.flag}</span>` : ""}
                            ${opt.icon ? `<span style="color: var(--p-primary-600); display: flex;">${getLucideIcon(opt.icon, 18)}</span>` : ""}
                            <div>
                                <div class="p-radiobutton-card-title">
                                    <span>${opt.label || opt.value}</span>
                                    ${opt.badge ? `<span class="p-radiobutton-card-badge">${opt.badge}</span>` : ""}
                                </div>
                                ${opt.description ? `<div class="p-radiobutton-card-desc">${opt.description}</div>` : ""}
                            </div>
                        </div>
                        <div style="display: flex; align-items: center;">
                            ${opt.price ? `<span class="p-radiobutton-card-price">${opt.price}</span>` : ""}
                            <div class="p-radiobutton ${checked ? "p-radiobutton-checked" : ""}">
                                <input 
                                    type="radio" 
                                    class="p-radiobutton-input"
                                    name="${props.name}"
                                    value="${opt.value}"
                                    id="${itemId}"
                                    ${checked ? "checked" : ""}
                                    ${optDisabled ? "disabled" : ""}
                                />
                                <div class="p-radiobutton-box">
                                    <div class="p-radiobutton-icon"></div>
                                </div>
                            </div>
                        </div>
                    </label>
                `;
      } else {
        return `
                    <label class="p-radiobutton-root ${checked ? "is-checked" : ""} ${optDisabled ? "is-disabled" : ""}">
                        <div class="p-radiobutton ${checked ? "p-radiobutton-checked" : ""}">
                            <input 
                                type="radio" 
                                class="p-radiobutton-input"
                                name="${props.name}"
                                value="${opt.value}"
                                id="${itemId}"
                                ${checked ? "checked" : ""}
                                ${optDisabled ? "disabled" : ""}
                            />
                            <div class="p-radiobutton-box">
                                <div class="p-radiobutton-icon"></div>
                            </div>
                        </div>
                        <span class="p-radiobutton-label">${opt.label}</span>
                    </label>
                `;
      }
    }).join("") + `<input type="hidden" name="${props.targetInputName || props.name}" value="${currentSelected}" />`;
    const inputs = container.querySelectorAll(".p-radiobutton-input");
    const hiddenInp = container.querySelector('input[type="hidden"]');
    inputs.forEach((inp) => {
      inp.addEventListener("change", () => {
        inputs.forEach((other) => {
          const cardWrap = other.closest(".p-radiobutton-root");
          const rb = other.closest(".p-radiobutton");
          if (other.checked) {
            cardWrap?.classList.add("is-checked");
            rb?.classList.add("p-radiobutton-checked");
          } else {
            cardWrap?.classList.remove("is-checked");
            rb?.classList.remove("p-radiobutton-checked");
          }
        });
        if (hiddenInp) hiddenInp.value = inp.value;
        container.dispatchEvent(new CustomEvent("radiogroup:change", {
          bubbles: true,
          detail: { value: inp.value }
        }));
      });
    });
  }
  renderSingle();
}
export {
  RadioButtonIsland as default
};
//# sourceMappingURL=radio-button-SD6H2V6D.js.map
