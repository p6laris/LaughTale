import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/toolbar.ts
var TOOLBAR_CSS = `
.p-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0.75rem 1rem;
    background: var(--p-surface-0, #ffffff);
    border: 1px solid var(--p-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 6px);
    gap: 0.5rem;
    box-sizing: border-box;
    width: 100%;
}

.p-toolbar-start,
.p-toolbar-center,
.p-toolbar-end,
.p-toolbar-group-start,
.p-toolbar-group-center,
.p-toolbar-group-end {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.p-toolbar-center,
.p-toolbar-group-center {
    justify-content: center;
    flex: 1 1 auto;
}

.p-toolbar-end,
.p-toolbar-group-end {
    margin-left: auto;
}

/* Dark Mode Tokens */
.dark .p-toolbar,
[data-theme="dark"] .p-toolbar {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
`;
function ToolbarIsland(container, props) {
  injectIslandStyle("toolbar", TOOLBAR_CSS);
  const rootEl = container.querySelector(".p-toolbar") || container;
  rootEl.classList.add("p-toolbar", "p-component");
  rootEl.setAttribute("role", "toolbar");
  rootEl.setAttribute("aria-orientation", "horizontal");
  if (props.ariaLabel) {
    rootEl.setAttribute("aria-label", props.ariaLabel);
  }
}
export {
  ToolbarIsland as default
};
//# sourceMappingURL=toolbar-C7I662XJ.js.map
