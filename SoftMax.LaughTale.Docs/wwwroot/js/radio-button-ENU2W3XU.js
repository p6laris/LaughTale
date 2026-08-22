import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/radio-button.ts
var CSS = `
.laughtale-radio-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
}
.laughtale-radio-wrap.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.laughtale-radio-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border: 1px solid var(--p-field-border, var(--p-surface-300));
    border-radius: 50%;
    background: var(--p-surface-0);
    transition: all 0.15s ease;
}
.laughtale-radio-wrap:hover:not(.is-disabled) .laughtale-radio-circle {
    border-color: var(--p-primary-400);
}
.laughtale-radio-wrap:focus-within:not(.is-disabled) .laughtale-radio-circle {
    box-shadow: 0 0 0 2px var(--p-content-bg), 0 0 0 4px var(--p-primary-500);
    border-color: var(--p-primary-500);
}
.laughtale-radio-wrap.is-checked .laughtale-radio-circle {
    border-color: var(--p-primary-500);
}
.laughtale-radio-dot {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background: var(--p-primary-500);
    transform: scale(0);
    transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.laughtale-radio-wrap.is-checked .laughtale-radio-dot {
    transform: scale(1);
}
.laughtale-radio-label {
    font-size: 0.875rem;
    color: var(--p-text-color);
}
.laughtale-radio-hidden {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
}
[data-theme="dark"] .laughtale-radio-circle {
    background: var(--p-surface-900);
    border-color: var(--p-surface-600);
}
[data-theme="dark"] .laughtale-radio-label {
    color: var(--p-surface-200);
}
`;
function RadioButtonIsland(container, props) {
  injectIslandStyle("laughtale-radio", CSS);
  let isChecked = Boolean(props.checked);
  function render() {
    container.innerHTML = `
            <label class="laughtale-radio-wrap ${isChecked ? "is-checked" : ""} ${props.disabled ? "is-disabled" : ""}">
                <input type="radio" class="laughtale-radio-hidden" 
                    name="${props.name}"
                    value="${props.value}"
                    ${isChecked ? "checked" : ""} 
                    ${props.disabled ? "disabled" : ""} />
                <div class="laughtale-radio-circle">
                    <div class="laughtale-radio-dot"></div>
                </div>
                ${props.label ? '<span class="laughtale-radio-label">' + props.label + "</span>" : ""}
            </label>
        `;
    bindEvents();
    syncValue();
  }
  function bindEvents() {
    const input = container.querySelector(".laughtale-radio-hidden");
    if (!props.disabled) {
      input.addEventListener("change", (e) => {
        isChecked = input.checked;
        render();
        document.querySelectorAll('input[type="radio"][name="' + props.name + '"]').forEach((el) => {
          if (el !== input) {
            el.dispatchEvent(new Event("change", { bubbles: true }));
          }
        });
      });
      container.addEventListener("change", (e) => {
        if (e.target !== input) {
          isChecked = input.checked;
          render();
        }
      });
    }
  }
  function syncValue() {
    if (props.targetInputName && isChecked) {
      let hidden = document.querySelector('input[name="' + props.targetInputName + '"]');
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = props.targetInputName;
        document.body.appendChild(hidden);
      }
      hidden.value = props.value;
    }
  }
  render();
}
export {
  RadioButtonIsland as default
};
//# sourceMappingURL=radio-button-ENU2W3XU.js.map
