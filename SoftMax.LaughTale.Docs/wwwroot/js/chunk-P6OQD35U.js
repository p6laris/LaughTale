// ../SoftMax.LaughTale.Client/src/composables/animation/useAutoAnimate.ts
function useAutoAnimate(parent, options = {}) {
  if (!parent || typeof window === "undefined" || typeof MutationObserver === "undefined") {
    return { destroy: () => {
    } };
  }
  const duration = options.duration ?? 250;
  const easing = options.easing ?? "cubic-bezier(0.2, 0, 0, 1)";
  const prevRects = /* @__PURE__ */ new Map();
  function recordRects() {
    prevRects.clear();
    Array.from(parent.children).forEach((child) => {
      prevRects.set(child, child.getBoundingClientRect());
    });
  }
  function animate() {
    const currentChildren = Array.from(parent.children);
    currentChildren.forEach((child) => {
      const first = prevRects.get(child);
      const last = child.getBoundingClientRect();
      if (first) {
        const deltaX = first.left - last.left;
        const deltaY = first.top - last.top;
        if (deltaX !== 0 || deltaY !== 0) {
          child.animate([
            { transform: `translate(${deltaX}px, ${deltaY}px)` },
            { transform: "none" }
          ], {
            duration,
            easing
          });
        }
      } else {
        child.animate([
          { opacity: 0, transform: "scale(0.95)" },
          { opacity: 1, transform: "none" }
        ], {
          duration,
          easing
        });
      }
    });
  }
  recordRects();
  const observer = new MutationObserver(() => {
    animate();
    recordRects();
  });
  observer.observe(parent, { childList: true });
  return {
    destroy: () => {
      observer.disconnect();
      prevRects.clear();
    }
  };
}

export {
  useAutoAnimate
};
//# sourceMappingURL=chunk-P6OQD35U.js.map
