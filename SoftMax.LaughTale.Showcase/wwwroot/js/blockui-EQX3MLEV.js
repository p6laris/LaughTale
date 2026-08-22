// ../SoftMax.LaughTale.Client/src/components/blockui.ts
function BlockUIIsland(container, props) {
  let isBlocked = props.blocked ?? true;
  function render() {
    container.innerHTML = `
            <div class="laughtale-blockui-root" style="position: relative; width: 100%;">
                <!-- Blocked Glass Overlay -->
                <div class="blockui-mask" style="display: ${isBlocked ? "flex" : "none"}; position: absolute; inset: 0; z-index: 100; background: rgba(255, 255, 255, 0.65); backdrop-filter: blur(3px); align-items: center; justify-content: center; border-radius: inherit;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; background: var(--p-surface-0); border: 1px solid var(--p-border-color); padding: 1rem 1.5rem; border-radius: var(--p-border-radius-lg); box-shadow: var(--p-shadow-md);">
                        <svg class="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--p-primary-600); animation: spin 0.8s linear infinite;">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        <span style="font-size: 0.8125rem; font-weight: 600; color: var(--p-surface-700);">${props.message || "Processing transaction..."}</span>
                    </div>
                </div>
            </div>
        `;
  }
  render();
  container.addEventListener("blockui:toggle", () => {
    isBlocked = !isBlocked;
    render();
  });
}
export {
  BlockUIIsland as default
};
//# sourceMappingURL=blockui-EQX3MLEV.js.map
