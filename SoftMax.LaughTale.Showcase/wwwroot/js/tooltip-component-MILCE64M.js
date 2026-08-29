import {
  initGlobalTooltipDelegation
} from "./chunk-KFXEAQSZ.js";
import "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/tooltip-component.ts
function TooltipIsland(container, props) {
  initGlobalTooltipDelegation();
  const targetSelector = props.target;
  const tooltipText = props.value || props.text || container.textContent?.trim();
  if (targetSelector && tooltipText) {
    const targetEl = document.querySelector(targetSelector);
    if (targetEl) {
      targetEl.setAttribute("p-tooltip", tooltipText);
      if (props.position) targetEl.setAttribute("p-tooltip-position", props.position);
      if (props.showDelay !== void 0) targetEl.setAttribute("p-tooltip-show-delay", props.showDelay.toString());
      if (props.hideDelay !== void 0) targetEl.setAttribute("p-tooltip-hide-delay", props.hideDelay.toString());
      if (props.event) targetEl.setAttribute("p-tooltip-event", props.event);
      if (props.autoHide !== void 0) targetEl.setAttribute("p-tooltip-auto-hide", props.autoHide.toString());
      if (props.escape !== void 0) targetEl.setAttribute("p-tooltip-escape", props.escape.toString());
    }
  }
}
export {
  TooltipIsland as default
};
//# sourceMappingURL=tooltip-component-MILCE64M.js.map
