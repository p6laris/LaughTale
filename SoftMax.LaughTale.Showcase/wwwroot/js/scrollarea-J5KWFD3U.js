import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/scrollarea.ts
var SCROLLAREA_CSS = `
.p-scrollarea {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
}

.p-scrollarea-viewport {
    width: 100%;
    height: 100%;
    overflow: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
    box-sizing: border-box;
    outline: none;
}
.p-scrollarea-viewport::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
    width: 0;
    height: 0;
}

.p-scrollarea-content {
    min-width: 100%;
    box-sizing: border-box;
}

/* Scrollbars */
.p-scrollarea-scrollbar {
    display: flex;
    user-select: none;
    touch-action: none;
    padding: 2px;
    background: transparent;
    transition: opacity 0.2s ease, background-color 0.15s ease;
    position: absolute;
    z-index: 10;
    box-sizing: border-box;
}
.p-scrollarea-scrollbar-vertical {
    top: 0;
    right: 0;
    bottom: 0;
    width: 9px;
}
.p-scrollarea-scrollbar-horizontal {
    left: 0;
    bottom: 0;
    right: 0;
    height: 9px;
    flex-direction: column;
}
.p-scrollarea-corner {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 9px;
    height: 9px;
    background: transparent;
}

.p-scrollarea-handle {
    flex: 1;
    background: var(--p-surface-300, #cbd5e1);
    border-radius: 9999px;
    position: relative;
    transition: background-color 0.15s ease, transform 0.15s ease;
    cursor: pointer;
}
.p-scrollarea-handle:hover {
    background: var(--p-surface-400, #94a3b8);
}
.p-scrollarea-handle:active {
    background: var(--p-surface-500, #64748b);
}

/* Mask / Fade */
.p-scrollarea-mask .p-scrollarea-viewport {
    mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
}

/* Variants */
.p-scrollarea[data-p-variant="hover"] .p-scrollarea-scrollbar {
    opacity: 0;
}
.p-scrollarea[data-p-variant="hover"]:hover .p-scrollarea-scrollbar {
    opacity: 1;
}

.p-scrollarea[data-p-variant="scroll"] .p-scrollarea-scrollbar {
    opacity: 0;
}
.p-scrollarea[data-p-variant="scroll"].p-scrollarea-scrolling .p-scrollarea-scrollbar {
    opacity: 1;
}

.p-scrollarea[data-p-variant="always"] .p-scrollarea-scrollbar {
    opacity: 1;
}

.p-scrollarea[data-p-variant="hidden"] .p-scrollarea-scrollbar {
    display: none !important;
}

/* Dark Mode Tokens */
.dark .p-scrollarea-handle,
[data-theme="dark"] .p-scrollarea-handle {
    background: var(--p-surface-700, #334155) !important;
}
.dark .p-scrollarea-handle:hover,
[data-theme="dark"] .p-scrollarea-handle:hover {
    background: var(--p-surface-600, #475569) !important;
}
.dark .p-scrollarea-handle:active,
[data-theme="dark"] .p-scrollarea-handle:active {
    background: var(--p-surface-500, #64748b) !important;
}
`;
function ScrollAreaIsland(container, props) {
  injectIslandStyle("scrollarea", SCROLLAREA_CSS);
  const rootEl = container.querySelector(".p-scrollarea") || container;
  const viewport = rootEl.querySelector(".p-scrollarea-viewport");
  if (!viewport) return;
  const vBar = rootEl.querySelector(".p-scrollarea-scrollbar-vertical");
  const vHandle = vBar?.querySelector(".p-scrollarea-handle");
  const hBar = rootEl.querySelector(".p-scrollarea-scrollbar-horizontal");
  const hHandle = hBar?.querySelector(".p-scrollarea-handle");
  let scrollTimeout = null;
  function updateScrollbars() {
    if (!viewport) return;
    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = viewport;
    if (vBar && vHandle) {
      const hasVerticalScroll = scrollHeight > clientHeight;
      vBar.style.display = hasVerticalScroll ? "flex" : "none";
      if (hasVerticalScroll) {
        const handleHeight = Math.max(clientHeight / scrollHeight * clientHeight, 20);
        const handleTop = scrollTop / (scrollHeight - clientHeight) * (clientHeight - handleHeight);
        vHandle.style.height = `${handleHeight}px`;
        vHandle.style.transform = `translateY(${handleTop}px)`;
      }
    }
    if (hBar && hHandle) {
      const hasHorizontalScroll = scrollWidth > clientWidth;
      hBar.style.display = hasHorizontalScroll ? "flex" : "none";
      if (hasHorizontalScroll) {
        const handleWidth = Math.max(clientWidth / scrollWidth * clientWidth, 20);
        const handleLeft = scrollLeft / (scrollWidth - clientWidth) * (clientWidth - handleWidth);
        hHandle.style.width = `${handleWidth}px`;
        hHandle.style.transform = `translateX(${handleLeft}px)`;
      }
    }
  }
  viewport.addEventListener("scroll", () => {
    updateScrollbars();
    rootEl.classList.add("p-scrollarea-scrolling");
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      rootEl.classList.remove("p-scrollarea-scrolling");
    }, 1e3);
  });
  if (vBar && vHandle) {
    let isDragging = false;
    let startY = 0;
    let startScrollTop = 0;
    vHandle.addEventListener("pointerdown", (e) => {
      isDragging = true;
      startY = e.clientY;
      startScrollTop = viewport.scrollTop;
      vHandle.setPointerCapture(e.pointerId);
      document.body.style.userSelect = "none";
    });
    vHandle.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const deltaY = e.clientY - startY;
      const scrollRatio = (viewport.scrollHeight - viewport.clientHeight) / (viewport.clientHeight - vHandle.offsetHeight);
      viewport.scrollTop = startScrollTop + deltaY * scrollRatio;
    });
    const stopDrag = (e) => {
      if (isDragging) {
        isDragging = false;
        try {
          vHandle.releasePointerCapture(e.pointerId);
        } catch (_) {
        }
        document.body.style.userSelect = "";
      }
    };
    vHandle.addEventListener("pointerup", stopDrag);
    vHandle.addEventListener("pointercancel", stopDrag);
  }
  if (hBar && hHandle) {
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    hHandle.addEventListener("pointerdown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startScrollLeft = viewport.scrollLeft;
      hHandle.setPointerCapture(e.pointerId);
      document.body.style.userSelect = "none";
    });
    hHandle.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const scrollRatio = (viewport.scrollWidth - viewport.clientWidth) / (viewport.clientWidth - hHandle.offsetWidth);
      viewport.scrollLeft = startScrollLeft + deltaX * scrollRatio;
    });
    const stopDrag = (e) => {
      if (isDragging) {
        isDragging = false;
        try {
          hHandle.releasePointerCapture(e.pointerId);
        } catch (_) {
        }
        document.body.style.userSelect = "";
      }
    };
    hHandle.addEventListener("pointerup", stopDrag);
    hHandle.addEventListener("pointercancel", stopDrag);
  }
  const variantButtons = container.querySelectorAll("[data-scrollarea-variant]");
  if (variantButtons.length > 0) {
    variantButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedVariant = btn.getAttribute("data-scrollarea-variant") || "auto";
        rootEl.setAttribute("data-p-variant", selectedVariant);
        variantButtons.forEach((b) => b.classList.remove("p-highlight"));
        btn.classList.add("p-highlight");
        updateScrollbars();
      });
    });
  }
  const resizeObserver = new ResizeObserver(() => {
    updateScrollbars();
  });
  resizeObserver.observe(viewport);
  if (viewport.firstElementChild) {
    resizeObserver.observe(viewport.firstElementChild);
  }
  setTimeout(updateScrollbars, 50);
}
export {
  ScrollAreaIsland as default
};
//# sourceMappingURL=scrollarea-J5KWFD3U.js.map
