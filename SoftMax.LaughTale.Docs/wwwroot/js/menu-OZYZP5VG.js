import {
  LucideIcons
} from "./chunk-G3Y35IKD.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/menu.ts
function MenuIsland(container, props) {
  const items = props.items || [];
  const popup = props.popup || false;
  let isOpen = !popup;
  injectIslandStyle("menu", `
        .laughtale-menu {
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius);
            min-width: 12.5rem;
            padding: 0.5rem 0;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            font-family: var(--p-font-family, inherit);
        }
        [data-theme="dark"] .laughtale-menu {
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5);
        }
        .menu-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .menu-item {
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
        .menu-item:hover {
            background: var(--p-surface-100);
        }
        .menu-item.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }
        .menu-separator {
            height: 1px;
            background: var(--p-border-color);
            margin: 0.5rem 0;
        }
        
        .p-anchored-overlay-enter {
            opacity: 0;
            transform: scaleY(0.8);
        }
        .p-anchored-overlay-enter-active {
            opacity: 1;
            transform: scaleY(1);
            transition: opacity 150ms ease, transform 150ms ease;
            transform-origin: top;
        }
        .p-anchored-overlay-leave-active {
            opacity: 0;
            transition: opacity 150ms ease;
        }
    `);
  function renderMenu(menuItems) {
    return `
            <ul class="menu-list">
                ${menuItems.map((item) => {
      const isSeparator = item.separator || item.Separator;
      if (isSeparator) return `<li class="menu-separator"></li>`;
      const label = item.label || item.Label || item.title || item.Title || "";
      const url = item.url || item.Url || "#";
      const icon = item.icon || item.Icon || "";
      const disabled = item.disabled || item.Disabled;
      const iconSvg = icon && LucideIcons[icon] ? LucideIcons[icon] : icon.startsWith("<svg") ? icon : "";
      return `
                        <li>
                            <a class="menu-item ${disabled ? "disabled" : ""}" href="${url}" tabindex="0">
                                ${iconSvg ? `<span style="width: 16px; height: 16px; display: flex;">${iconSvg}</span>` : ""}
                                <span>${label}</span>
                            </a>
                        </li>
                    `;
    }).join("")}
            </ul>
        `;
  }
  function render() {
    if (!isOpen && popup) {
      container.innerHTML = `

`;
      return;
    }
    const menuHtml = `
            <div class="laughtale-menu ${popup ? "p-anchored-overlay-enter-active" : ""}" style="${popup ? "position: absolute; z-index: 1000;" : ""}">
                ${renderMenu(items)}
            </div>
        `;
    container.innerHTML = menuHtml;
    if (popup) {
      const menuEl = container.querySelector(".laughtale-menu");
      const trigger = document.getElementById(props.triggerId || "");
      if (trigger && menuEl) {
        const rect = trigger.getBoundingClientRect();
        menuEl.style.top = `${rect.bottom + window.scrollY + 4}px`;
        menuEl.style.left = `${rect.left + window.scrollX}px`;
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
  }
  if (popup && props.triggerId) {
    const trigger = document.getElementById(props.triggerId);
    trigger?.addEventListener("click", (e) => {
      e.preventDefault();
      isOpen = !isOpen;
      render();
    });
  }
  render();
}
export {
  MenuIsland as default
};
//# sourceMappingURL=menu-OZYZP5VG.js.map
