import {
  LucideIcons
} from "./chunk-QV6AVE4Z.js";

// ../SoftMax.LaughTale.Client/src/components/accordion.ts
function AccordionIsland(container, props) {
  const tabs = props.tabs || [];
  let activeIndices = /* @__PURE__ */ new Set();
  if (Array.isArray(props.activeIndex)) {
    props.activeIndex.forEach((i) => activeIndices.add(i));
  } else if (typeof props.activeIndex === "number") {
    activeIndices.add(props.activeIndex);
  } else {
    activeIndices.add(0);
  }
  function render() {
    const tabHtml = tabs.map((tab, idx) => {
      const isOpen = activeIndices.has(idx);
      return `
                <div class="accordion-tab ${isOpen ? "tab-open" : ""}" data-idx="${idx}" style="border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); margin-bottom: 0.5rem; background: var(--p-surface-0); overflow: hidden;">
                    <button type="button" 
                            class="accordion-header-btn" 
                            data-idx="${idx}" 
                            ${tab.disabled ? "disabled" : ""} 
                            style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 1.25rem; border: none; background: ${isOpen ? "var(--p-surface-50)" : "var(--p-surface-0)"}; color: var(--p-surface-900); font-weight: 600; font-size: 0.875rem; cursor: ${tab.disabled ? "not-allowed" : "pointer"}; text-align: left; transition: background 0.15s ease;">
                        <span style="display: flex; align-items: center; gap: 0.5rem;">
                            ${tab.icon ? `<span>${tab.icon}</span>` : ""}
                            <span>${tab.header}</span>
                        </span>
                        <span class="chevron-icon" style="color: var(--p-surface-500); display: flex; align-items: center; transition: transform 0.2s ease; transform: rotate(${isOpen ? "180deg" : "0deg"});">
                            ${LucideIcons.chevronDown}
                        </span>
                    </button>
                    <div class="accordion-content" style="display: ${isOpen ? "block" : "none"}; padding: 1.25rem; border-top: 1px solid var(--p-border-color); font-size: 0.875rem; color: var(--p-surface-600); line-height: 1.6; animation: fadeIn 0.2s ease;">
                        <div class="tab-slot" data-slot-index="${idx}">${tab.content || ""}</div>
                    </div>
                </div>
            `;
    }).join("");
    container.innerHTML = `
            <div class="laughtale-accordion" style="width: 100%;">
                ${tabHtml}
            </div>
        `;
    tabs.forEach((_, idx) => {
      const externalSlot = container.querySelector(`[data-slot="tab-${idx}"]`);
      const targetContainer = container.querySelector(`[data-slot-index="${idx}"]`);
      if (externalSlot && targetContainer) {
        targetContainer.innerHTML = "";
        targetContainer.appendChild(externalSlot);
      }
    });
    container.querySelectorAll(".accordion-header-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        if (activeIndices.has(idx)) {
          activeIndices.delete(idx);
        } else {
          if (!props.multiple) activeIndices.clear();
          activeIndices.add(idx);
        }
        render();
        container.dispatchEvent(new CustomEvent("accordion:change", {
          bubbles: true,
          detail: { activeIndex: Array.from(activeIndices) }
        }));
      });
    });
  }
  render();
}
export {
  AccordionIsland as default
};
//# sourceMappingURL=accordion-NFF7NFU6.js.map
