import {
  useControllableState
} from "./chunk-3ZMZT2PZ.js";
import {
  useAutoAnimate
} from "./chunk-P6OQD35U.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/input-tags.ts
var CSS = `
.laughtale-inputtags,
.p-inputtags {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    position: relative;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    width: auto;
    min-height: 2.5rem;
    padding: 0.25rem 0.5rem;
    gap: 0.375rem;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    transition: border-color 150ms ease, box-shadow 150ms ease, background 150ms ease;
    cursor: text;
}

.p-inputtags.p-inputtags-fluid {
    display: flex;
    width: 100%;
}

.p-inputtags:hover:not(.is-disabled) {
    border-color: var(--p-surface-400);
}

.p-inputtags:focus-within:not(.is-disabled) {
    border-color: var(--p-primary-500) !important;
    box-shadow: 0 0 0 1px var(--p-primary-500) !important;
}

/* Variant: Filled */
.p-inputtags.variant-filled {
    background: var(--p-surface-100);
    border-color: transparent;
}
.p-inputtags.variant-filled:focus-within {
    background: var(--p-surface-0);
    border-color: var(--p-primary-500) !important;
}

/* Invalid State */
.p-inputtags.is-invalid {
    border-color: var(--p-red-500, #ef4444) !important;
}
.p-inputtags.is-invalid:focus-within {
    box-shadow: 0 0 0 1px var(--p-red-500, #ef4444) !important;
}

/* Disabled State */
.p-inputtags.is-disabled {
    background: var(--p-surface-100);
    opacity: 0.75;
    cursor: not-allowed;
}

/* Sizes */
.p-inputtags.size-small {
    min-height: 2rem;
    padding: 0.125rem 0.375rem;
    gap: 0.25rem;
}
.p-inputtags.size-small .p-inputtags-tag {
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
}
.p-inputtags.size-small .p-inputtags-input {
    font-size: 0.75rem;
}

.p-inputtags.size-large {
    min-height: 3rem;
    padding: 0.375rem 0.75rem;
    gap: 0.5rem;
}
.p-inputtags.size-large .p-inputtags-tag {
    font-size: 0.9375rem;
    padding: 0.25rem 0.625rem;
}
.p-inputtags.size-large .p-inputtags-input {
    font-size: 1rem;
}

/* Tags / Chips */
.p-inputtags-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: var(--p-surface-100);
    color: var(--p-surface-800);
    border: 1px solid var(--p-surface-200);
    border-radius: var(--p-border-radius);
    padding: 0.1875rem 0.5rem;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.2;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
    user-select: none;
}

.p-inputtags-tag:focus,
.p-inputtags-tag.is-focused {
    outline: none;
    border-color: var(--p-primary-500);
    background: var(--p-primary-50);
    color: var(--p-primary-700);
}

.p-inputtags-tag-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--p-surface-400);
    cursor: pointer;
    padding: 0;
    margin: 0;
    border-radius: 9999px;
    transition: color 150ms ease, background 150ms ease;
}
.p-inputtags-tag-remove:hover {
    color: var(--p-surface-700);
}
.p-inputtags-tag-remove svg {
    width: 14px;
    height: 14px;
}

/* Native Input Field */
.p-inputtags-input {
    flex: 1 1 60px;
    min-width: 60px;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 0.875rem;
    color: var(--p-text-color);
    padding: 0.1875rem 0.25rem;
    box-sizing: border-box;
}
.p-inputtags-input:disabled {
    cursor: not-allowed;
    color: var(--p-text-muted);
}

/* ==================== TYPEAHEAD SUGGESTIONS DROPDOWN ==================== */
.p-inputtags-panel {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    min-width: 180px;
    background: var(--p-surface-0);
    border: 1px solid var(--p-border-color);
    border-radius: var(--p-border-radius);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
    z-index: 1000;
    max-height: 220px;
    overflow-y: auto;
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    animation: pInputTagsFadeIn 150ms ease;
}
@keyframes pInputTagsFadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
}

.p-inputtags-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--p-border-radius) - 2px);
    font-size: 0.875rem;
    color: var(--p-text-color);
    cursor: pointer;
    transition: background 120ms ease;
    user-select: none;
}
.p-inputtags-item:hover,
.p-inputtags-item.is-highlighted {
    background: var(--p-surface-100);
    color: var(--p-surface-900);
}

/* ==================== DARK MODE ==================== */
.dark .p-inputtags {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
}
.dark .p-inputtags:hover:not(.is-disabled) {
    border-color: var(--p-surface-600);
}
.dark .p-inputtags.variant-filled {
    background: var(--p-surface-800);
}
.dark .p-inputtags.variant-filled:focus-within {
    background: var(--p-surface-900);
}
.dark .p-inputtags-tag {
    background: var(--p-surface-800);
    color: var(--p-surface-100);
    border-color: var(--p-surface-700);
}
.dark .p-inputtags-tag:focus,
.dark .p-inputtags-tag.is-focused {
    background: var(--p-surface-700);
    border-color: var(--p-primary-500);
    color: var(--p-primary-300);
}
.dark .p-inputtags-tag-remove {
    color: var(--p-surface-400);
}
.dark .p-inputtags-tag-remove:hover {
    color: var(--p-surface-100);
}
.dark .p-inputtags-input {
    color: var(--p-surface-0);
}
.dark .p-inputtags-panel {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
}
.dark .p-inputtags-item:hover,
.dark .p-inputtags-item.is-highlighted {
    background: var(--p-surface-800);
    color: var(--p-surface-0);
}
`;
function InputTagsIsland(container, props) {
  injectIslandStyle("laughtale-inputtags", CSS);
  let initialValues = [];
  const rawVal = props.values ?? props.value;
  if (Array.isArray(rawVal)) {
    initialValues = rawVal.map(String);
  } else if (typeof rawVal === "string" && rawVal.trim().length > 0) {
    try {
      const parsed = JSON.parse(rawVal);
      if (Array.isArray(parsed)) initialValues = parsed.map(String);
      else initialValues = rawVal.split(",").map((s) => s.trim()).filter(Boolean);
    } catch {
      initialValues = rawVal.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  const [getTags, setTags] = useControllableState({
    defaultValue: initialValues,
    onChange: (tags) => {
      syncTargetInput(tags);
    }
  });
  const isFluid = props.fluid === true || String(props.fluid) === "true";
  const isFilled = props.variant === "filled";
  const isDisabled = props.disabled === true || String(props.disabled) === "true";
  const isReadonly = props.readonlyMode === true || String(props.readonlyMode) === "true";
  const isInvalid = props.invalid === true || String(props.invalid) === "true";
  const allowDuplicate = props.allowDuplicate === true || String(props.allowDuplicate) === "true";
  const addOnPaste = props.addOnPaste !== false && String(props.addOnPaste) !== "false";
  const maxItems = props.max ? Number(props.max) : null;
  const delimiter = props.delimiter || props.separator || ",";
  const hasTypeahead = props.typeahead === true || String(props.typeahead) === "true";
  let suggestionsList = [];
  if (props.suggestions) {
    if (Array.isArray(props.suggestions)) suggestionsList = props.suggestions;
    else if (typeof props.suggestions === "string") {
      try {
        const parsed = JSON.parse(props.suggestions);
        if (Array.isArray(parsed)) suggestionsList = parsed;
      } catch {
        suggestionsList = props.suggestions.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
  }
  let activeSuggestionIndex = -1;
  let filteredSuggestions = [];
  function render() {
    const tags = getTags();
    const inputIdAttr = props.inputId ? `id="${props.inputId}"` : "";
    const isMaxReached = maxItems !== null && tags.length >= maxItems;
    container.className = "laughtale-inputtags p-inputtags";
    container.setAttribute("role", "listbox");
    container.setAttribute("aria-orientation", "horizontal");
    if (isFluid) container.classList.add("p-inputtags-fluid");
    if (isFilled) container.classList.add("variant-filled");
    if (props.size) container.classList.add(`size-${props.size}`);
    if (isInvalid) container.classList.add("is-invalid");
    if (isDisabled) container.classList.add("is-disabled");
    const xCircleIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`;
    let tagsHtml = tags.map((tag, idx) => `
            <span class="p-inputtags-tag" data-index="${idx}" tabindex="0" role="option" aria-selected="true">
                <span class="p-inputtags-tag-label">${escapeHtml(tag)}</span>
                ${!isDisabled && !isReadonly ? `
                    <button type="button" class="p-inputtags-tag-remove" data-index="${idx}" aria-label="Remove ${escapeHtml(tag)}" tabindex="-1">
                        ${xCircleIcon}
                    </button>
                ` : ""}
            </span>
        `).join("");
    let inputHtml = "";
    if (!isMaxReached) {
      inputHtml = `
                <input type="text"
                       class="p-inputtags-input"
                       ${inputIdAttr}
                       placeholder="${tags.length === 0 ? props.placeholder || "" : ""}"
                       ${isDisabled ? "disabled" : ""}
                       ${isReadonly ? "readonly" : ""}
                       autocomplete="off"
                       ${hasTypeahead ? 'role="combobox" aria-autocomplete="list" aria-expanded="false"' : ""} />
            `;
    }
    container.innerHTML = `
            ${tagsHtml}
            ${inputHtml}
            ${hasTypeahead ? `<div class="p-inputtags-panel" style="display: none;"></div>` : ""}
        `;
    useAutoAnimate(container, { duration: 180 });
    bindEvents();
  }
  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function addTag(val) {
    val = val.trim();
    if (!val) return;
    const current = getTags();
    if (maxItems !== null && current.length >= maxItems) return;
    if (!allowDuplicate && current.includes(val)) {
      const existingEl = container.querySelector(`.p-inputtags-tag[data-index="${current.indexOf(val)}"]`);
      if (existingEl) {
        existingEl.classList.add("is-focused");
        setTimeout(() => existingEl.classList.remove("is-focused"), 300);
      }
      return;
    }
    const newTags = [...current, val];
    setTags(newTags);
    render();
    const input = container.querySelector(".p-inputtags-input");
    input?.focus();
    container.dispatchEvent(new CustomEvent("tags:add", {
      bubbles: true,
      detail: { value: val, values: newTags }
    }));
  }
  function removeTag(index) {
    const current = getTags();
    if (index < 0 || index >= current.length) return;
    const removedVal = current[index];
    const newTags = current.filter((_, i) => i !== index);
    setTags(newTags);
    render();
    const input = container.querySelector(".p-inputtags-input");
    input?.focus();
    container.dispatchEvent(new CustomEvent("tags:remove", {
      bubbles: true,
      detail: { value: removedVal, index, values: newTags }
    }));
  }
  function bindEvents() {
    if (isDisabled || isReadonly) return;
    const input = container.querySelector(".p-inputtags-input");
    const panel = container.querySelector(".p-inputtags-panel");
    container.addEventListener("click", (e) => {
      if (e.target === container || e.target.classList.contains("p-inputtags")) {
        input?.focus();
      }
    });
    container.querySelectorAll(".p-inputtags-tag-remove").forEach((btn) => {
      btn.addEventListener("mousedown", (e) => e.preventDefault());
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = Number(btn.getAttribute("data-index"));
        removeTag(idx);
      });
    });
    container.querySelectorAll(".p-inputtags-tag").forEach((tagEl) => {
      tagEl.addEventListener("keydown", (e) => {
        const idx = Number(tagEl.getAttribute("data-index"));
        if (e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault();
          removeTag(idx);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          const prevTag = tagEl.previousElementSibling;
          if (prevTag && prevTag.classList.contains("p-inputtags-tag")) {
            prevTag.focus();
          }
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          const nextTag = tagEl.nextElementSibling;
          if (nextTag && nextTag.classList.contains("p-inputtags-tag")) {
            nextTag.focus();
          } else if (input) {
            input.focus();
          }
        }
      });
    });
    if (!input) return;
    input.addEventListener("keydown", (e) => {
      const val = input.value;
      const current = getTags();
      if (delimiter && e.key === delimiter) {
        e.preventDefault();
        if (val.trim()) {
          addTag(val);
          input.value = "";
        }
        closeTypeahead();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (hasTypeahead && activeSuggestionIndex >= 0 && filteredSuggestions[activeSuggestionIndex]) {
          addTag(filteredSuggestions[activeSuggestionIndex]);
          input.value = "";
          closeTypeahead();
        } else if (val.trim()) {
          addTag(val);
          input.value = "";
          closeTypeahead();
        }
      } else if (e.key === "Backspace" && !val && current.length > 0) {
        removeTag(current.length - 1);
      } else if (e.key === "ArrowLeft" && !val && current.length > 0) {
        const allTags = container.querySelectorAll(".p-inputtags-tag");
        if (allTags.length > 0) {
          allTags[allTags.length - 1].focus();
        }
      } else if (hasTypeahead && panel) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (filteredSuggestions.length > 0) {
            activeSuggestionIndex = (activeSuggestionIndex + 1) % filteredSuggestions.length;
            updateSuggestionHighlight();
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (filteredSuggestions.length > 0) {
            activeSuggestionIndex = (activeSuggestionIndex - 1 + filteredSuggestions.length) % filteredSuggestions.length;
            updateSuggestionHighlight();
          }
        } else if (e.key === "Escape") {
          closeTypeahead();
        } else if (e.key === "Tab" && activeSuggestionIndex >= 0 && filteredSuggestions[activeSuggestionIndex]) {
          addTag(filteredSuggestions[activeSuggestionIndex]);
          input.value = "";
          closeTypeahead();
        }
      }
    });
    input.addEventListener("paste", (e) => {
      if (!addOnPaste) return;
      const pasteData = e.clipboardData?.getData("text");
      if (pasteData && (pasteData.includes(",") || delimiter && pasteData.includes(delimiter))) {
        e.preventDefault();
        const splitRegex = new RegExp(`[\\s,${delimiter}]+`);
        const items = pasteData.split(splitRegex).map((s) => s.trim()).filter(Boolean);
        items.forEach((item) => addTag(item));
        input.value = "";
      }
    });
    if (hasTypeahead && panel) {
      input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();
        if (!query) {
          closeTypeahead();
          return;
        }
        const current = getTags();
        filteredSuggestions = suggestionsList.filter((s) => {
          const match = s.toLowerCase().includes(query);
          return allowDuplicate ? match : match && !current.includes(s);
        });
        if (filteredSuggestions.length > 0) {
          activeSuggestionIndex = 0;
          renderTypeaheadPanel();
        } else {
          closeTypeahead();
        }
      });
      document.addEventListener("click", (e) => {
        if (!container.contains(e.target)) {
          closeTypeahead();
        }
      });
    }
  }
  function renderTypeaheadPanel() {
    const panel = container.querySelector(".p-inputtags-panel");
    const input = container.querySelector(".p-inputtags-input");
    if (!panel) return;
    panel.style.display = "flex";
    input?.setAttribute("aria-expanded", "true");
    panel.innerHTML = filteredSuggestions.map((item, idx) => `
            <div class="p-inputtags-item ${idx === activeSuggestionIndex ? "is-highlighted" : ""}" data-index="${idx}">
                <span>${escapeHtml(item)}</span>
            </div>
        `).join("");
    panel.querySelectorAll(".p-inputtags-item").forEach((itemEl) => {
      itemEl.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = Number(itemEl.getAttribute("data-index"));
        if (filteredSuggestions[idx]) {
          addTag(filteredSuggestions[idx]);
          const input2 = container.querySelector(".p-inputtags-input");
          if (input2) input2.value = "";
          closeTypeahead();
        }
      });
    });
  }
  function updateSuggestionHighlight() {
    const panel = container.querySelector(".p-inputtags-panel");
    if (!panel) return;
    panel.querySelectorAll(".p-inputtags-item").forEach((el, idx) => {
      el.classList.toggle("is-highlighted", idx === activeSuggestionIndex);
      if (idx === activeSuggestionIndex) {
        el.scrollIntoView({ block: "nearest" });
      }
    });
  }
  function closeTypeahead() {
    const panel = container.querySelector(".p-inputtags-panel");
    const input = container.querySelector(".p-inputtags-input");
    if (panel) panel.style.display = "none";
    input?.setAttribute("aria-expanded", "false");
    activeSuggestionIndex = -1;
    filteredSuggestions = [];
  }
  function syncTargetInput(tags) {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = JSON.stringify(tags);
    }
    container.dispatchEvent(new CustomEvent("inputtags:change", {
      bubbles: true,
      detail: { values: tags }
    }));
    container.dispatchEvent(new CustomEvent("chips:change", {
      bubbles: true,
      detail: { values: tags }
    }));
  }
  render();
  syncTargetInput(getTags());
}
export {
  InputTagsIsland as default
};
//# sourceMappingURL=input-tags-GU52ORT6.js.map
