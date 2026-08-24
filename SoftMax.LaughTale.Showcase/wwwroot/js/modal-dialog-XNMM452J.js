import {
  getSlot
} from "./chunk-UP7LLYSA.js";
import "./chunk-J7IJRT66.js";
import "./chunk-P6OQD35U.js";
import "./chunk-ZFSVXRXK.js";
import "./chunk-Y4YSQNFD.js";
import "./chunk-I7ZAYNYP.js";
import "./chunk-RBI7CHCL.js";
import "./chunk-IOCYPXM4.js";
import "./chunk-5EJRX4PB.js";
import "./chunk-3ZMZT2PZ.js";
import "./chunk-RQ5UXIGU.js";
import "./chunk-T4EPW24S.js";
import "./chunk-KEONGXN5.js";
import "./chunk-XHF3KYSF.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// Scripts/islands/modal-dialog.ts
function ModalDialogIsland(container, props) {
  injectIslandStyle("modal-dialog", `
        .aura-dialog-mask {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.45);
            backdrop-filter: blur(4px);
            z-index: 1100;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
        }
        .aura-dialog {
            background: var(--p-surface-0);
            border: 1px solid var(--p-border-color);
            border-radius: var(--p-border-radius-xl);
            box-shadow: var(--p-shadow-lg);
            max-width: 32rem;
            width: 100%;
            overflow: hidden;
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

            <div class="aura-dialog-mask modal-overlay" style="display: none;">
                <div class="aura-dialog">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--p-border-color);">
                        <h3 style="font-size: 1rem; font-weight: 700; color: var(--p-surface-950);">${props.dialogTitle}</h3>
                        <button type="button" class="modal-close-btn" style="background: none; border: none; font-size: 1.125rem; color: var(--p-surface-400); cursor: pointer; padding: 0.25rem;">\u2715</button>
                    </div>

                    <!-- Projected C# Server Slot Content -->
                    <div class="modal-body" style="padding: 1.5rem;">
                        ${slotHtml}
                    </div>

                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem; padding: 1rem 1.5rem; background: var(--p-surface-50); border-top: 1px solid var(--p-border-color);">
                        <button type="button" class="p-button p-button-secondary p-button-sm modal-cancel-btn">Dismiss</button>
                        <button type="button" class="p-button p-button-primary p-button-sm modal-confirm-btn">Acknowledge</button>
                    </div>
                </div>
            </div>
        </div>
    `;
  const openBtn = container.querySelector(".modal-open-btn");
  const overlay = container.querySelector(".modal-overlay");
  const closeBtns = container.querySelectorAll(".modal-close-btn, .modal-cancel-btn, .modal-confirm-btn");
  const open = () => {
    overlay.style.display = "flex";
  };
  const close = () => {
    overlay.style.display = "none";
  };
  openBtn.addEventListener("click", open);
  closeBtns.forEach((btn) => btn.addEventListener("click", close));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.style.display === "flex") close();
  });
}
export {
  ModalDialogIsland as default
};
//# sourceMappingURL=modal-dialog-XNMM452J.js.map
