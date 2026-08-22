// ../SoftMax.LaughTale.Client/src/components/tabs.ts
function TabsIsland(container, props) {
  const tabs = props.tabs || [];
  let activeIndex = props.activeIndex || 0;
  function render() {
    const headerButtons = tabs.map((tab, idx) => {
      const isActive = idx === activeIndex;
      return `
                <button type="button" 
                        class="tab-header-btn ${isActive ? "tab-active" : ""}" 
                        data-idx="${idx}" 
                        ${tab.disabled ? "disabled" : ""} 
                        style="position: relative; padding: 0.75rem 1.25rem; border: none; background: transparent; color: ${isActive ? "var(--p-primary-600)" : "var(--p-surface-600)"}; font-weight: ${isActive ? "700" : "500"}; font-size: 0.875rem; cursor: ${tab.disabled ? "not-allowed" : "pointer"}; transition: color 0.15s ease; display: inline-flex; align-items: center; gap: 0.5rem; border-bottom: 2px solid ${isActive ? "var(--p-primary-600)" : "transparent"};">
                    ${tab.icon ? `<span>${tab.icon}</span>` : ""}
                    <span>${tab.header}</span>
                </button>
            `;
    }).join("");
    container.innerHTML = `
            <div class="laughtale-tabs" style="width: 100%;">
                <!-- Tab Headers Bar -->
                <div class="tabs-header-bar" style="display: flex; border-bottom: 1px solid var(--p-border-color); gap: 0.25rem; overflow-x: auto; position: relative;">
                    ${headerButtons}
                </div>

                <!-- Active Tab Content Panel -->
                <div class="tab-panel-body" style="padding: 1.25rem 0; font-size: 0.875rem; color: var(--p-surface-700); line-height: 1.6; transition: opacity 0.2s ease;">
                    <div class="tab-slot-content">${tabs[activeIndex]?.content || ""}</div>
                </div>
            </div>
        `;
    const externalSlot = container.querySelector(`[data-slot="tab-${activeIndex}"]`);
    const targetContainer = container.querySelector(".tab-slot-content");
    if (externalSlot && targetContainer) {
      targetContainer.innerHTML = "";
      targetContainer.appendChild(externalSlot);
    }
    container.querySelectorAll(".tab-header-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-idx"));
        activeIndex = idx;
        render();
        if (props.targetInputName) {
          let hidden = container.querySelector(`input[name="${props.targetInputName}"]`);
          if (!hidden) {
            hidden = document.createElement("input");
            hidden.type = "hidden";
            hidden.name = props.targetInputName;
            container.appendChild(hidden);
          }
          hidden.value = String(activeIndex);
        }
        container.dispatchEvent(new CustomEvent("tabs:change", {
          bubbles: true,
          detail: { activeIndex }
        }));
      });
    });
  }
  render();
}
export {
  TabsIsland as default
};
//# sourceMappingURL=tabs-JDB5FBFK.js.map
