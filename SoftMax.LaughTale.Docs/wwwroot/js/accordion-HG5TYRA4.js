import {
  useTransition
} from "./chunk-IOCYPXM4.js";
import {
  useDisclosure
} from "./chunk-KEONGXN5.js";
import {
  LucideIcons
} from "./chunk-G3Y35IKD.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/accordion.ts
var CSS = `
[data-theme="dark"] .accordion-tab {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .accordion-header-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .accordion-content {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .tab-slot {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
[data-theme="dark"] .laughtale-accordion {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function AccordionIsland(container, props) {
  injectIslandStyle("accordion", CSS);
  const tabs = props.tabs || [];
  let activeIndices = /* @__PURE__ */ new Set();
  if (Array.isArray(props.activeIndex)) {
    props.activeIndex.forEach((i) => activeIndices.add(i));
  } else if (typeof props.activeIndex === "number") {
    activeIndices.add(props.activeIndex);
  } else {
    activeIndices.add(0);
  }
  const disclosures = {};
  tabs.forEach((_, idx) => {
    disclosures[idx] = useDisclosure({
      defaultIsOpen: activeIndices.has(idx)
    });
  });
  function render() {
    const tabHtml = tabs.map((tab, idx) => {
      const isOpen = disclosures[idx]?.isOpen ?? false;
      const headerText = tab.header || tab.Header || tab.title || tab.Title || tab.label || tab.Label || `Tab ${idx + 1}`;
      const contentText = tab.content || tab.Content || "";
      const iconText = tab.icon || tab.Icon || "";
      return `
                <div class="accordion-tab ${isOpen ? "tab-open" : ""}" data-idx="${idx}" style="border: 1px solid var(--p-border-color); border-radius: var(--p-border-radius); margin-bottom: 0.5rem; background: var(--p-surface-0); overflow: hidden;">
                    <button type="button" 
                            class="accordion-header-btn" 
                            data-idx="${idx}" 
                            ${tab.disabled ? "disabled" : ""} 
                            style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 1.25rem; border: none; background: ${isOpen ? "var(--p-surface-50)" : "var(--p-surface-0)"}; color: var(--p-text-color); font-weight: 600; font-size: 0.875rem; cursor: ${tab.disabled ? "not-allowed" : "pointer"}; text-align: left; transition: background 0.15s ease;">
                        <span style="display: flex; align-items: center; gap: 0.5rem;">
                            ${iconText ? `<span>${iconText}</span>` : ""}
                            <span>${headerText}</span>
                        </span>
                        <span class="chevron-icon" style="color: var(--p-text-muted); display: flex; align-items: center; transition: transform 0.25s cubic-bezier(0.2, 0, 0, 1); transform: rotate(${isOpen ? "180deg" : "0deg"});">
                            ${LucideIcons.chevronDown}
                        </span>
                    </button>
                    <div class="accordion-content" style="display: ${isOpen ? "block" : "none"}; padding: 1.25rem; border-top: 1px solid var(--p-border-color); font-size: 0.875rem; color: var(--p-text-muted); line-height: 1.6; background: var(--p-surface-0);">
                        <div class="tab-slot" data-slot-index="${idx}">${contentText}</div>
                    </div>
                </div>
            `;
    }).join("");
    container.innerHTML = `
            <div class="laughtale-accordion" style="width: 100%;">
                ${tabHtml}
            </div>
        `;
    bindEvents();
  }
  function toggleTab(idx) {
    if (!props.multiple) {
      tabs.forEach((_, otherIdx) => {
        if (otherIdx !== idx) disclosures[otherIdx]?.close();
      });
    }
    disclosures[idx]?.toggle();
    updateDOM();
  }
  function updateDOM() {
    container.querySelectorAll(".accordion-tab").forEach((tabEl) => {
      const idx = Number(tabEl.getAttribute("data-idx"));
      const isOpen = disclosures[idx]?.isOpen ?? false;
      const contentEl = tabEl.querySelector(".accordion-content");
      const chevronEl = tabEl.querySelector(".chevron-icon");
      const headerBtn = tabEl.querySelector(".accordion-header-btn");
      tabEl.classList.toggle("tab-open", isOpen);
      headerBtn.style.background = isOpen ? "var(--p-surface-50)" : "var(--p-surface-0)";
      chevronEl.style.transform = `rotate(${isOpen ? "180deg" : "0deg"})`;
      const transition = useTransition(contentEl, { preset: "collapse" });
      if (isOpen) {
        transition.enter();
      } else {
        contentEl.style.display = "none";
        transition.exit();
      }
    });
    const activeList = tabs.map((_, idx) => idx).filter((idx) => disclosures[idx]?.isOpen);
    container.dispatchEvent(new CustomEvent("accordion:change", {
      bubbles: true,
      detail: { activeIndex: activeList }
    }));
  }
  function bindEvents() {
    container.querySelectorAll(".accordion-header-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-idx"));
        toggleTab(idx);
      });
    });
  }
  render();
}
export {
  AccordionIsland as default
};
//# sourceMappingURL=accordion-HG5TYRA4.js.map
