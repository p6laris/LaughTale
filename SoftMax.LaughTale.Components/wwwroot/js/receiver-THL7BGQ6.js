// Scripts/islands/receiver.ts
function EventReceiverIsland(container, props) {
  container.innerHTML = `
        <div class="p-6 bg-cyan-50 border border-cyan-200 rounded-2xl">
            <span class="text-xs font-bold text-cyan-800 uppercase tracking-wider block mb-2">Receiver Island (Listening on "${props.channelName}")</span>
            <div class="log-box p-3 bg-white border border-cyan-200 rounded-xl font-mono text-xs text-cyan-950 min-h-[60px] flex items-center justify-center text-center">
                ${props.initialMessage}
            </div>
            <div class="mt-2 text-[11px] text-cyan-700">
                Hydrates in Background via <code>HydrateStrategy.Idle</code>
            </div>
        </div>
    `;
  const logBox = container.querySelector(".log-box");
  window.addEventListener(`island:${props.channelName}`, (e) => {
    const detail = e.detail;
    logBox.innerHTML = `
            <div class="text-left w-full space-y-1">
                <div class="text-emerald-700 font-bold">\u26A1 Received Broadcast:</div>
                <div class="text-slate-700">${detail.message}</div>
                <div class="text-[10px] text-slate-400">Timestamp: ${detail.timestamp}</div>
            </div>
        `;
    logBox.classList.add("ring-2", "ring-cyan-400");
    setTimeout(() => logBox.classList.remove("ring-2", "ring-cyan-400"), 600);
  });
}
export {
  EventReceiverIsland as default
};
//# sourceMappingURL=receiver-THL7BGQ6.js.map
