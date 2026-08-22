import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/popover.ts
function PopoverIsland(container, props) {
  let isOpen = false;
  const placement = props.placement || "bottom";
  const showArrow = props.showArrow !== false;
  const contentHtml = container.innerHTML;
  injectIslandStyle("popover", `
        .laughtale-popover {
            position: absolute;
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            padding: 1rem;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
            font-family: var(--p-font-family, inherit);
            color: var(--p-text-color);
            z-index: 1000;
            opacity: 0;
            transform: scaleY(0.9);
            transition: opacity 150ms ease, transform 150ms ease;
            transform-origin: top center;
        }
        [data-theme="dark"] .laughtale-popover {
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);
        }
        .laughtale-popover.open {
            opacity: 1;
            transform: scaleY(1);
        }
        .popover-arrow {
            position: absolute;
            width: 8px;
            height: 8px;
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            transform: rotate(45deg);
        }
        .popover-arrow.bottom { top: -5px; left: calc(50% - 4px); border-bottom: none; border-right: none; }
        .popover-arrow.top { bottom: -5px; left: calc(50% - 4px); border-top: none; border-left: none; }
    `);
  function render() {
    if (!isOpen) {
      container.innerHTML = `

`;
      return;
    }
    container.innerHTML = `
<div class="laughtale-popover open">
                ' + showArrow ? \`<div class="popover-arrow \${placement + '"></div>' : ''}
                <div class="popover-content">
                    \${contentHtml}
                </div>
            </div>
`;
    const popover = container.querySelector(".laughtale-popover");
    const trigger = document.getElementById(props.triggerId);
    if (trigger && popover) {
      const rect = trigger.getBoundingClientRect();
      if (placement === "bottom") {
        popover.style.top = `${rect.bottom + window.scrollY + 8}px`;
        popover.style.left = `${rect.left + window.scrollX}px`;
      } else if (placement === "top") {
        popover.style.bottom = `${window.innerHeight - rect.top + 8}px`;
        popover.style.left = `${rect.left + window.scrollX}px`;
      }
      const closeHandler = (e) => {
        if (!container.contains(e.target) && !trigger.contains(e.target)) {
          isOpen = false;
          render();
          document.removeEventListener("click", closeHandler);
        }
      };
      setTimeout(() => document.addEventListener("click", closeHandler), 0);
    }
  }
  if (props.triggerId) {
    const trigger = document.getElementById(props.triggerId);
    trigger?.addEventListener("click", () => {
      isOpen = !isOpen;
      render();
    });
  }
  container.innerHTML = `

`;
}
export {
  PopoverIsland as default
};
//# sourceMappingURL=popover-WX66D4GV.js.map
