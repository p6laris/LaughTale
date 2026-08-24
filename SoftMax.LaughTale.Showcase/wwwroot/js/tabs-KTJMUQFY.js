import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/tabs.ts
var TABS_CSS = `
.laughtale-tabs {
    width: 100%;
}

.tabs-header-bar {
    display: flex;
    border-bottom: 1px solid var(--p-border-color);
    gap: 0.5rem;
    overflow-x: auto;
    position: relative;
}

.tab-header-btn {
    position: relative;
    padding: 0.75rem 1.25rem;
    border: none;
    background: transparent;
    color: var(--p-text-muted);
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: color 0.2s ease, border-color 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 2px solid transparent;
    outline: none;
    user-select: none;
}

.tab-header-btn:hover:not(:disabled) {
    color: var(--p-text-color);
}

.tab-header-btn.tab-active {
    color: var(--p-primary-600);
    font-weight: 700;
    border-bottom-color: var(--p-primary-600);
}

.tab-header-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.tab-panel-body {
    padding: 1.25rem 0;
    font-size: 0.875rem;
    color: var(--p-text-color);
    line-height: 1.6;
}

.dark .tab-header-btn.tab-active,
[data-theme="dark"] .tab-header-btn.tab-active {
    color: var(--p-primary-500);
    border-bottom-color: var(--p-primary-500);
}
`;
function TabsIsland(container, props) {
  injectIslandStyle("tabs", TABS_CSS);
  const tabs = props.tabs || [];
  let activeIndex = props.activeIndex || 0;
  const initialSlots = {};
  container.querySelectorAll("[data-slot]").forEach((el) => {
    const slotKey = el.getAttribute("data-slot") || "";
    if (slotKey) {
      initialSlots[slotKey] = el.cloneNode(true);
    }
  });
  function render() {
    const headerButtons = tabs.map((tab, idx) => {
      const isActive = idx === activeIndex;
      const headerText = tab.header || tab.Header || tab.title || tab.Title || tab.label || tab.Label || `Tab ${idx + 1}`;
      const iconText = tab.icon || tab.Icon || "";
      return `
                <button type="button" 
                        class="tab-header-btn ${isActive ? "tab-active" : ""}" 
                        data-idx="${idx}" 
                        ${tab.disabled ? 'disabled aria-disabled="true"' : ""}
                        role="tab"
                        aria-selected="${isActive}">
                    ${iconText ? `<span>${iconText}</span>` : ""}
                    <span>${headerText}</span>
                </button>
            `;
    }).join("");
    const activeContent = tabs[activeIndex]?.content || tabs[activeIndex]?.Content || "";
    container.innerHTML = `
            <div class="laughtale-tabs">
                <div class="tabs-header-bar" role="tablist">
                    ${headerButtons}
                </div>
                <div class="tab-panel-body" role="tabpanel">
                    <div class="tab-slot-content">${activeContent}</div>
                </div>
            </div>
        `;
    const slotEl = initialSlots[`tab-${activeIndex}`];
    const targetContainer = container.querySelector(".tab-slot-content");
    if (slotEl && targetContainer) {
      targetContainer.innerHTML = "";
      targetContainer.appendChild(slotEl.cloneNode(true));
    }
    container.querySelectorAll(".tab-header-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const idx = Number(btn.getAttribute("data-idx"));
        if (tabs[idx]?.disabled) return;
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
          detail: { activeIndex, tab: tabs[activeIndex] }
        }));
      });
    });
  }
  render();
}
export {
  TabsIsland as default
};
//# sourceMappingURL=tabs-KTJMUQFY.js.map
