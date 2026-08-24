import {
  useFocusTrap
} from "./chunk-RBI7CHCL.js";
import {
  useDisclosure
} from "./chunk-KEONGXN5.js";
import {
  LucideIcons
} from "./chunk-XHF3KYSF.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/drawer.ts
var CSS = `
[data-theme="dark"] .laughtale-drawer-wrapper {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .drawer-open-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .drawer-backdrop {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .drawer-panel {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .drawer-close-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .drawer-body {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .drawer-slot-container {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function DrawerIsland(container, props) {
  injectIslandStyle("drawer", CSS);
  const position = props.position || "right";
  const width = props.width || "380px";
  function render() {
    container.innerHTML = `
            <div class="laughtale-drawer-wrapper">
                ${props.triggerText ? `
                    <button type="button" class="p-button p-button-secondary drawer-open-btn">
                        ${props.triggerText}
                    </button>
                ` : ""}

                <!-- Backdrop -->
                <div class="drawer-backdrop" style="display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.45); backdrop-filter: blur(4px); z-index: 1000; opacity: 0; transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);"></div>

                <!-- Drawer Panel -->
                <div class="drawer-panel" style="display: flex; flex-direction: column; position: fixed; ${position}: 0; top: 0; bottom: 0; width: ${width}; max-width: 90vw; background: var(--p-surface-0); border-${position === "right" ? "left" : "right"}: 1px solid var(--p-border-color); box-shadow: var(--p-shadow-lg); z-index: 1001; transform: translateX(${position === "right" ? "100%" : "-100%"}); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: none;">
                    
                    <!-- Header -->
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem; border-bottom: 1px solid var(--p-border-color);">
                        <div style="font-size: 1.125rem; font-weight: 700; color: var(--p-surface-900);">
                            ${props.title || "Panel"}
                        </div>
                        <button type="button" class="drawer-close-btn" style="border: none; background: transparent; color: var(--p-surface-400); cursor: pointer; display: flex; align-items: center; padding: 0.25rem;">
                            ${LucideIcons.x}
                        </button>
                    </div>

                    <!-- Projected Body Slot -->
                    <div class="drawer-body" style="flex: 1; overflow-y: auto; padding: 1.25rem;">
                        <div class="drawer-slot-container"></div>
                    </div>
                </div>
            </div>
        `;
    const backdrop = container.querySelector(".drawer-backdrop");
    const panel = container.querySelector(".drawer-panel");
    const openBtn = container.querySelector(".drawer-open-btn");
    const closeBtn = container.querySelector(".drawer-close-btn");
    const focusTrap = useFocusTrap(panel);
    const disclosure = useDisclosure({
      defaultIsOpen: false,
      onOpen: () => {
        backdrop.style.display = "block";
        setTimeout(() => {
          backdrop.style.opacity = "1";
          panel.style.transform = "translateX(0)";
          panel.style.pointerEvents = "auto";
        }, 10);
        focusTrap.activate();
      },
      onClose: () => {
        backdrop.style.opacity = "0";
        panel.style.transform = `translateX(${position === "right" ? "100%" : "-100%"})`;
        panel.style.pointerEvents = "none";
        setTimeout(() => {
          backdrop.style.display = "none";
        }, 300);
        focusTrap.deactivate();
      }
    });
    openBtn?.addEventListener("click", () => disclosure.open());
    closeBtn?.addEventListener("click", () => disclosure.close());
    backdrop?.addEventListener("click", () => disclosure.close());
  }
  render();
}
export {
  DrawerIsland as default
};
//# sourceMappingURL=drawer-IT2PLXIN.js.map
