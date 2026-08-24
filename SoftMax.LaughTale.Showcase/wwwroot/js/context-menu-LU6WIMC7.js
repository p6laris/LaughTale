import {
  LucideIcons
} from "./chunk-XHF3KYSF.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/context-menu.ts
function ContextMenuIsland(container, props) {
  const items = props.items || [];
  const targetSelector = props.targetSelector || "body";
  const global = props.global || false;
  let isOpen = false;
  let x = 0;
  let y = 0;
  injectIslandStyle("context-menu", `
        .laughtale-context-menu {
            position: fixed;
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            min-width: 12.5rem;
            padding: 0.5rem 0;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            font-family: var(--p-font-family, inherit);
            z-index: 1000;
        }
        [data-theme="dark"] .laughtale-context-menu {
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5);
        }
        .context-menu-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .context-menu-item {
            display: flex;
            align-items: center;
            padding: 0.5rem 1rem;
            color: var(--p-text-color);
            text-decoration: none;
            cursor: pointer;
            transition: background 150ms ease, color 150ms ease;
            gap: 0.5rem;
            font-size: 0.875rem;
        }
        .context-menu-item:hover {
            background: var(--p-surface-100);
        }
        .context-menu-item.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }
        .context-menu-separator {
            height: 1px;
            background: var(--p-border-color);
            margin: 0.5rem 0;
        }
        .p-anchored-overlay-enter-active {
            opacity: 1;
            transition: opacity 150ms ease;
        }
    `);
  function renderMenu(menuItems) {
    return `
            <ul class="context-menu-list">
                ${menuItems.map((item) => {
      if (item.separator) return '<li class="context-menu-separator"></li>';
      const iconSvg = item.icon && LucideIcons[item.icon] ? LucideIcons[item.icon] : "";
      return `
                        <li>
                            <a class="context-menu-item ${item.disabled ? "disabled" : ""}" href="${item.url || "#"}" tabindex="0">
                                ${iconSvg ? `<span style="width: 16px; height: 16px; display: flex;">${iconSvg}</span>` : ""}
                                <span>${item.label}</span>
                            </a>
                        </li>
                    `;
    }).join("")}
            </ul>
        `;
  }
  function render() {
    if (!isOpen) {
      container.innerHTML = `

`;
      return;
    }
    container.innerHTML = `
            <div class="laughtale-context-menu p-anchored-overlay-enter-active" style="top: ${y}px; left: ${x}px;">
                ${renderMenu(items)}
            </div>
        `;
    const closeHandler = (e) => {
      isOpen = false;
      render();
      document.removeEventListener("click", closeHandler);
    };
    setTimeout(() => document.addEventListener("click", closeHandler), 0);
  }
  const targetNodes = global ? [document.body] : document.querySelectorAll(targetSelector);
  targetNodes.forEach((node) => {
    node.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const mouseEvent = e;
      x = mouseEvent.clientX;
      y = mouseEvent.clientY;
      isOpen = true;
      render();
    });
  });
}
export {
  ContextMenuIsland as default
};
//# sourceMappingURL=context-menu-LU6WIMC7.js.map
