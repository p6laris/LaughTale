import {
  LucideIcons
} from "./chunk-BWRILNJC.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/checkbox.ts
var CSS = `
.laughtale-checkbox-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
}
.laughtale-checkbox-wrap.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.laughtale-checkbox-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border: 1px solid var(--p-field-border, var(--p-surface-300));
    border-radius: calc(var(--p-border-radius, 0.5rem) - 0.25rem);
    background: var(--p-surface-0);
    transition: all 0.15s ease;
    color: white;
}
.laughtale-checkbox-wrap:hover:not(.is-disabled) .laughtale-checkbox-box {
    border-color: var(--p-primary-400);
}
.laughtale-checkbox-wrap:focus-within:not(.is-disabled) .laughtale-checkbox-box {
    box-shadow: 0 0 0 2px var(--p-content-bg), 0 0 0 4px var(--p-primary-500);
    border-color: var(--p-primary-500);
}
.laughtale-checkbox-wrap.is-checked .laughtale-checkbox-box,
.laughtale-checkbox-wrap.is-indeterminate .laughtale-checkbox-box {
    background: var(--p-primary-500);
    border-color: var(--p-primary-500);
}
.laughtale-checkbox-icon {
    transform: scale(0);
    transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.laughtale-checkbox-wrap.is-checked .laughtale-checkbox-icon,
.laughtale-checkbox-wrap.is-indeterminate .laughtale-checkbox-icon {
    transform: scale(1);
}
.laughtale-checkbox-label {
    font-size: 0.875rem;
    color: var(--p-text-color);
}
.laughtale-checkbox-hidden {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
}
[data-theme="dark"] .laughtale-checkbox-box {
    background: var(--p-surface-900);
    border-color: var(--p-surface-600);
}
[data-theme="dark"] .laughtale-checkbox-label {
    color: var(--p-surface-200);
}
[data-theme="dark"] .laughtale-checkbox-wrap:hover:not(.is-disabled) .laughtale-checkbox-box {
    border-color: var(--p-primary-400);
}
`;
function CheckboxIsland(container, props) {
  injectIslandStyle("laughtale-checkbox", CSS);
  let isChecked = Boolean(props.checked);
  let isIndeterminate = Boolean(props.indeterminate);
  function render() {
    const icon = isIndeterminate ? LucideIcons.minus : LucideIcons.check;
    const stateClass = isIndeterminate ? "is-indeterminate" : isChecked ? "is-checked" : "";
    container.innerHTML = `
            <label class="laughtale-checkbox-wrap ${stateClass} ${props.disabled ? "is-disabled" : ""}">
                <input type="checkbox" class="laughtale-checkbox-hidden" 
                    ${isChecked ? "checked" : ""} 
                    ${props.disabled ? "disabled" : ""} />
                <div class="laughtale-checkbox-box">
                    <span class="laughtale-checkbox-icon" style="display:flex; width:14px; height:14px;">
                        ${icon}
                    </span>
                </div>
                ${props.label ? '<span class="laughtale-checkbox-label">' + props.label + "</span>" : ""}
            </label>
        `;
    bindEvents();
    syncValue();
  }
  function bindEvents() {
    const input = container.querySelector(".laughtale-checkbox-hidden");
    if (!props.disabled) {
      input.addEventListener("change", (e) => {
        isChecked = input.checked;
        isIndeterminate = false;
        render();
      });
    }
  }
  function syncValue() {
    if (props.targetInputName) {
      let hidden = container.querySelector('input[name="' + props.targetInputName + '"]');
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        container.appendChild(hidden);
      }
      hidden.value = isChecked ? props.value || "true" : "false";
    }
  }
  render();
}
export {
  CheckboxIsland as default
};
//# sourceMappingURL=checkbox-GCDXRZG4.js.map
