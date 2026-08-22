import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/float-label.ts
var CSS = `
.laughtale-float-label {
    position: relative;
    display: block;
}
.laughtale-float-label label {
    position: absolute;
    left: 0.75rem;
    color: var(--p-surface-500);
    font-size: 0.875rem;
    pointer-events: none;
    transition: all 0.2s ease;
    z-index: 1;
}

/* Variant: over */
.laughtale-float-label-over label {
    top: 50%;
    transform: translateY(-50%);
}
.laughtale-float-label-over:focus-within label,
.laughtale-float-label-over.has-value label {
    top: -0.5rem;
    transform: translateY(-100%);
    font-size: 0.75rem;
    color: var(--p-primary-500);
}

/* Variant: on */
.laughtale-float-label-on label {
    top: 50%;
    transform: translateY(-50%);
    background: var(--p-surface-0);
    padding: 0 0.25rem;
    margin-left: -0.25rem;
}
.laughtale-float-label-on:focus-within label,
.laughtale-float-label-on.has-value label {
    top: 0;
    transform: translateY(-50%);
    font-size: 0.75rem;
    color: var(--p-primary-500);
}

/* Variant: in */
.laughtale-float-label-in label {
    top: 50%;
    transform: translateY(-50%);
}
.laughtale-float-label-in:focus-within label,
.laughtale-float-label-in.has-value label {
    top: 0.25rem;
    transform: translateY(0);
    font-size: 0.65rem;
    color: var(--p-primary-500);
}
.laughtale-float-label-in input {
    padding-top: 1.25rem !important;
    padding-bottom: 0.25rem !important;
}

[data-theme="dark"] .laughtale-float-label-on label {
    background: var(--p-surface-900);
}
`;
function FloatLabelIsland(container, props) {
  injectIslandStyle("laughtale-float-label", CSS);
  const variant = props.variant || "over";
  const innerHtml = container.innerHTML;
  container.innerHTML = `
        <div class="laughtale-float-label laughtale-float-label-${variant}">
            ${innerHtml}
            <label>${props.label}</label>
        </div>
    `;
  const wrap = container.querySelector(".laughtale-float-label");
  const input = wrap.querySelector("input, textarea, select");
  if (input) {
    const updateState = () => {
      if (input.value && input.value.length > 0) {
        wrap.classList.add("has-value");
      } else {
        wrap.classList.remove("has-value");
      }
    };
    input.addEventListener("input", updateState);
    input.addEventListener("change", updateState);
    setTimeout(updateState, 0);
  }
}
export {
  FloatLabelIsland as default
};
//# sourceMappingURL=float-label-4O5ROYVR.js.map
