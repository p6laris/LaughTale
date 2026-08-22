// Scripts/islands/broadcaster.ts
function EventBroadcasterIsland(container, props) {
  let clickCount = 0;
  container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-600);">Event Bus Emitter</span>
                <span class="aura-tag tag-purple">Hydrate: Interaction</span>
            </div>

            <button type="button" class="p-button p-button-secondary broadcast-btn" style="justify-content: flex-start;">
                <span>\u{1F4E1}</span>
                ${props.buttonLabel}
            </button>
        </div>
    `;
  container.querySelector(".broadcast-btn")?.addEventListener("click", () => {
    clickCount++;
    const message = `Telemetry pulse #${clickCount} dispatched`;
    window.dispatchEvent(new CustomEvent(`island:${props.channelName}`, {
      detail: { message, count: clickCount, timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString() },
      bubbles: true
    }));
  });
}
export {
  EventBroadcasterIsland as default
};
//# sourceMappingURL=broadcaster-RCRIXWRP.js.map
