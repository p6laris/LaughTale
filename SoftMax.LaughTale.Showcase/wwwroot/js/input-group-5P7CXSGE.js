import {
  getLucideIcon
} from "./chunk-C4P5FSS5.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/input-group.ts
var CSS = `
.laughtale-inputgroup,
.p-inputgroup {
    display: flex;
    align-items: stretch;
    width: 100%;
    height: 2.5rem;
    min-height: 2.5rem;
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    position: relative;
}

/* FloatLabel over spacing on inputgroup */
.laughtale-inputgroup:has(.laughtale-float-label-over),
.p-inputgroup:has(.laughtale-float-label-over) {
    margin-top: 1rem;
}

/* All direct children and island root elements inside inputgroup */
.laughtale-inputgroup > *,
.p-inputgroup > * {
    border-radius: 0 !important;
    margin: 0 0 0 -1px !important;
    box-sizing: border-box;
    height: 100% !important;
    min-height: 100% !important;
    display: flex;
    align-items: stretch;
    flex-shrink: 0;
}

/* Flexible inputs / float labels fill remaining width */
.laughtale-inputgroup > input,
.laughtale-inputgroup > .p-input,
.laughtale-inputgroup > [data-island="float-label"],
.laughtale-inputgroup > [data-island="ifta-label"],
.laughtale-inputgroup > [data-island="select"],
.laughtale-inputgroup > [data-island="datepicker"],
.laughtale-inputgroup > [data-island="autocomplete"],
.laughtale-inputgroup > [data-island="cascadeselect"],
.p-inputgroup > input,
.p-inputgroup > .p-input,
.p-inputgroup > [data-island="float-label"],
.p-inputgroup > [data-island="ifta-label"],
.p-inputgroup > [data-island="select"],
.p-inputgroup > [data-island="datepicker"],
.p-inputgroup > [data-island="autocomplete"],
.p-inputgroup > [data-island="cascadeselect"] {
    flex: 1 1 auto;
    width: 1%;
}

/* First child outer corners */
.laughtale-inputgroup > *:first-child,
.p-inputgroup > *:first-child {
    margin-left: 0 !important;
    border-top-left-radius: var(--p-border-radius) !important;
    border-bottom-left-radius: var(--p-border-radius) !important;
}

/* Last child outer corners */
.laughtale-inputgroup > *:last-child,
.p-inputgroup > *:last-child {
    border-top-right-radius: var(--p-border-radius) !important;
    border-bottom-right-radius: var(--p-border-radius) !important;
}

/* Only child */
.laughtale-inputgroup > *:only-child,
.p-inputgroup > *:only-child {
    border-radius: var(--p-border-radius) !important;
}

/* Inner inputs, triggers, select boxes, and buttons corner & height overrides */
.laughtale-inputgroup input,
.laughtale-inputgroup textarea,
.laughtale-inputgroup .p-input,
.laughtale-inputgroup .cs-trigger,
.laughtale-inputgroup .dp-trigger,
.laughtale-inputgroup .laughtale-select,
.laughtale-inputgroup .laughtale-select-trigger,
.laughtale-inputgroup .p-button,
.p-inputgroup input,
.p-inputgroup textarea,
.p-inputgroup .p-input,
.p-inputgroup .cs-trigger,
.p-inputgroup .dp-trigger,
.p-inputgroup .laughtale-select,
.p-inputgroup .laughtale-select-trigger,
.p-inputgroup .p-button {
    border-radius: 0 !important;
    height: 100% !important;
    min-height: 100% !important;
    box-sizing: border-box;
    margin: 0 !important;
}

.laughtale-inputgroup > *:first-child input,
.laughtale-inputgroup > *:first-child textarea,
.laughtale-inputgroup > *:first-child .p-input,
.laughtale-inputgroup > *:first-child .cs-trigger,
.laughtale-inputgroup > *:first-child .dp-trigger,
.laughtale-inputgroup > *:first-child .laughtale-select-trigger,
.laughtale-inputgroup > *:first-child.p-button,
.p-inputgroup > *:first-child input,
.p-inputgroup > *:first-child textarea,
.p-inputgroup > *:first-child .p-input,
.p-inputgroup > *:first-child .cs-trigger,
.p-inputgroup > *:first-child .dp-trigger,
.p-inputgroup > *:first-child .laughtale-select-trigger,
.p-inputgroup > *:first-child.p-button {
    border-top-left-radius: var(--p-border-radius) !important;
    border-bottom-left-radius: var(--p-border-radius) !important;
}

.laughtale-inputgroup > *:last-child input,
.laughtale-inputgroup > *:last-child textarea,
.laughtale-inputgroup > *:last-child .p-input,
.laughtale-inputgroup > *:last-child .cs-trigger,
.laughtale-inputgroup > *:last-child .dp-trigger,
.laughtale-inputgroup > *:last-child .laughtale-select-trigger,
.laughtale-inputgroup > *:last-child.p-button,
.p-inputgroup > *:last-child input,
.p-inputgroup > *:last-child textarea,
.p-inputgroup > *:last-child .p-input,
.p-inputgroup > *:last-child .cs-trigger,
.p-inputgroup > *:last-child .dp-trigger,
.p-inputgroup > *:last-child .laughtale-select-trigger,
.p-inputgroup > *:last-child.p-button {
    border-top-right-radius: var(--p-border-radius) !important;
    border-bottom-right-radius: var(--p-border-radius) !important;
}

/* Addon Styling */
.laughtale-inputgroup-addon,
.p-inputgroup-addon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.85rem;
    background: var(--p-surface-50);
    color: var(--p-text-muted);
    border: 1px solid var(--p-border-color);
    font-size: 0.875rem;
    font-weight: 500;
    min-width: 2.75rem;
    height: 100% !important;
    min-height: 100% !important;
    user-select: none;
    white-space: nowrap;
    box-sizing: border-box;
    gap: 0.4rem;
    flex-shrink: 0;
}
.laughtale-inputgroup-addon svg,
.p-inputgroup-addon svg {
    display: block;
    width: 16px;
    height: 16px;
    color: var(--p-text-muted);
    flex-shrink: 0;
}

/* Buttons inside InputGroup */
.laughtale-inputgroup .p-button,
.p-inputgroup .p-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    border: 1px solid var(--p-border-color);
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease, border-color 150ms ease;
    flex-shrink: 0;
    height: 100% !important;
    min-height: 100% !important;
}

/* Primary Contrast button */
.laughtale-inputgroup .p-button-primary,
.p-inputgroup .p-button-primary {
    background: var(--p-surface-950);
    color: var(--p-surface-0);
    border-color: var(--p-surface-950);
}
.laughtale-inputgroup .p-button-primary:hover,
.p-inputgroup .p-button-primary:hover {
    background: var(--p-surface-800);
    border-color: var(--p-surface-800);
}

/* Secondary Button */
.laughtale-inputgroup .p-button-secondary,
.p-inputgroup .p-button-secondary {
    background: var(--p-surface-0);
    color: var(--p-text-muted);
    border-color: var(--p-border-color);
}
.laughtale-inputgroup .p-button-secondary:hover,
.p-inputgroup .p-button-secondary:hover {
    background: var(--p-surface-100);
    color: var(--p-text-color);
}

/* FloatLabel & IftaLabel inside InputGroup */
.laughtale-inputgroup .laughtale-float-label,
.p-inputgroup .laughtale-float-label {
    flex: 1 1 auto;
    width: 100%;
    margin: 0 !important;
    height: 100% !important;
    min-height: 100% !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.laughtale-inputgroup .laughtale-ifta-label,
.p-inputgroup .laughtale-ifta-label {
    flex: 1 1 auto;
    width: 100%;
    margin: 0 !important;
    height: 100% !important;
    min-height: 100% !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* Elevation on focus so the active border-color sits on top */
.laughtale-inputgroup > *:focus-within,
.p-inputgroup > *:focus-within,
.laughtale-inputgroup > *:hover,
.p-inputgroup > *:hover {
    z-index: 2;
}

/* Dark Mode Tokens */
.dark .laughtale-inputgroup-addon,
.dark .p-inputgroup-addon {
    background: var(--p-surface-800);
    border-color: var(--p-surface-700);
    color: var(--p-surface-300);
}
.dark .laughtale-inputgroup-addon svg,
.dark .p-inputgroup-addon svg {
    color: var(--p-surface-400);
}
.dark .laughtale-inputgroup .p-button-primary,
.dark .p-inputgroup .p-button-primary {
    background: var(--p-surface-0);
    color: var(--p-surface-950);
    border-color: var(--p-surface-0);
}
.dark .laughtale-inputgroup .p-button-secondary,
.dark .p-inputgroup .p-button-secondary {
    background: var(--p-surface-900);
    border-color: var(--p-surface-700);
    color: var(--p-surface-300);
}
`;
function InputGroupIsland(container, props) {
  injectIslandStyle("laughtale-inputgroup", CSS);
  container.classList.add("laughtale-inputgroup", "p-inputgroup");
  if (props.size) {
    container.classList.add(`size-${props.size}`);
  }
}
function InputGroupAddonIsland(container, props) {
  injectIslandStyle("laughtale-inputgroup", CSS);
  container.classList.add("laughtale-inputgroup-addon", "p-inputgroup-addon");
  if (props.icon && !container.querySelector("svg")) {
    const svg = getLucideIcon(props.icon);
    if (svg) {
      container.insertAdjacentHTML("afterbegin", svg);
    }
  }
  if (props.text && !container.querySelector("span") && !container.textContent?.trim()) {
    container.insertAdjacentHTML("beforeend", `<span>${props.text}</span>`);
  }
}
export {
  InputGroupAddonIsland,
  InputGroupIsland as default
};
//# sourceMappingURL=input-group-5P7CXSGE.js.map
