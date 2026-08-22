// ../SoftMax.LaughTale.Client/src/composables/useDebounce.ts
function useDebounce(fn, delayMs = 250) {
  let timer = null;
  const debounced = (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delayMs);
  };
  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  debounced.flush = (...args) => {
    debounced.cancel();
    fn(...args);
  };
  return debounced;
}

// ../SoftMax.LaughTale.Client/src/composables/useKeyboardNav.ts
function useKeyboardNav(options) {
  let activeIndex = options.initialIndex ?? -1;
  const loop = options.loop ?? true;
  function handleKeyDown(e) {
    const count = options.itemCount();
    if (count === 0) return false;
    const isVertical = options.orientation !== "horizontal";
    const isHorizontal = options.orientation !== "vertical";
    if (isVertical && e.key === "ArrowDown" || isHorizontal && e.key === "ArrowRight") {
      e.preventDefault();
      if (activeIndex < count - 1) {
        activeIndex++;
      } else if (loop) {
        activeIndex = 0;
      }
      options.onHighlight?.(activeIndex);
      return true;
    }
    if (isVertical && e.key === "ArrowUp" || isHorizontal && e.key === "ArrowLeft") {
      e.preventDefault();
      if (activeIndex > 0) {
        activeIndex--;
      } else if (loop) {
        activeIndex = count - 1;
      }
      options.onHighlight?.(activeIndex);
      return true;
    }
    if (e.key === "Home") {
      e.preventDefault();
      activeIndex = 0;
      options.onHighlight?.(activeIndex);
      return true;
    }
    if (e.key === "End") {
      e.preventDefault();
      activeIndex = count - 1;
      options.onHighlight?.(activeIndex);
      return true;
    }
    if (e.key === "Enter" || e.key === " ") {
      if (activeIndex >= 0 && activeIndex < count) {
        e.preventDefault();
        options.onSelect?.(activeIndex);
        return true;
      }
    }
    if (e.key === "Escape") {
      options.onEscape?.();
      return true;
    }
    return false;
  }
  return {
    handleKeyDown,
    get activeIndex() {
      return activeIndex;
    },
    setActiveIndex: (idx) => {
      activeIndex = idx;
      options.onHighlight?.(activeIndex);
    },
    reset: () => {
      activeIndex = -1;
    }
  };
}

export {
  useDebounce,
  useKeyboardNav
};
//# sourceMappingURL=chunk-VIONAOB4.js.map
