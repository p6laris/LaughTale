import {
  getSlot
} from "./chunk-UP7LLYSA.js";
import "./chunk-J7IJRT66.js";
import "./chunk-P6OQD35U.js";
import "./chunk-ZFSVXRXK.js";
import "./chunk-Y4YSQNFD.js";
import "./chunk-I7ZAYNYP.js";
import {
  useFocusTrap
} from "./chunk-RBI7CHCL.js";
import "./chunk-IOCYPXM4.js";
import "./chunk-5EJRX4PB.js";
import "./chunk-3ZMZT2PZ.js";
import "./chunk-RQ5UXIGU.js";
import "./chunk-T4EPW24S.js";
import {
  useDisclosure
} from "./chunk-KEONGXN5.js";
import "./chunk-XHF3KYSF.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/modal.ts
function ModalDialogIsland(container, props) {
  injectIslandStyle("modal-dialog", `
        .aura-dialog-mask {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.45);
            backdrop-filter: blur(6px);
            z-index: 1100;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .aura-dialog-mask.modal-open {
            opacity: 1;
            pointer-events: auto;
        }
        .aura-dialog {
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius-xl);
            box-shadow: var(--p-shadow-lg);
            max-width: 32rem;
            width: 100%;
            overflow: hidden;
            transform: scale(0.95) translateY(8px);
            transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .aura-dialog-mask.modal-open .aura-dialog {
            transform: scale(1) translateY(0);
        }
    `);
  const slotEl = getSlot(container);
  const slotHtml = slotEl ? slotEl.innerHTML : '<p style="color: var(--p-text-muted); font-size: 0.875rem;">No slot content provided.</p>';
  container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-600);">Server Slot Projection</span>
                <span class="aura-tag tag-purple">Hydrate: Interaction</span>
            </div>

            <div>
                <button type="button" class="p-button p-button-primary modal-open-btn">
                    <span>\u{1F510}</span>
                    ${props.triggerButtonText}
                </button>
            </div>

            <div class="aura-dialog-mask modal-overlay">
                <div class="aura-dialog">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--p-border-color);">
                        <h3 style="font-size: 1rem; font-weight: 700; color: var(--p-surface-950);">${props.dialogTitle}</h3>
                        <button type="button" class="modal-close-btn" style="background: none; border: none; font-size: 1.125rem; color: var(--p-surface-400); cursor: pointer; padding: 0.25rem;">\u2715</button>
                    </div>

                    <!-- Projected C# Server Slot Content -->
                    <div class="modal-body" style="padding: 1.5rem;">
                        ${slotHtml}
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 0.5rem; padding: 1rem 1.5rem; border-top: 1px solid var(--p-border-color); background: var(--p-surface-50);">
                        <button type="button" class="p-button p-button-secondary modal-cancel-btn">Cancel</button>
                        <button type="button" class="p-button p-button-primary modal-confirm-btn">Confirm Operation</button>
                    </div>
                </div>
            </div>
        </div>
    
  [data-theme="dark"] .dummy-dark {}
`;
  const openBtn = container.querySelector(".modal-open-btn");
  const overlay = container.querySelector(".modal-overlay");
  const dialog = container.querySelector(".aura-dialog");
  const closeBtn = container.querySelector(".modal-close-btn");
  const cancelBtn = container.querySelector(".modal-cancel-btn");
  const confirmBtn = container.querySelector(".modal-confirm-btn");
  const focusTrap = useFocusTrap(dialog);
  const disclosure = useDisclosure({
    defaultIsOpen: false,
    onOpen: () => {
      overlay.classList.add("modal-open");
      focusTrap.activate();
    },
    onClose: () => {
      overlay.classList.remove("modal-open");
      focusTrap.deactivate();
    }
  });
  openBtn.addEventListener("click", () => disclosure.open());
  closeBtn.addEventListener("click", () => disclosure.close());
  cancelBtn.addEventListener("click", () => disclosure.close());
  confirmBtn.addEventListener("click", () => {
    container.dispatchEvent(new CustomEvent("modal:confirmed", { bubbles: true }));
    disclosure.close();
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) disclosure.close();
  });
}
export {
  ModalDialogIsland as default
};
//# sourceMappingURL=modal-HUYSQUKF.js.map
