import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/input-otp.ts
var CSS = `
.laughtale-input-otp,
.p-inputotp {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
}

.p-inputotp.p-inputotp-grouped {
    gap: 0;
}

/* Individual Digit Cell */
.p-inputotp-input {
    width: 2.75rem;
    height: 3.25rem;
    font-family: inherit;
    font-size: 1.25rem;
    font-weight: 700;
    text-align: center;
    color: var(--p-text-color);
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    outline: none;
    transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
    box-sizing: border-box;
    font-variant-numeric: tabular-nums;
    padding: 0;
}

.p-inputotp-input:hover:not(:disabled) {
    border-color: var(--p-surface-400);
}

.p-inputotp-input:focus {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
    z-index: 2;
    position: relative;
}

.p-inputotp-input:disabled {
    background: var(--p-surface-100);
    color: var(--p-text-muted);
    cursor: not-allowed;
    opacity: 0.75;
}

/* Variant: Filled */
.p-inputotp.variant-filled .p-inputotp-input {
    background: var(--p-surface-100);
    border-color: transparent;
}
.p-inputotp.variant-filled .p-inputotp-input:focus {
    background: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Sizes */
.p-inputotp.size-small .p-inputotp-input {
    width: 2rem;
    height: 2.5rem;
    font-size: 1rem;
    font-weight: 600;
}
.p-inputotp.size-large .p-inputotp-input {
    width: 3.25rem;
    height: 3.75rem;
    font-size: 1.5rem;
    font-weight: 700;
}

/* Invalid State */
.p-inputotp.is-invalid .p-inputotp-input {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-inputotp.is-invalid .p-inputotp-input:focus {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Grouped Layout with Joined Borders */
.p-inputotp-group {
    display: inline-flex;
    align-items: center;
}
.p-inputotp-group .p-inputotp-input:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.p-inputotp-group .p-inputotp-input:not(:first-child):not(:last-child) {
    border-radius: 0;
    margin-left: -1px;
}
.p-inputotp-group .p-inputotp-input:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: -1px;
}

/* Separator between Groups */
.p-inputotp-separator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.75rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--p-text-muted);
    user-select: none;
}

/* ==================== DARK MODE ==================== */
.dark .p-inputotp-input {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-inputotp-input:hover:not(:disabled) {
    border-color: var(--p-surface-600);
}
.dark .p-inputotp.variant-filled .p-inputotp-input {
    background: var(--p-surface-800);
}
.dark .p-inputotp.variant-filled .p-inputotp-input:focus {
    background: var(--p-surface-900);
}
.dark .p-inputotp-input:disabled {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
    color: var(--p-surface-500);
}
.dark .p-inputotp-separator {
    color: var(--p-surface-400);
}
`;
function InputOtpIsland(container, props) {
  injectIslandStyle("laughtale-inputotp", CSS);
  const length = Number(props.length) || 4;
  const isMask = props.mask === true || String(props.mask) === "true";
  const isIntegerOnly = props.integerOnly !== false && String(props.integerOnly) !== "false";
  const isGrouped = props.grouped === true || String(props.grouped) === "true";
  const isFilled = props.variant === "filled";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const isReadonly = props.readonlyMode === true || String(props.readonlyMode) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const separator = props.separator || "-";
  const initialVal = props.value || "";
  let values = Array.from({ length }, (_, i) => initialVal[i] || "");
  function render() {
    container.className = "laughtale-input-otp p-inputotp";
    if (isFilled) container.classList.add("variant-filled");
    if (props.size) container.classList.add(`size-${props.size}`);
    if (isInvalid) container.classList.add("is-invalid");
    if (isDisabled) container.classList.add("is-disabled");
    if (isGrouped) container.classList.add("p-inputotp-grouped");
    const inputType = isMask ? "password" : "text";
    const inputMode = isIntegerOnly ? "numeric" : "text";
    const patternAttr = isIntegerOnly ? 'pattern="[0-9]*"' : "";
    const disabledAttr = isDisabled ? "disabled" : "";
    const roAttr = isReadonly ? "readonly" : "";
    let html = "";
    if (isGrouped && length % 2 === 0) {
      const mid = length / 2;
      html += '<div class="p-inputotp-group">';
      for (let i = 0; i < mid; i++) {
        html += `
                    <input type="${inputType}"
                           class="p-inputotp-input"
                           data-index="${i}"
                           maxlength="1"
                           inputmode="${inputMode}"
                           ${patternAttr}
                           ${disabledAttr}
                           ${roAttr}
                           value="${values[i] || ""}"
                           autocomplete="off"
                           aria-label="Character ${i + 1}" />
                `;
      }
      html += "</div>";
      html += `<span class="p-inputotp-separator">${separator}</span>`;
      html += '<div class="p-inputotp-group">';
      for (let i = mid; i < length; i++) {
        html += `
                    <input type="${inputType}"
                           class="p-inputotp-input"
                           data-index="${i}"
                           maxlength="1"
                           inputmode="${inputMode}"
                           ${patternAttr}
                           ${disabledAttr}
                           ${roAttr}
                           value="${values[i] || ""}"
                           autocomplete="off"
                           aria-label="Character ${i + 1}" />
                `;
      }
      html += "</div>";
    } else {
      for (let i = 0; i < length; i++) {
        html += `
                    <input type="${inputType}"
                           class="p-inputotp-input"
                           data-index="${i}"
                           maxlength="1"
                           inputmode="${inputMode}"
                           ${patternAttr}
                           ${disabledAttr}
                           ${roAttr}
                           value="${values[i] || ""}"
                           autocomplete="off"
                           aria-label="Character ${i + 1}" />
                `;
      }
    }
    container.innerHTML = html;
    bindEvents();
  }
  function bindEvents() {
    const inputs = Array.from(container.querySelectorAll(".p-inputotp-input"));
    inputs.forEach((input, idx) => {
      input.addEventListener("focus", () => {
        input.select();
      });
      input.addEventListener("input", (e) => {
        const target = e.target;
        let val = target.value;
        if (isIntegerOnly) {
          val = val.replace(/\D/g, "");
        }
        if (val.length > 0) {
          const char = val[val.length - 1];
          values[idx] = char;
          target.value = char;
          if (idx < length - 1) {
            inputs[idx + 1].focus();
            inputs[idx + 1].select();
          }
        } else {
          values[idx] = "";
          target.value = "";
        }
        syncOtp();
      });
      input.addEventListener("keydown", (e) => {
        if (isDisabled || isReadonly) return;
        if (e.key === "Backspace") {
          if (input.value) {
            values[idx] = "";
            input.value = "";
            syncOtp();
          } else if (idx > 0) {
            inputs[idx - 1].focus();
            inputs[idx - 1].value = "";
            values[idx - 1] = "";
            syncOtp();
          }
          e.preventDefault();
        } else if (e.key === "Delete") {
          values[idx] = "";
          input.value = "";
          syncOtp();
          e.preventDefault();
        } else if (e.key === "ArrowLeft" && idx > 0) {
          inputs[idx - 1].focus();
          inputs[idx - 1].select();
          e.preventDefault();
        } else if (e.key === "ArrowRight" && idx < length - 1) {
          inputs[idx + 1].focus();
          inputs[idx + 1].select();
          e.preventDefault();
        } else if (e.key === "Home") {
          inputs[0].focus();
          inputs[0].select();
          e.preventDefault();
        } else if (e.key === "End") {
          inputs[length - 1].focus();
          inputs[length - 1].select();
          e.preventDefault();
        }
      });
      input.addEventListener("paste", (e) => {
        e.preventDefault();
        const pasteData = (e.clipboardData || window.clipboardData)?.getData("text") || "";
        let clean = isIntegerOnly ? pasteData.replace(/\D/g, "") : pasteData.trim();
        clean = clean.slice(0, length - idx);
        if (!clean) return;
        clean.split("").forEach((char, i) => {
          const targetIdx = idx + i;
          if (targetIdx < length) {
            values[targetIdx] = char;
            if (inputs[targetIdx]) inputs[targetIdx].value = char;
          }
        });
        syncOtp();
        const nextFocus = Math.min(idx + clean.length, length - 1);
        if (inputs[nextFocus]) {
          inputs[nextFocus].focus();
          inputs[nextFocus].select();
        }
      });
    });
  }
  function syncOtp() {
    const fullCode = values.join("");
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = fullCode;
    }
    container.dispatchEvent(new CustomEvent("otp:change", {
      bubbles: true,
      detail: {
        value: fullCode,
        isComplete: fullCode.length === length && !values.includes("")
      }
    }));
  }
  render();
  syncOtp();
  if (props.autofocus === true || String(props.autofocus) === "true") {
    const first = container.querySelector(".p-inputotp-input");
    first?.focus();
  }
}
export {
  InputOtpIsland as default
};
//# sourceMappingURL=input-otp-RUPMATZ7.js.map
