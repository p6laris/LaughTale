// Scripts/islands/receiver.ts
function EventReceiverIsland(container, props) {
  container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-600);">Event Bus Listener (${props.channelName})</span>
                <span class="aura-tag tag-cyan">Hydrate: Idle</span>
            </div>

            <div class="log-box" style="padding: 0.75rem 1rem; background: var(--p-surface-50); border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); font-family: var(--p-font-mono); font-size: 0.75rem; color: var(--p-surface-600); min-height: 48px; display: flex; align-items: center;">
                ${props.initialMessage}
            </div>
        </div>
    `;
  const logBox = container.querySelector(".log-box");
  window.addEventListener(`island:${props.channelName}`, (e) => {
    const detail = e.detail;
    logBox.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                <span style="color: var(--p-primary-700); font-weight: 600;">\u26A1 ${detail.message}</span>
                <span style="color: var(--p-surface-400); font-size: 0.6875rem;">${detail.timestamp}</span>
            </div>
        `;
    logBox.style.borderColor = "var(--p-primary-500)";
    setTimeout(() => {
      logBox.style.borderColor = "var(--p-border-color)";
    }, 500);
  });
}
export {
  EventReceiverIsland as default
};
//# sourceMappingURL=receiver-CDILBIW3.js.map
