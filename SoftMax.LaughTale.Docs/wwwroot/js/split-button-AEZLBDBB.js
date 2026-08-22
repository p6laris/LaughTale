import {
  useClickOutside
} from "./chunk-T4EPW24S.js";
import {
  useDisclosure
} from "./chunk-KEONGXN5.js";
import {
  LucideIcons
} from "./chunk-QV6AVE4Z.js";

// ../SoftMax.LaughTale.Client/src/components/split-button.ts
function SplitButtonIsland(container, props) {
  const label = props.label || "Save";
  const items = props.model || [
    { label: "Update & Sync", icon: "refresh-cw", action: "update" },
    { label: "Export as Encrypted JSON", icon: "download", action: "export" },
    { label: "Delete Record", icon: "trash", action: "delete" }
  ];
  const disclosure = useDisclosure({ defaultIsOpen: false });
  container.innerHTML = `
        <div class="laughtale-splitbutton" style="position: relative; display: inline-flex; border-radius: var(--p-border-radius); overflow: visible; font-family: var(--p-font-family, inherit);">
            <!-- Primary Action Button -->
            <button type="button" class="splitbutton-main-btn p-button p-button-primary" style="border-top-right-radius: 0; border-bottom-right-radius: 0; border-right: 1px solid rgba(255,255,255,0.2);">
                ${label}
            </button>

            <!-- Dropdown Menu Trigger Button -->
            <button type="button" class="splitbutton-menu-btn p-button p-button-primary" style="border-top-left-radius: 0; border-bottom-left-radius: 0; padding: 0.5rem 0.5rem; justify-content: center;">
                <span class="splitbutton-chevron" style="display: flex;">${LucideIcons.chevronDown}</span>
            </button>

            <!-- Popover Menu -->
            <div class="splitbutton-menu-overlay" style="display: none; position: absolute; top: calc(100% + 4px); right: 0; z-index: 500; background: var(--p-surface-0); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-lg); min-width: 180px; padding: 0.25rem 0;">
                ${items.map((it) => `
                    <div class="splitbutton-menu-item" data-action="${it.action || ""}" data-url="${it.url || ""}" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.875rem; cursor: pointer; font-size: 0.8125rem; color: var(--p-text-color); transition: background 0.1s ease;">
                        <span>${it.label}</span>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
  const mainBtn = container.querySelector(".splitbutton-main-btn");
  const menuBtn = container.querySelector(".splitbutton-menu-btn");
  const overlay = container.querySelector(".splitbutton-menu-overlay");
  useClickOutside(container, () => close());
  function open() {
    disclosure.open();
    overlay.style.display = "block";
  }
  function close() {
    disclosure.close();
    overlay.style.display = "none";
  }
  mainBtn.addEventListener("click", () => {
    container.dispatchEvent(new CustomEvent("splitbutton:click", {
      bubbles: true,
      detail: { action: "main" }
    }));
  });
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (disclosure.isOpen) close();
    else open();
  });
  overlay.querySelectorAll(".splitbutton-menu-item").forEach((item) => {
    item.addEventListener("click", () => {
      const action = item.getAttribute("data-action");
      const url = item.getAttribute("data-url");
      if (url) window.location.href = url;
      else {
        container.dispatchEvent(new CustomEvent("splitbutton:item-click", {
          bubbles: true,
          detail: { action }
        }));
      }
      close();
    });
  });
}
export {
  SplitButtonIsland as default
};
//# sourceMappingURL=split-button-AEZLBDBB.js.map
