import {
  useControllableState
} from "./chunk-3ZMZT2PZ.js";
import {
  useAutoAnimate
} from "./chunk-P6OQD35U.js";
import {
  LucideIcons
} from "./chunk-VVK7E2HU.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/chips.ts
var CSS = `
[data-theme="dark"] .chip-item {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .remove-chip-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-chips {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .chip-text-input {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function ChipsIsland(container, props) {
  injectIslandStyle("chips", CSS);
  const [getChips, setChips] = useControllableState({
    defaultValue: props.values ? [...props.values] : [],
    onChange: (val) => {
      syncValue(val);
    }
  });
  function render() {
    const chips = getChips();
    const chipTags = chips.map((c, idx) => `
            <span class="chip-item" data-val="${c}" style="display: inline-flex; align-items: center; gap: 0.35rem; background: var(--p-surface-100); color: var(--p-surface-800); border: 1px solid var(--p-surface-200); padding: 0.2rem 0.5rem; border-radius: var(--p-border-radius); font-size: 0.8125rem; font-weight: 500; transition: all 0.15s ease;">
                <span>${c}</span>
                ${!props.disabled ? `
                    <button type="button" class="remove-chip-btn" data-index="${idx}" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; display: flex; align-items: center; padding: 0;">
                        ${LucideIcons.x}
                    </button>
                ` : ""}
            </span>
        `).join("");
    container.innerHTML = `
            <div class="laughtale-chips" style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem; padding: 0.35rem 0.5rem; border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); background: var(--p-surface-0); min-height: 2.5rem; max-width: 400px; cursor: text;">
                ${chipTags}
                <input type="text" class="chip-text-input" placeholder="${chips.length === 0 ? props.placeholder || "Add tag..." : ""}" ${props.disabled ? "disabled" : ""} style="flex: 1; min-width: 80px; border: none; outline: none; background: transparent; font-size: 0.8125rem; color: var(--p-text-color); padding: 0.25rem 0;" />
            </div>
        `;
    const wrapper = container.querySelector(".laughtale-chips");
    useAutoAnimate(wrapper, { duration: 200 });
    if (props.disabled) return;
    const input = container.querySelector(".chip-text-input");
    input.addEventListener("keydown", (e) => {
      const current = getChips();
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const val = input.value.trim().replace(/,$/, "");
        if (val && !current.includes(val) && (!props.max || current.length < props.max)) {
          setChips([...current, val]);
          render();
          const nextInput = container.querySelector(".chip-text-input");
          nextInput.focus();
        }
      } else if (e.key === "Backspace" && !input.value && current.length > 0) {
        setChips(current.slice(0, -1));
        render();
        const nextInput = container.querySelector(".chip-text-input");
        nextInput.focus();
      }
    });
    container.querySelectorAll(".remove-chip-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = Number(btn.getAttribute("data-index"));
        const current = getChips();
        setChips(current.filter((_, i) => i !== idx));
        render();
      });
    });
    wrapper.addEventListener("click", () => input.focus());
  }
  function syncValue(current) {
    if (props.targetInputName) {
      let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = JSON.stringify(current);
    }
    container.dispatchEvent(new CustomEvent("chips:change", {
      bubbles: true,
      detail: { values: current }
    }));
  }
  render();
  syncValue(getChips());
}
export {
  ChipsIsland as default
};
//# sourceMappingURL=chips-AMMNZYTN.js.map
