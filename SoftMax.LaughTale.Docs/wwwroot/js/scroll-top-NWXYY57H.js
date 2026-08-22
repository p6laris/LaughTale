import {
  LucideIcons
} from "./chunk-QV6AVE4Z.js";

// ../SoftMax.LaughTale.Client/src/components/scroll-top.ts
function ScrollTopIsland(container, props) {
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
//# sourceMappingURL=scroll-top-NWXYY57H.js.map
