// ../SoftMax.LaughTale.Client/src/composables/animation/useStagger.ts
function useStagger(elements, options = {}) {
  const staggerMs = options.staggerMs ?? 40;
  const initialDelay = options.initialDelay ?? 0;
  const duration = options.duration ?? 250;
  const easing = options.easing ?? "cubic-bezier(0.16, 1, 0.3, 1)";
  const list = Array.from(elements);
  list.forEach((el, index) => {
    const delay = initialDelay + index * staggerMs;
    el.style.opacity = "0";
    el.style.transform = "translateY(8px)";
    el.style.transition = `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    });
  });
}

export {
  useStagger
};
//# sourceMappingURL=chunk-VDYWG2PC.js.map
