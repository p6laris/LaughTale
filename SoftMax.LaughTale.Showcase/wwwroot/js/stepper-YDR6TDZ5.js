import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/stepper.ts
var STEPPER_CSS = `
.p-stepper {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
}

.p-stepper-horizontal {
    flex-direction: column;
}

.p-steplist {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    padding: 0;
    list-style-type: none;
    position: relative;
    width: 100%;
}

.p-step {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
}

.p-step-header {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    background: transparent;
    border: none;
    cursor: pointer;
    text-decoration: none;
    border-radius: var(--p-border-radius-md, 6px);
    transition: background-color 0.15s ease, color 0.15s ease;
    outline: none;
    user-select: none;
}
.p-step-header:hover:not(:disabled) {
    background: var(--p-surface-100, #f1f5f9);
}
.p-step-header:focus-visible {
    outline: 2px solid var(--p-primary-500, #10b981);
    outline-offset: 2px;
}
.p-step-header:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.p-step-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    border: 2px solid var(--p-surface-300, #cbd5e1);
    background: var(--p-surface-0, #ffffff);
    color: var(--p-surface-700, #334155);
    font-weight: 700;
    font-size: 0.875rem;
    transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
}

.p-step-active .p-step-number {
    border-color: var(--p-primary-500, #10b981);
    color: var(--p-primary-500, #10b981);
    background: var(--p-surface-0, #ffffff);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.p-step-completed .p-step-number {
    background: var(--p-primary-500, #10b981);
    border-color: var(--p-primary-500, #10b981);
    color: #ffffff;
}

.p-step-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--p-surface-500, #64748b);
    transition: color 0.2s ease;
    white-space: nowrap;
}
.p-step-active .p-step-title {
    color: var(--p-text-color, #0f172a);
    font-weight: 700;
}
.p-step-completed .p-step-title {
    color: var(--p-text-color, #0f172a);
}

.p-stepper-separator {
    flex: 1 1 0;
    height: 2px;
    background: var(--p-surface-200, #e2e8f0);
    margin: 0 0.75rem;
    transition: background-color 0.25s ease;
    z-index: 1;
}
.p-stepper-separator.p-stepper-separator-active {
    background: var(--p-primary-500, #10b981);
}

/* Step Panels (Horizontal) */
.p-steppanels {
    margin-top: 1.5rem;
    width: 100%;
}

.p-steppanel {
    display: none;
    width: 100%;
}
.p-steppanel.p-steppanel-active {
    display: block;
    animation: p-steppanel-fadein 0.25s cubic-bezier(0.2, 0, 0, 1);
}

@keyframes p-steppanel-fadein {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Vertical Layout & Smooth Slide Animation */
.p-stepper-vertical {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.p-stepitem {
    display: flex;
    flex-direction: column;
    position: relative;
}

.p-stepitem:not(:last-child)::before {
    content: "";
    position: absolute;
    left: calc(1.625rem - 1px);
    top: 2.75rem;
    bottom: 0;
    width: 2px;
    background: var(--p-surface-200, #e2e8f0);
    transition: background-color 0.25s ease;
    z-index: 1;
}

.p-stepitem-completed:not(:last-child)::before {
    background: var(--p-primary-500, #10b981);
}

.p-stepitem > .p-step {
    z-index: 2;
}

.p-stepitem-content-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
    opacity: 0;
    margin-left: 3.25rem;
    position: relative;
    z-index: 2;
}

.p-stepitem-active > .p-stepitem-content-wrapper {
    grid-template-rows: 1fr;
    opacity: 1;
}

.p-stepitem-content-inner {
    overflow: hidden;
    min-height: 0;
}

.p-stepitem .p-steppanel {
    display: block;
    padding: 0.5rem 0 1.5rem 0;
}

/* Dark Mode Tokens */
.dark .p-step-header:hover:not(:disabled),
[data-theme="dark"] .p-step-header:hover:not(:disabled) {
    background: var(--p-surface-800, #1e293b) !important;
}

.dark .p-step-number,
[data-theme="dark"] .p-step-number {
    background: var(--p-surface-900, #0f172a) !important;
    border-color: var(--p-surface-700, #334155) !important;
    color: var(--p-surface-400, #94a3b8) !important;
}

.dark .p-step-active .p-step-number,
[data-theme="dark"] .p-step-active .p-step-number {
    border-color: var(--p-primary-400, #34d399) !important;
    color: var(--p-primary-400, #34d399) !important;
    background: var(--p-surface-900, #0f172a) !important;
    box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.15);
}

.dark .p-step-completed .p-step-number,
[data-theme="dark"] .p-step-completed .p-step-number {
    background: var(--p-primary-500, #10b981) !important;
    border-color: var(--p-primary-500, #10b981) !important;
    color: #ffffff !important;
}

.dark .p-step-active .p-step-title,
[data-theme="dark"] .p-step-active .p-step-title {
    color: var(--p-surface-0, #f8fafc) !important;
}

.dark .p-stepper-separator,
.dark .p-stepitem:not(:last-child)::before,
[data-theme="dark"] .p-stepper-separator,
[data-theme="dark"] .p-stepitem:not(:last-child)::before {
    background: var(--p-surface-700, #334155);
}
.dark .p-stepper-separator.p-stepper-separator-active,
.dark .p-stepitem-completed:not(:last-child)::before,
[data-theme="dark"] .p-stepper-separator.p-stepper-separator-active,
[data-theme="dark"] .p-stepitem-completed:not(:last-child)::before {
    background: var(--p-primary-500, #10b981) !important;
}
`;
function StepperIsland(container, props) {
  injectIslandStyle("stepper", STEPPER_CSS);
  const rootEl = container.querySelector(".p-stepper") || container;
  const isVertical = props.layout === "vertical" || rootEl.classList.contains("p-stepper-vertical") || rootEl.querySelector(".p-stepitem") !== null;
  const isLinear = !!props.linear || rootEl.hasAttribute("data-linear");
  rootEl.classList.add("p-stepper", "p-component", isVertical ? "p-stepper-vertical" : "p-stepper-horizontal");
  let activeValue = String(props.value || rootEl.getAttribute("data-value") || "1");
  const stepList = rootEl.querySelector(".p-steplist");
  const stepPanels = rootEl.querySelector(".p-steppanels");
  const stepItems = Array.from(rootEl.querySelectorAll(":scope > .p-stepitem, .p-stepitem"));
  function getSteps() {
    if (isVertical) {
      return stepItems.map((item) => item.querySelector(".p-step")).filter(Boolean);
    }
    return Array.from(stepList ? stepList.querySelectorAll(":scope > .p-step, .p-step") : []);
  }
  function getPanels() {
    if (isVertical) {
      return stepItems.map((item) => item.querySelector(".p-steppanel")).filter(Boolean);
    }
    return Array.from(stepPanels ? stepPanels.querySelectorAll(":scope > .p-steppanel, .p-steppanel") : []);
  }
  if (!isVertical && stepList) {
    const renderedSteps = Array.from(stepList.children).filter((c) => c.classList.contains("p-step"));
    for (let i = 0; i < renderedSteps.length - 1; i++) {
      if (!renderedSteps[i].nextElementSibling?.classList.contains("p-stepper-separator")) {
        const sep = document.createElement("li");
        sep.className = "p-stepper-separator";
        sep.setAttribute("aria-hidden", "true");
        renderedSteps[i].after(sep);
      }
    }
  }
  if (isVertical) {
    stepItems.forEach((item) => {
      const panel = item.querySelector(".p-steppanel");
      let wrapper = item.querySelector(".p-stepitem-content-wrapper");
      if (panel && !wrapper) {
        wrapper = document.createElement("div");
        wrapper.className = "p-stepitem-content-wrapper";
        const inner = document.createElement("div");
        inner.className = "p-stepitem-content-inner";
        panel.parentNode?.insertBefore(wrapper, panel);
        inner.appendChild(panel);
        wrapper.appendChild(inner);
      }
    });
  }
  function update() {
    const steps2 = getSteps();
    const panels = getPanels();
    const activeIdx = steps2.findIndex((s) => (s.getAttribute("data-value") || s.getAttribute("value")) === activeValue);
    const resolvedIdx = activeIdx >= 0 ? activeIdx : 0;
    steps2.forEach((step, idx) => {
      const isCompleted = idx < resolvedIdx;
      const isActive = idx === resolvedIdx;
      const isFuture = idx > resolvedIdx;
      step.classList.toggle("p-step-active", isActive);
      step.classList.toggle("p-step-completed", isCompleted);
      const btn = step.querySelector(".p-step-header");
      if (btn) {
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
        if (isLinear) {
          btn.disabled = isFuture;
        }
      }
      const separator = step.nextElementSibling;
      if (separator && separator.classList.contains("p-stepper-separator")) {
        separator.classList.toggle("p-stepper-separator-active", isCompleted);
      }
    });
    if (isVertical) {
      stepItems.forEach((item, idx) => {
        const isCompleted = idx < resolvedIdx;
        const isActive = idx === resolvedIdx;
        item.classList.toggle("p-stepitem-active", isActive);
        item.classList.toggle("p-stepitem-completed", isCompleted);
      });
    } else {
      panels.forEach((panel, idx) => {
        const panelVal = panel.getAttribute("data-value") || panel.getAttribute("value") || String(idx + 1);
        const isActive = panelVal === activeValue;
        panel.classList.toggle("p-steppanel-active", isActive);
      });
    }
    rootEl.setAttribute("data-value", activeValue);
  }
  function setActiveStep(value) {
    activeValue = value;
    update();
    container.dispatchEvent(new CustomEvent("stepper:change", {
      bubbles: true,
      detail: { value: activeValue }
    }));
  }
  const steps = getSteps();
  steps.forEach((step, idx) => {
    const stepVal = step.getAttribute("data-value") || step.getAttribute("value") || String(idx + 1);
    const header = step.querySelector(".p-step-header") || step;
    header.addEventListener("click", (e) => {
      e.preventDefault();
      const currentIdx = steps.findIndex((s) => (s.getAttribute("data-value") || s.getAttribute("value")) === activeValue);
      if (isLinear && idx > currentIdx) return;
      setActiveStep(stepVal);
    });
  });
  rootEl.addEventListener("click", (e) => {
    const target = e.target;
    const actionBtn = target.closest("[data-stepper-next], [data-stepper-prev], [data-stepper-action]");
    if (!actionBtn || !rootEl.contains(actionBtn)) return;
    const closestStepper = actionBtn.closest(".p-stepper");
    if (closestStepper !== rootEl) return;
    e.preventDefault();
    const nextVal = actionBtn.getAttribute("data-stepper-next");
    const prevVal = actionBtn.getAttribute("data-stepper-prev");
    const action = actionBtn.getAttribute("data-stepper-action");
    if (nextVal) {
      setActiveStep(nextVal);
    } else if (prevVal) {
      setActiveStep(prevVal);
    } else if (action === "next") {
      const currentSteps = getSteps();
      const currentIdx = currentSteps.findIndex((s) => (s.getAttribute("data-value") || s.getAttribute("value")) === activeValue);
      if (currentIdx >= 0 && currentIdx < currentSteps.length - 1) {
        const nextStepVal = currentSteps[currentIdx + 1].getAttribute("data-value") || currentSteps[currentIdx + 1].getAttribute("value") || String(currentIdx + 2);
        setActiveStep(nextStepVal);
      }
    } else if (action === "prev") {
      const currentSteps = getSteps();
      const currentIdx = currentSteps.findIndex((s) => (s.getAttribute("data-value") || s.getAttribute("value")) === activeValue);
      if (currentIdx > 0) {
        const prevStepVal = currentSteps[currentIdx - 1].getAttribute("data-value") || currentSteps[currentIdx - 1].getAttribute("value") || String(currentIdx);
        setActiveStep(prevStepVal);
      }
    }
  });
  update();
}
export {
  StepperIsland as default
};
//# sourceMappingURL=stepper-YDR6TDZ5.js.map
