import {
  getSlot,
  injectIslandStyle
} from "./chunk-UX4GO4Y6.js";

// Scripts/islands/modal-dialog.ts
function ModalDialogIsland(container, props) {
  injectIslandStyle("modal-dialog", `
        .island-modal-backdrop {
            background-color: rgba(15, 23, 42, 0.65);
            backdrop-filter: blur(4px);
        }
    `);
  const slotEl = getSlot(container);
  const slotHtml = slotEl ? slotEl.innerHTML : '<p class="text-xs text-slate-400">No slot content provided.</p>';
  container.innerHTML = `
        <div class="inline-block">
            <button class="modal-open-btn px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition shadow-md flex items-center gap-2">
                <span>\u{1F4AC}</span>
                ${props.triggerButtonText}
            </button>

            <div class="modal-overlay hidden fixed inset-0 z-50 island-modal-backdrop flex items-center justify-center p-4">
                <div class="modal-card bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 transform transition-all scale-95 opacity-0">
                    <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                        <h3 class="text-lg font-bold text-slate-950">${props.dialogTitle}</h3>
                        <button class="modal-close-btn p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-lg">\u2715</button>
                    </div>

                    <!-- Projected C# Server Slot Content -->
                    <div class="modal-body py-6 space-y-4 text-sm text-slate-700">
                        ${slotHtml}
                    </div>

                    <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button class="modal-cancel-btn px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition">Cancel</button>
                        <button class="modal-confirm-btn px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition">Got it!</button>
                    </div>
                </div>
            </div>
        </div>
    `;
  const openBtn = container.querySelector(".modal-open-btn");
  const overlay = container.querySelector(".modal-overlay");
  const card = container.querySelector(".modal-card");
  const closeBtns = container.querySelectorAll(".modal-close-btn, .modal-cancel-btn, .modal-confirm-btn");
  const open = () => {
    overlay.classList.remove("hidden");
    setTimeout(() => {
      card.classList.remove("scale-95", "opacity-0");
      card.classList.add("scale-100", "opacity-100");
    }, 10);
  };
  const close = () => {
    card.classList.add("scale-95", "opacity-0");
    card.classList.remove("scale-100", "opacity-100");
    setTimeout(() => overlay.classList.add("hidden"), 200);
  };
  openBtn.addEventListener("click", open);
  closeBtns.forEach((btn) => btn.addEventListener("click", close));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.classList.contains("hidden")) close();
  });
}
export {
  ModalDialogIsland as default
};
//# sourceMappingURL=modal-dialog-CU7HMUZJ.js.map
