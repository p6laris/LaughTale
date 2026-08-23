import {
  getLucideIcon
} from "./chunk-W3Q4G23D.js";
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
    font-family: var(--p-font-family, inherit);
    box-sizing: border-box;
    position: relative;
}

/* All direct children and island root elements inside inputgroup */
.laughtale-inputgroup > *,
.p-inputgroup > * {
    border-radius: 0 !important;
    margin-left: -1px;
    box-sizing: border-box;
    min-height: 2.5rem;
}

/* First child outer corners */
.laughtale-inputgroup > *:first-child,
.p-inputgroup > *:first-child {
    margin-left: 0;
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

/* Inner inputs, triggers, select boxes, and buttons corner overrides */
.laughtale-inputgroup input,
.laughtale-inputgroup textarea,
.laughtale-inputgroup .p-input,
.laughtale-inputgroup .cs-trigger,
.laughtale-inputgroup .dp-trigger,
.laughtale-inputgroup .laughtale-select-trigger,
.laughtale-inputgroup .p-button,
.p-inputgroup input,
.p-inputgroup textarea,
.p-inputgroup .p-input,
.p-inputgroup .cs-trigger,
.p-inputgroup .dp-trigger,
.p-inputgroup .laughtale-select-trigger,
.p-inputgroup .p-button {
    border-radius: 0 !important;
    height: 100%;
    box-sizing: border-box;
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
}

/* Primary Dark / Contrast button (matches PrimeVue Aura 'Search' button) */
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

/* Select inside InputGroup */
.laughtale-inputgroup .laughtale-select,
.p-inputgroup .laughtale-select {
    height: 100%;
}
.laughtale-inputgroup .laughtale-select-trigger,
.p-inputgroup .laughtale-select-trigger {
    height: 100%;
    min-height: 2.5rem;
    border-color: var(--p-border-color);
}

/* FloatLabel & IftaLabel inside InputGroup */
.laughtale-inputgroup .laughtale-float-label,
.p-inputgroup .laughtale-float-label {
    flex: 1;
    margin-top: 0;
    min-height: 2.5rem;
    display: flex;
    justify-content: center;
}
.laughtale-inputgroup .laughtale-ifta-label,
.p-inputgroup .laughtale-ifta-label {
    flex: 1;
    min-height: 3rem;
    display: flex;
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
//# sourceMappingURL=input-group-VVCAO7GD.js.map
