// Scripts/islands/broadcaster.ts
function EventBroadcasterIsland(container, props) {
  let clickCount = 0;
  container.innerHTML = `
        <div class="p-6 bg-purple-50 border border-purple-200 rounded-2xl text-center">
            <span class="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-2">Broadcaster Island</span>
            <button class="broadcast-btn px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition shadow-sm">
                ${props.buttonLabel}
            </button>
            <div class="mt-2 text-[11px] text-purple-600">
                Hydrates on Hover/Click via <code>HydrateStrategy.Interaction</code>
            </div>
        </div>
    `;
  container.querySelector(".broadcast-btn")?.addEventListener("click", () => {
    clickCount++;
    const message = `Ping #${clickCount} sent at ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`;
    window.dispatchEvent(new CustomEvent(`island:${props.channelName}`, {
      detail: { message, count: clickCount, timestamp: Date.now() },
      bubbles: true
    }));
  });
}
export {
  EventBroadcasterIsland as default
};
//# sourceMappingURL=broadcaster-S2ZXMF4A.js.map
