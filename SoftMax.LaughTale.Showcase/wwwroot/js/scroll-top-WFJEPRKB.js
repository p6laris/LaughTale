import {
  LucideIcons
} from "./chunk-XHF3KYSF.js";
import {
  injectIslandStyle
} from "./chunk-3TFPN5JM.js";

// ../SoftMax.LaughTale.Client/src/components/scroll-top.ts
var CSS = `
[data-theme="dark"] .laughtale-scroll-top-btn {
    background: var(--p-surface-900) !important;
    color: var(--p-surface-100) !important;
    border-color: var(--p-surface-700) !important;
}
`;
function ScrollTopIsland(container, props) {
  injectIslandStyle("scroll-top", CSS);
  const threshold = props.threshold || 200;
  let isVisible = false;
  function render() {
    container.innerHTML = `
            <button type="button" 
                    class="laughtale-scroll-top-btn" 
                    style="display: ${isVisible ? "flex" : "none"}; position: fixed; bottom: 2rem; right: 2rem; z-index: 999; width: 2.75rem; height: 2.75rem; border-radius: 50%; border: none; background: var(--p-primary-600); color: #ffffff; box-shadow: var(--p-shadow-lg); cursor: pointer; align-items: center; justify-content: center; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); animation: fadeIn 0.2s ease;" 
                    title="Scroll to Top">
                ${LucideIcons.arrowUp}
            </button>
        `;
    container.querySelector(".laughtale-scroll-top-btn")?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: props.behavior || "smooth" });
    });
  }
  const checkScroll = () => {
    const scrolled = window.scrollY > threshold;
    if (scrolled !== isVisible) {
      isVisible = scrolled;
      render();
    }
  };
  window.addEventListener("scroll", checkScroll, { passive: true });
  render();
}
export {
  ScrollTopIsland as default
};
//# sourceMappingURL=scroll-top-WFJEPRKB.js.map
