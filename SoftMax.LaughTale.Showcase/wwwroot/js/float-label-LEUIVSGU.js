import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/float-label.ts
var CSS = `
.laughtale-float-label {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    margin-top: 1rem;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.laughtale-float-label > label {
    position: absolute;
    left: 0.75rem;
    color: var(--p-text-muted);
    font-size: 0.875rem;
    font-weight: 500;
    pointer-events: none;
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
    line-height: 1;
    user-select: none;
}

/* Variant: over (Floats completely above the input) */
.laughtale-float-label-over > label {
    top: 50%;
    transform: translateY(-50%);
}
.laughtale-float-label-over.has-value > label,
.laughtale-float-label-over:focus-within > label {
    top: -1.25rem;
    left: 0.15rem;
    transform: translateY(0);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--p-primary-500);
}

/* Variant: on (Floats on the top border line with surface pill masking) */
.laughtale-float-label-on > label {
    top: 50%;
    transform: translateY(-50%);
    background: var(--p-surface-0);
    padding: 0 0.35rem;
    border-radius: 2px;
}
.laughtale-float-label-on.has-value > label,
.laughtale-float-label-on:focus-within > label {
    top: 0;
    transform: translateY(-50%);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--p-primary-500);
    z-index: 2;
}

/* Variant: in (Infield top-aligned label) */
.laughtale-float-label-in > label {
    top: 50%;
    transform: translateY(-50%);
}
.laughtale-float-label-in.has-value > label,
.laughtale-float-label-in:focus-within > label {
    top: 0.35rem;
    transform: translateY(0);
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--p-primary-500);
}
.laughtale-float-label-in input,
.laughtale-float-label-in .p-input,
.laughtale-float-label-in .cs-trigger,
.laughtale-float-label-in .dp-trigger,
.laughtale-float-label-in .ac-input-container {
    padding-top: 1.25rem !important;
    padding-bottom: 0.25rem !important;
}

/* Invalid State */
.laughtale-float-label.invalid > label,
.laughtale-float-label:has(.invalid) > label,
.laughtale-float-label:has(:invalid) > label {
    color: #ef4444 !important;
}

/* Dark Mode Tokens */
.dark .laughtale-float-label > label {
    color: var(--p-surface-400);
}
.dark .laughtale-float-label-on > label {
    background: var(--p-surface-900);
}
.dark .laughtale-float-label.has-value > label,
.dark .laughtale-float-label:focus-within > label {
    color: var(--p-primary-400);
}
.dark .laughtale-float-label.invalid > label,
.dark .laughtale-float-label:has(.invalid) > label,
.dark .laughtale-float-label:has(:invalid) > label {
    color: #f87171 !important;
}
`;
function FloatLabelIsland(container, props) {
  injectIslandStyle("laughtale-float-label", CSS);
  const variant = props.variant || "over";
  const initialHtml = container.innerHTML;
  const forAttr = props.for ? `for="${props.for}"` : "";
  const existingLabel = container.querySelector("label");
  const labelText = props.label || (existingLabel ? existingLabel.textContent : "Label");
  container.innerHTML = `
        <div class="laughtale-float-label laughtale-float-label-${variant} ${props.invalid ? "invalid" : ""}">
            ${initialHtml}
            ${!existingLabel && labelText ? `<label ${forAttr}>${labelText}</label>` : ""}
        </div>
    `;
  const wrap = container.querySelector(".laughtale-float-label");
  const labelEl = wrap.querySelector("label");
  const findTarget = () => {
    return wrap.querySelector("input, textarea, select, .cs-trigger, .dp-trigger, .ac-input");
  };
  function updateFloatingState() {
    const input = wrap.querySelector('input:not([type="hidden"]), textarea, select');
    const customText = wrap.querySelector(".cs-label:not(.placeholder), .dp-label:not(.placeholder), .ac-input");
    let hasVal = false;
    if (input && input.value && input.value.trim().length > 0) {
      hasVal = true;
    } else if (customText && customText.textContent && customText.textContent.trim().length > 0 && !customText.classList.contains("placeholder")) {
      hasVal = true;
    }
    if (hasVal) {
      wrap.classList.add("has-value");
    } else {
      wrap.classList.remove("has-value");
    }
  }
  labelEl?.addEventListener("click", () => {
    const target = findTarget();
    if (target) {
      target.focus();
      if (typeof target.click === "function" && !target.matches("input, textarea")) {
        target.click();
      }
    }
  });
  wrap.addEventListener("input", updateFloatingState);
  wrap.addEventListener("change", updateFloatingState);
  wrap.addEventListener("focusin", () => wrap.classList.add("is-focused"));
  wrap.addEventListener("focusout", () => {
    wrap.classList.remove("is-focused");
    updateFloatingState();
  });
  wrap.addEventListener("cascadeselect:change", updateFloatingState);
  wrap.addEventListener("datepicker:change", updateFloatingState);
  wrap.addEventListener("autocomplete:change", updateFloatingState);
  wrap.addEventListener("select:change", updateFloatingState);
  setTimeout(updateFloatingState, 50);
}
export {
  FloatLabelIsland as default
};
//# sourceMappingURL=float-label-LEUIVSGU.js.map
