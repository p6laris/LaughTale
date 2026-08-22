import {
  getSolarIcon
} from "./chunk-63S5ICA2.js";

// ../SoftMax.LaughTale.Client/src/components/chips.ts
function ChipsIsland(container, props) {
  let chips = props.values ? [...props.values] : [];
  function render() {
    const chipTags = chips.map((c, idx) => `
            <span class="chip-item" style="display: inline-flex; align-items: center; gap: 0.35rem; background: var(--p-surface-100); color: var(--p-surface-800); border: 1px solid var(--p-surface-200); padding: 0.2rem 0.5rem; border-radius: var(--p-border-radius); font-size: 0.8125rem; font-weight: 500;">
                <span>${c}</span>
                ${!props.disabled ? `
                    <button type="button" class="remove-chip-btn" data-index="${idx}" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; display: flex; align-items: center; padding: 0;">
                        ${getSolarIcon("close")}
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
    if (props.disabled) return;
    const input = container.querySelector(".chip-text-input");
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const val = input.value.trim().replace(/,$/, "");
        if (val && !chips.includes(val) && (!props.max || chips.length < props.max)) {
          chips.push(val);
          render();
          syncValue();
          const nextInput = container.querySelector(".chip-text-input");
          nextInput.focus();
        }
      } else if (e.key === "Backspace" && !input.value && chips.length > 0) {
        chips.pop();
        render();
        syncValue();
        const nextInput = container.querySelector(".chip-text-input");
        nextInput.focus();
      }
    });
    container.querySelectorAll(".remove-chip-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute("data-index"), 10);
        chips.splice(idx, 1);
        render();
        syncValue();
      });
    });
    container.querySelector(".laughtale-chips")?.addEventListener("click", () => {
      input.focus();
    });
  }
  function syncValue() {
    if (props.targetInputName) {
      let hidden = document.querySelector(`input[name="${props.targetInputName}"]`);
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = JSON.stringify(chips);
    }
    container.dispatchEvent(new CustomEvent("chips:change", {
      bubbles: true,
      detail: { values: chips }
    }));
  }
  render();
}
export {
  ChipsIsland as default
};
//# sourceMappingURL=chips-IQTRWYTU.js.map
