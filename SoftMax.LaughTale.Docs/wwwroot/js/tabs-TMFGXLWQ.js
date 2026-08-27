import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/tabs.ts
var TABS_CSS = `
.p-tabs {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
}

.p-tablist {
    display: flex;
    position: relative;
    background: transparent;
    border-bottom: 1px solid var(--p-surface-200, #e2e8f0);
    box-sizing: border-box;
    align-items: center;
    width: 100%;
    overflow: hidden;
}

.p-tablist-content {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    position: relative;
    flex: 1 1 auto;
    scroll-behavior: smooth;
}
.p-tablist-content::-webkit-scrollbar {
    display: none;
}

.p-tablist-tab-list {
    display: flex;
    position: relative;
    margin: 0;
    padding: 0;
    list-style-type: none;
    gap: 0;
    width: auto;
}

.p-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.125rem;
    border: none;
    background: transparent;
    color: var(--p-surface-500, #64748b);
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    text-decoration: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: color 0.15s ease, border-color 0.15s ease;
    outline: none;
    user-select: none;
    position: relative;
    z-index: 2;
    white-space: nowrap;
}

.p-tab:hover:not(.p-tab-active):not(:disabled):not([aria-disabled="true"]) {
    color: var(--p-surface-800, #1e293b);
}

.p-tab-active {
    color: var(--p-primary-600, #059669);
    border-bottom-color: var(--p-primary-500, #10b981);
    font-weight: 700;
}

.p-tab:disabled,
.p-tab[aria-disabled="true"] {
    opacity: 0.35;
    cursor: not-allowed;
}

.p-tab:focus-visible {
    outline: 2px solid var(--p-primary-500, #10b981);
    outline-offset: -2px;
}

/* Active indicator bar */
.p-tablist-active-bar {
    position: absolute;
    bottom: -1px;
    height: 2px;
    background: var(--p-primary-500, #10b981);
    transition: left 0.2s cubic-bezier(0.2, 0, 0, 1), width 0.2s cubic-bezier(0.2, 0, 0, 1);
    z-index: 3;
    pointer-events: none;
}

/* Smooth Gradient Fade Mask Navigation Buttons */
.p-tablist-prev-button,
.p-tablist-next-button {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 3.5rem;
    display: flex;
    align-items: center;
    border: none;
    cursor: pointer;
    z-index: 10;
    transition: opacity 0.25s ease, color 0.15s ease;
    outline: none;
    color: var(--p-surface-600, #475569);
    padding: 0;
    box-shadow: none;
}

.p-tablist-prev-button {
    left: 0;
    justify-content: flex-start;
    padding-left: 0.5rem;
    background: linear-gradient(to right, var(--p-surface-50, #f8fafc) 35%, rgba(248, 250, 252, 0.7) 65%, transparent 100%);
}

.p-tablist-next-button {
    right: 0;
    justify-content: flex-end;
    padding-right: 0.5rem;
    background: linear-gradient(to left, var(--p-surface-50, #f8fafc) 35%, rgba(248, 250, 252, 0.7) 65%, transparent 100%);
}

.p-tablist-prev-button:hover:not(:disabled),
.p-tablist-next-button:hover:not(:disabled) {
    color: var(--p-text-color, #0f172a);
}

.p-tablist-prev-button:disabled,
.p-tablist-next-button:disabled {
    opacity: 0;
    pointer-events: none;
}

/* Tab Panels */
.p-tabpanels {
    padding: 1.25rem 0;
    width: 100%;
    box-sizing: border-box;
}

.p-tabpanel {
    display: none;
    width: 100%;
}
.p-tabpanel.p-tabpanel-active {
    display: block;
    animation: p-tabpanel-fadein 0.2s cubic-bezier(0.2, 0, 0, 1);
}

@keyframes p-tabpanel-fadein {
    from { opacity: 0; transform: translateY(2px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Custom Capsule Indicator */
.p-tablist-capsule {
    border-bottom: none;
    background: var(--p-surface-100, #f1f5f9);
    padding: 0.25rem;
    border-radius: var(--p-border-radius-md, 6px);
    width: fit-content;
}
.p-tablist-capsule .p-tablist-active-bar {
    display: none;
}
.p-tablist-capsule .p-tab {
    border-bottom: none;
    margin-bottom: 0;
    border-radius: var(--p-border-radius-sm, 4px);
    padding: 0.5rem 1rem;
    color: var(--p-surface-600, #475569);
}
.p-tablist-capsule .p-tab-active {
    background: var(--p-surface-0, #ffffff);
    color: var(--p-text-color, #0f172a);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Dark Mode Tokens */
.dark .p-tablist,
[data-theme="dark"] .p-tablist {
    border-bottom-color: var(--p-surface-700, #334155);
}
.dark .p-tab,
[data-theme="dark"] .p-tab {
    color: var(--p-surface-400, #94a3b8);
}
.dark .p-tab:hover:not(.p-tab-active):not(:disabled):not([aria-disabled="true"]),
[data-theme="dark"] .p-tab:hover:not(.p-tab-active):not(:disabled):not([aria-disabled="true"]) {
    color: var(--p-surface-100, #f8fafc);
}
.dark .p-tab-active,
[data-theme="dark"] .p-tab-active {
    color: var(--p-primary-400, #34d399);
    border-bottom-color: var(--p-primary-400, #34d399);
}
.dark .p-tablist-active-bar,
[data-theme="dark"] .p-tablist-active-bar {
    background: var(--p-primary-400, #34d399);
}
.dark .p-tablist-prev-button,
[data-theme="dark"] .p-tablist-prev-button {
    background: linear-gradient(to right, var(--p-surface-900, #0f172a) 35%, rgba(15, 23, 42, 0.7) 65%, transparent 100%);
    color: var(--p-surface-400, #94a3b8);
}
.dark .p-tablist-next-button,
[data-theme="dark"] .p-tablist-next-button {
    background: linear-gradient(to left, var(--p-surface-900, #0f172a) 35%, rgba(15, 23, 42, 0.7) 65%, transparent 100%);
    color: var(--p-surface-400, #94a3b8);
}
.dark .p-tablist-prev-button:hover:not(:disabled),
.dark .p-tablist-next-button:hover:not(:disabled),
[data-theme="dark"] .p-tablist-prev-button:hover:not(:disabled),
[data-theme="dark"] .p-tablist-next-button:hover:not(:disabled) {
    color: #ffffff;
}
.dark .p-tablist-capsule,
[data-theme="dark"] .p-tablist-capsule {
    background: var(--p-surface-800, #1e293b);
}
.dark .p-tablist-capsule .p-tab-active,
[data-theme="dark"] .p-tablist-capsule .p-tab-active {
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-0, #f8fafc);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
`;
var CHEVRON_LEFT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
var CHEVRON_RIGHT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
function TabsIsland(container, props) {
  injectIslandStyle("tabs", TABS_CSS);
  const rootEl = container.querySelector(".p-tabs") || container;
  rootEl.classList.add("p-tabs", "p-component");
  const isScrollable = !!props.scrollable || rootEl.hasAttribute("data-scrollable");
  const selectOnFocus = !!props.selectOnFocus || rootEl.hasAttribute("data-select-on-focus");
  const isLazy = !!props.lazy || rootEl.hasAttribute("data-lazy");
  let activeValue = String(props.value || rootEl.getAttribute("data-value") || "");
  const tabList = rootEl.querySelector(".p-tablist");
  const tabPanels = rootEl.querySelector(".p-tabpanels");
  if (!tabList) return;
  let contentContainer = tabList.querySelector(".p-tablist-content");
  if (!contentContainer) {
    contentContainer = document.createElement("div");
    contentContainer.className = "p-tablist-content";
    let tabUl = tabList.querySelector(".p-tablist-tab-list, ul");
    if (!tabUl) {
      tabUl = document.createElement("ul");
      tabUl.className = "p-tablist-tab-list";
      const directTabs = Array.from(tabList.querySelectorAll(":scope > .p-tab, :scope > [data-tab-value]"));
      directTabs.forEach((t) => tabUl.appendChild(t));
    } else {
      tabUl.classList.add("p-tablist-tab-list");
    }
    contentContainer.appendChild(tabUl);
    tabList.appendChild(contentContainer);
  }
  const tabsListWrapper = contentContainer.querySelector(".p-tablist-tab-list, ul") || contentContainer;
  let activeBar = contentContainer.querySelector(".p-tablist-active-bar");
  const isCapsule = tabList.classList.contains("p-tablist-capsule");
  if (!activeBar && !isCapsule) {
    activeBar = document.createElement("div");
    activeBar.className = "p-tablist-active-bar";
    contentContainer.appendChild(activeBar);
  }
  function getTabs() {
    return Array.from(tabsListWrapper.querySelectorAll(".p-tab, [data-tab-value]"));
  }
  function getPanels() {
    return Array.from(tabPanels ? tabPanels.querySelectorAll(":scope > .p-tabpanel, .p-tabpanel") : []);
  }
  const allTabs = getTabs();
  if (!activeValue && allTabs.length > 0) {
    activeValue = allTabs[0].getAttribute("data-value") || allTabs[0].getAttribute("value") || "0";
  }
  function updateActiveBar(targetTab) {
    if (!activeBar || isCapsule) return;
    if (!targetTab) {
      activeBar.style.width = "0px";
      return;
    }
    const left = targetTab.offsetLeft;
    const width = targetTab.offsetWidth;
    activeBar.style.left = `${left}px`;
    activeBar.style.width = `${width}px`;
  }
  function update() {
    const tabs = getTabs();
    const panels = getPanels();
    let activeTabEl = null;
    tabs.forEach((tab) => {
      const val = tab.getAttribute("data-value") || tab.getAttribute("value");
      const isActive = val === activeValue;
      tab.classList.toggle("p-tab-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
      if (isActive) {
        activeTabEl = tab;
      }
    });
    panels.forEach((panel) => {
      const val = panel.getAttribute("data-value") || panel.getAttribute("value");
      const isActive = val === activeValue;
      panel.classList.toggle("p-tabpanel-active", isActive);
    });
    rootEl.setAttribute("data-value", activeValue);
    updateActiveBar(activeTabEl);
    if (isScrollable && activeTabEl && contentContainer) {
      const containerLeft = contentContainer.scrollLeft;
      const containerRight = containerLeft + contentContainer.clientWidth;
      const tabLeft = activeTabEl.offsetLeft;
      const tabRight = tabLeft + activeTabEl.offsetWidth;
      if (tabLeft < containerLeft) {
        contentContainer.scrollTo({ left: tabLeft - 40, behavior: "smooth" });
      } else if (tabRight > containerRight) {
        contentContainer.scrollTo({ left: tabRight - contentContainer.clientWidth + 40, behavior: "smooth" });
      }
    }
  }
  function setActiveTab(value) {
    const targetTab = getTabs().find((t) => (t.getAttribute("data-value") || t.getAttribute("value")) === value);
    if (targetTab && (targetTab.hasAttribute("disabled") || targetTab.getAttribute("aria-disabled") === "true")) {
      return;
    }
    activeValue = value;
    update();
    container.dispatchEvent(new CustomEvent("tabs:change", {
      bubbles: true,
      detail: { value: activeValue }
    }));
  }
  allTabs.forEach((tab, idx) => {
    const val = tab.getAttribute("data-value") || tab.getAttribute("value") || String(idx);
    const isDisabled = tab.hasAttribute("disabled") || tab.getAttribute("aria-disabled") === "true";
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      if (isDisabled) return;
      setActiveTab(val);
    });
    if (selectOnFocus) {
      tab.addEventListener("focus", () => {
        if (!isDisabled) setActiveTab(val);
      });
    }
    tab.addEventListener("keydown", (e) => {
      const tabs = getTabs().filter((t) => !t.hasAttribute("disabled") && t.getAttribute("aria-disabled") !== "true");
      const currentIdx = tabs.indexOf(tab);
      if (currentIdx === -1) return;
      let nextIdx = -1;
      if (e.key === "ArrowRight") {
        nextIdx = (currentIdx + 1) % tabs.length;
      } else if (e.key === "ArrowLeft") {
        nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        nextIdx = 0;
      } else if (e.key === "End") {
        nextIdx = tabs.length - 1;
      }
      if (nextIdx !== -1) {
        e.preventDefault();
        const nextTab = tabs[nextIdx];
        nextTab.focus();
        const nextVal = nextTab.getAttribute("data-value") || nextTab.getAttribute("value") || String(nextIdx);
        setActiveTab(nextVal);
      }
    });
  });
  if (isScrollable && contentContainer) {
    let checkScrollButtons2 = function() {
      if (!contentContainer || !prevBtn || !nextBtn) return;
      const { scrollLeft, scrollWidth, clientWidth } = contentContainer;
      prevBtn.disabled = scrollLeft <= 4;
      nextBtn.disabled = scrollLeft + clientWidth >= scrollWidth - 4;
    };
    var checkScrollButtons = checkScrollButtons2;
    let prevBtn = tabList.querySelector(".p-tablist-prev-button");
    let nextBtn = tabList.querySelector(".p-tablist-next-button");
    if (!prevBtn) {
      prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.className = "p-tablist-prev-button";
      prevBtn.setAttribute("aria-label", "Previous Tab");
      prevBtn.innerHTML = CHEVRON_LEFT_SVG;
      tabList.insertBefore(prevBtn, contentContainer);
    }
    if (!nextBtn) {
      nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "p-tablist-next-button";
      nextBtn.setAttribute("aria-label", "Next Tab");
      nextBtn.innerHTML = CHEVRON_RIGHT_SVG;
      tabList.appendChild(nextBtn);
    }
    prevBtn.addEventListener("click", () => {
      contentContainer?.scrollBy({ left: -220, behavior: "smooth" });
    });
    nextBtn.addEventListener("click", () => {
      contentContainer?.scrollBy({ left: 220, behavior: "smooth" });
    });
    contentContainer.addEventListener("scroll", checkScrollButtons2);
    setTimeout(checkScrollButtons2, 50);
    window.addEventListener("resize", checkScrollButtons2);
  }
  const demoCard = container.closest("[data-tabs-demo]") || container.parentElement;
  if (demoCard) {
    demoCard.querySelectorAll(":scope > * [data-tabs-target], :scope > [data-tabs-target]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const targetTab = btn.getAttribute("data-tabs-target");
        if (targetTab) setActiveTab(targetTab);
      });
    });
  }
  setTimeout(update, 50);
  window.addEventListener("resize", () => {
    const tabs = getTabs();
    const activeTabEl = tabs.find((t) => (t.getAttribute("data-value") || t.getAttribute("value")) === activeValue);
    updateActiveBar(activeTabEl || null);
  });
}
export {
  TabsIsland as default
};
//# sourceMappingURL=tabs-TMFGXLWQ.js.map
