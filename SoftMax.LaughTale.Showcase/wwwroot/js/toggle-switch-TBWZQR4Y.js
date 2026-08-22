import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/toggle-switch.ts
var CSS = `
[data-theme="dark"] .laughtale-toggle-switch {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function ToggleSwitchIsland(container, props) {
  injectIslandStyle("toggle-switch", CSS);
  let isChecked = Boolean(props.checked);
  function render() {
    container.innerHTML = `
            <label class="laughtale-switch" style="display: inline-flex; align-items: center; gap: 0.75rem; cursor: ${props.disabled ? "not-allowed" : "pointer"}; user-select: none; opacity: ${props.disabled ? "0.6" : "1"};">
                <div class="switch-track" style="position: relative; width: 2.75rem; height: 1.5rem; border-radius: 9999px; background: ${isChecked ? "var(--p-primary-600)" : "var(--p-surface-300)"}; transition: background-color 0.2s ease;">
                    <div class="switch-thumb" style="position: absolute; top: 2px; left: ${isChecked ? "1.35rem" : "2px"}; width: 1.25rem; height: 1.25rem; border-radius: 50%; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.25); transition: left 0.2s cubic-bezier(0.16, 1, 0.3, 1);"></div>
                </div>
                ${props.label ? `<span style="font-size: 0.875rem; font-weight: 500; color: var(--p-text-color);">${props.label}</span>` : ""}
            </label>
        `;
    if (!props.disabled) {
      container.querySelector(".laughtale-switch")?.addEventListener("click", (e) => {
        e.preventDefault();
        isChecked = !isChecked;
        render();
        syncValue();
      });
    }
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
      hidden.value = isChecked ? "true" : "false";
    }
    container.dispatchEvent(new CustomEvent("switch:change", {
      bubbles: true,
      detail: { checked: isChecked }
    }));
  }
  render();
  syncValue();
}
export {
  ToggleSwitchIsland as default
};
//# sourceMappingURL=toggle-switch-TBWZQR4Y.js.map
