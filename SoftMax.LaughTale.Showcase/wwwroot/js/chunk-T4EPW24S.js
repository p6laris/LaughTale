// ../SoftMax.LaughTale.Client/src/composables/useClickOutside.ts
function useClickOutside(target, handler, options = {}) {
  if (!target || typeof document === "undefined") return { destroy: () => {
  } };
  function listener(e) {
    const path = e.composedPath ? e.composedPath() : [];
    const clickedNode = e.target;
    if (target && (target === clickedNode || target.contains(clickedNode) || path.includes(target))) {
      return;
    }
    if (options.ignoreElements) {
      for (const el of options.ignoreElements) {
        if (el && (el === clickedNode || el.contains(clickedNode) || path.includes(el))) {
          return;
        }
      }
    }
    handler(e);
  }
  const capture = options.capture ?? false;
  document.addEventListener("pointerdown", listener, { capture });
  document.addEventListener("touchstart", listener, { capture });
  return {
    destroy: () => {
      document.removeEventListener("pointerdown", listener, { capture });
      document.removeEventListener("touchstart", listener, { capture });
    }
  };
}

export {
  useClickOutside
};
//# sourceMappingURL=chunk-T4EPW24S.js.map
