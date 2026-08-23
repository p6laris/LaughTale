import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/input-mask.ts
var CSS = `
/* ==================== AURA INPUTMASK ==================== */
.laughtale-input-mask,
.p-inputmask {
    display: inline-flex;
    align-items: center;
    width: 100%;
    min-height: 2.5rem;
    padding: 0.375rem 0.75rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    color: var(--p-text-color);
    font-family: var(--p-font-family, inherit);
    font-size: 0.875rem;
    line-height: 1.25;
    outline: none;
    box-sizing: border-box;
    transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
}

.p-inputmask.p-inputmask-fluid {
    width: 100%;
}

.p-inputmask:hover:not(:disabled):not([readonly]) {
    border-color: var(--p-surface-400);
}

.p-inputmask:focus {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

/* Filled Variant */
.p-inputmask.variant-filled {
    background-color: var(--p-surface-100);
    border-color: transparent;
}
.p-inputmask.variant-filled:hover:not(:disabled):not([readonly]) {
    background-color: var(--p-surface-200);
}
.p-inputmask.variant-filled:focus {
    background-color: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Sizes */
.p-inputmask.size-small,
.p-inputmask.p-inputmask-sm {
    min-height: 2rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}
.p-inputmask.size-large,
.p-inputmask.p-inputmask-lg {
    min-height: 3rem;
    padding: 0.5rem 1rem;
    font-size: 1.0625rem;
}

/* Invalid State */
.p-inputmask.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-inputmask.is-invalid:focus {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-inputmask:disabled,
.p-inputmask.is-disabled {
    opacity: 0.65;
    cursor: not-allowed;
    background-color: var(--p-surface-100);
}

/* Dark mode overrides */
.dark .p-inputmask {
    background-color: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-0);
}
.dark .p-inputmask:hover:not(:disabled):not([readonly]) {
    border-color: var(--p-surface-500);
}
.dark .p-inputmask.variant-filled {
    background-color: var(--p-surface-800);
}
.dark .p-inputmask.variant-filled:hover:not(:disabled):not([readonly]) {
    background-color: var(--p-surface-700);
}
.dark .p-inputmask.variant-filled:focus {
    background-color: var(--p-surface-900);
}
.dark .p-inputmask:disabled,
.dark .p-inputmask.is-disabled {
    background-color: var(--p-surface-800);
}
`;
function InputMaskIsland(container, props) {
  injectIslandStyle("laughtale-input-mask", CSS);
  const mask = props.mask || "(999) 999-9999";
  const slotChar = props.slotChar || "_";
  const autoClear = props.autoClear !== false && String(props.autoClear) !== "false";
  const unmask = props.unmask === true || String(props.unmask) === "true";
  const isFluid = props.fluid === true || String(props.fluid) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const isReadonly = props.readonly === true || String(props.readonly) === "true";
  const isFilled = props.variant === "filled";
  const size = props.size || "normal";
  const tokens = [];
  let isOptionalZone = false;
  let slotCount = 0;
  for (let i = 0; i < mask.length; i++) {
    const c = mask[i];
    if (c === "?") {
      isOptionalZone = true;
      continue;
    }
    let regex;
    let isSlot = false;
    if (c === "9") {
      regex = /[0-9]/;
      isSlot = true;
    } else if (c === "a") {
      regex = /[A-Za-z]/;
      isSlot = true;
    } else if (c === "*") {
      regex = /[A-Za-z0-9]/;
      isSlot = true;
    }
    const slotCharToUse = isSlot ? slotChar.length > slotCount ? slotChar[slotCount] : slotChar[0] || "_" : c;
    if (isSlot) slotCount++;
    tokens.push({
      char: c,
      isSlot,
      isOptional: isOptionalZone,
      regex,
      slotChar: slotCharToUse
    });
  }
  function formatValue(raw) {
    let masked = "";
    let rawIdx = 0;
    let validSlots = 0;
    let requiredSlots = 0;
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.isSlot) {
        if (!token.isOptional) requiredSlots++;
        let matchedChar = "";
        while (rawIdx < raw.length) {
          const ch = raw[rawIdx++];
          if (token.regex?.test(ch)) {
            matchedChar = ch;
            break;
          }
        }
        if (matchedChar) {
          masked += matchedChar;
          validSlots++;
        } else {
          masked += token.slotChar;
        }
      } else {
        masked += token.char;
        if (rawIdx < raw.length && raw[rawIdx] === token.char) {
          rawIdx++;
        }
      }
    }
    let rawOut = "";
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].isSlot && i < masked.length && masked[i] !== tokens[i].slotChar) {
        rawOut += masked[i];
      }
    }
    return {
      masked,
      raw: rawOut,
      isComplete: validSlots >= requiredSlots
    };
  }
  const initialFormatted = formatValue(props.value || "");
  let currentFormatted = props.value ? initialFormatted.masked : "";
  const rootClasses = [
    "laughtale-input-mask",
    "p-inputmask",
    "p-inputtext",
    isFluid ? "p-inputmask-fluid" : "",
    isFilled ? "variant-filled" : "",
    size !== "normal" ? `size-${size}` : "",
    isInvalid ? "is-invalid" : "",
    isDisabled ? "is-disabled" : ""
  ].filter(Boolean).join(" ");
  container.innerHTML = `
        <input 
            type="text"
            class="${rootClasses}"
            value="${currentFormatted}"
            placeholder="${props.placeholder || tokens.map((t) => t.isSlot ? t.slotChar : t.char).join("")}"
            ${isDisabled ? "disabled" : ""}
            ${isReadonly ? "readonly" : ""}
            ${props.inputId ? `id="${props.inputId}"` : ""}
        />
        <input type="hidden" name="${props.name || props.targetInputName || "mask_value"}" value="" />
    `;
  const input = container.querySelector('input[type="text"]');
  const hiddenInp = container.querySelector('input[type="hidden"]');
  function syncValue() {
    const formatted = formatValue(input.value);
    const payload = unmask ? formatted.raw : formatted.masked;
    if (hiddenInp) hiddenInp.value = payload;
    container.dispatchEvent(new CustomEvent("input-mask:change", {
      bubbles: true,
      detail: { value: payload, rawValue: formatted.raw, maskedValue: formatted.masked }
    }));
    container.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      detail: { value: payload, rawValue: formatted.raw }
    }));
  }
  function getFirstSlotIndex(val) {
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].isSlot && val[i] === tokens[i].slotChar) {
        return i;
      }
    }
    return val.length;
  }
  input.addEventListener("focus", () => {
    if (!input.value) {
      input.value = tokens.map((t) => t.isSlot ? t.slotChar : t.char).join("");
      const pos = getFirstSlotIndex(input.value);
      setTimeout(() => input.setSelectionRange(pos, pos), 10);
    }
  });
  input.addEventListener("blur", () => {
    const formatted = formatValue(input.value);
    if (!formatted.isComplete && autoClear && formatted.raw.length === 0) {
      input.value = "";
    } else if (!formatted.isComplete && autoClear) {
      input.value = "";
    }
    syncValue();
  });
  input.addEventListener("input", (e) => {
    const inputType = e.inputType;
    const val = input.value;
    let rawExtracted = "";
    for (let i = 0; i < val.length; i++) {
      const ch = val[i];
      if (i < tokens.length && tokens[i].isSlot && ch !== tokens[i].slotChar) {
        rawExtracted += ch;
      } else if (i >= tokens.length && /[A-Za-z0-9]/.test(ch)) {
        rawExtracted += ch;
      }
    }
    const formatted = formatValue(rawExtracted);
    input.value = formatted.masked;
    const nextSlot = getFirstSlotIndex(input.value);
    input.setSelectionRange(nextSlot, nextSlot);
    syncValue();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      if (start === end && start > 0) {
        e.preventDefault();
        let targetSlot = start - 1;
        while (targetSlot >= 0 && !tokens[targetSlot].isSlot) {
          targetSlot--;
        }
        if (targetSlot >= 0) {
          const arr = input.value.split("");
          arr[targetSlot] = tokens[targetSlot].slotChar;
          input.value = arr.join("");
          input.setSelectionRange(targetSlot, targetSlot);
          syncValue();
        }
      }
    }
  });
  syncValue();
}
export {
  InputMaskIsland as default
};
//# sourceMappingURL=input-mask-2NYG3JKC.js.map
